/*
 * @Author: wei.chen
 * @Date: 2020-12-08 11:30:47
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-06-19 10:15:34
 * @Descripttion:正则表达式
 */

// 小数点可以出现一位，两位
export const regFloat = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;

export const regInt = /^([1-9]{1}\d*)$/;
