/*
 * @Author: yueshaoyuan
 * @Date: 2021-06-10
 * @LastEditors: aa
 * @LastEditTime: 2021-07-05 13:28:15
 * @Descripttion:
 */
import request from '@/utils/request';

// 获取商品品牌列表
export function getBrandList(data) {
	return request({
		url: '/admin/scoreshop/goodsBrand/list',
		method: 'get',
		data,
	});
}
// 获取新增品牌
export function addGoodsBrand(data) {
	return request({
		url: '/admin/scoreshop/goodsBrand/add',
		method: 'post',
		data,
	});
}
//编辑品牌
export function editGoodsBrand(data) {
	return request({
		url: '/admin/scoreshop/goodsBrand/edit',
		method: 'post',
		data,
	});
}
// 删除品牌
export function delGoodsBrand(data) {
	return request({
		url: '/admin/scoreshop/goodsBrand/delete',
		method: 'delete',
		data,
	});
}

// 物流配置列表
export function getLogisticsList(data) {
	return request({
		url: '/admin/scoreshop/logistics/list',
		method: 'get',
		data,
	});
}
// 物流配置详情
export function logisticsInfo(data) {
	return request({
		url: '/admin/scoreshop/logistics/info',
		method: 'get',
		data,
	});
}
// 编辑物流配置
export function editLogistics(data) {
	return request({
		url: '/admin/scoreshop/logistics/edit',
		method: 'post',
		data,
	});
}
// 删除物流配置
export function delLogistics(data) {
	return request({
		url: '/admin/scoreshop/logistics/delete',
		method: 'delete',
		data,
	});
}
// 新增物流配置
export function addLogistics(data) {
	return request({
		url: '/admin/scoreshop/logistics/add',
		method: 'post',
		data,
	});
}
// 支持服务列表
export function getGoodsSupportList(data) {
	return request({
		url: '/admin/scoreshop/goodsSupport/list',
		method: 'get',
		data,
	});
}
// 支持服务详情
export function goodsSupportInfo(data) {
	return request({
		url: '/admin/scoreshop/goodsSupport/info',
		method: 'get',
		data,
	});
}
// 编辑支持服务
export function editGoodsSupport(data) {
	return request({
		url: '/admin/scoreshop/goodsSupport/edit',
		method: 'post',
		data,
	});
}
// 删除支持服务
export function delGoodsSupport(data) {
	return request({
		url: '/admin/scoreshop/goodsSupport/delete',
		method: 'delete',
		data,
	});
}
// 新增支持服务
export function addGoodsSupport(data) {
	return request({
		url: '/admin/scoreshop/goodsSupport/add',
		method: 'post',
		data,
	});
}

// 查询商品详情
export function getGoods(data) {
	return request({
		url: '/admin/scoreshop/goodsSupport/add',
		method: 'get',
		data,
	});
}

// 商品相关接口
export function getGoodListApi(data) {
	return request({
		url: '/admin/scoreshop/goods/find',
		method: 'get',
		data,
	});
}
export function getGoodsListPage(data) {
	return request({
		url: '/admin/scoreshop/goods/list',
		method: 'get',
		data,
	});
}
export function getGoodDetail(data) {
	return request({
		url: '/admin/scoreshop/goods/info',
		method: 'get',
		data,
	});
}

export function editGoodsAPI(data) {
	return request({
		url: '/admin/scoreshop/goods/edit',
		method: 'post',
		data,
	});
}
export function goodsOnSale(data) {
	return request({
		url: '/admin/scoreshop/goods/onSale',
		method: 'put',
		data,
	});
}

export function addGoodsAPI(data) {
	return request({
		url: '/admin/scoreshop/goods/add',
		method: 'post',
		data,
	});
}

// banner 新增banner
export function addBanner(data) {
	return request({
		url: '/admin/scoreshop/banner/add',
		method: 'post',
		data,
	});
}
// banner 删除banner
export function delBanner(data) {
	return request({
		url: '/admin/scoreshop/banner/delete',
		method: 'delete',
		data,
	});
}
// banner 编辑banner
export function editBanner(data) {
	return request({
		url: '/admin/scoreshop/banner/edit',
		method: 'post',
		data,
	});
}
// banner banner详情
export function detailBanner(data) {
	return request({
		url: '/admin/scoreshop/banner/info',
		method: 'get',
		data,
	});
}
// banner banner列表
export function bannerList(data) {
	return request({
		url: '/admin/scoreshop/banner/list',
		method: 'get',
		data,
	});
}
// banner 上下架
export function isShow(data) {
	return request({
		url: '/admin/scoreshop/banner/isShow',
		method: 'post',
		data,
	});
}

// 订单列表
export function getOrderList(data) {
	return request({
		url: '/admin/scoreshop/order/list',
		method: 'get',
		data,
	});
}
// 订单详情
export function getOrderDetail(data) {
	return request({
		url: '/admin/scoreshop/order/info',
		method: 'get',
		data,
	});
}

// 订单发货
export function orderDelivery(data) {
	return request({
		url: '/admin/scoreshop/order/delivery',
		method: 'post',
		data,
	});
}
// 修改物流信息
export function ediOrdertLogistics(data) {
	return request({
		url: '/admin/scoreshop/order/editLogistics',
		method: 'post',
		data,
	});
}
// 获取订单规则
export function getOrderRule(data) {
	return request({
		url: '/admin/scoreshop/config/orderRule',
		method: 'get',
		data,
	});
}
// 到处订单
export function exportOrder(data) {
	return request({
		url: '/admin/scoreshop/order/list/export',
		method: 'get',
		data,
	});
}
// 批量处理发货单
export function Invoice(data) {
	return request({
		url: '/admin/scoreshop/order/deliver/import',
		method: 'post',
		data,
	});
}
