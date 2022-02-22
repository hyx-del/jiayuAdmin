<!--
  *  @Author:  wei.chen
  *  @Date:  2020-07-18  10:03:47
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-06-26 17:13:50
 * @Descripttion: 品牌
-->
<template>
	<div class="assistantTemp">
		<!-- 表格 -->
		<el-button type="primary" icon="el-icon-plus" @click="addAssistant" size="small">
			添加
		</el-button>
		<Table :loadData="getList" :column="column" :params="params" ref="TableList">
			<template v-slot:isShow="{ scope }">
				<el-switch
					v-model.trim="scope.isShow"
					active-color="#13ce66"
					inactive-color="#ff4949"
					:active-value="false"
					:inactive-value="true"
					@change="bannedChange(scope)"
				></el-switch>
			</template>
		</Table>

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
				<el-form-item label="属性名称：" prop="attrName">
					<el-input
						v-model.trim="form.attrName"
						maxlength="10"
						placeholder="请输入"
					></el-input>
				</el-form-item>
				<div>上级目录：{{ this.$route.query.name }}</div>
				<el-form-item label="属性列表">
					<div style="display: flex" v-for="(item, index) of attrVales" :key="index">
						<el-input
							v-model.trim="item.attrValue"
							maxlength="10"
							placeholder="请输入"
						></el-input>
						<el-button @click="del(index)">删除</el-button>
					</div>
				</el-form-item>
				<el-button type="primary" @click="add()">新增</el-button>
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
import { goodsAttrList, addgoodsAttr, editgoodsAttr, delgoodsAttr } from '@/api/cat';

export default {
	name: 'assistantTemp',
	components: {
		Table,
	},
	data() {
		return {
			//  表头
			column: [
				{ prop: 'attrName', label: '属性名称' },
				{ prop: 'attrVales', label: '可选值列表' },
				{
					prop: 'action',
					label: '操作',
					width: '160px',
					actives: [
						{
							name: '编辑',
							method: val => {
								this.dialogFormVisible = true;
								this.title = '编辑品牌';
								this.attrVales = val.attrVales.split(',').map(item => {
									return { attrValue: item };
								});
								this.form = { ...val };
							},
						},
						{
							name: '删除',
							method: val => {
								this.$confirm('确定删除?', '提示', {
									type: 'warning',
								}).then(() => {
									delgoodsAttr({ id: val.id }).then(res => {
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
				attrName: '', // 属性名称
				attrVales: [], //属性列表
				categoryId: this.$route.query.id,
			},
			title: '', // 新增/编辑助教模态窗的 title
			// 新增/编辑助教模态窗表单校检
			rules: {
				attrName: [{ required: true, message: '请输入', trigger: 'blur' }],
			},
			dialogFormVisible: false, //  新增/编辑助教模态窗是否显示
			dialogTableVisible: false,
			params: {
				categoryId: this.$route.query.id,
			},
			attrVales: [{ attrValue: '' }],
		};
	},
	computed: {
		getList() {
			return goodsAttrList; //  return 数据列表接口
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
			this.title = '新增类型';
			this.form = {
				attrName: '', // 属性名称
				attrVales: [], //属性列表
				categoryId: this.$route.query.id,
			};
			this.attrVales = [{ attrValue: '' }];
		},
		// 模态窗确认保存事件
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.form.attrVales = this.attrVales;
					const _attrVales = this.attrVales.length;
					// 使用set 的特性去重
					const _tempSet = new Set();
					this.attrVales.forEach(item => {
						_tempSet.add(item.attrValue);
					});
					if (_tempSet.size !== _attrVales) {
						Message.error('属性值不能有重复');
						return false;
					}

					const _par = { ...this.form };
					if (this.title === '新增类型') {
						addgoodsAttr(_par).then(res => {
							if (res.code === 200) {
								this.dialogFormVisible = false;
								Message.success('新增类型成功！！！');
								this.$refs.TableList.reset();
							}
						});
					} else {
						editgoodsAttr(_par).then(res => {
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
		// 编辑导航栏是否显示
		bannedChange(val) {
			isShow({ id: val.id, isShow: !val.isShow });
		},
		// 新增属性列表
		add() {
			this.attrVales.push({ attrValue: '' });
		},
		// 删除属性列表
		del(index) {
			if (this.attrVales.length == 1) return;
			this.attrVales.splice(index, 1);
		},
	},
};
</script>

<style lang="scss" scoped>
.assistantTemp {
	padding: 20px;
}
</style>
