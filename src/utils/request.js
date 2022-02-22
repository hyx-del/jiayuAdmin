/*
 * @Author: wei.chen
 * @Date: 2020-06-11 11:46:00
 * @LastEditTime: 2021-12-06 16:23:45
 * @LastEditors: jiu yin zhen jing
 * @Description:
 */

// import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";

// create an axios instance
const service = axios.create({
  baseURL: process.env.NODE_ENV !== "development"? process.env.VUE_APP_BASE_API:'', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000, // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    const _par = getToken();
    if (_par) {
      config.headers["Authorization"] = `Bearer ${_par}`;
    } else {
      config.headers["Authorization"] = "Basic QUJDOjEyMzQ1Ng==";
    }

    if (config.ContentType) {
      config.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
    // TODO
    //  方便调试
    // if (config.url.indexOf('/admin/score') != -1) {
    // 	config.headers['instance_ip'] = '192.168.110.172';
    // } else {
    // 	config.headers['instance_ip'] = '192.168.110.48';
    // }
    // config.headers['instance_ip'] = '192.168.110.3';
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  (response) => {
    const res = response.data;

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      if (res.access_token) {
        return res;
      }

      //

      if (res.code === 401) {
        // token 过期了
        // 1、重置用户的状态
        // 2、用户跳转到 登录界面
        Message({
          message: "登录认证失败，请重新登录!",
          type: "error",
          duration: 5 * 1000,
        });
        store.dispatch("user/resetToken").then(() => {
          // if(loc)
          //如果是登录界面就不做刷新
          if (!location.href.includes("/#/login")) {
            location.reload();
          }
        });
      } else if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm("登录认证失败，请重新登录!", "退出", {
          confirmButtonText: "重新登录",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          store.dispatch("user/resetToken").then(() => {
            location.reload();
          });
        });
      } else {
        switch (res.code) {
          case 10005:
            res.msg = "值不可以重复！";
            break;
          case 9999:
            res.msg = "响应异常，请稍后尝试";
            break;
        }
        Message({
          message: res.msg || "错误",
          type: "error",
          duration: 5 * 1000,
        });
        if (typeof res === "string") {
          return Promise.reject(new Error(res || "Error"));
        } else {
          return Promise.reject(res);
        }
      }
    } else {
      return res;
    }
  },
  (error) => {
    console.log("err" + error); // for debug
    // MessageBox.confirm('登录认证失败，请重新登录!', '退出', {
    // 	confirmButtonText: '重新登录',
    // 	cancelButtonText: '取消',
    // 	type: 'warning',
    // }).then(() => {
    // 	store.dispatch('user/resetToken').then(() => {
    // 		location.reload();
    // 	});
    // 	return Promise.reject(error);
    // });
    MessageBox.confirm("页面响应失败，网络事故请刷新页面", "退出", {
      confirmButtonText: "刷新",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      location.reload();
      return Promise.reject(error);
    });
  }
);
// get请求封装
const request = (val) => {
  let { data, url, method, ContentType } = val;
  if (method == "get" || method == "GET") {
    return service({ url, method, params: data, ContentType });
  } else {
    return service({ url, method, data, ContentType });
  }
};

export default request;
