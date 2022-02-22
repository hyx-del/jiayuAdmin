/*
 * @Author: wei.chen
 * @Date: 2020-06-11 11:46:00
 * @LastEditTime: 2021-06-15 10:12:26
 * @LastEditors: wei.chen
 * @Description:瑜伽模块
 */

import request from '@/utils/request';

// 获取分类列表
export function getOSSToken(data) {
	return request({
		url: '/admin/file/oss/sts',
		method: 'post',
		data,
	});
}
