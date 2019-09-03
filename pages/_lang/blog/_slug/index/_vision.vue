<template>
  <Vision :content="selectedVision" />
</template>

<script>
import Vision from '@/components/Vision'
export default {
  props: ['selectedVision'],
  components: {
    Vision
  }
}
</script>
