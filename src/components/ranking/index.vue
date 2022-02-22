<!--
 * @Author: jiu yin
 * @Date: 2021-07-22 10:43:15
 * @LastEditTime: 2021-08-25 15:23:09
 * @LastEditors: jiu yin zhen jing
 * @Description: 666
 * @FilePath: \jiayu_admin\src\components\ranking\index.vue
 *  “”
-->
<template>
  <div class="ranking" @mouseover="autoplay = false" @mouseout="autoplay = false">
    <div class="title">
      <span>{{ title }}</span>
      <el-form :inline="true" :model="obj" ref="ruleForm" class="demo-form-inline">
        <el-form-item label=""> <el-date-picker @change="onChange" v-model.trim="date" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="timestamp" v-if="time" :default-value="currentDate" :picker-options="pickerOptions"></el-date-picker> </el-form-item
      ></el-form>
    </div>

    <!-- <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" v-if="sort">
      <el-menu-item index="0">按播放次数</el-menu-item>
      <el-menu-item index="1">按评论条数</el-menu-item>
      <el-menu-item index="2">按分享数</el-menu-item>
    </el-menu> -->
    <div class="el-menu-demo" v-if="sort">
      <div :class="{ 'el-menu-item': true, 'is-active': index == obj.type ? true : false }" v-for="(item, index) in tab" :key="index" @click="handleSelect(index)">{{ item }}</div>
    </div>
    <div class="el-menu-demos" v-if="sorts"></div>
    <!-- 轮播 -->
    <el-carousel indicator-position="none" direction="vertical" @change="changeCarousel" ref="carousel" :autoplay="autoplay" height="335px" :interval="4000">
      <el-carousel-item v-for="(i, index) in totalData" :key="index">
        <ul class="progress" v-if="!noData">
          <li v-for="item in i" :key="item.id">
            <p :style="{ color: item.id < 4 ? '#1890ff' : '#909399' }">
              No.{{ item.id }}<span>{{ item.resourceName }}</span
              ><i>{{ toLocaleStrings(item.number) }}</i>
            </p>
            <el-progress :percentage="item.percent" :color="item.id < 4 ? '#1890ff' : '#909399'" :show-text="false"></el-progress>
          </li>
        </ul>
        <div class="noData" v-if="noData">
          <img src="@/icons/png/backstage_img_enptylist.png" alt="" />
          <p>暂无数据</p>
        </div>
      </el-carousel-item>
    </el-carousel>
    <!-- 分页 -->
    <el-pagination small layout="prev, pager, next" :total="original.length" :page-size="5" @current-change="changeCurrent" :current-page="index"> </el-pagination>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { Message } from "element-ui";
