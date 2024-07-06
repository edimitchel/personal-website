<template>
  <section>
    <div>
      <!-- <Posts :posts="posts" :blog="blog" /> -->
      <ContentRenderer :value="post" />
    </div>
  </section>
</template>

<script setup lang="ts">
useHead({
  title: 'Blog'
})

const route = useRoute();

console.log(route.params.slug)

const post = await queryContent().findOne();

</script>
