<template>
  <div>
    <svg width="100%" :height="height" fill="none">
      <circle
        r="400"
        cx="50%"
        :cy="!reversed ? '-32%' : '90%'"
        :style="{ fill: fillColor.bottom, opacity: .8 }"
      />
      <circle
        v-if="!reversed"
        ref="innerCircle"
        r="450"
        cx="50%"
        cy="-55%"
        :style="{ fill: fillColor.top }"
      />
      <defs>
        <mask v-if="image" id="imageClip">
          <!-- La forme crée par le détourage est un simple cercle. -->
          <circle r="450" cx="50%" cy="-55%" :style="{ fill: fillColor.top }" />
        </mask>
      </defs>
      <image
        v-if="image"
        id="image"
        :x="imageLeft"
        y="0"
        :width="imageWidth"
        mask="url(#imageClip)"
        :xlink:href="image"
        preserveAspectRatio
      />
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
      default: 500
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
