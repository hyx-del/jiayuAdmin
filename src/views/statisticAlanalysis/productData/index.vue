<!--
 * @Author: wei.chen
 * @Date: 2020-07-17 12:06:23
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-07-15 11:13:30
 * @Descripttion: 
-->
<template>
	<div class="distributorExamine">
		<!-- 查询搜索 -->
		<el-form :inline="true" :model="searchfrom" ref="searchForm" class="demo-form-inline">
			<el-form-item prop="itemName" label="商品名称">
				<el-input
					v-model.trim="searchfrom.itemName"
					size="small"
					placeholder="请输入商品名称"
					prefix-icon="el-icon-search"
				></el-input>
			</el-form-item>
			<el-form-item prop="itemNo" label="商品货号">
				<el-input
					v-model.trim="searchfrom.itemNo"
					placeholder="请输入商品编码"
					prefix-icon="el-icon-search"
					size="small"
				></el-input>
			</el-form-item>
			<el-form-item label="品类" prop="catName">
				<el-cascader
					:props="catProps"
					v-model.trim="searchfrom.catName"
					clearable
					size="small"
					@change="onChange"
				></el-cascader>
			</el-form-item>
			<el-form-item label="选择时间范围" prop="time">
				<el-date-picker
					v-model="searchfrom.time"
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					size="small"
					:default-time="['00:00:00', '23:59:59']"
					value-format="timestamp"
					@change="onChangeTime"
				></el-date-picker>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="onClickSearch" size="small">查询</el-button>
				<el-button type="primary" @click="resetForm('searchForm')" size="small">
					重置
				</el-button>
			</el-form-item>
		</el-form>

		<!-- 表格 -->
		<Table @sortChangechild="sortChange" :loadData="getList" :column="column" ref="TableList">
			<template v-slot:itemImg="{ scope }">
				<el-image
					:src="scope.itemImg"
					style="width:100px;"
					class="admin_avater"
					:preview-src-list="[scope.itemImg]"
				/>
			</template>
		</Table>
	</div>
</template>

<script>
import Table from '@/components/Table/index';
import { parseTime } from '@/utils';
import { Message } from 'element-ui';

import { getAllCat } from '@/api/cat';
import { getItemPointList } from '@/api/statisticAlanalysis';

export default {
	name: 'distributorExamine',
	components: {
		Table,
	},
	data() {
		return {
			catProps: {
				lazy: true,
				lazyLoad(node, resolve) {
					const { level } = node;
					if (!node.data) {
						getAllCat({ size: 100 }).then(res => {
							const nodes = Array.from(res.data.list).map(item => {
								return {
									value: item.id,
									label: item.name,
									leaf: level >= 1,
								};
							});
							resolve(nodes);
						});
					} else {
						getAllCat({ parentId: node.data.value, size: 100 }).then(res => {
							const nodes = Array.from(res.data.list).map(item => {
								return {
									value: item.id,
									label: item.name,
									leaf: level >= 1,
								};
							});
							resolve(nodes);
						});
					}
				},
			},
			searchfrom: {
				dayStart: null, // 注册开始时间
				dayEnd: null, // 注册结束时间
				itemName: null, //  真实姓名
				itemNo: null,
				catId: null, // 二级类目id
				time: [],
				sortField: '',
			},
			column: [
				{
					prop: 'itemImg',
					label: '商品图片',
					render: true,
				},
				{
					prop: 'itemName',
					label: '商品名称',
				},
				{
					prop: 'itemNo',
					label: '商品货号',
				},

				{
					prop: 'catName',
					label: '品类',
					formatter: (row, column) => {
						return `${row.itemParentCatName}-${row.itemCatName}`;
					},
				},
				{
					prop: 'viewTotalSeconds',
					label: '浏览次数',
					sortable: true,
				},
				{
					prop: 'viewTimes',
					label: '平均浏览时长',
					sortable: true,
					formatter: (row, column) => {
						if (row.viewTotalSeconds == 0) {
							return '--';
						} else {
							return (row.viewTimes / row.viewTotalSeconds).toFixed(2) + 's';
						}
					},
				},
				{
					prop: 'shareTimes',
					label: '分享次数',
					sortable: true,
				},
				{
					prop: 'shopCartTimes',
					label: '加购次数',
					sortable: true,
				},
			],

			rules: {
				remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
			},
		};
	},
	computed: {
		getList() {
			return getItemPointList;
		},
	},
	mounted() {},
	methods: {
		onChange(value) {
			console.log(value);
			this.searchfrom.catId = value[1];
			// delete this.searchfrom.catName
		},
		// 选择时间
		onChangeTime(val) {
			console.log(val);
			if (val) {
				this.searchfrom.dayStart = val[0];
				this.searchfrom.dayEnd = val[1];
				this.$forceUpdate(); // vue 强制同步数据的方法
			} else {
				this.searchfrom.dayStart = null;
				this.searchfrom.dayEnd = null;
			}
		},
		// 查询搜索事件
		onClickSearch() {
			this.$refs.TableList.update({ ...this.searchfrom });
		},
		// 重置事件
		resetForm(formName) {
			this.$refs[formName].resetFields();
			console.log('======>>this.searchfrom', this.searchfrom);
			this.searchfrom.dayStart = null;
			this.searchfrom.dayEnd = null;
		},
		sortChange(val) {
			console.log(val);
			if (val.prop == 'viewTotalSeconds') {
				this.searchfrom.sortField = 'TIMES';
			} else if (val.prop == '"viewTimes"') {
				this.searchfrom.sortField = 'AVERAGE';
			} else if (val.prop == 'shareTimes') {
				this.searchfrom.sortField = 'SHARE';
			} else if (val.prop == 'shopCartTimes') {
				this.searchfrom.sortField = 'ADD_CART';
			}

			if (val.order == 'ascending') {
				this.searchfrom.sortWay = 'ASC';
			} else if (val.order == 'descending') {
				this.searchfrom.sortWay = 'DESC';
			} else {
				delete this.searchfrom.sortField;
				delete this.searchfrom.sortWay;
			}

			this.$refs.TableList.update({ ...this.searchfrom });
		},
	},
};
</script>

<style lang="scss" scoped>
.distributorExamine {
	padding: 20px;
}
</style>
