/*
* 包含接口：新增时通过电话查询数据(adminUserBlacklistDetailbyphone),分页查询(adminUserBlacklistList),添加或修改数据或解禁(adminUserBlacklistUpdatePost),
*/
import request from '@/utils/request'

// 新增时通过电话查询数据
export const adminUserBlacklistDetailbyphone= data => {
  return request({
    url: `/admin/userBlacklist/detailbyphone`,
    method: 'GET',
    data
  });
}

// 分页查询
export const adminUserBlacklistList= data => {
  return request({
    url: `/admin/userBlacklist/list`,
    method: 'GET',
    data
  });
}

// 添加或修改数据或解禁
export const adminUserBlacklistUpdatePost= data => {
  return request({
    url: `/admin/userBlacklist/update`,
    method: 'POST',
    data
  });
}
