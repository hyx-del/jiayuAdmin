<!--
 * @Author:wei.chen
 * @Date: 2020-06-11 11:46:00
 * @LastEditTime: 2021-08-03 15:38:18
 * @LastEditors: jiu yin zhen jing
 * @Description: 
-->
<template>
	<div class="dashboard_container">
		<div>
			<div class="dashboard_container_title">
				<h4>运营数据</h4>
				<span>{{ curDate }}</span>
			</div>
			<!-- <div class="dashboard_container_list">
				<el-card class="top_box_card" shadow="always">
					<div class="list_item">
						<div class="list_item_top">
							<div class="count">{{ operationData.userTodayNew }}人</div>
							<div>日新增用户</div>
						</div>
						<div>日环比</div>
						<div>
							<i
								class="el-icon-caret-bottom"
								style="color:#33ff00"
								v-if="operationData.userDayPercent < 0"
							></i>
							<i class="el-icon-caret-top" style="color:red" v-else></i>
							<span>{{ operationData.userDayPercent }}%</span>
						</div>
					</div>
					<div class="list_item_line"></div>
					<div class="list_item_count">总用户数：{{ operationData.userTotal }} 人</div>
				</el-card>
				<el-card class="top_box_card">
					<div class="list_item">
						<div class="list_item_top">
							<div class="count">{{ operationData.orderTodayNew }}单</div>
							<div>今日订单量</div>
						</div>
						<div>日环比</div>
						<div>
							<i
								class="el-icon-caret-bottom"
								style="color:#33ff00"
								v-if="operationData.orderDayPercent < 0"
							></i>
							<i class="el-icon-caret-top" style="color:red" v-else></i>
							<span>{{ operationData.orderDayPercent }}%</span>
						</div>
					</div>
					<div class="list_item_line"></div>
					<div class="list_item_count">订单总量：{{ operationData.orderTotal }} 单</div>
				</el-card>
				<el-card class="top_box_card">
					<div class="list_item">
						<div class="list_item_top">
							<div class="count">{{ operationData.priceToday }}元</div>
							<div>今日销售额</div>
						</div>
						<div>日环比</div>
						<div>
							<i
								class="el-icon-caret-bottom"
								style="color:#33ff00"
								v-if="operationData.priceDayPercent < 0"
							></i>
							<i class="el-icon-caret-top" style="color:red" v-else></i>
							<span>{{ operationData.priceDayPercent }}%</span>
						</div>
					</div>
					<div class="list_item_line"></div>
					<div class="list_item_count">销售总额：{{ operationData.priceTotal }} 元</div>
				</el-card>
			</div> -->
		</div>
		<!-- 待处理事务 -->
		<!-- <div style="margin-top:24px">
			<div class="dashboard_container_title">
				<h4>待处理事务</h4>
			</div>
			<div class="dashboard_container_list">
				<el-card class="top_box_card_transaction" shadow="always">
					<div class="transaction_list">
						<div class="dashboard_container_list">
							<router-link to="/order/orderList?type=WAIT_SHIP">
								<div class="list_item_top">
									<div>待发货订单</div>
									<div class="list_item_top_num">
										({{ waitworkData.orderWaitShipCount }})
									</div>
								</div>
							</router-link>
							<div class="list_item_line"></div>
						</div>
						<div class="dashboard_container_list">
							<router-link to="/distributorManage/distributorExamine?status=SUBMIT">
								<div class="list_item_top">
									<div>待审核经销商</div>
									<div class="list_item_top_num">
										({{ waitworkData.distributorWaitWorkCount }})
									</div>
								</div>
							</router-link>
							<div class="list_item_line"></div>
						</div>
						<div class="dashboard_container_list">
							<router-link to="/afterSalesManagement/refundList?status=WAIT_DISPOSE">
								<div class="list_item_top">
									<div>待处理售后</div>
									<div class="list_item_top_num">
										({{ waitworkData.orderReturnWaitDisposeCount }})
									</div>
								</div>
							</router-link>
							<div class="list_item_line"></div>
						</div>
					</div>
				</el-card>
			</div>
		</div> -->
		<!-- 经营报表数据 -->
		<!-- 运营排行榜 -->
		<!-- <div style="margin-top:24px">
			<div class="dashboard_container_title">
				<h4>运营排行榜</h4>
			</div>
			<div>
				<el-row :gutter="20" class="report_item">
					<el-col :span="12">
						<h4>商品销量排行TOP50</h4>
						<div class="grid_content">
							<Table
								:loadData="itemCountRankTop"
								:params="{ size: 5 }"
								:showSortIndex="{ lable: '排名', show: true }"
								ref="goodsTop50"
								:column="goodsTop50Column"
							>
								<template v-slot:name="{ scope }">
									<router-link
										tag="a"
										class="gotoPage"
										style="color:blue"
										:to="{
											path: '/goodsManage/goodsList/goodsDetail',
											query: { id: scope.id },
										}"
									>
										{{ scope.name }}
									</router-link>
								</template>
							</Table>
						</div>
					</el-col>
				</el-row>
			</div>
		</div> -->
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

