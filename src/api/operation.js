/*
 * @Author: wei.chen
 * @Date: 2020-06-11 11:46:00
 * @LastEditTime: 2021-12-07 13:36:02
 * @LastEditors: jiu yin zhen jing
 * @Description:瑜伽模块
 */

import request from '@/utils/request';

const _baseUrl = '/admin';
// 创建分类
export function addScreen(data) {
	return request({
		url: `${_baseUrl}/yoga-category/add`,
		method: 'POST',
		data,
	});
}
// 获取分类列表
export function getScreenList(data) {
	return request({
		url: `${_baseUrl}/yoga-category/list`,
		method: 'get',
		data,
	});
}
// 获取分类列表
export function getScreenItem(data) {
	return request({
		url: `${_baseUrl}/yoga-category/${data.id}`,
		method: 'get',
		data,
	});
}
// 编辑分类
export function editSubScreen(data) {
	return request({
		url: `${_baseUrl}/yoga-category/update/${data.id}`,
		method: 'put',
		data,
	});
}

// 编辑一级分类名称
export function editScreen(data) {
	return request({
		url: `${_baseUrl}/yoga-category/update/state/${data.id}`,
		method: 'put',
		data,
	});
}

// 删除分类
export function delSubScreen(data) {
	return request({
		url: `${_baseUrl}/yoga-category/${data.id}`,
		method: 'delete',
		data,
	});
}

//  弹窗管理======================begin=============
// 获取分类列表
export function getPopupWinList(data) {
	return request({
		url: `${_baseUrl}/popup/get/list`,
		method: 'get',
		data,
	});
}
export function addPopupWin(data) {
	return request({
		url: `${_baseUrl}/popup`,
		method: 'post',
		data,
	});
}
export function editPopupWin(data) {
	return request({
		url: `${_baseUrl}/popup`,
		method: 'put',
		data,
	});
}
export function delPopupWin(data) {
	return request({
		url: `${_baseUrl}/popup/${data.id}`,
		method: 'delete',
		data,
	});
}
// 状态启停 id
export function popupStateChange(data) {
  return request({
    url: `/admin/popup/state/change/${data.id}`,
    method: 'GET',
    data,
  });
}

// ==============================end=================

//  系统公告管理======================begin=============
//
export function getSystemNoticeList(data) {
	return request({
		url: `${_baseUrl}/system-notice/get/list`,
		method: 'get',
		data,
	});
}
export function addSystemNotice(data) {
	return request({
		url: `${_baseUrl}/system-notice/add`,
		method: 'post',
		data,
	});
}
// export function ediSystemNotice(data) {
// 	return request({
// 		url: '${_baseUrl}/popup',
// 		method: 'put',
// 		data,
// 	});
// }
export function delSystemNotice(data) {
	return request({
		url: `${_baseUrl}/system-notice/${data.id}`,
		method: 'delete',
		data,
	});
}
// ==============================end=================
//  系统公告管理======================begin=============
//
export function getFeedBackList(data) {
	return request({
		url: `${_baseUrl}/feedback/get/list`,
		method: 'get',
		data,
	});
}
export function replyFeedback(data) {
	return request({
		url: `${_baseUrl}/feedback/update/reply/${data.id}`,
		method: 'put',
		data,
	});
}
// ==============================end=================

// 获取用户评论
export function getUserComments(data) {
	return request({
		url: `/admin/user-comment/get/list`,
		method: 'get',
		data,
	});
}
// 删除用户评论
export function delUserComments(data) {
	return request({
		url: `/admin/user-comment/${data.id}`,
		method: 'delete',
		data,
	});
}
// 批量删除数据
export const adminUserCommentBatchDelete= data => {
  return request({
    url: `/admin/user-comment/batch`,
    method: 'DELETE',
    data
  });
}

// 顶置用户评论
export function UserCommentsTopping(data) {
	return request({
		url: `/admin/user-comment/topping`,
		method: 'put',
		data,
	});
}
//========================敏感词类型
// 敏感词类型管理列表
export function sensitiveTypeList(data) {
	return request({
		url: `/admin/sensitivewordstype/list`,
		method: 'GET',
		data,
	});
}
// 删除敏感词类型
export function sensitiveTypeDelete(data) {
	return request({
		url: `/admin/sensitivewordstype`,
		method: 'DELETE',
		data,
	});
}

