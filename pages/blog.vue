<template>
  <section class="container">
    <div>
      <h2 class="subtitle">
        Michel&#39;s website about him and his thoughts
      </h2>
      <div class="links" />
    </div>
  </section>
</template>

<script>
export default {
  layout: 'blog',
  async asyncData({ $axios }) {
    const data = await $axios.get('http://localhost:3000/api/articles')
    return data
  }
}
</script>
