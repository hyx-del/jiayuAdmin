/*
 * @Author: wei.chen
 * @Date: 2020-06-18 20:01:05
 * @LastEditors: wei.chen
 * @LastEditTime: 2020-09-04 15:57:22
 * @Descripttion:
 */
import request from '@/utils/request';

// 获取活动列表
export function getActivityList(data) {
	return request({
		url: '/adminApi/limitPromotions',
		method: 'get',
		data,
	});
}
// 仅获取活动信息
export function getActivityInfo(data) {
	return request({
		url: `/adminApi/limitPromotions/${data.id}`,
		method: 'get',
		data,
	});
}
// 获取活动全部信息（包含商品及SKU）
export function getAllActivityInfo(data) {
	return request({
		url: `/adminApi/limitPromotions/${data.id}/all`,
		method: 'get',
		data,
	});
}
// 添加活动
export function addActivity(data) {
	return request({
		url: `/adminApi/limitPromotions`,
		method: 'post',
		data,
	});
}
// 修改活动信息
export function editActivityInfo(data) {
	return request({
		url: `/adminApi/limitPromotions/${data.id}`,
		method: 'put',
		data,
	});
}
// 活动启用/禁用管理
export function banState(data) {
	return request({
		url: `/adminApi/limitPromotions/${data.id}/banOrEnable`,
		method: 'put',
		data,
	});
}
//  活动销售数据统计
export function getStatistics(data) {
	return request({
		url: `/adminApi/limitPromotions/${data.id}/statistics`,
		method: 'get',
		data,
	});
}
// 活动关联订单明细
export function getOrders(data) {
	return request({
		url: `/adminApi/limitPromotions/${data.id}/orders`,
		method: 'get',
		data,
	});
}
// 活动商品明细
export function getItems(data) {
	return request({
		url: `/adminApi/limitPromotions/${data.id}/items`,
		method: 'get',
		data,
	});
}
// 移除活动
export function removeActivity(data) {
	return request({
		url: `adminApi/limitPromotions/${data.id}`,
		method: 'delete',
		data,
	});
}
// 终止活动
export function termination(data) {
	return request({
		url: `adminApi/limitPromotions/${data.id}/termination`,
		method: 'put',
		data,
	});
}
