<!--
  *  @Author:  wei.chen
  *  @Date:  2020-07-18  10:03:47
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-11-10 16:27:43
 * @Descripttion: 物流
-->
<template>
	<div class="assistantTemp">
		<!-- 表格 -->
		<el-button ref="button" type="primary" icon="el-icon-plus" @click="addAssistant" size="small">
			添加物流公司
		</el-button>
		<Table
			:loadData="getList"
			:column="column"
			ref="TableList"
            refHead="button"
	        :showSortIndex="{ show: true, lable: '序号' }"
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
				<el-form-item label="物流公司名称：" prop="company">
					<el-input
						v-model.trim="form.company"
						maxlength="10"
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
import { parseTime } from '@/utils';
import { getLogisticsList, addLogistics, editLogistics, delLogistics } from '@/api/mall';

export default {
	name: 'assistantTemp',
	components: {
		Table,
	},
	data() {
		return {
			//  表头
			column: [
				{ prop: 'company', label: '物流公司名称' },
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
					width: '160px',
					actives: [
						{
							name: '编辑',
							method: val => {
								this.dialogFormVisible = true;
								this.title = '编辑物流公司';
								this.form = { ...val };
							},
						},
						{
							name: '删除',
							method: val => {
								this.$confirm('确定删除?', '提示', {
									type: 'warning',
								}).then(() => {
									delLogistics({ id: val.id }).then(res => {
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
			form: {
				// 新增/编辑助教模态窗表单数据
				company: '', // 物流公司名称
			},
			title: '', // 新增/编辑助教模态窗的 title
			// 新增/编辑助教模态窗表单校检
			rules: {
				company: [{ required: true, message: '请输入', trigger: 'blur' }],
			},
			dialogFormVisible: false, //  新增/编辑助教模态窗是否显示
			dialogTableVisible: false,
		};
	},
	computed: {
		getList() {
			return getLogisticsList; //  return 数据列表接口
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
			this.title = '新增物流公司';
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
								this.form = {}
								Message.success('新增物流公司成功！！！');
								this.$refs.TableList.reset();
							}
						});
					} else {
						const _par = { ...this.form };

						editLogistics(_par).then(res => {
							if (res.code === 200) {
								this.dialogFormVisible = false;
								this.form = {}
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
		resetForm() {
			this.form = {}
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
