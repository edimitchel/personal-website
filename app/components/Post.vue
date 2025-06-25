<template>
  <!-- eslint-disable vue/no-v-html -->
  <NuxtLink class="post prose" :to="blogUri">
    <div class="post__image">
      <div class="post__tags">
        <!-- <small
          class="post__tag"
          v-if="post.category"
          v-for="category of post.category"
          @click.prevent="changeCategory(category)"
          :class="{active: isCurrentCategory && isCurrentCategory(category)}"
        >{{ category }}</small> -->
      </div>
      <!-- <img :src="$withBase(getImage(post))" :alt="post.title"> -->
    </div>
    <small v-if="post.created" class="post__date" :title="formatDate(post.created, true)">
      {{ formatDate(post.created) }}
    </small>
    <h2 class="post__title" v-html="post.title" />
    <p class="post__description" v-html="post.description" />
  </NuxtLink>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      default: () => { },
    },
    to: {
      type: String,
      default: '',
    },
    blogSlug: {
      type: String,
      default: 'blog',
    },
  },
  computed: {
    blogUri() {
      return `/${this.blogSlug}/${this.to}`
    },
    lang() {
      const { lang } = this.$route.params
      return lang ?? 'fr'
    },
  },
  methods: {
    formatDate(date = new Date(), simple = false) {
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
      return Intl.DateTimeFormat(
        this.lang,
        simple ? undefined : options,
      ).format(new Date(date))
    },
  },
}
</script>

<style scoped>
.post {
  --uno: overflow-hidden;
}

.post:last-child {
  --uno: border-0;
}

@screen md {
  .post {
    --uno: py-2;
  }
}

.post__image {
  position: relative;
}

.post__image img {
  --uno: min-w-full;
}

.post__tags {
  --uno: absolute mb-2;
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
