/*
 * @Author: wei.chen
 * @Date: 2021-05-11 13:29:06
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-05-11 13:29:15
 * @Descripttion:  cookie 控制 API
 */
import Cookies from 'js-cookie';

const TokenKey = 'yoga_Authorization';

export function getToken() {
	return Cookies.get(TokenKey);
}

export function setToken(token) {
	return Cookies.set(TokenKey, token);
}

export function removeToken() {
	return Cookies.remove(TokenKey);
}
