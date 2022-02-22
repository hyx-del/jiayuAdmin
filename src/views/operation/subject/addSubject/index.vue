<!--
 * @Author: wei.chen
 * @Date: 2020-06-28 14:43:54
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-02-20 15:00:04
 * @Descripttion:  专题
-->
<template>
	<div class="addSpecialTopic">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
			<el-form-item label="专题名称" prop="name" label-width="150px">
				<el-input
					v-model.trim="ruleForm.name"
					placeholder="请输入专题名称"
					maxlength="10"
					minlength="3"
					class="sameLength"
				></el-input>
			</el-form-item>

			<el-form-item label="显示顺序" prop="sortIndex" label-width="150px">
				<el-input
					v-model.trim="ruleForm.sortIndex"
					placeholder="请输入顺序"
					maxlength="2"
					class="sameLength"
				></el-input>
			</el-form-item>
			<el-form-item label="封面图" prop="cover" label-width="150px">
				<CropperImg v-model.trim="ruleForm.cover" :size="100" :ratio="5 / 23"></CropperImg>
			</el-form-item>
			<!-- banner 区域 -->
			<el-form-item label="Banner" prop="bannerItem" label-width="150px">
				<el-button
					type="primary"
					size="small"
					v-if="ruleForm.bannerItem.length < 6"
					@click="addBannerItem('formInline')"
				>
					请添加
				</el-button>
				<span>如果不添加 不显示 Banner 区域</span>

				<el-table :data="ruleForm.bannerItem" style="width:780px" max-height="250">
					<el-table-column prop="bannerUrl" label="图片" width="120">
						<template slot-scope="scope">
							<img :src="scope.row.bannerUrl" class="image" style="width:60px;" />
						</template>
					</el-table-column>

					<el-table-column prop="title" label="标题" width="180"></el-table-column>
					<el-table-column prop="title" label="跳转类型" width="280">
						<template slot-scope="scope">
							{{ scope.row.relationType == 'TWO_PAGE' ? '页面:' : '商品:' }}
							{{
								scope.row.relationType == 'TWO_PAGE'
									? scope.row.relationTitle
									: scope.row.itemTitle
							}}
						</template>
					</el-table-column>
					<!-- <el-table-column
						prop="itemTitle"
						label="跳转商品名称"
						width="200"
					></el-table-column> -->
					<el-table-column prop="sortIndex" label="顺序值" width="70"></el-table-column>

					<el-table-column fixed="right" label="操作" width="120">
						<template slot-scope="scope">
							<el-button
								@click.native.prevent="deleteRow(scope.$index, ruleForm.bannerItem)"
								type="text"
								size="small"
							>
								移除
							</el-button>
							<el-button
								@click.native.prevent="editBannerRow(scope.$index, scope.row)"
								type="text"
								size="small"
							>
								编辑
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-form-item>
			<el-form-item label="适用商品" prop="goodsItem" label-width="150px">
				<el-button type="primary" size="small" @click="chooseGoods('formInline')">
					请选择
				</el-button>

				<el-table :data="ruleForm.goodsItem" style="width:480px" max-height="250">
					<el-table-column prop="itemName" label="名称" width="200"></el-table-column>

					<el-table-column prop="itemCover" label="图片" width="120">
						<template slot-scope="scope">
							<img :src="scope.row.itemCover" class="image" style="width:60px;" />
						</template>
					</el-table-column>
					<el-table-column prop="sortIndex" label="序号" width="60"></el-table-column>
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
			top
			title="选择商品"
			v-if="dialogTableVisible"
			:visible.sync="dialogTableVisible"
			width="68%"
			:close-on-click-modal="false"
			:destroy-on-close="true"
		>
			<el-form
				:inline="true"
				:model="formInline"
				ref="formQueryGoods"
				class="demo-form-inline"
			>
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
					<el-button type="primary" @click="resetFormFormInline" size="small">
						重置
					</el-button>
				</el-form-item>
			</el-form>
			<Table
				:loadData="getList"
				:column="column"
				ref="goodsList"
				:select="fun"
				:single="selectSingleGoods"
				style="height: 500px;overflow-y: auto;"
			>
				<template v-slot:cover="{ scope }">
					<img :src="scope.cover" class="admin_avater" />
				</template>
			</Table>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelBtu('formQueryGoods')">取 消</el-button>
				<el-button type="primary" @click="onClickSpuBtu">确 定</el-button>
			</div>
		</el-dialog>
		<!-- banner 新增 or 编辑界面  -->
		<el-dialog
			@close="bannerHandleClose"
			:title="bannerIsAdd ? '新增Banner' : '编辑Banner'"
			:visible.sync="bannerDialogVisible"
			width="600px"
			custom-class="dialog_content"
			:close-on-click-modal="false"
			:destroy-on-close="true"
		>
			<el-form
				:model="bannerRuleForm"
				:rules="bannerRules"
				ref="bannerRuleForm"
				label-width="120px"
				class="demo-ruleForm"
			>
				<el-form-item label="标题" prop="title">
					<el-input
						v-model.trim="bannerRuleForm.title"
						placeholder="请输入标题"
						maxlength="6"
						class="sameLength"
					></el-input>
				</el-form-item>
				<el-form-item label="轮播图" prop="bannerUrl">
					<CropperImg
						:ratio="bannerRatio"
						v-model="bannerRuleForm.bannerUrl"
					></CropperImg>
				</el-form-item>

				<el-form-item label="顺序" prop="sortIndex">
					<el-input-number
						maxlength="2"
						v-model.number="bannerRuleForm.sortIndex"
						controls-position="right"
						:min="1"
						:max="99"
					></el-input-number>
				</el-form-item>
				<el-form-item label="关联类型" prop="relationType">
					<el-radio-group @change="changeRadio" v-model="bannerRuleForm.relationType">
						<el-radio label="ITEM">商品</el-radio>
						<el-radio label="TWO_PAGE">二级页面</el-radio>
						<!-- <el-radio label="AREA">专区</el-radio> -->
					</el-radio-group>
				</el-form-item>
				<div v-if="bannerRuleForm.relationType == 'ITEM'">
					<el-form-item label="商品" ref="changeGoodsItem">
						<!-- <el-input v-model="bannerRuleForm.itemTitle" class="sameLength"></el-input> -->
						<el-button @click="bannerChooseShop" type="primary">
							选择商品
						</el-button>
						<!-- </el-form-item>
					<el-form-item> -->
						<div class="goods abreast" v-if="bannerRuleForm.itemTitle">
							<img class="chooseImg" v-bind:src="bannerRuleForm.itemImg" alt />
							<span style="padding-left:20px">
								商品名称:
								<span v-text="bannerRuleForm.itemTitle"></span>
							</span>
						</div>
					</el-form-item>
				</div>
				<el-form-item label="二级页面" v-if="bannerRuleForm.relationType == 'TWO_PAGE'">
					<el-select
						v-model.trim="bannerRuleForm.relationValue"
						placeholder="请选择"
						size="small"
					>
						<el-option
							v-for="item in twoPageList"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="bannerHandleClose">取 消</el-button>
				<el-button type="primary" @click="bannerHandleOk('bannerRuleForm')">
					确 定
				</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import Table from '@/components/Table/index';
