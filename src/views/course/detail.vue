<template>
  <div class="commonPage">
    <div class="myDetail">
      <div class="buttons">
        <el-button @click="cancel" type="danger" size="small">返回列表</el-button>
      </div>
      <div class="detail_left">
        <div class="detail_title">课程基本信息</div>
        <div class="formShowH">
          <formShow ref="formShow" :config="config" :formObj="formObj" :list="list" @button="formButton" />
        </div>
      </div>
      <div class="detail_right">
        <el-tabs refHead="200" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="`课程节次${tableData.length > 0 ? `(${tableData.length})` : ''}`" name="1">
            <simpleTable :style="{ height: 'calc(100vh - 300px)' }" :table-data="tableData" :table-label="tableLabel" />
          </el-tab-pane>
          <el-tab-pane :label="`练习进度${totalNum > 0 ? `(${totalNum})` : ''}`" name="2">
            <Table :loadData="getList" :params="{ courseId: id }" @total="total" :column="column2" ref="TableList"></Table>
          </el-tab-pane>
          <el-tab-pane :label="`购买记录${buyNum > 0 ? `(${buyNum})` : ''}`" name="3">
            <Table :loadData="getBuyList" :params="{ courseId: id }" @total="buyTotal" :column="column3" ref="TableList"></Table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
/*
 * course 瑜伽课程管理--详情
 * */
import Table from "@/components/Table/index";
import { Message } from "element-ui";

