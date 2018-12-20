<template>
  <div>
    <svg width="100%" :height="height" fill="none">
      <circle
        r="360"
        cx="50%"
        :cy="!reversed ? '-20%' : '90%'"
        :class="{'pulse': pulse}"
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
      default: "#c5c5c5",
    },
    height: {
      type: Number,
      default: 500,
    },
    pulse: Boolean,
    reversed: Boolean,
  },
  data: props => ({
    fillColor: props.color,
  }),
};
</script>
<style scoped>
div {
  overflow: hidden;
  height: 300px;
}
circle {
  transform-origin: 50% 0;
  transition: all 600ms ease;
}

@keyframes pulse {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  50% {
    transform: translateY(-5px);
    opacity: 0.5;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.pulse {
  animation: pulse 600ms alternate infinite linear;
}
</style>
