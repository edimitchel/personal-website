<template>
  <div v-if="posts.length" class="posts">
    <section v-for="[time, posts] of timeSections" :key="time">
      <h2 v-if="timeSection(time)" class="text-xl uppercase font-bold text-tone-800 py-2">{{ timeSection(time) }}</h2>
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
@reference "../assets/css/main.css";

.posts {
  @apply relative flex flex-col gap-2;
}

@variant md {
  .posts {
    @apply gap-6;
  }
}

.categories {
  @apply flex flex-wrap justify-between;
}

.category {
  transition: all 300ms ease;
  @apply sticky p-2 mx-2 outline-none rounded-full text-ink mb-2;
}

.category.active {
  @apply bg-tone-500 text-paper;
}
</style>
