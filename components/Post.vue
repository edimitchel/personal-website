<template>
  <router-link class="post" :to="to">
    <div class="post__image">
      <div class="post__tags">
        <small
          class="post__tag"
          v-if="post.frontmatter.category"
          v-for="category of post.frontmatter.category"
          @click.prevent="changeCategory(category)"
          :class="{active: isCurrentCategory && isCurrentCategory(category)}"
        >{{category}}</small>
      </div>
      <img :src="$withBase(getImage(post))" :alt="post.frontmatter.title">
    </div>
    <small
      class="post__date"
      :title="post.frontmatter.date | moment('LLLL')"
    >{{post.frontmatter.date | moment("calendar")}}</small>
    <h2 class="post__title" v-html="post.frontmatter.title"/>
    <p class="post__description" v-html="post.frontmatter.description"/>
    <hr>
  </router-link>
</template>
<script>
import { getImage, slugify } from "@@/utils";
export default {
  props: ["post", "to", "isCurrentCategory"],
  methods: {
    getImage,
    changeCategory(name) {
      this.$emit("changeCategory", name);
    }
  }
};
</script>

<style lang="stylus" scoped>
@css {
  .post {
    @apply
      me-block
      me-no-underline
      me-mb-4
      me-pb-4
      me-text-black
      me-border-b
      me-border-grey
      me-overflow-hidden
  }
  .post__image {
    position: relative;
  }
  .post__image img {
    @apply
      me-min-w-full
  }
  .post__tags {
    @apply
      me-absolute
      me-pin-b
      me-pin-r
      me-pin-l
      me-mb-2
      me-text-center
  }
  .post__tag {
    @apply
      me-p-1
      me-mx-2
      me-outline-none
      me-rounded-full
      me-bg-white
      me-text-black
  }
  .post__tag.active {
    @apply
      me-bg-blue
      me-text-white
  }
  .post__date {
    @apply
      me-mt-2
      me--mb-2
      me-block
      me-text-center
      me-font-bold
  }
  .post__title {
    @apply
      me-py-2
      me-leading-tight
  }
  .post__description {
    @apply
      me-truncate
  }
}
</style>
