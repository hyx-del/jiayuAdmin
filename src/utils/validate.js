/*
 * @Author: wei.chen
 * @Date: 2020-06-11 11:46:00
 * @LastEditTime: 2020-08-19 17:10:40
 * @LastEditors: wei.chen
 * @Description:
 */

/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
	return /^(https?:|mailto:|tel:)/.test(path);
}


export function backType(cc, string) {
  var typeName = Object.prototype.toString.call(cc);
  if (typeName == '[object Object]') {
    typeName = '[object ' + cc.constructor.name;
  }
  typeName = typeName.replace(']', '').slice(8);
  if (string) {
    return typeName == string;
  }
  return typeName;
}
/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
	const valid_map = ['admin', 'editor'];
	return valid_map.indexOf(str.trim()) >= 0;
}

/**
 * @name:
 * @description: 手机号码校验
 * 进行严谨的规则匹配
 * /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
 * 非强校验
 * @param {type}
 * @return:
 */
export function isPhone(val) {
	const phoneReg = /^[1]([3-9])[0-9]{9}$/;
	return phoneReg.test(val);
}
// 输入大于零且最多两位小数的数值
export function checkedNumber(val) {
	const numberReg = /^([1-9][0-9]*)+(.[0-9]{1,2})?$/;
	return numberReg.test(val);
}
