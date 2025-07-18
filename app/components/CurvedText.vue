<template>
  <div :class="{ alone, [`level-${titleLevel}`]: true }">
    <svg :width="width" fill="none" viewBox="0 0 500 100">
      <path id="curve" :d="path" />
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
          <stop class="stop-black" offset="0%" />
          <stop class="stop-white" offset="50%" />
          <stop class="stop-white" offset="100%" />
        </linearGradient>
        <mask id="mask">
          <rect x="0" y="10" width="100%" height="90%" fill="url(#gradient)" />
        </mask>
      </defs>
      <text :text-anchor="marqueeAnimation ? 'start' : 'middle'" :class="{ 'tracking-wide': alone, 'text-3xl': alone }" mask="url(#mask)">
        <textPath ref="textPathRef" xlink:href="#curve" startOffset="50%" :fill="color">
          <slot />
          <animate v-if="marqueeAnimation" attributeName="startOffset" from="100%" :to="percentageTo" :dur="duration"
            repeatCount="indefinite"></animate>
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
  width = 500,
} = defineProps < {
  color?: string
  titleLevel?: number
  alone?: boolean
  width?: number
} > ()

const MIN_TEXT_LENGTH_FOR_MARQUEE = 20
const PIXELS_PER_SECOND = 80 // Consistent speed in pixels per second

const slots = defineSlots()
const textPathRef = ref<SVGTextPathElement>()
const actualTextWidth = ref(0)

// Get text content from slot
const text = computed(() => {
  return slots.default?.()[0].children?.toString().replace(/\s/g, '')
})

// Calculate the approximate length of the quadratic bezier curve
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
  return text.value.length > MIN_TEXT_LENGTH_FOR_MARQUEE
})

// Measure actual text width when component is mounted
onMounted(() => {
  nextTick(() => {
    if (textPathRef.value) {
      try {
        const bbox = textPathRef.value.getBBox()
        actualTextWidth.value = bbox.width
      } catch (e) {
        // Fallback to estimation if getBBox fails
        actualTextWidth.value = text.value.length * 0.6 * 16
      }
    }
  })
})

// Watch for text changes to remeasure
watch(text, () => {
  nextTick(() => {
    if (textPathRef.value) {
      try {
        const bbox = textPathRef.value.getBBox()
        actualTextWidth.value = bbox.width
      } catch (e) {
        // Fallback to estimation if getBBox fails
        actualTextWidth.value = text.value.length * 0.6 * 16
      }
    }
  })
})

// Get text width (measured or estimated)
const textWidth = computed(() => {
  return actualTextWidth.value > 0 ? actualTextWidth.value : text.value.length * 0.6 * 16
})

// Calculate duration based on the distance the text needs to travel
const duration = computed(() => {
  // Total distance to travel: path length + text width (to completely exit)
  const totalDistance = pathLength.value + textWidth.value
  
  // Duration = distance / speed (convert to seconds string)
  return Math.ceil(totalDistance / PIXELS_PER_SECOND)
})

// Calculate the end position based on text length
const percentageTo = computed(() => {
  // Calculate how far the text needs to move to completely exit the visible area
  const pathLengthValue = pathLength.value
  
  // Convert to percentage of path length
  const exitPercentage = (pathLengthValue + textWidth.value) / pathLength.value * 100
  
  return `-${exitPercentage}%`
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
