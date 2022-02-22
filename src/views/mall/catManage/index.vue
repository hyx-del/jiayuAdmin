<!--
  *  @Author:  wei.chen
  *  @Date:  2020-07-18  10:03:47
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-11-10 16:26:58
 * @Descripttion: 品牌
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
		<Table :loadData="getList" :column="column" ref="TableList" refHead="button" :showSortIndex="{ show: true, lable: '序号' }">
			<template v-slot:isShow="{ scope }">
				<!-- <el-switch
                    v-model.trim="scope.isShow"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-value="false"
                    :inactive-value="true"
                    @change="bannedChange(scope)"
                ></el-switch> -->
				{{ scope.isShow ? '显示' : '隐藏' }}
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
				<el-form-item label="类目名称：" prop="categoryName">
					<el-input
						v-model.trim="form.categoryName"
						maxlength="10"
						placeholder="请输入"
					></el-input>
				</el-form-item>
				<el-form-item label="顺序：" prop="seq">
					<el-input
						type="number"
						v-model.trim="form.seq"
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
import { getCategoryList, addCategory, editCategory, delCategory, isShow } from '@/api/cat';

export default {
	name: 'assistantTemp',
	components: {
		Table,
	},
	data() {
		return {
			//  表头
			column: [
				{ prop: 'categoryName', label: '一级类目' },
				{ prop: 'seq', label: '显示顺序' },
				{ prop: 'goodsCount', label: '关联商品数' },
				{
					label: '属性配置',
					actives: [
						{
							name: '查看详情',
							method: val => {
								this.$router.push({
									path: '/mall/operation/catManage/attribute',
									query: { id: val.id, name: val.categoryName },
								});
							},
						},
					],
				},
				{ prop: 'isShow', label: '导航栏显示', render: true },
				{
					prop: 'action',
					label: '操作',
					width: '160px',
					actives: [
						{
							name: val => {
								if (val.isShow) {
									return '隐藏';
								} else {
									return '显示';
								}
							},
							method: val => {
								let data = {
									id: val.id,
									isShow: val.isShow ? false : true,
								};
								isShow(data).then(res => {
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
							name: '编辑',
							method: val => {
								console.log(val);
								this.dialogFormVisible = true;
								this.title = '编辑品牌';
								this.form = { ...val };
							},
						},
						{
							name: '删除',
							method: val => {
								this.$confirm('确定删除?', '提示', {
									type: 'warning',
								}).then(() => {
									console.log(val);
									delCategory({ id: val.id }).then(res => {
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
				categoryName: '', // 类目名称
				seq: '', //类目序号
			},
			title: '', // 新增/编辑助教模态窗的 title
			// 新增/编辑助教模态窗表单校检
			rules: {
				brandName: [{ required: true, message: '请输入', trigger: 'blur' }],
				brandSupplier: [{ required: true, message: '请输入', trigger: 'blur' }],
			},
			dialogFormVisible: false, //  新增/编辑助教模态窗是否显示
			dialogTableVisible: false,
		};
	},
	computed: {
		getList() {
			return getCategoryList; //  return 数据列表接口
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
				name: '', // 助教名称
			};
		},
		// 模态窗确认保存事件
		submitForm(formName) {
			console.log(this.form);
			this.$refs[formName].validate(valid => {
				if (valid) {
					if (this.title === '新增类型') {
						const _par = { ...this.form };

						addCategory(_par).then(res => {
							if (res.code === 200) {
								this.dialogFormVisible = false;
								Message.success('新增类型成功！！！');
								this.$refs.TableList.reset();
							}
						});
					} else {
						const _par = { ...this.form };

						editCategory(_par).then(res => {
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
		// bannedChange(val) {
		//     // isShow({id: val.id, isShow: !val.isShow}).then(res=>{
		// 	// 	this.$message
		// 	// })
		// 	let _state = null;
		// 	if (val.isShow == 1) {
		// 		_state = 0;
		// 	} else {
		// 		_state = 1;
		// 	}
		// 	isShow({ enable: _state, id: val.id }).then(res => {
		// 		if (res.code === 200) {
		// 			Message.success('操作成功！');
		// 			this.getList();
		// 		}
		// 	});
		// }
	},
};
</script>

<style lang="scss" scoped>
.assistantTemp {
	padding: 20px;
}
</style>
