<!--
 * @Author: wei.chen
 * @Date: 2020-06-30 15:13:21
 * @LastEditors: aa
 * @LastEditTime: 2021-07-09 13:46:00
 * @Descripttion: 这边无法携带状态过来，刷新的问题
-->
<template>
	<div class="refundTable">
		<el-form :inline="true" :model="ruleForm" ref="ruleForm" class="demo-form-inline">
			<el-form-item label="用户Id">
				<el-input
					placeholder="请输入"
					prefix-icon="el-icon-search"
					v-model.trim="ruleForm.userId"
					size="small"
				></el-input>
			</el-form-item>
			<el-form-item label="用户昵称">
				<el-input
					placeholder="请输入"
					prefix-icon="el-icon-search"
					v-model.trim="ruleForm.nickName"
					maxlength="20"
					size="small"
				></el-input>
			</el-form-item>
			<el-form-item label="订单编号" prop="orderNum">
				<el-input
					placeholder="请输入订单编号"
					prefix-icon="el-icon-search"
					v-model.trim="ruleForm.orderNum"
					size="small"
				></el-input>
			</el-form-item>
			<el-form-item label="售后编号" prop="num">
				<el-input
					placeholder="请输入"
					prefix-icon="el-icon-search"
					v-model.trim="ruleForm.num"
					size="small"
				></el-input>
			</el-form-item>
			<el-form-item label="下单时间" prop="regDate">
				<el-date-picker
					@change="onOrderChangeTime"
					v-model.trim="ruleForm.orderCreateTime"
					type="daterange"
					size="small"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					:default-time="['00:00:00', '23:59:59']"
					value-format="timestamp"
				></el-date-picker>
			</el-form-item>
			<el-form-item label="售后申请时间" prop="regDate">
				<el-date-picker
					@change="onChangeTime"
					v-model.trim="ruleForm.regDate"
					type="daterange"
					size="small"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					:default-time="['00:00:00', '23:59:59']"
					value-format="timestamp"
				></el-date-picker>
			</el-form-item>
			<el-form-item label="退款原因" prop="afterReasonId">
				<el-select v-model.trim="ruleForm.afterReasonId" placeholder="请选择" size="small">
					<el-option
						v-for="item in refundReasons"
						:key="item.id"
						:label="item.reason"
						:value="item.id"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="售后状态" prop="status">
				<el-select v-model.trim="ruleForm.status" placeholder="请选择" size="small">
					<el-option
						v-for="item in handleStates"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					></el-option>
				</el-select>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" size="small" @click="onClickSearch">
					查询
				</el-button>
				<el-button type="primary" size="small" @click="resetForm('ruleForm')">
					重置
				</el-button>
				<el-button type="primary" size="small" @click="exportDelivery">
					导出
				</el-button>
			</el-form-item>
		</el-form>
		<Table :loadData="getList" :column="column" :params="{ goodsStatus: name }" ref="orderList">
			<template v-slot:orderDetailList="{ scope }">
				<!-- <div v-text="scope"></div> -->
				<div v-for="item in scope.orderDetailList" :key="item.id">
					<div>
						{{
							`名称：${item.itemName} 规格：${item.skuName} 货号：${item.itemNo} 购买数量：${item.amount}`
						}}
					</div>
				</div>
			</template>
		</Table>
	</div>
</template>

