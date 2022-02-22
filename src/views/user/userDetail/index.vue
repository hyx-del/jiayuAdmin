<!--
 * @Author: tianhao
 * @Date: 2020-06-17 12:26:38
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-11-02 15:45:27
 * @Descripttion:
-->
<template>
	<div class="userDetail">
		<el-card class="left-card">
			<div slot="header" class="clearfix">
				<span>基本信息</span>
			</div>
			<div class="text item">
				<div>
					<div class="block">
						<el-avatar :size="60" :src="userInfo.avatar || circleUrl"></el-avatar>
					</div>
					<div class="centent_center baseInfo_body">
						<div class="baseInfo_body_item">
							<span>ID</span>
							<span>{{ userInfo.userId }}</span>
						</div>
						<div class="baseInfo_body_item">
							<span>昵称</span>
							<span>{{ userInfo.nickname || '-' }}</span>
						</div>
						<div class="baseInfo_body_item">
							<span>性别</span>
							<span>{{ userInfo.sexName || '-' }}</span>
						</div>
						<div class="baseInfo_body_item">
							<span>手机号码</span>
							<span>{{ userInfo.phone || '-' }}</span>
						</div>
						<div class="baseInfo_body_item">
							<span>生日</span>
							<span>{{ userInfo.birthday || '未填写' }}</span>
						</div>
						<div class="baseInfo_body_item">
							<span>注册来源</span>
							<span>{{ userInfo.source || '-' }}</span>
						</div>
						<div class="baseInfo_body_item">
							<span>地区</span>
							<span>{{ userInfo.registryPlatform || '-' }}</span>
						</div>
						<!-- <div class="baseInfo_body_item">
							<span>真实姓名</span>
							<span>{{ userInfo.name || '-' }}</span>
						</div> -->

						<div class="baseInfo_body_item">
							<span>注册时间</span>
							<span>{{ parseTime(userInfo.createTime) }}</span>
						</div>

						<div class="baseInfo_body_item">
							<span>绑定微信</span>
							<span>{{ userInfo.wxOpenid ? '已绑定' : '-' }}</span>
						</div>
						<!-- <div class="baseInfo_body_item">
							<span>微信号</span>
							<span>{{ userInfo.weChat || '-' }}</span>
						</div>
						<div class="baseInfo_body_item">
							<span>绑定支付宝</span>
							<span>{{ userInfo.bindAliPay ? '已绑定' : '-' }}</span>
						</div> -->

						<!-- <div class="baseInfo_body_item">
							<span>初次登录小程序时间</span>
							<span>{{ parseTime(userInfo.firstLoginMini) || '-' }}</span>
						</div>
						<div class="baseInfo_body_item">
							<span>初次登录APP时间</span>
							<span>{{ parseTime(userInfo.firstLoginApp) || '-' }}</span>
						</div> -->
					</div>
				</div>
			</div>
		</el-card>
		<el-card class="right-card">
			<div slot="header" class="clearfix">
				<span>行为数据</span>
			</div>
			<div class="texts item">
				<el-tabs v-model="activeName">
					<el-tab-pane label="登录记录">
						<Table
							:loadData="getUserLoginData"
							:params="id"
							:column="userLoginThirdColumn"
							v-if="activeName == 0"
						></Table>
					</el-tab-pane>
					<el-tab-pane label="练习进度">
						<Table
							:loadData="getAppUserExerciseData"
							:params="id"
							:column="appUserExerciseColumn"
							v-if="activeName == 1"
						>
							<template v-slot:courseName="{ scope }">
								<router-link
									tag="a"
									class="nickName"
									:to="{
										path: '/content/course/detail',
										query: { id: scope.courseId },
									}"
								>
									{{ scope.courseName }}
								</router-link>
							</template>
							<template v-slot:todayTime="{ scope }">
								{{ Time(scope.todayTime) }}
							</template>
							<template v-slot:totalTime="{ scope }">
								{{ Time(scope.totalTime) }}
							</template>
							<template v-slot:state="{ scope }">
								{{ scope.state == 1 ? '加入' : '退出' }}
							</template>
						</Table>
					</el-tab-pane>
					<el-tab-pane label="学习记录">
						<Table
							:loadData="getUserStudyData"
							:params="id"
							:column="userStudyColumn"
							v-if="activeName == 2"
						>
							<template v-slot:courseName="{ scope }">
								<router-link
									tag="a"
									class="nickName"
									:to="{
										path: '/content/course/detail',
										query: { id: scope.courseId },
									}"
								>
									{{ scope.courseName }}
								</router-link>
							</template>
						</Table>
					</el-tab-pane>
					<el-tab-pane label="积分记录">
						<Table
							:loadData="getScoreListData"
							:params="userId"
							:column="appScoreList"
							v-if="activeName == 3"
						>
							<template v-slot:orderNum="{ scope }">
								<router-link
									tag="a"
									class="nickName"
									:to="{
										path: '/order/detail',
										query: { id: scope.orderId },
									}"
								>
									{{ scope.orderNum }}
								</router-link>
							</template>
						</Table>
					</el-tab-pane>
					<el-tab-pane label="收货地址">
						<Table
							:loadData="getuserAddress"
							:params="userId"
							:column="appUserAddress"
							v-if="activeName == 4"
						>
							<template v-slot:fullAddress="{ scope }">
								{{ scope.provinceName }}{{ scope.cityName }}{{ scope.regionName
								}}{{ scope.fullAddress }}
							</template>
						</Table>
					</el-tab-pane>
					<el-tab-pane label="自购记录">
						<Table
							:loadData="getuserOrder"
							:params="userId"
							:column="appUserOrder"
							v-if="activeName == 5"
						>
							<template v-slot:orderState="{ scope }">
								{{ orderState(scope.orderState) }}
							</template>
						</Table>
					</el-tab-pane>
					<el-tab-pane label="邀请好友记录">
						<Table
							:loadData="inviteLists"
							:column="invite"
							:params="userId"
							v-if="activeName == 6"
						>
							<template v-slot:orderState="{ scope }">
								{{ orderState(scope.orderState) }}
							</template>
						</Table>
					</el-tab-pane>
					<el-tab-pane label="购买记录">
						<Table
							:loadData="buyLists"
							:column="buyColumn"
							:params="userId"
							v-if="activeName == 7"
						>
							<template v-slot:orderState="{ scope }">
								{{ orderState(scope.orderState) }}
							</template>
						</Table>
					</el-tab-pane>
				</el-tabs>
			</div>
		</el-card>
	</div>
