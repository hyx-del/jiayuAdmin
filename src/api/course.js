/*
 * @Author: zx
 * @Date: 2021/5/24 11:23
 * @LastEditTime: 2021-11-30 13:44:59
 * @LastEditors: jiu yin zhen jing
 * @Description:新闻管理
 */

import request from '@/utils/request';

/*
 * 课程*/
const basic = '/admin/course';

// 列表
export function listCourse(data) {
	return request({
		url: `${basic}/list`,
		method: 'GET',
		data,
	});
}
// 列表-推荐顺序编辑
export function courseSort(data) {
	return request({
		url: `${basic}/recommend/order/${data.id}`,
		method: 'PUT',
		data,
	});
}
// 列表-练习顺序编辑
export function courseSortPra(data) {
	return request({
		url: `${basic}/recommend/practise/order/${data.id}`,
		method: 'PUT',
		data,
	});
}
// 列表-编辑状态
export function courseEnable(data) {
	return request({
		url: `${basic}/enable/${data.id}`,
		method: 'PUT',
		data,
	});
}

// 列表-编辑推荐
export function courseRecommend(data) {
	return request({
		url: `${basic}/recommend/${data.id}`,
		method: 'PUT',
		data,
	});
}

// 列表-编辑练习推荐
export function coursePractise(data) {
	return request({
		url: `${basic}/recommend/practise/${data.id}`,
		method: 'PUT',
		data,
	});
}

// 列表-栏目的开启关闭
export function courseColumnEnable(data) {
	return request({
		url: `${basic}/column/put/enable/${data.id}`,
		method: 'PUT',
		data,
	});
}

// 添加
export function addCourse(data) {
	return request({
		url: `${basic}/add`,
		method: 'POST',
		data,
	});
}

// 获取
export function getCourse(data) {
	return request({
		url: `${basic}/${data.id}`,
		method: 'GET',
		data,
	});
}

// 添加课程的列表获取
export function getChoose(data) {
	return request({
		url: `${basic}/list/choose`,
		method: 'GET',
		data,
	});
}

// 课程的列表排序
export function getSort(data) {
	return request({
		url: `${basic}/column/sort/change/list`,
		method: 'POST',
		data,
	});
}

// 修改
export function updateCourse(data) {
	return request({
		url: `${basic}/update/${data.id}`,
		method: 'PUT',
		data,
	});
}

// 删除
export function deleteCourse(data) {
	return request({
		url: `${basic}/${data.id}`,
		method: 'DELETE',
		data,
	});
}

// 练习进度列表
export function userPractice(data) {
	return request({
		url: `/admin/user-practice/get/list`,
		method: 'GET',
		data,
	});
}

// 栏目
const basicColumn = '/admin/course/column';

// 添加
export function addColumnCourse(data) {
	return request({
		url: `${basicColumn}/add`,
		method: 'POST',
		data,
	});
}
// 编辑课程栏目 Column
export function getColumnCourse(data) {
	return request({
		url: `${basicColumn}/get/course/${data.id}`,
		method: 'GET',
		data,
	});
}

// 编辑课程栏目 Column
export function updateColumnCourse(data) {
	return request({
		url: `${basicColumn}/update/${data.id}`,
		method: 'PUT',
		data,
	});
}

// 删除课程栏目 Column
export function delColumnCourse(data) {
	return request({
		url: `${basicColumn}/delete/${data.id}`,
		method: 'DELETE',
		data,
	});
}

// 获取课程节次信息栏目 Column
export function getColumnList(data) {
	return request({
		url: `${basicColumn}/get/list`,
		method: 'GET',
		data,
	});
}
// 该课程购买记录分页查询
export const coursePurchaseList= data => {
  return request({
    url: `/admin/course-purchase/list`,
    method: 'GET',
    data,
  });
}
