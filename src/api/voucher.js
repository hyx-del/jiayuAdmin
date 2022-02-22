/*
 * @Author: jiu yin
 * @Date: 2021-09-24 14:52:07
 * @LastEditTime: 2021-09-26 10:39:15
 * @LastEditors: jiu yin zhen jing
 * @Description: 666
 * @FilePath: \jiayu_admin\src\api\voucher.js
 *  “jiu”
 */
import request from '@/utils/request';

// 代金券列表
export function voucherList(data) {
	return request({
		url: '/admin/voucher/list',
		method: 'post',
		data,
	});
}
// 代金券新增
export function voucherAdd(data) {
	return request({
		url: '/admin/voucher/add',
		method: 'post',
		data,
	});
}
// 代金券电话查询
export function selectUserByPhone(data) {
	return request({
		url: '/admin/voucher/selectUserByPhone',
		method: 'post',
		data,
	});
}
// 代金券删除
export function voucherDelete(data) {
	return request({
		url: '/admin/voucher/delete',
		method: 'post',
		data,
	});
}
// 修改核销备注
export function voucherUpdateUseRemarks(data) {
	return request({
		url: '/admin/voucher/updateUseRemarks',
		method: 'post',
		data,
	});
}
// 代金券核销
export function voucherUse(data) {
	return request({
		url: '/admin/voucher/useVoucher',
		method: 'post',
		data,
	});
}