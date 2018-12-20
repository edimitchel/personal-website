<template>
  <main>
    <h1>{{$page.frontmatter.title}}</h1>
    <Content/>
  </main>
</template>

<script>
export default {
  name: "BlogLayout"
};
</script>
<style lang="stylus" scoped>
@css {
  main {
  }
  h1 {
    @apply me-pb-5 me-text-center;
  }
}
</style>
