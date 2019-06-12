<template>
  <div>
    <svg :width="width" fill="none" viewBox="0 0 500 80">
      <path id="curve" :d="path" />
      <text :text-anchor="textAlign" :style="textStyle">
        <textPath xlink:href="#curve" startOffset="50%" :fill="color">
          <slot />
        </textPath>
      </text>
    </svg>
    <component :is="'h' + titleLevel" :aria-label="text" class="sr-only">
      {{ text }}
    </component>
  </div>
</template>
<script>
export default {
  props: {
    color: {
      type: String,
      default: 'black'
    },
    titleLevel: {
      type: [Number, String],
      default: 1
    },
    align: {
      type: String,
      default: 'middle'
    },
    textStyle: {
      type: [String, Object],
      default: undefined
    },
    width: {
      type: Number,
      default: 500
    }
  },
  computed: {
    textAlign() {
      switch (this.align) {
        case 'left':
          return 'start'

        case 'right':
          return 'end'

        case 'center':
        default:
          return 'middle'
      }
    },
    path() {
      return `M 0 0 Q ${this.width / 2} 150 ${this.width} 0`
    },
    text() {
      return this.$slots.default[0].text.replace(/\s/g, '')
    }
  }
}
</script>
<style scoped>
.sr-only {
  display: none;
}
svg {
  height: 80px;
}
text {
  transition: all .2s;
}
</style>
