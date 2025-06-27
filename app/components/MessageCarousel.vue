<template>
  <Transition
    :name="transitionName"
    mode="out-in"
  >
    <slot :message="currentMessage" :level="currentLevel" />
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

interface Props {
  alive?: boolean
  list?: (string | { content: string, level: number })[]
  transitionName?: string
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  alive: true,
  list: () => [],
  transitionName: 'fade',
  duration: 5000
})

const index = ref(0)
let timerId: NodeJS.Timeout | null = null

const current = computed(() => {
  return props.list[index.value]
})
const currentMessage = computed(() => {
  return typeof current.value === 'object' ? current.value.content : current.value
})

const currentLevel = computed(() => {
  return typeof current.value === 'object' ? current.value.level : undefined
})

const run = () => {
  if (timerId || props.list.length < 1) {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    }

    if (props.list.length < 1) {
      return
    }
  }
  
  timerId = setInterval(() => {
    if (props.list.length > 0) {
      index.value = (index.value + 1) % props.list.length
    }
  }, props.duration)
}

watch(() => props.list, () => {
  index.value = 0
  run()
})

onMounted(() => {
  run()
})

onUnmounted(() => {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
})
</script>
