<!--
 * @Author: wei.chen
 * @Date: 2020-08-13 16:28:12
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-11-10 16:26:05
 * @Descripttion:
-->
<!---->
<template>
	<div class="versionManage">
		<!-- 搜索查询 -->
		<el-form :inline="true" :model="searchfrom" ref="searchfrom" class="demo-form-inline">
			<el-form-item label="状态：" prop="state">
				<el-select size="small" v-model="searchfrom1.isShow" placeholder="选择状态">
					<el-option label="上架" value="true"></el-option>
					<el-option label="下架" value="false"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="onClickSearch('searchfrom')">
					查询
				</el-button>
				<el-button type="primary" icon="el-icon-plus" @click="addVers" size="small">
					添加banner
				</el-button>
			</el-form-item>
		</el-form>
		<!-- 表格 -->

		<Table :loadData="getList" :column="columnbanner" ref="TableList" refHead="searchfrom" :showSortIndex="{ show: true, lable: '序号' }">
			<template v-slot:carouselUrls="{ scope }">
				<el-image
					:src="scope.carouselUrls"
					:preview-src-list="[scope.carouselUrls]"
					style="width:100px;height:auto"
				/>
			</template>
			<template v-slot:isShow="{ scope }">
				{{ scope.isShow ? '上架' : '下架' }}
			</template>
		</Table>

		<!-- 新增/编辑助教模态窗 -->
		<el-dialog
			:title="title"
			center
			:visible.sync="dialogFormVisible"
			v-if="dialogFormVisible"
			@close="resetForm('form')"
			custom-class="role_dialog"
			:close-on-click-modal="false"
		>
			<el-form :model="form" :rules="rules" ref="form" label-position="top">
				<el-form-item label="封面图" prop="carouselUrls">
					<UploadImgDrag
						v-model.trim="form.carouselUrls"
						:size="10000"
						:limit="1"
					></UploadImgDrag>
				</el-form-item>
				<el-form-item label="顺序：" prop="seq">
					<el-input
						v-model.trim="form.seq"
						maxlength="10"
						placeholder="请输入"
					></el-input>
				</el-form-item>
				<el-form-item label="选择开始时间" prop="time">
					<el-date-picker
						v-model="form.startTime"
						type="datetime"
						@change="changStartTime"
						placeholder="选择日期时间"
					></el-date-picker>
				</el-form-item>
				<el-form-item label="选择结束时间" prop="time">
					<el-date-picker
						v-model="form.endTime"
						type="datetime"
						@change="changEndTime"
						placeholder="选择日期时间"
					></el-date-picker>
				</el-form-item>
				<el-form-item label="关联类型">
					<!-- <el-radio-group v-model="form.resource" @change="changeGoods">
						<el-radio label="1">无</el-radio>
						<el-radio label="2">商品</el-radio>
					</el-radio-group> -->
					<div
						class="myRadio"
						v-for="(it, index) of listData"
						:key="it.value"
						:class="{ myRadioCheck: it.value == form.resource }"
						@click="myRadioClick(it, index)"
						:value="it.value"
					>
						{{ it.name }}
					</div>
				</el-form-item>
				<div class="product" v-if="product">
					<img :src="product.coverUrl" alt="" />
					<div>
						<div class="goodsName">{{ product.goodsName }}</div>
						<!-- <div style="margin-top:20px">
							<span>{{ product.amountMin }}</span>
							积分
						</div> -->
					</div>
				</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="resetForm('form')">取 消</el-button>
				<el-button type="primary" @click="submitForm('form')">确 定</el-button>
			</div>
		</el-dialog>

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
			<el-input
				v-model="searchfrom.goodsName"
				placeholder="请输入内容"
				class="input-with-select"
			>
				<el-button slot="append" @click="onClickSearch1" icon="el-icon-search"></el-button>
			</el-input>
			<div style="margin:10px 0">
				<span>品类：</span>
				<el-select
					v-model="searchfrom.categoryId"
					@change="onClickSearch1"
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
			<div class="table">
				<Table
					:loadData="getTable"
					:column="column"
					:select="handleSelectionChange"
					:single="single"
					ref="TableList1"
					style="height:500px;"
				>
					<template v-slot:coverUrl="{ scope }">
						<el-image
							:src="scope.coverUrl"
							:preview-src-list="[scope.coverUrl]"
							style="width:50px;height:50px"
						/>
					</template>
					<template v-slot:amountMin="{ scope }">
						{{ scope.amountMin }}-{{ scope.amountMax }}
					</template>
				</Table>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="productVisible = false">取 消</el-button>
				<el-button type="primary" @click="changeProduct">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import Table from '@/components/Table/index';
