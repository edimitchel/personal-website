<template>
  <NuxtLinkLocale class="post prose" :class :to="`/articles/${props.to}`">
    <header class="post__header">
      <small v-if="post.created" class="post__date" :title="formatDate(post.created, true)">
        {{ formatDate(post.created) }}
      </small>
      <div class="post__tags">
        <small class="post__tag" v-if="post.categories" v-for="category of post.categories">{{ category }}</small>
      </div>
    </header>
    <h2 class="post__title" v-html="post.title" />
    <p class="post__description" v-html="post.description" />
  </NuxtLinkLocale>
</template>

<script setup lang="ts">
import type { ArticlesCollectionItem } from '@nuxt/content';

const { locale } = useI18n()

const props = defineProps<{ post: ArticlesCollectionItem, to: string, class?: string }>()

function formatDate(date: string, simple = false) {
  return Intl.DateTimeFormat(
    locale.value,
    simple ? undefined : {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date))
}
</script>

<style scoped>
@reference "../assets/css/main.css";

.post {
  @apply block overflow-hidden pb-3;
}

.post:last-child {
  @apply border-0;
}

.post__header {
  @apply flex items-baseline justify-start gap-2 -mb-1;
}

.post__tags {
  @apply text-sm flex;
}

.post__tag {
  @apply outline-none rounded-full text-ink;
  ;
}

.post__tag:not(:last-child)::after {
  content: ', ';
  @apply mr-1;
}

.post__tag.active {
  @apply bg-tone-500 text-ink;
}

.post__date {
  @apply block uppercase text-xs text-tone-600 font-bold;
}

.post__title {
  @apply m-0 py-1 leading-tight text-lg font-semibold text-ink line-clamp-1;
  ;
}

.post__description {
  @apply text-sm m-0 leading-snug text-balance line-clamp-2 text-ink;
  ;
}
</style>
