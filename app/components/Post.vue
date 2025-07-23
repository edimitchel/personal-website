<template>
  <NuxtLinkLocale class="post prose" :class :to="{ name: 'articles-slug', params: { slug: props.to } }">
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
.post {
  --uno: block overflow-hidden pb-3;
}

.post:last-child {
  --uno: border-0;
}

.post__header {
  --uno: flex items-baseline justify-start gap-2 -mb-1;
}

.post__tags {
  --uno: text-sm flex;
}

.post__tag {
  --uno: outline-none rounded-full text-background;
  ;
}

.post__tag:not(:last-child)::after {
  content: ', ';
  --uno: mr-1;
}

.post__tag.active {
  --uno: bg-primary-500 text-background;
}

.post__date {
  --uno: block uppercase text-xs text-primary-600 font-bold;
}

.post__title {
  --uno: m-0 py-1 leading-tight text-lg font-semibold text-background line-clamp-1;
  ;
}

.post__description {
  --uno: text-sm m-0 leading-snug text-balance line-clamp-2 text-background;
  ;
}
</style>
