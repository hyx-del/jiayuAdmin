<!--
 * @Author: tianhao
 * @Date: 2020-06-17 11:55:33
 * @LastEditors: aa
 * @LastEditTime: 2021-06-29 14:10:38
 * @Descripttion: 用户列表
-->
<template>
	<div class="userList">
		<el-form
			:inline="true"
			:model="ruleForm"
			:rules="rulesRules"
			ref="ruleForm"
			class="demo-form-inline"
		>
			<el-form-item label="搜索条件:" prop="nickName">
				<el-input
					placeholder="请输入用户昵称"
					prefix-icon="el-icon-search"
					v-model.trim="ruleForm.nickName"
					size="small"
				></el-input>
			</el-form-item>
			<!-- <el-form-item prop="name">
				<el-input
					placeholder="请输入真实姓名"
					prefix-icon="el-icon-search"
					v-model.trim="ruleForm.name"
					size="small"
				></el-input>
			</el-form-item> -->
			<el-form-item prop="phone">
				<el-input
					placeholder="请输入手机号码"
					prefix-icon="el-icon-search"
					v-model.trim="ruleForm.phone"
					size="small"
				></el-input>
			</el-form-item>
			<!-- <el-form-item prop="id">
				<el-input
					placeholder="请输入用户ID"
					prefix-icon="el-icon-search"
					v-model.trim="ruleForm.userId"
					size="small"
				></el-input>
			</el-form-item> -->
			<el-form-item label="注册时间:">
				<el-date-picker
					@change="onChange"
					v-model.trim="ruleForm.regDate"
					type="daterange"
					size="small"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					:default-time="['00:00:00', '23:59:59']"
					value-format="timestamp"
				></el-date-picker>
			</el-form-item>
			<el-form-item label="注册来源:">
				<el-select size="small" v-model.trim="ruleForm.source" placeholder="请选择">
					<el-option
						v-for="item in registeredSourceOptions"
						:key="item.val"
						:label="item.lab"
						:value="item.val"
					></el-option>
				</el-select>
			</el-form-item>

			<!-- <el-form-item label="注册来源:" prop="banOperate">
				<el-checkbox-group v-model="ruleForm.banOperate">
					<el-checkbox label="1">禁止下单</el-checkbox>
					<el-checkbox label="1">禁止下单</el-checkbox>
					<el-checkbox label="1">禁止下单</el-checkbox>
					<el-checkbox label="2">禁止提现</el-checkbox>
				</el-checkbox-group>
			</el-form-item> -->
			<!-- <el-form-item label="状态:" prop="enable">
				<el-select v-model.trim="ruleForm.enable" placeholder="请选择" size="small">
					<el-option
						v-for="item in states"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					></el-option>
				</el-select>
			</el-form-item> -->
			<el-form-item>
				<el-button type="primary" size="small" @click="onClickSearch">查询</el-button>
				<el-button type="primary" size="small" @click="resetForm('ruleForm')">
					重置
				</el-button>
			</el-form-item>
		</el-form>
		<Table refHead="ruleForm" :loadData="getList" :column="column" ref="userList" :showSortIndex="{ show: true, lable: '序号' }">
			<template v-slot:enable="{ scope }">
				<el-switch
					v-model.trim="scope.enable"
					active-color="#13ce66"
					inactive-color="#ff4949"
					:active-value="true"
					:inactive-value="false"
					@change="ban(scope.id)"
				></el-switch>
			</template>
		</Table>
		<!-- 新增/编辑 -->
		<el-dialog
			@close="handleClose"
			title="修改状态"
			:visible.sync="dialogVisible"
			width="600px"
			custom-class="dialog_content"
			:close-on-click-modal="false"
		>
			<el-form
				:model="userItemForm"
				ref="userItemForm"
				label-width="100px"
				class="demo-ruleForm"
			>
				<el-form-item label="用户状态" prop="banOperate">
					<el-checkbox-group v-model="userItemForm.banOperate">
						<el-checkbox label="1">禁止下单</el-checkbox>
						<el-checkbox label="2">禁止提现</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleClose">取 消</el-button>
				<el-button type="primary" @click="handleOKUpdateState('userItemForm')">
					确 定
				</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import Table from '@/components/Table/index';
