<!--
 * @Author: wei.chen
 * @Date: 2020-06-30 15:13:21
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-02-22 12:03:05
 * @Descripttion: 
-->
<template>
	<div class="refundList">
		<el-card :body-style="{ padding: '20px' }">
			<el-tabs v-model.trim="activeName" @tab-click="handleClick">
				<el-tab-pane label="未发货" name="WAIT_SHIP">
					<!-- 	:column="column" -->
					<Table
						name="WAIT_SHIP"
						:handleStates="unShippedStates"
						:isShowAfterType="false"
						v-if="activeName == 'WAIT_SHIP'"
					>
						<template v-slot:orderDetailList="{ scope }">
							<div v-for="item in scope.orderDetailList" :key="item.itemId">
								<div>
									{{
										`名称：${item.itemName} 规格：${item.skuName} 货号：${
											item.itemNo
										} 购买数量：${item.amount}`
									}}
								</div>
							</div>
						</template>
					</Table>
				</el-tab-pane>
				<el-tab-pane label="已发货" name="SHIPPED">
					<!-- :column="shippedColumn" -->
					<Table
						:handleStates="states"
						name="SHIPPED"
						:isShowAfterType="true"
						v-if="activeName == 'SHIPPED'"
					>
						<template v-slot:orderDetailList="{ scope }">
							<!-- <div v-text="scope"></div> -->
							<div v-for="item in scope.orderDetailList" :key="item.itemId">
								<div>
									{{
										`名称：${item.itemName} 规格：${item.skuName} 货号：${
											item.itemNo
										} 购买数量：${item.amount}`
									}}
								</div>
							</div>
						</template>
					</Table>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>

