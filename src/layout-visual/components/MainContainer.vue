<template>
  <div class="main-container">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="keepInclude">
        <router-view v-if="!$route.meta.link" :key="key" />
      </keep-alive>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'MainContainer',
  data() {
    return {
      keepInclude: false
    }
  },
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
@include B('main-container') {
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style>
