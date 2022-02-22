/*
 * @Author: zx
 * @Date: 2021/5/24 11:23
 * @LastEditTime: 2021-12-09 11:26:47
 * @LastEditors: jiu yin zhen jing
 * @Description:新闻管理
 */

import request from '@/utils/request';

/*
 * 百科栏目*/
const basic = '/admin/wiki';

// 列表
export function wikiList(data) {
	return request({
		url: `${basic}/get/list`,
		method: 'GET',
		data,
	});
}

// 修改百科顺序
export function wikiSort(data) {
	return request({
		url: `${basic}/sort/change`,
		method: 'GET',
		data,
	});
}



// 添加
export function wikiAdd(data) {
	return request({
		url: `${basic}/add`,
		method: 'POST',
		data,
	});
}

// 获取
export function getWiki(data) {
	return request({
		url: `${basic}/${data.id}`,
		method: 'GET',
		data,
	});
}
// 开启
export function enableWiki(data) {
	return request({
		url: `${basic}/put/enable/${data.id}`,
		method: 'PUT',
		data,
	});
}

// 获取百科下的课程
export function getWikiCourse(data) {
	return request({
		url: `${basic}/get/course/${data.id}`,
		method: 'GET',
		data,
	});
}

// 编辑百科关联课程 /wiki/put/course
export function putWikiCourse(data) {
	return request({
		url: `${basic}/put/course`,
		method: 'PUT',
		data,
	});
}
// 编辑百科关联教练 /wiki/put/course
export function putWikiCoach(data) {
	return request({
		url: `${basic}/put/coach`,
		method: 'PUT',
		data,
	});
}
// 获取百科关联教练
export function getWikiCoach(data) {
	return request({
		url: `${basic}/get/coach/${data.id}`,
		method: 'GET',
		data,
	});
}

// 修改
export function wikiUpdate(data) {
	return request({
		url: `${basic}/update/${data.id}`,
		method: 'PUT',
		data,
	});
}

// 删除
export function wikiDelete(data) {
	return request({
		url: `${basic}/delete/${data.id}`,
		method: 'DELETE',
		data,
	});
}

/*
 * 百科栏目 Column
 * */
const basic2 = '/admin/wiki-column';

// 列表
export function wikiColumnList(data) {
	return request({
		url: `${basic2}/get/list`,
		method: 'GET',
		data,
	});
}

// 添加
export function wikiColumnAdd(data) {
	return request({
		url: `${basic2}/add`,
		method: 'POST',
		data,
	});
}

// 获取
export function getWikiColumn(data) {
	return request({
		url: `${basic2}/${data.id}`,
		method: 'GET',
		data,
	});
}

// 开启
export function enableWikiColumn(data) {
	return request({
		url: `${basic2}/put/enable/${data.id}`,
		method: 'PUT',
		data,
	});
}

// 修改
export function wikiColumnUpdate(data) {
	return request({
		url: `${basic2}/update/${data.id}`,
		method: 'PUT',
		data,
	});
}

// 删除
export function wikiColumnDelete(data) {
	return request({
		url: `${basic}/delete/${data.id}`,
		method: 'DELETE',
		data,
	});
}
