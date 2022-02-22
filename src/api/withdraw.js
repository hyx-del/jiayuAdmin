/*
 * @Author: wei.chen
 * @Date: 2020-07-18 15:35:42
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-01-18 10:30:01
 * @Descripttion:
 */
import request from '@/utils/request';

// 获取提现规则
export function getWithdrawrRule(data) {
	return request({
		url: '/adminApi/withdraw/rule',
		method: 'get',
		data,
	});
}
// 调整提现比例
export function editWithdrawrRule(data) {
	return request({
		url: '/adminApi/withdraw/rule',
		method: 'put',
		data,
	});
}

// 获取提现申请列表
export function getWithdrawrList(data) {
	return request({
		url: '/adminApi/withdraw',
		method: 'get',
		data,
	});
}

// 提现申请处理
export function handleWithdrawr(data) {
	return request({
		url: `/adminApi/withdraw/${data.id}`,
		method: 'put',
		data,
	});
}

// 导出数据
export function exportWithdraw(data) {
	return request({
		url: `/adminApi/withdraw/export`,
		method: 'get',
		data,
	});
}
