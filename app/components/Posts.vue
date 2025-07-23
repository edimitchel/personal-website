<template>
  <div v-if="posts.length" class="posts">
    <section v-for="[time, posts] of timeSections" :key="time">
      <h2 v-if="timeSection(time)" class="text-xl uppercase font-bold text-primary-800 py-2">{{ timeSection(time) }}</h2>
      <Post v-for="post in posts" :key="post.slug" :to="post.slug" :post="post" />
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ArticlesCollectionItem } from '@nuxt/content';

interface Props {
  posts: ArticlesCollectionItem[]
}

const props = defineProps < Props > ()

const timeSections = computed(() => {
  const sections: Map<number, ArticlesCollectionItem[]> = new Map()

  props.posts.forEach(post => {
    if (post.meta.timeSection) {
      const key = post.meta.timeSection as number
      if (!sections.has(key)) {
        sections.set(key, [])
      }
      sections.get(key)?.push(post)
      return
    }

    const date = new Date(post.created)
    const year = date.getFullYear()

    if (!sections.has(year)) {
      sections.set(year, [])
    }
    sections.get(year)?.push(post)
  })

  return sections
})

function timeSection(time: number) {
  if(time === new Date().getFullYear()) {
    return null
  }

  return time.toString()
}
</script>
<style scoped>
.posts {
  --uno: relative flex flex-col gap-2;
}

@screen md {
  .posts {
    --uno: gap-6;
  }
}

.categories {
  --uno: flex flex-wrap justify-between;
}

.category {
  transition: all 300ms ease;
  --uno: sticky p-2 mx-2 outline-none rounded-full text-background mb-2;
}

.category.active {
  --uno: bg-primary-500 text-foreground;
}
</style>
