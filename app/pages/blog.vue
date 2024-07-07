<template>
  <section>
    <ContentRenderer :value="blog" />
  </section>

  <ContentRenderer :value="posts">
    <template #empty>
      Pas d'article pour le moment
    </template>
  </ContentRenderer>
</template>

<script setup>

definePageMeta({
  title: 'Blog'
})

const { data: blog } = await useAsyncData('blog', queryContent('/').where({ _file: 'index.md' }).findOne);
const { data: posts } = await useAsyncData('articles', queryContent('/articles').find, {
  transform(postsResult) {
    return postsResult.map(post => ({
      title: post.title,
      description: post.excerpt,
      slug: post._path
    }))
  }
});

</script>
