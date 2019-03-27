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
  asyncData({ app, params, query, payload, env, error, isDev }) {
    const { lang = 'default' } = params
    const version = query._storyblok || isDev || process.env.DEV ? 'draft' : 'published'
    let promise
    if (payload) {
      promise = Promise.resolve(payload)
    } else {
      promise = app.$storyapi
        .get(`cdn/stories`, {
          starts_with: getDefaultLang(lang, env.app.defaultLang) + 'blog-posts',
          version
        })
        .then(res => res.data)
        .then(({ stories }) => stories)
        .catch((res) => {
          error({
            statusCode: res.response.status,
            message: res.response.data
          })
        })
    }

    return promise.then(async stories => ({
      posts: await transform('story', stories)
    }))
  }
}
</script>
