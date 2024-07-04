<template>
  <footer class="sticky font-mono ">
    <div class="text-med text-center">
      &copy; {{ year }} Michel Edighoffer
    </div>
  </footer>
</template>
<script setup lang="ts">
  const year = new Date().getFullYear()
</script>
