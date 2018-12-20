<template>
  <div>
    <Nav/>
    <component class="main-content" :is="layout" :show="show"></component>
    <Footer/>
  </div>
</template>
<script>
import Nav from "./components/Nav.vue";
import Footer from "./components/Footer.vue";
import layouts from "./layouts";

export default {
  components: {
    Nav,
    Footer,
    ...layouts,
  },
  data() {
    return {
      show: {
        title: false,
        content: false,
      },
    };
  },
  computed: {
    layout() {
      return this.$page.frontmatter.layout || "HomeLayout";
    }
  },
};
</script>

<style src="./styles/theme.styl" lang="stylus"></style>
<style lang="stylus">
@css {
  body {
    @apply me-font-mono;
  }
  .main-content {
    max-width: config(screens.md);
    @apply me-p-4 me-border-solid me-border-grey me-border-0 me-border-t me-border-b me-mx-auto;
  }

  @screen md {
    .main-content {
      @apply me-p-16 me-pt-8;
    }
  }
}
</style>