<!--
 * @Author: wei.chen
 * @Date: 2020-06-17 12:01:15
 * @LastEditTime: 2021-11-10 16:38:41
 * @LastEditors: jiu yin zhen jing
 * @Description:
-->
<template>
	<div class="commonPage">
		<el-form :inline="true" :model="searchfrom" ref="searchForm" class="demo-form-inline">
			<el-form-item prop="goodsName">
				<el-input
					v-model.trim="searchfrom.goodsName"
					size="small"
					placeholder="请输入商品名称"
					prefix-icon="el-icon-search"
				></el-input>
			</el-form-item>
			<el-form-item prop="goodsId">
				<el-input
					v-model.trim="searchfrom.goodsId"
					placeholder="请输入商品编码"
					prefix-icon="el-icon-search"
					size="small"
				></el-input>
			</el-form-item>
			<!-- <el-form-item label="品类" prop="categoryId">
				<el-cascader
					:props="catProps"
					v-model.trim="searchfrom.categoryId"
					clearable
					size="small"
					@change="onChange"
				></el-cascader>
			</el-form-item> -->
			<el-form-item label="品类" prop="categoryId">
				<!-- @focus="getCategoryQuery" -->
				<el-select v-model.trim="searchfrom.categoryId" placeholder="品牌名称" size="small">
					<el-option label="全部" value />
					<el-option
						v-for="item in categoryList"
						:key="item.id"
						:label="item.categoryName"
						:value="item.id"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="品牌" prop="brandId">
				<!-- @focus="getBrand" -->
				<el-select v-model.trim="searchfrom.brandId" placeholder="品牌名称" size="small">
					<el-option label="全部" value />
					<el-option
						v-for="item in brandList"
						:key="item.id"
						:label="item.brandName"
						:value="item.id"
					/>
				</el-select>
			</el-form-item>

			<el-form-item label="上/下架" prop="onSale">
				<el-select v-model.trim="searchfrom.onSale" placeholder="全部" size="small">
					<el-option label="全部" value></el-option>
					<el-option label="上架" :value="true"></el-option>
					<el-option label="下架" :value="false"></el-option>
				</el-select>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="onClickSearch" size="small">查询</el-button>
				<el-button type="primary" @click="resetForm('searchForm')" size="small">
					重置
				</el-button>
				<el-button type="primary" @click="add" size="small" icon="el-icon-plus">
					新增
				</el-button>
				<!-- <el-button type="primary" @click="exportGoods" size="small" icon="el-icon-download">
					下载
				</el-button> -->
			</el-form-item>
		</el-form>
		<xtable :loadData="getGoodsListPage" :column="column" ref="adminList"  refHead="searchForm" :showSortIndex="{ show: true, lable: '序号' }">
			<template v-slot:coverUrl="{ scope }">
				<el-image
					:src="scope.coverUrl"
					class="admin_avater"
					:preview-src-list="[scope.coverUrl]"
				/>
			</template>

			<template v-slot:onSale="{ scope }">
				<el-switch
					v-model.trim="scope.onSale"
					active-color="#13ce66"
					inactive-color="#ff4949"
					@change="putOnGoods(scope.goodsId, scope.onSale)"
				></el-switch>
			</template>
			<!-- <template v-slot:newFlag="{ scope }">
				<el-switch
					v-model.trim="scope.newFlag"
					active-color="#13ce66"
					inactive-color="#ff4949"
					@change="newFlagGoods(scope.id)"
				></el-switch>
			</template> -->
			<!-- <template v-slot:stock="{ scope }">
				<el-popover
					v-if="scope.warning"
					placement="bottom-start"
					width="300"
					trigger="click"
				>
					<div>
						<h4>库存预警</h4>
						<ul>
							<li v-for="item in scope.warningSkuList" :key="item.id">
								<p>SKU名称：{{ item.goodsName }}</p>
								<p>预警库存：{{ item.warningStock }}</p>
								<p>剩余库存：{{ item.stock }}</p>
							</li>
						</ul>
					</div>
					<el-button type="text" slot="reference" class="stockBtn">
						{{ scope.stock }}
					</el-button>
				</el-popover>
				<span v-else>{{ scope.stock }}</span>
			</template> -->
		</xtable>
	</div>
</template>

