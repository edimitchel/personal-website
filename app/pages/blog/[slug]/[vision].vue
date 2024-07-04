<template>
  <Vision :content="selectedVision" />
</template>

<script setup lang="ts">
defineProps<{ selectedVision: string }>()
</script>
