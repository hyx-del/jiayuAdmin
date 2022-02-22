<!--
  *  @Author:  wei.chen
  *  @Date:  2020-07-18  10:03:47
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-05-17 14:42:54
 * @Descripttion:
-->
<template>
	<div class="welcomingSpeech">
		<!-- 搜索 -->
		<!-- <el-form :inline="true" :model="searchfrom" ref="searchForm" class="demo-form-inline">
			<el-form-item prop="name" label="欢迎词名称：">
				<el-input
					v-model.trim="searchfrom.name"
					size="small"
					placeholder="请输入欢迎词名称"
					prefix-icon="el-icon-search"
				></el-input>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="onClickSearch" size="small">查询</el-button>
			</el-form-item>
		</el-form> -->

		<!-- 表格 -->
		<el-button ref="button" type="primary" icon="el-icon-plus" @click="addWelcome" size="small">
			新增欢迎词
		</el-button>
		<Table
			:loadData="getList"
			:column="column"
      refHead="button"
			:showSortIndex="{ show: true, lable: '序号' }"
			ref="TableList"
		></Table>

		<!-- 新增/编辑欢迎词模态窗 -->
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
				<el-form-item label="欢迎词：" prop="content">
					<el-input
						v-model.trim="form.content"
						maxlength="24"
						placeholder="请输入名称"
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
import { parseTime } from '@/utils';
import { Message } from 'element-ui';
import { getWelcomeList, addWelcome, editWelcome, delWelcome } from '@/api/admin';

export default {
	name: 'welcomingSpeech',
	components: {
		Table,
	},
	data() {
		return {
			props: {
				label: 'name',
				children: 'children',
				// isLeaf: 'leaf',
			},

			//  表头
			column: [
				{ prop: 'content', label: '欢迎词名称' },
				// { prop: 'remark', label: '备注' },
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
								this.title = '编辑欢迎词';
								this.form = { ...val };
							},
						},
						{
							name: '删除',
							method: val => {
								this.$confirm('确定删除?', '提示', {
									type: 'warning',
								}).then(() => {
									delWelcome({ id: val.id }).then(res => {
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
				// 新增/编辑欢迎词模态窗表单数据
				content: '', // 欢迎词名称
			},
			title: '', // 新增/编辑欢迎词模态窗的 title
			// 新增/编辑欢迎词模态窗表单校检
			rules: {
				content: [{ required: true, message: '请输入名称', trigger: 'blur' }],
				// operatorIdSet: [{ required: true, message: '请选择人员', trigger: 'blur' }],
				remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
			},
			dialogFormVisible: false, //  新增/编辑欢迎词模态窗是否显示

			dialogTableVisible: false,
			userData: [], // 查看人员列表数据
			welcomingSpeechVisible: false,
			welcomingSpeechList: [], // 权限列表
			params: {
				id: null, // 欢迎词id
				codeSet: [], //  权限code
			},
			checkedKeys: [], // 已有的权限ID
			expandedKeys: [],
		};
	},
	computed: {
		getList() {
			return getWelcomeList; //  return 数据列表接口
		},
	},
	mounted() {},
	methods: {
		// 获取要设置的权限 Code
		handleCheckChange(data, checked) {
			let _codeSet = [...checked.checkedKeys, ...checked.halfCheckedKeys];

			let n = {}; //存放新的数据
			// 设置去重
			for (let i = 0; i < _codeSet.length; i++) {
				let v = _codeSet[i];
				n[v] = 1;
			}
			_codeSet = [];
			for (let i in n) {
				_codeSet[_codeSet.length] = i;
			}
			//  ;
			this.params.codeSet = _codeSet;
		},
		// 设置权限确定事件
		onClickwelcomingSpeech() {
			addRolewelcomingSpeech({ ...this.params }).then(res => {
				if (res.code === 200) {
					Message.success('操作成功！！！');
					this.welcomingSpeechVisible = false;
					this.welcomingSpeechList = [];
					this.$refs.tree.setCheckedKeys([]); // 重置树节点勾选状态
					this.$refs.TableList.reset();
				}
			});
		},
		// 设置权限取消事件
		onClickCancel() {
			this.welcomingSpeechVisible = false;
			this.welcomingSpeechList = [];
			this.$refs.tree.setCheckedKeys([]); // 重置树节点勾选状态
		},
		// 搜索事件
		onClickSearch() {
			this.$refs.TableList.update({ ...this.searchfrom });
		},
		// 新增 Btu 事件
		addWelcome() {
			this.dialogFormVisible = true;
			this.title = '新增欢迎词';
			this.form = {
				// 新增/编辑欢迎词模态窗表单数据
				content: '', // 欢迎词名称

				remark: '', // 备注
			};
		},
		// 模态窗确认保存事件
		submitForm(formName) {
			console.log(this.form);
			this.$refs[formName].validate(valid => {
				if (valid) {
					if (this.title === '新增欢迎词') {
						const _par = { ...this.form };

						addWelcome(_par).then(res => {
							if (res.code === 200) {
								this.dialogFormVisible = false;
								Message.success('新增欢迎词成功！！！');
								this.$refs.TableList.reset();
							}
						});
					} else {
						const _par = { ...this.form };

						editWelcome(_par).then(res => {
							if (res.code === 200) {
								this.dialogFormVisible = false;
								Message.success('修改成功！！！');
								this.$refs.TableList.reset();
							}
						});
					}
				} else {
					console.log('error submit!!');
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
.welcomingSpeech {
	padding: 20px;
}
</style>
