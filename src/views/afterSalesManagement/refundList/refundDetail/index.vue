<!--
 * @Author: wei.chen
 * @Date: 2020-06-30 17:47:46
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-02-26 16:29:55
 * @Descripttion: 
-->

<template>
	<div class="refundPage">
		<!-- 售后状态 -->
		<el-card class="box-card">
			<h3>售后状态</h3>
			<p>
				<span class="status_item">售后编号：{{ orderInfo.num }}</span>
				<span class="status_item">状态：{{ orderInfo.statusName }}</span>
				<span class="status_item">售后来源：{{ orderInfo.source }}</span>
				<span class="status_item">
					处理完成时间：{{ parseTime(orderInfo.handlingTime) }}
				</span>
			</p>
		</el-card>
		<!-- 售后信息 -->
		<el-card class="box-card">
			<h3>售后信息</h3>
			<p>
				订单编号：{{ orderInfo.orderNum }}
				<el-button type="primary" size="mini" @click="onClickOrder">
					查看订单
				</el-button>
			</p>
			<p>会员昵称：{{ orderInfo.userReceiverName }}</p>
			<p>售后方式：{{ orderInfo.afterTypeName }}</p>
			<p>售后原因：{{ orderInfo.afterReason }}</p>
			<p>
				<span class="status_item">
					第三方支付金额：{{ moneyFormat(orderInfo.payPrice) }}元
				</span>
				<span class="status_item">
					钱包支付金额:{{ moneyFormat(orderInfo.useBalanceMoney) }}元
				</span>
				<span class="status_item">运费：{{ moneyFormat(orderInfo.fare || 0) }}元</span>
			</p>
			<p>
				<span>
					优惠劵 :{{ orderInfo.order ? orderInfo.order.couponDeductAmount || 0 : 0 }}元
				</span>
				&nbsp;&nbsp;&nbsp;&nbsp;
				<span>
					抵扣金 :{{ orderInfo.order ? orderInfo.order.deductionMoney || 0 : 0 }}元
				</span>
			</p>
			<p>订单合计：{{ moneyFormat(orderInfo.orderTotalPrice || 0) }}元</p>
			<p v-if="isShowActualRefundPrice">
				确认退款金额:
				<span class="number">
					退第三方支付金额：{{ moneyFormat(orderInfo.actualRefundAmount) }}元/
				</span>
				<span class="number">
					退钱包支付金额:{{ moneyFormat(orderInfo.actualRefundBalanceAmount) }}元
				</span>
			</p>

			<p v-if="isShowRemark">备注：{{ orderInfo.remark }}</p>
		</el-card>
		<!-- 售后明细 -->
		<el-card class="box-card">
			<h3>售后明细</h3>
			<p>售后描述</p>
			<p style="text-indent: 32px;">{{ orderInfo.afterDescription }}</p>
			<p v-if="isShowImage">附件图片</p>
			<div class="demo-image__preview" v-if="isShowImage">
				<el-image
					style="width: 100px; height: auto;margin-right:10px"
					v-for="(item, index) in orderInfo.images"
					:key="'images' + index"
					:src="item"
					:preview-src-list="orderInfo.images"
				></el-image>
			</div>
		</el-card>
		<!-- 售后物流 -->
		<el-card class="box-card" v-if="isShowAfter">
			<h3>售后物流</h3>
			<p>物流名称：{{ orderReturnExpress.senderCompany }}</p>
			<p>发货时间：{{ parseTime(orderReturnExpress.createTime) }}</p>
			<p>物流单号：{{ orderReturnExpress.senderNum }}</p>
			<p>
				收货人信息：{{ orderInfo.userReceiverName }} | {{ orderInfo.userReceiverPhone }} |
				{{ orderInfo.userReceiverAddress }}
			</p>
			<p>备注：{{ orderInfo.remark }}</p>
		</el-card>
		<!-- 售后供应商信息 -->
		<el-card class="box-card" v-if="orderInfo.afterType != 'REFUND'">
			<h3>售后供应商信息</h3>
			<p>供应商名称：{{ orderReturnExpress.supplierName || '' }}</p>
			<p>发货人：{{ orderReturnExpress.supplierSenderName || '' }}</p>
			<p>联系方式：{{ orderReturnExpress.supplierPhone || null }}</p>
			<p>发货地址：{{ orderReturnExpress.supplierAddress || null }}</p>
		</el-card>
		<!-- 物流信息 -->
		<el-card class="box-card" v-if="isShowUserExpress">
			<h3>用户退换货物流信息</h3>

			<div>
				<p>发货会员昵称：{{ orderInfo.userReceiverName }}</p>
				<p>发货时间：{{ parseTime(orderReturnExpress.createTime) }}</p>
				<p>物流名称：{{ orderReturnExpress.receiverCompany }}</p>
				<p>物流单号：{{ orderReturnExpress.receiverNum }}</p>
			</div>
		</el-card>
		<!-- 操作记录 -->
		<el-card class="box-card">
			<h3>操作记录</h3>
			<el-table :data="orderReturnLogs" style="width: 100%">
				<el-table-column prop="operator" label="操作者"></el-table-column>
				<el-table-column prop="createTime" label="操作时间">
					<template slot-scope="scope">
						{{ parseTime(scope.row.createTime) }}
					</template>
				</el-table-column>
				<el-table-column prop="extra" label="操作内容">
					<template slot-scope="scope">
						{{ scope.row.title }}{{ scope.row.extra ? `(${scope.row.extra})` : '' }}
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script>
import { getAfterServiceInfo } from '@/api/orderAfterService';
import { Message } from 'element-ui';
import { parseTime } from '@/utils';
import Table from '@/components/Table/index';
import { moneyFormat } from '@/core/directives/money';

