/*
 * @Author: wei.chen
 * @Date: 2020-06-11 12:42:39
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-05-11 13:30:18
 * @Descripttion: 获取标题
 */

import defaultSettings from '@/settings';

const title = defaultSettings.title || '管理';

export default function getPageTitle(pageTitle) {
	if (pageTitle) {
		return `${pageTitle} - ${title}`;
	}
	return `${title}`;
}
