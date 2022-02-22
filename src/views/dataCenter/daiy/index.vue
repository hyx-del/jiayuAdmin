
<template>
  <div class="box">
    <el-form :inline="true" :model="ruleForm" ref="ruleForm" class="demo-form-inline">
      <el-form-item label="发起时间">
        <el-date-picker @change="onChange" v-model.trim="ruleForm.regDate" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" value-format="timestamp"></el-date-picker>
      </el-form-item>
      <el-button type="primary" size="small" @click="onClickSearch($event, 'click')">查询</el-button>
    </el-form>
    <Table refHead="ruleForm" :loadData="getList" :column="column" ref="userList" :showSortIndex="{ show: true, lable: '序号' }"> </Table>
  </div>
</template>

<script>
import Table from "@/components/Table/index";
import { parseTime } from "@/utils";
//获取邀请记录，邀请规则
import { registerDaiy } from "@/api/dataCenter";
import { Message } from "element-ui";
export default {
  components: {
    Table,
  },
  data() {
    return {
      ruleForm: {
        startDay: null, //开始时间
        endDay: null, //截至时间
      },
      column: [
        {
          prop: "createTime",
          label: "",
          children: [
            {
              prop: "time",
              label: "日期",
            },
          ],
        },
        {
          prop: "nickname",
          label: "瑜伽",
          children: [
            {
              prop: "yogaPratice",
              label: "练习次数",
            },
            {
              prop: "yogaComment",
              label: "评论条数",
            },
            {
              prop: "yogaShare",
              label: "分享次数",
            },
          ],
        },
        {
          prop: "phone",
          label: "冥想",
          children: [
            {
              prop: "meditationPratice",
              label: "播放次数",
            },
            {
              prop: "meditationComment",
              label: "评论条数",
            },
            {
              prop: "meditationShare",
              label: "分享次数",
            },
          ],
        },
        {
          prop: "inviteNickname",
          label: "幸福智慧",
          children: [
            {
              prop: "jananPratice",
              label: "播放次数",
            },
            {
              prop: "jananComment",
              label: "评论条数",
            },
            {
              prop: "jananShare",
              label: "分享次数",
            },
          ],
        },
        {
          prop: "invitePhone",
          label: "日新增数据",
          children: [
             {
              prop: "countNum",
              label: "共计",
            },
            {
              prop: "androidNum",
              label: "安卓",
            },
            {
              prop: "iosNum",
              label: "ios",
            },
            {
              prop: "appletNum",
              label: "小程序",
            },
            {
              prop: "invitationNum",
              label: "邀请H5",
            },
           
          ],
        },
        {
          prop: "invitePhone",
          label: "积分数据",
          children: [
         
            {
              prop: "retainedScore",
              label: "平台留存积分",
            },
            {
              prop: "obtainScore",
              label: "用户获取总积分",
            },
               {
              prop: "consumptionScore",
              label: "用户消耗总积分",
            },
          ],
        },
      ],
    };
  },
  created() {},
  computed: {
    getList() {
      return registerDaiy;
    },
  },
  methods: {
    //开始结束时间
    onChange(value) {
      if (value) {
        let distance = parseInt(value[1] - value[0]);
        let day = parseInt(31 * 24 * 60 * 60 * 1000);
        if (distance > day) {
          return Message({
            message: "查询时间不能超过31天",
            type: "error",
            duration: 2000,
          });
        } else {
          this.ruleForm.startDayS = value[0];
          this.ruleForm.endDayS = value[1];
        }
      } else {
        this.ruleForm.startDayS = null;
        this.ruleForm.endDayS = null;
      }
    },
    //回车键搜索
    onClickSearch(e, type) {
      if (type == "click" || e.keyCode == 13) {
        this.$refs.userList.update(this.ruleForm);
      }
    },
    //重置
    reset() {
      this.ruleForm = {
        phone: null, //邀请人手机号
        grantState: "", //积分发放状态
        starTime: null, //开始时间
        endTime: null, //截至时间
        rule: "", //邀请规则
      };
      //  this.$refs.userList.update(this.ruleForm);
    },
  },
  mounted() {
    //搜索的键盘事件
    const that = this;
    document.addEventListener("keydown", that.onClickSearch);
  },
};
</script>

<style>
.box {
  padding: 20px !important;
}
</style>
