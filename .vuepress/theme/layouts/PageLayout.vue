<template>
  <main>
    <transition name="slide-down" mode="out-in">
      <h1 :key="$page.frontmatter.title">{{$page.frontmatter.title}}</h1>
    </transition>
    <transition name="slide-down" mode="out-in" duration="300">
      <Content v-show="show.content"/>
    </transition>
  </main>
</template>

<script>
export default {
  name: "PageLayout",
  props: {
    show: {
      type: Object,
      default: {
        title: true,
        content: true
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
@css {
  h1 {
    @apply me-uppercase me-pb-5 me-text-center;
  }
}
</style>
