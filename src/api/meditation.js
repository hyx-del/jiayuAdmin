/*
* Meditation liuzc Meditation Controller
* 包含接口：冥想删除(mediationDelete),冥想单个获取(mediationDetail),冥想列表(mediationList),冥想添加保存(mediationSavePost),状态启停(mediationStateChange),冥想修改(mediationUpdatePost),冥想练习分页(mediationUserPracticeList),
*
*/
import request from '@/utils/request';

// 冥想删除 id
export function mediationDelete(data) {
  return request({
    url: `/admin/mediation/delete/${data.id}`,
    method: 'GET',
    data,
  });
}

// 冥想单个获取 id
export function mediationDetail(data) {
  return request({
    url: `/admin/mediation/detail/${data.id}`,
    method: 'GET',
    data,
  });
}

// 冥想列表
export function mediationList(data) {
  return request({
    url: `/admin/mediation/list`,
    method: 'GET',
    data,
  });
}

// 冥想添加保存
export function mediationSavePost(data) {
  return request({
    url: `/admin/mediation/save`,
    method: 'POST',
    data,
  });
}

// 状态启停 id
export function mediationStateChange(data) {
  return request({
    url: `/admin/mediation/state/change/${data.id}`,
    method: 'GET',
    data,
  });
}

// 冥想修改
export function mediationUpdatePost(data) {
  return request({
    url: `/admin/mediation/update`,
    method: 'POST',
    data,
  });
}

// 冥想栏目顺序修改
export function upDataSort(data) {
  return request({
		url: `/admin/mediation/update/sort`,
		method: 'POST',
		data,
  });
}

// 冥想栏目----------------------------------
// 冥想练习分页
export function mediationUserPracticeList(data) {
  return request({
    url: `/admin/mediation/user/practice/list`,
    method: 'GET',
    data,
  });
}



// 冥想栏目删除 id
export function mediationColumnDelete(data) {
  return request({
    url: `/admin/mediation/column/delete/${data.id}`,
    method: 'GET',
    data,
  });
}

// 冥想栏目单个获取 id
export function mediationColumnDetail(data) {
  return request({
    url: `/admin/mediation/column/detail/${data.id}`,
    method: 'GET',
    data,
  });
}

// 冥想栏目列表
export function mediationColumnList(data) {
  return request({
    url: `/admin/mediation/column/list`,
    method: 'GET',
    data,
  });
}

// 冥想栏目添加保存
export function mediationColumnSavePost(data) {
  return request({
    url: `/admin/mediation/column/save`,
    method: 'POST',
    data,
  });
}

// 状态启停 id
export function mediationColumnStateChange(data) {
  return request({
    url: `/admin/mediation/column/state/change/${data.id}`,
    method: 'GET',
    data,
  });
}

// 冥想栏目修改
export function mediationColumnUpdatePost(data) {
  return request({
    url: `/admin/mediation/column/update`,
    method: 'POST',
    data,
  });
}



// 获取冥想监测说明
export const monitorDetail= data => {
  return request({
    url: `admin/mediation/monitor/detail`,
    method: 'GET',
    data,
  });
}

// 冥想监测说明修改
export const monitorUpdatePut= data => {
  return request({
    url: `admin/mediation/monitor/update`,
    method: 'PUT',
    data,
  });
}
// 查询BrainCo训练数据分析表分页数据
export const analysisList= data => {
  return request({
    url: `admin/brain/analysis/list`,
    method: 'GET',
    data,
  });
}
