/*
 * @Author: wei.chen
 * @Date: 2020-06-11 11:46:00
 * @LastEditTime: 2021-12-06 14:08:30
 * @LastEditors: jiu yin zhen jing
 * @Description:教练模块
 */

import request from '@/utils/request';

// 创建  教练等级===========
export function addCoachLevel(data) {
	return request({
		url: '/admin/coach-level/add',
		method: 'POST',
		data,
	});
}
// 获取分类列表
export function getCoachLevelList(data) {
	return request({
		url: `/admin/coach-level/get/list`,
		method: 'get',
		data,
	});
}

// 删除
export function delCoachLevel(data) {
	return request({
		url: `/admin/coach-level/delete/${data.id}`,
		method: 'delete',
		data,
	});
}
// 编辑
export function editCoachLevel(data) {
	return request({
		url: `/admin/coach-level/update/${data.id}`,
		method: 'put',
		data,
	});
}
//  ==========教练等级end =============

// ============助教===========
// 创建
export function addAssistant(data) {
	return request({
		url: '/admin/assistant/add',
		method: 'POST',
		data,
	});
}
// 获取分类列表
export function getAssistantList(data) {
	return request({
		url: `/admin/assistant/get/list`,
		method: 'get',
		data,
	});
}

// 删除
export function delAssistant(data) {
	return request({
		url: `/admin/assistant/delete/${data.id}`,
		method: 'delete',
		data,
	});
}
// 编辑
export function editAssistant(data) {
	return request({
		url: `/admin/assistant/update/${data.id}`,
		method: 'put',
		data,
	});
}
// 修改顺序值
export function sortAssistant(data) {
	return request({
		url: `/admin/coaches/sort/change`,
		method: 'GET',
		data,
	});
}
//  ==========助教 end =============

// begin 教练========================
// 创建
export function addCoach(data) {
	return request({
		url: '/admin/coaches/add',
		method: 'POST',
		data,
	});
}
// 获取分类列表
export function getCoachesList(data) {
	return request({
		url: `/admin/coaches/get/list`,
		method: 'get',
		data,
	});
}

// 删除
export function delCoach(data) {
	return request({
		url: `/admin/coaches/state/change/${data.id}`,
		method: 'delete',
		data,
	});
}
// 启用
export function changeCoach(data) {
	return request({
		url: `/admin/coaches/state/change/${data.id}`,
		method: 'GET',
		data,
	});
}
// 编辑
export function editCoach(data) {
	return request({
		url: `/admin/coaches/update/${data.id}`,
		method: 'put',
		data,
	});
}
// 获取单个
export function getCoach(data) {
	return request({
		url: `/admin/coaches/${data.id}`,
		method: 'GET',
	});
}

// 关联课程 /coaches/course
export function coachesCourse(data) {
	return request({
		url: `/admin/coaches/course`,
		method: 'POST',
		data,
	});
}
// 关联百科 /coaches/wiki
export function coachesWiki(data) {
	return request({
		url: `/admin/coaches/wiki`,
		method: 'POST',
		data,
	});
}

// 获取教练的关联课程 /coaches/course
export function coachesGetCourse(data) {
	return request({
		url: `/admin/coaches/get/course/${data.id}`,
		method: 'GET',
		data,
	});
}

// 获取教练的关联课程 /coaches/course
export function coachesGetCourseNode(data) {
	return request({
		url: `/admin/coaches/get/course/node/${data.id}`,
		method: 'GET',
		data,
	});
}

// 获取教练的关联课程 /coaches/get/wiki/node/{id}
export function coachesGetWikiNode(data) {
	return request({
		url: `/admin/coaches/get/wiki/node/${data.id}`,
		method: 'GET',
		data,
	});
}
