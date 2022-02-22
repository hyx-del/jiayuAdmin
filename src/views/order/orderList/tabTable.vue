<!--
 * @Author: tianhao
 * @Date: 2020-06-16 15:22:52
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-11-10 16:42:22
 * @Descripttion:
-->
<template>
  <div class="waitDelivered">
    <el-form :inline="true" ref="formInline" :model="formInline" class="demo-form-inline">
      
      <el-form-item label="搜索条件：">
        <el-input placeholder="请输入订单编号或手机号" size="small" prefix-icon="el-icon-search" v-model.trim="formInline.orderNoOrReceiverPhone"></el-input>
      </el-form-item>
      <el-form-item label="下单时间：">
        <el-date-picker v-model.trim="formInline.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="small"></el-date-picker>
      </el-form-item>

      <el-form-item v-if="name == 'CANCEL'" label="取消原因:">
        <el-input placeholder="" size="small" prefix-icon="el-icon-search" v-model.trim="formInline.cancelReason"></el-input>
      </el-form-item>

      <el-form-item>
        <label>
          支付方式：<el-select size="small" v-model.trim="formInline.payMode">
            <el-option :label="'全部'" :value="''" selected="selected"></el-option>
            <el-option v-for="item in registeredSourceOptions" :key="item.val" :label="item.lab" :value="item.val"></el-option>
          </el-select>
        </label>
        <el-button type="primary" size="small" @click="search">查询</el-button>
        <div class="exportBtn" v-if="btn">
          <el-button type="primary" size="small" @click="exportInvoice">
            批量处理发货单
          </el-button>
          <el-button type="primary" size="small" @click="exportOverOrder">
            导出订单
          </el-button>
        </div>

        <!-- 已完成的订单导出 -->
        <!-- <div class="exportBtn" v-if="name === 'DONE'">
					<el-button type="primary" size="small" @click="exportOverOrder">
						导出订单
					</el-button>
				</div>
				<div class="exportBtn" v-else-if="name === 'WAIT_SHIP'">
					<el-button type="primary" size="small" @click="exportUnShippedOrderList">
						导出订单
					</el-button>
				</div>
				<div class="exportBtn" v-else>
					<el-button type="primary" size="small" @click="exportOrder">导出订单</el-button>
				</div> -->
      </el-form-item>
    </el-form>
    <!-- 发货状态 表格多两个表头 -->
    <Table :loadData="getList" :column="column" style="width: 100%;" ref="orderList" refHead="formInline" additional="120" :params="{ orderState: name }" :showSortIndex="{ show: true, lable: '序号' }">
      <template v-slot:userName="{ scope }">
        <router-link tag="a" class="gotoPage" :to="{ path: '/operation/userDetail', query: { userId: scope.userId } }">
          {{ scope.userName }}
        </router-link>
      </template>
      <!--   -->
      <template v-slot:orderDetailSimpleDtoList="{ scope }">
        <div v-for="item in scope.orderDetailSimpleDtoList" :key="item.itemId">
          <div>
            {{ `名称：${item.itemName} 规格：${item.skuName} 货号：${item.itemNo} 购买数量：${item.amount}` }}
          </div>
        </div>
      </template>
    </Table>
    <!-- 发货 -->
    <el-dialog title="发货" :close-on-click-modal="false" :visible.sync="sendExpressVisible" center width="30%">
      <el-form :model="sendExpressForm" label-position="top" :rules="rules" ref="sendExpressForm" class="demo-ruleForm sendExpressForm">
        <el-form-item label="物流公司" prop="company">
          <el-select v-model.trim="sendExpressForm.company" value-key="code" placeholder="请选择" class="auto_width">
            <el-option v-for="item in logistiCsompany" :key="item.id" :label="item.company" :value="item.company" />
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" prop="logisticsNo">
          <el-input v-model.trim="sendExpressForm.logisticsNo" placeholder="请输入物流单号" maxlength="20" class="auto_width" />
        </el-form-item>
        <!-- <el-form-item label="发货供应商">
					<p>{{ sendExpressForm.supplierName }}</p>
				</el-form-item>
				<el-form-item label="发货地址">
					<p>发货人：{{ sendExpressForm.supplierSenderName }}</p>
					<p>联系方式：{{ sendExpressForm.supplierPhone }}</p>
					<p>发货地址：{{ sendExpressForm.supplierAddress }}</p>
				</el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sendExpressBtu('sendExpressForm')">
          确认发货
        </el-button>
      </div>
    </el-dialog>

    <!-- 导入发货单 -->
    <el-dialog title="导入发货单" :visible.sync="invoiceVisible" v-if="invoiceVisible" center width="100px" :close-on-click-modal="false">
      <el-form ref="newUploadForm" :model="newUploadForm" :rules="formRules" label-width="140px" class="newUploadForm">
        <el-form-item label="请上传文件" prop="fileName">
          <el-input v-model="newUploadForm.fileName" :readonly="true" style="width: 300px;" placeholder="文件名" size="small"></el-input>
          <template>
            <el-upload class="upload-demo" ref="upload" action="doUpload" :limit="1" :file-list="fileList" :before-upload="beforeUpload">
              <el-button slot="trigger" type="primary" size="small">
                选取文件
              </el-button>
              <!-- <div slot="tip" class="el-upload__tip">只能上传excel文件，且不超过100MB</div>
              <div slot="tip" class="el-upload-list__item-name">{{fileName}}</div>-->
            </el-upload>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onClickUploae('newUploadForm')">
          确认上传
        </el-button>
      </div>
    </el-dialog>
    <!-- 导入的发货单表格 -->
    <el-dialog title="批量处理的发货单" :close-on-click-modal="false" :visible.sync="tableVisible" center width="1200px">
      <p style="color: red; text-align: center; margin-bottom: 20px;">
        <span v-if="postResultInfo.failCount"> 共{{ postResultInfo.totalCount }}条数据，共计{{ postResultInfo.failCount }}条信息有误或缺失，以下订单导入失败，请检查修改后重新导入 </span>
        <span v-else style="color: #70b603;"> 无错误信息，已导入{{ postResultInfo.successCount }}条数据并发货 </span>
      </p>
      <el-table :data="tableData" border height="520" style="width: 100%;">
        <el-table-column v-for="item in invoiceColumn" :key="item.prop" :prop="item.prop" :label="item.label" :formatter="item.formatter" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button v-if="postResultInfo.failCount" type="danger" @click="onClickBtu()">
					导出出错订单
				</el-button> -->
        <el-button type="primary" @click="tableVisible = false">确定</el-button>
        <!-- <p
					v-if="postResultInfo.failCount"
					style="color:#70B603;text-align: center;margin-top:10px"
				>
					已导入{{ postResultInfo.successCount }}条数据
				</p> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Table from "@/components/Table/index";
