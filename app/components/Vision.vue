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
  props: {
    content: {
      type: Object,
      default() {
        return {
          content: ''
        }
      }
    }
  }
}
</script>
<style scoped>
article {
  --uno: py-8;
}
.vision-title {
  --uno: mb-5
    text-3xl
    text-center
    font-bold
    uppercase;
}
.vision-excerpt {
  --uno: text-center
    my-2;
}
</style>
