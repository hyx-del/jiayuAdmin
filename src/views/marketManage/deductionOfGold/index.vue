<!--
 * @Author: c.k
 * @Date: 2020-07-17 11:34:49
 * @LastEditors: wei.chen
 * @LastEditTime: 2020-10-16 15:04:56
 * @Descripttion: 
-->
<template>
	<div class="orderRule">
		<h4>自动化设置</h4>
		<div style="padding:16px 0">
			<el-switch
				style="display: block"
				:disabled="!upateModal"
				v-model="stateVal"
				active-color="#13ce66"
				inactive-color="#ff4949"
				active-text="已开启抵扣金"
				inactive-text="已经关闭了抵扣金"
			></el-switch>
		</div>
		<el-form
			v-if="stateVal"
			label-width="360px"
			:rules="rules"
			:model="orderRuleForm"
			ref="orderRuleForm"
		>
			<el-form-item
				label="用户首次消费后，将获得订单合计金额"
				prop="shoppingReturnMoneyPercent"
			>
				<el-input
					placeholder
					v-model.trim="orderRuleForm.shoppingReturnMoneyPercent"
					maxlength="3"
					size="small"
					:disabled="!upateModal"
				>
					<template slot="append">
						%
					</template>
				</el-input>
				<span style="color:red;margin-left:10px">
					的抵扣金返现
				</span>
			</el-form-item>
			<el-form-item
				label="用户每笔订单使用抵扣金时，仅可抵扣订单合计金额的"
				prop="orderDeductionPercent"
			>
				<el-input
					placeholder
					v-model.trim="orderRuleForm.orderDeductionPercent"
					maxlength="2"
					size="small"
					:disabled="!upateModal"
				>
					<template slot="append">
						%
					</template>
				</el-input>
			</el-form-item>
		</el-form>
		<div>
			<el-button type="primary" v-if="upateModal" @click="submitForm('orderRuleForm')">
				保存修改
			</el-button>
			<el-button type="primary" v-else @click="upateModal = true">修改模式</el-button>
		</div>
	</div>
</template>

<script>
import { getDeduction, putDeduction } from '@/api/comment';
import { Message } from 'element-ui';

export default {
	name: 'orderRule',
	data() {
		// 正整数校检 validator
		const validatorNumber = (rule, value, callback) => {
			let _checkVal = /^([1-9]|[1-9][0-9]|100)$/.test(value);
			if (value === '') {
				callback(new Error('请输入数值'));
			} else if (!_checkVal) {
				return callback(new Error('请输入大于0, 小于等于100的整数'));
			} else {
				callback();
			}
		};
		// 正整数校检 validator
		const validatorNumberDed = (rule, value, callback) => {
			let _checkVal = /^([1-9]|[1-9][0-9])$/.test(value);
			if (value === '') {
				callback(new Error('请输入数值'));
			} else if (!_checkVal) {
				return callback(new Error('请输入大于0,小于100的整数'));
			} else {
				callback();
			}
		};
		return {
			upateModal: false, // 需要进入修改模式才能修改
			stateVal: false, // 开关状态
			// 订单规则表单数据
			orderRuleForm: {
				shoppingReturnMoneyPercent: 100, // 用户首次消费后，将获得订单合计金额：100
				orderDeductionPercent: 20, // 用户每笔订单使用抵扣金时，仅可抵扣订单合计金额的：20
			},
			// 订单规则表单校检
			rules: {
				shoppingReturnMoneyPercent: [
					{ required: true, validator: validatorNumber, trigger: 'blur' },
					// { min: 1, max: 2, message: '长度在 1 到 2 位的整数', trigger: 'blur' },
				],
				orderDeductionPercent: [
					{ required: true, validator: validatorNumberDed, trigger: 'blur' },
					// { min: 1, max: 2, message: '长度在 1 到 2 位的整数', trigger: 'blur' },
				],
			},
		};
	},
	mounted() {
		this.initData();
	},
	methods: {
		// 初始化数据
		initData() {
			getDeduction().then(res => {
				if (res.success) {
					this.orderRuleForm = res.data;
					this.stateVal = res.data.openFlag;
				}
			});
		},
		submitForm(formName) {
			let _par = {};
			let _valid = -1;
			if (this.stateVal) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						_par = { ...this.orderRuleForm };
						_par.openFlag = this.stateVal;
						_valid = 1;
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			} else {
				_par.openFlag = this.stateVal;
				_valid = 1;
			}
			if (_valid === 1) {
				putDeduction(_par).then(res => {
					Message.success('修改成功！！！');
					this.upateModal = false;
					this.initData();
				});
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.orderRule {
	padding: 20px;
}
</style>
