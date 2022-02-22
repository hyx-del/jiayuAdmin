<!--
 * @Author: tianhao
 * @Date: 2020-06-16 14:58:17
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-06-16 09:08:57
 * @Descripttion: 
-->
<template>
	<div class="orderList">
		<el-tabs v-model.trim="activeName" @tab-click="handleClick">
			<el-tab-pane label="全部">
				<TabTable :btn="false" :showReturnOrder="true" v-if="activeName == 0" name=""  />
			</el-tab-pane>
			<el-tab-pane label="待付款">
				<TabTable :btn="false" v-if="activeName == 1" name="0" />
			</el-tab-pane>
			<!-- <el-tab-pane label="待拼团">
				<TabTable :btn="false" v-if="activeName == 2" name="WAIT_GROUP" />
			</el-tab-pane> -->
			<el-tab-pane label="待发货">
				<TabTable :btn="true" v-if="activeName == 2" name="1" />
			</el-tab-pane>

			<el-tab-pane label="待收货">
				<TabTable :btn="false" v-if="activeName == 3" name="2" />
			</el-tab-pane>
			<el-tab-pane label="已完成">
				<TabTable :btn="false" :showReturnOrder="true" v-if="activeName == 4" name="3" />
			</el-tab-pane>
			<el-tab-pane label="已取消">
				<TabTable :btn="false" v-if="activeName == 5" name="4" />
			</el-tab-pane>
			<el-tab-pane label="已关闭">
				<TabTable :btn="false" v-if="activeName == 6" name="5" />
			</el-tab-pane>
			<!-- <el-tab-pane label="售后处理中">
				<TabTable :btn="false" v-if="activeName == 8" name="AFTER_SALE" />
			</el-tab-pane> -->
		</el-tabs>
	</div>
</template>

<script>
import TabTable from './tabTable';
export default {
	components: {
		TabTable,
	},
	data() {
		return {
			activeName: 0,
			name: '',
			showBtn: false,
		};
	},
	mounted() {
		this.handleClick();
		let _key = this.$route.query.type || '';
		switch (_key) {
			case 'WAIT_SHIP':
				this.activeName = '3';

				break;

			default:
				this.activeName = '0';
				break;
		}
	},
	methods: {
		handleClick() {
			// console.log('activeName', this.activeName);
		},
	},
};
</script>

<style>
.orderList {
	padding: 20px;
}
</style>
