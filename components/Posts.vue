<template>
  <div class="posts">
    <div v-if="posts.length" class="posts">
      <Post
        v-for="post in posts"
        :key="post.slug"
        :to="post.slug"
        :post="post"
      />
    </div>
  </div>
</template>

<script>
import Post from '@/components/Post'
export default {
  components: {
    Post
  },
  props: {
    posts: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style scoped lang="postcss">
.posts {
  @apply me-relative
      me-font-sans;
}

.categories {
  @apply me-flex
      me-flex-wrap
      me-justify-between;
}
.category {
  transition: all 300ms ease;
  @apply me-sticky
      me-p-2
      me-mx-2
      me-outline-none
      me-rounded-full
      me-text-black
      me-mb-2;
}
.category.active {
  @apply me-bg-blue-500
      me-text-white;
}
</style>
