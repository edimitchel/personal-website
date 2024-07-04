<template>
  <section>
    <div>
      <h2 class="subtitle">
        Michel&#39;s website about him and his thoughts
      </h2>
      <div class="links" />
    </div>
  </section>
</template>

<script setup lang="ts">
const store = layoutStore()

useHead({
  title: 'Home'
})


onMounted(() => {
  store.title = 'Michel Edighoffer'
})
</script>
