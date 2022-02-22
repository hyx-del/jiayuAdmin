<!--
 * @Author: wei.chen
 * @Date: 2020-06-30 18:25:42
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-05-12 15:30:37
 * @Descripttion: 
-->
<template>
	<div class="refundSause">
		<el-button icon="el-icon-plus" type="primary" size="small" @click="addReasonBtu">
			添加
		</el-button>
		<Table :loadData="getList" :column="column" ref="refundReasonsList" />
		<el-dialog
			:title="dialogTitle"
			center
			:visible.sync="dialogVisible"
			v-if="dialogVisible"
			width="300px"
			:before-close="handleClose"
			:close-on-click-modal="false"
		>
			<el-form
				:model="reasonForm"
				ref="reasonForm"
				:rules="rules"
				label-position="top"
				label-width="100px"
				class="refundSause_dynamic"
			>
				<el-form-item prop="reason" label="">
					<el-input
						v-model.trim="reasonForm.reason"
						maxlength="10"
						style="width:300px"
						placeholder="最多输入10位中文字符"
					></el-input>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="submitForm('reasonForm')">
						确定
					</el-button>
				</el-form-item>
			</el-form>
			<!-- <span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
			</span> -->
		</el-dialog>
	</div>
</template>

<script>
import Table from '@/components/Table/index';
import { parseTime } from '@/utils';
import { Message } from 'element-ui';
import {
	getRefundReasonsList,
	addRefundReasons,
	editRefundReasons,
	deleteRefundReasons,
	orderCancelReason,
	addOrderCancelReason,
	putOrderCancelReason,
	detOrderCancelReason,
} from '@/api/refundReasons';
export default {
	name: 'cancelthereason',
	components: {
		Table,
	},
	data() {
		const validatorReason = (rule, value, callback) => {
			if (!value) {
				callback(new Error('请输入售后原因'));
			} else {
				if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
					callback(new Error('请输入中文字符'));
				} else {
					callback();
				}
			}
		};
		return {
			dialogTitle: '',
			dialogVisible: false,
			reasonForm: { reason: '' },
			rules: {
				reason: [
					{
						validator: validatorReason,
						required: true,
						trigger: 'blur',
					},
				],
			},
			column: [
				{ prop: 'id', label: '编号' },
				{ prop: 'reason', label: '原因' },
				{
					prop: 'createTime',
					label: '添加时间',
					formatter: (row, column) => {
						return parseTime(row.createTime);
					},
				},

				{ prop: 'creator', label: '添加操作人' },
				{
					prop: 'actives',
					label: '操作',
					actives: [
						{
							name: '编辑',
							method: val => {
								this.dialogTitle = '编辑原因';
								this.dialogVisible = true;
								this.reasonForm = { ...val };
							},
						},
						{
							name: '删除',
							method: val => {
								this.$confirm('确定删除?', '提示', {
									type: 'warning',
								}).then(() => {
									detOrderCancelReason({ id: val.id }).then(res => {
										if (res.success) {
											this.$message({
												type: 'success',
												message: '删除成功!!',
											});
											this.resetList();
										}
									});
								});
							},
						},
					],
				},
			],
		};
	},
	computed: {
		getList() {
			return orderCancelReason;
		},
	},
	methods: {
		// 添加退货原因模态窗事件
		addReasonBtu() {
			this.reasonForm.reason = '';
			this.dialogTitle = '填写原因';
			this.dialogVisible = true;
		},
		// 更新表格数据
		resetList() {
			this.$refs.refundReasonsList.reset();
		},
		// 添加/编辑退货原因
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					if (this.dialogTitle === '填写原因') {
						let _data = { reason: this.reasonForm.reason };
						addOrderCancelReason(_data).then(res => {
							if (res.success) {
								Message.success('添加成功！！');
								this.resetList();
								this.$refs[formName].resetFields();
								this.dialogVisible = false;
							}
						});
					} else {
						putOrderCancelReason({ ...this.reasonForm }).then(res => {
							if (res.success) {
								Message.success('修改成功！！');
								this.resetList();
								this.$refs[formName].resetFields();
								this.dialogVisible = false;
							}
						});
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		// 关闭模态窗
		handleClose() {
			this.reasonForm.reason = '';
			this.dialogVisible = false;
		},
	},
};
</script>

<style lang="scss" scoped>
.refundSause {
	padding: 20px;
}
.refundSause_dynamic {
	text-align: center;
	.el-form-item__error {
		right: 0;
	}
}
</style>
