<template>
  <main class="article">
    <transition name="slide-down">
      <img :src="image" alt class="article__image" v-show="showImg">
    </transition>

    <h1 class="article__title" v-html="$page.frontmatter.title"/>
    <Content class="article__content"/>
  </main>
</template>

<script>
import { getImage } from "@vpress/utils";

export default {
  name: "ArticleLayout",
  data() {
    return {
      showImg: false,
    }
  },
  mounted() {
    this.showImg = true;
  },
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
    @apply me-pb-5 me-text-4xl me-uppercase me-text-center
  }

  .article {
    @apply me-leading-loose me-font-sans
  }

  .article__image {
    @apply 
      me-min-w-full
  }

  .article__title {
    @apply me-leading-normal
  }

  .article__content {
    @apply me-leading-loose me-font-sans
  }
}
</style>
