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
  async asyncData({ app, params, query, env, error, isDev }) {
    const { lang } = params
    const version = query._storyblok || isDev ? 'draft' : 'published'
    const { stories } = await app.$storyapi
      .get(`cdn/stories`, {
        starts_with: getDefaultLang(lang, env.app.defaultLang) + 'blog-posts',
        version
      })
      .then(res => res.data)
      .catch((res) => {
        error({
          statusCode: res.response.status,
          message: res.response.data
        })
      })
    return { posts: await transform('story', stories) }
  }
}
</script>
