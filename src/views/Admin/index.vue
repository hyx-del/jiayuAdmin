<!--
 * @Author: wei.chen
 * @Date: 2020-06-12 15:11:11
 * @LastEditTime: 2021-11-10 16:45:40
 * @LastEditors: jiu yin zhen jing
 * @Description: 系统账号管理
-->
<template>
	<div class="commonPage">
		<el-button icon="el-icon-plus" type="primary" @click="addAccountNumber('adminForm')" size="small" ref="button">
			添加账号
		</el-button>
		<Table :loadData="getAdminAccountList" :column="column" ref="adminList" refHead="button" :showSortIndex="{ show: true, lable: '序号'}">
			<template v-slot:avatar="{ scope }">
				<el-image :src="scope.avatar" class="admin_avater" :preview-src-list="[scope.avatar]" />
			</template>
		</Table>
		<!-- 添加模态窗 -->
		<el-dialog
			title="新增人员"
			:visible.sync="addVisible"
			@close="beforeClose('adminForm')"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:destroy-on-close="true"
			width="530px"
			custom-class="dialogStyle"
		>
			<!--      <formList ref="formList" :loading.sync="loading" :config="config" :formObj="formObj" :list="list" @button="formButton"/>-->

			<el-form :model="adminForm" :rules="rules" label-position="right" label-width="100px" class="form_style" ref="adminForm">
				<el-form-item label="员工名称" prop="nickname">
					<el-input v-model.trim="adminForm.nickname" maxlength="10" placeholder="请输入" size="small" sytle="width:100%"></el-input>
				</el-form-item>
				<el-form-item label="角色：" prop="roleIds">
					<el-select v-model="adminForm.roleIds" placeholder="请选择" size="small" sytle="width:100%">
						<el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="登录账号" prop="username" required>
					<el-input v-model.trim="adminForm.username" maxlength="11" placeholder="请输入手机号码" size="small" sytle="width:100%"></el-input>
				</el-form-item>

				<el-form-item label="登录密码" prop="password" required>
					<el-input v-model.trim="adminForm.password" maxlength="16" type="password" placeholder="请输入" size="small" sytle="width:100%"></el-input>
				</el-form-item>

				<el-form-item label="备注" prop="remarks">
					<el-input v-model.trim="adminForm.remarks" maxlength="50" placeholder="备注" type="textarea" size="small" sytle="width:100%"></el-input>
				</el-form-item>

				<!-- <el-form-item label="头像" prop="avatar" required>
							<CropperImg v-model.trim="adminForm.avatar"></CropperImg>
						</el-form-item> -->
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cancelBtu('adminForm')" size="small">取 消</el-button>
				<el-button type="primary" @click="create" size="small">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 编辑模态框 -->
		<el-dialog
			title="编辑人员"
			:visible.sync="editVisible"
			@close="beforeClose('editForm')"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:destroy-on-close="true"
			custom-class="dialogStyle"
		>
			<el-form :model="editForm" :rules="rules" label-width="100px" class="form_style" ref="editForm">
				<el-form-item label="员工名称" prop="nickname">
					<el-input v-model.trim="editForm.nickname" maxlength="20" placeholder="请输入" size="small" sytle="width:100%"></el-input>
				</el-form-item>
				<el-form-item label="角色：" prop="roleIds">
					<el-select v-model="editForm.roleIds" placeholder="请选择" size="small" sytle="width:100%">
						<el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="登录账号" prop="username">
					<el-input v-model.trim="editForm.username" maxlength="11" disabled placeholder="请输入手机号码" size="small" sytle="width:100%"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remarks">
					<el-input v-model.trim="editForm.remarks" maxlength="50" placeholder="备注" type="textarea" size="small" sytle="width:100%"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cancelBtu('editForm')">取 消</el-button>
				<el-button type="primary" @click="edit">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 修改密码 -->
		<el-dialog
			title="修改密码"
			:visible.sync="passWordVisible"
			:before-close="() => (passWordVisible = false)"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:destroy-on-close="true"
			custom-class="dialogStyle"
		>
			<el-form :model="passWordForm" :rules="passwordRules" label-width="100px" class="demo-ruleForm" ref="passWordForm">
				<el-row>
					<el-col :span="10">
						<el-form-item label="修改密码" prop="password">
							<el-input v-model.trim="passWordForm.password" maxlength="18" type="password" size="small"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="确认密码" prop="okpassWord" required>
							<el-input v-model.trim="passWordForm.okpassWord" maxlength="18" type="password" size="small"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="passWordVisible = false">取 消</el-button>
				<el-button type="primary" @click="changePassWord">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import md5 from 'js-md5';
import Table from '@/components/Table';
import CropperImg from '@/components/cropperImg/index';

