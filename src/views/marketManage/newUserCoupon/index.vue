<!--
 * @Author: wei.chen
 * @Date: 2020-07-17 11:34:49
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-01-28 16:47:41
 * @Descripttion: 
-->
<template>
	<div class="floatingWindowManagement">
		<h4 class="pullNewUser_title">新人优惠劵活动配置</h4>
		<div>
			<el-button
				type="primary"
				size="small"
				v-if="upateModal"
				@click="submitForm('pullNewUserForm')"
			>
				保存修改
			</el-button>
			<el-button type="primary" v-else size="small" @click="upateModal = true">
				修改模式
			</el-button>
		</div>
		<div style="padding:16px 0">
			<el-switch
				style="display: block"
				:disabled="!upateModal"
				v-model="stateVal"
				active-color="#13ce66"
				inactive-color="#eeeeee"
				active-text="已开启活动"
				inactive-text="已经关闭活动"
			></el-switch>
		</div>
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column prop="pid" label="序号" width="150"></el-table-column>

			<el-table-column prop="val" label="优惠劵"></el-table-column>
			<el-table-column prop="count" label="发放数量"></el-table-column>
			<el-table-column prop="used" label="使用数量"></el-table-column>
			<el-table-column prop="expire" label="过期数量"></el-table-column>
			<el-table-column prop="unUse" label="未使用数量"></el-table-column>
		</el-table>
	</div>
</template>

<script>
// import { getOrderRule, editOrderRule } from '@/api/order';

import {
	getNewUserCouponDetail,
	putNewUserCouponRule,
	getNewUserCouponRule,
} from '@/api/marketManage';
import { Message } from 'element-ui';

export default {
	name: 'newUserCoupon',
	components: {},
	data() {
		return {
			upateModal: false, // 需要进入修改模式才能修改
			stateVal: false, // 开关状态
			tableData: [
				{
					pid: 1,
					img: null,
					link: '',
					editor: '',
					openFlag: false,
					updateTime: '',
				},
			],
		};
	},
	mounted() {
		this.initData();
	},
	methods: {
		// 初始化数据
		initData() {
			getNewUserCouponRule().then(res => {
				if (res.success) {
					this.stateVal = res.data;
				}
			});
			// 获取统计数据
			getNewUserCouponDetail().then(res => {
				if (res.success) {
					let _tempArray = [];
					let resData = { ...res.data };
					_tempArray[0] = {
						pid: 1,
						val: '50元',
						count: resData.used50 + resData.expire50 + resData.unUse50,
						used: resData.used50,
						expire: resData.expire50,
						unUse: resData.unUse50,
					};
					_tempArray[1] = {
						pid: 2,
						val: '20元',
						count: resData.used20 + resData.expire20 + resData.unUse20,
						used: resData.used20,
						expire: resData.expire20,
						unUse: resData.unUse20,
					};
					_tempArray[2] = {
						pid: 3,
						val: '10元',
						count: resData.used10 + resData.expire10 + resData.unUse10,
						used: resData.used10,
						expire: resData.expire10,
						unUse: resData.unUse10,
					};
					_tempArray[3] = {
						pid: 4,
						val: '5元',
						count: resData.used5 + resData.expire5 + resData.unUse5,
						used: resData.used5,
						expire: resData.expire5,
						unUse: resData.unUse5,
					};
					this.tableData = _tempArray;
				}
			});
		},
		submitForm(formName) {
			let _par = { open: this.stateVal };

			putNewUserCouponRule(_par).then(res => {
				Message.success('修改成功！！！');
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.floatingWindowManagement {
	padding: 20px;
}
</style>
