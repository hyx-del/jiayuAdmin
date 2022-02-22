<!--
 * @Author: wei.chen
 * @Date: 2020-09-29 15:18:54
 * @LastEditTime: 2021-02-23 15:27:38
 * @LastEditors: wei.chen
 * @Description: 操作日志
-->
<template>
	<div class="operationLog">
		<el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
			<el-form-item label="操作人姓名:" prop="operator">
				<el-input
					v-model.trim="formInline.operator"
					placeholder="输入操作人姓名"
					size="small"
				></el-input>
			</el-form-item>
			<el-form-item label="操作类型:" prop="type">
				<el-select v-model.trim="formInline.type" placeholder="请选择操作类型" size="small">
					<el-option
						v-for="item in typeList"
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
		<Table :loadData="getList" ref="Table" :column="column" :params="{ type: 'DISTRIBUTOR' }">
			<template v-slot:content="{ scope }">
				<div
					style="text-align: left;"
					v-html="scope.content.replace(/\\n/gi, '<br />')"
				></div>
			</template>
		</Table>
	</div>
</template>

<script>
import { getLogList } from '@/api/admin';
import { parseTime } from '@/utils';
import Table from '@/components/Table/index';

export default {
	components: {
		Table,
	},
	data() {
		return {
			typeList: [
				{
					value: 'DISTRIBUTOR',
					label: '分销',
				},
				{
					value: 'WITHDRAW',
					label: '提现',
				},
				{
					value: 'ORDER',
					label: '订单',
				},
				{
					value: 'ITEM',
					label: '商品运费',
				},
				{
					value: 'CLEAR_BALANCE',
					label: '清空余额',
				},
				{
					value: 'CLEAR_WITHDRAW',
					label: '清空提现',
				},
			],
			formInline: {
				operator: '',
				type: 'DISTRIBUTOR',
			},
			column: [
				{
					prop: 'createTime',
					label: '记录时间',
					formatter: (row, column) => {
						return parseTime(row.createTime);
					},
					width: '100',
				},
				{
					prop: 'type',
					label: '操作菜单',
					formatter: (row, column) => {
						return this.enumMap(row.type);
					},
					width: '100',
				},
				{
					prop: 'content',
					label: '操作内容',
					align: 'left',
					render: true,
				},
				{
					prop: 'operator',
					label: '操作人',
					width: '100',
				},
			],
		};
	},
	computed: {
		getList() {
			return getLogList;
		},
	},
	methods: {
		// 搜索查询
		onClickSearch() {
			this.$refs.Table.update({ ...this.formInline });
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
		},
		enumMap(val) {
			let _str = '';
			switch (val) {
				case 'DISTRIBUTOR':
					_str = '分销';
					break;
				case 'WITHDRAW':
					_str = '提现';
					break;
				case 'ORDER':
					_str = '订单';
					break;
				case 'ITEM':
					_str = '商品运费';
					break;

				default:
					break;
			}
			return _str;
		},
	},
};
</script>

<style lang="scss" scoped>
.operationLog {
	padding: 20px;
}
</style>
