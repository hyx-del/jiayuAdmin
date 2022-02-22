<!--
 * @Author: tianhao
 * @Date: 2020-06-17 16:02:02
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-06-19 10:30:39
 * @Descripttion: 
-->
<template>
	<div class="hotGoods">
		<el-row :gutter="20">
			<el-col :span="14">
				<div class="left_content">
					<h3 class="templateStyle">样式</h3>
					<div class="left_content_item">
						<div class="left_content_item_1_1 left_content_item_img">
							<img v-if="hotSaleItem[0]" :src="hotSaleItem[0].img" alt="" />
							<span>1</span>
						</div>
						<div class="left_content_item_1_2 left_content_item_img">
							<img v-if="hotSaleItem[1]" :src="hotSaleItem[1].img" alt="" />
							<span>2</span>
						</div>
					</div>
					<div class="left_content_item">
						<div class="left_content_item_2_1 left_content_item_img">
							<img v-if="hotSaleItem[2]" :src="hotSaleItem[2].img" alt="" />
							<span>3</span>
						</div>
						<div class="left_content_item_2_2 left_content_item_img">
							<img v-if="hotSaleItem[3]" :src="hotSaleItem[3].img" alt="" />
							<span>4</span>
						</div>
					</div>
					<div class="left_content_item">
						<div class="left_content_item_3_1 left_content_item_img">
							<img v-if="hotSaleItem[4]" :src="hotSaleItem[4].img" alt="" />
							<span>5</span>
						</div>
						<div class="left_content_item_3_2 left_content_item_img">
							<img v-if="hotSaleItem[5]" :src="hotSaleItem[5].img" alt="" />
							<span>6</span>
						</div>
						<div class="left_content_item_3_3 left_content_item_img">
							<img v-if="hotSaleItem[6]" :src="hotSaleItem[6].img" alt="" />
							<span>7</span>
						</div>
					</div>
				</div>
			</el-col>
			<el-col :span="10">
				<h3>修改记录</h3>
				<el-table :data="hotSaleItem" border style="width: 100%">
					<el-table-column prop="id" label="序号" width="60"></el-table-column>
					<el-table-column prop="name" label="图片" width="240">
						<template slot-scope="scope">
							<img style="width:110px" :src="scope.row.img" />
						</template>
					</el-table-column>
					<el-table-column prop="jumpType" label="跳转链接">
						<template slot-scope="scope">
							<div>
								{{ scope.row.jumpType === 'ITEM' ? '商品：' : '页面:' }}
								{{ scope.row.relationName }}
							</div>
						</template>
					</el-table-column>
					<el-table-column label="操作记录" width="100">
						<template slot-scope="scope">
							<el-button type="text" @click="openLogDialog(scope.row)" size="small">
								查看记录
							</el-button>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="100">
						<template slot-scope="scope">
							<el-button type="text" @click="openEditDialog(scope.row)" size="small">
								编辑
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-col>
		</el-row>

		<!-- 编辑 -->
		<el-dialog
			@close="handleClose"
			:title="'编辑'"
			:visible.sync="dialogVisible"
			width="600px"
			custom-class="dialog_content"
			:close-on-click-modal="false"
		>
			<el-form
				:model="ruleForm"
				:rules="rules"
				ref="ruleForm"
				label-width="100px"
				class="demo-ruleForm"
			>
				<el-form-item label="上传图片" prop="img">
					<CropperImg :ratio="ratio" v-model="ruleForm.img" :key="ratio"></CropperImg>
				</el-form-item>

				<el-form-item label="关联类型" prop="jumpType">
					<el-radio-group @change="changeRadio" v-model="ruleForm.jumpType">
						<el-radio label="ITEM">商品</el-radio>
						<el-radio label="TWO_PAGE">二级页面</el-radio>
						<!-- <el-radio label="SPECIAL_AREA">专区</el-radio> -->
					</el-radio-group>
				</el-form-item>
				<!-- 点击商品后显示按钮 -->
				<div v-if="ruleForm.jumpType == 'ITEM'">
					<el-form-item label>
						<el-button @click="chooseShop" type="primary">选择商品</el-button>
					</el-form-item>
					<el-form-item v-if="ruleForm.relationId">
						<div class="goods abreast">
							<!-- <img class="chooseImg" v-bind:src="ruleForm.itemImg" alt /> -->
							<div class="goods_content">
								<div class="good_detail">
									商品名称:
									<div class="good_title" v-html="ruleForm.relationName"></div>
									<i @click="deleteChoose" class="el-icon-delete icon"></i>
								</div>
							</div>
						</div>
					</el-form-item>
				</div>
				<el-form-item label="二级页面" v-if="ruleForm.jumpType == 'TWO_PAGE'">
					<el-select v-model.trim="ruleForm.relationId" placeholder="请选择" size="small">
						<el-option
							v-for="item in twoPageList"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						></el-option>
					</el-select>
				</el-form-item>
				<!-- <div v-if="showAREABtn">
					<el-form-item label>
						<el-button @click="chooseArea" type="primary">选择专区</el-button>
					</el-form-item>
					<el-form-item v-if="ruleForm.relationId">
						<div class="goods abreast">
							 <img class="areaChooseImg" v-bind:src="ruleForm.areaCover" alt /> 
							<div class="goods_content">
								<div class="good_detail">
									专区标题:
									<div class="good_title" v-html="ruleForm.relationName"></div>
									<i @click="deleteAreaChoose" class="el-icon-delete icon"></i>
								</div>
							</div>
						</div>
					</el-form-item>
				</div> -->
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleClose">取 消</el-button>
				<el-button type="primary" @click="handleOK('ruleForm')">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 选择商品 -->
		<el-dialog
			title="选择商品"
			@close="shopClose"
			:visible.sync="shopDialogVisible"
			width="68%"
			:close-on-click-modal="false"
		>
			<el-form :inline="true" :model="chooseForm" class="demo-form-inline" ref="chooseForm">
				<el-form-item label="商品名称">
					<el-input
						v-model.trim="chooseForm.name"
						prefix-icon="el-icon-search"
						size="small"
						placeholder="请输入商品名称"
					></el-input>
				</el-form-item>
				<el-form-item label="商品货号">
					<el-input
						v-model.trim="chooseForm.itemNo"
						prefix-icon="el-icon-search"
						size="small"
						placeholder="请输入商品货号"
					></el-input>
				</el-form-item>
				<el-form-item label="品类">
					<el-cascader
						:props="catProps"
						v-model="chooseForm.catName"
						clearable
						@change="onChangeValue"
						size="small"
					></el-cascader>
				</el-form-item>
				<el-form-item label="活动">
					<el-select
						v-model="chooseForm.actType"
						placeholder="活动名称"
						size="small"
						@change="onChangeActType"
					>
						<el-option
							v-for="item in actTypeList"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-checkbox @change="changeCheckbox" v-model="chooseForm.newFlag">
						上新
					</el-checkbox>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="searchGoods" size="small">查询</el-button>
				</el-form-item>
			</el-form>
			<Table
				:select="getShopChoose"
				:loadData="getGoodsList"
				ref="goodsTable"
				:column="goodsColumn"
				:params="{ putOn: true }"
				:single="true"
				style="height: 490px; overflow-y: auto"
			></Table>
			<span slot="footer" class="dialog-footer">
				<el-button @click="shopClose">取 消</el-button>
				<el-button type="primary" @click="chooseShopOK">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 选择专区 -->
		<el-dialog
			title="选择专区"
			@close="areaModalClose"
			:visible.sync="areaDialogVisible"
			width="75%"
			:close-on-click-modal="false"
		>
			<Table
				:select="getAreaChoose"
				:loadData="getSpecialAreaList"
				ref="areaTable"
				:column="areaColumn"
				:single="true"
				style="height: 490px; overflow-y: auto"
			></Table>
			<span slot="footer" class="dialog-footer">
				<el-button @click="areaModalClose">取 消</el-button>
				<el-button type="primary" @click="chooseAreaOK">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 查看操作记录 -->
		<el-dialog
			title="操作记录"
			@close="logModalClose"
			:visible.sync="logDialogVisible"
			width="75%"
			:close-on-click-modal="false"
		>
			<Table
				v-if="logDialogVisible"
				:params="logQueryInfo"
				:loadData="getLogList"
				:column="logColumn"
				style="height: 600px; overflow-y: auto"
			>
				<template v-slot:img="{ scope }">
					<el-image
						:src="scope.img"
						style="width:100px"
						:preview-src-list="[scope.img]"
					/>
				</template>
			</Table>
			<span slot="footer" class="dialog-footer">
				<el-button @click="logModalClose">取 消</el-button>
				<el-button type="primary" @click="logModalClose">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import Table from '@/components/Table/index';
