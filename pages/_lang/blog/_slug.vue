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
      const { content } = this.story
      return {
        title: content.title,
        visions: this.mapVisions(content.visions)
      }
    }
  },
  methods: {
    async mapVisions(visions) {
      const result = await transform('vision', visions)
      return result
    }
  },
  asyncData({ app, params, query, env, error }) {
    const { lang = 'default', slug } = params
    const version = query._storyblok || process.env.DEV ? 'draft' : 'published'
    return app.$storyapi
      .get(`cdn/stories/${getDefaultLang(lang, env.app.defaultLang)}blog-posts/${slug}`, {
        version
      })
      .then((res) => {
        return res.data
      })
      .catch((res) => {
        // TODO: Resolve this error with an critical error
        error({
          statusCode: res.response.status,
          message: res.response.data
        })
      })
  }
}
</script>
<style lang="stylus" scoped>

</style>
