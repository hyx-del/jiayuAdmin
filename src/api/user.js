/*
 * @Author: wei.chen
 * @Date: 2020-06-15 12:32:38
 * @LastEditors: aa
 * @LastEditTime: 2021-06-30 16:43:07
 * @Descripttion:
 */

import request from '@/utils/request';

// 登录
export function login(data) {
	return request({
		url: '/admin/oauth/token',
		method: 'POST',
		data,
		ContentType: 'form',
	});
}

// 获取 C 端用户
export function getUserList(data) {
	return request({
		url: '/admin/user/get/app/list',
		method: 'get',
		data,
	});
}
// 获取 C 端用户详情
export function getAppUserDetail(data) {
	return request({
		url: `/admin/user/get/app/${data.id}`,
		method: 'get',
		data,
	});
}
// 获取 C 端用户登录记录
export function getAppUserLoginList(data) {
	return request({
		url: `/admin/record/login/list`,
		method: 'get',
		data,
	});
}
// 获取 C 端用户练习记录
export function getAppUserStudyList(data) {
	return request({
		url: `/admin/user-study/get/list`,
		method: 'get',
		data,
	});
}
// 获取 C 端用户学习进度
export function getAppUserExerciseList(data) {
	return request({
		url: `/admin/user-practice/get/list`,
		method: 'get',
		data,
	});
}
// 用户收货地址
export function getuserAddress(data) {
	return request({
		url: `/admin/scoreshop/user/userAddress`,
		method: 'get',
		data,
	});
}
// 用户自购记录
export function getuserOrder(data) {
	return request({
		url: `/admin/scoreshop/user/userOrder`,
		method: 'get',
		data,
	});
}

// 获取用户积分list
export function getUserScoreList(data) {
	return request({
		url: `/admin/score/point/user/list`,
		method: 'get',
		data,
	});
}
// 获取用户菜单
export function getMenuInfo(data) {
	return request({
		url: `/admin/account/info`,
		method: 'get',
		data,
	});
}
