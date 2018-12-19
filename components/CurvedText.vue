<template>
  <div>
    <svg width="500" fill="none">
      <path id="curve" d="M 0 -25 Q 250 150 500 -25 "></path>
      <text :text-anchor="textAlign" :style="textStyle">
        <textPath xlink:href="#curve" startOffset="50%" :fill="color">
          <slot></slot>
        </textPath>
      </text>
    </svg>
    <h1><slot /></h1>
  </div>
</template>
<script>
export default {
  props: {
    color: {
      type: String,
      default: "black"
    },
    align: {
      type: String
    },
    textStyle: {
      type: [String, Object],
      default: undefined
    }
  },
  computed: {
    textAlign() {
      switch (this.align) {
        case "left":
          return "start";

        case "right":
          return "end";

        case "center":
        default:
          return "middle";
      }
    }
  }
};
</script>
<style scoped>
h1 {
  display: none;
}
svg {
  height: 80px;
}
</style>

