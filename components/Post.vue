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
    <hr>
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
    }
  },
  computed: {
    blogUri() {
      return `/${this.lang}/point-of-views/${this.to}`
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
  @apply
    me-block
    me-no-underline
    me-mb-4
    me-py-4
    me-text-black
    me-border-b
    me-border-gray-200
    me-overflow-hidden
}

@screen md {
  .post {
    @apply me-py-2;
  }
}
.post__image {
  position: relative;
}
.post__image img {
  @apply
    me-min-w-full
}
.post__tags {
  @apply
    me-absolute
    me-mb-2
    me-text-center
}
.post__tag {
  @apply
    me-p-1
    me-mx-2
    me-outline-none
    me-rounded-full
    me-bg-white
    me-text-black
}
.post__tag.active {
  @apply
    me-bg-blue-500
    me-text-white
}
.post__date {
  @apply
    me--mb-2
    me-block
    me-text-center
    me-text-gray-600
    me-font-bold
}
.post__title {
  @apply
    me-py-2
    me-leading-tight
    me-text-2xl
    me-font-semibold
    me-text-center
}
.post__description {
  @apply
    me-text-center
}
</style>
