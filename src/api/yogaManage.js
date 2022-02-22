/*
 * @Author: wei.chen
 * @Date: 2020-06-11 11:46:00
 * @LastEditTime: 2021-09-17 13:08:30
 * @LastEditors: jiu yin zhen jing
 * @Description:瑜伽模块
 */

import request from '@/utils/request';

const _baseUrl = '/admin';

// 创建分类
export function addScreen(data) {
	return request({
		url: '/admin/yoga-category/add',
		method: 'POST',
		data,
	});
}
// 获取分类列表
export function getScreenList(data) {
	return request({
		url: '/admin/yoga-category/listbytype',
		method: 'get',
		data,
	});
}
// 获取分类列表
export function getScreenItem(data) {
	return request({
		url: `/admin/yoga-category/${data.id}`,
		method: 'get',
		data,
	});
}
// 编辑分类
export function editSubScreen(data) {
	return request({
		url: `/admin/yoga-category/update/${data.id}`,
		method: 'put',
		data,
	});
}

// 编辑分类
export function editSubState(data) {
	return request({
		url: `/admin/yoga-category/update/state/${data.id}`,
		method: 'put',
		data,
	});
}

// 编辑一级分类名称
export function editScreen(data) {
	return request({
		url: `/admin/yoga-category/update/state/${data.id}`,
		method: 'put',
		data,
	});
}

// 删除分类
export function delSubScreen(data) {
	return request({
		url: `/admin/yoga-category/${data.id}`,
		method: 'delete',
		data,
	});
}
// =======tab ==============
// 获取分类列表
export function getHomeTabList(data) {
	return request({
		url: '/admin/tab/get/list',
		method: 'get',
		data,
	});
}
// 获取分类列表
export function editHomeTab(data) {
	return request({
		url: `/admin/tab/update/${data.id}`,
		method: 'put',
		data,
	});
}
// 获取分类列表
export function bannedHomeTab(data) {
	return request({
		url: `/admin/tab/update/enable/${data.id}`,
		method: 'put',
		data,
	});
}
// 编辑分类
export function getHomeTab(data) {
	return request({
		url: `/admin/tab/get/show`,
		method: 'put',
		data,
	});
}
// 获取校长专区信息
export function getHeadmaster(data) {
	return request({
		url: `/admin/zone/open/headmaster`,
		method: 'get',
		data,
	});
}
// 获取冥想与智慧列表
export function getMeditation(data) {
	return request({
		url: `/admin/zone/open/meditation/list`,
		method: 'get',
		data,
	});
}
//更新校长专区信息
export function updateHeadmaster(data) {
	return request({
		url: `/admin/zone/open/update`,
		method: 'post',
		data,
	});
}
// 精品课程列表
export function getCoursesList(data) {
	return request({
		url: `/admin/excellent/courses/list`,
		method: 'get',
		data,
	});
}
// 精品课程类型选择
export function getCoursesType(data) {
	return request({
		url: `/admin/excellent/courses/type`,
		method: 'get',
		data,
	});
}
// 精品课程选择类型后获取的课程资源list
export function getResourceList(data) {
	return request({
		url: `/admin/excellent/courses/resource/list`,
		method: 'get',
		data,
	});
}
// 精品课程添加保存
export function addCourses(data) {
	return request({
		url: `/admin/excellent/courses/save`,
		method: 'post',
		data,
	});
}
// 精品课程单个获取
export function getTetails(data) {
	return request({
		url: `/admin/excellent/courses/detail/${data.id}`,
		method: 'get',
		data,
	});
}
// 修改精品课程
export function updateCourese(data) {
	return request({
		url: `/admin/excellent/courses/update`,
		method: 'post',
		data,
	});
}
// 精品课程启停
export function changeCourese(data) {
	return request({
		url: `/admin/excellent/courses/state/change/${data.id}`,
		method: 'get',
		data,
	});
}
// 精品课程删除
export function delCourses(data) {
	return request({
		url: `/admin/excellent/courses/delete/${data}`,
		method: 'delete',
		data,
	});
}


// 课程订单接口 分页查询
export const courseOrderList= data => {
  return request({
    url: `/admin/courseOrder/list`,
    method: 'GET',
    data,
  });
}
