<template>
  <div v-if="!prefersReducedMotion" ref="containerRef" :class="[className, 'silk-container', { 'silk-visible': mounted, 'safari': isSafari }]" :style="style"></div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { Renderer, Program, Mesh, Plane, Camera } from 'ogl';

interface SilkProps {
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
  className?: string;
  style?: CSSProperties;
  parallaxStrength?: number;
}

const props = withDefaults(defineProps<SilkProps>(), {
  speed: 5,
  scale: 1,
  color: '#7B7481',
  noiseIntensity: 1.5,
  rotation: 0,
  className: '',
  style: () => ({}),
  parallaxStrength: 0.10
});

const containerRef = ref<HTMLDivElement>();

const hexToNormalizedRGB = (hex: string): [number, number, number] => {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  return [r, g, b];
};

const vertexShader = `
attribute vec2 uv;
attribute vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec3 uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;
uniform float uScrollY;
uniform float uParallaxStrength;

const float e = 2.71828182845904523536;
const float PI = 3.14159265359;

// Improved noise function with better distribution
float noise(vec2 texCoord) {
  float G = e;
  vec2 r = (G * sin(G * texCoord.xy + texCoord.yx * 0.7));
  return fract(r.x * r.y * (1.0 + texCoord.x + texCoord.y * 0.5));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2 rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  // Apply noise with slight offset for better randomness
  float rnd = noise(gl_FragCoord.xy * 0.01);
  
  // Apply rotation to UVs
  vec2 uv = rotateUvs(vUv, uRotation);
  vec2 tex = uv * uScale;
  float tOffset = uSpeed * uTime;

  // Apply parallax effect based on scroll position
  float parallaxOffset = uScrollY * -uParallaxStrength;
  tex.y += parallaxOffset;
  
  // Create wave effect with slightly more organic movement
  float wave = sin(8.0 * tex.x - tOffset) * 0.03 + 
               sin(6.0 * tex.y - tOffset * 0.7) * 0.01;
  tex.y += wave;

  // Create more complex pattern with layered sine waves
  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                           sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  // Add subtle secondary pattern for more depth
  pattern += 0.05 * sin(30.0 * tex.x + 20.0 * tex.y + tOffset * 0.05);
  pattern = clamp(pattern, 0.0, 1.0); // Ensure pattern stays in valid range

  // Apply color with noise
  vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 150.0 * uNoiseIntensity;
  col.a = .5;
  gl_FragColor = col;
}
`;

let renderer: Renderer | null = null;
let mesh: Mesh | null = null;
let program: Program | null = null;
let camera: Camera | null = null;
let animateId = 0;

// For parallax effect
const scrollY = ref(0);
const targetScrollY = ref(0);
const scrollTransitionDuration = 1000; // milliseconds
let scrollTransitionStartTime = 0;
let isScrollTransitioning = false;

const mounted = ref(false);

// Safari detection
const isSafari = ref(false);

// For reduced motion preference
const prefersReducedMotion = ref(false);

// Define the event handler type
type MotionPreferenceChangeHandler = (event: MediaQueryListEvent) => void;
let handleMotionPreferenceChange: MotionPreferenceChangeHandler;

// Check for Safari browser
const checkSafari = () => {
  if (import.meta.client) {
    const userAgent = navigator.userAgent;
    isSafari.value = /^((?!chrome|android).)*safari/i.test(userAgent);
  }
};

