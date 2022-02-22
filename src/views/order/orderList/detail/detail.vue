<!--
 * @Author: tianhao
 * @Date: 2020-06-16 16:25:07
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-08-11 13:39:03
 * @Descripttion:
 已发货、已关闭、售后
 已关闭、售后需要传入参数:
 refund:true
-->
<template>
  <div class="order_detail">
    <el-steps :active="active" align-center finish-status="success">
      <el-step v-for="item in orderStatus" :title="item.title" :key="item.id"></el-step>
    </el-steps>
    <div class="state">
      <div class="content">
        <div class="order_state">
          <p>当前订单状态</p>
          <div class="status_text">{{ mapOrderState(formInline.orderState) }}</div>

          <!-- afterFlag true 表示有售后信息 是无法发货的  -->
          <div v-if="formInline.orderState == 1">
            <el-button size="small" @click="logistics(1)" type="primary">
              发货
            </el-button>
          </div>
          <div v-if="formInline.orderState == 2">
            <el-button size="small" @click="logistics(2)" type="primary">
              修改物流信息
            </el-button>
          </div>
        </div>
        <div class="btn" v-if="orderTrack(formInline.orderState)">
          <el-button size="small" @click="dialogVisible = true" type="primary">
            订单追踪
          </el-button>
        </div>
      </div>
    </div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <div class="texts item">
        <el-form class="demo-form-inline">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="下单时间:">
                {{ parseTime(formInline.orderTime) }}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订单编号:">{{ formInline.orderNo }}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="交易流水号:">
                {{ formInline.transactionNo }}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="会员昵称:">
                <router-link
                  tag="a"
                  :to="{
                    path: '/operation/userDetail',
                    query: { userId: formInline.userId },
                  }"
                >
                  {{ formInline.nickname }}
                </router-link>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="支付方式:">
                {{ formInline.payMode?"积分+现金":"积分" }}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="物流公司:">
                {{ formInline.logisticsCompany }}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="物流单号:">
                {{ formInline.logisticsNo }}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="发货时间:">
                {{ parseTime(formInline.deliveryTime) }}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="用户延长收货时间:">
                {{ parseTime(formInline.delayTime) }}
              </el-form-item>
            </el-col>

            <!-- <el-col :span="6">
							<el-form-item label="活动营销:" v-if="formInline.actType">
								{{ actTypeMap(formInline.actType) }}
							</el-form-item>
						</el-col> -->
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>收货人信息</span>
      </div>
      <div class="texts item">
        <el-form class="demo-form-inline">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="收货人:">
                {{ formInline.receiverName }}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="手机号:">
                {{ formInline.receiverPhone }}
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="收货地址:">
                {{ formInline.provinceName }}
                {{ formInline.cityName }}
                {{ formInline.regionName }}
                {{ formInline.receiverAddress }}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品信息</span>
      </div>
      <div class="texts item">
        <div class="goodsInfo_info">
          <div class="goodsInfo_info_table">
            <div class="info_item good_cover">
              <p>商品信息</p>
            </div>
            <div class="info_item">
              <p>价格(积分)：</p>
            </div>
            <div class="info_item" >
              <p>价格(现金)：</p>
            </div>
            <div class="info_item">
              <p>购买数量：</p>
            </div>
            <div class="info_item">
              <p>活动价(积分)：</p>
            </div>
            <div class="info_item" >
              <p>活动价(现金)：</p>
            </div>
            <div class="info_item">
              <p>商品合计(积分)：</p>
            </div>
            <div class="info_item" >
              <p>商品合计(现金)：</p>
            </div>
          </div>
          <div class="goodsInfo_info_table" v-for="item in formInline.orderGoodsList" :key="item.id">
            <!-- @click="gotoGoodsDetail" -->
            <div class="info_item itemClick good_cover">
              <div class="goods_img">
                <img style="width: 108px; height: 108px;" v-if="item.coverUrl ? true : false" :src="item.coverUrl" alt="" />
                <span v-else>加载失败</span>
              </div>
              <div>
                <p>名称：{{ item.goodsName }}</p>
                <p>规格：{{ item.specName }}</p>
              </div>
            </div>
            <div class="info_item">
              <p>{{ item.amount }}</p>
            </div>
            <!-- 现金 -->
            <div class="info_item">
              <p>{{ item.cash }}</p>
            </div>
            <div class="info_item">
              <p>{{ item.number }}</p>
            </div>
            <div class="info_item">
              <p>{{ item.promotionAmount ? item.promotionAmount : "无" }}</p>
            </div>
            <!-- 现金 -->
            <div class="info_item">
              <p>{{ item.promotionCash ? item.promotionCash : "无" }}</p>
            </div>

            <div class="info_item">
              <p>
                {{ item.promotionAmount ? item.promotionAmount * item.number : item.amount * item.number }}
              </p>
            </div>
            <!-- 现金 -->
            <div class="info_item">
              <p>
                {{ item.promotionCash ? item.promotionCash * item.number : item.cash * item.number }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- <el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>备注信息</span>
			</div>
			<div class="texts item">
				<el-form class="demo-form-inline">
					<el-row :gutter="10">
						<el-col :span="12">
							<el-form-item label="">{{ formInline.remark || '无' }}</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</el-card> -->

    <!-- <el-card
			class="box-card"
			v-if="
				(formInline.orderRefundList ? formInline.orderRefundList.length > 0 : false) ||
					(formInline.orderReturnList ? formInline.orderReturnList.length > 0 : false)
			"
		>
			<div class="texts item" v-if="formInline.orderReturnList">
				<el-form class="demo-form-inline">
					<div class="content">
						<el-table :data="formInline.orderReturnList" style="width: 100%">
							<el-table-column prop="num" label="售后编号">
								<template slot-scope="scope">
									<span class="orderReturn_num" @click="gotoPage">
										{{ scope.row.num }}
									</span>
								</template>
							</el-table-column>
							<el-table-column prop="createTime" label="售后处理时">
								<template slot-scope="scope">
									{{ parseTime(scope.row.handlingTime) }}
								</template>
							</el-table-column>
							<el-table-column prop="handler" label="售后处理人"></el-table-column>
							<el-table-column
								prop="afterTypeName"
								label="退款方式"
							></el-table-column>

							<el-table-column prop="remark" label="备注"></el-table-column>
						</el-table>
					</div>
				</el-form>
			</div>
		</el-card> -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>操作记录</span>
      </div>

      <div class="texts item">
        <el-table :data="formInline.operateLogList" style="width: 100%;">
          <el-table-column prop="operator" label="操作者"></el-table-column>
          <el-table-column prop="operateTime" label="操作时间">
            <template slot-scope="scope">
              {{ parseTime(scope.row.operateTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="operateContent" label="操作内容">
            <template slot-scope="scope">
              {{ scope.row.operateContent }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog title="订单跟踪" :close-on-click-modal="false" :visible.sync="dialogVisible" width="30%">
      <el-timeline>
        <el-timeline-item v-for="item in formInline.operateLogList" :key="item.id" size="large">
          <div>{{ parseTime(item.operateTime) }}</div>
          <h4 style="margin: 10px 0;">{{ item.operateContent }}</h4>
          <div>{{ item.operator }}</div>
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleClose">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 发货 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="sendExpressVisible" center width="30%">
      <el-form :model="sendExpressForm" label-position="top" :rules="rules" ref="sendExpressForm" class="demo-ruleForm sendExpressForm">
        <el-form-item label="物流公司" prop="company">
          <el-select v-model.trim="sendExpressForm.company" placeholder="请选择">
            <el-option v-for="item in logistiCsompany" :key="item.id" :label="item.company" :value="item.company" />
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" prop="logisticsNo">
          <el-input v-model.trim="sendExpressForm.logisticsNo" placeholder="请输入物流单号" maxlength="20" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sendExpressBtu('sendExpressForm')">
          {{ name }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderDetail, orderDelivery, ediOrdertLogistics, getLogisticsList } from "@/api/mall";
import { parseTime } from "@/utils";
import { moneyFormat } from "@/core/directives/money";
// import { logistiCsompany } from '@/utils/logisticsCompany';
import { mapSourceInfo, mapOrderState } from "@/utils/orderModal";
import Table from "@/components/Table/index";
import { Message } from "element-ui";
export default {
  components: {
    Table,
  },
  data() {
    const validatorExpressNumber = (rule, value, callback) => {
      if (!/^[A-Za-z0-9]{3,20}$/.test(value)) {
        return callback(new Error("请输入正确的物流单号"));
      } else if (this.sendExpressForm.logisticsNo === "") {
        return callback(new Error("请输入物流单号"));
      } else {
        callback();
      }
    };
    return {
      changeExpressVisible: false,
      changeExpressForm: {},
      showSupplier: true,
      dialogVisible: false,
      active: null,
      sendExpressVisible: false,
      sendExpressForm: {},
      logistiCsompany: [],
      refundVisible: false,

      rules: {
        logisticsCompany: [{ required: true, message: "请选择物流公司", trigger: "blur" }],
        logisticsNo: [{ validator: validatorExpressNumber, required: true, trigger: "blur" }],
      },
      refundRules: {
        remark: [{ required: true, trigger: "blur", message: "请输入备注" }],
      },
      formInline: {
        orderDetail: {},
      },
      orderLogList: [],
      orderStatus: [
        { id: 1, title: "待支付", time: null, status: "0" },
        { id: 2, title: "已完成", time: null, status: "3" },
        { id: 3, title: "已取消", time: null, status: "4" },
        { id: 4, title: "已关闭", time: null, status: "5" },
      ],
      id: this.$route.query.id || null,

      showBuyTime: false,

      column: [
        { prop: "operator", label: "操作者" },
        {
          prop: "createTime",
          label: "操作时间",
          formatter: (row, column) => {
            return parseTime(row.createTime);
          },
        },
        {
          prop: "title",
          label: "操作内容",
        },
      ],
      isShowImg: true,
      name: "确认发货",
      title: "发货",
    };
  },
  computed: {
    status() {
      switch (this.formInline.status) {
        case "UN_PAY":
          return "待付款";
          break;
        case "WAIT_SHIP":
          return "待发货";
          break;
        case "SHIPPED":
          return "已发货";
          break;
        case "DONE":
          return "已完成";
          break;
        case "CANCEL":
          return "已取消";
          break;
        case "CLOSE":
          return "已关闭";
          break;
        case "AFTER_SALE":
          return "售后处理";
        default:
          return "";
      }
    },
  },
  mounted() {
    this.getDetail();
    getLogisticsList({ page: 100 }).then((res) => {
      if (res.code == 200) {
        this.logistiCsompany = res.data;
      }
    });
  },
  methods: {
    mapOrderState(val) {
      return mapOrderState(val);
    },
    // ordermapSourceInfo(source) {
    //   return mapSourceInfo(source);
    // },
    isRobot(item) {
      if (item.status === "COMPLETE" && item.joinUserId === null) {
        return "机器人";
      } else {
        return "";
      }
    },
    actTypeMap(key) {
      switch (key) {
        case "TIME":
          return "限时抢购";
          break;
        case "GROUP":
          return "拼团";
          break;
        default:
          return "--";
          break;
      }
    },
    transfPayWay(val) {
      let _str = "";
      switch (val) {
        case "WE_CHAT":
          _str = "微信";
          break;
        case "ALIPAY":
          _str = "支付宝";
          break;
        case "BALANCE":
          _str = "余额";
          break;
        default:
          _str = "--";
          break;
      }
      return _str;
    },
    moneyFormat(num) {
      return moneyFormat(num);
    },

    // 发货/修改物流信息
    sendExpressBtu(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          if (this.formInline.orderState == 1) {
            orderDelivery({
              orderNo: this.formInline.orderNo,
              company: this.sendExpressForm.company,
              logisticsNo: this.sendExpressForm.logisticsNo,
            }).then((res) => {
              if (res.code === 200) {
                setTimeout(() => {
                  loading.close();
                  Message.success("发货成功！！");
                  this.getDetail();
                  this.sendExpressVisible = false;
                }, 300);
              } else {
                setTimeout(() => {
                  loading.close();
                  Message.error(res.msg);
                }, 300);
              }
            });
          } else {
            ediOrdertLogistics({
              orderNo: this.formInline.orderNo,
              company: this.sendExpressForm.company,
              logisticsNo: this.sendExpressForm.logisticsNo,
            }).then((res) => {
              if (res.code === 200) {
                setTimeout(() => {
                  loading.close();
                  Message.success("修改成功！！");
                  this.getDetail();
                  this.sendExpressVisible = false;
                }, 300);
              } else {
                setTimeout(() => {
                  loading.close();
                  Message.error(res.msg);
                }, 300);
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleClose() {
      this.dialogVisible = false;
    },
    parseTime(time) {
      return parseTime(time);
    },
    getDetail() {
      getOrderDetail({ orderNo: this.id }).then((res) => {
        // console.log(res)
        if (res.code === 200) {
          this.formInline = res.data;
          switch (res.data.orderState) {
            case 1:
              this.active = 1;
              break;
            case 2:
              this.active = 1;
              break;
            case 3:
              this.active = 2;
              break;
            case 4:
              this.active = 3;
              break;
            case 5:
              this.active = 4;
              break;
          }
          // 初始化发货的物流信息
          this.sendExpressForm = {
            company: res.data.logisticsCompany,
            logisticsNo: res.data.logisticsNo,
          };
          // let orderLogList = res.data.orderLogList.reverse();
          // orderLogList.forEach((item, itemIndex) => {
          // 	if (item.operator !== '用户') {
          // 		this.orderLogList.push(item);
          // 		this.orderLogList.reverse();
          // 	}
          // 	this.orderStatus.forEach((element, index) => {
          // 		if (element.status === item.orderState) {
          // 			element.time = item.createTime;
          // 			this.active = orderLogList.length;
          // 		} else if (itemIndex === index) {
          // 			element.title = item.title;
          // 			element.time = item.createTime;
          // 			this.active = orderLogList.length;
          // 		} else if (itemIndex === index) {
          // 			element.title = item.title;
          // 			element.time = item.createTime;
          // 			this.active = orderLogList.length;
          // 		}
          // 	});
          // });

          // if (orderLogList && orderLogList.length) {
          // 	this.formInline.orderLogList = orderLogList.reverse();
          // }
          // console.log(object);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    logistics(num) {
      if (num == 1) {
        this.name = "确认发货";
        this.title = "发货";
      } else {
        this.name = "确认修改";
        this.title = "修改物流信息";
      }
      this.sendExpressVisible = true;
    },
    orderTrack(state) {
      if (state == 0 || state == 1) {
        return false;
      } else {
        return true;
      }
    },

  },
};
</script>

<style lang="scss">
.order_detail {
  padding: 20px;
}
.state {
  border: 1px solid #ccc;
  margin: 20px 0;
  padding: 10px 0;
  .content {
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .order_state {
      line-height: 35px;
      .status_text {
        font-size: 14px;
      }
      .status_text_ {
        font-size: 14px;
      }
    }
  }

  .btn {
    float: right;
  }
}
.texts {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.box-card {
  margin-bottom: 20px;
}
.demo-form-inline {
  width: 100%;
}
.track {
  min-height: 300px;
}
.goodsInfo_info {
  display: flex;
  flex-direction: column;
  align-items: left;
  // justify-content: space-around;
  flex-wrap: wrap;
  .goodsInfo_info_table {
    display: flex;
    flex: 1;
    flex-direction: row;
    margin-top: 12px;
    .good_cover {
      display: flex;
      flex-direction: row;
      flex: 4;
      .goods_img {
        width: 108px;
        min-width: 108px;
        height: 108px;
        overflow: hidden;
        margin-right: 30px;
        img {
          object-fit: cover;
        }
      }
    }
  }
  .info_item {
    flex: 1;
    margin-right: 10px;
  }
}
.goodsInfo {
  display: flex;
  align-items: center;
  // justify-content: space-around;
  flex-wrap: wrap;
  .info_item {
    flex: 1;
    margin-right: 10px;
    display: flex;
    .goods_img {
      width: 100px;
      height: 100px;
      text-align: center;
      line-height: 100px;
      background: #f5f7fa;
      color: #c0c4cc;
      margin-right: 10px;
    }
  }
  .itemClick {
    display: flex;
    flex-direction: column;
    cursor: pointer;
    color: blue;
  }
  .itemClick:hover {
    color: red;
  }
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
a {
  color: blue;
}
a:hover {
  color: red;
}
.content {
  display: flex;
  flex-wrap: wrap;
  .orderReturn {
    width: 24%;
    margin-right: 10px;
    .el-form-item {
      display: flex;
      .orderReturn_num {
        cursor: pointer;
        color: blue;
      }
      .orderReturn_num:hover {
        color: red;
      }
    }
  }
}
</style>