</template>

<script>
import Table from '@/components/Table/index';
import { parseTime, Time } from '@/utils';
import {registeredSource, platform, buyType} from '@/utils/systemEnum';
import { moneyFormat } from '@/core/directives/money';
//邀请好友记录
import {inviteList, userPurchaseList} from '@/api/operation';
import {
	getAppUserDetail,
	getAppUserLoginList,
	getAppUserStudyList,
	getAppUserExerciseList,
	getUserScoreList,
	getuserAddress,
	getuserOrder,
} from '@/api/user';

import router from '../../../router';
import { mapOrderState } from '@/utils/orderModal';
export default {
	components: {
		Table,
	},
	data() {
		return {
			goldForm: {},
			silverForm: {},
			moneyForm: {},
			activeName: '',
			Time,

      buyColumn:[
        {
          prop:'name',
          label:'课程名称',
        },
        {
          prop:'payType',
          label:'付费方式',
          html:(val)=>buyType[val.payType]
        },
        {
          prop:'orderNo',
          label:'订单号',
        },
        {
          prop:'scorePrice',
          label:'积分价格',
        },
        {
          prop:'cashPrice',
          label:'现金价格',
        },
        {
          prop:'purchaseTime',
          label:'购买时间',
        },
        {
          prop:'effectiveTime',
          label:'课程有效期',
        },
      ],
			//  金币流水明细表头
			goldColumn: [
				{ prop: '', label: '发生时间' },
				{ prop: '', label: '来源' },
				{ prop: '', label: '关联订单编号' },
				{ prop: '', label: '内容' },
			],
			// 银币流水明细表头
			silverColumn: [
				{ prop: '', label: '发生时间' },
				{ prop: '', label: '来源' },
				{ prop: '', label: '关联订单编号' },
				{ prop: '', label: '内容' },
			],

			userLoginThirdColumn: [
				{
					prop: 'createTime',
					label: '登录时间',
					formatter: (row, column) => {
						return parseTime(row.createTime);
					},
				},
				{
					prop: 'ip',
					label: '登录IP',
				},
				{
					prop: 'terminal',
					label: '登录终端',
					formatter: (row, column) => {
						let _str = '';
						for (const key in platform) {
							if (key === row.terminal) {
								_str = platform[key];
							}
						}
						return _str;
					},
				},
				{
					prop: 'version',
					label: '版本号',
				},
			],
			appUserExerciseColumn: [
				{
					prop: 'courseName',
					label: '课程名称',
					render: true,
				},
				{ prop: 'nodeTotal', label: '总小节' },
				{ prop: 'nodeNum', label: '练习进度' },
				{ prop: 'nodeLastId', label: '上次练习' },
				{ prop: 'todayTime', label: '今日练习(分钟)', render: true },
				{ prop: 'totalTime', label: '累计练习(分钟)', render: true },
				{ prop: 'continueDay', label: '连续练习(天)' },
				{ prop: 'totalDay', label: '累计练习(天)' },
				{ prop: 'completeCount', label: '完成次数' },
				{ prop: 'state', label: '状态', render: true },
				{
					prop: 'joinTime',
					label: '加入时间',
					formatter: (row, column) => {
						return parseTime(row.joinTime);
					},
				},
				{
					prop: 'exitTime',
					label: '移除时间',
					formatter: (row, column) => {
						return parseTime(row.exitTime);
					},
				},
			],

			userStudyColumn: [
				{
					prop: 'courseName',
					label: '课程名称',
					render: true,
				},
				{ prop: 'nodeTotal', label: '总小节' },
				{ prop: 'nodeNum', label: '练习小节' },
				{ prop: 'time', label: '练习时长(分钟)' },
				{ prop: 'platform', label: '观看平台' },
				// { prop: 'orderNum5', label: '今日练习(分钟)' },
				{
					prop: 'startTime',
					label: '练习开始时间',
					formatter: (row, column) => {
						return parseTime(row.startTime);
					},
				},
				{
					prop: 'endTime',
					label: '练习结束时间',
					formatter: (row, column) => {
						return parseTime(row.endTime);
					},
				},
			],
			appUserOrder: [
				{
					prop: 'orderTime',
					label: '下单时间',
					formatter: (row, column) => {
						return parseTime(row.orderTime);
					},
				},
				{ prop: 'orderNo', label: '订单编号' },
				{ prop: 'actuallyTotalAmount', label: '支付积分' },
				{ prop: 'actuallyTotalCash', label: '支付现金' },
				{ prop: 'goodsName', label: '商品名称' },
				{ prop: 'number', label: '购买数量' },
				{ prop: 'orderState', label: '订单状态', render: true },
			],
			invite: [
				{ prop: 'inviteNickname', label: '好友昵称' },
				{ prop: 'invitePhone', label: '好友手机' },
				{ prop: 'createTime', label: '好友注册时间' },
				{ prop: 'inviteRegistIp', label: '好友注册IP' },
				{
					prop: 'grantState',
					label: '积分发放状态',
					formatter: (row, column) => {
						let state;
						switch (row.grantState) {
							case 0:
								state = '未发放';
								break;
							case 1:
								state = '已发放';
								break;
							case 2:
								state = '邀请无效';
								break;
							default:
								break;
						}
						return state;
					},
				},
				{ prop: 'score', label: '邀请积分' },
				{ prop: 'grantTime', label: '积分发放时间' },
			],
			appUserAddress: [
				{ prop: 'nickname', label: '收货人' },
				{ prop: 'phone', label: '收货人手机号' },
				{ prop: 'fullAddress', label: '收货地址', render: true },
			],
			appScoreList: [
				// 积分列表
				{ prop: 'ruleName', label: '积分规则' },
				{ prop: 'score', label: '变更积分' },
				{ prop: 'balanceScore', label: '积分结存' },
				{
					prop: 'time',
					label: '发生时间',
					formatter: (row, column) => {
						return parseTime(row.time);
					},
				},
			],
			userInfo: {},
			circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
			id: { id: this.$route.query.userId || null },
			userId: { userId: this.$route.query.userId || null },
		};
	},
	watch: {
		activeName(newVal, oldVal) {
			if (newVal === 'GOLD') {
				// 获取金币统考数据
				getGoldCountInfo({ id: this.id.id }).then(res => {
					if (res.success) {
						this.goldInfo = res.data;
					}
				});
			} else if (newVal === 'SILVER') {
				// 获取银币统计数据
				getsilverCountInfo({ id: this.id.id }).then(res => {
					if (res.success) {
						this.silverInfo = res.data;
					}
				});
			} else if (newVal === 'MONEY') {
				// 获取现金统计数据
				getMoneyCountInfo({ id: this.id.id }).then(res => {
					if (res.success) {
						this.moneyInfo = res.data;
					}
				});
			}
		},
	},
	mounted() {
		// console.log(this.$route)
		getAppUserDetail({ id: this.$route.query.userId }).then(res => {
			if (res.code === 200) {
				this.userInfo = res.data;
				if (res.data.sex === 'MAN') {
					this.userInfo.sex = '男';
				} else if (res.data.sex === 'WOMAN') {
					this.userInfo.sex = '女';
				}
				switch (res.data.level) {
					case 'NORMAL':
						this.userInfo.level = '注册用户';
						break;
					case 'TWO':
						this.userInfo.level = '二级经销商';
						break;
					case 'ONE':
						this.userInfo.level = '一级经销商';
						break;
					default:
						return '';
						break;
				}
				switch (res.data.registryPlatform) {
					case 'ANDROID':
						this.userInfo.registryPlatform = 'APP';
						break;
					case 'IOS':
						this.userInfo.registryPlatform = 'APP';
						break;
					case 'MINI':
						this.userInfo.registryPlatform = '小程序';
						break;
					case 'H5':
						this.userInfo.registryPlatform = '小程序';
						break;
					case 'WEB':
						this.userInfo.registryPlatform = 'PC';
						break;
					case 'BYTE_DANCE_MINI':
						this.userInfo.registryPlatform = '抖音小程序';
						break;
					default:
						return '-';
						break;
				}
			}
		});
	},
	computed: {
		getUserLoginData: {
			get() {
				return getAppUserLoginList;
			},
			set() {},
		},
		getUserStudyData: {
			get() {
				return getAppUserStudyList;
			},
			set() {},
		},
		getAppUserExerciseData: {
			get() {
				return getAppUserExerciseList;
			},
			set() {},
		},
		getuserAddress: {
			get() {
				return getuserAddress;
			},
			set() {},
		},
		getScoreListData: {
			get() {
				return getUserScoreList;
			},
			set() {},
		},
		getuserOrder: {
			get() {
				return getuserOrder;
			},
			set() {},
		},
		inviteLists: {
			get() {
				return inviteList;
			},
			set() {},
		},
    buyLists(){
		  return userPurchaseList
    }
	},
	methods: {
		parseTime(time) {
			return parseTime(time);
		},
		moneyFormat(num) {
			return moneyFormat(num);
		},
		gotoUserDetail(id) {
			window.open(`/#/operation/userDetail?userId=${id}`);
		},

		onClickBtu() {},
		getShareList() {},
		getBindList() {},
		getdetaiList() {},
		getCouponList() {},
		//  金币流水明细查询事件
		SearchGold() {
			this.$refs.goldTable.update({ ...this.goldForm });
		},
		// 银币流水明细查询事件
		SearchSilver() {
			this.$refs.silverTable.update({ ...this.silverForm });
		},
		// 现金流水明细查询事件
		SearchMoney() {
			this.$refs.moneyTable.update({ ...this.moneyForm });
		},
		orderState(num) {
			let status;
			switch (num) {
				case 0:
					status = '待支付';
					break;
				case 1:
					status = '待发货';
					break;
				case 2:
					status = '待收货';
					break;
				case 3:
					status = '已完成';
					break;
				case 4:
					status = '已取消';
					break;
				case 5:
					status = '已关闭';
					break;
			}
			return status;
		},
	},
};
</script>

