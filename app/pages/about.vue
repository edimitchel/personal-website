<template>
  <section>
  </section>
</template>

<script setup>

definePageMeta({
  title: 'About me'
})

const store = layoutStore()

onMounted(() => {
  store.messages = [
    'front-end engineer',
    'Vue enthusiast',
    '🕊 christian ✝️',
    'Alsace ❤',
    'aeromodelism ❤',
    'love my wife'
  ].sort(Math.random)
})
</script>
