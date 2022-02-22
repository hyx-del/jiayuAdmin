/*
 * @Author: jiu yin
 * @Date: 2021-07-23 11:30:39
 * @LastEditTime: 2021-08-30 11:48:42
 * @LastEditors: jiu yin zhen jing
 * @Description: 666
 * @FilePath: \jiayu_admin\src\api\dataCenter.js
 *  “”
 */

import request from '@/utils/request';

const _baseUrl = '/admin';
// 瑜伽课程排行
export function courseListBoard(data) {
	return request({
		url: `${_baseUrl}/dashboard/courseListBoard`,
		method: 'get',
		data,
	});
}
// 连续练习天数排行
export function dayContinueBoard(data) {
	return request({
		url: `${_baseUrl}/dashboard/dayContinueBoard`,
		method: 'get',
		data,
	});
}
// 累计练习时长（天数）排行
export function daySumBoard(data) {
	return request({
		url: `${_baseUrl}/dashboard/daySumBoard`,
		method: 'get',
		data,
	});
}
// 日练习时长（分钟）排行/dashboard​/minuteBoard
export function minuteBoard(data) {
	return request({
		url: `${_baseUrl}/dashboard/minuteBoard`,
		method: 'get',
		data,
	});
}
// 累计时长（分钟）排行
export function minuteSumBoard(data) {
	return request({
		url: `${_baseUrl}/dashboard/minuteSumBoard`,
		method: 'get',
		data,
	});
}

// 冥想排行
export function meditationBoard(data) {
	return request({
		url: `${_baseUrl}/dashboard/meditationBoard`,
		method: 'get',
		data,
	});
}
// 幸福智慧排行
export function jnanaBoard(data) {
	return request({
		url: `${_baseUrl}/dashboard/jnanaBoard`,
		method: 'get',
		data,
	});
}
// 积分排行
export function scoreBoard(data) {
	return request({
		url: `${_baseUrl}/dashboard/scoreBoard`,
		method: 'get',
		data,
	});
}


// 用户注册汇总统计
export function registerSum(data) {
	return request({
		url: `${_baseUrl}/dashboard/registerSum`,
		method: 'get',
		data,
	});
}

// 用户注册曲线数据
export function registerCurve(data) {
	return request({
		url: `${_baseUrl}/dashboard/registerCurve`,
		method: 'get',
		data,
	});
}
// 日报分页数据
export function registerDaiy(data) {
	return request({
		url: `${_baseUrl}/dashboard/list`,
		method: 'get',
		data,
	});
}