import ImgUpload from '@/components/upload/index';
import CropperImg from '@/components/cropperImg/index';
import { getAllCat } from '@/api/cat';
import { getEnableTwoPageList } from '@/api/operation';
import { getGoods, getGoodsInfo, findGoodsByIds } from '@/api/goods';
import { getBrand } from '@/api/brand';
import { addSpecialTopic, getSpecialTopicDetail, editSpecialTopic } from '@/api/operation';
import { Message } from 'element-ui';
import { moneyFormat } from '@/core/directives/money';
export default {
	name: 'addSpecialTopic',
	components: {
		Table,
		ImgUpload,
		CropperImg,
	},
	data() {
		const checkedNumber = (rule, value, callback) => {
			if (!value) {
				callback(new Error('请输入顺序'));
			} else {
				if (!/^[0-9]\d*$/.test(value)) {
					callback(new Error('请输入大于等于零的数值'));
				} else {
					callback();
				}
			}
		};
		const checkGoodsLen = (rule, value, callback) => {
			if (!value) {
				callback(new Error('请选择商品'));
			} else {
				console.log(value);
				if (value.length == 0) {
					callback(new Error('请选择商品'));
				} else {
					callback();
				}
			}
		};
		return {
			goodsToSource: null, // banner模式，speciaArea  模式
			bannerShowShopBtn: false,
			bannerRatio: 22 / 69,
			bannerIsAdd: true,
			bannerDialogVisible: false,
			modelTempGoodsItem: null, // 临时选择的商品存储
			begPickerOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 8.64e7; //如果没有后面的-8.64e7就是不可以选择今天的
				},
			},
			selectSingleGoods: true, // 默认是单商品
			ruleForm: {
				name: '', // 专题名称
				// type: 'SINGLE_ITEM', // 专题类型
				// type: 'true', // 专题类型
				cover: null, // 专题类型
				startTime: null,
				goodsItem: [
					// {
					// 	itemName: '', // 商品名称
					// 	itemCover: '', // 商品图片
					// 	itemId: null, // 商品ID
					// 	fullPrice: null, // 满足金额
					// 	description: '', // 描述
					// 	itemOriginPrice: null, // 商品原价
					// 	itemPrice: null, // 商品现价
					// },
				],
				bannerItem: [],
			},
			bannerRuleForm: {
				relationValue: '',
				itemName: '',
				itemPrice: '',
				itemImg: null,
				sortIndex: '',
				relationType: 'ITEM',
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
			rules: {
				name: [
					{ required: true, message: '请输入专题名称', trigger: 'blur' },
					{ min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
				],

				sortIndex: {
					validator: checkedNumber,
					required: true,
					message: '请输入顺序号',
				},

				goodsItem: [
					{
						required: true,
						validator: checkGoodsLen,
						trigger: 'change',
					},
				],
				cover: [{ required: true, message: '请上传封面图片', trigger: 'blur' }],
			},
			bannerRules: {
				title: [{ required: true, message: '请输入标题', trigger: 'change' }],
				bannerUrl: [{ required: true, message: '请上传Banner', trigger: 'change' }],
				sortIndex: [
					{ validator: checkedNumber, trigger: 'change' },
					{ required: true, message: '请输入', trigger: 'change' },
				],
				relationType: [{ required: true, message: '请选择类型', trigger: 'change' }],
				itemTitle: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (this.bannerRuleForm.itemTitle) {
								callback();
							} else {
								callback(new Error('请选择商品'));
							}
						},
						trigger: 'blur',
					},
				],
				// relationType: [{ required: true, message: '请选择关联类型', trigger: 'change' }],
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
			twoPageList: null,
			id: this.$route.query.id || null,
		};
	},
	mounted() {
		// 获取二级页面启动列表
		getEnableTwoPageList().then(res => {
			if (res.code === 200) {
				this.twoPageList = res.data;
			}
		});
		// 编辑的时候获取专题详情
		if (this.id) {
			getSpecialTopicDetail({ id: this.id }).then(res => {
				if (res.success) {
					this.ruleForm = res.data;
					this.ruleForm.startTime = res.data.startTime;
					const _goods = res.data.specialTopicItemList
						? res.data.specialTopicItemList
						: [];
					const _banners = res.data.bannerJsonArr
						? JSON.parse(res.data.bannerJsonArr)
						: [];
					this.ruleForm.goodsItem = _goods;
					this.ruleForm.bannerItem = _banners;
					this.$forceUpdate();
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
		// bannerChooseShopOK() {
		// 	if (this.chooseVal) {
		// 		this.ruleForm.relationValue = this.chooseVal.id;
		// 		this.ruleForm.itemName = this.chooseVal.name;
		// 		this.ruleForm.itemPrice = this.chooseVal.defaultPrice;
		// 		this.ruleForm.itemImg = this.chooseVal.cover;
		// 	}
		// 	this.$refs.goodsTable.clearSelect();
		// 	this.shopDialogVisible = false;
		// },
		changeRadio() {
			// this.bannerRuleForm.relationValue = '';
			if (this.bannerRuleForm.relationType === 'ITEM') {
			} else if (this.bannerRuleForm.relationType === 'TWO_PAGE') {
			} else {
			}
		},
		bannerChooseShop() {
			this.dialogTableVisible = true;
			this.goodsToSource = 'banner';
			// this.$refs[formName].resetFields()
			this.formInline = {};
			// this.$refs.goodsList.update()
			// 获取品牌列表
			getBrand().then(res => {
				if (res.success) {
					this.brands = res.data.list;
				}
			});
			// 选择商品的 dialog
			// this.shopDialogVisible = true;
		},
		// banner 的redio ,选择是否需要跳转商品

		bannerHandleClose() {
			this.bannerDialogVisible = false;
			this.bannerRuleForm.relationValue = '';

			this.bannerResetForm('bannerRuleForm');
			// this.bannerRuleForm = {
			// 	relationType: 'NONE',
			// 	relationValue: '',
			// 	itemName: '',
			// 	itemPrice: '',
			// 	itemImg: null,
			// 	sortIndex: '',
			// };
		},
		// 类型变化 回调事件
		radioTypeChange(val) {
			if (val === 'TWO_LEVEL_PAGE') {
				this.selectSingleGoods = false;
			} else {
				this.selectSingleGoods = true;
			}
		},
		deleteRow(index, rows) {
			rows.splice(index, 1);
			// console.log(rows);
			// 重置 sortIndex
			rows.forEach((item, index) => {
				item.sortIndex = index + 1;
			});
		},
		// 编辑banner
		editBannerRow(index, row) {
			console.log(index, row);

			const tempObj = { ...row, index };

			if (!tempObj.relationType) {
				tempObj.relationType = 'ITEM';
			}
			this.bannerRuleForm = tempObj;

			this.bannerShowShopBtn = true;
			this.bannerIsAdd = false;
			this.goodsToSource = 'banner';
			this.selectSingleGoods = true;
			this.bannerDialogVisible = true;
			this.$forceUpdate();
		},
		addBannerItem() {
			this.goodsToSource = 'banner';
			// 设置默认值
			this.bannerRuleForm = { sortIndex: 1, relationType: 'ITEM' };
			this.selectSingleGoods = true;
			this.bannerDialogVisible = true;
		},
		// 弹窗
		chooseGoods(formName) {
			this.selectSingleGoods = false;
			this.goodsToSource = 'speciaArea';
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
			if (value && value.length > 1) {
				this.formInline.catId = value[1];
				this.formInline.parentCatId = value[0];
			} else {
			}

			// delete this.formInline.catName;
		},
		// 查询
		onClickSearch() {
			console.log(this.formInline);
			this.$refs.goodsList.update({ ...this.formInline });
		},
		// 取消
		resetFormFormInline() {
			console.log('=========');
			this.$refs['formQueryGoods'].resetFields();
			this.formInline = {};
		},
		// 确认选择专题商品
		onClickSpuBtu() {
			console.log(this.modelTempGoodsItem);
			// Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
			if (!this.modelTempGoodsItem) {
				Message.error('请选择商品');
				return false;
			}
			//  ;
			if (this.goodsToSource === 'speciaArea') {
				// 如果是单个商品模式 就是 覆盖。如果是二级界面就是push
				this.modelTempGoodsItem.forEach(tempItem => {
					let _mark = 0;

					this.ruleForm.goodsItem.forEach(item => {
						if (tempItem.id === item.itemId) {
							_mark = item.itemId;
						}
					});

					if (_mark == 0) {
						this.ruleForm.goodsItem.push({
							sortIndex: this.ruleForm.goodsItem.length + 1,
							itemId: tempItem.id,
							itemName: tempItem.name,
							itemCover: tempItem.cover,
						});
					} else {
						this.$message({
							message: '已经自动过滤了重复商品',
							type: 'warning',
						});
					}
				});
			} else if (this.goodsToSource === 'banner') {
				this.bannerRuleForm.itemImg = this.modelTempGoodsItem[0].cover;
				this.bannerRuleForm.itemTitle = this.modelTempGoodsItem[0].name;
				this.bannerRuleForm.itemId = this.modelTempGoodsItem[0].id;
			}

			this.$refs.formQueryGoods.clearValidate('goodsItem');
			// this.$refs.changeGoodsItem.clearValidate();
			// console.log('this.$refs.bannerRuleForm', this.$refs.bannerRuleForm);
			// this.$refs.bannerRuleForm.clearValidate();
			// console.log(this.ruleForm.goodsItem);
			// debugger;
			this.dialogTableVisible = false;
			this.modelTempGoodsItem = null;
			this.$forceUpdate();
		},
		// 取消模态窗
		cancelBtu(formName) {
			this.$refs[formName].resetFields();
			this.dialogTableVisible = false;
		},
		bannerHandleOk(formName) {
			if (this.bannerRuleForm.itemTitle) {
				this.$refs.bannerRuleForm.clearValidate('itemTitle');
			}
			this.$refs[formName].validate(valid => {
				if (valid) {
					const _tempItem = { ...this.bannerRuleForm };

					if (_tempItem.relationType == 'ITEM' && !_tempItem.itemTitle) {
						this.$message.error('请选择商品');
						return false;
					}
					if (_tempItem.relationType == 'TWO_PAGE' && !_tempItem.relationValue) {
						this.$message.error('请选择二级页面');
						return false;
					}
					let _relationTitle = null;
					if (_tempItem.relationType == 'TWO_PAGE') {
						this.twoPageList.forEach(item => {
							if (item.id == _tempItem.relationValue) {
								_relationTitle = item.name;
							}
						});
					}
					if (_tempItem.tempId) {
						// 编辑
						this.ruleForm.bannerItem.forEach((item, index) => {
							if (item.tempId === _tempItem.tempId) {
								item.bannerUrl = _tempItem.bannerUrl;
								item.title = _tempItem.title;
								item.itemTitle = _tempItem.itemTitle;
								item.itemImg = _tempItem.itemImg;
								item.itemId = _tempItem.itemId;
								item.relationType = _tempItem.relationType;
								item.relationTitle = _relationTitle;
								item.relationValue = _tempItem.relationValue;
							}
							this.$forceUpdate();
						});
					} else {
						// 新增
						this.ruleForm.bannerItem.push({
							tempId: +new Date(),
							bannerUrl: _tempItem.bannerUrl,
							title: _tempItem.title,
							itemTitle: _tempItem.itemTitle,
							itemImg: _tempItem.itemImg,
							itemId: _tempItem.itemId,
							relationType: _tempItem.relationType,
							relationValue: _tempItem.relationValue,
							relationTitle: _relationTitle,
							sortIndex: this.ruleForm.bannerItem.length + 1,
						});
					}

					this.bannerRuleForm.itemImg = null;
					this.bannerRuleForm = { sortIndex: 1 };

					// console.log(this.ruleForm.bannerItem);
					this.bannerHandleClose();
				} else {
					// console.log('error submit!!');
					return false;
				}
			});
		},
		// 确认保存新增专题
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					const _par = { ...this.ruleForm };
					_par.itemId = '';

					_par.bannerJsonArr = JSON.stringify(_par.bannerItem);
					delete _par.bannerItem;
					_par.specialTopicItemList = [..._par.goodsItem];
					delete _par.goodsItem;

					if (this.id) {
						// 编辑
						editSpecialTopic(_par).then(res => {
							if (res.success) {
								Message.success('专题修改成功');
								this.$refs[formName].resetFields();
								this.$router.go(-1);
							}
						});
					} else {
						// 新增

						addSpecialTopic(_par).then(res => {
							console.log(res);
							if (res.success) {
								Message.success('专题添加成功');
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
		// banner  取消
		bannerResetForm(formName) {
			this.$refs[formName].resetFields();
			// this.$router.go(-1);
		},
	},
};
</script>

<style lang="scss" scoped>
.addSpecialTopic {
	padding: 20px;
	.sameLength {
		width: 200px;
	}
	.chooseImg {
		width: 100px;
		height: 100px;
	}
	.abreast {
		display: flex;
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
