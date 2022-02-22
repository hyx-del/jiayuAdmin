<!--
 * @Author: wei.chen
 * @Date: 2020-07-17 11:34:49
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-06-19 13:04:55
 * @Descripttion: 签到规则
-->
<template>
	<div class="signManageComp">
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column prop="id" label="序号" width="150">
				<template slot-scope="scope">
					<div>{{ scope.$index + 1 }}</div>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="任务名称">
				<template slot-scope="scope">
					<div>
						{{ scope.row.name }}
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="score" label="获得积分">
				<template slot-scope="scope">
					<div>{{ scope.row.score }}</div>
				</template>
			</el-table-column>
			<el-table-column prop="remark" label="备注">
				<template slot-scope="scope">
					<div>{{ scope.row.remark }}</div>
				</template>
			</el-table-column>
			<el-table-column prop="createTime" label="操作">
				<template slot-scope="scope">
					<el-button type="text" @click="openEditDialog(scope.row)" size="small">
						编辑
					</el-button>
					<el-button type="text" @click="openLogDialog(scope.row)" size="small">
						修改记录
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 编辑 -->
		<el-dialog
			@close="handleClose"
			:title="'编辑'"
			:visible.sync="dialogVisible"
			width="600px"
			custom-class="dialog_content"
			:close-on-click-modal="false"
			destroy-on-close
		>
			<el-form
				:model="configRuleForm"
				:rules="configRuleFormRules"
				ref="configRuleForm"
				label-width="100px"
				class="demo-configRuleForm"
			>
				<el-form-item label="任务名称" prop="name">
					<el-input
						:disabled="true"
						v-model="configRuleForm.name"
						style="width:350px"
						placeholder="请输入"
					></el-input>
				</el-form-item>
				<el-form-item label="获得积分" prop="score">
					<el-input
						v-model="configRuleForm.score"
						maxlength="5"
						style="width:350px"
						placeholder="请输入"
					></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input
						v-model="configRuleForm.remark"
						type="textarea"
						maxlength="200"
						style="width:350px"
						placeholder="请输入"
					></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleClose">取 消</el-button>
				<el-button type="primary" @click="handleOK('configRuleForm')">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog
			title="修改记录"
			@close="logModalClose"
			:visible.sync="logDialogVisible"
			width="75%"
			:close-on-click-modal="false"
		>
			<Table
				v-if="logDialogVisible"
				:params="logQueryInfo"
				:loadData="getSignTaskLogListFun"
				:column="logColumn"
				style="height: 600px; overflow-y: auto"
			></Table>
			<span slot="footer" class="dialog-footer">
				<el-button @click="logModalClose">取 消</el-button>
				<el-button type="primary" @click="logModalClose">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
// import { getOrderRule, editOrderRule } from '@/api/order';

import { getSignTaskRule, editSignTaskRule, getSignTaskLogList } from '@/api/taskScore';
import { regInt } from '@/utils/reg';
import { parseTime } from '@/utils/index';
import { Message } from 'element-ui';
import Table from '@/components/Table/index';

export default {
	name: 'signManageComp',
	components: { Table },
	data() {
		// 正整数校检 validator
		const validatorNumberInt = (rule, value, callback) => {
			let _checkVal = regInt.test(value);
			if (value === '') {
				callback(new Error('请请输入整数'));
			} else if (!_checkVal) {
				return callback(new Error('请输入整数'));
			} else if (value > 90000) {
				return callback(new Error('请输入不超过90000的数字'));
			} else {
				callback();
			}
		};
		return {
			logDialogVisible: false,

			dialogVisible: false,

			configRuleForm: {},
			configRuleFormRules: {
				remark: [
					{ required: false, message: '请输入时间范围', trigger: 'blue', maxlength: 200 },
				],

				score: [{ required: true, validator: validatorNumberInt, trigger: 'blur' }],
			},

			tableData: [],
			logQueryInfo: {},
			// 操作记录
			logColumn: [
				{
					prop: 'username',
					label: '修改人',
				},
				{
					prop: 'createTime',
					label: '操作时间',
					formatter: (row, column) => {
						return parseTime(row.createTime);
					},
				},
				{ prop: 'scoreAfter', label: '修改分数' },
			],
		};
	},
	computed: {
		getSignTaskLogListFun() {
			return getSignTaskLogList;
		},
	},
	mounted() {
		this.initData();
	},
	methods: {
		openLogDialog(item) {
			this.logQueryInfo = { scoreTaskId: item.id };
			this.logDialogVisible = true;
		},
		logModalClose() {
			this.logDialogVisible = false;
		},
		handleClose() {
			this.$refs['configRuleForm'].resetFields();

			this.dialogVisible = false;
		},

		// 初始化数据
		initData() {
			this.getTableList();
		},
		getTableList() {
			getSignTaskRule({}).then(res => {
				if (res.code === 200) {
					this.tableData = res.data;
				}
			});
		},
		handleOK(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					// 判断金额大小
					let _tempObj = { ...this.configRuleForm };
					// 编辑
					editSignTaskRule(_tempObj).then(res => {
						if (res.code === 200) {
							this.handleClose();
							this.getTableList();
							this.$message.success('操作成功');
						} else {
							this.$message.error(res.msg);
						}
					});
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		openEditDialog(item) {
			let _tempItem = { ...item };

			this.configRuleForm = _tempItem;
			this.dialogVisible = true;
		},

		// 打开dialogWindow
		submitForm(formName) {
			this.dialogVisible = true;
		},
	},
};
</script>

<style lang="scss" scoped>
.signManageComp {
	padding: 20px;
	.card_main {
		display: flex;
		.card_main_item {
			width: 360px;
			margin-left: 24px;
			font-size: 16px;
			.item_title {
				font-weight: bold;
			}
		}
	}
}
</style>
