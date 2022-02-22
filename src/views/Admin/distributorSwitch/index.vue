<!--
 * @Author: wei.chen
 * @Date: 2021-05-11 15:57:49
 * @LastEditTime: 2021-05-11 15:57:49
 * @LastEditors: wei.chen
 * @Description: 分销开关 
 * 目前这模块没有被使用
-->
<template>
	<div class="distributorSwitch">
		<el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
			<el-form-item label="平台" prop="platform">
				<el-select v-model.trim="formInline.platform" placeholder="请选择平台" size="small">
					<el-option
						v-for="item in platform"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="渠道" prop="market">
				<el-select v-model.trim="formInline.market" placeholder="请选择状态" size="small">
					<el-option
						v-for="item in market"
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
			新增渠道
		</el-button>
		<Table :loadData="getList" ref="Table" :column="column" />
		<el-dialog
			title="新增渠道"
			:visible.sync="visible"
			:before-close="() => (visible = false)"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:destroy-on-close="true"
			width="500px"
		>
			<el-form :model="addForm" :rules="addFormRules" ref="addForm">
				<el-form-item prop="platform" label="平台" required>
					<el-select
						v-model.trim="addForm.platform"
						placeholder="请选择平台"
						size="small"
					>
						<el-option
							v-for="item in platform"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
					</el-select>
				</el-form-item>
				<el-form-item prop="market" label="渠道" required>
					<el-select v-model.trim="addForm.market" placeholder="请选择状态" size="small">
						<el-option
							v-for="item in market"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
					</el-select>
				</el-form-item>
				<el-form-item prop="version" label="版本号" required>
					<el-input
						style="width:186px"
						type="number"
						minlength="3"
						maxlength="3"
						max="999"
						min="100"
						v-model.trim="addForm.version"
						placeholder="请输入三位正整数"
					/>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button @click="cancelBtu('addForm')">取 消</el-button>
				<el-button type="primary" @click="createChecks">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { Message } from 'element-ui';
import { parseTime } from '@/utils';
import { getChecks, postChecks, putChecks, deleteCheck, putChecksSwitch } from '@/api/admin';
import Table from '@/components/Table/index';

export default {
	components: {
		Table,
	},
	data() {
		// 每人限购数量验证
		const validateLimitNum = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入数值'));
			} else {
				if (!/^[1-9][0-9]{2}$/.test(value)) {
					callback(new Error('请输入大于100 小于999的数值'));
				} else {
					callback();
				}
			}
		};
		return {
			platform: [
				// { value: "ALL", label: "全部" },
				// { value: "Android", label: "安卓" },
				{ value: 'IOS', label: '苹果' },
			],
			market: [
				// {
				//   value: "ALL",
				//   label: "全部",
				// },
				// {
				//   value: "xiaomi",
				//   label: "小米",
				// },
				// {
				//   value: "360",
				//   label: "360",
				// },
				// {
				//   value: "ali",
				//   label: "阿里",
				// },
				// {
				//   value: "baidu",
				//   label: "百度",
				// },
				// {
				//   value: "oppo",
				//   label: "OPPO",
				// },
				// {
				//   value: "yinyongbao",
				//   label: "应用宝",
				// },
				// {
				//   value: "huawei",
				//   label: "华为",
				// },
				{
					value: 'APPSTORE',
					label: 'APPSTORE',
				},
			],
			formInline: {
				platform: '',
				market: '',
			},
			addForm: {
				platform: '',
				market: '',
				version: '',
			},
			addFormRules: {
				market: [{ required: true, message: '请选择' }],
				platform: [{ required: true, message: '请选择' }],
				version: [
					{ required: true, message: '请输入三位正整数' },
					{
						validator: validateLimitNum,
						required: true,
						trigger: 'blur',
					},
				],
			},
			visible: false,
			column: [
				{ prop: 'id', label: '序号' },
				{ prop: 'platform', label: '平台' },
				{ prop: 'market', label: '渠道' },
				{ prop: 'version', label: '版本号' },
				{
					prop: 'updateTime',
					label: '更新时间',
					formatter: (row, column) => {
						return parseTime(row.createTime);
					},
				},
				{ prop: 'creator', label: '操作人' },
				{
					prop: 'passed',
					label: '状态',
					formatter: (row, column, cellValue, index) => {
						return cellValue ? '开启' : '关闭';
					},
				},
				{
					prop: 'time',
					label: '操作',
					actives: [
						{
							name: row => {
								return row.passed ? '关闭' : '开启';
							},
							method: val => {
								let passed = val.passed ? '关闭' : '开启';
								this.$confirm(`确定${passed}账号?`, '提示', {
									type: 'warning',
								}).then(() => {
									putChecksSwitch({ id: val.id }).then(res => {
										if (res.success) {
											this.$message({
												type: 'success',
												message: '操作成功！',
											});
											this.reset();
										}
									});
								});
							},
						},
						{
							name: '删除',
							method: val => {
								this.$confirm('确定删除?', '提示', {
									type: 'warning',
								}).then(() => {
									deleteCheck({ ...val }).then(res => {
										if (res.success) {
											this.$message({
												type: 'success',
												message: '删除成功！',
											});
											this.reset();
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
			return getChecks;
		},
	},
	methods: {
		reset() {
			this.$refs.Table.reset();
		},
		// 添加账号Dialog取消
		cancelBtu(formName) {
			this.$refs[formName].resetFields();
			this.visible = false;
		},
		// 搜索查询
		onClickSearch() {
			this.$refs.Table.update({ ...this.searchParams });
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
		},

		//创建
		createChecks() {
			this.$refs.addForm.validate(valid => {
				if (valid) {
					postChecks(this.addForm).then(res => {
						if (res.success) {
							Message.success('创建成功！！');
							this.visible = false;
							this.reset();
						}
					});
				}
			});
		},
		//编辑
		editChecks() {
			this.$refs.editForm.validate(valid => {
				if (valid) {
					editOperator(this.editForm).then(res => {
						if (res.success) {
							Message.success('修改成功！！');
							this.editVisible = false;
							this.reset();
						}
					});
				}
			});
		},
		handleAdd() {
			this.visible = true;
		},
	},
};
</script>

<style lang="scss" scoped>
.distributorSwitch {
	padding: 20px;
}
</style>
