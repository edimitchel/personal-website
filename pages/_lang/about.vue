<template>
  <section>
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
      'front-end engineer',
      'Vue enthusiast',
      '🕊 christian ✝️',
      'Alsace ❤',
      'aeromodelism ❤',
      'love my wife'
    ])
  },
  destroyed() {
    this.$store.commit('layout/setMessage', [])
  }
}
</script>
