<!--
 * @Author: wei.chen
 * @Date: 2020-06-17 12:28:12
 * @LastEditTime: 2021-12-09 17:41:40
 * @LastEditors: jiu yin zhen jing
 * @Description:
-->
<template>
	<el-card class="goods_info_comp">
		<el-steps
			:active="active"
			finish-status="success"
			:align-center="true"
		>
			<el-step title="填写商品信息"></el-step>
			<el-step title="填写商品属性"></el-step>
		</el-steps>
		<el-tabs
			v-model.trim="tabs"
			class="goodsTbs"
		>
			<el-tab-pane
				name="first"
				:disabled="true"
			>
				<First
					ref="fristForm"
					:detailData="detailData"
				/>
			</el-tab-pane>
			<el-tab-pane
				name="second"
				:disabled="true"
			>
				<Second
					ref="secondForm"
					:detailData="detailData"
				/>
			</el-tab-pane>
		</el-tabs>
		<div
			v-if="active === 0"
			class="opreation"
		>
			<el-button
				style="margin-top: 12px;"
				@click="() => this.$router.back()"
			>取消</el-button>
			<el-button
				style="margin-top: 12px;"
				@click="next"
			>下一步</el-button>
		</div>
		<div
			v-else
			class="opreation"
		>
			<el-button
				style="margin-top: 12px;"
				@click="prev"
			>返回上一步</el-button>
			<el-button
				style="margin-top: 12px;"
				@click="create"
			>确定</el-button>
		</div>
	</el-card>
</template>

