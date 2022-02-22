/*
 * @Author: zx
 * @Date: 2021/5/24 11:23
 * @LastEditTime: 2021-06-21 13:43:42
 * @LastEditors: wei.chen
 * @Description:积分任务
 */

import request from '@/utils/request';

/*
 * 积分任务*/
const basic = '/admin/score';

// 更新新手任务规则
export function editNewUserTaskRule(data) {
	return request({
		url: `${basic}/task/novice`,
		method: 'put',
		data,
	});
}

// 获取新手规则
export function getNewUserTaskRule(data) {
	return request({
		url: `${basic}/task/novice/list`,
		method: 'get',
		data,
	});
}

// 新手任务修改日志记录
export function getNewUserTaskLogList(data) {
	return request({
		url: `${basic}/task/log/novice//list`,
		method: 'get',
		data,
	});
}
// ===================Everyday task =====================
// 更新每日任务规则
export function editEverydayTaskRule(data) {
	return request({
		url: `${basic}/task/everyday`,
		method: 'put',
		data,
	});
}

// 获取每日任务规则
export function getEverydayTaskRule(data) {
	return request({
		url: `${basic}/task/everyday/list`,
		method: 'get',
		data,
	});
}

// 每日任务修改日志记录
export function getEverydayTaskLogList(data) {
	return request({
		url: `${basic}/task/log/everyday/list`,
		method: 'get',
		data,
	});
}
// ===================签到规则 =====================
// 更新每日任务规则
export function editSignTaskRule(data) {
	return request({
		url: `${basic}/task/sign`,
		method: 'put',
		data,
	});
}

// 获取每日任务规则
export function getSignTaskRule(data) {
	return request({
		url: `${basic}/task/sign/list`,
		method: 'get',
		data,
	});
}

// 每日任务修改日志记录
export function getSignTaskLogList(data) {
	return request({
		url: `${basic}/task/log/sign/list`,
		method: 'get',
		data,
	});
}
// ===============================积分明细================================
// 分页获取积分详情
export function getTaskScoreListInfo(data) {
	return request({
		url: `${basic}/point/rule/list`,
		method: 'get',
		data,
	});
}
// 添加积分
export function addTaskScore(data) {
	return request({
		url: `${basic}/point/save`,
		method: 'post',
		data,
	});
}
// 分页获取积分详情
export function getTaskScoreListDetail(data) {
	return request({
		url: `${basic}/point/list`,
		method: 'get',
		data,
	});
}

// 修改积分规则
export function editTaskScore(data) {
	return request({
		url: `${basic}/point/introduce/update`,
		method: 'post',
		data,
	});
}

export function getTaskScoreInfoDetail(data) {
	return request({
		url: `${basic}/point/introduce/detail`,
		method: 'get',
		data,
	});
}
