<template>
  <div :class="{ pulse }" class="side-shadow">
    <ClientOnly>
      <svg width="100%" :height="height" fill="none">
        <defs>
          <mask id="insideClip">
            <circle :r="height - 90" cx="50%" cy="-24%" fill="white" />
            <circle :r="height - 40" cx="50%" cy="-58%" fill="black" />
          </mask>
          <mask id="imageClip">
            <circle :r="height - 40" cx="50%" cy="-58%" fill="white" />
          </mask>
        </defs>
        <circle :r="height - 75" cx="50%" cy="-35%" :style="{ fill: fillColor.bottom, opacity: 1 }"
          mask="url(#insideClip)" />
        <circle :r="height - 90" cx="50%" cy="-24%" :style="{ fill: fillColor.bottom, opacity: .5 }"
          mask="url(#insideClip)" />
        <circle v-if="!reversed" ref="innerCircle" :r="height - 40" cx="50%" cy="-58%"
          :style="{ fill: fillColor.top }" />
        <!-- Indeterminate progress indicator border -->
        <circle v-if="pulse" class="progress-border indeterminate" :r="height + 25 + progressWidth / 2" cx="50%"
          cy="-60%" :stroke="progressColor" :stroke-width="progressWidth" fill="none"
          :stroke-dasharray="progressCircumference * 0.25 + ',' + progressCircumference * 0.20 + ',' + progressCircumference * 0.35" />
        <image v-if="image" id="image" :x="(image?.nudge?.x || 0) + '%'" :y="(image?.nudge?.y || 0) + '%'" width="100%"
          mask="url(#imageClip)" :xlink:href="image.src" preserveAspectRatio="xMidYMid" />
      </svg>
    </ClientOnly>
  </div>
</template>
<script setup lang="ts">
const { color, height = 420, pulse = false, reversed, image, progressColor, progressWidth = 3 } = defineProps<{
  color?: string | string[],
  height?: number,
  pulse?: boolean,
  reversed?: boolean,
  image?: { src: string, nudge?: { y?: number, x?: number } },
  progressColor?: string,
  progressWidth?: number,
}>();

const mode = useColorMode()

const colors = computed(() => {
  if (color) {
    return color
  }
  return mode.preference === 'dark' ? ['transparent', '#666'] : ['transparent', '#eee']
})

const fillColor = computed(() => {
  const [top, bottom = top] = Array.isArray(colors.value)
    ? colors.value
    : colors.value.split(/,\|/)
  return {
    top,
    bottom
  }
})


const progressCircumference = computed(() => 2 * Math.PI * (height - 110))

</script>
<style scoped>
div {
  overflow: hidden;
  height: 300px;
  transform-origin: top center;
}

circle {
  transform-origin: 50% 0;
  transition: all 600ms linear;
}

.progress-border {
  transform-origin: 50% -60%;
  stroke-linecap: round;
  opacity: 0.5;
}

.indeterminate {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

#image {
  opacity: 0.8;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.8;
  }

  100% {
    opacity: 1;
  }
}

.pulse {
  animation: pulse 600ms alternate infinite ease-in-out;
}

.side-shadow {
  max-width: 700px;
  margin: 0 auto;
  position: relative;

  clip-path: ellipse(319px 100% at 50% -24%);
  backdrop-filter: blur(4px);
}

.side-shadow::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  z-index: 200;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, var(--primary-500), transparent, var(--primary-500));
}
</style>
