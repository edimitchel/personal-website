<template>
  <!-- eslint-disable vue/no-v-html -->
  <section class="container">
    <h1>{{ content.title }}</h1>
    <p class="description">
      {{ content.description }}
    </p>

    <section v-if="content.visions.length > 1" class="visions" :class="{ minified: isVisionChosen}">
      <nuxt-link
        v-for="vision of content.visions"
        :key="vision._uid"
        :to="`/${$route.params.lang}/point-of-views/${slug}/${vision.type.slug}`"
        class="vision"
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
    </section>
    <section v-else-if="content.visions.length === 1">
      <hr />
      <Vision :content="content.visions[0]" />
    </section>
    <section v-if="isVisionChosen">
      <Vision :content="getVision" />
    </section>
  </section>
</template>

<script>
import { getDefaultLang } from '@@/utils'
import { transform } from '@/server/transformers'
import Vision from '@/components/Vision'
export default {
  components: {
    Vision
  },
  computed: {
    content() {
      return this.story
    },
    isVisionChosen() {
      return !!this.$route.params.vision
    },
    getVision() {
      const { vision } = this.$route.params
      return this.content.visions.find(v => v.type.slug === vision)
    }
  },
  head() {
    const { title, description } = this.story
    return {
      title,
      meta: [{ hid: 'description', name: 'description', content: description }]
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

    const done = ({ story }) => {
      if (story.titleExcerpt) {
        store.commit('layout/setMessage', [story.titleExcerpt])
      }
      if (story.thumbnail) {
        store.commit('layout/setHeaderImage', story.thumbnail)
      }
      if (story.cover) {
        store.commit('layout/setHeaderFullImage', story.cover)
        if (!story.thumbnail) {
          store.commit('layout/setHeaderImage', undefined)
        }
      }
      return { story, slug }
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
            env.app.defaultLang
          )}blog-posts/${slug}`,
          {
            version
          }
        )
        .then(res => res.data)
        .then(({ story }) => story)
        .then(async story => ({
          story: await transform('story', story, {
            api: app.$storyapi,
            version
          })
        }))
        .then(done)
        .catch(res =>
          console.error(res) && error({
            statusCode: res.response.status,
            message: res.response.data
          })
        )
    }
  },
  destroyed() {
    this.$store.commit('layout/setMessage', [])
    this.$store.commit('layout/setHeaderFullImage', undefined)
    this.$store.commit('layout/setDefaultHeaderImage')
  }
}
</script>
<style scoped>
h1 {
  @apply me-font-bold me-text-4xl me-text-center;
}
.description {
  @apply me-text-center;
}
.visions {
  @apply me-py-10 me-flex me-flex-row me-flex-wrap me-overflow-x-auto;
}
.visions.minified {
  @apply me-p-0 me-flex-no-wrap;
}
.visions.minified .vision-title {
  @apply me-text-sm me-text-gray-600 me-font-normal;
}
.visions.minified .vision-description {
  display: none;
}
.visions .vision {
  @apply me-border me-rounded-lg me-p-4;
  margin: 1%;
  flex-basis: 48%;
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
  @apply me-text-gray-800 me-text-lg me-text-center;
}
.vision-title {
  @apply me-font-bold me-text-2xl me-text-center;
}
.vision-description {
  @apply me-text-center me-text-sm;
}
</style>
