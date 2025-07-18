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
        <textPath xlink:href="#curve" startOffset="50%" :fill="color">
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
const SPEED = 10; // Pixels per second

const slots = defineSlots()

const marqueeAnimation = computed(() => {
  return text.value.length > MIN_TEXT_LENGTH_FOR_MARQUEE
})

const duration = computed(() => {  
  return text.value.length / SPEED
})

const percentageTo = computed(() => {
  return `-${100 + (text.value.length - MIN_TEXT_LENGTH_FOR_MARQUEE) * 3}%`
})

const path = computed(() => {
  return `M 0 0 Q ${width / 2} 170 ${width} 0`
})

const text = computed(() => {
  return slots.default?.()[0].children?.toString().replace(/\s/g, '')
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
