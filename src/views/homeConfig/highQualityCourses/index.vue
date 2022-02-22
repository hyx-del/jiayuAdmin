<!--
  *  @Author:  wei.chen
  *  @Date:  2020-07-18  10:03:47
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-12-08 15:36:05
 * @Descripttion: 精品课程
-->
<template>
	<div class="assistantTemp">
		<!-- 表格 -->
		<el-button
			ref="button"
			type="primary"
			icon="el-icon-plus"
			@click="addAssistant"
			size="small"
		>
			添加
		</el-button>
		<Table :loadData="getList" :column="column" refHead="button" ref="TableList" :showSortIndex="{ show: true, lable: '序号' }">
			<template v-slot:firstCoverUrl="{ scope }">
				<el-image
					:src="scope.firstCoverUrl"
					:preview-src-list="[scope.firstCoverUrl]"
					style="width:100px;height:auto"
				/>
			</template>
			<template v-slot:secondCoverUrl="{ scope }">
				<el-image
					:src="scope.secondCoverUrl"
					:preview-src-list="[scope.secondCoverUrl]"
					style="width:100px;height:auto"
				/>
			</template>
			<template v-slot:thirdCoverUrl="{ scope }">
				<el-image
					:src="scope.thirdCoverUrl"
					:preview-src-list="[scope.thirdCoverUrl]"
					style="width:100px;height:auto"
				/>
			</template>
			<template v-slot:enable="{ scope }">
				<el-switch
					v-model.trim="scope.enable"
					active-color="#13ce66"
					inactive-color="#ff4949"
					:active-value="1"
					:inactive-value="0"
					@change="bannedChange(scope, 'enable')"
				></el-switch>
			</template>
		</Table>
	</div>
</template>

<script>
import Table from '@/components/Table/index';
import { Message } from 'element-ui';
import { parseTime } from '@/utils';
import { getCoursesList, changeCourese, delCourses } from '@/api/yogaManage';

export default {
	name: 'assistantTemp',
	components: {
		Table,
	},
	data() {
		return {
			//  表头
			column: [
				{ prop: 'createTime', label: '更新时间' },
				{ prop: 'firstCoverUrl', label: '大图封面图', render: true },
				{ prop: 'firstResourceName', label: '大图关联目标' },
				{ prop: 'secondCoverUrl', label: '小图封面图', render: true },
				{ prop: 'secondResourceName', label: '小图关联目标' },
				{ prop: 'thirdCoverUrl', label: '小图封面图', render: true },
				{ prop: 'thirdResourceName', label: '小图关联目标' },
				{ prop: 'enable', label: '启用/禁用', render: true },
				{
					prop: 'action',
					label: '操作',
					width: '160px',
					actives: [
						{
							name: '编辑',
							method: val => {
								this.$router.push({
									name: 'highQualityCoursesAdd',
									query: { id: val.id },
								});
							},
						},
						{
							name: '删除',
							method: val => {
								this.$confirm('确定删除?', '提示', {
									type: 'warning',
								}).then(() => {
									delCourses(val.id).then(res => {
										if (res.code === 200) {
											this.$message({
												type: 'success',
												message: '删除成功！',
											});
											this.$refs.TableList.reset();
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
	computed: {
		getList() {
			return getCoursesList; //  return 数据列表接口
		},
	},
	mounted() {},
	methods: {
		// 获取要设置的权限 Code

		// 设置权限取消事件
		onClickCancel() {
			this.$refs.tree.setCheckedKeys([]); // 重置树节点勾选状态
		},
		// 新增 Btu 事件
		addAssistant() {
			this.$router.push({name:'highQualityCoursesAdd'});
		},
		// 模态窗确认保存事件
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					if (this.title === '新增物流公司') {
						const _par = { ...this.form };
						addLogistics(_par).then(res => {
							if (res.code === 200) {
								this.dialogFormVisible = false;
								this.$refs[formName].resetFields();
								Message.success('新增物流公司成功！！！');
								this.$refs.TableList.reset();
							}
						});
					} else {
						const _par = { ...this.form };
						editLogistics(_par).then(res => {
							if (res.code === 200) {
								this.dialogFormVisible = false;
								this.$refs[formName].resetFields();
								Message.success('修改成功！！！');
								this.$refs.TableList.reset();
							}
						});
					}
				} else {
					return false;
				}
			});
		},
		// 模态窗取消事件
		resetForm(formName) {
			this.$refs[formName].resetFields();
			this.dialogFormVisible = false;
		},
		bannedChange(item) {
			let data = { id: item.id };
			changeCourese(data).then(res => {
				if (res.data === 0) {
					this.$message.error(res.msg);
				} else {
					this.$message.success(res.msg);
				}
				this.$refs.TableList.reset();
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.assistantTemp {
	padding: 20px;
}
</style>
