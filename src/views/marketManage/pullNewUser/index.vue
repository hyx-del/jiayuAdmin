<!--
 * @Author: c.k
 * @Date: 2020-07-17 11:34:49
 * @LastEditors: aa
 * @LastEditTime: 2021-07-09 13:48:06
 * @Descripttion:
-->
<template>
	<div class="pullNewUser">
		<h4 class="pullNewUser_title">活动配置</h4>
		<div>
			<el-button
				type="primary"
				size="small"
				v-if="upateModal"
				@click="submitForm('pullNewUserForm')"
			>
				保存修改
			</el-button>
			<el-button type="primary" size="small" v-else @click="upateModal = true">
				修改模式
			</el-button>
		</div>
		<div style="padding:16px 0">
			<el-switch
				:disabled="!upateModal"
				v-model="stateVal"
				active-color="#13ce66"
				inactive-color="#eeeeee"
				active-text="已开启拉新活动"
				inactive-text="已经关闭了拉新活动"
			></el-switch>
		</div>
		<el-form
			v-if="stateVal"
			:inline="true"
			label-width="360px"
			:rules="rules"
			:model="pullNewUserForm"
			ref="pullNewUserForm"
		>
			<el-form-item label="用户拉新成功后，将获得红包为金额" prop="money">
				<el-input
					placeholder
					v-model.trim="pullNewUserForm.money"
					maxlength="6"
					size="small"
					:disabled="!upateModal"
				>
					<template slot="append">
						元
					</template>
				</el-input>
			</el-form-item>
			<el-form-item label="每一轮活动持续时间为" prop="minutes">
				<el-input
					placeholder
					v-model.trim="pullNewUserForm.minutes"
					maxlength="7"
					size="small"
					:disabled="!upateModal"
				>
					<template slot="append">
						分钟
					</template>
				</el-input>
			</el-form-item>
			<el-form-item label="用户参与活动需要满足最低消费金额" prop="lowestPayMoney">
				<el-input
					placeholder
					v-model.trim="pullNewUserForm.lowestPayMoney"
					maxlength="6"
					size="small"
					:disabled="!upateModal"
				>
					<template slot="append">
						元
					</template>
				</el-input>
			</el-form-item>
			<el-form-item label="消费金额计算开始时间" prop="starDateTime">
				<el-date-picker
					v-model="pullNewUserForm.starDateTime"
					type="datetime"
					placeholder="选择日期时间"
					size="small"
					:disabled="!upateModal"
				></el-date-picker>
			</el-form-item>
			<el-form-item label="发起轮数" prop="istrue">
				<el-radio-group @change="onChangeTimes" v-model="radio">
					<el-radio :label="1">
						<div class="samestyle">每天可发起</div>
						<el-input
							placeholder
							v-model.trim="pullNewUserForm.dayActStartTimes"
							maxlength="6"
							size="small"
							:disabled="!upateModal || (!upateModals2 && radio != 1)"
						>
							<template slot="append">
								轮
							</template>
						</el-input>
					</el-radio>
					<el-radio :label="2">
						<div class="samestyle">用户总发起</div>
						<el-input
							placeholder
							v-model.trim="pullNewUserForm.totalActStartTime"
							maxlength="6"
							size="small"
							:disabled="!upateModal || (!upateModals1 && radio == 1)"
						>
							<template slot="append">
								轮
							</template>
						</el-input>
					</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item
				v-if="!upateModals2 && radio != 1"
				label="计算开始时间"
				prop="totalTimesStarDateTime"
			>
				<el-date-picker
					v-model="pullNewUserForm.totalTimesStarDateTime"
					type="datetime"
					placeholder="选择日期时间"
					size="small"
					:disabled="!upateModal"
				></el-date-picker>
			</el-form-item>

			<el-form-item label="每轮活动需要邀请" prop="completePeople">
				<el-input
					placeholder
					v-model.trim="pullNewUserForm.completePeople"
					maxlength="6"
					size="small"
					:disabled="!upateModal"
				>
					<template slot="append">
						人(2≤N≤10)
					</template>
				</el-input>
			</el-form-item>

			<el-form-item label="奖励类型为" prop="rewardType">
				<el-radio-group :disabled="!upateModal" v-model="pullNewUserForm.rewardType">
					<el-radio label="MONEY">钱包余额</el-radio>
					<el-radio label="DEDUCTION">抵扣金</el-radio>
				</el-radio-group>
			</el-form-item>

			<div>
				<el-form-item
					label="活动规则(换行请使用<p>)"
					style="width:70%"
					class="act_rule"
					prop="rule"
				>
					<div class="act_rule_textarea" :disabled="!upateModal" style="width: 100%;">
						<el-input
							:disabled="!upateModal"
							style="width: 100%;"
							type="textarea"
							:autosize="{ minRows: 6, maxRows: 8 }"
							v-model="pullNewUserForm.rule"
						></el-input>
					</div>
				</el-form-item>
			</div>
		</el-form>
		<hr />
		<h4 class="pullNewUser_title">活动统计</h4>
		<div>
			<el-date-picker
				v-model.trim="queryTotal"
				type="daterange"
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				size="small"
				:default-time="['00:00:00', '23:59:59']"
				value-format="timestamp"
			></el-date-picker>
			<el-button size="small" type="primary" @click="getActNewTotalInfo">查询</el-button>
		</div>
		<div class="total_info">
			<div class="total_info_item">
				<span class="total_info_item_title">总开启数量</span>
				<span class="total_info_item_info" v-text="totalInfo.count || 0"></span>
			</div>
			<div class="total_info_item">
				<span class="total_info_item_title">已完成数量</span>
				<span class="total_info_item_info" v-text="totalInfo.doneCount || 0"></span>
			</div>
			<div class="total_info_item">
				<span class="total_info_item_title">进行中数量</span>
				<span class="total_info_item_info" v-text="totalInfo.ingCount || 0"></span>
			</div>
			<div class="total_info_item" style="width:320px">
				<span class="total_info_item_title">已发出金额(抵扣金)</span>
				<span
					class="total_info_item_info"
					v-text="moneyFormat(totalInfo.totalDeduction)"
				></span>
			</div>
			<div class="total_info_item" style="width:320px">
				<span class="total_info_item_title">已发出金额(钱包余额)</span>
				<span
					class="total_info_item_info"
					v-text="moneyFormat(totalInfo.totalMoney)"
				></span>
			</div>
			<div class="total_info_item">
				<span class="total_info_item_title">参与用户数</span>
				<span class="total_info_item_info" v-text="totalInfo.userCount || 0"></span>
			</div>
			<div class="total_info_item">
				<span class="total_info_item_title">助力用户数</span>
				<span class="total_info_item_info" v-text="totalInfo.joinUserCount || 0"></span>
			</div>
		</div>
		<hr />
		<h4 class="pullNewUser_title">活动详情</h4>
		<el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
			<el-form-item label="用户ID" prop="userId">
				<el-input
					v-model.trim="formInline.userId"
					size="small"
					placeholder="请输入"
				></el-input>
			</el-form-item>
			<el-form-item label="用户昵称" prop="nickName">
				<el-input
					v-model.trim="formInline.nickName"
					size="small"
					placeholder="请输入"
					maxlength="20"
				></el-input>
			</el-form-item>
			<el-form-item label="开启时间" prop="startTime">
				<el-date-picker
					v-model.trim="formInline.startTime"
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					size="small"
					:default-time="['00:00:00', '23:59:59']"
					@change="onChangeTime"
					value-format="timestamp"
				></el-date-picker>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-select v-model.trim="formInline.status" placeholder="请选择状态" size="small">
					<el-option label="全部" value="" />
					<el-option label="进行中" value="ING" />
					<el-option label="已完成" value="DONE" />
					<el-option label="已失败" value="FAILED" />
				</el-select>
			</el-form-item>
			<el-form-item label="奖励类型" prop="rewardType">
				<el-select v-model.trim="formInline.rewardType" placeholder="请选择" size="small">
					<el-option label="全部" value="" />
					<el-option label="钱包余额" value="MONEY" />
					<el-option label="抵扣金" value="DEDUCTION" />
				</el-select>
			</el-form-item>
			<el-form-item label="红包金额" prop="redPackMoney">
				<el-input
					v-model.trim="formInline.redPackMoney"
					size="small"
					placeholder="请输入"
				></el-input>
			</el-form-item>
			<el-form-item>
				<el-button size="small" type="primary" @click="onClickSearch">查询</el-button>
				<el-button size="small" type="primary" @click="resetForm('formInline')">
					重置
				</el-button>
			</el-form-item>
		</el-form>

		<Table :loadData="getList" :column="column" ref="activeList" :params="{ ...formInline }">
			<template v-slot:newActJoinList="{ scope }">
				<div>
					<router-link
						v-for="(item, index) in scope.newActJoinList"
						:key="item.id"
						tag="a"
						style="color:blue"
						class="gotoPage"
						:to="{ path: '/operation/userDetail', query: { userId: item.userId } }"
					>
						{{ item.userId }} {{ index === scope.newActJoinList.length - 1 ? '' : '/' }}
					</router-link>
				</div>
			</template>
		</Table>
	</div>
