/*
 * @Author: tianhao
 * @Date: 2020-06-12 18:25:22
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-05-11 13:34:09
 * @Descripttion: 获取七牛的token
 */
import request from '@/utils/request';
export function getOSSToken(data) {
	return request({
		url: '/adminApi/qiniu/token',
		method: 'get',
		data,
	});
}
