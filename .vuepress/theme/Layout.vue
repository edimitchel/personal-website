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
  watch: {
    layout() {
      this.$data.show.title = false;
      this.$data.show.content = false;
      setTimeout(() => this.$data.show.title = true);
      setTimeout(() => this.$data.show.content = true, 1000);
    },
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
    max-width: 768px;
    @apply me-p-4 me-border-solid me-border-grey me-border-0 me-border-t me-mx-auto;
  }

  @screen md {
    .main-content {
      @apply me-p-16 me-pt-8;
    }
  }
}
</style>
<style lang="stylus" scoped>
.main-content {
  .slide-down-enter-active, .slide-down-leave-active {
    transition: all 0.2s;
    position: relative;
  }

  .slide-down-enter, .slide-down-leave-to {
    opacity: 0;
    top: -10px;
  }

  .slide-down-enter-to, .slide-down-leave {
    opacity: 1;
    top: 0;
  }
}
</style>