<script>
import First from "./addInformation.vue";
import Second from "./addSku.vue";
import { addGoodsAPI,editGoodsAPI,getGoodDetail } from "@/api/mall";
import { Message } from "element-ui";
export default {
	components: {
		First,
		Second,
	},
	data() {
		return {
			active: 0,
			tabs: "first",
			goodsId: this.$route.query.eId||null,
			detailData: "",
		};
	},
	mounted() {
		if(this.goodsId) {
			getGoodDetail({ goodsId: this.goodsId }).then((res) => {
				if(res.code===200) {
					this.detailData=res.data;
				}
			});
		}
	},
	methods: {
		next() {
			console.log("======>>val",this.$refs.fristForm.goodsForm);
			this.$refs.fristForm.$refs.goodsForm.validate((valid) => {
				if(valid) {
					this.active=2;
					this.tabs="second";

					const { categoryId }=this.$refs.fristForm.goodsForm.categoryObj;
					// const { categoryId } = this.$refs.fristForm.goodsForm.parentCatObj;

					this.$refs.secondForm.categoryId=categoryId;
					if(!this.goodsId) {
						if(categoryId) {
							// this.$refs.secondForm.getCatSpec({ categoryId });
							this.$refs.secondForm.goodsAttrListInfo({ categoryId });
						}
					} else {
						// 编辑
						this.$refs.secondForm.goodsAttrListInfo({ categoryId });
					}
					if(categoryId!=this.detailData.categoryId) {
						//  用户切换了分类，需要清空sku 列表集合
						this.$refs.secondForm.restoreSKUInfo();
					}
					// this.detailData = this.$refs.fristForm.goodsForm;
				}
			});
		},
		prev() {
			this.active=0;
			this.tabs="first";
		},
		// 创建商品 /编辑
		create() {
			// 第一步
			this.$refs.secondForm.$refs.infomationForm.validate((valid) => {
				// console.log('======>>this.$refs.secondForm', this.$refs.secondForm);
				if(valid) {
					// sku 表单验证
					let SKUdata=this.$refs.secondForm.SKUdata;
					let cashData=this.$refs.secondForm.payMode;

					if(!SKUdata.length) {
						return Message.error("sku不能为空！");
					}
					if(cashData) {
						for(let index=0;index<SKUdata.length;index++) {
							if(!SKUdata[index].cash) {
								return Message.error("现金价格不能为空！");
							}
						}
					}
					for(let index=0;index<SKUdata.length;index++) {
						if(!SKUdata[index].amount) {
							return Message.error("积分价格不能为空！");
						} else if(!SKUdata[index].stock) {
							return Message.error("商品库存不能为空！");
						} else if(!SKUdata[index].displayUrl) {
							return Message.error("展示图不能为空！");
						}
					}
					//  商品对象
					let goodsItem={
						brandId: 0,
						brandName: "",
						carouselUrls: "",
						categoryId: 0,
						categoryName: "",
						coverUrl: "",
						goodsName: "",
						infoUrls: "",
						intro: "",
						payMode: null,
						specList: [
							// 规格熟悉
							{
								amount: null,
								cash: null,
								displayUrl: "",
								specAttrList: [],
								stock: null,
								stockAlarm: null,
							},
						],
						supportList: [
							{
								supportId: -1,
								supportName: "",
							},
						],
						unit: "件",
					};

					let { unit,summary,goodsName,goodsId,coverUrl,categoryObj,carouselUrls,brandObj,supportList,parentCatList }=this.$refs.fristForm.goodsForm;
					let {
						serviceList, // 服务数据源
					}=this.$refs.fristForm;

					goodsItem.unit=unit;
					goodsItem.intro=summary;
					goodsItem.goodsName=goodsName;
					goodsItem.unit=unit;
					goodsItem.goodsId=goodsId;
					goodsItem.coverUrl=coverUrl;
					goodsItem.categoryId=categoryObj.categoryId;
					goodsItem.categoryName=categoryObj.categoryName;

					goodsItem.carouselUrls=carouselUrls.join(",");
					goodsItem.brandId=brandObj.brandId;
					goodsItem.brandName=brandObj.brandName;

					//  supportList  [3,4]  支持服务列表  需要去循环数据 parentCatList 封装数据结构
					let _tempSupportList=[];
					for(let i=0,serviceListLen=serviceList.length;i<serviceListLen;i++) {
						const item=serviceList[i];
						if(supportList.includes(item.id)) {
							_tempSupportList.push({
								supportId: item.id,
								supportName: item.supportName,
							});
						}
					}
					goodsItem.supportList=[..._tempSupportList];

					let { SKUcolumn,SKUList,goodsForm,payMode }=this.$refs.secondForm;
					let { infoUrls }=this.$refs.secondForm.infomationForm;

					let specList=[];
					goodsItem.payMode=payMode;
					goodsItem.infoUrls=infoUrls.join(",");
					// 第二步
					let sku=[];
					SKUcolumn.forEach((item,index) => {
						if(item.prop=="sku"+index) {
							sku.push(item.label);
						}
					});
					this.$refs.secondForm.SKUdata.forEach((item) => {
						let specAttrList=[];
						let skus=[]; //sku0 sku1 sku2
						Object.keys(item).forEach((j) => {
							if(/^sku/.test(j)) {
								skus.push(j);
							}
						});
						skus.forEach((y,index) => {
							// specAttrList += sku[index] + ':' + item[`${y}`] + ';';
							let _attrId="";

							SKUList.forEach((_skuItem) => {
								if(_skuItem.name===sku[index]) {
									_attrId=_skuItem.attrId;
								}
							});

							specAttrList.push({
								attrId: _attrId*1,
								attrName: sku[index],
								attrValue: item[`${y}`],
							});
						});
						specList.push({
							displayUrl: item.displayUrl,
							amount: item.amount? item.amount:null,
							//看状态积分还是现金
							cash: goodsItem.payMode? item.cash:0,
							stock: item.stock,
							stockAlarm: item.stockAlarm,
							specAttrList,
						});
					});
					goodsItem.specList=specList;

					// 添加loading
					const goodsLoading=this.$loading({
						lock: true,
						text: "Loading",
						spinner: "el-icon-loading",
						background: "rgba(0, 0, 0, 0.7)",
					});
					if(this.goodsId) {
						editGoodsAPI({
							goodsId,
							...goodsItem,
						})
							.then((res) => {
								// 取消loading
								goodsLoading.close();
								if(res.code==200) {
									Message.success("操作成功！");
									this.$router.push({name:"goodsList"});
								}
							})
							.catch(() => {
								goodsLoading.close();
							});
					} else {
						console.log(goodsItem);
						addGoodsAPI({ ...goodsItem })
							.then((res) => {
								// 取消loading
								goodsLoading.close();
								if(res.code==200) {
									Message.success("添加成功！");
									this.$router.push("goodsList");
								}
							})
							.catch(() => {
								goodsLoading.close();
							});
					}
				}
			});
		},
	},
};
</script>

<style>
.goodsTbs .el-tabs__header {
	display: none;
}
.goods_info_comp .opreation {
	width: 200px;
	margin: 0 auto;
}
</style>
