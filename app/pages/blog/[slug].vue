<template>
  <section>
    <div>
      <Posts :posts="posts" :blog="blog" />
    </div>
  </section>
</template>

<script setup lang="ts">

useHead({
  title: 'Blog'
})

const route = useRoute();

const posts = ref([])

query

</script>
