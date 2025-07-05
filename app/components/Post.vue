<template>
  <NuxtLinkLocale class="post prose" :to="{ name: 'articles-slug', params: { slug: props.to } }">
    <div class="post__image">
      <div class="post__tags">
        <small
          class="post__tag"
          v-if="post.categories"
          v-for="category of post.categories"
        >{{ category }}</small>
      </div>
      <!-- <img :src="$withBase(getImage(post))" :alt="post.title"> -->
    </div>
    <small v-if="post.created" class="post__date" :title="formatDate(post.created, true)">
      {{ formatDate(post.created) }}
    </small>
    <h2 class="post__title" v-html="post.title" />
    <p class="post__description" v-html="post.description" />
  </NuxtLinkLocale>
</template>

<script setup lang="ts">
import type { ArticlesCollectionItem } from '@nuxt/content';

const { locale } = useI18n()

const props = defineProps<{ post: ArticlesCollectionItem, to: string }>()

function formatDate(date: string, simple = false) {
  return Intl.DateTimeFormat(
    locale.value,
    simple ? undefined : {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date))
}
</script>

<style scoped>
.post {
  --uno: overflow-hidden;
}

.post:last-child {
  --uno: border-0;
}

.post__image {
  position: relative;
}

.post__image img {
  --uno: min-w-full;
}

.post__tags {
  --uno: float-right mb-2;
}

.post__tag {
  --uno: p-1 mx-2 outline-none rounded-full bg-white text-black;
}

.post__tag.active {
  --uno: bg-blue-500 text-white;
}

.post__date {
  --uno: -mb-2 block text-gray-600 font-bold;
}

.post__title {
  --uno: m-0 pt-2 leading-tight text-2xl font-semibold;
}

.post__description {
  --uno: m-0;
}
</style>
