/* eslint-disable vue/no-v-html */
<template>
  <layout class="article">
    <transition name="slide-down">
      <img v-show="showImg" :src="image" alt class="article__image">
    </transition>

    <h1 class="article__title">
      {{ $page.frontmatter.title }}
    </h1>
  </layout>
</template>

<script>
import layout from '@/layouts/default'
import { getImage } from '@@/utils'

export default {
  components: {
    layout
  },
  data() {
    return {
      showImg: false
    }
  },
  computed: {
    image() {
      return getImage(this.$page)
    }
  },
  mounted() {
    this.showImg = true
  }
}
</script>
<style scoped lang="postcss">
  main {
  }
  h1 {
    @apply
      me-pb-5
      me-text-4xl
      me-uppercase
      me-text-center
  }

  .article {
    @apply
      me-leading-loose
      me-font-sans
  }

  .article__image {
    @apply
      me-min-w-full
  }

  .article__title {
    @apply
      me-leading-normal
  }

  .article__content {
    @apply
      me-leading-loose
      me-font-sans
  }
</style>
