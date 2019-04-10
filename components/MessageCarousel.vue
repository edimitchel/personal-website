<template>
  <transition
    :name="transitionName"
  >
    <slot :data="dataList[index]" />
  </transition>
</template>
<script>
let timerId
export default {
  props: {
    alive: {
      type: Boolean,
      default: true
    },
    dataList: {
      type: Array,
      default: () => []
    },
    transitionName: {
      type: String,
      default: 'fade'
    },
    duration: {
      type: Number,
      default: 5000
    }
  },
  data({ dataList }) {
    return {
      index: 0
    }
  },
  watch: {
    dataList() {
      this.index = 0
      this.run()
    }
  },
  created() {
    this.run()
  },
  methods: {
    run() {
      if (timerId) {
        clearInterval(timerId)
      }
      timerId = setInterval(() => {
        if (this.dataList.length > 0) {
          this.setIndex((this.index + 1) % this.dataList.length)
        }
      }, this.duration)
    }
  },
  destroy() {
    if (timerId) {
      clearInterval(timerId)
    }
  }
}
</script>
