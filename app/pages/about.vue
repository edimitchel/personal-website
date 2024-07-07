<template>
  <section>
    À PROPOS !
  </section>
</template>

<script setup>

definePageMeta({
  title: 'Michel Edighoffer',
})

const store = layoutStore()

onMounted(() => {
  store.messages = [
    'front-end engineer',
    'Vue & Nuxt enthusiast',
    'christian ✝️',
    'Alsace ❤',
    'love wife and 2 kids'
  ].sort(Math.random)
})
</script>
