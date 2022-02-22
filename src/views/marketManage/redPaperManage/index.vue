<!--
 * @Author: wei.chen
 * @Date: 2020-09-29 10:46:28
 * @LastEditTime: 2020-10-30 18:06:52
 * @LastEditors: wei.chen
 * @Description: 红包管理
-->
<template>
	<div class="redPaperManage">
		<el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
			<el-form-item label="适用渠道" prop="source">
				<el-select v-model.trim="formInline.source" placeholder="请选择状态" size="small">
					<el-option
						v-for="item in plantFormList"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-select v-model.trim="formInline.status" placeholder="请选择状态" size="small">
					<el-option
						v-for="item in status"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="类型" prop="type">
				<el-select v-model.trim="formInline.type" placeholder="请选择类型" size="small">
					<el-option
						v-for="item in type"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
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
			添加
		</el-button>
		<Table
			:loadData="getList"
			:column="column"
			ref="redPaperManageList"
			:params="{ status: '' }"
		></Table>
		<el-dialog
			title="添加红包"
			:visible.sync="visible"
			:before-close="
				() => {
					resetForm('redPaperForm');
				}
			"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:destroy-on-close="true"
			width="600px"
		>
			<el-form :model="redPaperForm" :rules="redPaperFormRules" ref="redPaperForm">
				<el-form-item prop="name" label="红包名称">
					<el-input
						v-model="redPaperForm.name"
						style="width:396px"
						maxlength="16"
					></el-input>
				</el-form-item>
				<el-form-item prop="source" label="适用渠道">
					<el-checkbox-group v-model="redPaperForm.source">
						<el-checkbox label="APP" name="source" checked></el-checkbox>
						<el-checkbox label="微信小程序" name="source"></el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<!-- <el-form-item prop="type" label="类型" required>
					<el-checkbox-group v-model="redPaperForm.type">
						<el-checkbox label="拉新红包" name="type" checked></el-checkbox>
					</el-checkbox-group>
				</el-form-item> -->
				<el-form-item prop="dateTimeInterval" label="时间范围">
					<el-date-picker
						v-model="redPaperForm.dateTimeInterval"
						type="datetimerange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						value-format="timestamp"
						format="yyyy-MM-dd HH:mm"
						:picker-options="begPickerOptions"
					/>
				</el-form-item>
				<!-- <el-form-item prop="endTime" label="结束时间">
					<el-date-picker
						type="datetime"
						format="yyyy-MM-dd HH:mm"
						v-model="redPaperForm.endTime"
						value-format="timestamp"
					/>
				</el-form-item> -->
				<el-form-item prop="content" label="红包内容">
					<el-checkbox-group disabled v-model="redPaperForm.content">
						<el-checkbox label="现金红包" name="content" checked></el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item prop="money" label="现金金额">
					<el-input v-model="redPaperForm.money" placeholder="最大不可超过100正整数">
						<template slot="append">
							元
						</template>
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button @click="resetForm('redPaperForm')">取 消</el-button>
				<el-button type="primary" @click="createRedPackFun()">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog
			title="编辑红包"
			:visible.sync="editVisible"
			:before-close="
				() => {
					resetForm('redPaperFormEdit');
				}
			"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:destroy-on-close="true"
			width="600px"
		>
			<el-form :model="redPaperFormEdit" :rules="redPaperFormRules" ref="redPaperFormEdit">
				<el-form-item prop="name" label="红包名称">
					<el-input
						style="width:396px"
						:disabled="isBegin"
						v-model="redPaperFormEdit.name"
						maxlength="16"
					></el-input>
				</el-form-item>
				<el-form-item prop="source" label="适用渠道">
					<el-checkbox-group :disabled="isBegin" v-model="redPaperFormEdit.source">
						<el-checkbox label="APP" name="source"></el-checkbox>
						<el-checkbox label="微信小程序" name="source"></el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<!-- <el-form-item prop="type" label="类型" required>
					<el-checkbox-group :disabled="isBegin" v-model="redPaperFormEdit.type">
						<el-checkbox label="拉新红包" name="type" checked></el-checkbox>
					</el-checkbox-group>
				</el-form-item> -->
				<el-form-item prop="dateTimeInterval" label="时间范围">
					<el-date-picker
						:disabled="isBegin"
						v-model="redPaperFormEdit.dateTimeInterval"
						type="datetimerange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						value-format="timestamp"
						format="yyyy-MM-dd HH:mm"
						:picker-options="begPickerOptions"
					/>
				</el-form-item>
				<!-- <el-form-item prop="endTime" label="结束时间">
					<el-date-picker
						:disabled="isBegin"
						type="datetime"
						v-model="redPaperFormEdit.endTime"
						value-format="timestamp"
						format="yyyy-MM-dd HH:mm"
						:picker-options="endPickerOptions"
					/>
				</el-form-item> -->
				<el-form-item prop="content" label="红包内容">
					<el-checkbox-group disabled v-model="redPaperFormEdit.content">
						<el-checkbox label="现金红包" name="content" checked></el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item prop="money" label="现金金额">
					<el-input v-model="redPaperFormEdit.money" placeholder="最大不可超过100正整数">
						<template slot="append">
							元
						</template>
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button @click="resetForm('redPaperFormEdit')">取 消</el-button>
				<el-button type="primary" @click="editRedPackFun()">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import {
	getRedPack,
	postRedPack,
	putRedPack,
	deleteRedPack,
	terminationRedPack,
} from '@/api/redPack';
import Table from '@/components/Table/index';
import { Message } from 'element-ui';
import { parseTime } from '@/utils';
export default {
	name: 'redPaperManage',
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
					callback(new Error('请输入最大不可超过100正整数'));
				}
				value = value * 1;
				if (value >= 1 && value <= 100) {
					callback();
				} else {
					callback(new Error('请输入最大不可超过100正整数'));
				}
			}
		};
		return {
			visible: false,
			editVisible: false,
			isBegin: false, // 当前编辑的时候活动是否已经开始
			formInline: {
				source: '',
				status: '',
				type: 1,
			},
			begPickerOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 8.64e7; //如果没有后面的-8.64e7就是不可以选择今天的
				},
			},

			plantFormList: [
				{ value: '', label: '全部' },
				{ value: 'MINI', label: '微信小程序' },
				{ value: 'APP', label: 'APP' },
			],
			status: [
				{ value: '', label: '全部' },
				{ value: 'NOT_STARTED', label: '未开始' },
				{ value: 'UNDERWAY', label: '进行中' },
				{ value: 'FINISHED', label: '已结束' },
			],
			type: [{ value: 1, label: '全部' }, { value: 2, label: '拉新红包' }],
			column: [
				{
					prop: 'createTime',
					label: '创建时间',
					formatter: (row, column) => {
						return parseTime(row.createTime);
					},
				},
				{ prop: 'name', label: '红包名称' },
				{
					prop: 'source',
					label: '适用渠道',
					formatter: (row, column) => {
						let _str = '';
						switch (row.source) {
							case 'MINI_APP':
								_str = '微信小程序、APP';
								break;
							case 'MINI':
								_str = '微信小程序';
								break;
							case 'APP':
								_str = 'APP';
								break;

							default:
								_str = '';
								break;
						}
						return _str;
					},
				},
				// { prop: 'type', label: '类型' },
				{
					prop: 'fullPrice',
					label: '内容',
					formatter: (row, column) => {
						return `${row.money}元现金`;
					},
				},
				{
					prop: 'startTime',
					label: '开始时间',
					formatter: (row, column) => {
						return parseTime(row.startTime);
					},
				},
				{
					prop: 'endTime',
					label: '结束时间',
					formatter: (row, column) => {
						return parseTime(row.endTime);
					},
				},
				{
					prop: 'termination',
					label: '状态',
					formatter: (row, column) => {
						return this.getStateInfo(row);
					},
				},
				{
					prop: 'creator',
					label: '创建人',
				},
				{
					prop: 'actives',
					label: '操作',
					actives: [
						{
							name: row => {
								const _tempStr = this.getStateInfo(row);
								if (_tempStr === '未开始') {
									return '移除';
								} else {
									return false;
								}
							},
							method: val => {
								this.$confirm('确定移除?', '提示', {
									type: 'warning',
								}).then(() => {
									deleteRedPack({ id: val.id }).then(res => {
										if (res.success) {
											this.$message({
												type: 'success',
												message: '移除成功！',
											});
											this.$refs.redPaperManageList.reset();
										}
									});
								});
							},
						},
						{
							name: row => {
								const _tempStr = this.getStateInfo(row);
								if (_tempStr === '进行中') {
									return '终止';
								} else {
									return false;
								}
							},
							method: val => {
								this.$confirm('确定终止?', '提示', {
									type: 'warning',
								}).then(() => {
									terminationRedPack({ id: val.id }).then(res => {
										if (res.success) {
											this.$message({
												type: 'success',
												message: '终止成功！',
											});
											this.$refs.redPaperManageList.reset();
										}
									});
								});
							},
						},
						{
							name: row => {
								const _tempStr = this.getStateInfo(row);
								if (_tempStr !== '已结束') {
									return '编辑';
								} else {
									return false;
								}
							},
							method: val => {
								const _tempVal = { ...val };
								const _str = this.getStateInfo(_tempVal);
								//  ;
								if (_str === '进行中') {
									this.isBegin = true;
								} else {
									this.isBegin = false;
								}
								this.editVisible = true;
								//  ;
								this.redPaperFormEdit = _tempVal;
								this.redPaperFormEdit.dateTimeInterval = [
									_tempVal.startTime,
									_tempVal.endTime,
								];
								switch (_tempVal.source) {
									case 'MINI_APP':
										this.redPaperFormEdit.source = ['微信小程序', 'APP'];
										break;
									case 'MINI':
										this.redPaperFormEdit.source = ['微信小程序'];
										break;
									case 'APP':
										this.redPaperFormEdit.source = ['APP'];
										break;

									default:
										break;
								}
								// if (_tempVal.source === 'MINI_APP') {
								// 	this.redPaperFormEdit.source = ['微信小程序', 'APP'];
								// } else {
								// 	this.redPaperFormEdit.source = [_tempVal.source];
								// }

								this.redPaperFormEdit.type = [1];
								this.redPaperFormEdit.content = ['现金红包'];
								console.log(this.redPaperFormEdit);
							},
						},
						{
							name: '详情',
							method: val => {
								// console.log(val)
								this.$router.push({
									path: 'redPaperDetail',
									query: { id: val.id },
								});
							},
						},
					],
				},
			],
			redPaperForm: {
				name: '',
				source: [],
				type: [],
				dateTimeInterval: null,
				endTime: '',
				content: ['现金红包'],
				money: '',
			},
			redPaperFormEdit: {
				id: null,
				name: '',
				source: [],
				type: [],
				dateTimeInterval: null,
				endTime: '',
				content: ['现金红包'],
				money: '',
			},
			redPaperFormRules: {
				name: [{ required: true, trigger: 'blur', message: '红包名称不能为空！' }],
				source: [{ required: true, trigger: 'blur', message: '渠道不能为空！' }],
				type: [{ required: true, trigger: 'blur', message: '红包类型不能为空！' }],
				dateTimeInterval: [{ required: true, trigger: 'blur', message: '时间范围必选！' }],
				// endTime: [{ required: true, trigger: 'blur', message: '结束时间不能为空！' }],
				content: [{ required: true, trigger: 'blur', message: '红包内容不能为空！' }],
				money: [
					{ required: true, trigger: 'blur', message: '金额不能为空！' },
					{
						validator: validateLimitNum,
						required: true,
						trigger: 'blur',
					},
				],
			},
		};
	},
	computed: {
		getList() {
			return getRedPack;
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
			this.$refs.redPaperForm.resetFields();
			this.redPaperForm = {
				name: '',
				source: [],
				type: [],
				dateTimeInterval: null,
				endTime: '',
				content: ['现金红包'],
				money: '',
			};
		},
		resetEditForm() {
			this.$refs.redPaperFormEdit.resetFields();
			this.redPaperFormEdit = {
				id: null,
				name: '',
				source: [],
				type: [],
				dateTimeInterval: null,
				endTime: '',
				content: ['现金红包'],
				money: '',
			};
		},
		// 添加活动
		handleAdd() {
			this.visible = true;
		},

		// 查询
		onClickSearch() {
			// console.log('======>', this.formInline)
			this.$refs.redPaperManageList.update({ ...this.formInline });
		},
		// 查询的重置事件
		resetForm(formName) {
			this.$refs[formName].resetFields();
			if (formName === 'redPaperForm') {
				this.resetCreateForm();
			} else {
				this.resetEditForm();
			}

			this.visible = false;
			this.editVisible = false;
			// console.log(this.formInline);
		},
		createRedPackFun() {
			this.$refs.redPaperForm.validate(valid => {
				if (valid) {
					let tempPar = { ...this.redPaperForm };
					if (tempPar.source.length === 2) {
						tempPar.source = 'MINI_APP';
					} else if (tempPar.source[0] === 'APP') {
						tempPar.source = 'APP';
					} else if (tempPar.source[0] === '微信小程序') {
						tempPar.source = 'MINI';
					}
					//
					tempPar.startTime = tempPar.dateTimeInterval[0];
					tempPar.endTime = tempPar.dateTimeInterval[1];
					if (tempPar.startTime >= tempPar.endTime) {
						Message.error('开始时间和结束时间不能相同');
						return false;
					}
					tempPar.money = tempPar.money * 1;
					tempPar.content = ['现金红包'];
					postRedPack(tempPar).then(res => {
						if (res.success) {
							Message.success('创建成功！！');
							this.visible = false;
							// 数据清空
							this.$refs.redPaperManageList.reset();
							this.resetCreateForm();
						}
					});
				}
			});
		},
		editRedPackFun() {
			this.$refs.redPaperFormEdit.validate(valid => {
				if (valid) {
					let tempPar = { ...this.redPaperFormEdit };

					if (tempPar.source.length === 2) {
						tempPar.source = 'MINI_APP';
					} else if (tempPar.source[0] === 'APP') {
						tempPar.source = 'APP';
					} else if (tempPar.source[0] === '微信小程序') {
						tempPar.source = 'MINI';
					}
					//
					tempPar.startTime = tempPar.dateTimeInterval[0];
					tempPar.endTime = tempPar.dateTimeInterval[1];
					if (tempPar.startTime >= tempPar.endTime) {
						Message.error('开始时间和结束时间不能相同');
						return false;
					}
					tempPar.money = tempPar.money * 1;
					tempPar.content = ['现金红包'];
					putRedPack(tempPar).then(res => {
						if (res.success) {
							Message.success('编辑成功！！');
							this.editVisible = false;
							this.$refs.redPaperManageList.reset();
							this.resetEditForm();
						}
					});
				}
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.redPaperManage {
	padding: 20px;
}
</style>
