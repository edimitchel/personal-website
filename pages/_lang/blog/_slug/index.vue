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
        <client-only>
          <h3 class="vision-type">
            {{ vision.type.name }}
          </h3>
          <h2 class="vision-title">
            {{ vision.title }}
          </h2>
          <p v-if="vision.excerpt" class="vision-description" v-html="$md.render(vision.excerpt)" />
        </client-only>
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
  @apply font-bold
    text-4xl
    text-center;
}
.description {
  @apply text-center;
}
.visions {
  @apply py-10
    flex
    flex-row
    flex-wrap
    overflow-x-auto;
}
.visions.minified {
  @apply p-0
    pt-5
    flex-no-wrap;
}
.visions.minified .vision-title {
  @apply text-sm
    text-gray-600
    font-normal;
}
.visions.minified .vision-description {
  display: none;
}
.visions .vision {
  margin: 1%;
  flex-basis: 48%;
  @apply border
    rounded-lg
    p-4;
}
.visions.minified .vision-description {
  flex-basis: 100px;
}
.visions .vision.nuxt-link-active {
  @apply bg-gray-600;
}
.visions .vision.nuxt-link-active .vision-type {
  @apply text-white;
}
.visions.minified .vision.nuxt-link-active .vision-title {
  @apply text-white;
}
.vision-type {
  @apply text-gray-800
    text-lg
    text-center;
}
.vision-title {
  @apply font-bold
    text-2xl
    text-center;
}
.vision-description {
  @apply text-center
    text-sm;
}
</style>
