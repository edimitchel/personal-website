<template>
  <layout>
    <nuxt />
  </layout>
</template>

<script>
import layout from '@/layouts/default'
export default {
  components: {
    layout
  }
}
</script>

<style lang="stylus" scoped>
@css {
  main {
  }
  h1 {
    @apply me-pb-5
  }
}
</style>