</template>

<script>
import Table from '@/components/Table/index';
import { getActNewRule, editActNewRule, getActNewList, getActNewTotal } from '@/api/marketManage';
import { Message } from 'element-ui';
import { regFloat } from '@/utils/reg';
import { parseTime } from '@/utils/index';
import { moneyFormat } from '@/core/directives/money';
import { debuglog } from 'util';

export default {
	name: 'pullNewUser',
	components: {
		Table,
	},
	data() {
		// 校验次数
		const validatorDayActStartTimes = (rule, value, callback) => {
			let _checkVal = /^([1-9][0-9]{0,4})$/.test(value);

			if (value === '') {
				callback(new Error('请输入数值'));
			} else if (!_checkVal) {
				return callback(new Error('请输入大于0 的最长4位整数'));
			} else if (value > 1000 || value < 1) {
				return callback(new Error('请输入0<N<=1000的数字'));
			} else {
				callback();
			}
		};
		// 校验红包
		const validatorMoney = (rule, value, callback) => {
			let _checkVal = regFloat.test(value);
			if (value === '') {
				callback(new Error('请请输入整数或者两位小数数值'));
			} else if (!_checkVal) {
				return callback(new Error('请输入整数或者两位小数数值'));
			} else if (value > 100 || value <= 0) {
				return callback(new Error('请输入0<N<=100的数字'));
			} else {
				callback();
			}
		};
		// 正整数校检 validator
		const validatorNumber = (rule, value, callback) => {
			let _checkVal = /^([1-9][0-9]{0,4})$/.test(value);

			if (value === '') {
				callback(new Error('请输入数值'));
			} else if (!_checkVal) {
				return callback(new Error('请输入大于0 的最长5位整数'));
			} else if (parseInt(value) > 10080) {
				return callback(new Error('请输入小于7天的时间周期'));
			} else {
				callback();
			}
		};
		// 参与人数限制
		const validatorCompletePeople = (rule, value, callback) => {
			let _checkVal = /^([1-9][0-9]{0,2})$/.test(value);

			if (value === '') {
				callback(new Error('请输入数值'));
			} else if (!_checkVal) {
				return callback(new Error('请输入大于0 的最长2位整数'));
			}
			if (value > 10 || value < 2) {
				return callback(new Error('请输入2<=N <=10 的数据'));
			} else {
				callback();
			}
		};
		// 正整数校检 validator
		const validatorNumberFloat = (rule, value, callback) => {
			let _checkVal = regFloat.test(value);
			if (value === '') {
				callback(new Error('请请输入整数或者两位小数数值'));
			} else if (!_checkVal) {
				return callback(new Error('请输入整数或者两位小数数值'));
			} else if (value > 100) {
				return callback(new Error('请输入不超过1000的数字'));
			} else {
				callback();
			}
		};
		return {
			radio: 1, //发起轮数单选状态
			formInline: {
				name: '', // 优惠券名称
				status: '', // 状态
				// type: 'ALL', // 类型
			},
			totalInfo: {},
			queryTotal: null, // 9查询统计
			upateModal: false, // 需要进入修改模式才能修改
			stateVal: false, // 开关状态
			// 订单规则表单数据
			pullNewUserForm: {
				open: false,
				money: null,
				minutes: null,
			},
			upateModals: true,
			upateModals1: false,
			upateModals2: false,
			// 订单规则表单校检
			rules: {
				money: [
					{ required: true, validator: validatorMoney, trigger: 'blur' },
					// { min: 1, max: 2, message: '长度在 1 到 2 位的整数', trigger: 'blur' },
				],
				lowestPayMoney: [
					{ required: true, validator: validatorNumberFloat, trigger: 'blur' },
				],
				istrue: [{ required: true }],
				// totalActStartTime: [{ validator: validatorDayActStartTimes, trigger: 'change' }],
				minutes: [
					{ required: true, validator: validatorNumber, trigger: 'blur' },
					// { min: 1, max: 2, message: '长度在 1 到 2 位的整数', trigger: 'blur' },
				],
				starDateTime: [{ required: true, message: '时间必填', trigger: 'blur' }],
				totalTimesStarDateTime: [{ required: true, message: '时间必填', trigger: 'blur' }],
				rewardType: [
					{ required: true, message: '必填项', trigger: 'blur' },
					// { min: 1, max: 2, message: '长度在 1 到 2 位的整数', trigger: 'blur' },
				],
				completePeople: [
					{ required: true, validator: validatorCompletePeople, trigger: 'change' },
				],
				rule: [
					{ required: true, message: '必填项', trigger: 'blur' },
					// { min: 1, max: 2, message: '长度在 1 到 2 位的整数', trigger: 'blur' },
				],
			},
			// 优惠券列表表头数据
			column: [
				{
					prop: 'id',
					label: '序号',
				},
				{
					prop: 'userId',
					label: '用户ID',
				},
				{
					prop: 'nickName',
					label: '用户昵称',
				},
				{
					prop: 'createTime',
					label: '开启时间',
					formatter: (row, column) => {
						return parseTime(row.createTime);
					},
				},
				{
					prop: 'endTime',
					label: '完成时间',
					formatter: (row, column) => {
						if (
							row.status === 'DONE' &&
							row.newActJoinList.length === row.completePeople
						) {
							return parseTime(row.newActJoinList[row.completePeople - 1].createTime);
						} else {
							return '';
						}
					},
				},
				{
					prop: 'updateTime',
					label: '判断机刷',
					formatter: (row, column) => {
						if (
							row.status === 'DONE' &&
							row.newActJoinList.length >= row.completePeople
						) {
							if (
								row.newActJoinList[row.completePeople - 1].createTime -
									row.newActJoinList[0].createTime <=
								3000
							) {
								return '疑似机刷';
							} else {
								return '--';
							}
							// if (
							// 	row.newActJoinList[row.completePeople - 1].createTime -
							// 		row.createTime <
							// 	15000
							// ) {
							// 	return '疑似机刷';
							// } else {

							// 	return '--';
							// }
						} else {
							return '--';
						}
					},
				},
				{
					prop: 'newActJoinList',
					label: '助力用户信息',
					render: true,
					// formatter: row => {
					// 	let _len = row.newActJoinList.length;
					// 	let _str = '';
					// 	for (let index = 0; index < _len; index++) {
					// 		const element = row.newActJoinList[index];
					// 		_str += element.userId + '/';
					// 	}
					// 	return _str;
					// },
				},
				{
					prop: 'itemSkuId',
					label: '活动状态',
					formatter: (row, column) => {
						if (row.status === 'FAILED') {
							return '已失败';
						} else if (row.status === 'ING') {
							return '进行中';
						} else if (row.status === 'DONE') {
							return '已完成';
						}
					},
				},
				{
					prop: 'rewardType',
					label: '奖励类型',
					formatter: (row, column) => {
						if (row.rewardType === 'MONEY') {
							return '钱包余额';
						} else if (row.rewardType === 'DEDUCTION') {
							return '抵扣金';
						} else if (row.rewardType === '') {
							return '--';
						}
					},
				},
				{ prop: 'redPackMoney', label: '奖励金额' },
			],
		};
	},
	computed: {
		getList() {
			return getActNewList;
		},
	},
	mounted() {
		this.initData();
		this.getActNewTotalInfo();
	},
	methods: {
		moneyFormat(num) {
			return moneyFormat(num);
		},
		onChangeTime(value) {
			console.log(value);
			if (value) {
				this.formInline.startTimeStart = value[0];
				this.formInline.startTimeEnd = value[1];
			} else {
				this.formInline.startTimeStart = null;
				this.formInline.startTimeEnd = null;
			}
		},
		onChangeTimes(values) {
			if (values == 1) {
				this.upateModals2 = true;
				this.upateModals1 = false;
			} else {
				this.upateModals2 = false;
				this.upateModals1 = true;
			}
		},
		// 查询
		onClickSearch() {
			// console.log('======>', this.formInline)
			const _par = { ...this.formInline };

			if (_par.startTime && _par.startTime.length) {
				_par.startTimeStart = _par.startTime[0];
				_par.startTimeEnd = _par.startTime[1];
			}
			// 查询列表信息
			this.$refs.activeList.update(_par);
		},
		getActNewTotalInfo() {
			// 查询统计信息
			let _par = {};
			if (this.queryTotal && this.queryTotal.length) {
				_par.startTimeStart = this.queryTotal[0];
				_par.startTimeEnd = this.queryTotal[1];
			}
			getActNewTotal(_par).then(res => {
				if (res.code === 200) {
					// console.log('res.data', res.data);
					this.totalInfo = res.data;
				}
			});
		},
		// 查询的重置事件
		resetForm(formName) {
			this.$refs[formName].resetFields();
		},
		// 初始化数据
		initData() {
			getActNewRule().then(res => {
				if (res.success) {
					if (res.data.dayActStartTimes) {
						this.radio = 1;
						this.upateModals1 = false;
						this.upateModals2 = true;
					} else {
						this.radio = 2;
						this.upateModals1 = true;
						this.upateModals2 = false;
					}
					res.data['istrue'] = true;
					this.pullNewUserForm = res.data;
					this.stateVal = res.data.open;
				}
			});
		},
		submitForm(formName) {
			let _par = {};
			let _valid = -1;

			if (this.stateVal) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						_par = { ...this.pullNewUserForm };
						_par.open = this.stateVal;
						_valid = 1;
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			} else {
				_par.open = this.stateVal;
				_valid = 1;
			}

			if (_valid === 1) {
				if (_par.open) {
					_par.starDateTime = new Date(_par.starDateTime).getTime();
					let _newDate = +new Date();
					if (_par.starDateTime >= _newDate) {
						Message.error('消费金额计算开始时间不能超过当前时间');
						return false;
					}
				}

				if (_par.totalTimesStarDateTime) {
					_par.totalTimesStarDateTime = new Date(_par.totalTimesStarDateTime).getTime();
				}

				if (!this.upateModals2 && this.radio !== 1) {
					_par.dayActStartTimes = null;
				} else {
					_par.totalActStartTime = null;
				}
				if (!this.upateModals1) {
					let values = _par.dayActStartTimes;
					let _checkVal = /^([1-9][0-9]{0,4})$/.test(values);
					if (values === '') {
						Message.error('请输入数值');
						return;
					} else if (!_checkVal) {
						Message.error('请输入大于0 的最长4位整数');
						return;
					} else if (values > 1000 || values < 1) {
						Message.error('请输入0<N<=1000的数字');
						return;
					}
				} else if (!this.upateModals2) {
					let values = _par.totalActStartTime;
					let _checkVal = /^([1-9][0-9]{0,4})$/.test(values);
					if (values === '') {
						Message.error('请输入数值');
						return;
					} else if (!_checkVal) {
						Message.error('请输入大于0 的最长4位整数');
						return;
					} else if (values > 1000 || values < 1) {
						Message.error('请输入0<N<=1000的数字');
						return;
					}
				}

				editActNewRule(_par).then(res => {
					Message.success('修改成功！！！');
					this.upateModal = false;
					this.upateModals1 = false;
					this.upateModals2 = false;
					this.initData();
				});
			}
		},
	},
};
</script>

<style lang="scss">
.pullNewUser {
	padding: 20px;
	.el-form-item__content .el-input-group {
		vertical-align: middle;
	}
	.el-form {
		.act_rule {
			.act_rule_textarea {
				display: inline-block;
				width: 70%;
			}
			.el-form-item__content {
				display: inline-block;
				width: 60%;
			}
		}
	}

	.pullNewUser_title {
		margin: 10px 0;
	}
	.total_info {
		display: flex;
		.total_info_item {
			width: 240px;
			height: 48px;
			line-height: 48px;
			.total_info_item_title {
				color: #999;
			}
		}
	}
	.samestyle {
		display: inline-block;
		vertical-align: middle;
	}
}
</style>
