<template>
  <div :class="{'top-2!': alone}">
    <svg :width="width" fill="none" viewBox="0 0 500 90">
      <path id="curve" :d="path" />
      <text :text-anchor="textAlign" :class="{ 'tracking-widest': alone }">
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
      default: 'center'
    },
    alone: {
      type: Boolean,
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
      return `M 0 0 Q ${this.width / 2} 160 ${this.width} 0`
    },
    text() {
      return this.$slots.default()[0].children.replace(/\s/g, '')
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
  transition: all 0.2s;
}
</style>
