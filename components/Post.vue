<template>
  <!-- eslint-disable vue/no-v-html -->
  <nuxt-link class="post" :to="blogUri">
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
    <h2 class="post__title" v-html="post.title" />
    <p class="post__description" v-html="post.description" />
  </nuxt-link>
</template>
<script>
export default {
  props: {
    post: {
      type: Object,
      default: () => {}
    },
    to: {
      type: String,
      default: ''
    },
    blogSlug: {
      type: String,
      default: 'blog'
    }
  },
  computed: {
    blogUri() {
      return `/${this.lang}/${this.blogSlug}/${this.to}`
    },
    lang() {
      const { lang } = this.$route.params
      return lang
    }
  },
  methods: {
    formatDate(date = new Date(), simple = false) {
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }
      return Intl.DateTimeFormat(
        this.lang,
        simple ? undefined : options
      ).format(new Date(date))
    }
  }
}
</script>

<style scoped lang="postcss">
.post {
  @apply block
    no-underline
    mb-4
    py-4
    text-black
    border-b
    border-gray-200
    overflow-hidden;
}

.post:last-child {
  @apply border-0;
}

@screen md {
  .post {
    @apply py-2;
  }
}
.post__image {
  position: relative;
}
.post__image img {
  @apply min-w-full;
}
.post__tags {
  @apply absolute
    mb-2
    text-center;
}
.post__tag {
  @apply p-1
    mx-2
    outline-none
    rounded-full
    bg-white
    text-black;
}
.post__tag.active {
  @apply bg-blue-500
    text-white;
}
.post__date {
  @apply -mb-2
    block
    text-center
    text-gray-600
    font-bold;
}
.post__title {
  @apply py-2
    leading-tight
    text-2xl
    font-semibold
    text-center;
}
.post__description {
  @apply text-center;
}
</style>
