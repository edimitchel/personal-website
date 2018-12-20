<template>
  <main>
    <transition name="slide-down">
      <h1 v-show="show.title">{{$page.frontmatter.title}}</h1>
    </transition>
    <transition>
      <Content v-show="show.content" />
    </transition>
  </main>
</template>

<script>
export default {
  name: "PageLayout",
  props: {
    show: Object
  }
};
</script>
<style lang="stylus" scoped>
@css {
  h1 {
    @apply me-pb-5 me-text-center;
  }
}
</style>
