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
