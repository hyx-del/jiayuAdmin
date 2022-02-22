<template>
  <div class="content">
    <div class="top">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>活动标题：{{ infoData.title }}</span>
        </div>
        <div class="text item">
          <div>活动描述: {{ infoData.remarks }}</div>
          <div style="margin: 10px 0;">活动类型： {{ infoData.type === 0 ? "限时抢购" : "" }}</div>
          <div>活动时间： {{ parseTime(infoData.startTime) }}-{{ parseTime(infoData.endTime) }}</div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>统计</span>
        </div>
        <div class="text item">
          <div>商品销售总额：{{ infoData.totalAmountSum }}</div>
          <div style="margin: 10px 0;">订单量：{{ infoData.orderTotalNum }}单</div>
          <div>活动参与人数：{{ infoData.partInNumber }}</div>
        </div>
      </el-card>
    </div>
    <div>
      <el-card class="box-card table">
        <div slot="header" class="clearfix">
          <span>活动商品明细</span>
        </div>
        <div class="text item">
          <Table :loadData="getList" :column="column" :params="data" ref="TableList">
            <template v-slot:displayUrl="{ scope }">
              <el-image :src="scope.displayUrl" :preview-src-list="[scope.displayUrl]" />
            </template>
            <template v-slot:limitPerPerson="{ scope }">
              {{ scope.limitPerPerson === -1 ? "不限购" : scope.limitPerPerson }}
            </template>
          </Table>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import Table from "@/components/Table/index";
import { infoWithStat, goodsDetailsList } from "@/api/malloperation";
import { parseTime } from "@/utils";
export default {
  components: {
    Table,
  },
  data() {
    return {
      infoData: "",
      parseTime,
      column: [
        {
          prop: "displayUrl",
          label: "商品规格展示图",
          render: true,
        },
        {
          prop: "goodsName",
          label: "商品名称",
        },
        {
          prop: "specName",
          label: "规格",
        },
        {
          prop: "amount",
          label: "价格（积分）",
        },
        {
          prop: "cash",
          label: "价格（现金）",
        },
        {
          prop: "promotionAmount",
          label: "抢购价格（积分）",
        },
        {
          prop: "promotionCash",
          label: "抢购价格（现金）",
        },
        {
          prop: "activityStock",
          label: "活动库存",
        },
        {
          prop: "limitPerPerson",
          label: "每人限购数量",
          render: true,
        },
        {
          prop: "orderNum",
          label: "订单量",
        },
        {
          prop: "actuallyTotalAmountSum",
          label: "累计销售额（积分）",
        },
        {
          prop: "actuallyTotalCashSum",
          label: "累计销售额（现金）",
        },
      ],
      data: {
        activityId: this.$route.query.id,
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      let id = this.$route.query.id;
      infoWithStat({ id }).then((res) => {
        const { code, data } = res;
        if (code === 200) {
          this.infoData = data;
        }
      });
    },
  },
  computed: {
    getList() {
      return goodsDetailsList;
    },
  },
};
</script>

<style lang="scss" scoped>
.top {
  display: flex;
  .box-card {
    width: 40%;
    margin-right: 20px;
  }
}
.table {
  margin-top: 20px;
}
</style>
