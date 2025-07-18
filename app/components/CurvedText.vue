<template>
  <div :class="{ alone, [`level-${titleLevel}`]: true }">
    <svg :width="width" fill="none" viewBox="0 0 500 100">
      <path id="curve" :d="path" />
      <defs>
        <radialGradient id="gradient" cx="50%" cy="50%" r="100%" fy="100%" fx="50%">
          <stop stop-color="white" offset="0%" />
          <stop stop-color="black" offset="65%" />
        </radialGradient>
        <mask id="mask">
          <rect x="0" y="10" width="100%" height="90%" fill="url(#gradient)" />
        </mask>
      </defs>
      <text text-anchor="middle" :class="{ 'tracking-wide': alone, 'text-3xl': alone }" mask="url(#mask)">
        <textPath ref="textPathRef" xlink:href="#curve" startOffset="50%" :fill="color">
          {{ text }}
          <animate v-if="marqueeAnimation" attributeName="startOffset" :values="startOffsetValues" :dur="duration + 's'"
            repeatCount="indefinite" />
        </textPath>
      </text>
    </svg>
    <component :is="'h' + titleLevel" :aria-label="text" class="sr-only">
      {{ text }}
    </component>
  </div>
</template>
<script setup lang="ts">
const {
  color = 'black',
  titleLevel = 1,
  alone = false,
  text,
  width = 500,
} = defineProps<{
  color?: string
  titleLevel?: number
  alone?: boolean
  text: string
  width?: number
}>()

const MIN_TEXT_LENGTH_FOR_MARQUEE = 25
const PIXELS_PER_SECOND = 20 // Consistent speed in pixels per second

const textPathRef = ref<SVGTextPathElement>()
const actualTextWidth = ref(0)

const pathLength = computed(() => {
  // For quadratic bezier curve M x1 y1 Q cx cy x2 y2
  // Approximate length using the control polygon method
  const x1 = 0, y1 = 0
  const cx = width / 2, cy = 170
  const x2 = width, y2 = 0

  const d1 = Math.sqrt((cx - x1) ** 2 + (cy - y1) ** 2)
  const d2 = Math.sqrt((x2 - cx) ** 2 + (y2 - cy) ** 2)
  const d3 = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

  return (d1 + d2 + d3) / 2
})

const marqueeAnimation = computed(() => {
  return text.length > MIN_TEXT_LENGTH_FOR_MARQUEE
})

onMounted(() => {
  nextTick(() => {
    if (textPathRef.value) {
      try {
        const bbox = textPathRef.value.getBBox()
        actualTextWidth.value = bbox.width
      } catch (e) {
        // Fallback to estimation if getBBox fails
        actualTextWidth.value = text.length * 0.6 * 16
      }
    }
  })
})

watch(() => text, () => {
  nextTick(() => {
    if (textPathRef.value) {
      try {
        const bbox = textPathRef.value.getBBox()
        actualTextWidth.value = bbox.width
      } catch (e) {
        // Fallback to estimation if getBBox fails
        actualTextWidth.value = text.length * 0.6 * 16
      }
    }
  })
})

const textWidth = computed(() => {
  return actualTextWidth.value > 0 ? actualTextWidth.value : text.length * 0.6 * 16
})

const duration = computed(() => {
  const baseDistance = Math.max(textWidth.value - pathLength.value, 100)
  const baseDuration = baseDistance / PIXELS_PER_SECOND

  return Math.max(baseDuration * 2, 4)
})

const startOffsetValues = computed(() => {
  if (!marqueeAnimation.value) return '50%'

  const textToPathRatio = textWidth.value / pathLength.value
  const baseRange = Math.max(textToPathRatio * 60, 50) // Minimum 50% range
  const moveRange = Math.min(baseRange, 50) // Max 50% range for dramatic effect

  const center = 50
  const right = Math.min(center + moveRange, 100) // Allow going beyond visible area
  const left = Math.max(center - moveRange, -30)   // Allow going beyond visible area on left

  return `${right}%; ${center}%; ${left}%; ${center}%; ${right}%`
})

const path = computed(() => {
  return `M 0 0 Q ${width / 2} 170 ${width} 0`
})
</script>
<style scoped>
.sr-only {
  display: none;
}

svg {
  height: 80px;
}

text {
  transition: all 0.3s;
}

.alone {
  --uno: pt-4;
}

.stop-white {
  stop-color: white;
}

.stop-black {
  stop-color: black;
}
</style>
