<template>
  <!-- eslint-disable vue/no-v-html -->
  <article>
    <h2 class="vision-title">
      {{ content.title }}
    </h2>
    <p v-if="content.exerpt" class="vision-excerpt" v-html="$md.render(content.excerpt)" />
    <div v-html="$md.render(content.content)" />
    <!-- Comments part -->
  </article>
</template>
<script>
export default {
  props: ['content']
}
</script>
<style scoped>
article {
  @apply me-py-8;
}
.vision-title {
  @apply me-text-3xl me-text-center me-font-bold me-uppercase;
}
.vision-excerpt {
  @apply me-text-center me-my-2;
}
</style>
