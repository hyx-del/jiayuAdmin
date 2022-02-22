<!--
 * @Author: wei.chen
 * @Date: 2020-06-20 18:55:32
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-06-03 20:22:16
 * @Descripttion: 
-->
<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script>
import store from '@/store';
import { getOSSToken } from '@/api/common';

export default {
	name: 'App',
	data() {
		return {
			tokenTimer: null,
		};
	},
	created() {},
	mounted() {
		this.getqiniuToken();
		// 每隔 50x60x1000 去刷新一次token   3600000
		//   TODO  以后这里需要优化 使用自己的refresh token 方式来刷新
		this.tokenTimer = setInterval(() => {
			this.getqiniuToken();
		}, 3000000);
	},
	beforeDestroy() {
		this.stopTimer();
	},
	methods: {
		stopTimer() {
			if (this.tokenTimer) {
				clearInterval(this.tokenTimer);
				this.tokenTimer = null;
			}
		},
		// 获取上传的token
		getqiniuToken() {
			// window.sessionStorage.getItem('token')  store.getters.token
			if (window.sessionStorage.getItem('token')) {
				getOSSToken().then(res => {
					if (res.code === 200) {
						// sessionStorage.setItem('qiniuToken', res.data.uptoken);
						store.dispatch('app/setUpLoadToken', res.data);
					} else {
						message.error(res.msg);
					}
				});
			}
		},
	},
};
</script>
