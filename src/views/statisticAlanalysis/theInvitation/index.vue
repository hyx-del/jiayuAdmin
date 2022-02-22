<!--
 * @Author: wei.chen
 * @Date: 2020-07-17 12:06:23
 * @LastEditors: xin.chen
 * @LastEditTime: 2021-04-02 12:40:49
 * @Descripttion:
-->
<template>
	<div class="distributorExamine">
		<!-- 查询搜索 -->
		<el-form :inline="true" :model="searchfrom" ref="searchForm" class="demo-form-inline">
			<el-form-item prop="userId" label="用户ID">
				<el-input
					v-model.trim="searchfrom.userId"
					size="small"
					placeholder="请输入"
					prefix-icon="el-icon-search"
					type="number"
				></el-input>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="onClickSearch" size="small">查询</el-button>
			</el-form-item>
		</el-form>

		<!-- 表格 -->

		<el-table ref="TableList" :data="getList" border style="width: 100%">
			<el-table-column prop="id" label="序号" width="150">
				<template slot-scope="scope">
					<div>{{ scope.$index + 1 }}</div>
				</template>
			</el-table-column>
			<el-table-column prop="userId" label="用户ID">
				<template slot-scope="scope">
					<el-button type="text" @click="openEditDialog(scope.row.userId)" size="small">
						{{ scope.row.userId }}
					</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="teamTotal" label="团队总人数">
				<template slot-scope="scope">
					<div>{{ scope.row.teamTotal }}</div>
				</template>
			</el-table-column>
			<el-table-column prop="firstCount" label="一级下家">
				<template slot-scope="scope">
					<div>{{ scope.row.firstCount }}</div>
				</template>
			</el-table-column>
			<el-table-column prop="secondCount" label="二级下家">
				<template slot-scope="scope">
					<div>{{ scope.row.secondCount }}</div>
				</template>
			</el-table-column>
			<el-table-column prop="firstLastDay" label="昨日新增一级">
				<template slot-scope="scope">
					<div>{{ scope.row.firstLastDay }}</div>
				</template>
			</el-table-column>
			<el-table-column prop="secondLastDay" label="昨日新增二级">
				<template slot-scope="scope">
					<div>{{ scope.row.secondLastDay }}</div>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
import Table from '@/components/Table/index';
import { parseTime } from '@/utils';
import { Message } from 'element-ui';

import { getAllCat } from '@/api/cat';
import { getTwoPagePointList, adminApiInviteData } from '@/api/statisticAlanalysis';

export default {
	name: 'theInvitation',
	components: {
		Table,
	},
	data() {
		return {
			searchfrom: {
				userId: null, //  名称
			},
			column: [
				{
					prop: 'userId',
					label: '用户ID',
				},
				{
					prop: 'teamTotal',
					label: '团队总人数',
				},
				{
					prop: 'firstCount',
					label: '一级下家',
				},
				{
					prop: 'secondCount',
					label: '二级下家',
				},
				{
					prop: 'firstLastDay',
					label: '昨日新增一级',
				},
				{
					prop: 'secondLastDay',
					label: '昨日新增二级',
				},
			],

			rules: {
				remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
			},
			getList: null,
			dialogVisible: false,
		};
	},

	mounted() {
		adminApiInviteData({}).then(res => {
			if (res.code == 200) {
				this.getList = res.data;
			}
		});
	},
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
			adminApiInviteData(this.searchfrom).then(res => {
				if (res.code == 200) {
					this.getList = res.data;
				}
			});
		},
		// 重置事件
		resetForm(formName) {
			this.$refs[formName].resetFields();
			console.log('======>>this.searchfrom', this.searchfrom);
			this.searchfrom.dayStart = null;
			this.searchfrom.dayEnd = null;
		},
		openEditDialog(item) {
			this.$router.push({
				path: '/operation/userDetail',
				query: { userId: item },
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.distributorExamine {
	padding: 20px;
}
</style>