<script>
import Table from './refundTable';
import { Message } from 'element-ui';
import { parseTime } from '@/utils';
import { moneyFormat } from '@/core/directives/money';
export default {
	name: 'refundList',
	components: {
		Table,
	},
	data() {
		return {
			activeName: 'WAIT_SHIP',
			states: [
				{ value: '', label: '全部' },
				{ value: 'WAIT_DISPOSE', label: '待处理' },
				{ value: 'FINISHED', label: '售后完成' },
				{ value: 'REJECT', label: '售后驳回' },
				{ value: 'USER_PROCESSED', label: '已填写物流信息' },
				{ value: 'WAIT_USER_DISPOSE', label: '等待用户填写物流信息' },
				{ value: 'CANCEL', label: '已取消' },
			],
			unShippedStates: [
				{ value: '', label: '全部' },
				{ value: 'WAIT_DISPOSE', label: '待处理' },
				{ value: 'FINISHED', label: '售后完成' },
				{ value: 'REJECT', label: '售后驳回' },
				{ value: 'USER_PROCESSED', label: '已填写物流信息' },
				{ value: 'WAIT_USER_DISPOSE', label: '等待用户填写物流信息' },
				{ value: 'CANCEL', label: '已取消' },
				{ value: 'REFUNDING', label: '退款中' },
				// { label: '待处理', value: 'WAIT_DISPOSE' },
				// { label: '售后完成', value: 'FINISHED' },
				// { label: '售后驳回', value: 'REJECT' },
				// { label: '已取消', value: 'CANCEL' },
			],
			// column: [
			// 	{
			// 		prop: 'createTime',
			// 		label: '申请时间',
			// 		formatter: (row, column) => {
			// 			return parseTime(row.createTime);
			// 		},
			// 	},
			// 	{
			// 		prop: 'orderNum',
			// 		label: '订单编号',
			// 	},
			// 	{
			// 		prop: 'orderCreateTime',
			// 		label: '下单时间',
			// 		formatter: (row, column) => {
			// 			return parseTime(row.orderCreateTime);
			// 		},
			// 	},
			// 	{ prop: 'userId', label: '用户ID' },
			// 	{ prop: 'nickName', label: '用户昵称' },
			// 	{
			// 		prop: 'orderDetailList',
			// 		label: '商品信息',
			// 		width: 300,
			// 		align: 'left',
			// 		render: true,
			// 	},
			// 	{ prop: 'itemTotalPrice', label: '商品总价' },
			// 	{
			// 		prop: 'useBalanceMoney',
			// 		label: '余额支付',
			// 		formatter: (row, column) => {
			// 			return `${moneyFormat(row.useBalanceMoney)}元`;
			// 		},
			// 	},
			// 	{
			// 		prop: 'payPrice',
			// 		label: '第三方支付',
			// 		formatter: (row, column) => {
			// 			return `${moneyFormat(row.payPrice)}元`;
			// 		},
			// 	},

			// 	{ prop: 'afterReason', label: '退款原因' },
			// 	{
			// 		prop: 'handlingTime',
			// 		label: '处理时间',
			// 		formatter: (row, column) => {
			// 			return parseTime(row.handlingTime);
			// 		},
			// 	},
			// 	{ prop: 'num', label: '售后编号' },
			// 	{
			// 		prop: 'statusName',
			// 		label: '处理状态',
			// 	},
			// 	{
			// 		prop: 'actualRefundAmount',
			// 		label: '退第三方支付',
			// 		formatter: (row, column) => {
			// 			return `${moneyFormat(row.actualRefundAmount)}元`;
			// 		},
			// 	},
			// 	{
			// 		prop: 'actualRefundBalanceAmount',
			// 		label: '退余额支付',
			// 		formatter: (row, column) => {
			// 			return `${moneyFormat(row.actualRefundBalanceAmount)}元`;
			// 		},
			// 	},

			// 	{
			// 		prop: 'source',
			// 		label: '售后来源',
			// 		formatter: row => {
			// 			switch (row.source) {
			// 				case 'ANDROID':
			// 					return 'APP';
			// 					break;
			// 				case 'IOS':
			// 					return 'APP';
			// 					break;
			// 				case 'MINI':
			// 					return '小程序';
			// 					break;
			// 				case 'H5':
			// 					return '小程序';
			// 					break;
			// 				case 'WEB':
			// 					return 'PC';
			// 					break;
			// 				case 'BYTE_DANCE_MINI':
			// 					return '抖音小程序';
			// 					break;
			// 				default:
			// 					return '-';
			// 					break;
			// 			}
			// 		},
			// 	},
			// 	{
			// 		prop: 'actives',
			// 		label: '操作',
			// 		fixed: 'right',
			// 		actives: [
			// 			{
			// 				name: val => {
			// 					if (val.status != 'WAIT_DISPOSE') {
			// 						return '详情';
			// 					}
			// 				},
			// 				method: val => {
			// 					this.$router.push({ path: 'refundDetail', query: { id: val.id } });
			// 				},
			// 			},
			// 			{
			// 				name: val => {
			// 					if (val.status === 'WAIT_DISPOSE') {
			// 						return '去处理';
			// 					}
			// 				},
			// 				method: val => {
			// 					this.$router.push({ path: 'refundPage', query: { id: val.id } });
			// 				},
			// 			},
			// 		],
			// 	},
			// ],
			// shippedColumn: [
			// 	{
			// 		prop: 'createTime',
			// 		label: '申请时间',
			// 		formatter: (row, column) => {
			// 			return parseTime(row.createTime);
			// 		},
			// 	},
			// 	{ prop: 'orderNum', label: '订单编号' },
			// 	{ prop: 'nickName', label: '会员昵称' },
			// 	{
			// 		prop: 'itemTotalPrice',
			// 		label: '退款金额',
			// 		formatter: row => {
			// 			return `${moneyFormat(row.itemTotalPrice)}元`;
			// 		},
			// 	},
			// 	{
			// 		prop: 'fare',
			// 		label: '运费',
			// 		formatter: row => {
			// 			return `${moneyFormat(row.fare)}元`;
			// 		},
			// 	},
			// 	{
			// 		prop: 'afterTypeName',
			// 		label: '退款方式',
			// 	},
			// 	{ prop: 'afterReason', label: '退款原因' },
			// 	{
			// 		prop: 'handlingTime',
			// 		label: '处理时间',
			// 		formatter: (row, column) => {
			// 			return parseTime(row.handlingTime);
			// 		},
			// 	},
			// 	{ prop: 'num', label: '售后编号' },
			// 	{
			// 		prop: 'statusName',
			// 		label: '处理状态',
			// 	},
			// 	{
			// 		prop: 'source',
			// 		label: '售后来源',
			// 		formatter: row => {
			// 			switch (row.source) {
			// 				case 'ANDROID':
			// 					return 'APP';
			// 					break;
			// 				case 'IOS':
			// 					return 'APP';
			// 					break;
			// 				case 'MINI':
			// 					return '小程序';
			// 					break;
			// 				case 'H5':
			// 					return '小程序';
			// 					break;
			// 				case 'WEB':
			// 					return 'PC';
			// 					break;
			// 				case 'BYTE_DANCE_MINI':
			// 					return '抖音小程序';
			// 					break;
			// 				default:
			// 					return '-';
			// 					break;
			// 			}
			// 		},
			// 	},
			// 	{
			// 		prop: 'actives',
			// 		label: '操作',
			// 		fixed: 'right',
			// 		actives: [
			// 			{
			// 				name: val => {
			// 					if (
			// 						val.status != 'WAIT_DISPOSE' &&
			// 						val.status !== 'USER_PROCESSED'
			// 					) {
			// 						return '详情';
			// 					}
			// 				},
			// 				method: val => {
			// 					this.$router.push({ path: 'refundDetail', query: { id: val.id } });
			// 				},
			// 			},
			// 			{
			// 				name: val => {
			// 					if (
			// 						val.status === 'WAIT_DISPOSE' ||
			// 						val.status === 'USER_PROCESSED'
			// 					) {
			// 						return '去处理';
			// 					}
			// 				},
			// 				method: val => {
			// 					this.$router.push({ path: 'refundPage', query: { id: val.id } });
			// 				},
			// 			},
			// 		],
			// 	},
			// ],
		};
	},
	methods: {
		moneyFormat(num) {
			return moneyFormat(num);
		},
		handleClick() {},
	},
};
</script>

<style lang="scss" scoped></style>
