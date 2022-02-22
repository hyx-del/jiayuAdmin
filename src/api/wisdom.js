/*
* jnana
* 包含接口：智慧删除(jnanaDelete),智慧单个获取(jnanaDetail),智慧列表(jnanaList),智慧添加保存(jnanaSavePost),状态启停(jnanaStateChange),智慧修改(jnanaUpdatePost),智慧练习分页(jnanaUserPracticeList),
*
*/
import request from '@/utils/request';
// 智慧删除 id
export function jnanaDelete(data) {
  return request({
    url: `/admin/jnana/delete/${data.id}`,
    method: 'GET',
    data,
  });
}

// 智慧单个获取 id
export function jnanaDetail(data) {
  return request({
    url: `/admin/jnana/detail/${data.id}`,
    method: 'GET',
    data,
  });
}

// 智慧列表
export function jnanaList(data) {
  return request({
    url: `/admin/jnana/list`,
    method: 'GET',
    data,
  });
}

// 智慧添加保存
export function jnanaSavePost(data) {
  return request({
    url: `/admin/jnana/save`,
    method: 'POST',
    data,
  });
}

// 状态启停 id
export function jnanaStateChange(data) {
  return request({
    url: `/admin/jnana/state/change/${data.id}`,
    method: 'GET',
    data,
  });
}

// 智慧修改
export function jnanaUpdatePost(data) {
  return request({
    url: `/admin/jnana/update`,
    method: 'POST',
    data,
  });
}
// 智慧栏目顺序修改
export function jnanaUpdateSort(data) {
  return request({
		url: `/admin/jnana/update/sort`,
		method: 'POST',
		data,
  });
}

// 智慧练习分页
export function jnanaUserPracticeList(data) {
  return request({
    url: `/admin/jnana/user/practice/list`,
    method: 'GET',
    data,
  });
}

//----------------------栏目---------------------

// 智慧模块获取可用的栏目list
export const jananColumnColumnlist= data => {
  return request({
    url: `admin/janan/column/columnlist`,
    method: 'GET',
    data,
  });
}

// id查询数据表
export const jananColumnDetail= data => {
  return request({
    url: `admin/janan/column/detail`,
    method: 'GET',
    data,
  });
}

// 查询数据表分页数据
export const jananColumnList= data => {
  return request({
    url: `admin/janan/column/list`,
    method: 'GET',
    data,
  });
}

// 新增栏目
export const jananColumnSavePost= data => {
  return request({
    url: `admin/janan/column/save`,
    method: 'POST',
    data,
  });
}

// 状态启停
export const columnStateChange= data => {
  return request({
    url: `admin/janan/column/state/change`,
    method: 'PUT',
    data,
  });
}

// 更新栏目
export const jananColumnUpdatePut= data => {
  return request({
    url: `admin/janan/column/update`,
    method: 'PUT',
    data,
  });
}
