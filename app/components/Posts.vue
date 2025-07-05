<template>
    <div v-if="posts.length" class="posts">
      <Post v-for="post in posts" :key="post.slug" :to="post.slug" :post />
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
  }
}
</script>
<style scoped>
.posts {
  --uno: relative flex flex-col gap-4;
}

@screen md {
  .posts {
    --uno: gap-8;
  }
}

.categories {
  --uno: flex flex-wrap justify-between;
}

.category {
  transition: all 300ms ease;
  --uno: sticky p-2 mx-2 outline-none rounded-full text-black mb-2;
}

.category.active {
  --uno: bg-blue-500 text-white;
}
</style>
