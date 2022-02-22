<!--
 * @Author: wei.chen
 * @Date: 2020-06-17 12:22:39
 * @LastEditTime: 2021-07-06 10:31:28
 * @LastEditors: wei.chen
 * @Description: 
-->
<template>
	<el-form
		ref="goodsForm"
		:model="goodsForm"
		:rules="rules"
		class="goodsForm"
		label-position="right"
		label-width="100px"
	>
		<el-form-item label="选择类目" :required="true" prop="categoryObj.categoryId">
			<el-select
				v-model.trim="goodsForm.categoryObj"
				value-key="categoryId"
				placeholder="选择商品类目"
				:loading="loading"
				@focus="getParentCat"
				size="small"
				class="same_width"
			>
				<el-option
					:label="item.categoryName"
					:value="{ categoryId: item.categoryId, categoryName: item.categoryName }"
					v-for="item in parentCatList"
					:key="item.categoryId"
				></el-option>
			</el-select>
		</el-form-item>

		<el-form-item label="品牌" :required="true" prop="brandObj.brandId">
			<!-- {{ goodsForm.brandObj }}
			{{ brandList }} -->
			<el-select
				v-model.trim="goodsForm.brandObj"
				value-key="brandId"
				placeholder="品牌"
				:loading="loading"
				@focus="getBrand"
				size="small"
				class="same_width"
			>
				<el-option
					:label="item.brandName"
					:value="{ brandId: item.brandId, brandName: item.brandName }"
					v-for="item in brandList"
					:key="item.brandId"
				></el-option>
			</el-select>
		</el-form-item>

		<el-form-item label="商品编码" v-if="goodsForm.goodsId">
			<el-input
				v-model.trim="goodsForm.goodsId"
				placeholder="请输入自定义编码"
				:disabled="true"
				size="small"
				class="same_width"
			></el-input>
		</el-form-item>
		<el-form-item label="商品名称" prop="goodsName">
			<el-input
				v-model.trim="goodsForm.goodsName"
				placeholder="请输入商品名称"
				maxlength="60"
				size="small"
				class="same_width"
			></el-input>
		</el-form-item>
		<el-form-item label="商品简介" prop="summary">
			<el-input
				type="textarea"
				:autosize="{ minRows: 4, maxRows: 6 }"
				v-model.trim="goodsForm.summary"
				maxlength="120"
				size="small"
				style="width:50%"
				class="same_width"
			></el-input>
		</el-form-item>
		<el-form-item label="支持服务" prop="supportList">
			<el-checkbox-group v-model.trim="goodsForm.supportList">
				<el-checkbox
					:label="item.id"
					v-for="item in serviceList"
					:key="'service_' + item.id"
				>
					{{ item.supportName }}
				</el-checkbox>
			</el-checkbox-group>
		</el-form-item>
		<el-form-item label=" 计量单位" prop="unit">
			<el-input
				v-model.trim="goodsForm.unit"
				placeholder="请输入商品名称"
				maxlength="2"
				size="small"
				class="same_width"
			></el-input>
		</el-form-item>

		<el-form-item label="商品轮播图" :required="true" prop="carouselUrls">
			<UploadImgDrag v-model="goodsForm.carouselUrls" :limit="9"></UploadImgDrag>
		</el-form-item>

		<el-form-item label="商品封面图" :required="true" prop="coverUrl">
			<UploadImgDrag v-model="goodsForm.coverUrl"></UploadImgDrag>
		</el-form-item>
	</el-form>
</template>

