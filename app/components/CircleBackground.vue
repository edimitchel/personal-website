<template>
  <div :class="{ pulse }" class="side-shadow">
    <svg width="100%" :height="height" fill="none">
      <circle :r="height - 75" cx="50%" cy="-32%" :style="{ fill: fillColor.bottom, opacity: .8 }" />
      <circle :r="height - 90" cx="50%" cy="-20%" :style="{ fill: fillColor.bottom, opacity: .2 }" />
      <circle v-if="!reversed" ref="innerCircle" :r="height - 40" cx="50%" cy="-55%" :style="{ fill: fillColor.top }" />
      <defs>
        <mask v-if="image" id="imageClip">
          <!-- La forme crée par le détourage est un simple cercle. -->
          <circle r="450" cx="50%" cy="-55%" :style="{ fill: fillColor.top }" />
        </mask>
      </defs>
      <image v-if="image" id="image" :x="imageLeft" y="0" :width="imageWidth" mask="url(#imageClip)" :xlink:href="image"
        preserveAspectRatio />
    </svg>
  </div>
</template>
<script>
export default {
  props: {
    color: {
      type: [String, Array],
      default: () => ['white', '#ddd']
    },
    height: {
      type: Number,
      default: 420
    },
    pulse: {
      type: Boolean,
      default: false
    },
    reversed: Boolean,
    image: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      imageLeft: 0,
      imageWidth: '100%'
    }
  },
  computed: {
    fillColor() {
      const color = Array.isArray(this.color)
        ? this.color
        : this.color.split(/,\|/)
      const [top, bottom = top] = color
      return {
        top,
        bottom
      }
    }
  },
  mounted() {
    this.resizeImage()
    window.addEventListener('resize', this.resizeImage.bind(this))
  },
  methods: {
    resizeImage() {
      if (this.image) {
        const { innerCircle } = this.$refs
        if (innerCircle) {
          const { left, width } = innerCircle.getBoundingClientRect()
          this.imageLeft = left
          this.imageWidth = width
        }
      }
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeImage.bind(this))
  }
}
</script>
<style scoped>
div {
  overflow: hidden;
  height: 300px;
  transform-origin: top center;
}

circle {
  transform-origin: 50% 0;
  transition: all 600ms linear;
}

#image {
  opacity: 0.8;
}

@keyframes pulse {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: scaleY(0.99);
  }

  100% {
    transform: translateY(0);
  }
}

.pulse {
  animation: pulse 600ms alternate infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
}

.side-shadow {
  max-width: 700px;
  margin: 0 auto;
  position: relative;
}

.side-shadow::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  z-index: 200;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, white, transparent, white);
}
</style>
