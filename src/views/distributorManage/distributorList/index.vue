<!--
 * @Author: wei.chen
 * @Date: 2020-07-17 12:06:23
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-02-05 17:57:27
 * @Descripttion:
-->
<template>
	<div class="distributorList">
		<!-- 搜索查询的 from 表单 -->
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
					v-model.trim="searchfrom.time"
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
			<el-form-item label="等级" prop="level">
				<el-select v-model.trim="searchfrom.level" placeholder="全部" size="small">
					<el-option label="全部" value></el-option>
					<el-option label="一级经销商" value="ONE"></el-option>
					<el-option label="二级经销商" value="TWO"></el-option>
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
			<template v-slot:nickName="{ scope }">
				<router-link
					tag="a"
					class="nickName"
					:to="{
						path: '/operation/userDetail',
						query: { userId: scope.id },
					}"
				>
					{{ scope.nickName }}
				</router-link>
			</template>
		</Table>

		<!-- 修改模态窗 -->
		<el-dialog
			:close-on-click-modal="false"
			title="修改经销商"
			center
			:visible.sync="dialogFormVisible"
			width="200px"
		>
			<el-form :model="levelForm" :rules="rules" ref="levelForm">
				<el-form-item
					label="等级"
					prop="level"
					style="display: flex;justify-content: center;"
				>
					<el-select v-model.trim="levelForm.level" placeholder="等级名称" size="small">
						<el-option label="一级经销商" value="ONE"></el-option>
						<el-option label="二级经销商" value="TWO"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="onClickCancel('levelForm')">取 消</el-button>
				<el-button type="primary" @click="submitForm('levelForm')">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import Table from '@/components/Table/index';
import { parseTime } from '@/utils';
import { Message } from 'element-ui';
import { getDistributorList, editDistributor } from '@/api/distributorManage';

export default {
	name: 'distributorList',
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
				level: '', // 审核状态
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
				{ prop: 'nickName', label: '用户昵称', render: true },
				{
					prop: 'name',
					label: '真实姓名',
					formatter: row => {
						return row.name || '-';
					},
				},
				{ prop: 'phone', label: '手机号' },
				{
					prop: 'sex',
					label: '性别',
					formatter: row => {
						switch (row.sex) {
							case 'MAN':
								return '男';
								break;
							case 'WOMAN':
								return '女';
								break;
							default:
								return '-';
								break;
						}
					},
				},
				{
					prop: 'birthday',
					label: '生日',
					formatter: row => {
						return parseTime(row.birthday) || '-';
					},
				},
				{ prop: 'inviteeCount', label: '真系下级人数' },
				{
					prop: 'level',
					label: '等级',
					formatter: row => {
						switch (row.level) {
							case 'TWO':
								return '二级经销商';
								break;
							case 'ONE':
								return '一级经销商';
								break;
							default:
								return '';
								break;
						}
					},
				},
				{
					prop: 'action',
					label: '操作',
					actives: [
						{
							name: val => {
								if (val.level === 'ONE') {
									return '修改';
								}
							},
							method: val => {
								console.log(val);
								this.dialogFormVisible = true;
								this.levelForm.level = val.level;
								this.levelForm.id = val.id;
							},
						},
						{
							name: '查看',
							method: val => {
								console.log(val);
								this.$router.push({
									path: 'distributorDetail',
									query: { id: val.id },
								});
							},
						},
					],
				},
			],
			levelForm: {
				level: null,
				id: null,
			},
			dialogFormVisible: false,
			rules: {
				level: [{ required: true, message: '请选择等级', trigger: 'blur' }],
			},
		};
	},
	computed: {
		getList() {
			return getDistributorList;
		},
	},
	methods: {
		// 选择时间
		onChangeTime(val) {
			// console.log(val)
			if (val) {
				this.searchfrom.regTimeStart = val[0];
				this.searchfrom.regTimeEnd = val[1];
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
			this.searchfrom.regTimeStart = null;
			this.searchfrom.regTimeEnd = null;
		},
		// 模态窗取消事件
		onClickCancel(formName) {
			this.$refs[formName].resetFields();
			this.dialogFormVisible = false;
		},
		// 模态窗确定事件
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					editDistributor({ ...this.levelForm }).then(res => {
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
.distributorList {
	padding: 20px;
}
</style>
