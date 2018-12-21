<template>
  <main>
    <img :src="image" alt>

    <h1 v-html="$page.frontmatter.title"/>
    <Content class="article-content"/>
  </main>
</template>

<script>
import { getImage } from "@vpress/utils";

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

  .article-content {
    @apply me-leading-loose me-font-sans;
  }
}
</style>
