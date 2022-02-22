/*
 * @Author: jiu yin
 * @Date: 2021-07-27 10:10:26
 * @LastEditTime: 2021-07-27 11:28:20
 * @LastEditors: jiu yin zhen jing
 * @Description: 666
 * @FilePath: \jiayu_admin\src\api\luckyDraw.js
 *  “”
 */

import request from '@/utils/request';

const _baseUrl = '/admin';
// 抽奖分页
export function winrecordPage(data) {
	return request({
		url: `${_baseUrl}/winrecord/page`,
		method: 'get',
		data,
	});
}
// 抽奖状态改变
export function winrecordState(id,data) {
	return request({
		url: `${_baseUrl}/winrecord/state?id=`+id,
		method: 'put',
		data,
	});
}

//----------------奖品配置--------------
// 获取奖品说明
export const prizeExplainGet= data => {
  return request({
    url: `admin/luck/prize/explain/get`,
    method: 'GET',
    data,
  });
}

// 奖品说明修改
export const prizeExplainUpdatePut= data => {
  return request({
    url: `admin/luck/prize/explain/update`,
    method: 'PUT',
    data,
  });
}

// 查询奖品表
export const luckPrizeFindlist= data => {
  return request({
    url: `admin/luck/prize/findlist`,
    method: 'GET',
    data,
  });
}

// 查询奖品表分页数据
export const luckPrizeList= data => {
  return request({
    url: `admin/luck/prize/list`,
    method: 'GET',
    data,
  });
}

// 更新奖品表
export const luckPrizeUpdatePut= data => {
  return request({
    url: `admin/luck/prize/update`,
    method: 'PUT',
    data,
  });
}

// 查询奖品操作日志表分页数据
export const luckprizeLogList= data => {
  return request({
    url: `admin/luckprize/log/list`,
    method: 'GET',
    data,
  });
}
