<template>
  <div>
    <svg width="100%" :height="height" fill="none">
      <circle
        r="400"
        cx="50%"
        :cy="!reversed ? '-32%' : '90%'"
        :style="{ fill: color, opacity: .8  }"
      ></circle>
      <circle v-if="!reversed" r="450" cx="50%" cy="-55%" :style="{ fill: color }"></circle>
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
    fillColor: props.color
  })
};
</script>
<style scoped>
div {
  overflow: hidden;
  height: 300px;
}
circle {
  transform-origin: 50% 0;
  transition: all 600ms linear;
}

@keyframes pulse {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: scaleY(0.9);
  }
  100% {
    transform: translateY(0);
  }
}

.pulse {
  animation: pulse 600ms alternate infinite
    cubic-bezier(0.455, 0.03, 0.515, 0.955);
}
</style>
