/*
 * @Author: tianhao
 * @Date: 2020-06-11 12:42:56
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-08-18 11:59:58
 * @Descripttion:
 */

// import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// import locale from 'element-ui/lib/locale/lang/en'; // lang i18n

import "@/styles/index.scss"; // global css

// import VueVideoPlayer from "vue-video-player";
// import "video.js/dist/video-js.css";
// Vue.use(VueVideoPlayer);

import VueCropper from "vue-cropper";
Vue.use(VueCropper);

import App from "./App";
import store from "./store";
import router from "./router";

import "@/icons"; // icon
import "@/permission"; // permission control

// CDN引入后 element全局修改默认值
ELEMENT.Button.props.size.default = 'small';
// console.log('ElementUI', ElementUI.Button.props);
ELEMENT.Dialog.props.destroyOnClose.default = true;
ELEMENT.Dialog.props.customClass.default = 'dialogStyle';
// console.log('ElementUI', ElementUI.Dialog);
// Vue.use(ElementUI);
Vue.config.productionTip = false;
new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
