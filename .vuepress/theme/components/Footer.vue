<template>
  <footer class="me-sticky">
    <!-- <circle-background reversed class="background" :color="circleColor"/> -->
    <div class="me-text-med me-text-center">&copy; 2018 Michel Edighoffer</div>
  </footer>
</template>
<script>
export default {
  name: "Footer",
  computed: {
    circleColor() {
      return (
        this.$page.frontmatter.footerColor ||
        this.$page.frontmatter.headerColor ||
        undefined
      );
    }
  }
};
</script>
<style lang="stylus" scoped>
@css {
  footer { 
    @apply 
      me-font-mono 
      me-flex 
      me-items-center 
      me-flex-col 
      me-text-center 
      me-p-4
      me-border-0 
      me-border-t 
      me-border-grey 
      me-border-solid;
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
