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
    return {
      meta: {
        title: this.story.title
      }
    }
  },
  async asyncData({ app, params, query, env, error, isDev }) {
    const { lang = 'default', slug } = params
    const version = query._storyblok || isDev ? 'draft' : 'published'
    const { story } = await app.$storyapi
      .get(`cdn/stories/${getDefaultLang(lang, env.app.defaultLang)}blog-posts/${slug}`, {
        version
      })
      .then(res => res.data)
      .catch((res) => {
        // TODO: Resolve this error with an critical error
        error({
          statusCode: res.response.status,
          message: res.response.data
        })
      })

    return {
      story: await transform('story', story)
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
