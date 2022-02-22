<!--
 * @Author: wei.chen
 * @Date: 2020-08-13 16:28:12
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-11-10 16:32:47
 * @Descripttion:
-->
<!---->
<template>
	<div class="versionManage">
		<!-- 搜索查询 -->
		<el-form :inline="true" :model="searchfrom" ref="searchfrom" class="demo-form-inline">
			<el-form-item label="商品名称：">
				<el-input
					v-model.trim="searchfrom.goodName"
					size="small"
					placeholder="请输入"
					prefix-icon="el-icon-search"
				></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="onClickSearchList('searchfrom')">
					查询
				</el-button>
				<el-button type="primary" size="small" @click="resetFormList('searchfrom')">
					重置
				</el-button>
				<!-- 表格 -->
				<el-button type="primary" icon="el-icon-plus" @click="addVers" size="small">
					添加商品
				</el-button>
			</el-form-item>
		</el-form>
		<div>
			<Table :loadData="getList" :column="column" ref="TableList" refHead="searchfrom" :showSortIndex="{ show: true, lable: '序号' }">
				<template v-slot:coverUrl="{ scope }">
					<el-image
						:src="scope.coverUrl"
						:preview-src-list="[scope.coverUrl]"
						style="width:100px"
					/>
				</template>
				<template v-slot:amountMin="{ scope }">
					{{ scope.amountMin }}-{{ scope.amountMax }}
				</template>
			</Table>
		</div>

		<el-dialog
			title="选择商品"
			center
			:visible.sync="productVisible"
			v-if="productVisible"
			@close="productVisible = false"
			custom-class="role_dialog"
			width="50%"
			:close-on-click-modal="false"
		>
			<div style="display: flex;align-items: center;margin: 10px 0">
				<span style="color: red">*</span>
				顺序：
				<el-input
					v-model="form.seq"
					style="width:60%"
					type="number"
					@keyup.enter.native="onClickSearch"
				/>
			</div>
			<el-row :gutter="20">
				<el-col :span="2"><div style="line-height:40px">品类：</div></el-col>
				<el-col :span="6">
					<div>
						<el-select
							v-model="searchfrom.categoryId"
							@change="onClickSearch"
							placeholder="请选择"
						>
							<el-option
								v-for="item in briefData"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							></el-option>
						</el-select>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<el-input
							v-model="searchfrom.goodsName"
							placeholder="请输入内容"
							class="input-with-select"
						>
							<el-button
								slot="append"
								@click="onClickSearch"
								icon="el-icon-search"
							></el-button>
						</el-input>
					</div>
				</el-col>
			</el-row>
			<div class="table">
				<Table
					:loadData="getTable"
					:column="columnProduct"
					:select="handleSelectionChange"
					:headHight="400"
					ref="TableList1"
				>
					<template v-slot:coverUrl="{ scope }">
						<el-image
							:src="scope.coverUrl"
							:preview-src-list="[scope.coverUrl]"
							style="width:100px"
						/>
					</template>
				</Table>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="productVisible = false">取 消</el-button>
				<el-button type="primary" @click="addProduct">确 定</el-button>
			</div>
		</el-dialog>

		<!-- 新增/编辑助教模态窗 -->
		<el-dialog
			title="编辑"
			center
			:visible.sync="editVisible"
			v-if="editVisible"
			@close="resetForm('form')"
			custom-class="role_dialog"
			:close-on-click-modal="false"
		>
			<el-form :model="form" :rules="rules" ref="form" label-position="top">
				<el-form-item label="序号" prop="seq">
					<el-input v-model.trim="form.seq" placeholder="请输入"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="resetForm('form')">取 消</el-button>
				<el-button type="primary" @click="submitForm('form')">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import Table from '@/components/Table/index';
