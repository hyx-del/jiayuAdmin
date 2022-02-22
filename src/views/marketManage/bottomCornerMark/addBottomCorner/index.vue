<!--
 * @Author: wei.chen
 * @Date: 2020-06-28 14:43:54
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-03-23 17:13:18
 * @Descripttion: 底部角标管理
-->
<template>
	<div class="addBottomSubScript">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
			<el-form-item label="活动名称" prop="name" label-width="150px">
				<el-input
					v-model.trim="ruleForm.name"
					placeholder="请输入活动名称"
					maxlength="30"
					class="sameLength"
				></el-input>
			</el-form-item>

			<!-- <el-form-item label="是否立即使用" prop="type" label-width="150px">
				<el-radio-group v-model="ruleForm.type">
					<el-radio label="true" value="true" checked>是</el-radio>
					<el-radio label="false" value="false">否</el-radio>
				</el-radio-group>
			</el-form-item> -->
			<el-form-item label="开始时间" prop="startTime" label-width="150px">
				<el-date-picker
					v-model.trim="ruleForm.startTime"
					type="datetime"
					format="yyyy-MM-dd HH:mm"
					placeholder="请输入开始时间"
					value-format="timestamp"
					:picker-options="begPickerOptions"
					class="sameLength"
				></el-date-picker>
			</el-form-item>
			<el-form-item label="上传图片" prop="iconUrl" label-width="150px">
				<ImgUpload v-model.trim="ruleForm.iconUrl" :size="100" :ratio="3"></ImgUpload>
			</el-form-item>
			<el-form-item label="选择商品" prop="iconUrl" label-width="150px">
				<el-radio-group v-model="ruleForm.itemType">
					<el-radio label="SINGLE">部分商品</el-radio>
					<el-radio label="ALL">全部商品</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item
				label="适用商品"
				prop="goodsItem"
				v-if="ruleForm.itemType == 'SINGLE'"
				label-width="150px"
			>
				<el-button type="primary" size="small" @click="chooseGoods('formInline')">
					请选择
				</el-button>

				<el-table :data="ruleForm.goodsItem" style="width:420px" max-height="250">
					<el-table-column prop="itemName" label="名称" width="200"></el-table-column>

					<el-table-column prop="itemImg" label="图片" width="120">
						<template slot-scope="scope">
							<img :src="scope.row.itemImg" class="image" style="width:60px;" />
						</template>
					</el-table-column>
					<el-table-column fixed="right" label="操作" width="60">
						<template slot-scope="scope">
							<el-button
								@click.native.prevent="deleteRow(scope.$index, ruleForm.goodsItem)"
								type="text"
								size="small"
							>
								移除
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-form-item>

			<el-form-item label-width="150px">
				<el-button @click="resetForm('ruleForm')">取消</el-button>
				<el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
			</el-form-item>
		</el-form>

		<!-- 选择商品模态窗 -->
		<el-dialog
			center
			title="选择商品"
			v-if="dialogTableVisible"
			:visible.sync="dialogTableVisible"
			width="68%"
			:close-on-click-modal="false"
		>
			<el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
				<el-form-item label="商品名称">
					<el-input
						v-model.trim="formInline.name"
						size="small"
						placeholder="请输入商品名称"
						maxlength="30"
					></el-input>
				</el-form-item>
				<el-form-item label="商品货号">
					<el-input
						v-model.trim="formInline.itemNo"
						prefix-icon="el-icon-search"
						size="small"
						placeholder="请输入商品货号"
					></el-input>
				</el-form-item>
				<el-form-item label="类目">
					<el-cascader
						:props="catProps"
						v-model.trim="formInline.catName"
						clearable
						@change="onChangeValue"
						size="small"
					></el-cascader>
				</el-form-item>
				<el-form-item label="品牌">
					<el-select
						v-model.trim="formInline.brandId"
						placeholder="品牌名称"
						size="small"
					>
						<el-option
							v-for="item in brands"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						/>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onClickSearch" size="small">查询</el-button>
				</el-form-item>
			</el-form>
			<Table
				:loadData="getList"
				:column="column"
				ref="goodsList"
				:select="fun"
				style="height: 500px;overflow-y: auto;"
			>
				<template v-slot:cover="{ scope }">
					<img :src="scope.cover" class="admin_avater" />
				</template>
			</Table>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelBtu('formInline')">取 消</el-button>
				<el-button type="primary" @click="onClickSpuBtu">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import Table from '@/components/Table/index';