import { parseTime } from '@/utils/index';
import { Message } from 'element-ui';
import Table from '@/components/Table/index';

export default {
	components: { Table },
	data() {
		const _tempData = new Date().setHours(23, 59, 59, 999);

		return {
			goodsTop50Column: [
				{
					prop: 'name',
					label: '商品名称',
					render: true,
					// formatter: row => {
					// 	return row.name;
					// },
				},
				{ prop: 'saleCount', label: '销售量', width: 100 },
			],
			userConsumptionTop50Column: [
				{ prop: 'userName', label: '用户昵称', render: true },
				{ prop: 'userId', label: '用户ID' },
				{ prop: 'price', label: '消费金额' },
			],
			classTop50Column: [
				{ prop: 'parentCatName', label: '一级类目' },
				{ prop: 'catName', label: '二级类目' },
				{ prop: 'saleCount', label: '销售量' },
			],
			img: '',
			curDate: new Date(),
			selectedPicker: [_tempData - 3600 * 1000 * 24 * 31 + 2, _tempData],
			reportData: {},
			waitworkData: {},
			operationData: {},
			pickerOptions: {
				shortcuts: [
					{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						},
					},
					{
						text: '最近30天',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						},
					},
					{
						text: '最近90天',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						},
					},
				],
			},
		};
	},
	name: 'Dashboard',
	computed: {
		catSaleCountRankTop() {
			return null;
		},
		itemCountRankTop() {
			return null;
		},
		userPayRankTop() {
			return null;
		},
	},

	mounted() {
		this.curDate = parseTime(new Date(), '{y}-{m}-{d}');
		this.initData();
	},
	methods: {
		initData() {
			this.queryReportData();
			this.getTopCountData();
		},
		getTopCountData() {
			// getOperational().then(res => {
			// 	if (res.code == 200) {
			// 		this.operationData = res.data;
			// 	}
			// });
			// getDashboardWaitWork().then(res => {
			// 	if (res.code == 200) {
			// 		// distributorWaitWorkCount   待审核经销商
			// 		// orderReturnWaitDisposeCount  待处理售后
			// 		// orderWaitShipCount  // 待发货
			// 		this.waitworkData = res.data;
			// 	}
			// });
		},
		queryReportData() {
			if (this.selectedPicker && this.selectedPicker.length > 1) {
				const _query = {
					start: new Date(this.selectedPicker[0]).getTime(),
					end: new Date(this.selectedPicker[1]).getTime(),
				};
				// getDashboardReport(_query).then(res => {
				// 	if (res.code == 200) {
				// 		this.reportData = res.data;
				// 	}
				// });
			} else {
				Message.warning('请选择时间周期');
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.dashboard_container {
	padding: 20px;
	.dashboard_container_title {
		display: flex;
		align-items: center;
		span {
			padding-left: 16px;
		}
	}
	.dashboard_container_list {
		display: flex;
		flex-direction: row;
		.top_box_card_transaction {
			width: 680px;
		}
		.transaction_list {
			display: flex;
			flex-direction: row;

			.dashboard_container_list {
				display: flex;
				flex-direction: column;
				flex: 1;
				.list_item_top {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					.list_item_top_num {
						font-size: 16px;
						color: #d9001b;
					}
				}
				.list_item_line {
					margin-bottom: 6px;
				}
			}
			.dashboard_container_list + .dashboard_container_list {
				margin-left: 60px;
			}
		}
		.list_item {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			.list_item_top {
				font-weight: bold;
			}
			.count {
				font-size: 22px;
			}
			.list_item_count {
				color: #7f7f7f;
			}
		}
		.list_item_line {
			margin-top: 16px;
			margin-bottom: 16px;
			width: 100%;
			height: 1px;
			background-color: #eee;
		}
		.top_box_card + .top_box_card {
			margin-left: 40px;
		}
	}
	.top_box_card {
		width: 300px;
		.el-card__body {
			display: flex;
			flex-direction: column;
		}
	}
	.report_item + .report_item {
		margin-top: 24px;
	}
	.grid_content {
		padding: 16px;
		border: 1px solid #eee;
		border-radius: 4px;
		.grid_content_title {
			color: #999;
		}
		.grid_content_num {
			padding-top: 12px;
			font-size: 30px;
		}
	}
}
</style>
