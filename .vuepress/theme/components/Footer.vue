<template>
  <footer class="me-sticky">
    <!-- <circle-background reversed class="background" :color="circleColor"/> -->
    <div class="me-text-med me-text-center">&copy; 2018 Michel Edighoffer</div>
  </footer>
</template>
<script>
import CircleBackground from "@components/CircleBackground";

export default {
  name: "Footer",
  components: {
    CircleBackground
  },
  data: () => ({
    circleColor: undefined
  }),
  mounted() {
    const { footerColor, headerColor } = this.$page.frontmatter;
    this.circleColor = footerColor || headerColor || undefined;
  }
};
</script>
<style lang="stylus" scoped>
@css {
  footer { 
    @apply me-font-mono me-flex me-items-center me-flex-col me-text-center me-p-10;
  }
  .background {
    @apply me-absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
  }
}
</style>
