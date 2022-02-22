<!--
 * @Author: wei.chen
 * @Date: 2020-07-17 12:06:23
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-02-18 11:49:03
 * @Descripttion: 
-->
<template>
	<div class="distributorExamine">
		<!-- 查询搜索 -->
		<el-form :inline="true" :model="searchfrom" ref="searchForm" class="demo-form-inline">
			<el-form-item prop="realName">
				<el-input
					v-model.trim="searchfrom.realName"
					size="small"
					placeholder="请输入真实姓名"
					prefix-icon="el-icon-search"
				></el-input>
			</el-form-item>
			<el-form-item prop="phone">
				<el-input
					v-model.trim="searchfrom.phone"
					placeholder="请输入手机号"
					prefix-icon="el-icon-search"
					size="small"
				></el-input>
			</el-form-item>
			<el-form-item label="注册时间" prop="time">
				<el-date-picker
					v-model="searchfrom.time"
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					size="small"
					:default-time="['00:00:00', '23:59:59']"
					value-format="timestamp"
					@change="onChangeTime"
				></el-date-picker>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-select v-model="searchfrom.status" placeholder="全部" size="small">
					<el-option label="全部" value></el-option>
					<el-option label="待审核" value="SUBMIT"></el-option>
					<el-option label="通过" value="AGREE"></el-option>
					<el-option label="不通过" value="REJECT"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onClickSearch" size="small">查询</el-button>
				<el-button type="primary" @click="resetForm('searchForm')" size="small">
					重置
				</el-button>
			</el-form-item>
		</el-form>

		<!-- 表格 -->
		<Table :loadData="getList" :column="column" ref="TableList">
			<template v-slot:userNickName="{ scope }">
				<router-link
					tag="a"
					class="nickName"
					:to="{
						path: '/distributorManage/distributorDetail',
						query: { id: scope.userId },
					}"
				>
					{{ scope.userNickName }}
				</router-link>
			</template>
			<template v-slot:inviterNickname="{ scope }">
				<router-link
					tag="a"
					class="nickName"
					:to="{
						path: '/distributorManage/distributorDetail',
						query: { id: scope.inviterId },
					}"
				>
					{{ scope.inviterNickname }}
				</router-link>
			</template>
		</Table>

		<!-- 审核模态窗 -->
		<el-dialog
			title="审核"
			:close-on-click-modal="false"
			center
			:visible.sync="dialogFormVisible"
			width="200px"
		>
			<p style="text-align: center;">当前用户已符合一级经销商设置，是否通过审核？</p>
			<el-form :model="examineForm" :rules="rules" ref="examineForm">
				<el-form-item label="备注" prop="remark">
					<el-input type="textarea" v-model="examineForm.remark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="onClickCancel('examineForm')">不通过</el-button>
				<el-button type="primary" @click="submitForm('examineForm')">通过</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import Table from '@/components/Table/index';
import { parseTime } from '@/utils';
import { Message } from 'element-ui';
import { getDistributorCheck, editDistributorCheck } from '@/api/distributorManage';

export default {
	name: 'distributorExamine',
	components: {
		Table,
	},
	data() {
		return {
			searchfrom: {
				regTimeStart: null, // 注册开始时间
				regTimeEnd: null, // 注册结束时间
				realName: null, //  真实姓名
				phone: null, // 手机号
				status: '', // 审核状态
				time: [],
			},
			column: [
				{
					prop: 'createTime',
					label: '注册时间',
					formatter: (row, column) => {
						return parseTime(row.createTime);
					},
				},
				{ prop: 'userNickName', label: '用户昵称', render: true },
				{ prop: 'realName', label: '真实姓名' },
				{ prop: 'phone', label: '手机号' },
				{ prop: 'inviterNickname', label: '邀请人', render: true },
				{
					prop: 'completeTime',
					label: '符合升级规则时间',
					formatter: (row, column) => {
						return parseTime(row.completeTime);
					},
				},
				{
					prop: 'status',
					label: '状态',
					formatter: (row, column) => {
						switch (row.status) {
							case 'SUBMIT':
								return '待审核';
								break;
							case 'AGREE':
								return '通过';
								break;
							case 'REJECT':
								return '不通过';
								break;
							default:
								return '';
								break;
						}
					},
				},
				{ prop: 'operator', label: '操作人' },
				{
					prop: 'active',
					label: '操作',
					actives: [
						{
							name: val => {
								if (val.status === 'SUBMIT') {
									return '审核';
								} else if (val.status === 'REJECT') {
									return '重新审核';
								} else {
									return '';
								}
							},
							method: val => {
								this.dialogFormVisible = true;
								this.examineForm.id = val.id;
								this.examineForm.remark = '';
							},
						},
					],
				},
			],
			examineForm: {
				remark: '',
				id: null,
			},
			rules: {
				remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
			},
			dialogFormVisible: false,
		};
	},
	computed: {
		getList() {
			return getDistributorCheck;
		},
	},
	mounted() {
		let _key = this.$route.query.status || '';
		if (_key) {
			this.$refs.TableList.update({ status: _key });
		}
	},
	methods: {
		// 选择时间
		onChangeTime(val) {
			console.log(val);
			if (val) {
				this.searchfrom.regTimeStart = val[0];
				this.searchfrom.regTimeEnd = val[1];
				this.$forceUpdate(); // vue 强制同步数据的方法
			} else {
				this.searchfrom.regTimeStart = null;
				this.searchfrom.regTimeEnd = null;
			}
		},
		// 查询搜索事件
		onClickSearch() {
			this.$refs.TableList.update({ ...this.searchfrom });
		},
		// 重置事件
		resetForm(formName) {
			this.$refs[formName].resetFields();
			console.log('======>>this.searchfrom', this.searchfrom);
			this.searchfrom.regTimeStart = null;
			this.searchfrom.regTimeEnd = null;
		},
		// 审核模态窗通过事件
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					editDistributorCheck({ ...this.examineForm, status: 'AGREE' }).then(res => {
						if (res.success) {
							this.dialogFormVisible = false;
							Message.success('操作成功！！！！');
							this.$refs.TableList.reset();
						}
					});
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		// 审核模态窗不通过事件
		onClickCancel(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					editDistributorCheck({ ...this.examineForm, status: 'REJECT' }).then(res => {
						if (res.success) {
							this.dialogFormVisible = false;
							Message.success('操作成功！！！！');
							this.$refs.TableList.reset();
						}
					});
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.distributorExamine {
	padding: 20px;
}
</style>