import { parseTime } from "@/utils";
import { moneyFormat } from "@/core/directives/money";
// import { logistiCsompany } from '@/utils/logisticsCompany';
import { startEndTime } from "@/core/directives/time";
import {
  getOrderList,
  orderDelivery,
  getLogisticsList,
  // exportUnShippedOrder,
  // importShipped,
  exportOrder,
  Invoice,
} from "@/api/mall";
import { getUserComments } from "@/api/operation";
import { mapOrderState } from "@/utils/orderModal";
import { Message } from "element-ui";
export default {
  components: {
    Table,
  },
  props: {
    btn: {
      type: Boolean,
      default: false,
    },
    showReturnOrder: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: "",
    },
  },
  data() {
    const validatorExpressNumber = (rule, value, callback) => {
      if (!/^[A-Za-z0-9]{3,20}$/.test(value)) {
        return callback(new Error("请输入正确的物流单号"));
      } else if (this.sendExpressForm.expressNumber === "") {
        return callback(new Error("请输入物流单号"));
      } else {
        callback();
      }
    };
    return {
      formInline: {
        // userId: null,
        // phone: '',
        time: "",
        payMode: "", //支付状态
        // status: '',
        // returnOrderShow: false,
        orderNoOrReceiverPhone: "",
        // source: null,
        // cancelReason: '',
      },
      registeredSourceOptions: [
        {
          lab: "积分",
          val: 0,
        },
        {
          lab: "积分+现金",
          val: 1,
        },
      ],
      sendExpressVisible: false,
      refundVisible: false,
      sendExpressForm: {},
      rules: {
        company: [{ required: true, message: "请选择物流公司", trigger: "blur" }],
        expressNumber: [{ validator: validatorExpressNumber, required: true, trigger: "blur" }],
      },
      refundRules: {
        remark: [{ required: true, trigger: "blur", message: "请输入备注" }],
      },
      formRules: {
        fileName: [{ required: true, trigger: "blur", message: "请选择上传文件" }],
      },
      logistiCsompany: [],
      optionSupplier: [],
      column: [
        {
          prop: "orderTime",
          label: "下单时间",
          formatter: (row, column) => {
            return parseTime(row.orderTime);
          },
        },
        { prop: "orderNo", label: "订单编号" },
        // { prop: 'userId', label: '用户ID' },
        // { prop: 'userName', label: '会员昵称', render: true },
        { prop: "receiverName", label: "收货人" },
        { prop: "receiverPhone", label: "收货人手机号" },
        { prop: "goodsName", label: "商品名称" },
        { prop: "numberSum", label: "数量" },
        {
          prop: "payMode",
          label: "支付方式",
          formatter: (row, column) => {
            let state;
            switch (row.payMode) {
              case 0:
                state = "积分";
                break;
              case 1:
                state = "积分+现金";
                break;
              default:
                break;
            }
            return state;
          },
        },
        { prop: "orderAmount", label: "订单积分" },
        { prop: "orderCash", label: "订单现金" },
        {
          prop: "status",
          label: "订单状态",
          formatter: (row, column) => {
            return mapOrderState(row.orderState);
          },
        },

        {
          prop: "action",
          label: "操作",
          fixed: "right",
          actives: [
            {
              name: (val) => {
                if (val.orderState === 1) {
                  return "发货";
                }
              },
              method: (val) => {
                this.sendExpressVisible = true;
                this.sendExpressForm = { ...val };
              },
            },
            {
              name: "详情",
              method: (val) => {
                this.$router.push({
                  path: "/mall/detail",
                  query: { id: val.orderNo, type: val.status },
                });
              },
            },
          ],
        },
      ],
      refundForm: { id: null, remark: "" },
      invoiceVisible: false,
      newUploadForm: { fileName: "" },
      fileList: [],
      fileName: "",
      tableVisible: false,
      invoiceColumn: [
        { prop: "orderNo", label: "订单编号" },
        { prop: "result", label: "结果" },
        { prop: "remarks", label: "备注" },
      ],
      tableData: [],
      files: null,
      postResultInfo: {},
    };
  },
  mounted() {
    console.log("收到的name", this.name);
    if (!this.name) {
      this.formInline.status = "";
    }
    this.formInline.status = this.name;
    // 默认加载 物流公司名字
    getLogisticsList({ page: 100 }).then((res) => {
      if (res.code == 200) {
        this.logistiCsompany = res.data;
      }
    });
  },
  computed: {},
  methods: {
    mapEnumSale(state) {
      let _tempStr = "";
      switch (state) {
        case "WAIT_DISPOSE":
          _tempStr = "待处理";
          break;
        case "USER_PROCESSED":
          _tempStr = "已填写物流信息";
          break;
        case "WAIT_USER_DISPOSE":
          _tempStr = "等待用户填写物流信息";
          break;
        case "REFUNDING":
          _tempStr = "退款中";
          break;
        case "FINISHED":
          _tempStr = "售后完成";
          break;
        case "REJECT":
          _tempStr = "售后驳回";
          break;
        case "CANCEL":
          _tempStr = "已取消";
          break;
        default:
          break;
      }
      return _tempStr;
    },
    getList(par) {
      return getOrderList(par);
    },
    moneyFormat(num) {
      return moneyFormat(num);
    },
    reset() {
      this.$refs.orderList.reset();
    },
    // 查询
    search() {
      let timeArray = startEndTime(this.formInline.time);
      console.log(timeArray);
      if (timeArray && timeArray.length) {
        this.formInline.startTime = parseTime(timeArray[0]);
        this.formInline.endTime = parseTime(timeArray[1]);
      } else {
        this.formInline.startTime = null;
        this.formInline.endTime = null;
      }
      // delete this.formInline.time;
      // delete this.formInline.time;
      this.$refs.orderList.update({ ...this.formInline });
    },
    onSubmit() {
      console.log("submit!");
    },
    // 发货
    sendExpressBtu(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const _par = {
            orderNo: this.sendExpressForm.orderNo,
            company: this.sendExpressForm.company,
            logisticsNo: this.sendExpressForm.logisticsNo,
          };
          debugger;
          orderDelivery(_par).then((res) => {
            if (res.code == 200) {
              Message.success("发货成功！！");
              this.reset();
              this.sendExpressVisible = false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 上传前 文件校验
    beforeUpload(file) {
      this.files = file;
      const extension = file.name.split(".")[1] === "xls";
      const extension2 = file.name.split(".")[1] === "xlsx";
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!extension && !extension2) {
        this.$message.warning("上传文件只能是 xls、xlsx格式!");
        return;
      }
      if (!isLt1M) {
        this.$message.warning("上传文件大小不能超过 1MB!");
        return;
      }
      this.newUploadForm.fileName = file.name;
      return false; // 返回false不会自动上传
    },
    // 导出已完成订单
    exportOverOrder() {
      if (!this.formInline.time) return this.$message.error("请选择导出时间");
      let timeArray = startEndTime(this.formInline.time);
      if (timeArray && timeArray.length) {
        this.formInline.startTime = timeArray[0];
        this.formInline.endTime = timeArray[1];
        // 导出的时候校验时间跨度不能超过  30 天
        if (this.formInline.endTime - this.formInline.startTime > 2592000000) {
          Message.warning("时间跨度不能超过30天");
          return false;
        }
      } else {
        this.formInline.startTime = null;
        this.formInline.endTime = null;
      }
      // delete this.formInline.time;
      // 封装数据
      this.formInline.startTime = parseTime(timeArray[0]);
      this.formInline.endTime = parseTime(timeArray[1]);
      // delete this.formInline.time;
      // delete this.formInline.status;
      this.formInline.orderState = 1;
      const _tempSoure = { ...this.formInline };
      let _par = "?";
      for (let obj in _tempSoure) {
        if (_tempSoure[obj]) {
          _par += `${obj}=${_tempSoure[obj]}&`;
        }
      }
      let url = `${process.env.VUE_APP_BASE_API}/admin/scoreshop/order/list/export${_par}`;
      window.open(url);
    },
    exportInvoice() {
      this.invoiceVisible = true;
    },
    onClickUploae() {
      let formdata = new FormData();
      formdata.append("file", this.files);
      Invoice(formdata).then((res) => {
        if (res.code == 200) {
          this.invoiceVisible = false;
          this.$message.success(res.data.message);
          this.tableData = res.data.result;
          this.postResultInfo = res.data;
          this.tableVisible = true;
        }
      });
    },
    // 导出错误订单
    onClickBtu() {
      console.log("导出错误订单");
      let url = `${process.env.VUE_APP_BASE_API}/adminApi/order/export/unShipped`;
      window.open(url);
      this.tableVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.waitDelivered {
  .auto_width {
    width: 100%;
  }
}
.exportBtn {
  display: inline;
  margin-left: 8px;
}
p {
  margin: 0;
}
.el-form--label-top .el-form-item__label {
  padding: 0;
}
.upload-demo {
  margin-left: 10px;
}
.newUploadForm {
  text-align: center;
}
.sendExpressForm {
  p {
    margin: 0;
  }
  .el-form-item__label {
    line-height: unset;
  }
}
.refundForm {
  p {
    margin: 0;
  }
}
.gotoPage {
  color: blue;
}
.gotoPage:hover {
  color: red;
}
</style>
