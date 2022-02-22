<!--
 * @Author: wei.chen
 * @Date: 2020-06-18 18:52:13
 * @LastEditors: wei.chen
 * @LastEditTime: 2020-11-07 17:32:31
 * @Descripttion: 
-->
<template>
	<div class="activity">
		<el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
			<el-form-item label="拼团状态" prop="status">
				<el-select v-model.trim="formInline.status" placeholder="拼团状态" size="small">
					<el-option
						v-for="item in status"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onClickSearch" size="small">查询</el-button>
				<el-button type="primary" size="small" @click="resetForm('formInline')">
					重置
				</el-button>
			</el-form-item>
		</el-form>
		<el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">
			创建拼团
		</el-button>
		<Table :loadData="getList" :column="column" ref="groupsBuyList">
			<template v-slot:description="{ scope }">
				<el-tooltip
					class="item itemName"
					effect="dark"
					:content="scope.description"
					placement="top"
				>
					<p>{{ scope.description }}</p>
				</el-tooltip>
			</template>
			<!-- <template v-slot:banned="{ scope }">
				<el-switch
					v-model.trim="scope.banned"
					active-color="#13ce66"
					inactive-color="#ff4949"
					:active-value="false"
					:inactive-value="true"
					:disabled="scope.endTime < new Date().getTime() ? true : false"
					@change="ban(scope.id)"
				></el-switch>
			</template> -->
		</Table>
	</div>
</template>

<script>
import Table from '@/components/Table/index';
// import { getGroupsList, deleteGroups, groupsBanState } from '@/api/activity';
import { getGroupsList, deleteGroups, groupsBanState } from '@/api/marketManage';

import { parseTime } from '@/utils';
import { Message } from 'element-ui';
export default {
	components: {
		Table,
	},
	data() {
		return {
			formInline: {
				// title: '',
				status: 'ALL',
				// banned: '',
				// groupsBanState: '',
			},
			disabledStatus: false,
			status: [
				{ value: 'ALL', label: '全部' },
				{ value: 'UN_START', label: '未开始' },
				{ value: 'STARTING', label: '进行中' },
				{ value: 'END', label: '已结束' },
			],

			column: [
				{
					prop: 'createTime',
					label: '创建时间',
					formatter: (row, column) => {
						return parseTime(row.createTime);
					},
				},
				{ prop: 'name', label: '拼团名称' },
				{
					prop: 'startTime',
					label: '拼团开始时间',
					formatter: (row, column) => {
						return parseTime(row.startTime);
					},
				},
				{
					prop: 'endTime',
					label: '拼团结束时间',
					formatter: (row, column) => {
						return parseTime(row.endTime);
					},
				},
				{
					prop: 'itemCount',
					label: '拼团商品数量',
				},
				{
					prop: 'creator',
					label: '创建人',
				},
				{
					prop: 'itemSkuId',
					label: '拼团状态',
					formatter: (row, column) => {
						if (row.banned) {
							return '已结束';
						} else {
							if (row.startTime > new Date().getTime()) {
								return '未开始';
							} else if (row.endTime < new Date().getTime()) {
								return '已结束';
								this.disabledStatus = true;
							} else {
								return '进行中';
							}
						}
					},
				},

				{
					prop: 'actives',
					label: '操作',
					actives: [
						{
							name: val => {
								if (!val.banned) {
									if (
										val.startTime < new Date().getTime() &&
										val.endTime > new Date().getTime()
									) {
										return '终止';
									}
								}
							},
							method: val => {
								this.$confirm('确定要终止这个拼团吗?', '提示', {
									type: 'warning',
								}).then(() => {
									groupsBanState({ id: val.id }).then(res => {
										if (res.success) {
											this.$message({
												type: 'success',
												message: '操作成功！！！',
											});
											this.$refs.groupsBuyList.reset();
										}
									});
								});
							},
						},
						{
							name: val => {
								if (val.startTime > new Date().getTime()) {
									return '编辑';
								} else {
									return '详情';
								}
							},
							method: val => {
								if (val.startTime > new Date().getTime()) {
									this.$router.push({
										path: 'addGroupBuy',
										query: { id: val.id, title: '编辑' },
									});
								} else {
									this.$router.push({
										path: 'groupBuyDetail',
										query: { id: val.id },
									});
								}
							},
						},
						{
							name: val => {
								if (val.startTime > new Date().getTime()) {
									return '移除';
								}
							},
							method: val => {
								this.$confirm('确定要移除这个拼团吗?', '提示', {
									type: 'warning',
								}).then(() => {
									deleteGroups({ id: val.id }).then(res => {
										if (res.success) {
											this.$message({
												type: 'success',
												message: '移除成功！！！',
											});
											this.$refs.groupsBuyList.reset();
										}
									});
								});
							},
						},
					],
				},
			],
		};
	},
	beforeRouteLeave(to, from, next) {
		to.meta.title = to.query.title;
		next();
	},
	computed: {
		getList() {
			return getGroupsList;
		},
	},
	methods: {
		// 添加拼团
		handleAdd() {
			this.$router.push({ path: 'addGroupBuy', query: { title: '添加' } });
		},
		onSubmit() {
			console.log('submit!');
		},
		// 查询
		onClickSearch() {
			// console.log('======>', this.formInline)
			this.$refs.groupsBuyList.update({ ...this.formInline });
		},
		// 重置
		resetForm(formName) {
			this.$refs[formName].resetFields();
			this.$refs.groupsBuyList.reset();
		},
	},
};
</script>

<style scoped>
.activity {
	padding: 20px;
}
.admin_avater {
	height: 50px;
	width: 80px;
}
.itemName {
	white-space: pre-wrap;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	-webkit-box-orient: vertical;
}
</style>
