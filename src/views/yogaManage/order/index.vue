<template>
  <div class="commonPage">
    <formList ref="formList" :config="config" :formObj="formObj" :list="list" @button="formButton" />
    <Table :loadData="getList" refHead="formList" :column="column" ref="TableList" :showSortIndex="{ show: true, lable: '序号' }" />
  </div>
</template>
<script>
/*
 * information 新闻列表
 * */

import Table from "@/components/Table/index";
import { Message } from "element-ui";
import { delSalesRoom, editSalesRoom, addSalesRoom, getSalesRoomList } from "@/api/admin";

import formList from "@/components/FormList";
import { newslist, editNewsState, newsDel, newsEnable } from "@/api/news";
import { wikiDelete } from "@/api/wiki";
import {buyList, buyType, resourcesList, resourcesObj, stateList, stateObj} from "@/utils/systemEnum";
import { courseColumnEnable } from "@/api/course";
import { testTimeIn } from "@/utils";
import { courseOrderList } from "@/api/yogaManage";
export default {
  name: "versionManage",
  components: {
    Table,
    formList,
  },
  data() {
    return {
      config: {
        hasLoading: false,
        inline: true,
        allRequired: false,
        buttons: [
          {
            funType: "confirm",
            type: "primary",
            name: "查询",
          },
          {
            funType: "reset",
            type: "primary",
            name: "重置",
          },
        ],
      },
      formObj: {},
      list: [
        {
          code: "name",
          label: "课程名称",
        },
        {
          code: "userPhone",
          label: "购买人电话",
        },
        {
          code: "orderNo",
          label: "订单号",
        },
        {
          el: "select",
          code: "type",
          label: "类型",
          list: resourcesList,
        },
        {
          el: "select",
          code: "payType",
          label: "付费方式",
          list: buyList,
        },
      ],
      // 表头
      column: [
        {
          prop: "name",
          label: "课程名称",
        },
        {
          prop: "userNikeName",
          label: "购买人昵称",
          actives:[
            {
              name:(val)=>val.userNikeName,
              method:(val)=>{
                this.$router.push(`/operation/userDetail?userId=${val.userId}`)
              }
            }
          ]
        },
        {
          prop: "userPhone",
          label: "购买人电话",
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
          prop: "applePurchaseId",
          label: "内购ID",
        },
        {
          prop: "status",
          label: "支付状态",
          formatter: (row) => row.status?"已退款":"已付款"
        },
        {
          prop: "type",
          label: "类型",
          formatter: ({type}) =>resourcesObj[type]&&resourcesObj[type].label||'-'
        },
        {
          prop: "purchaseTime",
          label: "购买时间",
        },
        {
          prop: "refundTime",
          label: "退款时间",
        },
        {
          prop: "effectiveTime",
          label: "课程有效期",
        },
      ],
    };
  },
  computed: {
    getList() {
      return courseOrderList;
    },
  },
  methods: {
    // 搜索查询
    formButton(val) {
      if (val.name == "confirm" && val.valid) {
        let data = val.value;
        this.$refs.TableList.update({ ...data });
      }
    },
    // 禁用状态切换
    bannedChange(item, code) {
      let data = { id: item.id, [code]: Number(item[code]) };
      if (code == "enable") {
        let endTime = new Date(item.endTime || "2300").getTime();
        let newTime = new Date().getTime();
        if (item.enable == 1 && endTime < newTime) {
          this.$message.error("改条资讯已过定时展示时间，请重置展示时间后再启用");
          this.$refs.TableList.reset();
        } else {
          newsEnable(data)
            .then((res) => {
              this.$message.success("操作成功");
            })
            .finally(() => {
              this.$refs.TableList.reset();
            });
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.commonPage {
  padding: 20px;
}
</style>
