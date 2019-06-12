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
      :title="$moment(new Date(post.date), 'LLLL',)"
    >
      {{ $moment(new Date(post.date), 'calendar') }}
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
      const { lang } = this.$route.params
      return `/${lang}/point-of-views/${this.to}`
    }
  }
}
</script>

<style scoped>
  .post {
    @apply
      me-block
      me-no-underline
      me-mb-4
      me-pb-4
      me-text-black
      me-border-b
      me-border-gray-500
      me-overflow-hidden
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
      me-mt-2
      me--mb-2
      me-block
      me-text-center
      me-font-bold
  }
  .post__title {
    @apply
      me-py-2
      me-leading-tight
  }
  .post__description {
    @apply
      me-truncate
  }
</style>
