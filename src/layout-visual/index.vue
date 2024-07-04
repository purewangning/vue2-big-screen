<template>
  <v-container class="container" :style="{}">
    <full-page>
      <!-- 头部标题（包括菜单） -->
      <main-header />
      <!-- 内容区 -->
      <main-container />
    </full-page>
  </v-container>
</template>

<script>
import { MainHeader, MainContainer } from './components'
export default {
  name: 'LayoutVisual',
  components: {
    MainHeader,
    MainContainer
  },
  data() {
    return {
      route: null
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  background-color: #eee;
}
</style>
