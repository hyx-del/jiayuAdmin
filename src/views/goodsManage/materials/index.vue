<!--
 * @Author: wei.chen
 * @Date: 2020-09-03 11:50:38
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-07-15 11:09:21
 * @Descripttion: 
-->
<!--素材库管理-->
<template>
	<div class="materials" v-loading.fullscreen.body="fullscreenLoading">
		<!-- 搜索查询 -->
		<el-form :inline="true" :model="searchForm" ref="searchForm" class="demo-form-inline">
			<el-form-item label="" prop="name">
				<el-input
					size="small"
					prefix-icon="el-icon-search"
					v-model="searchForm.name"
					placeholder="请输入素材库名称"
				></el-input>
			</el-form-item>
			<el-form-item label="创建人" prop="creator">
				<el-select size="small" v-model="searchForm.creator" placeholder="创建人">
					<el-option
						v-for="item in creators"
						:key="'creator' + item"
						:label="item"
						:value="item"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="状态" prop="putOn">
				<el-select size="small" v-model="searchForm.putOn" placeholder="状态">
					<el-option label="上架" :value="true"></el-option>
					<el-option label="下架" :value="false"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="onSearch('searchForm')">
					查询
				</el-button>
				<el-button type="primary" size="small" @click="resetForm('searchForm')">
					重置
				</el-button>
				<el-button type="primary" icon="el-icon-plus" size="small" @click="addMaterial">
					新建素材
				</el-button>
			</el-form-item>
		</el-form>
		<!-- 表格 -->
		<Table :column="column" :loadData="getList" ref="Table">
			<template v-slot:putOn="{ scope }">
				<el-switch
					v-model.trim="scope.putOn"
					active-color="#13ce66"
					inactive-color="#ff4949"
					@change="onPutOn(scope.id)"
				></el-switch>
			</template>
			<template v-slot:top="{ scope }">
				<el-switch
					v-model.trim="scope.top"
					active-color="#13ce66"
					inactive-color="#ff4949"
					@change="onPutTop(scope.id)"
				></el-switch>
			</template>
		</Table>
		<!-- 新建 / 编辑素材模态窗 -->
		<el-dialog
			:title="title"
			center
			:visible.sync="dialogFormVisible"
			:close-on-click-modal="false"
			width="900px"
			:destroy-on-close="true"
			@close="removeForm('ruleForm')"
		>
			<el-form
				:model="ruleForm"
				:rules="rules"
				label-width="190px"
				ref="ruleForm"
				class="demo-ruleForm"
			>
				<el-form-item label="素材名称" prop="name">
					<el-input
						v-model.trim="ruleForm.name"
						maxlength="24"
						placeholder="最多输入24个字符"
					></el-input>
				</el-form-item>
				<el-form-item label="顺序" prop="sort">
					<el-input
						v-model.number="ruleForm.sort"
						maxlength="3"
						placeholder="请输入"
					></el-input>
				</el-form-item>
				<el-form-item label="文案" prop="copy">
					<el-input
						v-model.trim="ruleForm.copy"
						placeholder="最多输入500字符"
						type="textarea"
						maxlength="500"
						show-word-limit
						rows="5"
					></el-input>
				</el-form-item>
				<el-form-item label="关联商品" prop="itemId" class="itemId">
					<el-button
						type="primary"
						size="small"
						@click="onChoose"
						v-if="Object.keys(goodsInfo).length === 0"
					>
						选择商品
					</el-button>
					<el-card shadow="never" class="goods_info" v-else>
						<div class="left">
							<div class="goods_pic">
								<img :src="goodsInfo.cover" alt="" />
							</div>
							<div style="flex:1">
								<h4>{{ goodsInfo.name }}</h4>
								<p>{{ goodsInfo.summary }}</p>
							</div>
						</div>
						<div>
							<i
								class="el-icon-delete"
								style="font-size: 18px;cursor: pointer;"
								@click="deleteGoodsInfo"
							></i>
						</div>
					</el-card>
				</el-form-item>
				<el-form-item label="上传展示图" prop="images">
					<span>最多允许上传9张图，图片请上传JPG、JPGE、PNG格式，不大于2MB</span>
					<div>
						<el-checkbox
							@change="onChecked"
							:disabled="Object.keys(this.goodsInfo).length < 1 ? true : false"
							v-model="ruleForm.showItemCover"
						>
							第一张显示封面图
						</el-checkbox>
					</div>
					<UploadImg v-model.trim="ruleForm.images" :size="2048" :limit="9"></UploadImg>
				</el-form-item>
				<!-- <el-form-item label="显示关联商品的优惠券信息" prop="showCoupon">
					<el-radio-group v-model="ruleForm.showCoupon">
						<el-radio :label="true">显示</el-radio>
						<el-radio :label="false">不显示</el-radio>
					</el-radio-group>
				</el-form-item> -->
				<el-form-item>
					<el-button @click="removeForm('ruleForm')">取消</el-button>
					<el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!-- 选择商品模态窗 -->
		<el-dialog
			title="选择商品"
			:visible.sync="selectVisible"
			:before-close="() => (selectVisible = false)"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:destroy-on-close="true"
			custom-class="dialogStyle"
			width="700px"
			@close="resetGoods"
		>
			<el-form ref="goodSearchForm" :model="goodsParmas" :inline="true">
				<el-form-item prop="name">
					<el-input
						v-model.trim="goodsParmas.name"
						size="small"
						placeholder="请输入商品名称"
						prefix-icon="el-icon-search"
					/>
				</el-form-item>
				<el-form-item label="商品货号">
					<el-input
						v-model.trim="goodsParmas.itemNo"
						prefix-icon="el-icon-search"
						size="small"
						placeholder="请输入商品货号"
					></el-input>
				</el-form-item>
				<el-form-item prop="catId" label="品类">
					<el-cascader
						:props="props"
						size="small"
						v-model.trim="goodsParmas.catId"
					></el-cascader>
				</el-form-item>
				<el-form-item prop="actType" label="品牌">
					<el-select
						v-model.trim="goodsParmas.brandId"
						size="small"
						placeholder="选择品牌名称"
						@focus="getBrandData"
					>
						<el-option
							v-for="item in brands"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						></el-option>
					</el-select>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" size="small" @click="searchGoods">搜索</el-button>
					<el-button type="primary" size="small" @click="resetGoods">重置</el-button>
				</el-form-item>
			</el-form>
			<Table
				:loadData="getGoodsList"
				ref="goodsForm"
				:column="goodsColumn"
				:params="{ putOn: true }"
				:single="true"
				:select="select"
				style="max-height: 460px;overflow-y: auto;"
			>
				<template v-slot:cover="{ scope }">
					<el-image
						:src="scope.cover"
						style="width:100px"
						:preview-src-list="[scope.cover]"
					/>
				</template>
				<template v-slot:name="{ scope }">
					<el-tooltip effect="dark" :content="scope.name" placement="top">
						<span class="tip_item">{{ scope.name }}</span>
					</el-tooltip>
				</template>
			</Table>
			<span slot="footer" class="dialog-footer">
				<el-button @click="selectVisible = false" size="small">取 消</el-button>
				<el-button type="primary" @click="create" size="small">确认选择</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import Table from '@/components/Table';
