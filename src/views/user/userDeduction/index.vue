<!--
 * @Author: wei.chen
 * @Date: 2020-09-29 10:46:28
 * @LastEditTime: 2021-07-09 13:47:21
 * @LastEditors: aa
 * @Description: 红包管理
-->
<template>
	<div class="userDeductionManage">
		<el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
			<el-form-item label="用户ID" prop="userId">
				<el-input
					placeholder="请输入用户ID"
					prefix-icon="el-icon-search"
					v-model.trim="formInline.userId"
					size="small"
				></el-input>
			</el-form-item>
			<el-form-item label="手机号码" prop="phone">
				<el-input
					placeholder="请输入手机号码"
					prefix-icon="el-icon-search"
					v-model.trim="formInline.phone"
					size="small"
				></el-input>
			</el-form-item>

			<el-form-item label="操作内容" prop="operateType">
				<el-select
					v-model.trim="formInline.operateType"
					placeholder="请选择操作内容"
					size="small"
				>
					<el-option label="全部" value="" />
					<el-option label="减少" value="SUB" />
					<el-option label="添加" value="ADD" />
				</el-select>
			</el-form-item>

			<el-form-item>
				<el-button size="small" type="primary" @click="onClickSearch">查询</el-button>
				<el-button size="small" type="primary" @click="resetForm('formInline')">
					重置
				</el-button>
			</el-form-item>
		</el-form>
		<el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">
			新增
		</el-button>
		<Table
			:loadData="getList"
			:column="column"
			ref="userDeductionManageList"
			:params="{ status: '' }"
			:showSortIndex="{ show: true, lable: '序号' }"
		></Table>
		<el-dialog
			title="抵扣金操作"
			:visible.sync="visible"
			:before-close="
				() => {
					resetForm('userDeduction');
				}
			"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:destroy-on-close="true"
			width="600px"
		>
			<el-form :model="userDeduction" :rules="userDeductionFormRules" ref="userDeduction">
				<el-form-item prop="userId" label="用户Id">
					<el-input
						v-model="userDeduction.userId"
						style="width:326px"
						maxlength="16"
						size="small"
					></el-input>
					<el-button
						type="primary"
						size="small"
						icon="el-icon-search"
						@click="getUserInfo"
					>
						搜索
					</el-button>
				</el-form-item>
				<el-form-item prop="name" label="手机号">
					<el-input
						disabled
						size="small"
						v-model="userDeduction.phone"
						style="width:410px"
						maxlength="16"
					></el-input>
				</el-form-item>
				<el-form-item prop="name" label="用户昵称">
					<el-input
						size="small"
						disabled
						v-model="userDeduction.nickName"
						style="width:396px"
						maxlength="20"
					></el-input>
				</el-form-item>
				<el-form-item prop="deductionMoney" label="抵扣金结存">
					<el-input
						disabled
						size="small"
						v-model="userDeduction.deductionMoney"
						style="width:396px"
						maxlength="16"
					></el-input>
				</el-form-item>
				<el-form-item label="操作内容" prop="operateType">
					<el-select
						prop="operateType"
						size="small"
						style="width:396px"
						v-model.trim="userDeduction.operateType"
						placeholder="请选择操作内容"
					>
						<el-option label="减少" value="SUB" />
						<el-option label="添加" value="ADD" />
					</el-select>
				</el-form-item>
				<el-form-item prop="num" label="操作数量">
					<el-input
						size="small"
						v-model="userDeduction.num"
						style="width:396px"
						maxlength="16"
					></el-input>
				</el-form-item>
				<el-form-item prop="msgTitle" label="通知标题">
					<el-input
						size="small"
						v-model="userDeduction.msgTitle"
						style="width:396px"
						maxlength="16"
					></el-input>
				</el-form-item>
				<el-form-item prop="msgContent" label="通知内容">
					<el-input
						size="small"
						type="textarea"
						v-model="userDeduction.msgContent"
						style="width:396px"
						maxlength="16"
					></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button @click="resetForm('userDeduction')">取 消</el-button>
				<el-button type="primary" @click="createDeductionFun()">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { userDeductionList, addUserDeduction, queryUserBalanceInfo } from '@/api/user';
