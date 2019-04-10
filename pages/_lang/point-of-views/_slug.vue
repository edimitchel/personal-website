<template>
  <!-- eslint-disable vue/no-v-html -->
  <section class="container">
    <h1>{{ content.title }}</h1>

    <section>
      <article
        v-for="vision of content.visions"
        :key="vision._uid"
        v-html="$md.render(vision.content)"
      />
    </section>
  </section>
</template>

<script>
import { getDefaultLang } from '@@/utils'
import { transform } from '@/server/transformers'
export default {
  computed: {
    content() {
      return this.story
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
      return { story }
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
          story: await transform('story', story)
        }))
        .then(done)
        .catch((res) => {
          error({
            statusCode: res.response.status,
            message: res.response.data
          })
        })
    }
  },
  destroyed() {
    this.$store.commit('layout/setMessage', [])
  }
}
</script>
<style lang="stylus" scoped></style>
