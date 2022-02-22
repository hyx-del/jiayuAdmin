<!--
 * @Author: wei.chen
 * @Date: 2020-06-19 16:11:32
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-07-15 11:11:54
 * @Descripttion:
-->
<template>
	<div class="groupsBuyDetailComp">
		<h4>活动信息</h4>
		<el-row :gutter="12">
			<el-col :span="12">
				<el-card shadow="hover">
					<h3>活动标题：{{ activityInfo.name }}</h3>
					<div>
						<p>创建时间：{{ parseTime(activityInfo.createTime) }}</p>
						<p>
							活动商品数：{{
								activityInfo.groupItemList ? activityInfo.groupItemList.length : ''
							}}
						</p>

						<p>
							活动时间区间：{{ parseTime(activityInfo.startTime) }} 至
							{{ parseTime(activityInfo.endTime) }}
						</p>
					</div>
				</el-card>
			</el-col>
			<el-col :span="8">
				<el-card shadow="hover">
					<p>创建人：{{ activityInfo.creator }}</p>
					<div>
						<p>拼团人数:2</p>
					</div>
					<p>拼团时间：{{ activityInfo.limitMinute }}分</p>
				</el-card>
			</el-col>
		</el-row>

		<el-tabs v-model="activeName">
			<el-tab-pane label="商品活动明细" name="goods">
				<Table
					:column="columnGoods"
					:loadData="groupsBuyStatistics"
					:params="{ id: id }"
					ref="refOrderList"
				>
					<template v-slot:cover="{ scope }">
						<el-image
							:src="scope.cover"
							v-if="scope.cover"
							class="admin_avater"
							:preview-src-list="[scope.cover]"
						/>
						<span v-else>-</span>
					</template>
					<template v-slot:nickName="{ scope }">
						<router-link
							tag="span"
							class="gotoPage"
							:to="{ path: '/operation/userDetail', query: { userId: scope.userId } }"
						>
							{{ scope.nickName }}
						</router-link>
					</template>
					<template v-slot:itemName="{ scope }">
						<router-link
							tag="span"
							class="gotoPage"
							:to="{
								path: '/goodsManage/goodsList/goodsDetail',
								query: { id: scope.itemId },
							}"
						>
							{{ scope.itemName }}
						</router-link>
					</template>
				</Table>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import Table from '@/components/Table/index';
import { getAllActivityInfo, getStatistics, getOrders, getItems } from '@/api/activity';
import { groupsInfo, groupsBuyStatistics } from '@/api/marketManage';

import { parseTime } from '@/utils';
import { moneyFormat } from '@/core/directives/money';
export default {
	name: 'groupsBuyDetailComp',
	components: {
		Table,
	},
	data() {
		return {
			activeName: 'goods',
			formInline: {
				orderNum: null,
				phone: null,
				startTime: null,
				endTime: null,
				dateValue: [],
			},

			columnGoods: [
				{
					prop: 'cover',
					label: '商品规格展示图',
					render: true,
				},
				{ prop: 'itemName', label: '商品名称' },
				{ prop: 'name', label: '规格' },
				// {
				// 	prop: 'skuRushPrice',
				// 	label: '抢购价',
				// 	formatter: row => {
				// 		return `${this.moneyFormat(row.skuRushPrice)}元`;
				// 	},
				// },
				{
					prop: 'originPrice',
					label: '未划线价',
					formatter: row => {
						return `${this.moneyFormat(row.originPrice)}元`;
					},
				},
				{
					prop: 'limitNum',
					label: '每人限购数量',
					formatter: row => {
						if (row.limitNum === -1) {
							return '不限购';
						} else {
							return row.limitNum;
						}
					},
				},
				{
					prop: 'newUserOnly',
					label: '新用户专享',
					formatter: row => {
						if (row.newUserOnly === true) {
							return '是';
						} else {
							return '否';
						}
					},
				},
				{
					prop: 'sortIndex',
					label: '显示顺序',
					formatter: row => {
						if (row.limitNum === -1) {
							return '不限购';
						} else {
							return row.limitNum;
						}
					},
				},

				{
					prop: 'inventoryActNum',
					label: '拼团库存',
					// formatter: row => {
					// 	return `${row.inventoryNum}/${row.inventoryActNum}`;
					// },
				},
				{
					prop: 'inventoryNum',
					label: '实际剩余库存',
					// formatter: row => {
					// 	return `${row.inventoryNum}/${row.inventoryActNum}`;
					// },
				},
				{
					prop: 'price',
					label: '拼团价',
					formatter: row => {
						return `${this.moneyFormat(row.price)}元`;
					},
					// formatter: row => {
					// 	return `${row.inventoryNum}/${row.inventoryActNum}`;
					// },
				},

				{
					prop: 'orderCount',
					label: '订单量',
					formatter: row => {
						return `${row.orderCount}单`;
					},
				},
				{
					prop: 'groupJoinCount',
					label: '拼团数',
					formatter: row => {
						return `${row.groupJoinCount}人`;
					},
				},
				{
					prop: 'payPrice',
					label: '支付金额',
					formatter: row => {
						return `${this.moneyFormat(row.payPrice)}元`;
					},
				},
			],
			id: this.$route.query.id || null,
			activityInfo: {}, // 活动信息数据
		};
	},
	computed: {
		// getOrderList() {
		// 	return getOrders;
		// },
		groupsBuyStatistics() {
			return groupsBuyStatistics;
		},
	},
	created() {
		if (this.id) {
			groupsInfo({ id: this.id }).then(res => {
				if (res.success) {
					this.activityInfo = res.data;
				}
			});
		}
	},
	methods: {
		parseTime(val) {
			return parseTime(val);
		},
		onChangeTime(value) {
			console.log(value);
			if (value) {
				this.formInline.startTime = value[0];
				this.formInline.endTime = value[1];
			}
		},
		// 查询
		onClickSearch() {
			console.log(this.formInline);
			this.$refs.refOrderList.update({ ...this.formInline });
		},
		// 重置
		resetForm(formName) {
			this.$refs[formName].resetFields();
			this.formInline.startTime = null;
			this.formInline.endTime = null;
			this.$refs.refOrderList.reset();
		},
		moneyFormat(num) {
			return moneyFormat(num);
		},
	},
};
</script>

<style lang="scss" scoped>
.groupsBuyDetailComp {
	padding: 20px;
	.admin_avater {
		width: 100px;
	}
}

.demo-form-inline {
	margin-top: 20px;
}

.itemName {
	white-space: pre-wrap;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	line-clamp: 1;
	-webkit-box-orient: vertical;
}
.gotoPage {
	color: blue;
	cursor: pointer;
}
.gotoPage:hover {
	color: red;
}
</style>