import UploadImg from './upload/index';
import {
	getMaterialsList,
	addMaterials,
	editMaterials,
	putOnOrDown,
	putTop,
	getCreators,
} from '@/api/materials';
import { getAllCat } from '@/api/cat';
import { getGoods, getGoodsDetail } from '@/api/goods';
import { getAllBrand } from '@/api/brand';
import { parseTime } from '@/utils';
import { Message } from 'element-ui';
import { moneyFormat } from '@/core/directives/money';
export default {
	name: 'materials',
	components: {
		Table,
		UploadImg,
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
		return {
			// 搜索查询数据
			searchForm: {
				creator: null, // 创建人
				name: null, // 素材名
				putOn: null, // 上/下架状态
			},
			creators: [], // 创建人列表数据
			fullscreenLoading: false, // 加载 Loading
			//  表头数据
			column: [
				{
					prop: 'createTime',
					label: '创建时间',
					formatter: row => {
						return parseTime(row.createTime);
					},
				},
				{ prop: 'name', label: '素材库名称' },
				{ prop: 'shareCount', label: '分享量' },
				{ prop: 'turnover', label: '分享成交量' },
				{
					prop: 'id',
					label: '状态',
					formatter: row => {
						if (row.putOn) {
							return '正常';
						} else {
							return '已下架';
						}
					},
				},
				{ prop: 'creator', label: '创建人' },
				{ prop: 'sort', label: '顺序' },
				{ prop: 'putOn', label: '上/下架', render: true },
				{ prop: 'top', label: '置顶', render: true },
				{
					prop: 'actives',
					label: '操作',
					actives: [
						{
							name: '编辑',
							method: val => {
								console.log('======>>val', val);
								this.title = '编辑素材';
								this.ruleForm = { ...val };
								// this.ruleForm.images = val.images.split(',');
								this.ruleForm.images = JSON.parse(val.images);
								this.dialogFormVisible = true;
								getGoodsDetail({ id: val.itemId }).then(res => {
									if (res.success) {
										this.goodsInfo = res.data;
										// if (this.ruleForm.images[0] === res.data.cover) {
										// 	this.ruleForm.showItemCover = true;
										// } else {
										// 	this.ruleForm.showItemCover = false;
										// }
									}
								});
							},
						},
					],
				},
			],
			// 新建 / 编辑素材模态窗数据
			title: '新建素材', // 模态窗标题
			dialogFormVisible: false, // 模态窗状态
			// 新建/编辑素材表单数据
			ruleForm: {
				name: null, // 素材名称
				sort: null, // 顺序
				itemId: null, // 关联商品ID
				copy: null, // 文案
				images: [], // 展示图
				showCoupon: false, // 优惠券是否显示
				showItemCover: false, // 第一张是否显示为封面图
				id: null, // 素材ID，编辑时用
			},
			rules: {
				name: [
					{ required: true, message: '请输入素材名称', trigger: 'blur' },
					{ min: 3, max: 24, message: '长度在 3 到 24 个字符', trigger: 'blur' },
				],
				sort: [{ required: true, validator: checkedNumber, trigger: 'blur' }],
				copy: [{ required: true, message: '请输入文案', trigger: 'blur' }],
				itemId: [{ required: true, message: '请选择关联商品', trigger: 'blur' }],
				images: [
					{
						type: 'array',
						required: true,
						message: '请至少上传一张展示图',
						trigger: 'blur',
					},
				],
				showCoupon: [
					{ required: true, message: '请选择是否显示优惠券信息', trigger: 'change' },
				],
			},
			goodsInfo: {},
			// 选择商品模态窗数据
			selectVisible: false, // 选择商品模态窗状态
			// 品类列表
			props: {
				lazy: true,
				lazyLoad(node, resolve) {
					getAllCat({
						current: 1,
						size: 100,
						parentId: node.value,
					}).then(res => {
						let parentCatList = [];
						if (res.success) {
							res.data.list.forEach(item => {
								let obj = {};
								obj.label = item.name;
								obj.value = item.id;
								if (item.parentId) {
									obj.leaf = true;
								}
								parentCatList.push(obj);
							});
						}
						resolve(parentCatList);
					});
				},
			},
			brands: [], // 品牌数据
			// 查询数据
			goodsParmas: {
				brandId: null, // 品牌ID
				catId: null, // 品类ID
				name: null, // 商品名称
			},
			// 商品列表 表头数据
			goodsColumn: [
				{
					prop: 'name',
					label: '商品名称',
					render: true,
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
					render: true,
				},
			],
			chooseGoods: [], // 选择的商品信息
		};
	},
	mounted() {
		// 获取创建人列表数据
		getCreators().then(res => {
			if (res.success) {
				this.creators = res.data;
			}
		});
	},
	methods: {
		// 素材表格接口
		getList(par) {
			return getMaterialsList(par);
		},
		// 商品列表数据接口
		getGoodsList(par) {
			return getGoods(par);
		},
		// 获取品牌数据
		getBrandData() {
			getAllBrand().then(res => {
				if (res.success) {
					this.brands = res.data;
				}
			});
		},
		// 查询事件
		onSearch() {
			this.$refs.Table.update({ ...this.searchForm });
		},
		// 查询重置事件
		resetForm(formName) {
			this.$refs[formName].resetFields();
		},
		// 新建素材 btn 按钮事件
		addMaterial() {
			this.title = '新建素材';
			this.dialogFormVisible = true;
			this.goodsInfo = {}; // 重置商品信息
			this.ruleForm = {
				name: null, // 素材名称
				sort: null, // 顺序
				itemId: null, // 关联商品ID
				copy: null, // 文案
				images: [], // 展示图
				showCoupon: false, // 优惠券是否显示
				showItemCover: false, // 第一张是否显示为封面图
				id: null, // 素材ID，编辑时用
			};
		},
		// 上/下架事件
		onPutOn(val) {
			this.fullscreenLoading = true; // 加载 Loading
			if (val) {
				putOnOrDown({ id: val }).then(res => {
					if (res.success) {
						setTimeout(() => {
							this.fullscreenLoading = false; // 取消 Loading
							Message.success(res.msg);
							this.$refs.Table.reset();
						}, 1000);
					} else {
						setTimeout(() => {
							this.fullscreenLoading = false; // 取消 Loading
							Message.error(res.msg);
						}, 1000);
					}
				});
			}
		},
		// 置顶事件
		onPutTop(val) {
			this.fullscreenLoading = true; // 加载 Loading
			if (val) {
				putTop({ id: val })
					.then(res => {
						if (res.success) {
							setTimeout(() => {
								this.fullscreenLoading = false; // 取消 Loading
								Message.success(res.msg);
								this.$refs.Table.reset();
							}, 1000);
						}
					})
					.catch(error => {
						console.log('======>>error', error);
						setTimeout(() => {
							this.$refs.Table.reset();
							this.fullscreenLoading = false; // 取消 Loading
							Message.error(error.msg);
						}, 1000);
					});
			}
		},
		// 新建 / 编辑素材模态窗确定事件
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.ruleForm.images = JSON.stringify(this.ruleForm.images);
					// let images = '';
					// this.ruleForm.images.map(item => {
					// 	// this.ruleForm.images = this.ruleForm.images + item;
					// 	images = images + item + ',';
					// });
					// this.ruleForm.images = images;
					if (this.title === '新建素材') {
						delete this.ruleForm.id;
						addMaterials({ ...this.ruleForm }).then(res => {
							if (res.success) {
								Message.success(res.msg);
								this.dialogFormVisible = false;
								this.$refs.Table.reset();
							}
						});
					} else {
						editMaterials({ ...this.ruleForm }).then(res => {
							if (res.success) {
								Message.success(res.msg);
								this.dialogFormVisible = false;
								this.$refs.Table.reset();
							}
						});
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		// 新建 / 编辑素材模态窗取消事件
		removeForm(formName) {
			this.$refs[formName].resetFields();
			this.dialogFormVisible = false;
		},
		// 删除关联商品
		deleteGoodsInfo() {
			this.goodsInfo = {}; // 重置商品信息
			this.ruleForm.images = []; // 重置展示图
			this.ruleForm.showItemCover = false; // 取消勾选
		},
		// 选择商品 btn 事件
		onChoose() {
			this.chooseGoods = []; // 重置选择商品数据
			this.selectVisible = true;
		},
		// 选择商品模态窗查询事件
		searchGoods() {
			let { catId, name, brandId } = this.goodsParmas;
			catId = catId[1]; //只取二级类目
			this.$refs.goodsForm.update({ catId, name, brandId });
		},
		// 选择商品模态窗查询重置事件
		resetGoods() {
			this.$refs.goodSearchForm.resetFields();
		},
		// 表格勾选事件
		select(val) {
			this.chooseGoods = val;
		},
		// 选择商品模态窗确定事件
		create() {
			if (this.chooseGoods.length < 1) {
				Message.error('请选择关联商品！！！');
				return false;
			} else {
				this.goodsInfo = this.chooseGoods[0];
				this.ruleForm.itemId = this.chooseGoods[0].id;
				this.selectVisible = false;
			}
		},
		// 勾选第一张显示封面图时，判断是否已选择了商品
		onChecked() {
			if (this.ruleForm.showItemCover) {
				if (Object.keys(this.goodsInfo).length > 0) {
					// 判断展示图片的长度，如果长度为9，表示展示图已传满
					if (this.ruleForm.images && this.ruleForm.images.length === 9) {
						this.ruleForm.images.pop(); // 去掉展示图的最后一张
						this.ruleForm.images = [this.goodsInfo.cover, ...this.ruleForm.images]; // 把已选择的商品图片追加到展示图的第一张
						this.$forceUpdate();
					} else {
						// this.ruleForm.images.push(this.goodsInfo.cover);
						this.ruleForm.images = [this.goodsInfo.cover, ...this.ruleForm.images];
						this.$forceUpdate();
					}
				} else {
					Message.error('请先选择关联商品！！！');
					this.ruleForm.showItemCover = false;
					return false;
				}
			} else {
				this.ruleForm.images.shift();
				this.ruleForm.images = [...this.ruleForm.images];
				this.$forceUpdate();
			}
		},
	},
};
</script>
<style lang="scss">
.materials {
	padding: 20px;
	.itemId {
		.el-form-item__content {
			line-height: unset;
			.goods_info {
				width: 400px;
				// margin-top: 20px;

				.el-card__body {
					display: flex;
					justify-content: space-between;
					.left {
						display: flex;
						flex: 1;
						margin-right: 10px;
						.goods_pic {
							width: 80px;
							height: 80px;
							margin-right: 10px;
							img {
								width: 100%;
								height: 100%;
							}
						}
						h4 {
							margin: 0 0 10px;
						}
						p {
							margin: 0;
							white-space: pre-wrap;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							line-clamp: 2;
							-webkit-box-orient: vertical;
						}
					}
				}
			}
		}
	}
	.tip_item {
		white-space: pre-wrap;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}
}
</style>