// import LTNQupload from "@/components/upload/index";
import CropperImg from '@/components/cropperImg/index';
import { parseTime } from '@/utils';
import { moneyFormat } from '@/core/directives/money';
import { isEmpty } from '@/core/directives/empty';
import { getGoods } from '@/api/goods';
import { getEnableTwoPageList } from '@/api/operation';
import { getHotSales, editHotSales, getHotSalesLogById } from '@/api//operation';
import { getAllCat } from '@/api/cat';
import { getSpecialAreaList } from '@/api/specialArea';
import { Divider } from 'element-ui';
export default {
	components: {
		Table,
		CropperImg,
	},
	data() {
		var checkAge = (rule, value, callback) => {
			if (isEmpty(value)) {
				return callback(new Error('顺序值不能为空'));
			}
			if (!Number.isInteger(value)) {
				callback(new Error('请输入数字值'));
			} else {
				if (value > 99999) {
					callback(new Error('最小值为99999'));
				} else if (value < 0) {
					callback(new Error('最大值为0'));
				} else {
					callback();
				}
			}
		};

		return {
			twoPageList: [],
			logQueryInfo: {},
			hotSaleItem: [],
			actTypeList: [
				{ label: '限时抢购', value: 'TIME' },
				{ label: '甄选优品', value: 'RECOMMEND' },
			],
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

			shopDialogVisible: false,
			dialogVisible: false,
			areaDialogVisible: false,
			logDialogVisible: false,
			shop: {},
			formInline: {
				banned: null,
				bannerType: '',
			},

			ruleForm: {
				relationId: null,
				jumpType: null,
				relationName: '',
				itemName: '',
				itemPrice: '',
				itemImg: '',
			},
			isShowTime: false,
			showShopBtn: false,
			showAREABtn: false,
			chooseForm: {},
			// 操作记录
			logColumn: [
				{
					prop: 'img',
					label: '图片',
					render: true,
				},
				{
					prop: 'jump',
					label: '跳转',
				},
				{
					prop: 'createTime',
					label: '操作时间',
					formatter: (row, column) => {
						return parseTime(row.createTime);
					},
				},
				{ prop: 'operator', label: '操作人' },
			],
			goodsColumn: [
				{
					prop: 'name',
					label: '商品名称',
				},
				{
					prop: 'itemNo',
					label: '商品货号',
				},
				{
					prop: 'defaultPrice',
					label: '价格',
					formatter: row => {
						return `${moneyFormat(row.defaultPrice)}元`;
					},
				},
				{
					prop: 'cover',
					label: '商品图片',
					formatter: (row, column) => {
						return <img class="chooseImg" src={row.cover} />;
					},
				},
			],
			areaColumn: [
				{
					prop: 'createTime',
					label: '创建时间',
					formatter: (row, column) => {
						return parseTime(row.createTime);
					},
				},
				{ prop: 'name', label: '专区名称' },
				{
					prop: 'cover',
					label: '封面图片',
					formatter: (row, column) => {
						return <img class="chooseImg" src={row.cover} />;
					},
				},
				{
					prop: 'type',
					label: '专区类型',
					formatter: (row, column) => {
						return row.type === 'SINGLE_ITEM' ? '单商品' : '二级页面';
					},
				},
				// { prop: 'sortIndex', label: '显示顺序' },

				{
					prop: 'startTime',
					label: '开始时间',
					formatter: (row, column) => {
						return parseTime(row.startTime);
					},
				},
				{
					prop: 'banned',
					label: '状态',
					formatter: (row, column) => {
						if (row.banned) {
							return '已停用';
						} else {
							if (row.startTime > new Date().getTime()) {
								return '未开始';
							} else {
								return '进行中';
							}
						}
					},
				},
			],
			rules: {
				img: [{ required: true, message: '请上传图片', trigger: 'change' }],
				jumpType: [{ required: true, message: '请选择关联类型', trigger: 'change' }],
			},
			ratio: 1 / 2,
			goodsList: [],
			chooseVal: {},
			chooseAreaVal: {},
		};
	},
	computed: {
		getGoodsList() {
			return getGoods;
		},
		getSpecialAreaList() {
			return getSpecialAreaList;
		},
		getLogList() {
			return getHotSalesLogById;
		},
	},
	mounted() {
		this.initData();
	},

	methods: {
		initData() {
			// 获取二级页面启动列表
			getEnableTwoPageList().then(res => {
				if (res.code === 200) {
					this.twoPageList = res.data;
				}
			});
			getHotSales().then(res => {
				if (res.code === 200) {
					this.hotSaleItem = res.data;
					console.log(res.data);
				}
			});
		},
		getItemId() {},
		openLogDialog(item) {
			this.logQueryInfo = { id: item.id };
			this.logDialogVisible = true;
		},
		// 打开编辑界面
		openEditDialog(item) {
			this.ruleForm = { ...item };
			this.showShopBtn = item.jumpType === 'ITEM' ? true : false;
			this.showAREABtn = item.jumpType === 'ITEM' ? false : true;
			if (item.id == 1) {
				this.ratio = 1 / 2;
			} else {
				this.ratio = 1 / 1;
			}
			this.dialogVisible = true;
		},

		moneyFormat(num) {
			return moneyFormat(num);
		},
		// 是否上新 checkbox
		changeCheckbox(val) {
			if (!val) {
				this.$refs.goodsTable.update();
			}
		},
		onChangeActType(val) {
			console.log(val);
		},
		// 获取二级类目ID
		onChangeValue(val) {
			this.chooseForm.catId = val[1];
		},
		searchGoods() {
			this.$refs.goodsTable.update(this.chooseForm);
		},
		getShopChoose(val) {
			this.chooseVal = val[0];
		},
		getAreaChoose(val) {
			this.chooseAreaVal = val[0];
		},
		shopClose() {
			this.shopDialogVisible = false;
			if (!this.chooseVal) {
				this.ruleForm.itemName = '';
				this.ruleForm.itemPrice = '';
				this.ruleForm.itemImg = '';
			}
		},
		areaModalClose() {
			this.areaDialogVisible = false;
			if (!this.chooseAreaVal) {
				this.ruleForm.areaName = '';
				// this.ruleForm.itemPrice = '';
				this.ruleForm.areaCover = '';
			}
		},
		logModalClose() {
			this.logDialogVisible = false;
		},

		chooseShopOK() {
			if (this.chooseVal) {
				this.ruleForm.relationId = this.chooseVal.id;
				this.ruleForm.relationName = this.chooseVal.name;
				this.ruleForm.itemPrice = this.chooseVal.defaultPrice;
				this.ruleForm.itemImg = this.chooseVal.cover;
			}
			this.$refs.goodsTable.clearSelect();
			this.shopDialogVisible = false;
		},
		chooseAreaOK() {
			if (this.chooseAreaVal) {
				this.ruleForm.relationId = this.chooseAreaVal.id;
				this.ruleForm.relationName = this.chooseAreaVal.name;
				// this.ruleForm.itemPrice = this.chooseAreaVal.defaultPrice;
				this.ruleForm.areaCover = this.chooseAreaVal.cover;
			}
			this.$refs.areaTable.clearSelect();
			this.areaDialogVisible = false;
		},
		chooseShop() {
			this.shopDialogVisible = true;
		},
		chooseArea() {
			this.areaDialogVisible = true;
		},

		changeRadio() {
			this.ruleForm.relationId = null;
			this.ruleForm.relationName = null;
			if (this.ruleForm.jumpType === 'ITEM') {
				// this.showShopBtn = true;
				// this.showAREABtn = false;
			} else if (this.ruleForm.jumpType === 'SPECIAL_AREA') {
				// this.showAREABtn = true;
				// this.showShopBtn = false;
			}
		},
		// getList() {
		//   // return getList;
		// },
		handleClose() {
			this.dialogVisible = false;
			this.ratio = 1 / 2;
			this.ruleForm.relationId = '';

			this.resetForm('ruleForm');
			this.ruleForm = {
				jumpType: null,
				relationId: '',
				img: null,
				itemName: '',
				areaName: null,
				areaCover: null,
				itemPrice: '',
				itemImg: '',
			};
		},
		search() {
			this.$refs.table.update({ ...this.formInline });
		},
		handleOK(formName) {
			console.log('======>>this.ruleForm', this.ruleForm);
			this.$refs[formName].validate(valid => {
				if (valid) {
					if (this.ruleForm.jumpType == 'ITEM' && !this.ruleForm.relationId) {
						this.$message.error('请选择商品');
						return false;
					}
					if (this.ruleForm.jumpType == 'TWO_PAGE' && !this.ruleForm.relationId) {
						this.$message.error('请选择二级页面');
						return false;
					}
					const _tempItem = { ...this.ruleForm };
					let _relationTitle = {};
					if (this.ruleForm.jumpType == 'TWO_PAGE') {
						this.twoPageList.forEach(item => {
							if (item.id == _tempItem.relationId) {
								_relationTitle = item.name;
							}
						});
						_tempItem.relationName = _relationTitle;
					}

					// if (this.ruleForm.jumpType == 'SPECIAL_AREA' && !this.ruleForm.relationId) {
					// 	this.$message.error('请选择专区');
					// 	return false;
					// }
					// 编辑
					editHotSales(_tempItem).then(res => {
						if (res.code === 200) {
							this.handleClose();
							this.initData();
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
		onSubmit() {},
		// getUpLoadImgUrl(url) {
		//   this.ruleForm.src = url;
		// },

		resetForm(formName) {
			this.$refs[formName].resetFields();
		},
		deleteChoose() {
			this.ruleForm.relationValue = '';
			this.ruleForm.relationName = '';
		},
		deleteAreaChoose() {
			this.ruleForm.relationId = '';
			this.ruleForm.relationName = null;
		},
	},
};
</script>

<style lang="scss">
.hotGoods {
	padding: 20px;
	.left_content {
		.templateStyle {
		}
		.left_content_item {
			min-height: 220px;
			margin-top: 20px;
		}
		.left_content_item_img {
			display: inline-block;
			position: relative;
			left: 0;
			top: 0;
			height: 220px;
			background-color: #eee;
			img {
				width: 100%;
				height: 100%;
			}
			span {
				position: absolute;
				top: 6px;
				left: 6px;
				display: inline-block;
				width: 30px;
				height: 30px;
				line-height: 30px;
				align-self: center;
				text-align: center;
				padding: 2px 2px 2px 2px;
				box-sizing: border-box;
				border-radius: 4px;
				background-color: #169bd558;
				color: #fff;
			}
		}
		.left_content_item_1_1 {
			width: 440px;
		}
		.left_content_item_1_2 {
			width: 220px;
			margin-left: 20px;
		}
		.left_content_item_2_1 {
			width: 330px;
			height: 330px;
		}
		.left_content_item_2_2 {
			width: 330px;
			height: 330px;
			margin-left: 20px;
		}
		.left_content_item_3_1 {
			width: 220px;
		}
		.left_content_item_3_2 {
			width: 220px;
			margin-left: 10px;
		}
		.left_content_item_3_3 {
			width: 220px;
			margin-left: 10px;
		}
	}
}
.hotGoods_img {
	width: 100px;
	/* height: 100px; */
}
.radioStyle {
	padding-top: 10px;
}
.areaChooseImg {
	height: 100%;
}
.chooseImg {
	width: 100px;
	/* height: 100px; */
}
.abreast {
	display: flex;
}
.goods {
	height: 100px;
	width: 70%;
	position: relative;
	border: 1px solid #ccc;
}
.icon {
	margin-top: 14px;
	position: absolute;
	right: 5px;
	top: -4px;
}
.price {
	color: red;
	margin: 0;
}
.goods_content {
	padding-left: 5px;
}
.good_detail {
	padding-right: 20px;
	width: 100%;
}
.good_title {
	padding-top: 6px;
	line-height: 24px;
}
</style>
