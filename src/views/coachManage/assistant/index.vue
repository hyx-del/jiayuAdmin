<!--
  *  @Author:  wei.chen
  *  @Date:  2020-07-18  10:03:47
 * @LastEditors: aa
 * @LastEditTime: 2021-07-09 13:54:19
 * @Descripttion: 助教
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
			新增助教
		</el-button>
		<Table
			:loadData="getList"
			:column="column"
			:showSortIndex="{ show: true, lable: '序号' }"
			ref="TableList"
			refHead="button"
		></Table>

		<!-- 新增/编辑助教模态窗 -->
		<el-dialog
			:title="title"
			center
			:visible.sync="dialogFormVisible"
			v-if="dialogFormVisible"
			@close="resetForm('form')"
			custom-class="role_dialog"
			:close-on-click-modal="false"
		>
			<el-form :model="form" :rules="rules" ref="form" label-position="top">
				<el-form-item label="助教名称：" prop="name">
					<el-input
						v-model.trim="form.name"
						maxlength="20"
						placeholder="请输入"
					></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="resetForm('form')">取 消</el-button>
				<el-button type="primary" @click="submitForm('form')">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import Table from '@/components/Table/index';
import { Message } from 'element-ui';
import { getAssistantList, addAssistant, editAssistant, delAssistant } from '@/api/coach';

export default {
	name: 'assistantTemp',
	components: {
		Table,
	},
	data() {
		return {
			//  表头
			column: [
				{ prop: 'name', label: '助教名称' },
				{
					prop: 'action',
					label: '操作',
					width: '160px',
					actives: [
						{
							name: '编辑',
							method: val => {
								console.log(val);
								this.dialogFormVisible = true;
								this.title = '编辑助教';
								this.form = { ...val };
							},
						},
						// {
						// 	name: '删除',
						// 	method: val => {
						// 		this.$confirm('确定删除?', '提示', {
						// 			type: 'warning',
						// 		}).then(() => {
						// 			delAssistant({ id: val.id }).then(res => {
						// 				if (res.code === 200) {
						// 					this.$message({
						// 						type: 'success',
						// 						message: '删除成功！',
						// 					});
						// 					this.$refs.TableList.reset();
						// 				}
						// 			});
						// 		});
						// 	},
						// },
					],
				},
			],
			form: {
				// 新增/编辑助教模态窗表单数据
				name: '', // 助教名称
			},
			title: '', // 新增/编辑助教模态窗的 title
			// 新增/编辑助教模态窗表单校检
			rules: {
				name: [{ required: true, message: '请输入', trigger: 'blur' }],
			},
			dialogFormVisible: false, //  新增/编辑助教模态窗是否显示
			dialogTableVisible: false,
		};
	},
	computed: {
		getList() {
			return getAssistantList; //  return 数据列表接口
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
			this.dialogFormVisible = true;
			this.title = '新增助教';
			this.form = {
				name: '', // 助教名称
			};
		},
		// 模态窗确认保存事件
		submitForm(formName) {
			console.log(this.form);
			this.$refs[formName].validate(valid => {
				if (valid) {
					if (this.title === '新增助教') {
						const _par = { ...this.form };

						addAssistant(_par).then(res => {
							if (res.code === 200) {
								this.dialogFormVisible = false;
								Message.success('新增助教成功！！！');
								this.$refs.TableList.reset();
							}
						});
					} else {
						const _par = { ...this.form };

						editAssistant(_par).then(res => {
							if (res.code === 200) {
								this.dialogFormVisible = false;
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
	},
};
</script>

<style lang="scss" scoped>
.assistantTemp {
	padding: 20px;
}
</style>
