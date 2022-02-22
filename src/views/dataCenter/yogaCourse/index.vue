<!--
 * @Author: jiu yin
 * @Date: 2021-07-20 15:12:09
 * @LastEditTime: 2021-08-05 10:26:49
 * @LastEditors: jiu yin zhen jing
 * @Description: 666
 * @FilePath: \jiayu_admin\src\views\dataCenter\yogaCourse\index.vue
 *  “”
-->
<template>
  <div>
    <div class="yogaCourse">
      <ran-king title="瑜伽课程排名（总）" :sort="true" :data="courseListBoard" :params="from" name='resourceName'></ran-king>
      <ran-king title="日练习时长排行榜（分钟）" :data="minuteBoard" :params="from" name='nickname' :sorts="true"></ran-king>
    </div>
    <div class="yogaCourse">
      <ran-king :time="false"  title="累计练习时长（分钟）排行榜"  :data="minuteSumBoard" :params="from" name='nickname'></ran-king>
      <ran-king :time="false"  title="累计练习时长（天数）排行榜"  :data="daySumBoard" :params="from" name='nickname'></ran-king>
    </div>
    <div class="yogaCourse noJustify">
      <ran-king :time="false"  title="连续练习天数排行榜"  :data="dayContinueBoard" :params="from" name='nickname'></ran-king>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import ranKing from "@/components/ranking/index.vue";
// 瑜伽课程排行,日练习排行时长,累计时长（分钟）排行,累计练习时长（天数),连续练习天数排行
import { courseListBoard, minuteBoard, minuteSumBoard, daySumBoard, dayContinueBoard } from "@/api/dataCenter.js";
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
    courseListBoard() {
      return courseListBoard;
    },
    minuteBoard() {
      return minuteBoard;
    },
    minuteSumBoard() {
      return minuteSumBoard;
    },
    daySumBoard() {
      return daySumBoard;
    },
    dayContinueBoard() {
      return dayContinueBoard;
    },
  },
  methods: {
    ...mapActions({}),
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
  min-height: 447px;
  // background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  flex-grow: 1;
}
</style>