<script>
import CropperImg from '@/components/cropperImg/index';
import UploadImg from '@/components/upload';
import UploadImgDrag from '@/components/uploadDrag';
import { getCategoryList } from '@/api/cat';
// import { getList, getBrandList } from '@/api/supplier';
import { getGoodsSupportList, getBrandList } from '@/api/mall';
import { Message } from 'element-ui';
export default {
	components: {
		CropperImg,
		UploadImg,
		UploadImgDrag,
	},
	props: ['detailData'],
	data() {
		const checkedString = (rule, value, callback) => {
			if (value === '') {
				return callback(new Error('请输入商品货号'));
			} else if (!/^[A-Za-z0-9]{4,40}$/.test(value)) {
				return callback(new Error('请输入字母、数字组成的货号'));
			} else {
				callback();
			}
		};
		const checkCountNum = (rule, value, callback) => {
			if (!/^([1-9][0-9]{0,4}|([0]))$/.test(value)) {
				return callback(new Error('请输入0 或者是大于零正整数'));
			} else {
				callback();
			}
		};
		return {
			listQuery: {
				current: 1,
				size: 100,
			},
			parentCatList: [], // 类目一
			supplierList: [], //供应商列表
			brandList: [], //品牌列表
			serviceList: [], //服务列表
			loading: false, //远程加载
			goodsForm: {
				categoryObj: {
					categoryId: '',
					categoryName: '',
				},

				brandObj: {
					brandId: '',
					brandName: '',
				},

				goodsName: '',
				summary: '',

				supportList: [],
				unit: '',
				coverUrl: '',
				carouselUrls: [''],
				goodsId: '', //商品编码
			},
			data: '',
			rules: {
				goodsName: {
					type: 'string',
					required: true,
					message: '商品名称不能为空！',
					trigger: 'blur',
				},
				fakeSaleCount: {
					validator: checkCountNum,
					required: true,
					// message: '商品货号不能为空！',
					trigger: 'blur',
				},
				summary: {
					type: 'string',
					required: true,
					message: '商品简介不能为空！',
					trigger: 'blur',
				},
				supportList: {
					required: true,
					message: '支持服务不能为空！',
				},
				unit: {
					required: true,
					message: '请输入',
				},
				coverUrl: { type: 'url', required: true, message: '封面图不能为空！' },
				carouselUrls: {
					required: true,
					message: '轮播图不能为空！',
				},

				'categoryObj.categoryId': {
					required: true,
					message: '类目不能为空！',
				},
				'brandObj.brandId': {
					required: true,
					message: '品牌不能为空！',
				},
			},
		};
	},
	mounted() {
		this.getService();
		// this.getParentCat();
		// this.getBrand();
	},
	watch: {
		detailData(newValue, oldValue) {
			if (newValue === oldValue) {
				return false;
			}

			this.data = newValue;
			//  获取基础数据

			let {
				categoryId,
				categoryName,
				brandId,
				brandName,
				goodsName,
				summary,
				intro,
				supportList,
				unit,
				coverUrl,
				carouselUrls,
				goodsId,
			} = this.data;

			const _supportList = [];
			supportList.forEach(item => {
				_supportList.push(item.supportId);
			});
			supportList = [..._supportList];

			let arr = carouselUrls.split(',');

			carouselUrls = arr;
			// 封装表单数据

			this.goodsForm = {
				categoryObj: {
					categoryId,
					categoryName,
				},
				brandObj: {
					brandId,
					brandName,
				},
				goodsName: goodsName,
				summary: intro,
				supportList,
				unit,
				coverUrl: coverUrl,
				carouselUrls,
				goodsId,
			};
			// 这里必须在渲染列表中默认写入值 才能显示 important

			// this.parentCatList = [{ id: categoryId + '', goodsName: categoryName }];
			// this.brandList = [{ id: brandId + '', goodsName: brandName }];

			this.parentCatList.push(this.goodsForm.categoryObj);
			this.brandList.push(this.goodsForm.brandObj);
			this.$forceUpdate();
			// this.$set(this.goodsForm, this.goodsForm.categoryObj, { categoryId, categoryName });
		},
	},
	methods: {
		// 二级类目切换
		classChangeHandle() {
			this.data.itemSkuList = [];
			// 如果切换了二级类目就需要 清空sku 信息
		},
		// 获取类目
		getParentCat(val) {
			this.loading = true;

			getCategoryList({
				...this.listQuery,
			}).then(res => {
				if (res.code == 200) {
					const _tempList = [];
					res.data.records.forEach(item => {
						_tempList.push({
							categoryId: item.id,
							categoryName: item.categoryName,
						});
					});
					this.parentCatList = _tempList;
					this.loading = false;
					this.$forceUpdate();
				}
			});
		},

		// 获取品牌
		getBrand() {
			this.loading = true;
			getBrandList({
				size: 100,
			}).then(res => {
				if (res.code == 200) {
					const _tempList = [];
					res.data.forEach(item => {
						_tempList.push({
							brandId: item.id + '',
							brandName: item.brandName,
						});
					});
					this.brandList = _tempList;
					this.loading = false;
					this.$forceUpdate();
				}
			});
		},
		// 获取支持服务
		getService() {
			getGoodsSupportList({ ...this.listQuery }).then(res => {
				if (res.code == 200) {
					this.serviceList = res.data;
					this.loading = false;
				}
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.goodsForm {
	padding-top: 50px;
	width: 60%;
	margin: 0 auto;
	.same_width {
		width: 310px;
	}
}
.href {
	color: dodgerblue;
	&:hover {
		color: dodgerblue;
	}
}
</style>
