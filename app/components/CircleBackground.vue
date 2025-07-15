<template>
  <div :class="{ pulse }" class="side-shadow">
    <svg width="100%" :height="height" fill="none">
      <circle :r="height - 75" cx="50%" cy="-35%" :style="{ fill: fillColor.bottom, opacity: 1 }" />
      <circle :r="height - 90" cx="50%" cy="-24%" :style="{ fill: fillColor.bottom, opacity: .5 }" />
      <circle v-if="!reversed" ref="innerCircle" :r="height - 40" cx="50%" cy="-58%" :style="{ fill: fillColor.top }" />
      <!-- Indeterminate progress indicator border -->
      <circle v-if="pulse" class="progress-border indeterminate" :r="height + 25 + progressWidth / 2" cx="50%" cy="-60%"
        :stroke="progressColor" :stroke-width="progressWidth" fill="none"
        :stroke-dasharray="progressCircumference * 0.25 + ',' + progressCircumference * 0.20 + ',' + progressCircumference * 0.35" />
      <defs>
        <mask v-if="image" id="imageClip">
          <!-- La forme crée par le détourage est un simple cercle. -->
          <circle :r="height - 40" cx="50%" cy="-58%" />
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
      default: () => ['white', '#eee']
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
    },
    progressColor: {
      type: String,
      default: '#aaa'
    },
    progressWidth: {
      type: Number,
      default: 3
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
    },
    progressCircumference() {
      return 2 * Math.PI * (this.height - 110)
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

.progress-border {
  transform-origin: 50% -60%;
  stroke-linecap: round;
}

.indeterminate {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
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

  clip-path: ellipse(319px 100% at 50% -24%);
  backdrop-filter: blur(4px);
}

.side-shadow::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  z-index: 200;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, #f9f9f9, transparent, #f9f9f9);
}
</style>
