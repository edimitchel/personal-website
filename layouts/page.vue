<template>
  <layout>
    <transition name="slide-down" mode="out-in">
      <h1 :key="title">
        {{ title }}
      </h1>
    </transition>
    <nuxt />
  </layout>
</template>

<script>
import layout from '@/layouts/default'

export default {
  components: {
    layout
  },
  props: {
    show: {
      type: Object,
      default: () => ({
        title: true,
        content: true
      })
    },
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
<style scoped lang="postcss">
h1 {
  @apply uppercase
      pb-5
      text-center;
}
</style>
