<!--
 * @Author: tianhao
 * @Date: 2020-06-16 16:25:07
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-01-18 12:58:02
 * @Descripttion: 
 已取消、待付款、待发货
 需要传入参数:
 待付款  type:"waitPaid",  待发货 type:"waitDelivered"
-->
<template>
	<div class="order_detail">
		<el-steps :active="active" finish-status="success">
			<el-step title="提交订单"></el-step>
			<el-step title="支付订单"></el-step>
			<el-step title="平台发货"></el-step>
			<el-step title="确认收货"></el-step>
			<el-step title="完成评价"></el-step>
		</el-steps>
		<div class="state">
			<el-row>
				<div class="order_state">
					当前订单状态：已发货(用户延长收货)
					<div class="actionBtn" v-if="isClose">
						<el-button size="small" type="primary">关闭订单</el-button>
					</div>
					<div class="actionBtn" v-if="isSend">
						<el-button size="small" type="primary">发货</el-button>
						<el-button size="small" type="primary">退款</el-button>
					</div>
				</div>
				<div class="btn">
					<el-button size="small" type="primary">订单追踪</el-button>
				</div>
			</el-row>
		</div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>基本信息</span>
			</div>
			<div class="text item">
				<el-form class="demo-form-inline">
					<el-row>
						<el-col :span="6">
							<el-form-item label="发货时间">{{ formInline.user }}</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="订单编号">{{ formInline.user }}</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="交易流水号">{{ formInline.user }}</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="会员昵称">{{ formInline.user }}</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="6">
							<el-form-item label="交易流水号">{{ formInline.user }}</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="订单来源">{{ formInline.user }}</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="订单类型">{{ formInline.user }}</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="活动营销">{{ formInline.user }}</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="6">
							<el-form-item label="配送方式"></el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="物流单号"></el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="自动确认收货时间"></el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="订单返现"></el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</el-card>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>收货人信息</span>
			</div>
			<div class="text item">
				<el-form class="demo-form-inline">
					<el-row>
						<el-col :span="6">
							<el-form-item label="收货人">{{ formInline.user }}</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="手机号">{{ formInline.user }}</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="邮政编码">{{ formInline.user }}</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="收货地址">{{ formInline.user }}</el-form-item>
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
							<p>商品货号：</p>
						</div>
						<div class="info_item">
							<p>商品成本：</p>
						</div>
						<div class="info_item">
							<p>售价（元）：</p>
						</div>
						<div class="info_item">
							<p>原价（元）：</p>
						</div>
						<div class="info_item">
							<p>购买数量：</p>
						</div>
						<div class="info_item">
							<p>活动价格（元）：</p>
						</div>
						<div class="info_item">
							<p>小计：</p>
						</div>
						<div class="info_item">
							<p>关联售后单号：</p>
						</div>
					</div>
					<div
						class="goodsInfo_info_table"
						v-for="item in formInline.orderDetailList"
						:key="item.id"
					>
						<div class="info_item itemClick good_cover" @click="gotoGoodsDetail">
							<div class="goods_img">
								<img
									style="width: 108px; height: 108px"
									v-if="isShowImg"
									:src="item.itemCover"
									alt=""
								/>
								<span v-else>加载失败</span>
							</div>
							<div>
								<p>名称：{{ item.itemName }}</p>
								<p>规格：{{ item.skuName }}</p>
							</div>
						</div>
						<div class="info_item">
							<p>{{ item.itemNo }}</p>
						</div>
						<div class="info_item">
							<p>{{ item.cost || '--' }}</p>
						</div>
						<div class="info_item">
							<p>{{ moneyFormat(item.price) }}元</p>
						</div>
						<div class="info_item">
							<p>{{ moneyFormat(item.originPrice) }}元</p>
						</div>
						<div class="info_item">
							<p>{{ item.amount }}</p>
						</div>
						<div class="info_item">
							<p>{{ item.actPrice ? moneyFormat(item.actPrice) : '--' }}元</p>
						</div>
						<div class="info_item">
							<p>{{ moneyFormat(item.totalPrice) }}元</p>
						</div>
						<div class="info_item">
							<p>
								{{ (formInline.orderReturn && formInline.orderReturn.num) || '--' }}
							</p>
						</div>
					</div>
				</div>
			</div>
		</el-card>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>费用信息</span>
			</div>
			<div class="text item">
				<el-form class="demo-form-inline">
					<!-- <el-row>
						<el-col :span="6">
							<el-form-item label="商品名称">{{ formInline.user }}</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="运费">{{ formInline.user }}</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="运费规则">{{ formInline.user }}</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="优惠券">{{ formInline.user }}</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="6">
							<el-form-item label="活动">{{ formInline.user }}</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="活动优惠">{{ formInline.user }}</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="订单总金额">{{ formInline.user }}</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="应付款金额">{{ formInline.user }}</el-form-item>
						</el-col>
					</el-row> -->
					<el-row :gutter="10">
						<el-col :span="6">
							<el-form-item label="运费合计:">
								{{ moneyFormat(formInline.fare) }}元
							</el-form-item>
						</el-col>
						<!-- <el-col :span="6">
							<el-form-item label="商品合计:">
								{{ moneyFormat(formInline.itemTotalPrice) }}元
							</el-form-item>
						</el-col> -->
						<el-col :span="6">
							<el-form-item label="运费规则:">{{ formInline.fareRule }}</el-form-item>
						</el-col>

						<el-col :span="6">
							<el-form-item label="使用优惠券:" v-if="formInline.couponDeductAmount">
								{{ moneyFormat(formInline.couponDeductAmount) }}元
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="抵扣金:">
								{{ moneyFormat(formInline.deductionMoney) }}元
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="10">
						<!-- <el-col :span="6">
							<el-form-item label="活动:" v-if="formInline.actType">
								{{ formInline.actType == 'TIME' ? '限时抢购' : '' }}
							</el-form-item>
						</el-col> -->
						<el-col :span="6">
							<el-form-item label="订单合计:">
								{{ moneyFormat(formInline.orderTotalPrice) }}元
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="第三方支付金额:">
								{{ moneyFormat(formInline.payPrice) }}元
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="累计支付金额:">
								{{
									moneyFormat(formInline.useBalanceMoney + formInline.payPrice)
								}}元
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="支付方式:">
								{{ transfPayWay(formInline.payWay) }}
							</el-form-item>
						</el-col>
						<!-- <el-col :span="6">
							<el-form-item label="活动优惠:">
								{{
									moneyFormat(
										formInline.type === 'PROMOTION'
											? `${formInline.orderDetail.price -
													formInline.orderDetail.actPrice}`
											: 0
									)
								}}元
							</el-form-item>
						</el-col> -->
					</el-row>
				</el-form>
			</div>
		</el-card>
		<el-card class="box-card">
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
		</el-card>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>操作记录</span>
			</div>
			<div class="text item">
				<el-form class="demo-form-inline">
					<el-row>
						<el-col :span="8">
							<el-form-item label="操作者">{{ formInline.user }}</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="操作时间">{{ formInline.user }}</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="操作内容">{{ formInline.user }}</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</el-card>
	</div>
</template>

<script>
export default {
	props: {
		type: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			active: 0,
			isClose: false,
			isSend: false,
			tableData: [],
			formInline: {
				user: '芜湖起飞',
				region: '',
			},
		};
	},
	mounted() {
		if (this.type === 'waitPaid') {
			this.isClose = true;
		} else if (this.type === 'waitDelivered') {
			this.isSend = true;
		}
	},
	methods: {
		next() {
			if (this.active++ > 4) this.active = 0;
		},
	},
};
</script>

<style lang="scss">
.order_detail {
	padding: 20px;
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
			flex: 3;
			.goods_img {
				width: 108px;
				min-width: 108px;
				height: 108px;
				overflow: hidden;
			}
		}
	}
	.info_item {
		flex: 1;
		margin-right: 10px;
	}
}
.state {
	border: 1px solid #ccc;
	margin: 20px 0;
	padding: 10px 0;
	.order_state {
		display: inline-block;
		height: 31px;
		line-height: 35px;
	}
	.btn {
		float: right;
	}
	.actionBtn {
		float: right;
		margin-left: 10px;
	}
}
.text {
	font-size: 14px;
}

.item {
	margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
	display: table;
	content: '';
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
</style>
