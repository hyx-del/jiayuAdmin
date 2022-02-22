/*
 * @Author: zx
 * @Date: 2021/5/24 11:23
 * @LastEditTime: 2021-12-06 15:59:01
 * @LastEditors: jiu yin zhen jing
 * @Description:新闻管理
 */

import request from '@/utils/request';

const _baseUrl = '/admin';
// 添加新闻
export function newsAdd(data) {
	return request({
		url: `${_baseUrl}/news/add`,
		method: 'POST',
		data,
	});
}

// 获取新闻详情
export function getNews(data) {
	return request({
		url: `${_baseUrl}/news/${data.id}`,
		method: 'GET',
	});
}

// 编辑新闻
export function newsUpdate(data) {
	return request({
		url: `${_baseUrl}/news/update/${data.id}`,
		method: 'PUT',
		data,
	});
}

// 编辑新闻
export function newsDel(data) {
	return request({
		url: `${_baseUrl}/news/${data.id}`,
		method: 'DELETE',
		data,
	});
}

// 新闻列表
export function newslist(data) {
	return request({
		url: `${_baseUrl}/news/list`,
		method: 'GET',
		data,
	});
}
// 编辑新闻顺序
export function newsSort(data) {
	return request({
		url: `${_baseUrl}/news/put/sort`,
		method: 'PUT',
		data,
	});
}

// 新闻开启
export function newsEnable(data) {
	return request({
		url: `${_baseUrl}/news/enable/${data.id}`,
		method: 'PUT',
		data,
	});
}

// 编辑状态新闻
export function editNewsState(data) {
	return request({
		url: `${_baseUrl}/state/${data.id}`,
		method: 'PUT',
		data,
	});
}

// /news/get/content/course/{id}

// 获取新闻关联课程
export function newsGetCourse(data) {
	return request({
		url: `${_baseUrl}/news/get/course/${data.id}`,
		method: 'GET',
		data,
	});
}
// 编辑关联课程
export function newsPutCourse(data) {
	return request({
		url: `${_baseUrl}/news/put/course`,
		method: 'PUT',
		data,
	});
}

// 编辑关联课程 /news/put/coach
export function newsPutCoach(data) {
	return request({
		url: `${_baseUrl}/news/put/coach`,
		method: 'PUT',
		data,
	});
}

// 获取新闻关联教练
export function newsGetCoach(data) {
	return request({
		url: `${_baseUrl}/news/get/coach/${data.id}`,
		method: 'GET',
		data,
	});
}
