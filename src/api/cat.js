/*
 * @Author: yueshaoyuan
 * @Date: 2021-06-10
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-06-15 14:14:54
 * @Descripttion:
 */
import request from '@/utils/request';

// 获取商品类目列表
export function getCategoryList(data) {
	return request({
		url: '/admin/scoreshop/goodsCategory/list',
		method: 'get',
		data,
	});
}

// 新增商品类目
export function addCategory(data) {
	return request({
		url: '/admin/scoreshop/goodsCategory/add',
		method: 'post',
		data,
	});
}

// 编辑商品类目
export function editCategory(data) {
	return request({
		url: '/admin/scoreshop/goodsCategory/edit',
		method: 'post',
		data,
	});
}
// 编辑导航栏是否显示
export function isShow(data) {
	return request({
		url: '/admin/scoreshop/goodsCategory/isShow',
		method: 'post',
		data,
	});
}
// 删除类目商品
export function delCategory(data) {
	return request({
		url: '/admin/scoreshop/goodsCategory/delete',
		method: 'delete',
		data,
	});
}
// 商品属性列表
export function goodsAttrList(data) {
	return request({
		url: '/admin/scoreshop/goodsAttr/list',
		method: 'get',
		data,
	});
}
// 新增商品属性
export function addgoodsAttr(data) {
	return request({
		url: '/admin/scoreshop/goodsAttr/add',
		method: 'post',
		data,
	});
}
// 编辑商品属性
export function editgoodsAttr(data) {
	return request({
		url: '/admin/scoreshop/goodsAttr/edit',
		method: 'post',
		data,
	});
}
// 删除商品属性
export function delgoodsAttr(data) {
	return request({
		url: '/admin/scoreshop/goodsAttr/remove',
		method: 'delete',
		data,
	});
}
