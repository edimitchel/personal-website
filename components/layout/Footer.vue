<template>
  <footer class="sticky">
    <div class="text-med text-center">
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
  @apply font-mono
    flex
    items-center
    flex-col
    text-center
    p-4;
}
.background {
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1;
  @apply absolute;
}
</style>
