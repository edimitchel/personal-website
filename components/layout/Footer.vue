<template>
  <footer class="me-sticky">
    <div class="me-text-med me-text-center">
      &copy; {{ year }} Michel Edighoffer
    </div>
  </footer>
</template>
<script>
export default {
  name: 'Footer',
  computed: {
    circleColor() {
      return (
        this.$page.frontmatter.footerColor ||
        this.$page.frontmatter.headerColor ||
        undefined
      )
    },
    year() {
      return new Date().getFullYear()
    }
  }
}
</script>
<style lang="postcss">
footer {
  @apply me-font-mono
    me-flex
    me-items-center
    me-flex-col
    me-text-center
    me-p-4;
}
.background {
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1;
  @apply me-absolute;
}
</style>
