<!--
 * @Author: wei.chen
 * @Date: 2020-06-11 12:42:39
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-12-06 18:58:16
 * @Descripttion:
-->
<template>
  <section class="app-main">
    <div class="main_layout_content">
      <transition name="fade-transform" mode="out-in">
        <router-view :key="key" />
      </transition>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      //--------------
      // console.log('this.$route.path',this.$router.options.routes,this.$route.path)
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  /*min-height: calc(100vh);*/
  height: 100vh;
  width: 100%;
  position: relative;
  /* padding: 20px; */
  overflow: auto;


}
.app-main .main_layout_content{
    background-color: #fff;
  border-radius: 5px;
  height: calc(100vh - 52px);
  }
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
