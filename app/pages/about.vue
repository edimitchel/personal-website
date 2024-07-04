<template>
  <section>
    <h1>About me</h1>
  </section>
</template>

<script setup>

useHead({
  title: 'About me'
})

const store = layoutStore()

onMounted(() => {
  store.messages.value = [
    'front-end engineer',
    'Vue enthusiast',
    '🕊 christian ✝️',
    'Alsace ❤',
    'aeromodelism ❤',
    'love my wife'
  ]
})

onUnmounted(() => {
  store.messages.value = []
})
</script>
