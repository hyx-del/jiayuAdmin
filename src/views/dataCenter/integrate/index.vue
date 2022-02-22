<!--
 * @Author: jiu yin
 * @Date: 2021-07-20 15:12:09
 * @LastEditTime: 2021-07-27 17:57:17
 * @LastEditors: jiu yin zhen jing
 * @Description: 666
 * @FilePath: \jiayu_admin\src\views\dataCenter\integrate\index.vue
 *  “”
--><template>
  <div>
    <div class="yogaCourse">
      <ran-king title="积分余额排行榜" :data="scoreBoard" :params="from" @obj="obj" name="nickname" :time="false"></ran-king>
      <ran-king title="积分获得排行榜" :data="scoreBoard" :params="from" @obj="obj1" name="nickname"></ran-king>
    </div>
    <div class="yogaCourse noJustify">
      <ran-king title="积分消费排行榜" :data="scoreBoard" :params="from" @obj="obj2" name="nickname"></ran-king>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import ranKing from "@/components/ranking/index.vue";
//冥想排行
import { scoreBoard } from "@/api/dataCenter.js";
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
    scoreBoard() {
      return scoreBoard;
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
  min-height: 447px;
  // background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  flex-grow: 1;
}
</style>
