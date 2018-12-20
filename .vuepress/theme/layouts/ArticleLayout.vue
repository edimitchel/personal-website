<template>
  <main>
    <img :src="image" alt />

    <h1>{{$page.frontmatter.title}}</h1>
    <Content/>
  </main>
</template>

<script>
import { getImage } from '@vuepress/utils';

export default {
  name: "BlogLayout",
  computed: {
    image() {
      return this.$withBase(getImage(this.$page));
    }
  }
};
</script>
<style lang="stylus" scoped>
@css {
  main {
  }
  h1 {
    @apply me-pb-5 me-text-4xl me-uppercase me-text-center;
  }
}
</style>