import { getAdminAccountList, createOperator, delOperator, banOperator, editOperator, changePassword, getRoleList, accountChange } from '@/api/admin';
import { Message } from 'element-ui';
import { isPhone } from '@/utils/validate';
import { parseTime } from '@/utils';
import formList from '@/components/FormList';
export default {
	components: {
		Table,
		CropperImg,
		formList,
	},
	data() {
		return {
			loading: false,
			config: {},
			formObj: {},
			list: [
				{
					label: '员工名称',
					code: 'nickname',
				},
				{
					el: 'select',
					label: '角色',
					code: 'roleIds',
					back: true,
					labelCode: 'roleName',
					valueCode: 'id',
					fun: getRoleList,
				},
				{
					label: '登录账号',
					code: 'username',
				},
				{
					label: '登录密码',
					code: 'password',
				},
				{
					el: 'textArea',
					label: '备注',
					code: 'remarks',
					required: false,
				},
				// {
				//   label:'头像',
				//   code:'avatar',
				// },
			],
			column: [
				{
					prop: 'nickname',
					label: '员工名称',
				},
				{
					prop: 'username',
					label: '登录账号',
				},
				{
					prop: 'roleNames',
					label: '角色',
				},
				{
					prop: 'remarks',
					label: '备注',
				},
				{
					prop: 'createTime',
					label: '添加时间',
				},
				{
					prop: 'enabled',
					label: '状态',
					switch: true,
					fun: accountChange,
				},
				{
					prop: 'actives',
					label: '操作',
					actives: [
						{
							name: '编辑',
							method: val => {
								this.editForm = { ...val, roleIds: val.roleIds };
								this.editForm.password = '';
								this.editVisible = true;
							},
						},
						{
							// name: row => {
							// 	return row.state == '1' ? '禁用' : '启用';
							// },
							// method: val => {
							// 	let banned = val.state == '1' ? '禁用' : '启用';
							// 	this.$confirm(`确定${banned}账号?`, '提示', {
							// 		type: 'warning',
							// 	}).then(() => {
							// 		console.log(val);
							// 		const _par = {
							// 			id: val.id,
							// 			state: val.state == '1' ? 0 : 1,
							// 		};
							// 		banOperator(_par).then(res => {
							// 			if (res.code === 200) {
							// 				this.$message({
							// 					type: 'success',
							// 					message: '操作成功！',
							// 				});
							// 				this.reset();
							// 			}
							// 		});
							// 	});
							// },
						},
						{
							name: '修改密码',
							method: val => {
								this.passWordForm = {
									id: '',
									password: '',
									okpassWord: '',
								};
								this.passWordVisible = true;
								this.passWordForm.id = val.id;
							},
						},
					],
				},
			],
			roleList: [],
			searchParams: { nickname: '', username: '' },
			addVisible: false,
			editVisible: false,
			passWordVisible: false,
			adminForm: {
				nickname: '',
				username: '',
				roleIds: '',
				password: '',
				remarks: '',
			},
			editForm: {
				nickname: '',
				username: '',
				roleIds: '',
				password: '',
				remarks: '',
			},
			passWordForm: {
				id: '',
				passWord: '',
				okpassWord: '',
			},
			rules: {
				nickname: {
					type: 'string',
					required: true,
					message: '名称不能为空',
				},
				roleIds: {
					required: true,
					message: '角色不能为空',
				},
				username: {
					type: 'string',
					required: true,
					validator: (rule, value, callback) => {
						if (isPhone(value)) {
							callback();
						} else {
							callback(new Error('请输入正确的手机号'));
						}
					},
				},

				password: {
					type: 'string',
					required: true,
					message: '密码不能为空',
				},
			},
			passwordRules: {
				passWord: {
					type: 'string',
					required: true,
					message: '密码不能为空',
				},
				okpassWord: {
					type: 'string',
					required: true,
					message: '密码不能为空',
				},
			},
		};
	},
	computed: {
		getAdminAccountList() {
			return getAdminAccountList;
		},
	},
	mounted() {
		// 获取角色列表数据
		getRoleList({ size: 100 }).then(res => {
			if (res.code === 200) {
				this.roleList = res.data.records;
			}
		});
	},
	methods: {
		formButton(val) {},
		reset() {
			this.$refs.adminList.reset();
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
			this.$refs.adminList.reset();
		},
		// 搜索查询
		onSubmit() {
			this.$refs.adminList.update({ ...this.searchParams });
		},
		//创建
		create() {
			this.$refs.adminForm.validate(valid => {
				if (valid) {
					const _par = {
						nickname: this.adminForm.nickname,
						username: this.adminForm.username,
						password: md5(this.adminForm.password),
						roleIds: [this.adminForm.roleIds],
						remarks: this.adminForm.remarks,
					};
					createOperator(_par).then(res => {
						if (res.code === 200) {
							Message.success('创建成功！！');
							this.addVisible = false;
							this.reset();
						}
					});
				}
			});
		},
		//编辑
		edit() {
			this.$refs.editForm.validate(valid => {
				if (valid) {
					const _par = { ...this.editForm };

					_par.roleIds = [_par.roleIds];
					editOperator(_par).then(res => {
						if (res.code === 200) {
							Message.success('修改成功！！');
							this.editVisible = false;
							this.reset();
						}
					});
				}
			});
		},
		// 修改密码
		changePassWord() {
			this.$refs.passWordForm.validate(valid => {
				const _par = { ...this.passWordForm };

				if (_par.password !== _par.okpassWord) {
					return Message.error('两次密码输入不一致 请重新输入');
				}
				delete _par.okpassWord;
				_par.password = md5(_par.password);
				if (valid) {
					changePassword(_par).then(res => {
						if (res.code === 200) {
							Message.success('修改成功！！');
							this.passWordVisible = false;
							this.reset();
						}
					});
				}
			});
		},
		// 添加账号Dialog取消
		cancelBtu(formName) {
			this.$refs[formName].resetFields();
			this.addVisible = false;
			this.editVisible = false;
		},
		// 添加账号按钮
		addAccountNumber(formName) {
			this.addVisible = true;
		},
		// 关闭默态窗前的回调函数
		beforeClose(formName) {
			this.$refs[formName].resetFields();
			this.addVisible = false;
			this.editVisible = false;
		},
	},
};
</script>

<style lang="scss" scoped>
@import url('~@/styles/common.scss');
.admin_avater {
	height: 40px;
	width: 40px;
}
.form_style {
	.el-form-item {
		.el-input,
		.el-select {
			width: 100%;
		}
	}
}
</style>