// Check for reduced motion preference
const checkReducedMotion = () => {
  if (import.meta.client) {
    prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
};

// Initialize browser checks
if (import.meta.client) {
  checkSafari();
  checkReducedMotion();
}

const initSilk = () => {
  const container = containerRef.value;
  if (!container) return;

  renderer = new Renderer({
    alpha: true,
    antialias: true
  });

  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);
  gl.canvas.style.backgroundColor = 'transparent';

  camera = new Camera(gl, { fov: 75 });
  camera.position.z = 1;

  const resize = () => {
    if (!container || !camera) return;

    let width = container.offsetWidth;
    let height = container.offsetHeight;

    let parent = container.parentElement;
    while (parent && (!width || !height)) {
      if (parent.offsetWidth && parent.offsetHeight) {
        width = parent.offsetWidth;
        height = parent.offsetHeight;
        break;
      }
      parent = parent.parentElement;
    }

    if (!width || !height) {
      width = window.innerWidth;
      height = window.innerHeight;
    }

    width = Math.max(width, 300);
    height = Math.max(height, 300);

    renderer!.setSize(width, height);
    camera.perspective({ aspect: width / height });

    if (mesh) {
      const distance = camera.position.z;
      const fov = camera.fov * (Math.PI / 180);
      const height2 = 2 * Math.tan(fov / 2) * distance;
      const width2 = height2 * (width / height);

      mesh.scale.set(width2, height2, 1);
    }
  };

  window.addEventListener('resize', resize);

  const geometry = new Plane(gl, {
    width: 1,
    height: 1
  });

  const colorRGB = hexToNormalizedRGB(props.color);

  program = new Program(gl, {
    vertex: vertexShader,
    fragment: fragmentShader,
    uniforms: {
      uSpeed: { value: props.speed },
      uScale: { value: props.scale },
      uNoiseIntensity: { value: props.noiseIntensity },
      uColor: { value: colorRGB },
      uRotation: { value: props.rotation },
      uTime: { value: 0 },
      uScrollY: { value: 0 },
      uParallaxStrength: { value: props.parallaxStrength }
    }
  });

  mesh = new Mesh(gl, { geometry, program });
  container.appendChild(gl.canvas);

  gl.canvas.style.width = '100%';
  gl.canvas.style.height = '100%';
  gl.canvas.style.display = 'block';
  gl.canvas.style.position = 'absolute';
  gl.canvas.style.top = '0';
  gl.canvas.style.left = '0';
  gl.canvas.style.zIndex = '1';

  let lastTime = 0;
  const update = (t: number) => {
    animateId = requestAnimationFrame(update);
    const deltaTime = (t - lastTime) / 1000;
    lastTime = t;

    // Handle scroll transition
    if (isScrollTransitioning) {
      const elapsed = t - scrollTransitionStartTime;
      const progress = Math.min(elapsed / scrollTransitionDuration, 1);

      // Ease function (cubic ease-out)
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      if (progress < 1) {
        // Interpolate between current and target scroll positions
        scrollY.value = scrollY.value + (targetScrollY.value - scrollY.value) * easeProgress;
      } else {
        // Transition complete
        scrollY.value = targetScrollY.value;
        isScrollTransitioning = false;
      }
    }

    if (program && mesh && camera) {
      program.uniforms.uTime.value += 0.1 * deltaTime;
      program.uniforms.uSpeed.value = props.speed;
      program.uniforms.uScale.value = props.scale;
      program.uniforms.uNoiseIntensity.value = props.noiseIntensity;
      program.uniforms.uColor.value = hexToNormalizedRGB(props.color);
      program.uniforms.uRotation.value = props.rotation;
      program.uniforms.uScrollY.value = scrollY.value;
      program.uniforms.uParallaxStrength.value = props.parallaxStrength;
      renderer!.render({ scene: mesh, camera });
    }
  };
  animateId = requestAnimationFrame(update);

  resize();

  mounted.value = true;

  return () => {
    cancelAnimationFrame(animateId);
    window.removeEventListener('resize', resize);
    if (container && gl.canvas.parentNode === container) {
      container.removeChild(gl.canvas);
    }
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
};

const cleanup = () => {
  if (animateId) {
    cancelAnimationFrame(animateId);
  }
  if (renderer) {
    const gl = renderer.gl;
    const container = containerRef.value;
    if (container && gl.canvas.parentNode === container) {
      container.removeChild(gl.canvas);
    }
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  }
  renderer = null;
  mesh = null;
  camera = null;
  program = null;
};

// Function to update scroll position
const updateScrollPosition = () => {
  if (import.meta.client) {
    const newScrollY = window.scrollY / window.innerHeight; // Normalize by viewport height

    // Only transition if there's a significant change
    if (Math.abs(newScrollY - targetScrollY.value) > 0.01) {
      targetScrollY.value = newScrollY;
      scrollTransitionStartTime = performance.now();
      isScrollTransitioning = true;
    }
  }
};

onMounted(() => {
  // Only initialize if animations are not reduced
  if (!prefersReducedMotion.value) {
    initSilk();

    if (import.meta.client) {
      // Initialize with current scroll position
      scrollY.value = window.scrollY / window.innerHeight;
      targetScrollY.value = scrollY.value;

      // Add scroll event listener
      window.addEventListener('scroll', updateScrollPosition, { passive: true });
      
      // Listen for changes to reduced motion preference
      const mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)');
      handleMotionPreferenceChange = (event: MediaQueryListEvent) => {
        prefersReducedMotion.value = event.matches;
        
        if (event.matches && renderer) {
          // Clean up if user switches to reduced motion
          cleanup();
        } else if (!event.matches && !renderer) {
          // Reinitialize if user switches back
          initSilk();
        }
      };
      
      mediaQueryList.addEventListener('change', handleMotionPreferenceChange);
    }
  }
  
  // Always set mounted to true for CSS transitions
  mounted.value = true;
});

onUnmounted(() => {
  cleanup();

  if (import.meta.client) {
    // Remove scroll event listener
    window.removeEventListener('scroll', updateScrollPosition);
    
    // Remove media query listener
    const mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQueryList.removeEventListener('change', handleMotionPreferenceChange);
  }
});
</script>

<style scoped>
.silk-container {
  width: 100%;
  height: 100%;
  min-height: 100%;
  display: block;
  opacity: 0;
  transition: opacity 800ms ease-out;
}

.silk-visible {
  opacity: .4;
}

:deep(canvas) {
  width: 100%;
  height: 100%;
  min-height: 100%;
  display: block;
  object-fit: cover;
}

/* Safari-specific opacity */
.safari :deep(canvas) {
  opacity: 0.2;
}

@media (prefers-reduced-motion: reduce) {
  .silk-container {
    transition: opacity 100ms ease-out;
  }
}
</style>
