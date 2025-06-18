<template>
  <!-- eslint-disable vue/no-v-html -->
  <NuxtLink
    class="post"
    :to="blogUri"
  >
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
    <small
      v-if="post.date"
      class="post__date"
      :title="formatDate(post.date, true)"
    >
      {{ formatDate(post.date) }}
    </small>
    <h2
      class="post__title"
      v-html="post.title"
    />
    <p
      class="post__description"
      v-html="post.description"
    />
  </NuxtLink>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      default: () => {},
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
        hour: 'numeric',
        minute: 'numeric',
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
  --uno: block
    no-underline
    mb-4
    py-4
    text-black
    border-b
    border-gray-200
    overflow-hidden;
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
  --uno: absolute
    mb-2
    text-center;
}
.post__tag {
  --uno: p-1
    mx-2
    outline-none
    rounded-full
    bg-white
    text-black;
}
.post__tag.active {
  --uno: bg-blue-500
    text-white;
}
.post__date {
  --uno: -mb-2
    block
    text-center
    text-gray-600
    font-bold;
}
.post__title {
  --uno: py-2
    leading-tight
    text-2xl
    font-semibold
    text-center;
}
.post__description {
  --uno: text-center;
}
</style>