import ImgUpload from '@/components/upload/index';
import { getAllCat } from '@/api/cat';
import { getGoods, getGoodsInfo, findGoodsByIds } from '@/api/goods';
import { getBrand } from '@/api/brand';
import { addBottomSubScript, getBottomSubScriptInfo, editBottomSubScript } from '@/api/subScript';
import { Message } from 'element-ui';
import { moneyFormat } from '@/core/directives/money';
export default {
	name: 'addBottomSubScript',
	components: {
		Table,
		ImgUpload,
	},
	data() {
		return {
			modelTempGoodsItem: null, // 临时选择的商品存储
			begPickerOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 8.64e7; //如果没有后面的-8.64e7就是不可以选择今天的
				},
			},
			ruleForm: {
				itemType: 'SINGLE',
				name: '', // 角标名称
				// type: 'true', // 角标类型
				iconUrl: null, // 角标类型
				startTime: null,
				goodsItem: [
					// {
					// 	itemName: '', // 商品名称
					// 	itemImg: '', // 商品图片
					// 	itemId: null, // 商品ID
					// 	fullPrice: null, // 满足金额
					// 	description: '', // 描述
					// 	itemOriginPrice: null, // 商品原价
					// 	itemPrice: null, // 商品现价
					// },
				],
			},
			// 选择商品模态窗 查询数据
			formInline: {
				name: '', // 商品名称
				brandId: null, // 品牌ID
				catId: null, // 二级类目ID
				parentCatId: null, // 一级类目ID
			},
			dialogTableVisible: false,
			column: [
				{ prop: 'name', label: '商品名称' },
				{
					prop: 'itemNo',
					label: '商品货号',
				},
				{ prop: 'stock', label: '剩余库存' },
				{
					prop: 'defaultPrice',
					label: '价格',
					formatter: row => {
						return `${moneyFormat(row.defaultPrice)}元`;
					},
				},
				{ prop: 'cover', label: '商品图片', render: true },
			],
			isShowGoodsInfo: false,
			rules: {
				name: [
					{ required: true, message: '请输入活动名称', trigger: 'blur' },
					{ min: 1, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' },
				],
				startTime: [
					{
						required: true,
						message: '请选择角标有效时间',
						trigger: 'change',
					},
				],
				goodsItem: [{ required: true, message: '请选择适用商品', trigger: 'blur' }],
				iconUrl: [{ required: true, message: '请上传角标', trigger: 'blur' }],
				// type: [{ required: true, message: '请选择角标类型', trigger: 'change' }],
			},
			brands: [],
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
			id: this.$route.query.id || null,
		};
	},
	mounted() {
		// 编辑的时候获取角标详情
		if (this.id) {
			getBottomSubScriptInfo({ id: this.id }).then(res => {
				if (res.success) {
					this.ruleForm = res.data;
					this.ruleForm.startTime = res.data.startTime;
					// 获取商品的id 集合,删除最后一个 ,  然后转换为数组
					let _tempIds = res.data.itemId;
					_tempIds = _tempIds.substring(0, _tempIds.lastIndexOf(','));
					// const _goodsIds = _tempIds.split(',');
					findGoodsByIds({ ids: _tempIds }).then(res => {
						// this.ruleForm.goodsItem = res.data;
						let _temp = [];
						res.data.forEach(tempItem => {
							_temp.push({
								itemId: tempItem.id,
								itemName: tempItem.name,
								itemImg: tempItem.cover,
							});
						});
						console.log(_temp);
						this.ruleForm.goodsItem = _temp;
						this.$forceUpdate();
					});
					// 查询商品列表
					// this.ruleForm.goodsItem
					// res.data.
				}
			});
		}
	},
	computed: {
		// 获取商品列表
		getList() {
			return getGoods;
		},
	},
	methods: {
		deleteRow(index, rows) {
			rows.splice(index, 1);
		},
		// 弹窗
		chooseGoods(formName) {
			this.dialogTableVisible = true;
			// this.$refs[formName].resetFields()
			this.formInline = {};
			// this.$refs.goodsList.update()
			// 获取品牌列表
			getBrand().then(res => {
				if (res.success) {
					this.brands = res.data.list;
				}
			});
		},
		// 获取选中商品信息
		fun(val) {
			if (val.length > 0) {
				this.modelTempGoodsItem = val;
			}
		},

		// 选择类目ID
		onChangeValue(value) {
			this.formInline.catId = value[1];
			this.formInline.parentCatId = value[0];
			delete this.formInline.catName;
		},
		// 查询
		onClickSearch() {
			console.log(this.formInline);
			this.$refs.goodsList.update({ ...this.formInline });
		},
		// 确认选择活动商品
		onClickSpuBtu() {
			// Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。

			this.modelTempGoodsItem.forEach(tempItem => {
				let _mark = 0;
				this.ruleForm.goodsItem.forEach(item => {
					//  ;
					if (tempItem.id === item.itemId) {
						_mark = item.itemId;
					}
				});
				if (_mark == 0) {
					this.ruleForm.goodsItem.push({
						itemId: tempItem.id,
						itemName: tempItem.name,
						itemImg: tempItem.cover,
					});
				}
			});

			// console.log(this.ruleForm.goodsItem);
			this.dialogTableVisible = false;
			this.modelTempGoodsItem = null;
		},
		// 取消模态窗
		cancelBtu(formName) {
			this.$refs[formName].resetFields();
			this.dialogTableVisible = false;
		},

		// 确认保存新增角标
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					console.log(this.ruleForm);
					const _par = { ...this.ruleForm };
					_par.itemId = '';

					if (_par.itemType === 'ALL') {
						_par.itemId = '';
					} else {
						_par.goodsItem.forEach(item => {
							_par.itemId += `${item.itemId},`;
						});
					}
					delete _par.goodsItem;
					if (this.id) {
						// 编辑
						editBottomSubScript(_par).then(res => {
							if (res.success) {
								Message.success('角标修改成功');
								this.$refs[formName].resetFields();
								this.$router.go(-1);
							}
						});
					} else {
						// 新增

						// if (_par.type == 'true') {
						// 	_par.startTime = +new Date();
						// }
						addBottomSubScript(_par).then(res => {
							console.log(res);
							if (res.success) {
								Message.success('角标添加成功');
								this.$refs[formName].resetFields();
								this.$router.go(-1);
							}
						});
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		// 取消
		resetForm(formName) {
			this.$refs[formName].resetFields();
			this.$router.go(-1);
		},
	},
};
</script>

<style lang="scss" scoped>
.addBottomSubScript {
	padding: 20px;
	.sameLength {
		width: 260px;
	}
}
.box-card {
	width: 300px;
}
.image {
	width: 100%;
	display: block;
}
p {
	margin: 0;
}
.admin_avater {
	width: 70px;
	height: 50px;
}
.flex-row {
	display: flex;
	.el-form-item {
		text-align: left;
		display: flex;
		margin-right: 10px;
	}
}
.userLimitAmount {
	clear: both;
	text-align: left;
}
.el-form-item .el-form-item {
	margin-bottom: 10px;
}
</style>