import { Message } from 'element-ui';
import { goodsFind, getBrief } from '@/api/malloperation';
import { bannerList, addBanner, delBanner, isShow, editBanner } from '@/api/mall';
import { parseTime } from '@/utils';
import UploadImgDrag from '@/components/uploadDrag';
export default {
	components: {
		Table,
		UploadImgDrag,
	},
	data() {
		return {
			listData: [
				{ value: '1', name: '无' },
				{ value: '2', name: '商品' },
			],
			// 搜索查询数据
			searchfrom: {
				goodName: null, // 商品名称
				categoryId: null, // 活动状态
			},
			form: {
				seq: '',
				resource: '1',
			},
			id: '',
			rules: {
				seq: [{ required: true, message: '请输入', trigger: 'blur' }],
			},
			productVisible: false,
			dialogFormVisible: false,
			searchfrom1: {
				isShow: '',
			},
			briefData: [],
			single: true,
			product: '', //关联商品
			// 表头
			column: [
				{
					prop: 'goodsName',
					label: '商品名称',
				},
				// {
				// 	prop: 'amountMin',
				// 	label: '积分价格',
				// 	render: true,
				// },
				{
					prop: 'coverUrl',
					label: '商品图片',
					render: true,
				},
			],
			columnbanner: [
				{ prop: 'carouselUrls', label: '图片', render: true },
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
				{ prop: 'goodsName', label: '跳转商品' },
				{ prop: 'creator', label: '添加操作人' },
				{ prop: 'seq', label: '顺序' },
				{ prop: 'isShow', label: '上下架', render: true },
				{
					prop: 'action',
					label: '操作',
					actives: [
						{
							name: val => {
								if (val.isShow) {
									return '下架';
								} else {
									return '上架';
								}
							},
							method: val => {
								let data = {
									id: val.id,
									isShow: val.isShow ? false : true,
								};
								isShow(data).then(res => {
									if (res.code === 200) {
										this.$message.success('操作成功');
										this.$refs.TableList.reset();
									} else {
										this.$message.error(res.msg);
									}
								});
							},
						},
						{
							name: '编辑',
							method: val => {
								this.form = { ...val };
								if (val.goodsId) {
									this.form.resource = '2';
									this.product = {
										coverUrl: val.carouselUrls,
										goodsName: val.goodsName,
										amountMin: val.amountMin,
									};
								} else {
									this.form.resource = '1';
									this.product = '';
								}
								this.title = '编辑banner';
								this.dialogFormVisible = true;
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
									delBanner({ id: val.id }).then(res => {
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
		};
	},
	computed: {
		getList() {
			return bannerList;
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
			this.$refs.TableList.update({ ...this.searchfrom1 });
		},
		// 搜索查询
		onClickSearch1() {
			this.$refs.TableList1.update({ ...this.searchfrom });
		},
		// 添加活动
		addVers() {
			this.dialogFormVisible = true;
			this.title = '新增轮播图';
		},
		// 模态窗取消事件
		resetForm(formName) {
			// this.$refs[formName].resetFields();
			this.form = {
				seq: '',
				resource: '1',
			};
			this.dialogFormVisible = false;
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
			this.form.goodsId = val[0].goodsId;
			this.product = val[0];
		},
		// 模态窗确认保存事件
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.form.startTime = this.form.startTime
						? new Date(this.form.startTime).getTime()
						: null;
					this.form.endTime = this.form.endTime
						? new Date(this.form.endTime).getTime()
						: null;
					delete this.form.resource;
					if (this.title === '新增轮播图') {
						const _par = { ...this.form };

						addBanner(_par).then(res => {
							if (res.code === 200) {
								this.dialogFormVisible = false;
								Message.success('新增轮播图成功');
								this.$refs.TableList.reset();
								this.form = {};
							}
						});
					} else {
						const _par = { ...this.form };
						editBanner(_par).then(res => {
							if (res.code === 200) {
								this.dialogFormVisible = false;
								Message.success('修改成功！！！');
								this.$refs.TableList.reset();
								this.form = {};
							}
						});
					}
				} else {
					return false;
				}
			});
		},
		// 自定义单选
		myRadioClick(it, index) {
			console.log(it, index);
			if (it.value == '2') {
				this.productVisible = true;
			} else {
				this.productVisible = false;
				this.product = '';
				delete this.form.goodsId;
			}
			this.form.resource = it.value;
			this.form = { ...this.form };
		},
		// 选择商品
		changeProduct() {
			if (!this.product) return this.$message.error('请选择商品');
			this.productVisible = false;
		},
		// 关联类型
		// changeGoods(val) {
		// 	if (val == 2) {
		// 		this.productVisible = true;
		// 	} else {
		// 		this.productVisible = false;
		// 	}
		// },
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
		changStartTime(val) {
			let date = new Date(val).getTime();
			let nowData = new Date().getTime();
			let endDate = new Date(this.form.endTime).getTime();
			if (date > endDate && endDate !== 0) {
				this.form.startTime = '';
				this.$message.error('开始时间必须小于结束时间');
			}
			// if (date < nowData) {
			// 	this.form.startTime = '';
			// 	this.$message.error('开始时间必须大于当前时间');
			// }
		},
		changEndTime(val) {
			let date = new Date(val).getTime();
			let startDate = new Date(this.form.startTime).getTime();
			let nowData = new Date().getTime();
			if (date < nowData) {
				this.form.endTime = '';
				this.$message.error('结束时间必须大于当前时间');
			}
			if (date < startDate) {
				this.form.endTime = '';
				this.$message.error('结束时间必须大于开始时间');
			}
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
	width: 100%;
	height: 100%;
	padding: 20px;
}
.product {
	display: flex;
	border: 1px solid #ccc;
	width: 500px;
	height: 100px;
	padding: 10px;
	span {
		font-size: 22px;
		color: red;
	}
	> div {
		line-height: 80px;
		margin-left: 20px;
		font-size: 22px;
		color: red;
	}
}
.myRadio {
	$w: 14px;
	display: inline-block;
	margin-right: 30px;
	cursor: pointer;
	&:before {
		content: '';
		box-sizing: border-box;
		position: relative;
		top: -1px;
		display: inline-block;
		width: $w;
		height: $w;
		border: 1px solid #dcdfe6;
		border-radius: 50%;
		vertical-align: middle;
		margin-right: 10px;
	}
	&.myRadioCheck {
		&:before {
			box-sizing: border-box;
			border: 5px solid #409eff;
			background: #fff;
		}
	}
}
</style>
