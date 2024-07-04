<template>
  <div
    :style="{
      width: baseWidth + 'px',
      height: baseHeight + 'px',
      transform: `scale(${w / 1920})`
    }"
    class="v-ad-container"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    baseWidth: {
      type: Number,
      default() {
        return 1920
      }
    },
    baseHeight: {
      type: Number,
      default() {
        return 1080
      }
    }
  },
  data() {
    return {
      w: 1920,
      h: 1080
    }
  },
  mounted() {
    this.w = window.innerWidth
    this.h = (window.innerWidth * 1080) / 1920
    this.selfAdaption()
  },
  methods: {
    selfAdaption() {
      const _this = this
      setTimeout(() => {
        window.onresize = () => {
          _this.w = window.innerWidth
          _this.h = (window.innerWidth * 1080) / 1920
        }
      }, 100)
    }
  }
}
</script>

<style lang="scss" scoped>
.v-ad-container {
  transform-origin: left top;
  position: relative;
  transform: translate3d(0, 0, 0);
}
</style>