import formShow from "@/components/FormList/listShow";
import { coursePurchaseList, getCourse, listCourse, userPractice } from "@/api/course";
import { getScreenList } from "@/api/yogaManage";
import { getAssistantList, getCoachesList } from "@/api/coach";
import simpleTable from "@/components/simpleTable";
import { buyList, buyType } from "@/utils/systemEnum";
export default {
  name: "versionManage",
  components: {
    Table,
    formShow,
    simpleTable,
  },
  data() {
    return {
      tableData: [],
      tableLabel: [
        { label: "节次名称", param: "name", align: "center", sortable: true },
        { label: "封面", param: "coverUrl", align: "center", render: (val) => ` <image style="width: 100px;" src="${val.coverUrl}" :fit="fit"></image>` },
        // { label: '视频地址', param: 'resourceUrl', align: 'center' },
        { label: "时长（秒）", param: "time", align: "center", render: (val) => val.time + "s" },
      ],
      courseNum: 0,
      practiceNum: 0,
      activeName: "1",
      config: {
        hasLoading: false,
        inline: false,
        allRequired: false,
        buttons: [],
      },
      formObj: {},
      list: [
        {
          code: "durationType",
          label: "课程类型",
          list: [
            {
              label: "主题短视频",
              value: 1,
            },
            {
              label: "专题短视频",
              value: 2,
            },
            {
              label: "大课",
              value: 3,
            },
          ],
        },
        {
          code: "courseDurationName",
          label: "课程时长",
        },
        {
          code: "name",
          label: "课程名称",
        },
        {
          code: "courseType",
          label: "练习方式",
          list: [
            {
              label: "普通",
              value: 1,
            },
            {
              label: "特殊",
              value: 2,
            },
          ],
        },
        {
          code: "payType",
          label: "付费方式",
          list: [
            {
              label: "免费",
              value: 0,
            },
            {
              label: "积分付费",
              value: 1,
            },
            {
              label: "积分+现金付费",
              value: 2,
            },
          ],
        },
        {
          code: "scorePrice",
          label: "积分价格",
          nodate: true,
        },
        {
          code: "cashPrice",
          label: "现金价格",
          nodate: true,
        },
        {
          code: "applePurchaseId",
          label: "苹果内购ID",
          nodate: true,
        },
        {
          code: "tips",
          label: "温馨提示",
        },
        {
          code: "joinTotal",
          label: "真实练习人数",
        },
        {
          code: "joinTotalRandom",
          label: "虚拟练习人数",
        },
        {
          code: "allJoin",
          label: "总练习人数",
        },
        {
          code: "coachNameStr",
          label: "教练",
        },
        {
          code: "assistantsStr",
          label: "助教",
        },
        {
          code: "nodeTotal",
          label: "课程节次",
        },
        {
          code: "yogaCategorysStr",
          label: "瑜伽流派",
        },
        {
          code: "difficultyLevelName",
          label: "难度等级",
        },
        {
          code: "practiceRateStr",
          label: "建议练习频次",
        },
        {
          code: "suitableCrowdStr",
          label: "适合人群",
        },
        {
          code: "yogaEffectsStr",
          label: "练习功效",
        },
        {
          el: "img",
          code: "coverUrl",
          label: "课程封面",
        },
        {
          el: "img",
          code: "previewCoverUrl",
          label: "预览视频封面",
          ratio: "750/422",
        },
        {
          el: "video",
          code: "previewUrl",
          label: "预览视频",
        },
        {
          el: "img",
          code: "introduceUrl",
          label: "课程介绍",
        },
      ],
      totalNum: 0,
      buyNum: 0,
      column2: [
        {
          prop: "userName",
          label: "用户名称",
        },
        {
          prop: "nodeTotal",
          label: "总节次",
          formatter: (row, column) => row.nodeTotal || 0,
        },
        {
          prop: "nodeNum",
          label: "练习进度",
        },
        {
          prop: "courseName",
          label: "上次练习",
        },
        {
          prop: "todayTime",
          label: "今日练习（分钟）",
          formatter: (row, column, cellValue, index) => {
            return parseInt(cellValue / 60);
          },
        },
        {
          prop: "totalTime",
          label: "累计练习（分钟）",
          formatter: (row, column, cellValue, index) => {
            return parseInt(cellValue / 60);
          },
        },
        {
          prop: "continueDay",
          label: "连续练习（天）",
        },
        {
          prop: "totalDay",
          label: "累计练习（天）",
        },
        {
          prop: "completeCount",
          label: "完成次数",
        },
        {
          prop: "state",
          label: "状态",
          formatter: (row, column, cellValue, index) => {
            return cellValue > 0 ? "加入" : "退出";
          },
        },
        {
          prop: "joinTime",
          label: "加入时间",
        },
        {
          prop: "exitTime",
          label: "移除时间",
        },
      ],
      column3: [
        {
          prop: "userNikeName",
          label: "购买人昵称",
          actives: [
            {
              name: (val) => val.userNikeName,
              method: (val) => {
                this.$router.push(`/operation/userDetail?userId=${val.userId}`);
              },
            },
          ],
        },
        {
          prop: "payType",
          label: "付费方式",
          html: (val) => buyType[val.payType],
        },
        {
          prop: "orderNo",
          label: "订单号",
        },
        {
          prop: "scorePrice",
          label: "积分价格",
        },
        {
          prop: "cashPrice",
          label: "现金价格",
        },
        {
          prop: "purchaseTime",
          label: "购买时间",
        },
        {
          prop: "effectiveTime",
          label: "课程有效期",
          html: (val) => (val.effectiveTimeType == 1 ? "永久" : val.effectiveTime),
        },
      ],
    };
  },
  computed: {
    getList() {
      return userPractice;
    },
    getBuyList() {
      return coursePurchaseList;
    },
  },
  created() {
    if (this.$route.query.id) {
      this.edit = true;
      this.id = this.$route.query.id;
      getCourse({ id: this.id }).then((res) => {
        console.log(res);

        res.data.course.allJoin = Number(res.data.course.joinTotal || 0) + Number(res.data.course.joinTotalRandom || 0);
        this.formObj = res.data.course;
        console.log(!res.data.course.cashPrice);
        this.tableData = res.data.courseNodes;
      });
    }
    // userPractice().then(res => {
    //   console.log(res)
    // })
  },

  mounted() {
    this.$refs.TableList.update({ courseId: this.id });
  },
  methods: {
    total(val) {
      this.totalNum = val;
    },
    buyTotal(val) {
      this.buyNum = val;
    },
    cancel() {
      this.$router.push({
        path: "/content/course/index",
      });
    },
    handleClick() {},
    // 搜索查询
    formButton(val) {
      if (val.name == "confirm" && val.valid) {
        let data = val.value;
        this.$refs.TableList.update({ ...data });
      }
      if (val.name == "add") {
        this.$router.push({
          path: "/content/course/add",
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import url("~@/styles/common.scss");

.myDetail {
  display: flex;
  justify-content: space-between;
  .buttons {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 100;
  }
  .detail_left {
    flex-shrink: 0;
    width: 420px;
    padding-right: 20px;
    border-right: 1px solid #eee;
  }
  .formShowH {
    width: 100%;
    height: calc(100vh - 200px);
    overflow: auto;
  }
  .detail_right {
    width: 100%;
    padding-left: 20px;
  }
  .detail_title {
    font-size: 24px;
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
  }
}
.pop >>> .el-pagination__jump:not([class*="suffix"]) {
  margin-right: 30px;
}
</style>
