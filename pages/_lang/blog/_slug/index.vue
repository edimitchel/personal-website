<template>
  <!-- eslint-disable vue/no-v-html -->
  <section>
    <h1>{{ content.title }}</h1>
    <p class="description">
      {{ content.description }}
    </p>

    <header v-if="content.visions.length > 1" class="visions" :class="{ minified: isVisionChosen}">
      <nuxt-link
        v-for="vision of content.visions"
        :key="vision._uid"
        :to="`/${$route.params.lang}/${blogSlug}/${slug}/${vision.type.slug}`"
        class="vision"
        :replace="hasChosenOne"
      >
        <no-ssr>
          <h3 class="vision-type">
            {{ vision.type.name }}
          </h3>
          <h2 class="vision-title">
            {{ vision.title }}
          </h2>
          <p v-if="vision.excerpt" class="vision-description" v-html="$md.render(vision.excerpt)" />
        </no-ssr>
      </nuxt-link>
    </header>
    <section v-else-if="content.visions.length === 1">
      <Vision :content="content.visions[0]" />
    </section>
    <nuxt-child :selectedVision="selectedVision" />
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import { getDefaultLang } from '@@/utils'
import { transform } from '@/server/transformers'
import Vision from '@/components/Vision'
export default {
  head() {
    const { description } = this.post
    return {
      title: this.pageTitle,
      meta: [{ hid: 'description', name: 'description', content: description }]
    }
  },
  components: {
    Vision
  },
  data() {
    return {
      post: {},
      hasChosenOne: false,
    }
  },
  computed: {
    ...mapGetters('informations', [
      'blogSlug'
    ]),
    content() {
      return this.post
    },
    isVisionChosen() {
      return !!this.$route.params.vision
    },
    selectedVision() {
      const { vision } = this.$route.params
      return this.content.visions.find(v => v.type.slug === vision)
    },
    pageTitle() {
      const { title: postTitle } = this.post
      if (this.selectedVision) {
        const { title: visionTitle, type } = this.selectedVision
        return `${postTitle} : ${type.name} - ${visionTitle}`
      }
      return postTitle
    }
  },
  watch: {
    $route({ params }) {
      this.hasChosenOne = !!params.vision
    }
  },
  asyncData({
    app,
    params,
    query,
    $axios,
    $payloadURL,
    route,
    env,
    error,
    store,
    isDev
  }) {
    const { lang = 'default', slug } = params
    const version =
      query._storyblok || isDev || process.env.DEV ? 'draft' : 'published'

    const done = ({ post }) => {
      if (post.titleExcerpt) {
        store.commit('layout/setMessage', [post.titleExcerpt])
      }
      if (post.thumbnail) {
        store.commit('layout/setHeaderImage', post.thumbnail)
      }
      if (post.cover) {
        store.commit('layout/setHeaderCover', post.cover)
        if (!post.thumbnail) {
          store.commit('layout/setHeaderImage', undefined)
        }
      }
      return { post, slug }
    }

    if (process.client && process.static) {
      return $axios
        .get($payloadURL(route))
        .then(({ data }) => data)
        .then(done)
    } else {
      return app.$storyapi
        .get(
          `cdn/stories/${getDefaultLang(
            lang,
            env.info.defaultLang
          )}blog-posts/${slug}`,
          {
            version
          }
        )
        .then(res => res.data)
        .then(({ story }) => story)
        .then(async story => ({
          post: await transform('story', story, {
            api: app.$storyapi,
            version
          })
        }))
        .then(done)
        .catch(res => error(res))
    }
  },
  destroyed() {
    this.$store.commit('layout/setMessage', [])
    this.$store.commit('layout/setHeaderCover', undefined)
    this.$store.commit('layout/setDefaultHeaderImage')
  }
}
</script>
<style lang="postcss" scoped>
h1 {
  @apply me-font-bold
    me-text-4xl
    me-text-center;
}
.description {
  @apply me-text-center;
}
.visions {
  @apply me-py-10
    me-flex
    me-flex-row
    me-flex-wrap
    me-overflow-x-auto;
}
.visions.minified {
  @apply me-p-0
    me-pt-5
    me-flex-no-wrap;
}
.visions.minified .vision-title {
  @apply me-text-sm
    me-text-gray-600
    me-font-normal;
}
.visions.minified .vision-description {
  display: none;
}
.visions .vision {
  margin: 1%;
  flex-basis: 48%;
  @apply me-border
    me-rounded-lg
    me-p-4;
}
.visions.minified .vision-description {
  flex-basis: 100px;
}
.visions .vision.nuxt-link-active {
  @apply me-bg-gray-600;
}
.visions .vision.nuxt-link-active .vision-type {
  @apply me-text-white;
}
.visions.minified .vision.nuxt-link-active .vision-title {
  @apply me-text-white;
}
.vision-type {
  @apply me-text-gray-800
    me-text-lg
    me-text-center;
}
.vision-title {
  @apply me-font-bold
    me-text-2xl
    me-text-center;
}
.vision-description {
  @apply me-text-center
    me-text-sm;
}
</style>