<script>
import xtable from '@/components/Table';
import { parseTime } from '@/utils';
import { getCategoryList } from '@/api/cat';
// import { getGoodsListPage, putnewGoods, , isEdit } from '@/api/goods';
// import { getList } from '@/api/supplier';
import { getBrandList, getGoodsListPage, goodsOnSale } from '@/api/mall';
import { Message } from 'element-ui';
export default {
	components: {
		xtable,
	},
	data() {
		return {
			// catProps: {
			// 	lazy: true,
			// 	lazyLoad(node, resolve) {
			// 		const { level } = node;
			// 		if (!node.data) {

			// 		}
			// 	},
			// },
			column: [
				{
					prop: 'coverUrl',
					label: '商品图片',
					render: true,
				},
				{
					prop: 'goodsName',
					label: '商品名称',
				},

				{
					prop: 'goodsId',
					label: '商品编码',
				},
				{
					prop: 'categoryName',
					label: '类目',
				},

				{
					prop: 'brandName',
					label: '品牌',
				},
				{
					prop: 'stockSum',
					label: '库存',
					// render: true,
				},
				{
					prop: 'salesCount',
					label: '累计销量',
				},

				{
					prop: 'onSale',
					label: '下/上架',
					render: true,
				},

				{
					prop: 'actives',
					label: '操作',
					actives: [
						{
							name: '查看',
							method: val => {
								this.$router.push({
									path: '/mall/goodsList/goodsDetail',
									query: { id: val.goodsId },
								});
							},
						},
						{
							name: val => {
								// '编辑'
								if (val.onSale) {
									return '';
								} else {
									return '编辑';
								}
							},
							method: val => {
								// 当前商品是否可编辑
								this.$router.push({
									path: '/mall/goodsList/goodsForm',
									query: { eId: val.goodsId },
								});
							},
						},
					],
				},
			],
			searchfrom: {
				goodsName: '',
				goodsId: '',
				catId: '',
				brandId: '',
				supplierId: '',
				onSale: '',
				// newFlag: '',
				categoryId: [],
			},
			loading: false, //远程加载
			parentCatList: [], //一级类目
			catList: [], //二级类目
			supplierList: [], //供应商列表
			categoryList: [], //类目列表
			brandList: [], //品牌列表
			addVisible: false,
			editVisible: false,
			passWordVisible: false,
		};
	},
	computed: {
		getGoodsListPage() {
			return getGoodsListPage;
		},
	},
	mounted() {
		this.initData();
	},

	methods: {
		initData() {
			this.getBrand();
			this.getCategoryQuery();
		},
		//   添加
		add() {
			this.$router.push('/mall/goodsList/goodsForm');
		},
		// 重置
		resetForm(formName) {
			this.$refs[formName].resetFields();
			// this.$refs.adminList.reset();
			console.log(this.searchfrom);
			this.searchfrom = {
				goodsName: '',
				goodsId: '',
				catId: '',
				brandId: '',
				supplierId: '',
				onSale: '',
				// newFlag: '',
				categoryId: '',
			};
		},
		onChange(value) {
			console.log(value);
			this.searchfrom.catId = value[1];
			// delete this.searchfrom.categoryId
		},
		//搜索
		onClickSearch() {
			// delete this.searchfrom.categoryId;
			this.$refs.adminList.update({ ...this.searchfrom });
		},
		// 导出发货单
		// exportGoods() {
		// 	// 封装数据
		// 	const _tempSoure = { ...this.searchfrom };
		// 	delete _tempSoure.categoryId;
		// 	let _par = '?';
		// 	for (let obj in _tempSoure) {
		// 		if (_tempSoure[obj]) {
		// 			_par += `${obj}=${_tempSoure[obj]}&`;
		// 		}
		// 	}
		// 	// console.log(_par);

		// 	let url = `${process.env.VUE_APP_BASE_API}/adminApi/item/export${_par}`;
		// 	window.open(url);
		// },

		//上架
		putOnGoods(goodsId, onSale) {
			goodsOnSale({ goodsId: goodsId, onSale: onSale })
				.then(res => {
					if (res.code == 200) {
						Message.success('操作成功！');
						this.$refs.adminList.update();
					}
				})
				.catch(() => {
					this.$refs.adminList.update();
				});
		},

		// 获取品牌
		getBrand() {
			this.loading = true;
			getBrandList({ size: 100 }).then(res => {
				console.log(res);
				if (res.code == 200) {
					this.brandList = res.data;
					this.loading = false;
				}
			});
		},
		getCategoryQuery() {
			getCategoryList({ size: 100 }).then(res => {
				if (res.code == 200) {
					this.categoryList = res.data.records;
				}
			});
		},
	},
};
</script>

<style lang="scss" scoped>
@import url('~@/styles/common.scss');
.admin_avater {
	height: 40px;
	width: 40px;
}
.stockBtn {
	color: red;
}
ul {
	padding: 0;
	margin: 0;
}
ul li {
	list-style: none;
	// border-bottom: 1px solid #ccc;
	// padding: 10px 0;
	p {
		margin: 0;
		line-height: 24px;
	}
}
ul :last-child {
	border: none;
}
h4 {
	margin: 0;
}
</style>
