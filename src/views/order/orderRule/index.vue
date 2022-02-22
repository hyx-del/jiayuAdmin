<!--
 * @Author: wei.chen
 * @Date: 2020-07-17 11:34:49
 * @LastEditors: wei.chen
 * @LastEditTime: 2020-11-26 18:30:10
 * @Descripttion: 
-->
<template>
	<div class="orderRule">
		<h4>自动化设置</h4>
		<el-form label-width="180px" :rules="rules" :model="orderRuleForm" ref="orderRuleForm">
			<el-form-item label="限时抢购订单超过" prop="promotionCloseMin">
				<el-input
					placeholder
					v-model.trim="orderRuleForm.promotionCloseMin"
					maxlength="2"
					size="small"
					:disabled="isShowBtu ? false : true"
				>
					<template slot="append">
						/分
					</template>
				</el-input>
				<span style="margin-left:10px">未付款，则订单自动关闭</span>
			</el-form-item>
			<el-form-item label="下单后，超过" prop="normalCloseMin">
				<el-input
					placeholder
					v-model.trim="orderRuleForm.normalCloseMin"
					maxlength="2"
					size="small"
					:disabled="isShowBtu ? false : true"
				>
					<template slot="append">
						/分
					</template>
				</el-input>
				<span style="margin-left:10px">未付款，则订单自动关闭</span>
			</el-form-item>
			<el-form-item label="已发货订单超过" prop="completeDay">
				<el-input
					placeholder
					v-model.trim="orderRuleForm.completeDay"
					maxlength="2"
					size="small"
					:disabled="isShowBtu ? false : true"
				>
					<template slot="append">
						/天
					</template>
				</el-input>
				<span style="margin-left:10px">未收货，则订单自动完成</span>
			</el-form-item>
			<el-form-item label="用户延长收货时长为" prop="delayReceiveDay">
				<el-input
					placeholder
					v-model.trim="orderRuleForm.delayReceiveDay"
					maxlength="2"
					size="small"
					:disabled="isShowBtu ? false : true"
				>
					<template slot="append">
						/天
					</template>
				</el-input>
				<span style="color:red;margin-left:10px">
					若用户延长收货，则已发货订单自动化规则将顺延！
				</span>
			</el-form-item>
			<el-form-item label="订单完成超过" prop="doneCommentDay">
				<el-input
					placeholder
					v-model.trim="orderRuleForm.doneCommentDay"
					maxlength="2"
					size="small"
					:disabled="isShowBtu ? false : true"
				>
					<template slot="append">
						/天
					</template>
				</el-input>
				<span style="margin-left:10px">自动五星好评</span>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" v-if="isShowBtu" @click="submitForm('orderRuleForm')">
					保存
				</el-button>
				<el-button type="primary" v-else @click="isShowBtu = true">修改设置</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import { getOrderRule, editOrderRule } from '@/api/order';
import { Message } from 'element-ui';

export default {
	name: 'orderRule',
	data() {
		// 正整数校检 validator
		const validatorNumber = (rule, value, callback) => {
			let _checkVal = /^[1-9]\d*|0$/.test(value);
			if (value === '') {
				callback(new Error('请输入数值'));
			} else if (!_checkVal) {
				return callback(new Error('请输入大于等于零的整数'));
			} else {
				callback();
			}
		};
		return {
			// 订单规则表单数据
			orderRuleForm: {
				promotionCloseMin: null, // 限时抢购订单下单未支付自动关闭时间，默认：7分钟
				normalCloseMin: null, // 普通订单下单未支付自动关闭时间，默认：30分钟
				completeDay: null, // 已发货订单间隔多少天自动收货，默认：9天
				delayReceiveDay: null, // 用户延长收货时间，默认：7天
				doneCommentDay: null, // 订单完成自动评价时间，默认：3天
			},
			// 订单规则表单校检
			rules: {
				promotionCloseMin: [
					{ required: true, validator: validatorNumber, trigger: 'blur' },
					// { min: 1, max: 2, message: '长度在 1 到 2 位的整数', trigger: 'blur' },
				],
				normalCloseMin: [
					{ required: true, validator: validatorNumber, trigger: 'blur' },
					// { min: 1, max: 2, message: '长度在 1 到 2 位的整数', trigger: 'blur' },
				],
				completeDay: [
					{ required: true, validator: validatorNumber, trigger: 'blur' },
					// { min: 1, max: 2, message: '长度在 1 到 2 位的整数', trigger: 'blur' },
				],
				delayReceiveDay: [
					{ required: true, validator: validatorNumber, trigger: 'blur' },
					// { min: 1, max: 2, message: '长度在 1 到 2 位的整数', trigger: 'blur' },
				],
				doneCommentDay: [
					{ required: true, validator: validatorNumber, trigger: 'blur' },
					// { min: 1, max: 2, message: '长度在 1 到 2 位的整数', trigger: 'blur' },
				],
			},
			isShowBtu: false,
		};
	},
	mounted() {
		this.initData();
	},
	methods: {
		// 初始化数据
		initData() {
			getOrderRule().then(res => {
				if (res.success) {
					this.orderRuleForm = res.data;
				}
			});
		},
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					editOrderRule({ ...this.orderRuleForm }).then(res => {
						Message.success('修改成功！！！');
						this.isShowBtu = false;
						this.initData();
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
.orderRule {
	padding: 20px;
}
</style>
