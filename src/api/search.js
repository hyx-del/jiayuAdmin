/*
* search
* 包含接口：id查询热门搜索表(searchDetail),查询热门搜索表分页数据(searchList),新增热门搜索表(searchSavePost),状态启停(stateChangePut),更新热门搜索表(searchUpdatePut),
*
*/
import request from '@/utils/request';


// id查询热门搜索表
export const searchDetail= data => {
  return request({
    url: `admin/hot/search/detail`,
    method: 'GET',
    data,
  });
}

// 查询热门搜索表分页数据
export const searchList= data => {
  return request({
    url: `admin/hot/search/list`,
    method: 'GET',
    data,
  });
}

// 新增热门搜索表
export const searchSavePost= data => {
  return request({
    url: `admin/hot/search/save`,
    method: 'POST',
    data,
  });
}

// 状态启停
export const stateChangePut= data => {
  return request({
    url: `admin/hot/search/state/change/${data.id}`,
    method: 'PUT',
    data,
  });
}

// 更新热门搜索表
export const searchUpdatePut= data => {
  return request({
    url: `admin/hot/search/update`,
    method: 'PUT',
    data,
  });
}


// excelOutPut
export const historyExcelOutPut= data => {
  return request({
    url: `admin/search/history/excelOutPut`,
    method: 'GET',
    data,
  });
}

// 查询数据表分页数据
export const historyList= data => {
  return request({
    url: `admin/search/history/list`,
    method: 'GET',
    data,
  });
}