<script>
import Table from '@/components/Table/index';
import { Message } from 'element-ui';
import { parseTime } from '@/utils';
import { getAfterServiceList } from '@/api/orderAfterService';
import { getRefundReasonsList } from '@/api/refundReasons';
import { moneyFormat } from '@/core/directives/money';
export default {
	name: 'refundTable',
	components: {
		Table,
	},
	props: {
		isShowAfterType: {
			type: Boolean,
			default: false,
		},
		name: {
			type: String,
		},
		handleStates: {
			type: Array,
		},
		// column: {
		// 	type: Array,
		// },
	},
	data() {
		return {
			ruleForm: {
				afterReasonId: null, // 售后原因Id
				afterType: null, // 售后方式
				applyStartTime: null, // 退款申请开始时间
				applyEndTime: null, // 退款申请结束时间
				orderNum: null, // 订单编号
				status: null, // 售后单状态
				regDate: [],
			},
			refundReasons: [],
			types: [
				{ value: 'REFUND', label: '仅退款' },
				{ value: 'REFUND_RETURN', label: '退款/退货' },
				{ value: 'EXCHANGE_GOODS', label: '商品损坏/换货' },
			],
			column: [
				{
					prop: 'createTime',
					label: '申请时间',
					formatter: (row, column) => {
						return parseTime(row.createTime);
					},
				},
				{
					prop: 'orderNum',
					label: '订单编号',
				},
				{
					prop: 'orderCreateTime',
					label: '下单时间',
					formatter: (row, column) => {
						return parseTime(row.orderCreateTime);
					},
				},
				{ prop: 'userId', label: '用户ID' },
				{ prop: 'nickName', label: '用户昵称' },
				{
					prop: 'orderDetailList',
					label: '商品信息',
					width: 300,
					align: 'left',
					render: true,
				},
				{ prop: 'itemTotalPrice', label: '商品总价' },
				{
					prop: 'useBalanceMoney',
					label: '余额支付',
					// formatter: (row, column) => {
					// 	return `${moneyFormat(row.useBalanceMoney)}元`;
					// },
				},
				{
					prop: 'payPrice',
					label: '第三方支付',
					// formatter: (row, column) => {
					// 	return `${moneyFormat(row.payPrice)}元`;
					// },
				},

				{ prop: 'afterReason', label: '退款原因' },
				{
					prop: 'handlingTime',
					label: '处理时间',
					formatter: (row, column) => {
						return parseTime(row.handlingTime);
					},
				},
				{ prop: 'num', label: '售后编号' },
				{
					prop: 'statusName',
					label: '处理状态',
				},
				{
					prop: 'actualRefundAmount',
					label: '退第三方支付',
					// formatter: (row, column) => {
					// 	return `${moneyFormat(row.actualRefundAmount)}元`;
					// },
				},
				{
					prop: 'actualRefundBalanceAmount',
					label: '退余额支付',
					// formatter: (row, column) => {
					// 	return `${moneyFormat(row.actualRefundBalanceAmount)}元`;
					// },
				},

				{
					prop: 'source',
					label: '售后来源',
					formatter: row => {
						switch (row.source) {
							case 'ANDROID':
								return 'APP';
								break;
							case 'IOS':
								return 'APP';
								break;
							case 'MINI':
								return '小程序';
								break;
							case 'H5':
								return '小程序';
								break;
							case 'WEB':
								return 'PC';
								break;
							case 'BYTE_DANCE_MINI':
								return '抖音小程序';
								break;
							default:
								return '-';
								break;
						}
					},
				},
				{
					prop: 'actives',
					label: '操作',
					fixed: 'right',
					actives: [
						{
							name: val => {
								if (val.status != 'WAIT_DISPOSE') {
									return '详情';
								}
							},
							method: val => {
								this.$router.push({ path: 'refundDetail', query: { id: val.id } });
							},
						},
						{
							name: val => {
								if (
									val.status === 'WAIT_DISPOSE' ||
									val.status === 'USER_PROCESSED'
								) {
									return '去处理';
								}
							},
							method: val => {
								this.$router.push({ path: 'refundPage', query: { id: val.id } });
							},
						},
					],
				},
			],
		};
	},
	computed: {
		getList() {
			return getAfterServiceList;
		},
	},
	mounted() {
		getRefundReasonsList().then(res => {
			if (res.success) {
				this.refundReasons = res.data.list;
			}
		});
		// TODO
		let _key = this.$route.query.status || '';
		if (_key) {
			this.ruleForm.status = _key;
			this.$refs.orderList.update({ status: _key });
		}
	},
	methods: {
		// 导出待发货的订单
		exportDelivery() {
			// 封装数据
			const _tempSoure = { ...this.ruleForm };
			_tempSoure.goodsStatus = this.name;

			if (!_tempSoure.regDate || _tempSoure.regDate.length === 0) {
				delete _tempSoure.regDate;
			}
			let _par = '?';
			for (let obj in _tempSoure) {
				if (_tempSoure[obj]) {
					_par += `${obj}=${_tempSoure[obj]}&`;
				}
			}

			let url = `${process.env.VUE_APP_BASE_API}/adminApi/order/afterService/export${_par}`;
			window.open(url);
		},
		// 重置
		resetForm(formName) {
			this.$refs[formName].resetFields();
			this.ruleForm.applyEndTime = null;
			this.ruleForm.applyStartTime = null;
		},
		// 查询
		onClickSearch() {
			this.$refs.orderList.update({ ...this.ruleForm });
		},
		// reset() {
		// 	this.$refs.orderList.reset()
		// },
		onOrderChangeTime(val) {
			if (val) {
				this.ruleForm.orderCreateTimeStart = val[0];
				this.ruleForm.orderCreateTimeEnd = val[1];
			} else {
				this.ruleForm.orderCreateTimeEnd = null;
				this.ruleForm.orderCreateTimeStart = null;
			}
		},
		// 选择时间
		onChangeTime(val) {
			if (val) {
				this.ruleForm.applyStartTime = val[0];
				this.ruleForm.applyEndTime = val[1];
			} else {
				this.ruleForm.applyEndTime = null;
				this.ruleForm.applyStartTime = null;
			}
		},
	},
};
</script>

<style lang="scss" scoped></style>