<style>
.userDetail {
	padding: 20px;
	display: flex;
	width: 100%;
}
.texts {
	font-size: 14px;
}

.item {
	margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
	display: table;
	content: '';
}
.clearfix:after {
	clear: both;
}

.left-card {
  flex-shrink: 0;
	width: 260px;
	margin-right: 20px;
}
.right-card {
	width: 100%;
	/* float: right; */
}
.user_head {
	width: 280px;
	height: 160px;
}
.centent_center {
	text-align: center;
}
.baseInfo_header {
	/* height: 150px;
  padding-bottom: 20px; */
	background-color: #f2f2f2;
	text-align: center;
}
.baseInfo_header_img {
	width: 120px;
	height: 120px;
}
.centent_center {
	text-align: center;
}

.baseInfo_body_item {
	display: flex;
}
.baseInfo_header_nick {
	padding-top: 10px;
	height: 40px;
}
.baseInfo_body_item span {
	flex: 1;

	padding-top: 10px;
	padding-bottom: 10px;
	width: 60%;

	border-top: 1px solid #999;
	border-left: 1px solid #999;
}
.baseInfo_body_item span:first-child {
	background-color: #f5f5f5;
}
.baseInfo_body_item span:last-child {
	border-right: 1px solid #999;
}
.baseInfo_body_item:last-child {
	border-bottom: 1px solid #999;
}
.user_info_summary {
	min-height: 120px;
}

.tag {
	padding: 24px 0;
	text-align: center;
}
.block {
	text-align: center;
	padding-bottom: 20px;
}
.nickName {
	color: blue;
}
.nickName:hover {
	color: red;
}
.inviterNickName {
	color: blue;
	cursor: pointer;
}
.inviterNickName:hover {
	color: red;
}
</style>
