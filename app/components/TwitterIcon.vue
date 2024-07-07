<template>
  <a :href="'https://twitter.com/' + url" target="_blank" class="i-line-md:twitter-x"></a>
</template>
<script>
export default {
  props: {
    url: {
      type: String,
      default: ''
    }
  }
}
</script>
<style scoped>
a {
  --uno: w-6 h-6 m-0;
}
</style>