// 修改敏感词类型
export function sensitiveTypeEdit(data) {
	return request({
		url: `/admin/sensitivewordstype`,
		method: 'PUT',
		data,
	});
}
// 新加敏感词类型
export function sensitiveTypeAdd(data) {
	return request({
		url: `/admin/sensitivewordstype`,
		method: 'POST',
		data,
	});
}
//====================敏感词管

// 敏感词管理列表
export function sensitiveList(data) {
	return request({
		url: `/admin/sensitivewords/list`,
		method: 'GET',
		data,
	});
}
// 删除敏感词
export function sensitiveDelete(data) {
	return request({
		url: `/admin/sensitivewords`,
		method: 'DELETE',
		data,
	});
}

// 修改敏感词
export function sensitiveEdit(data) {
	return request({
		url: `/admin/sensitivewords`,
		method: 'PUT',
		data,
	});
}
// 新加敏感词
export function sensitiveAdd(data) {
	return request({
		url: `/admin/sensitivewords`,
		method: 'POST',
		data,
	});
}

// 敏感词类型下拉列表
export function sensitiveListSelete(data) {
	return request({
		url: `/admin/sensitivewordstype/choose`,
		method: 'GET',
		data,
	});
}

//===================用户邀请

// 用户邀请管理
export function inviteList(data) {
	return request({
		url: `${_baseUrl}/user/invite/list`,
		method: 'get',
		data,
	});
}
// 获取邀请规则
export function inviRule(data) {
	return request({
		url: '/admin/user/invite/rule',
		method: 'get',
		data,
	});
}
// 邀请规则编辑
export function inviRuleUpdate(data) {
	return request({
		url: '/admin/user/invite/rule/update',
		method: 'put',
		data,
	});
}
// 该用户购买记录分页查询
export const userPurchaseList= data => {
  return request({
    url: `/admin/user-purchase/list`,
    method: 'GET',
    data,
  });
}


// 意见列表
export function feedbackList(data) {
	return request({
		url: `${_baseUrl}/feedback/get/list`,
		method: 'get',
		data,
	});
}
// 意见回复
export function feedbackUpdate(data) {
	return request({
		url: '/admin/feedback/update/reply',
		method: 'put',
		data,
	});
}


// selectOne
export function popup(data) {
  return request({
    url: `/admin/popup/${data.id}`,
    method: 'GET',
    data,
  });
}



// selectOne
export function banner(data) {
  return request({
    url: `/admin/banner/${data.id}`,
    method: 'GET',
    data,
  });
}

// delete
export function bannerDelete(data) {
  return request({
    url: `/admin/banner//${data.id}`,
    method: 'DELETE',
    data,
  });
}

// 查询弹窗
export function bannerGetList(data) {
  return request({
    url: `/admin/banner/get/list`,
    method: 'GET',
    data,
  });
}

// 新增banner
export function bannerSavePost(data) {
  return request({
    url: `/admin/banner/save`,
    method: 'POST',
    data,
  });
}

// 获取展示位置字典
export function bannerShowLocation(data) {
  return request({
    url: `/admin/banner/show/location`,
    method: 'GET',
    data,
  });
}

// 编辑banner
export function bannerUpdatePut(data) {
  return request({
    url: `/admin/banner/update`,
    method: 'PUT',
    data,
  });
}


// 状态启停 id
export function bannerStateChange(data) {
  return request({
    url: `/admin/banner/state/change/${data.id}`,
    method: 'GET',
    data,
  });
}
export const getReplylist= data => {
  return request({
    url: `admin/user-comment/get/replylist`,
    method: 'GET',
    data,
  });
}


// 分页开屏 练习广告
export const managerList= data => {
	return request({
	  url: `/admin/adsense/manager/list`,
	  method: 'GET',
	  data,
	});
  }
// 广告状态启停 id
export function managerStateChange(data) {
	return request({
	  url: `/admin/adsense/manager/state/change`,
	  method: 'put',
	  data,
	});
  }
  // 广告新增
export function managerAdd(data) {
	return request({
	  url: `/admin/adsense/manager/add`,
	  method: 'post',
	  data,
	});
  }
  //广告详情
  export function managerDetail(data) {
	return request({
	  url: `/admin/adsense/manager/detail`,
	  method: 'get',
	  data,
	});
  }
    //广告编辑
	export function managerUpdate(data) {
		return request({
		  url: `/admin/adsense/manager/update`,
		  method: 'put',
		  data,
		});
	  }

    //练习广告关联瑜伽栏目
	export function managerQueryColumn(data) {
		return request({
		  url:`/admin/adsense/manager/queryColumn`,
		  method: 'get',
		  data,
		});
	  }
