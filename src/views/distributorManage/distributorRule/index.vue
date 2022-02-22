<!--
 * @Author: wei.chen
 * @Date: 2020-07-17 12:07:59
 * @LastEditors: wei.chen
 * @LastEditTime: 2020-10-16 12:58:54
 * @Descripttion: 
-->
<template>
	<div class="distrbutorRule">
		<h4>
			收益规则 / 金银币规则
		</h4>
		<el-form label-width="160px" :model="RuleForm" ref="RuleForm" :rules="rules">
			<el-form-item label="直属粉丝返佣比例" prop="money2goldPercent">
				<el-input
					placeholder
					v-model.trim="RuleForm.money2goldPercent"
					maxlength="6"
					size="small"
					:disabled="!isShow"
				>
					<template slot="prepend">
						1:
					</template>
				</el-input>
				<span>A邀请了B，B后续消费A所能获得的返佣比例（返佣比例会自动折算为金币）</span>
			</el-form-item>
			<el-form-item label="二代粉丝返佣比例" prop="money2silverPercent">
				<el-input
					placeholder
					v-model.trim="RuleForm.money2silverPercent"
					maxlength="6"
					size="small"
					:disabled="!isShow"
				>
					<template slot="prepend">
						1:
					</template>
				</el-input>
				<span>
					A邀请的会员B后续发展了其它会员C，C消费时，A所能获得的返佣比例（返佣比例会自动折算为银币）
				</span>
			</el-form-item>
			<!-- <div class="prepend">
				<el-form-item label="现金转化金币比例" prop="money2goldPercent">
					<el-input
						placeholder
						v-model.number="RuleForm.money2goldPercent"
						maxlength="6"
						size="small"
						:disabled="!isShow"
					>
						<template slot="prepend">
							1：
						</template>
					</el-input>
				</el-form-item>
				<el-form-item label="现金转化银币比例" prop="money2silverPercent">
					<el-input
						placeholder
						v-model.number="RuleForm.money2silverPercent"
						maxlength="6"
						size="small"
						:disabled="!isShow"
					>
						<template slot="prepend">
							1：
						</template>
					</el-input>
				</el-form-item>
			</div> -->

			<el-form-item label="金银币清零/转化规则" prop="coinTransferDay">
				<span>每月金银币自动转化为现金时间为每月</span>
				<el-select
					v-model="RuleForm.coinTransferDay"
					placeholder="请选择"
					size="small"
					:disabled="!isShow"
				>
					<el-option
						v-for="(item, index) in options"
						:key="index"
						:label="item"
						:value="item"
					></el-option>
				</el-select>
				<p>
					若到期，注册用户未成为二级经销商，则金银币自动清空；二级经销商未成为一级经销商则银币清空
				</p>
			</el-form-item>
			<div class="prepend">
				<el-form-item label="银币转化现金比例" prop="silver2moneyPercent">
					<el-input
						placeholder
						v-model.number="RuleForm.silver2moneyPercent"
						maxlength="6"
						size="small"
						:disabled="!isShow"
					>
						<template slot="append">
							：1
						</template>
					</el-input>
				</el-form-item>
				<el-form-item label="金币转化现金比例" prop="gold2moneyPercent">
					<el-input
						placeholder
						v-model.number="RuleForm.gold2moneyPercent"
						maxlength="6"
						size="small"
						:disabled="!isShow"
					>
						<template slot="append">
							：1
						</template>
					</el-input>
				</el-form-item>
			</div>
			<h4>粉丝返现规则</h4>
			<el-form-item label="">
				<div>
					<el-form-item label="消费返现" label-width="100" prop="shoppingReturnFlag">
						<el-switch
							:disabled="!isShow"
							v-model="RuleForm.shoppingReturnFlag"
						></el-switch>
					</el-form-item>
				</div>
				<div v-if="RuleForm.shoppingReturnFlag">
					<el-form-item
						label="直属粉丝首次消费后，获得"
						label-width="190"
						prop="firstShoppingReturnMoney"
					>
						<el-input
							placeholder
							v-model.number="RuleForm.firstShoppingReturnMoney"
							maxlength="4"
							size="small"
							:disabled="!isShow"
						>
							<template slot="append">
								/元
							</template>
						</el-input>
						<span>现金返现</span>
					</el-form-item>
				</div>
			</el-form-item>
			<!-- <el-form-item label="">
				<div>
					<el-form-item label="等级返现" label-width="100" prop="levelReturnFlag">
						<el-switch v-model="RuleForm.levelReturnFlag"></el-switch>
					</el-form-item>
				</div>
				<div>
					<span>直属粉丝成为二级经销商后，获得</span>
					<el-input
						placeholder
						v-model.trim="RuleForm.up2twoLevelMoney"
						maxlength="10"
						size="small"
						:disabled="RuleForm.levelReturnFlag ? false : true"
					>
						<template slot="append">
							/元
						</template>
					</el-input>
					<span>现金返现</span>
				</div>
				<div>
					<span>直属粉丝成为一级经销商后，获得</span>
					<el-input
						placeholder
						v-model.trim="RuleForm.up2oneLevelMoney"
						maxlength="10"
						size="small"
						:disabled="RuleForm.levelReturnFlag ? false : true"
					>
						<template slot="append">
							/元
						</template>
					</el-input>
					<span>现金返现</span>
				</div>
			</el-form-item> -->
			<h4>分销等级规则</h4>
			<el-form-item label="" prop="fare">
				<el-table :data="tableData" border style="width: 70%">
					<el-table-column
						align="center"
						prop="grade"
						label="等级名称"
						width="160"
					></el-table-column>
					<el-table-column
						align="center"
						prop="condition"
						label="升级条件"
						:formatter="formatterCondition"
					></el-table-column>
					<el-table-column align="center" prop="active" label="操作" width="100">
						<template slot-scope="scope">
							<el-button
								@click="onClickEdit(scope.row)"
								:disabled="!isShow"
								type="primary"
								size="mini"
							>
								修改
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" v-if="isShow" @click="submitForm('RuleForm')">
					保存
				</el-button>
				<el-button type="primary" v-else @click="isShow = true">修改分销规则</el-button>
			</el-form-item>
		</el-form>

		<!-- 修改注册用户升级规则模态窗 -->
		<el-dialog
			title="修改注册用户升级规则"
			center
			:visible.sync="dialogFormVisible"
			width="100px"
			:close-on-click-modal="false"
		>
			<el-form
				:model="twoLevelForm"
				ref="twoLevelForm"
				:rules="twoLevelRules"
				label-width="100px"
			>
				<el-form-item label="升级条件" />

				<el-form-item label="购物金额" prop="twoLevelUpConditionMoney">
					<el-input
						placeholder
						v-model.number="twoLevelForm.twoLevelUpConditionMoney"
						maxlength="6"
						size="small"
					>
						<template slot="append">
							/元
						</template>
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="onClickTwoLevel('twoLevelForm')">确 定</el-button>
			</div>
		</el-dialog>

		<!-- 修改二级分销商升级规则 -->
		<el-dialog
			title="修改二级分销商升级规则"
			center
			:visible.sync="oneLeveVisible"
			width="100px"
			:close-on-click-modal="false"
			class="oneLevelForm"
		>
			<el-form
				:model="oneLevelForm"
				ref="oneLevelForm"
				label-width="100px"
				:rules="oneLevelRules"
			>
				<el-form-item label="升级条件" />

				<el-form-item label="" prop="oneLevelUpConditionMoney">
					<div>
						<el-checkbox v-model="checked1" label="收益金额"></el-checkbox>
						<br />
						<el-input
							placeholder
							v-model.number="oneLevelForm.oneLevelUpConditionMoney"
							maxlength="6"
							size="small"
							:disabled="!checked1"
						>
							<template slot="append">
								/元
							</template>
						</el-input>
					</div>
				</el-form-item>
				<el-form-item label="" prop="oneLevelUpConditionFans">
					<div>
						<el-checkbox v-model="checked2" label="直属粉丝人数"></el-checkbox>
						<br />
						<el-input
							placeholder
							v-model.number="oneLevelForm.oneLevelUpConditionFans"
							maxlength="6"
							size="small"
							:disabled="!checked2"
						>
							<template slot="append">
								/人
							</template>
						</el-input>
					</div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="onClickOneLevel('oneLevelForm')">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { getDistributorRule, editDistributorRule } from '@/api/distributorManage';
