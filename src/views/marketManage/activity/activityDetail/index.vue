<!--
 * @Author: wei.chen
 * @Date: 2020-06-19 16:11:32
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-07-15 11:10:42
 * @Descripttion:
-->
<template>
	<div class="activityDetail">
		<h4>活动信息</h4>
		<el-row :gutter="12">
			<el-col :span="8">
				<el-card shadow="hover">
					<h3>活动标题：{{ activityInfo.title }}</h3>
					<div>
						<el-tooltip
							class="item itemName"
							effect="dark"
							:content="activityInfo.description"
							placement="top"
						>
							<p>活动描述：{{ activityInfo.description }}</p>
						</el-tooltip>
						<p>活动类型：{{ `限时抢购` }}</p>
						<p>
							活动时间：{{ parseTime(activityInfo.rushBeginTime) }} 至
							{{ parseTime(activityInfo.rushEndTime) }}
						</p>
					</div>
				</el-card>
			</el-col>
			<el-col :span="8">
				<el-card shadow="hover">
					<h3>活动标题：其他资料</h3>
					<div>
						<p>抢购人数倍数：{{ activityInfo.crowdMulti }}倍</p>
						<p>
							全场是否包邮：{{
								fareConfig.freeShip
									? '包邮'
									: `不包邮，默认运费${moneyFormat(
											fareConfig.fare
									  )}，商品合计价格满${moneyFormat(
											fareConfig.priceAchieve
									  )}元，运费为${moneyFormat(fareConfig.farePrice)}元`
							}}
						</p>
						<p>
							不支持包邮地区：
							<span
								v-for="(item, index) in fareConfig.notFreeShipInfoList"
								:key="index"
							>
								{{ `${item.name}(${moneyFormat(item.fare)}元)` }}
								<span v-if="index > 0">、</span>
							</span>
						</p>
					</div>
				</el-card>
			</el-col>
			<el-col :span="8">
				<el-card shadow="hover">
					<h3>统计</h3>
					<div class="data_info">
						<!-- <p>商品销售总额：{{ moneyFormat(statisticsInfo.saleAmount) }}元</p> -->
						<p>活动参与人数：{{ statisticsInfo.purchaseNum }}</p>
						<p>订单量：{{ statisticsInfo.orderNum }}单</p>
						<!-- <p>活动订单合计金额：{{ moneyFormat(statisticsInfo.actuallyAmount) }}元</p> -->
					</div>
				</el-card>
			</el-col>
		</el-row>

		<el-tabs v-model="activeName">
			<el-tab-pane label="商品活动明细" name="item">
				<Table :column="column" :loadData="getItemList" :params="{ id: id }">
					<template v-slot:itemSkuImage="{ scope }">
						<el-image
							:src="scope.itemSkuImage"
							class="admin_avater"
							:preview-src-list="[scope.itemSkuImage]"
						/>
					</template>
				</Table>
			</el-tab-pane>

			<el-tab-pane label="订单明细" name="order">
				<el-form
					:inline="true"
					:model="formInline"
					ref="formInline"
					class="demo-form-inline"
				>
					<el-form-item label prop="orderNum">
						<el-input
							v-model.trim="formInline.orderNum"
							placeholder="请输入订单编号"
							size="small"
							prefix-icon="el-icon-search"
						></el-input>
					</el-form-item>
					<el-form-item label prop="phone">
						<el-input
							v-model.trim="formInline.phone"
							placeholder="请输入手机号"
							size="small"
							prefix-icon="el-icon-search"
						></el-input>
					</el-form-item>
					<el-form-item label="下单时间" prop="dateValue">
						<el-date-picker
							v-model.trim="formInline.dateValue"
							type="daterange"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							@change="onChangeTime"
							:default-time="['00:00:00', '23:59:59']"
							value-format="timestamp"
							size="small"
						></el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="small" @click="onClickSearch">
							查询
						</el-button>
						<el-button type="primary" size="small" @click="resetForm('formInline')">
							重置
						</el-button>
					</el-form-item>
				</el-form>
				<Table
					:column="columnOrder"
					:loadData="getOrderList"
					:params="{ id: id }"
					ref="refOrderList"
				>
					<template v-slot:orderNum="{ scope }">
						<router-link
							tag="span"
							class="gotoPage"
							:to="{ path: '/order/detail', query: { id: scope.orderId } }"
						>
							{{ scope.orderNum }}
						</router-link>
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
import { parseTime } from '@/utils';
import { moneyFormat } from '@/core/directives/money';
export default {
	name: 'activityDetail',
	components: {
		Table,
	},
	data() {
		return {
			activeName: 'item',
			formInline: {
				orderNum: null,
				phone: null,
				startTime: null,
				endTime: null,
				dateValue: [],
			},
			column: [
				{
					prop: 'itemSkuImage',
					label: '商品规格展示图',
					render: true,
				},
				{ prop: 'itemName', label: '商品名称' },
				{ prop: 'properties', label: '规格' },
				{
					prop: 'skuRushPrice',
					label: '抢购价',
					formatter: row => {
						return `${this.moneyFormat(row.skuRushPrice)}元`;
					},
				},
				{
					prop: 'skuPrice',
					label: '未划线价',
					formatter: row => {
						return `${this.moneyFormat(row.skuPrice)}元`;
					},
				},
				{
					prop: 'inventoryActNum',
					label: '活动库存',
					formatter: row => {
						return `${row.inventoryNum}/${row.inventoryActNum}`;
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
					prop: 'orderCount',
					label: '订单量',
					formatter: row => {
						return `${row.orderCount}单`;
					},
				},
				// {
				// 	prop: 'purchaseNum',
				// 	label: '实际购买人数',
				// 	formatter: row => {
				// 		return `${row.purchaseNum}人`;
				// 	},
				// },
				// {
				// 	prop: 'saleAmount',
				// 	label: '累计销售额（实付）',
				// 	formatter: row => {
				// 		return `${this.moneyFormat(row.saleAmount)}元`;
				// 	},
				// },
			],
			columnOrder: [
				{
					prop: 'createTime',
					label: '下单时间',
					formatter: row => {
						return parseTime(row.createTime);
					},
				},
				{ prop: 'orderNum', label: '订单编号', render: true },
				{ prop: 'nickName', label: '会员昵称', render: true },
				{ prop: 'receiverName', label: '收货人' },
				{ prop: 'receiverPhone', label: '收货人手机号' },
				{ prop: 'itemName', label: '商品名称', render: true },
				// {
				// 	prop: 'itemPrice',
				// 	label: '商品售价',
				// 	formatter: row => {
				// 		return `${this.moneyFormat(row.itemPrice)}元`;
				// 	},
				// },
				// { prop: 'itemNum', label: '数量' },
				// {
				// 	prop: 'itemTotalPrice',
				// 	label: '商品合计',
				// 	formatter: row => {
				// 		return `${this.moneyFormat(row.itemTotalPrice)}元`;
				// 	},
				// },
				// {
				// 	prop: 'totalDeductAmount',
				// 	label: '优惠金额',
				// 	formatter: row => {
				// 		return `${this.moneyFormat(row.totalDeductAmount)}元`;
				// 	},
				// },
				// {
				// 	prop: 'fare',
				// 	label: '运费',
				// 	formatter: row => {
				// 		return `${this.moneyFormat(row.fare)}元`;
				// 	},
				// },
				// {
				// 	prop: 'orderTotalPrice',
				// 	label: '订单合计',
				// 	formatter: row => {
				// 		return `${this.moneyFormat(row.orderTotalPrice)}元`;
				// 	},
				// },
				// {
				// 	prop: 'payPrice',
				// 	label: '实际支付金额',
				// 	formatter: row => {
				// 		return `${this.moneyFormat(row.payPrice)}元`;
				// 	},
				// },
				{
					prop: 'source',
					label: '订单来源',
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
			],
			id: this.$route.query.id || null,
			activityInfo: {}, // 活动信息数据
			statisticsInfo: {}, // 统计信息数据
			fareConfig: {}, // 其他资料数据
		};
	},
	computed: {
		getOrderList() {
			return getOrders;
		},
		getItemList() {
			return getItems;
		},
	},
	created() {
		if (this.id) {
			getAllActivityInfo({ id: this.id }).then(res => {
				if (res.success) {
					this.activityInfo = res.data.limitPromotion;
					this.fareConfig = res.data.fareConfig || {};
				}
			});
			getStatistics({ id: this.id }).then(res => {
				if (res.success) {
					this.statisticsInfo = res.data;
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
			} else {
				this.formInline.startTime = null;
				this.formInline.endTime = null;
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
.activityDetail {
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
