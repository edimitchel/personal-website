<template>
  <section class="container">
    <h1>About me</h1>
  </section>
</template>

<script>
export default {
  head: {
    title: 'About me'
  },
  mounted() {
    this.$store.commit('layout/setMessage', [
      '🕊 christian ✝️',
      'Vue enthusiast',
      'Alsace ❤',
      'aeromodelism ❤',
      'front-end engineer'
    ])
  },
  destroyed() {
    this.$store.commit('layout/setMessage', [])
  }
}
</script>