import { Message } from 'element-ui';
import { moneyFormat } from '@/core/directives/money';
import { thistle } from 'color-name';
import { debuglog } from 'util';
export default {
	name: 'distrbutorRule',
	data() {
		// 正整数校检 validator
		const validatorNumber = (rule, value, callback) => {
			let _checkVal = /^[1-9][0-9]{0,}$/.test(value);
			if (value === '') {
				callback(new Error('请输入数值'));
			} else if (!_checkVal) {
				return callback(new Error('请输入大于等于零的整数'));
			} else {
				callback();
			}
		};
		return {
			checked1: true,
			checked2: true,
			oneLevelForm: {
				oneLevelUpConditionMoney: null,
				oneLevelUpConditionFans: null,
			},
			oneLevelRules: {
				oneLevelUpConditionMoney: [
					{ required: true, validator: validatorNumber, trigger: 'blur' },
				],
				oneLevelUpConditionFans: [
					{ required: true, validator: validatorNumber, trigger: 'blur' },
				],
			},
			twoLevelForm: { twoLevelUpConditionMoney: null },
			twoLevelRules: {
				twoLevelUpConditionMoney: [
					{ required: true, validator: validatorNumber, trigger: 'blur' },
				],
			},
			RuleForm: {
				// childReturnPercent: null, // 直属粉丝返佣比例
				// grandsonReturnPercent: null, // 二代粉丝返佣比例
				money2goldPercent: null, // 现金转金币比例
				money2silverPercent: null, // 现金转银币比例
				coinTransferDay: null, // 金银币清零日期
				silver2moneyPercent: null, // 银币转现金比例
				gold2moneyPercent: null, // 金币转现金比例
				shoppingReturnFlag: false, // 消费返现是否打开 true打开 false关闭
				firstShoppingReturnMoney: null, // 直属粉丝首次消费后获得
				// levelReturnFlag: false, // 等级返现是否打开 true打开 false关闭
				// up2oneLevelMoney: null, // 直属粉丝成为一级经销商后获得
				// up2twoLevelMoney: null, // 直属粉丝成为二级经销商后获得
				twoLevelUpConditionMoney: null, // 二级经销商需要【购买金额】满足x
				oneLevelUpConditionMoney: null, // 一级经销商需要【收益金额】满足x
			},
			rules: {
				shoppingReturnFlag: [{ required: true, trigger: 'blur' }],
				childReturnPercent: [
					{ required: true, validator: validatorNumber, trigger: 'blur' },
				],
				grandsonReturnPercent: [
					{ required: true, validator: validatorNumber, trigger: 'blur' },
				],
				money2goldPercent: [
					{ required: true, validator: validatorNumber, trigger: 'blur' },
				],
				money2silverPercent: [
					{ required: true, validator: validatorNumber, trigger: 'blur' },
				],
				coinTransferDay: [
					{ required: true, message: '请选择金银币清零日期', trigger: 'change' },
				],
				silver2moneyPercent: [
					{ required: true, validator: validatorNumber, trigger: 'blur' },
				],
				gold2moneyPercent: [
					{ required: true, validator: validatorNumber, trigger: 'blur' },
				],
				firstShoppingReturnMoney: [
					{ required: true, validator: validatorNumber, trigger: 'blur' },
				],
				levelReturnFlag: [{ required: true, message: '请选择等级返现', trigger: 'blur' }],
				twoLevelUpConditionMoney: [
					{ required: true, validator: validatorNumber, trigger: 'blur' },
				],
				oneLevelUpConditionMoney: [
					{ required: true, validator: validatorNumber, trigger: 'blur' },
				],
			},
			tableData: [
				{ grade: '二级经销商', condition: '' },
				{ grade: '一级经销商', condition: '' },
			],

			dialogFormVisible: false,
			oneLeveVisible: false,
			isShow: false,
		};
	},
	computed: {
		options() {
			let options = [];
			for (let i = 1; i < 29; i++) {
				// options.push(`${i}号`)
				options.push(i);
			}
			return options;
		},
	},
	mounted() {
		this.initData();
	},
	methods: {
		// 初始化数据
		initData() {
			getDistributorRule().then(res => {
				if (res.success) {
					this.RuleForm = res.data;

					if (res.data.oneLevelUpConditionMoney) {
						this.checked1 = true;
					} else {
						this.checked1 = false;
					}
					if (res.data.oneLevelUpConditionFans) {
						this.checked2 = true;
					} else {
						this.checked2 = false;
					}
				}
			});
		},
		// 格式化表格中的升级条件
		formatterCondition(row, column) {
			if (row.grade === '二级经销商') {
				return `${moneyFormat(this.RuleForm.twoLevelUpConditionMoney)}元（购物金额）`;
			} else {
				let _str = '';
				if (this.RuleForm.oneLevelUpConditionMoney) {
					_str += `${moneyFormat(this.RuleForm.oneLevelUpConditionMoney)}元（收益金额）`;
				}
				if (this.RuleForm.oneLevelUpConditionFans) {
					_str += `${this.RuleForm.oneLevelUpConditionFans}人直属粉丝`;
				}
				return _str;
			}
		},
		// 分销商升级规则修改事件
		onClickEdit(row) {
			if (row.grade === '二级经销商') {
				this.dialogFormVisible = true;
				this.twoLevelForm.twoLevelUpConditionMoney = this.RuleForm.twoLevelUpConditionMoney;
			} else {
				this.oneLeveVisible = true;
				this.oneLevelForm.oneLevelUpConditionMoney = this.RuleForm.oneLevelUpConditionMoney;
				this.oneLevelForm.oneLevelUpConditionFans = this.RuleForm.oneLevelUpConditionFans;
				// this.$refs['oneLevelForm'].clearValidate();
			}
		},
		// 分销规则保存事件
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					editDistributorRule({ ...this.RuleForm }).then(res => {
						this.isShow = false;
						Message.success('修改成功！！！');
						this.initData();
					});
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		// 修改二级分销商升级规则确定事件
		onClickOneLevel(formName) {
			this.$refs[formName].validate(valid => {
				this.RuleForm.oneLevelUpConditionMoney = this.oneLevelForm.oneLevelUpConditionMoney;
				this.RuleForm.oneLevelUpConditionFans = this.oneLevelForm.oneLevelUpConditionFans;
				if (!this.checked1 && !this.checked2) {
					Message.error('请至少设置一个规则');
					return;
				} else if (
					this.checked1 &&
					!this.checked2 &&
					this.RuleForm.oneLevelUpConditionMoney.length != 0
				) {
					this.RuleForm.oneLevelUpConditionFans = null;
					let _checkVal = /^[1-9][0-9]{0,}$/.test(this.RuleForm.oneLevelUpConditionMoney);
					if (_checkVal) {
						editDistributorRule({ ...this.RuleForm }).then(res => {
							this.oneLeveVisible = false;
							Message.success('修改成功！！！');
							this.initData();
						});
					}
				} else if (
					!this.checked1 &&
					this.checked2 &&
					this.RuleForm.oneLevelUpConditionFans.length != 0
				) {
					this.RuleForm.oneLevelUpConditionMoney = null;
					let _checkVal = /^[1-9][0-9]{0,}$/.test(this.RuleForm.oneLevelUpConditionFans);
					if (_checkVal) {
						editDistributorRule({ ...this.RuleForm }).then(res => {
							this.oneLeveVisible = false;
							Message.success('修改成功！！！');
							this.initData();
						});
					}
				} else {
					if (valid) {
						editDistributorRule({ ...this.RuleForm }).then(res => {
							this.oneLeveVisible = false;
							Message.success('修改成功！！！');
							this.initData();
						});
					}
				}
			});
		},
		// 修改二级分销商升级规则确定事件
		onClickTwoLevel(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.RuleForm.twoLevelUpConditionMoney = this.twoLevelForm.twoLevelUpConditionMoney;
					this.dialogFormVisible = false;
					Message.success('修改成功！！！');
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
	},
};
</script>
<style>
.el-form-item__error {
	top: 90%;
}
.el-form-item__content {
	margin-top: 20px;
	position: relative;
	top: -20px;
}
</style>

<style lang="scss" scoped>
.distrbutorRule {
	padding: 20px;
	.oneLevelForm {
		.el-form-item {
			margin: 0;
		}
	}
}
.prepend {
	display: flex;
}
</style>
