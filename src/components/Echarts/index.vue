<template>
  <div :id="id" :style="chartStyle"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  props: {
    id: {
      type: String,
      default: 'sss'
    },
    chartStyle: {
      type: Object,
      default: function () {
        return {
          width: '300px',
          height: '300px'
        }
      }
    },
    option: {
      type: Object,
      default: () => ({})
    },
    notMerge: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    lazyUpdate: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    silent: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data() {
    return {
      myCharts: ''
    }
  },
  watch: {
    option: {
      handler(val) {
        if (val) {
          this.myCharts.clear()
          this.myCharts.setOption(
            val,
            this.notMerge,
            this.lazyUpdate,
            this.silent
          )
        }
      },
      deep: true
    }
  },
  mounted() {
    this.myCharts = echarts.init(document.getElementById(this.id))
    this.myCharts.clear()
    this.myCharts.setOption(
      this.option,
      this.notMerge,
      this.lazyUpdate,
      this.silent
    )
    this.$emit('getChartInstance', this.myCharts)
    window.addEventListener('resize', () => {
      setTimeout(() => {
        this.myCharts.resize()
      }, 100)
    })
  }
}
</script>

<style lang="scss" scoped></style>
