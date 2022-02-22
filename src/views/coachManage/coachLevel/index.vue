<!--
  *  @Author:  wei.chen
  *  @Date:  2020-07-18  10:03:47
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-05-24 19:19:46
 * @Descripttion: 教练等级
-->
<template>
	<div class="coachLevelTemp">
		<!-- 表格 -->
		<el-button ref="button" type="primary" icon="el-icon-plus" @click="addCoachLevel" size="small">
			新增教练等级
		</el-button>
		<Table
			:loadData="getList"
			:column="column"
			:showSortIndex="{ show: true, lable: '序号' }"
			ref="TableList"
      refHead="button"
		></Table>

		<!-- 新增/编辑教练等级模态窗 -->
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
				<el-form-item label="教练等级：" prop="levelName">
					<el-input
						v-model.trim="form.levelName"
						maxlength="24"
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
import { getCoachLevelList, addCoachLevel, editCoachLevel, delCoachLevel } from '@/api/coach';

export default {
	name: 'coachLevelTemp',
	components: {
		Table,
	},
	data() {
		return {
			//  表头
			column: [
				{ prop: 'levelName', label: '教练等级名称' },
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
								this.title = '编辑教练等级';
								this.form = { ...val };
							},
						},
						// {
						// 	name: '删除',
						// 	method: val => {
						// 		this.$confirm('确定删除?', '提示', {
						// 			type: 'warning',
						// 		}).then(() => {
						// 			delCoachLevel({ id: val.id }).then(res => {
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
				// 新增/编辑教练等级模态窗表单数据
				name: '', // 教练等级名称
			},
			title: '', // 新增/编辑教练等级模态窗的 title
			// 新增/编辑教练等级模态窗表单校检
			rules: {
				levelName: [{ required: true, message: '请输入', trigger: 'blur' }],
			},
			dialogFormVisible: false, //  新增/编辑教练等级模态窗是否显示
			dialogTableVisible: false,
		};
	},
	computed: {
		getList() {
			return getCoachLevelList; //  return 数据列表接口
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
		addCoachLevel() {
			this.dialogFormVisible = true;
			this.title = '新增教练等级';
			this.form = {
				// 新增/编辑教练等级模态窗表单数据
				content: '', // 教练等级名称
			};
		},
		// 模态窗确认保存事件
		submitForm(formName) {
			console.log(this.form);
			this.$refs[formName].validate(valid => {
				if (valid) {
					if (this.title === '新增教练等级') {
						const _par = { ...this.form };
						_par.name = this.form.levelName;
						addCoachLevel(_par).then(res => {
							if (res.code === 200) {
								this.dialogFormVisible = false;
								Message.success('新增教练等级成功！！！');
								this.$refs.TableList.reset();
							}
						});
					} else {
						const _par = { ...this.form };
						_par.name = this.form.levelName;
						editCoachLevel(_par).then(res => {
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
.coachLevelTemp {
	padding: 20px;
}
</style>
