<template>
  <div>
    <Nav/>
    <transition :name="transitionName" mode="out-in" duration="300">
      <component class="main-content" :is="layout" :show="show"></component>
    </transition>
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
    ...layouts
  },
  data() {
    return {
      transitionName: "slide-left",
      show: {
        title: false,
        content: false
      }
    };
  },
  computed: {
    layout() {
      return this.$page.frontmatter.layout || "HomeLayout";
    }
  },
  watch: {
    $route(to, from) {
      const toDepth = to.path.split("/").length;
      const fromDepth = from.path.split("/").length;
      this.transitionName = toDepth > fromDepth ? "slide-right" : "slide-left";
    }
  }
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
    @apply me-p-4 me-border-0 me-mx-auto;
  }
  @screen md {
    .main-content {
      max-width: config(screens.lg);
    }
  }

  @screen md {
    .main-content {
      @apply me-p-16 me-pt-8;
    }
  }
}
</style>