import Table from '@/components/Table/index';
import { Message } from 'element-ui';
import { parseTime } from '@/utils';
export default {
	name: 'userDeductionManage',
	components: {
		Table,
	},
	data() {
		// 每人限购数量验证
		const validateLimitNum = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入数值'));
			} else {
				if (!/^[1-9]\d*$/.test(value)) {
					callback(new Error('请输入最大不可超过100000000正整数'));
				}
				value = value * 1;
				if (value >= 1 && value <= 100000000) {
					callback();
				} else {
					callback(new Error('请输入最大不可超过100000000正整数'));
				}
			}
		};
		return {
			visible: false,
			formInline: {
				userId: '',
				phone: '',
				operateType: '',
			},

			column: [
				{ prop: 'userId', label: '用户ID' },
				{ prop: 'nickName', label: '用户昵称' },
				{ prop: 'phone', label: '手机号' },
				{ prop: 'operator', label: '操作人' },
				{
					prop: 'createTime',
					label: '操作时间',
					formatter: (row, column) => {
						return parseTime(row.createTime);
					},
				},

				{
					prop: 'operateType',
					label: '操作类型',
					formatter: (row, column) => {
						let _str = '';
						switch (row.operateType) {
							case 'SUB':
								_str = '减少';
								break;
							case 'ADD':
								_str = '添加';
								break;
						}
						return _str;
					},
				},
				// { prop: 'type', label: '类型' },

				{
					prop: 'num',
					label: '操作数量',
				},
				{
					prop: 'afterMoney',
					label: '余额结存',
				},
			],
			userDeduction: {
				userId: null,
				phone: null,
				nickName: null,
				deductionMoney: null,
				operateType: null,
				num: null,
				msgTitle: null,
				msgContent: null,
			},

			userDeductionFormRules: {
				userId: [{ required: true, trigger: 'blur', message: '用户id 不能为空' }],
				operateType: [{ required: true, trigger: 'blur', message: '操作内容不能为空！' }],
				num: [
					{ required: true, trigger: 'blur', message: '数量不能为空！' },
					{
						validator: validateLimitNum,
						required: true,
						trigger: 'blur',
					},
				],
				msgTitle: [{ required: true, trigger: 'blur', message: '通知标题不能为空！' }],
				msgContent: [{ required: true, trigger: 'blur', message: '通知内容不能为空！' }],
			},
		};
	},
	computed: {
		getList() {
			return userDeductionList;
		},
	},
	methods: {
		getStateInfo(row) {
			const _nowTime = +new Date();
			if (row.termination) {
				return '已结束';
			} else if (row.startTime > _nowTime) {
				return '未开始';
			} else if (row.endTime <= _nowTime) {
				return '已结束';
			} else {
				return '进行中';
			}
		},

		resetCreateForm() {
			this.$refs.userDeduction.resetFields();
			this.userDeduction = {
				name: '',
				source: [],
				type: [],
				dateTimeInterval: null,
				endTime: '',
				content: ['现金红包'],
				deductionMoney: '',
				nickName: null,
				phone: null,
			};
		},

		// 添加活动
		handleAdd() {
			this.visible = true;
		},

		// 查询
		onClickSearch() {
			let _par = { ...this.formInline };
			// console.log('======>', this.formInline)
			if (_par.phone) {
				if (!/^[0-9]{1,}$/.test(_par.phone)) {
					Message.warning('不合理的内容');
					return false;
				}
			}
			if (_par.userId) {
				if (!/^[0-9]{1,}$/.test(_par.userId)) {
					Message.warning('不合理的内容');
					return false;
				}
			}
			this.$refs.userDeductionManageList.update({ ..._par });
		},
		getUserInfo() {
			if (this.userDeduction.userId) {
				if (!/^[0-9]{1,}$/.test(this.userDeduction.userId)) {
					Message.warning('不合理的内容');
					return false;
				}
				queryUserBalanceInfo({ id: this.userDeduction.userId }).then(res => {
					if (res.code === 200) {
						this.userDeduction.deductionMoney = res.data.deductionMoney;
						this.userDeduction.nickName = res.data.nickName;
						this.userDeduction.phone = res.data.phone;
					}
				});
			}
		},
		// 查询的重置事件
		resetForm(formName) {
			this.$refs[formName].resetFields();
			if (formName === 'userDeduction') {
				this.resetCreateForm();
			}

			this.visible = false;
			this.editVisible = false;
			// console.log(this.formInline);
		},
		createDeductionFun() {
			this.$refs.userDeduction.validate(valid => {
				if (valid) {
					let tempPar = { ...this.userDeduction };

					tempPar.deductionMoney = tempPar.deductionMoney * 1;

					addUserDeduction(tempPar).then(res => {
						if (res.success) {
							Message.success('创建成功！！');
							this.visible = false;
							// 数据清空
							this.$refs.userDeductionManageList.reset();
							this.resetCreateForm();
						}
					});
				}
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.userDeductionManage {
	padding: 20px;
}
</style>
