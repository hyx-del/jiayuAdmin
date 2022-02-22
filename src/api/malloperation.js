/*
 * @Author: yueshaoyuan
 * @Date: 2021-06-10
 * @LastEditors:  yueshaoyuan
 * @LastEditTime: 2021-06-10
 * @Descripttion:
 */
import request from '@/utils/request';

// 现时抢购活动列表
export function getActivityList(data) {
	return request({
		url: '/admin/scoreshop/activity/list',
		method: 'get',
		data,
	});
}
// 商品类目列表(下拉框的那个)
export function getBrief(data) {
	return request({
		url: '/admin/scoreshop/goodsCategory/list/brief',
		method: 'get',
		data,
	});
}
// 商品接口
export function goodsFind(data) {
	return request({
		url: '/admin/scoreshop/goods/find',
		method: 'get',
		data,
	});
}
// 启用/禁用活动
export function enabled(data) {
	return request({
		url: '/admin/scoreshop/activity/enabled',
		method: 'put',
		data,
	});
}
// 获取商品规格
export function getFindSpec(data) {
	return request({
		url: '/admin/scoreshop/goods/findSpec',
		method: 'get',
		data,
	});
}
// 新增活动
export function addActivity(data) {
	return request({
		url: '/admin/scoreshop/activity/add',
		method: 'post',
		data,
	});
}
// 活动信息（编辑回显）
export function activityInfo(data) {
	return request({
		url: '/admin/scoreshop/activity/info',
		method: 'get',
		data,
	});
}
// 编辑活动
export function editActivity(data) {
	return request({
		url: '/admin/scoreshop/activity/edit',
		method: 'post',
		data,
	});
}
// 移除活动
export function delActivity(data) {
	return request({
		url: '/admin/scoreshop/activity/remove',
		method: 'delete',
		data
	});
}
// 终止活动
export function terminateActivity(data) {
	return request({
		url: '/admin/scoreshop/activity/terminate',
		method: 'put',
		data
	});
}
// 活动明细
export function infoWithStat(data) {
	return request({
		url: '/admin/scoreshop/activity/infoWithStat',
		method: 'get',
		data
	});
}
// 活动商品明细列表
export function goodsDetailsList(data) {
	return request({
		url: '/admin/scoreshop/activity/goodsDetailsList',
		method: 'get',
		data
	});
}
// 热销推荐--新增热销商品
export function addHostSale(data) {
	return request({
		url: '/admin/scoreshop/hostSale/add',
		method: 'post',
		data
	});
}
// 编辑热销商品
export function editHostSale(data) {
	return request({
		url: '/admin/scoreshop/hostSale/edit',
		method: 'post',
		data
	});
}
// 热销商品列表
export function hostSaleList(data) {
	return request({
		url: '/admin/scoreshop/hostSale/list',
		method: 'get',
		data
	});
}
// 删除热销商品
export function delHostSale(data) {
	return request({
		url: '/admin/scoreshop/hostSale/remove',
		method: 'delete',
		data
	});
}