import { platform, registeredSource } from '@/utils/systemEnum';
import { parseTime } from '@/utils';
import { getUserList } from '@/api/user';
import { Message } from 'element-ui';
import { startEndTime } from '@/core/directives/time';
export default {
	components: {
		Table,
	},
	data() {
		const checkNum = (rule, value, callback) => {
			// debugger;
			if (value) {
				if (!/(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)|([0])/.test(value)) {
					return callback(new Error('请输入大于等于零且最多两位小数的数值'));
				} else {
					return callback();
				}
			} else {
				callback();
			}
		};
		return {
			registeredSourceOptions: [],
			dialogVisible: false,
			userItemForm: { banOperate: [] },
			ruleForm: {
				// enable: null, // 用户状态
				userId: null,
				endTime: null, // 注册线束时间
				startTime: null, // 注册开始时间
				phone: null, // 用户手机号
				name: null, // 用户真实姓名
				nickName: null, // 用户昵称
				grade: null, // 用户等级
				balanceStart: null,
				balanceEnd: null,
				regDate: [],
				banOperate: [],
			},
			rulesRules: {
				// balanceStart: {
				// 	validator: checkNum,
				// },
				// balanceEnd: {
				// 	validator: checkNum,
				// },
			},
			options: [
				{ value: null, label: '全部' },
				{ value: 'NORMAL', label: '注册用户' },
				{ value: 'ONE', label: '一级经销商' },
				{ value: 'TWO', label: '二级经销商' },
			],
			states: [
				{ value: true, label: '正常' },
				{ value: false, label: '禁用' },
				{ value: '', label: '全部' },
			],
			column: [
				{ prop: 'userId', label: '用户ID' },

				{ prop: 'nickname', label: '昵称' },
				{
					prop: 'sex',
					label: '性别',
					formatter: (row, column) => (row.sex > 1 ? '女' : '男'),
				},
				// { prop: 'inviteCode', label: '专享邀请ID' },
				// {
				// 	prop: 'name',
				// 	label: '真实姓名',
				// 	formatter: row => {
				// 		return row.name || '-';
				// 	},
				// },
				{ prop: 'phone', label: '手机号' },

				{
					prop: 'source',
					label: '注册渠道',
					formatter: row => {
						let _str = '';
						for (const key in registeredSource) {
							if (key == row.source) {
								_str = registeredSource[key];
							}
						}
						return _str;
					},
				},
				{
					prop: 'createTime',
					label: '注册时间',
					formatter: (row, column) => {
						return parseTime(row.createTime);
					},
				},
				{
					prop: 'loginTime',
					label: '最近一次登录时间',
					formatter: (row, column) => {
						return parseTime(row.loginTime);
					},
				},

				{
					prop: 'actives',
					label: '操作',
					actives: [
						{
							name: '详情',
							method: val => {
								this.$router.push({
									path: 'userDetail',
									query: { userId: val.userId },
								});
							},
						},
					],
				},
			],
		};
	},
	created() {
		const _regi = [];
		for (const key in registeredSource) {
			_regi.push({ lab: registeredSource[key], val: key });
		}
		this.registeredSourceOptions = [..._regi];
	},
	computed: {
		getList() {
			return getUserList;
		},
	},
	methods: {
		handleOKUpdateState() {
			let _tempVal;
			if (this.userItemForm.banOperate.length > 1) {
				// 这里按照后台需求 是需要对传递过去的参数 做大小的排序，因为是固定的两个参数，这里就写死 为 '12',不能传递  '21'
				_tempVal = '12';
			} else {
				_tempVal = this.userItemForm.banOperate[0] || '';
			}
			// console.log(this.userItemForm);
			banOperate({ userId: this.userItemForm.id, value: _tempVal }).then(res => {
				if (res.success) {
					Message.success('操作成功！');
					this.dialogVisible = false;
					this.userItemForm = { banOperate: [] };
					this.$refs.userList.update({ ...this.ruleForm });
				}
			});
		},
		handleClose() {
			this.userItemForm = { banOperate: [] };
			this.dialogVisible = false;
		},
		onChange(value) {
			if (value) {
				this.ruleForm.startTime = value[0];
				this.ruleForm.endTime = value[1];
			} else {
				this.ruleForm.startTime = null;
				this.ruleForm.endTime = null;
			}
		},
		onClickSearch() {
			// delete this.ruleForm.regDate
			// if (this.ruleForm.balanceStart && this.ruleForm.balanceEnd) {
			// }
			// debugger;
			this.$refs.ruleForm.validate(valid => {
				if (valid) {
					let newFormData = { ...this.ruleForm };
					if (newFormData.regDate && newFormData.regDate.length > 1) {
						newFormData.starTime = newFormData.regDate[0];
						newFormData.endTime = newFormData.regDate[1];
					}
					delete newFormData.regDate;
					this.$refs.userList.update({ ...newFormData });
				} else {
				}
			});
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();

			this.ruleForm = {
				// enable: null, // 用户状态
				userId: null,
				endTime: null, // 注册线束时间
				startTime: null, // 注册开始时间
				phone: null, // 用户手机号
				name: null, // 用户真实姓名
				nickName: null, // 用户昵称
				grade: null, // 用户等级
				balanceStart: null,
				balanceEnd: null,
				regDate: [],
				banOperate: [],
			};
			// this.$refs.userList.reset()
			// this.$refs[formName].resetFields();
		},
		// 禁用状态切换
		ban(id) {
			banState({ userId: id }).then(res => {
				if (res.success) {
					Message.success('操作成功！');
				}
			});
		},
	},
};
</script>

<style>
.userList {
	padding: 20px;
}
</style>
