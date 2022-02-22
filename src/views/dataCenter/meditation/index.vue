<!--
 * @Author: jiu yin
 * @Date: 2021-07-20 15:12:09
 * @LastEditTime: 2021-07-27 17:57:47
 * @LastEditors: jiu yin zhen jing
 * @Description: 666
 * @FilePath: \jiayu_admin\src\views\dataCenter\meditation\index.vue
 *  “”
-->
<template>
  <div>
    <div class="yogaCourse">
      <ran-king title="冥想播放次数排行榜" :data="meditationBoard" :params="from" @obj="obj"></ran-king>
      <ran-king title="冥想评论条数排行榜" :data="meditationBoard" :params="from" @obj="obj1"></ran-king>
    </div>
    <div class="yogaCourse noJustify">
      <ran-king title="冥想分享次数排行榜" :data="meditationBoard" :params="from" @obj="obj2"></ran-king>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import ranKing from "@/components/ranking/index.vue";
//冥想排行
import { meditationBoard } from "@/api/dataCenter.js";
export default {
  props: [],
  components: {
    ranKing,
  },
  data() {
    return {
      from: {
        size: 25,
        current: 1,
      },
    };
  },
  computed: {
    ...mapGetters({}),
    meditationBoard() {
      return meditationBoard;
    },
  },
  methods: {
    ...mapActions({}),
    obj(e) {
      return (e.type = 0);
    },
    obj1(e) {
      return (e.type = 1);
    },
    obj2(e) {
      return (e.type = 2);
    },
  },
  mounted() {},
};
</script>
<style scoped lang="scss">
.yogaCourse {
  display: flex;
  justify-content: space-around;
  background: #f0f2f5;
}
.noJustify:after {
  display: block;
  content: "";
  margin: 0 0px 20px 0;
  max-width: 805px;
  min-height: 477px;
  // background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  flex-grow: 1;
}
</style>
