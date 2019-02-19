<template>
  <section class="container">
    <div>
      <h2 class="subtitle">
        Michel&#39;s website about him and his thoughts
      </h2>
      <posts :posts="posts" />
    </div>
  </section>
</template>

<script>
import { getDefaultLang } from '@@/utils'
import Posts from '@/components/Posts'
import { transform } from '@/server/transformers'

export default {
  components: {
    Posts
  },
  asyncData({ app, params, query, env, error }) {
    const { lang } = params
    const version = query._storyblok || process.env.DEV ? 'draft' : 'published'
    return app.$storyapi
      .get(`cdn/stories`, {
        starts_with: getDefaultLang(lang, env.app.defaultLang) + 'blog-posts',
        version
      })
      .then(async (res) => {
        const { stories } = res.data
        const posts = await transform('story', stories)
        return {
          posts
        }
      })
      .catch((res) => {
        error({
          statusCode: res.response.status,
          message: res.response.data
        })
      })
  }
}
</script>
