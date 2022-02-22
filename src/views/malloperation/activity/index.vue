<!--
 * @Author: wei.chen
 * @Date: 2020-08-13 16:28:12
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-11-10 16:29:36
 * @Descripttion:
-->
<!---->
<template>
	<div class="versionManage">
		<!-- 搜索查询 -->
		<el-form :inline="true" :model="searchfrom" ref="searchfrom" class="demo-form-inline">
			<el-form-item prop="name" label="活动标题:">
				<el-input
					v-model.trim="searchfrom.title"
					size="small"
					placeholder="请输入"
					prefix-icon="el-icon-search"
				></el-input>
			</el-form-item>
			<el-form-item label="活动状态：" prop="state">
				<el-select size="small" v-model="searchfrom.status" placeholder="选择活动状态">
					<el-option label="未开始" value="0"></el-option>
					<el-option label="进行中" value="1"></el-option>
					<el-option label="已结束" value="2"></el-option>
					<el-option label="已终止" value="-1"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="状态：" prop="state">
				<el-select size="small" v-model="searchfrom.enabled" placeholder="选择状态">
					<el-option label="禁用" value="0"></el-option>
					<el-option label="启用" value="1"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="onClickSearch('searchfrom')">
					查询
				</el-button>
				<el-button type="primary" size="small" @click="resetForm('searchfrom')">
					重置
				</el-button>
			</el-form-item>
			<!-- 表格 -->
			<el-form-item>
				<el-button type="primary" icon="el-icon-plus" @click="addVers" size="small">
					添加活动
				</el-button>
			</el-form-item>
		</el-form>
		<Table :loadData="getList" :column="column" ref="TableList" refHead="searchfrom" :showSortIndex="{ show: true, lable: '序号' }">
			<template v-slot:enabled="{ scope }">
				<!-- <el-switch
					v-model="!scope.enabled"
					active-color="#13ce66"
					inactive-color="#ff4949"
					:active-value="false"
					:inactive-value="true"
					:disabled="scope.rushEndTime < new Date().getTime() ? true : false"
					@change="enabledChange(scope)"
				></el-switch> -->
				{{ scope.enabled && state(scope) !== '已结束' ? '启用' : '禁用' }}
			</template>
			<template v-slot:state="{ scope }">
				{{ scope.state === 1 ? state(scope) : '终止' }}
			</template>
		</Table>
	</div>
</template>
<script>
import Table from '@/components/Table/index';
import { Message } from 'element-ui';
import { getActivityList, enabled, delActivity, terminateActivity } from '@/api/malloperation';
import { parseTime } from '@/utils';
export default {
	components: {
		Table,
	},
	data() {
		return {
			// 搜索查询数据
			searchfrom: {
				title: null, // 活动商品关联标题
				status: null, // 活动状态
				enabled: null, //  状态
			},
			// 表头
			column: [
				{
					prop: 'startTime',
					label: '活动开始时间',
					formatter: (row, column) => {
						return parseTime(row.startTime);
					},
				},
				{
					prop: 'endTime',
					label: '活动结束时间',
					formatter: (row, column) => {
						return parseTime(row.endTime);
					},
				},
				{
					prop: 'title',
					label: '活动标题',
				},
				{
					prop: 'remarks',
					label: '活动描述',
				},
				{
					prop: 'partInGoodsNumber',
					label: '参加活动商品数',
				},
				{
					prop: 'partInNumber',
					label: '抢购人数',
				},
				{ prop: 'enabled', label: '启用/禁用', render: true },
				{
					prop: 'state',
					label: '活动状态',
					render: true,
				},
				{
					prop: 'createTime',
					label: '创建时间',
					formatter: (row, column) => {
						return parseTime(row.createTime);
					},
				},
				{
					prop: 'action',
					label: '操作',
					actives: [
						{
							name: val => {
								if (val.enabled || this.state(val) == '已结束') {
									return '禁用';
								} else {
									return '启用';
								}
							},
							method: val => {
								let data = {
									id: val.id,
									enabled: val.enabled ? false : true,
								};
								enabled(data).then(res => {
									if (res.code === 200) {
										this.$message.success('操作成功');
										this.$refs.TableList.reset();
									} else {
										this.$message.error(res.msg);
									}
								});
							},
						},
						{
							name: val => {
								if (new Date().getTime() < val.startTime) {
									return '编辑';
								} else {
									return false;
								}
							},
							method: val => {
								this.$router.push({
									path:  '/mall/malloperation/add',
									query: { id: val.id },
								});
							},
						},
						{
							name: val => {
								if (new Date().getTime() < val.startTime) {
									return '删除';
								} else {
									return false;
								}
							},
							method: val => {
								this.$confirm('此操作将永久删除, 是否继续?', '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning',
								}).then(() => {
									delActivity({ id: val.id }).then(res => {
										if (res.code === 200) {
											this.$message.success('操作成功');
											this.$refs.TableList.reset();
										} else {
											this.$message.error(res.msg);
										}
									});
								});
							},
						},
						{
							name: val => {
								if (
									val.startTime < new Date().getTime() &&
									new Date().getTime() < val.endTime &&
									val.state === 1
								) {
									return '终止活动';
								} else {
									return false;
								}
							},
							method: val => {
								this.$confirm('是否终止活动?', '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning',
								}).then(() => {
									terminateActivity({ id: val.id }).then(res => {
										if (res.code === 200) {
											this.$message.success('操作成功');
											this.$refs.TableList.reset();
										} else {
											this.$message.error(res.msg);
										}
									});
								});
							},
						},
						{
							name: val => {
								if (!new Date().getTime() < val.startTime) {
									return '活动明细';
								} else {
									return false;
								}
							},
							method: val => {
								this.$router.push({
									path:'/mall/malloperation/activityDetail',
									query: { id: val.id },
								});
							},
						},
					],
				},
			],
		};
	},
	computed: {
		getList() {
			return getActivityList;
		},
	},
	methods: {
		// 搜索查询
		onClickSearch() {
			this.$refs.TableList.update({ ...this.searchfrom });
		},
		// 添加活动
		addVers() {
			this.$router.push({
        path: '/mall/malloperation/add',
      });
		},
		// 禁用状态切换
		// enabledChange(item) {
		// 	enabled({ id: item.id, enabled: item.enabled? false: true })
		// 		.then(res => {
		// 			if (res.code == 200) {
		// 				Message.success('操作成功！');
		// 				this.getList()
		// 			}
		// 		})
		// },
		// 模态窗取消事件
		resetForm(formName) {
			this.searchfrom = {};
			this.$refs.TableList.update({ ...this.searchfrom });
		},
		// 计算状态
		state(data) {
			let date = new Date().getTime();
			if (date < data.startTime) return '未开始';
			if (data.endTime > date && date > data.startTime) return '进行中';
			if (date > data.endTime) return '已结束';
		},
	},
};
</script>
<style lang="scss" scoped>
.versionManage {
	padding: 20px;
	.item {
		width: 45%;
		margin-right: 20px;
		.el-select,
		.el-cascader {
			width: 100%;
		}
	}
	.width_item {
		width: 93%;
		.el-form-item__content {
			width: 100%;
		}
	}
}
</style>
