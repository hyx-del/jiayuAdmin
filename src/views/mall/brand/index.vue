<!--
  *  @Author:  wei.chen
  *  @Date:  2020-07-18  10:03:47
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-11-10 16:28:11
 * @Descripttion: 品牌
-->
<template>
	<div class="assistantTemp">
		<!-- 表格 -->
		<el-button ref="button" type="primary" icon="el-icon-plus" @click="addAssistant" size="small">
			添加
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
				<el-form-item label="品牌名称：" prop="brandName">
					<el-input
						v-model.trim="form.brandName"
						maxlength="10"
						placeholder="请输入"
					></el-input>
				</el-form-item>
				<el-form-item label="关联商供应" prop="brandSupplier">
					<el-input
						v-model.trim="form.brandSupplier"
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
import { getBrandList, addGoodsBrand, editGoodsBrand, delGoodsBrand } from '@/api/mall';

export default {
	name: 'assistantTemp',
	components: {
		Table,
	},
	data() {
		return {
			//  表头
			column: [
				{ prop: 'brandName', label: '品牌名称' },
				{
					prop: 'createTime',
					label: '创建时间',
					formatter: (row, column) => {
						return parseTime(row.createTime);
					},
				},
				{ prop: 'goodsCount', label: '关联商品数' },
				{ prop: 'brandSupplier', label: '供应商' },
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
								this.title = '编辑品牌';
								this.form = { ...val };
							},
						},
						{
							name: '删除',
							method: val => {
									this.form = { ...val };
								this.$confirm('确定删除'+this.form.brandName+'?', '提示', {
									type: 'warning',
								}).then(() => {
									console.log(val);
									delGoodsBrand({ id: val.id }).then(res => {
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
				brandName: '', // 品牌名称
				brandSupplier: '', //供应商
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
			return getBrandList; //  return 数据列表接口
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
			this.title = '新增品牌';
		},
		// 模态窗确认保存事件
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					if (this.title === '新增品牌') {
						const _par = { ...this.form };

						addGoodsBrand(_par).then(res => {
							if (res.code === 200) {
								this.dialogFormVisible = false;
								Message.success('新增品牌成功！！！');
								this.$refs.TableList.reset();
							}
						});
					} else {
						const _par = { ...this.form };

						editGoodsBrand(_par).then(res => {
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
