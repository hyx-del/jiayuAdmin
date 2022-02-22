<!--
 * @Author: wei.chen
 * @Date: 2020-07-17 12:06:23
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-03-01 16:39:03
 * @Descripttion: 
-->
<template>
	<div class="distributorExamine">
		<!-- 查询搜索 -->
		<el-form :inline="true" :model="searchfrom" ref="searchForm" class="demo-form-inline">
			<el-form-item prop="pageName" label="页面名称">
				<el-input
					v-model.trim="searchfrom.pageName"
					size="small"
					placeholder="请输入"
					prefix-icon="el-icon-search"
				></el-input>
			</el-form-item>

			<el-form-item label="选择时间范围" prop="time">
				<el-date-picker
					v-model="searchfrom.time"
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					size="small"
					:default-time="['00:00:00', '23:59:59']"
					value-format="timestamp"
					@change="onChangeTime"
				></el-date-picker>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="onClickSearch" size="small">查询</el-button>
				<el-button type="primary" @click="resetForm('searchForm')" size="small">
					重置
				</el-button>
			</el-form-item>
		</el-form>

		<!-- 表格 -->
		<Table
			:loadData="getList"
			:column="column"
			:showSortIndex="{ show: true, lable: '序号' }"
			ref="TableList"
		></Table>
	</div>
</template>

<script>
import Table from '@/components/Table/index';
import { parseTime } from '@/utils';
import { Message } from 'element-ui';

import { getAllCat } from '@/api/cat';
import { getTwoPagePointList } from '@/api/statisticAlanalysis';

export default {
	name: 'distributorExamine',
	components: {
		Table,
	},
	data() {
		return {
			searchfrom: {
				dayStart: null, // 注册开始时间
				dayEnd: null, // 注册结束时间
				pageName: null, //  名称
				time: [],
			},
			column: [
				{
					prop: 'twoPageName',
					label: '页面名称',
				},
				{
					prop: 'dayViewTimes',
					label: '访问次数',
				},

				{
					prop: 'dayViewHoldSeconds',
					label: '平均访问时长',
					formatter: (row, column) => {
						if (row.dayViewTimes == 0) {
							return '--';
						} else {
							return (row.dayViewHoldSeconds / row.dayViewTimes).toFixed(2) + 's';
						}
					},
				},
			],

			rules: {
				remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
			},
		};
	},
	computed: {
		getList() {
			return getTwoPagePointList;
		},
	},
	mounted() {},
	methods: {
		// 选择时间
		onChangeTime(val) {
			console.log(val);
			if (val) {
				this.searchfrom.dayStart = val[0];
				this.searchfrom.dayEnd = val[1];
				this.$forceUpdate(); // vue 强制同步数据的方法
			} else {
				this.searchfrom.dayStart = null;
				this.searchfrom.dayEnd = null;
			}
		},
		// 查询搜索事件
		onClickSearch() {
			this.$refs.TableList.update({ ...this.searchfrom });
		},
		// 重置事件
		resetForm(formName) {
			this.$refs[formName].resetFields();
			console.log('======>>this.searchfrom', this.searchfrom);
			this.searchfrom.dayStart = null;
			this.searchfrom.dayEnd = null;
		},
	},
};
</script>

<style lang="scss" scoped>
.distributorExamine {
	padding: 20px;
}
</style>
