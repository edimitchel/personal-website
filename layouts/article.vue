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
  @apply pb-5
      text-4xl
      uppercase
      text-center;
}

.article {
  @apply leading-loose
      font-sans;
}

.article__image {
  @apply min-w-full;
}

.article__title {
  @apply leading-normal;
}

.article__content {
  @apply leading-loose
      font-sans;
}
</style>
