<template>
  <div>
    <Nav/>
    <component class="main-content me-container" :is="layout"></component>
    <Footer/>
  </div>
</template>
<script>
import Nav from "./components/Nav.vue";
import Footer from "./components/Footer.vue";
import HomeLayout from "./layouts/HomeLayout.vue";
import BlogLayout from "./layouts/BlogLayout.vue";

export default {
  components: { Nav, Footer, HomeLayout, BlogLayout },
  computed: {
    layout() {
      return this.$page.frontmatter.layout || "HomeLayout";
    }
  }
};
</script>

<style lang="stylus">
@import './styles/theme.styl';

@css {
  body {
    @apply me-font-mono;
  }
  .main-content {
    @apply me-p-16 me-pt-8 me-border-t;
  }
}
</style>