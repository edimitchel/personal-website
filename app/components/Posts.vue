<template>
  <div class="posts">
    <div v-if="posts.length" class="posts">
      <Post
        v-for="post in posts"
        :key="post.slug"
        :to="post.slug"
        :post="post"
        :blogSlug="blog.slug"
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
    },
    blog: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
<style scoped>
.posts {
  --uno: relative
      font-sans;
}

.categories {
  --uno: flex
      flex-wrap
      justify-between;
}
.category {
  transition: all 300ms ease;
  --uno: sticky
      p-2
      mx-2
      outline-none
      rounded-full
      text-black
      mb-2;
}
.category.active {
  --uno: bg-blue-500
      text-white;
}
</style>