export default {
	name: 'refundPage',
	components: {
		Table,
	},
	data() {
		return {
			id: this.$route.query.id || null,
			orderInfo: {
				afterType: '',
				status: '',
				images: [],
			},
			orderReturnLogs: [],
			isShowActualRefundPrice: false,
			isShowUserExpress: false,
			isShowRemark: true,
			isShowAfter: false,
			orderReturnExpress: {
				senderCompany: '', // 换货物流公司名称（公司发出）
				createTime: null, // 创建时间
				senderNum: null, // 换货物流单号（公司发出）
				supplierName: '', // 供应商名称
				supplierSenderName: '', // 收货人（供应商收货人）
				supplierPhone: '', // 收货电话（供应商收货电话）
				supplierAddress: '', // 收货地址（供应商收货地址）
				receiverCompany: '', // 发货人物流公司（用户发出）
				receiverNum: '', // 发货人物流单号（用户发出）
			},
			isShowImage: false,
		};
	},
	mounted() {
		if (this.id) {
			getAfterServiceInfo({ id: this.id }).then(res => {
				if (res.success) {
					this.orderInfo = res.data;
					if (res.data.images != null && res.data.images != '') {
						this.orderInfo.images = res.data.images.split(',');
						this.isShowImage = true;
					}
					switch (res.data.source) {
						case 'ANDROID':
							this.orderInfo.source = 'APP';
							break;
						case 'IOS':
							this.orderInfo.source = 'APP';
							break;
						case 'MINI':
							this.orderInfo.source = '小程序';
							break;
						case 'H5':
							this.orderInfo.source = '小程序';
							break;
						case 'WEB':
							this.orderInfo.source = 'PC';
							break;
						case 'BYTE_DANCE_MINI':
							this.orderInfo.source = '抖音小程序';
							break;
						default:
							this.orderInfo.source = '-';
							break;
					}
					// 操作记录
					res.data.orderReturnLogs.forEach(element => {
						if (element.operator !== '用户') {
							this.orderReturnLogs.push(element);
							// this.orderLogList.reverse()
						}
					});
					// this.orderReturnLogs = res.data.orderReturnLogs

					// 售后供应商信息
					if (res.data.orderReturnExpress !== null) {
						this.orderReturnExpress.senderCompany =
							res.data.orderReturnExpress.senderCompany;
						this.orderReturnExpress.createTime = res.data.orderReturnExpress.createTime;
						this.orderReturnExpress.senderNum = res.data.orderReturnExpress.senderNum;
						this.orderReturnExpress.supplierName =
							res.data.orderReturnExpress.supplierName;
						this.orderReturnExpress.supplierSenderName =
							res.data.orderReturnExpress.supplierSenderName;
						this.orderReturnExpress.supplierPhone =
							res.data.orderReturnExpress.supplierPhone;
						this.orderReturnExpress.supplierAddress =
							res.data.orderReturnExpress.supplierAddress;
						this.orderReturnExpress.receiverCompany =
							res.data.orderReturnExpress.receiverCompany;
						this.orderReturnExpress.receiverNum =
							res.data.orderReturnExpress.receiverNum;
					}
					// 是否显示备注
					if (res.data.afterType !== 'REFUND' && res.data.status === 'REJECT') {
						this.isShowRemark = false;
					}
					// 是否显示售后物流
					if (res.data.orderReturnExpress && res.data.orderReturnExpress.senderCompany) {
						this.isShowAfter = true;
					}

					// 是否显示用户物流信息
					if (
						res.data.orderReturnExpress &&
						res.data.orderReturnExpress.receiverCompany !== ''
					) {
						this.isShowUserExpress = true;
					}
					// 是否显示确认售后金额
					if (res.data.afterType === 'REFUND') {
						if (res.data.status !== 'REJECT' && res.data.status !== 'CANCEL') {
							this.isShowActualRefundPrice = true;
						}
					}
				}
			});
		}
	},
	methods: {
		moneyFormat(num) {
			return moneyFormat(num);
		},
		// 查看订单
		onClickOrder() {
			this.$router.push({ path: '/order/detail', query: { id: this.orderInfo.orderId } });
		},
		parseTime(time) {
			return parseTime(time);
		},
	},
};
</script>

<style lang="scss" scoped>
.box-card {
	margin-bottom: 10px;
}
.el-textarea {
	width: 400px;
}
.number {
	font-size: 28px;
	font-weight: 600;
	color: red;
}
.status_item {
	margin-right: 20px;
}
</style>