import { Message } from 'element-ui';
import {
	hostSaleList,
	goodsFind,
	getBrief,
	addHostSale,
	delHostSale,
	editHostSale,
} from '@/api/malloperation';
import { parseTime } from '@/utils';
export default {
	components: {
		Table,
	},
	data() {
		return {
			// 搜索查询数据
			searchfrom: {
				goodName: null, // 商品名称
			},
			form: {
				goodsIds: [],
				seq: '',
			},
			id: '',
			rules: {
				seq: [{ required: true, message: '请输入', trigger: 'blur' }],
			},
			productVisible: false,
			editVisible: false,
			briefData: [],
			// 表头
			column: [
				{
					prop: 'goodsName',
					label: '商品名称',
				},
				{
					prop: 'coverUrl',
					label: '商品图片',
					render: true,
				},
				// {
				// 	prop: 'amountMin',
				// 	label: '积分价格',
				// 	render: true,
				// },
				{
					prop: 'goodsStock',
					label: '库存',
				},
				{
					prop: 'seq',
					label: '顺序',
				},
				{
					prop: 'action',
					label: '操作',
					actives: [
						{
							name: '编辑',
							method: val => {
								this.form = val;
								this.editVisible = true;
								this.id = val.id;
							},
						},
						{
							name: '删除',
							method: val => {
								this.$confirm('此操作将永久删除, 是否继续?', '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning',
								}).then(() => {
									delHostSale({ id: val.id }).then(res => {
										if (res.code === 200) {
											this.$message.success('操作成功');
											this.$refs.TableList.reset();
										} else {
											this.$message.error(res.msg);
										}
									});
								});
							},
						},
					],
				},
			],
			columnProduct: [
				{ prop: 'goodsName', label: '商品名称' },
				{ prop: 'coverUrl', label: '商品图片', render: true },
			],
		};
	},
	computed: {
		getList() {
			return hostSaleList;
		},
		getTable() {
			return goodsFind;
		},
	},
	mounted() {
		this.getBrief();
	},
	methods: {
		// 搜索查询
		onClickSearch() {
			console.log(1231231);
			this.$refs.TableList1.update({ ...this.searchfrom });
		},
		// 列表查询
		onClickSearchList() {
			this.$refs.TableList.update({ ...this.searchfrom });
		},
		// 添加活动
		addVers() {
			this.getTable();
			this.productVisible = true;
		},
		// 模态窗取消事件
		resetForm() {
			this.searchfrom = {};
			this.$refs.TableList.update({ ...this.searchfrom });
			this.$refs.TableList1.update({ ...this.searchfrom });
			this.dialogFormVisible = false;
		},
		// 重置列表
		resetFormList() {
			this.searchfrom = {};
			this.$refs.TableList.update({ ...this.searchfrom });
		},
		// 计算状态
		state(data) {
			let date = new Date().getTime();
			if (date < data.startTime) return '未开始';
			if (data.endTime > date && date > data.startTime) return '进行中';
			if (date > data.endTime) return '已结束';
		},
		getBrief() {
			getBrief().then(res => {
				const { code, data } = res;
				if (code === 200) {
					this.briefData = (data || []).map(item => {
						return {
							value: item.id,
							label: item.categoryName,
						};
					});
				}
			});
		},
		handleSelectionChange(val) {
			this.form.goodsIds = val;
		},
		addProduct() {
			if (!this.form.seq) return this.$message.error('请选择顺序');
			if (!this.form.goodsIds.length) return this.$message.error('请选择商品');
			this.form.goodsIds = this.form.goodsIds.map(item => {
				return item.goodsId;
			});
			addHostSale(this.form).then(res => {
				if (res.code === 200) {
					this.productVisible = false;
					this.$message.success('添加成功');
					this.$refs.TableList.reset();
					this.searchfrom = {};
					this.form = {};
				}
			});
		},
		// 模态窗取消事件
		resetForm(formName) {
			this.searchfrom = {};
			this.form = {};
			this.editVisible = false;
		},
		// 模态窗确认保存事件
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					const _par = { seq: this.form.seq, id: this.id };
					editHostSale(_par).then(res => {
						if (res.code === 200) {
							this.editVisible = false;
							Message.success('编辑成功');
							this.$refs.TableList.reset();
						}
					});
				} else {
					return false;
				}
			});
		},
	},
};
</script>
<style lang="scss" scoped>
.versionManage {
	padding: 20px;
	.item {
		width: 45%;
		margin-right: 20px;
		.el-select,
		.el-cascader {
			width: 100%;
		}
	}
	.width_item {
		width: 93%;
		.el-form-item__content {
			width: 100%;
		}
	}
}
.table {
	padding: 20px;
}
</style>
