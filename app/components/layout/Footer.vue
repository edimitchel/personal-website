<template>
  <footer class="font-mono py-2">
    <div class="text-sm text-center">
      &copy; {{ year }} Michel Edighoffer
    </div>
  </footer>
</template>
<script setup lang="ts">
  const year = new Date().getFullYear()
</script>
<style scoped>
.background {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1;
}
</style>
