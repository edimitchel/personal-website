<template>
  <section class="container">
    <div>
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
  data() {
    return {
      posts: []
    }
  },
  head: {
    title: 'Point of View'
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
    isDev,
    store
  }) {
    const { lang = 'default' } = params
    const version =
      query._storyblok || isDev || process.env.DEV ? 'draft' : 'published'
    if (process.client && process.static) {
      return $axios.get($payloadURL(route)).then(({ data }) => data)
    } else {
      return app.$storyapi
        .get(`cdn/stories`, {
          starts_with: getDefaultLang(lang, env.app.defaultLang) + 'blog-posts',
          version
        })
        .then(res => res.data)
        .then(({ stories }) => stories)
        .then(async stories => ({
          posts: await transform('story', stories, { api: app.$storyapi, version })
        }))
        .catch(res =>
          error({
            statusCode: res.response.status,
            message: res.response.data
          })
        )
    }
  }
}
</script>
