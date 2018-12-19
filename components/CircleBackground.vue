<template>
  <div>
    <svg width="100%" :height="height" fill="none">
      <circle
        r="360"
        cx="50%"
        :cy="!reversed ? '-20%' : '90%'"
        :class="{pulse: pulse}"
        :style="{ fill: color }"
      ></circle>
    </svg>
  </div>
</template>
<script>
export default {
  props: {
    color: {
      type: String,
      default: "#c5c5c5"
    },
    height: {
      type: Number,
      default: 500
    },
    reversed: Boolean
  },
  data: props => ({
    fillColor: props.color,
    pulse: false,
  }),
};
</script>
<style scoped>
div {
  overflow: hidden;
  height: 300px;
}
circle {
  transition: all 0.5s ease;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

.pulse {
  animation: pulse 2s alternate infinite linear;
}
</style>
