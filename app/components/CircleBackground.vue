<template>
  <div :class="{ pulse }" class="side-shadow">
    <svg width="100%" :height="height" fill="none">
      <circle :r="height - 75" cx="50%" cy="-35%" :style="{ fill: fillColor.bottom, opacity: 1 }" />
      <circle :r="height - 90" cx="50%" cy="-24%" :style="{ fill: fillColor.bottom, opacity: .5 }" />
      <circle v-if="!reversed" ref="innerCircle" :r="height - 40" cx="50%" cy="-58%" :style="{ fill: fillColor.top }" />
      <!-- Indeterminate progress indicator border -->
      <circle v-if="pulse" class="progress-border indeterminate" :r="height + 25 + progressWidth / 2" cx="50%" cy="-60%"
        :stroke="progressColor" :stroke-width="progressWidth" fill="none"
        :stroke-dasharray="progressCircumference * 0.25 + ',' + progressCircumference * 0.20 + ',' + progressCircumference * 0.35" />
      <defs>
        <mask v-if="image" id="imageClip" width="500">
          <circle :r="height - 75" cx="50%" cy="-35%" fill="white" />
        </mask>
      </defs>
      <image v-if="image" id="image" x="0%" :width="imageWidth" mask="url(#imageClip)" :xlink:href="image"
        preserveAspectRatio="xMidYMid" />
    </svg>
  </div>
</template>
<script setup lang="ts">
const { color = ['white', '#eee'], height = 420, pulse = false, reversed, image, progressColor, progressWidth = 3 } = defineProps<{
  color?: string | string[],
  height?: number,
  pulse?: boolean,
  reversed?: boolean,
  image?: string,
  progressColor?: string,
  progressWidth?: number,
}>();

const imageLeft = ref<number>(0)
const imageWidth = ref<string>('100%')
const imageTop = ref<number>(0)
const innerCircle = ref<HTMLElement | null>(null)

const fillColor = computed(() => {
  const [top, bottom = top] = Array.isArray(color)
    ? color
    : color.split(/,\|/)
  return {
    top,
    bottom
  }
})

const progressCircumference = computed(() => 2 * Math.PI * (height - 110))

onMounted(() => {
  window.addEventListener('resize', resizeImage)
  resizeImage()
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeImage)
})

watch(() => image, () => {
  resizeImage()
})

function resizeImage() {
  if (image && innerCircle.value) {
    const { left, width } = innerCircle.value.getBoundingClientRect()
    imageLeft.value = left
    imageWidth.value = width + 'px'
    imageTop.value = innerCircle.value.getBoundingClientRect().top
  }
}
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
  background: linear-gradient(to right, #f9f9f9, transparent, #f9f9f9);
}
</style>