import { parseTime, toLocaleString } from "@/utils";
export default {
  props: {
    //头部信息
    title: {
      type: String,
      default: "瑜伽课程排名（总）",
    },
    //后端名字
    name: {
      type: String,
      default: "resourceName",
    },
    // 时间选择器是否显示
    time: {
      type: Boolean,
      default: true,
    },
    //排序显示
    sort: {
      type: Boolean,
      default: false,
    },
    //第一排占位
    sorts: {
      type: Boolean,
      default: false,
    },
    //传入参数
    params: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 渲染数据函数
    data: {
      type: Function,
      default: async () => {},
      // required:true
    },
  },
  components: {},
  data() {
    return {
      //暂无数据快关
      noData: false,
      tab: ["按播放次数", "按评论条数", "按分享数"],
      //当前分页
      index: 1,
      //循环显示
      autoplay: false,
      //子传父
      obj: {
        startDay: this.yesterday(), //开始时间
        endDay: this.yesterday(), //结束时间
        type: 0, //选项卡
      },
      date: [this.yesterday("data"), this.yesterday("data")],
      //时间默认上个月
      currentDate: new Date().getTime() - 24 * 60 * 60 * 1000 * 30,
      //禁用今天之后
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()- 24 * 60 * 60 * 1000;
        },
      },
      //原始数据
      original: [],
      //处理后渲染数据
      totalData: [],
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    //开始结束时间
    onChange(value) {
      //清空
      if (!value) {
        this.obj = {
          startDay: this.yesterday(), //开始时间
          endDay: this.yesterday(), //结束时间
          type: this.obj.type, //选项卡
        };
        console.log(this.obj);
        this.activeIndex = 0;
        //分页调到第一页
        this.$refs.carousel.setActiveItem(0);
        this.getDate();
      }
      //最大一年 最小7
      //开始时间戳
      let start = value[0];
      //结束时间搓
      let end = value[1];
      if (start && end) {
        let scope = parseInt((end - start) / (24 * 60 * 60 * 1000));
        console.log(scope);
        //需求改后 占时无用
        if (scope < 0) {
          this.$alert("警告哦，最少选择当前日期1天以上,请重新查询", {
            confirmButtonText: "确定",
            callback: (action) => {},
          });
          //自定义错误
          return;
        } else if (scope > 365) {
          this.$alert("警告哦，最多选择当前一年以内1天以上,请重新查询", {
            confirmButtonText: "确定",
            callback: (action) => {},
          });
        } else {
          Message({
            message: "当前查询周期为" + (scope ? scope : 1) + "天",
            type: "success",
            duration: 2000,
          });
          this.obj.startDay = parseTime(value[0]).split(" ")[0];
          this.obj.endDay = parseTime(value[1]).split(" ")[0];
          //回到状态1播放
          // this.obj.type = 0;
          this.getDate();
        }
      }
    },
    //选项卡事件
    handleSelect(key) {
      console.log(key);
      this.obj.type = key;
      this.getDate();
      console.log(this.obj);
    },
    //分页
    changeCurrent(e) {
      console.log(e - 1);
      //轮播是下标点击少1
      this.$refs.carousel.setActiveItem(e - 1);
    },
    //轮播图
    changeCarousel(e) {
      // console.log(e);
      //滚动是小标 分页+1
      this.index = e + 1;
    },

    //处理25条数据格式
    filterArr(newArr, oldArr) {
      let num;
      if (oldArr[0].number == "null") {
        num = 0;
      } else {
        num = oldArr[0].number;
      }
      let [a, b, c, d, e] = [[], [], [], [], []]; //25条数据
      oldArr.map((item, index) => {
        //百分比处理
        let percent = item.number ? parseInt((item.number / num) * 100) : 0;
        item.percent = percent;
        //排名
        item.id = index + 1;
        //后端返回名字不一样
        item.resourceName = item[this.name];
        switch (true) {
          case index <= 4:
            a.push(item);
            break;
          case index >= 5 && index <= 9:
            b.push(item);
            break;
          case index >= 10 && index <= 14:
            c.push(item);
            break;
          case index >= 15 && index <= 19:
            d.push(item);
            break;
          case index >= 20 && index <= 24:
            e.push(item);
            break;
          default:
            break;
        }
      });
      newArr = [a, b, c, d, e].filter((item) => {
        return item.length != 0;
      });
      return newArr;
    },
    //昨天时间 默认
    yesterday(data) {
      let d = new Date().getTime();
      let yesterday = d - 24 * 60 * 60 * 1000;
      if (data) {
        //返回时间戳  主要是默认时间组件返显
        return yesterday;
      } else {
        //接口传参
        return parseTime(yesterday).split(" ")[0];
      }
    },
    // //前天时间 默认
    // beforeYesterday() {
    //   let d = new Date().getTime();
    //   let yesterday = d - 24 * 60 * 60 * 1000 * 2;
    //   return parseTime(yesterday).split(" ")[0];
    // },
    //获取数据
    getDate() {
      this.data({ ...this.obj, ...this.params }).then((res) => {
        if (res.code == 200) {
          this.original = res.data.records;
          if (this.original.length != 0) {
            //暂无数据开关
            this.noData = false;
            this.totalData = this.filterArr(this.totalData, this.original);
          } else {
            this.noData = true;
            this.totalData = [[]];
            return;
          }
        }
      });
    },
    //千分位
    toLocaleStrings(num) {
      return toLocaleString(num);
    },
  },

  mounted() {
    //相同接口 传值状态
    this.$emit("obj", this.obj);
    this.getDate();
  },
};
</script>
<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
  list-style: none;
}

.ranking {
  margin: 0 10px 20px 0;
  max-width: 805px;
  min-height: 447px;
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  flex-grow: 1;
  .title {
    max-height: 47px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #dedde2;
    padding-bottom: 5px;
    span {
      font: bold 16px/40px "微软雅黑";
      color: #222224;
      min-width: 208px;
    }
    .demo-form-inline {
      width: 358px;
      height: 41px;
    }
  }
  .el-menu-demo {
    display: flex;
    margin-top: 10px;
    border: none;
    :first-child {
      border-radius: 4px 0px 0px 4px;
    }
    :last-child {
      border-radius: 0px 4px 4px 0px;
    }
    .el-menu-item {
      height: 32px;
      opacity: 1;
      background: #ffffff;
      border: 1px solid #dedde2 !important;
      color: #222224;
      font: 14px/32px "微软雅黑";
      margin-left: -1px;
      padding: 0 17px;
    }
    .is-active {
      background: #1890ff;
      color: #ffffff;
    }
  }
  .el-menu-demos {
    height: 32px;
    width: 100%;
    margin-top: 10px;
  }
  .progress {
    li {
      max-height: 68px;
      //   border-bottom: 2px solid #d7ecff;
      p {
        color: #1890ff;
        font-size: 16px;
        padding-top: 29px;
        padding-bottom: 3px;
      }
      span {
        display: inline-block;
        color: #222224;
        text-indent: 9px;
      }
      i {
        color: #222224;
        font-style: normal;
        float: right;
        padding-right: 3px;
        font-weight: bold;
      }
    }
  }
  .noData {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    img {
      width: 256px;
      height: 175px;
    }
    p {
      color: #999999;
      font-size: 18px;
      text-align: center;
      padding-top: 30px;
    }
  }
  .el-pagination {
    float: right;
    // margin-top: 24px;
  }
}
</style>
