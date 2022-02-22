<!--
 * @Author: wei.chen
 * @Date: 2020-07-18 11:03:01
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-01-29 16:41:30
 * @Descripttion:
-->
<template>
	<div class="distributorDetail">
		<el-card class="left-card">
			<div slot="header" class="clearfix">
				<h4>基本信息</h4>
			</div>
			<div class="text item">
				<div>
					<div class="block">
						<el-avatar :size="60" :src="userInfo.avatar || circleUrl"></el-avatar>
					</div>
					<div class="centent_center baseInfo_body">
						<div class="baseInfo_body_item">
							<span>ID</span>
							<span>{{ userInfo.id || '-' }}</span>
						</div>
						<div class="baseInfo_body_item">
							<span>昵称</span>
							<span>{{ userInfo.nickName || '-' }}</span>
						</div>
						<div class="baseInfo_body_item">
							<span>真实姓名</span>
							<span>{{ userInfo.name || '-' }}</span>
						</div>
						<div class="baseInfo_body_item">
							<span>专享邀请ID</span>
							<span>{{ userInfo.inviteCode || '-' }}</span>
						</div>
						<div class="baseInfo_body_item">
							<span>注册时间</span>
							<span>{{ parseTime(userInfo.createTime) || '-' }}</span>
						</div>
						<div class="baseInfo_body_item">
							<span>用户等级</span>
							<span
								class="nickName"
								v-if="userInfo.level === '一级经销商'"
								@click="editLevel(userInfo.id)"
							>
								{{ userInfo.level }}
							</span>
							<span v-else>{{ userInfo.level || '-' }}</span>
						</div>
						<div class="baseInfo_body_item">
							<span>性别</span>
							<span>{{ userInfo.sex || '-' }}</span>
						</div>
						<div class="baseInfo_body_item">
							<span>生日</span>
							<span>{{ userInfo.birthday || '未填写' }}</span>
						</div>
						<div class="baseInfo_body_item">
							<span>微信号</span>
							<span>{{ userInfo.weChat || '-' }}</span>
						</div>
						<div class="baseInfo_body_item">
							<span>绑定微信</span>
							<span>{{ userInfo.weChat ? '已绑定' : '-' }}</span>
						</div>
						<div class="baseInfo_body_item">
							<span>绑定支付宝</span>
							<span>{{ userInfo.bindAliPay ? '已绑定' : '-' }}</span>
						</div>
						<div class="baseInfo_body_item">
							<span>直属上级</span>
							<router-link
								tag="span"
								class="nickName"
								v-if="userInfo.inviterNickName"
								:to="{ path: '/operation/userDetail', query: { userId: userInfo.id } }"
							>
								<!-- {{ userInfo.nickName }} -->
								{{ userInfo.inviterNickName }}
							</router-link>
							<span v-else>{{ '-' }}</span>
						</div>
						<div class="baseInfo_body_item">
							<span>直属粉丝</span>
							<span>{{ userInfo.inviteeCount || '-' }}</span>
						</div>
						<div class="baseInfo_body_item">
							<span>初次登录小程序时间</span>
							<span>{{ parseTime(userInfo.firstLoginMini) || '-' }}</span>
						</div>
						<div class="baseInfo_body_item">
							<span>初次登录APP时间</span>
							<span>{{ parseTime(userInfo.firstLoginApp) || '-' }}</span>
						</div>
						<!-- <div class="baseInfo_body_item">
							<span>总登录次数</span>
							<span>{{ userInfo.loginCount || '-' }}</span>
						</div> -->
						<div class="baseInfo_body_item">
							<span>最近一次打开APP时间</span>
							<span>{{ parseTime(userInfo.lastOpenAppTime) || '-' }}</span>
						</div>
					</div>
				</div>
			</div>
		</el-card>
		<el-card class="right-card">
			<div slot="header" class="clearfix">
				<h4>行为数据</h4>
			</div>
			<div class="texts item">
				<el-tabs v-model="activeName">
					<el-tab-pane label="粉丝列表" name="">
						<el-form
							:inline="true"
							:model="searchFansForm"
							ref="searchFansForm"
							class="demo-form-inline"
						>
							<el-form-item label="绑定时间：" prop="time">
								<el-date-picker
									v-model.trim="searchFansForm.time"
									type="daterange"
									range-separator="至"
									start-placeholder="开始日期"
									end-placeholder="结束日期"
									size="small"
									:default-time="['00:00:00', '23:59:59']"
									value-format="timestamp"
									@change="onChangeTime"
								></el-date-picker>
							</el-form-item>

							<el-form-item>
								<el-button
									type="primary"
									@click="fansSearch('searchFansForm')"
									size="small"
								>
									查询
								</el-button>
							</el-form-item>
						</el-form>
						<Table
							:loadData="getFansList"
							ref="fansTable"
							:params="{ id: id }"
							:column="fansColumn"
						>
							<template v-slot:nickName="{ scope }">
								<router-link
									tag="a"
									class="nickName"
									:to="{ path: '/operation/userDetail', query: { userId: scope.id } }"
								>
									{{ scope.nickName }}
								</router-link>
							</template>
						</Table>
					</el-tab-pane>
					<el-tab-pane label="金币流水明细" name="GOLD">
						<p>
							<span>累计收益金币：{{ goldInfo.total || 0 }}</span>
							<span>已转化金币：{{ Math.abs(goldInfo.transfer) || 0 }}</span>
							<span>已失效金币：{{ goldInfo.clear || 0 }}</span>
							<span>当前金币余额：{{ goldInfo.current || 0 }}</span>
						</p>
						<el-form
							:inline="true"
							:model="goldForm"
							ref="goldForm"
							class="demo-form-inline"
						>
							<el-form-item label="来源：" prop="type">
								<el-select
									v-model.trim="goldForm.type"
									placeholder="全部"
									size="small"
								>
									<el-option
										v-for="item in goldCoinsOptions"
										:key="item.val"
										:label="item.lab"
										:value="item.val"
									></el-option>
									<!-- <el-option label="计时到期（清空）" value="CLEAR"></el-option> -->
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-button
									type="primary"
									@click="SearchGold('goldForm')"
									size="small"
								>
									查询
								</el-button>
							</el-form-item>
						</el-form>
						<Table
							:loadData="getList"
							ref="goldTable"
							v-if="activeName === 'GOLD'"
							:params="{ id: id, balanceType: activeName }"
							:column="Column"
						>
							<template v-slot:orderNum="{ scope }">
								<router-link
									tag="a"
									class="nickName"
									:to="{ path: '/order/detail', query: { id: scope.orderId } }"
								>
									{{ scope.orderNum }}
								</router-link>
							</template>
						</Table>
					</el-tab-pane>
					<el-tab-pane label="银币流水明细" name="SILVER">
						<p>
							<span>累计收益银币：{{ silverInfo.total || 0 }}</span>
							<span>已转化银币：{{ Math.abs(silverInfo.transfer) || 0 }}</span>
							<span>已失效银币：{{ silverInfo.clear || 0 }}</span>
							<span>当前银币余额：{{ silverInfo.current || 0 }}</span>
						</p>
						<el-form
							:inline="true"
							:model="silverForm"
							ref="silverForm"
							class="demo-form-inline"
						>
							<el-form-item label="来源：" prop="type">
								<el-select
									v-model.trim="silverForm.type"
									placeholder="全部"
									size="small"
								>
									<el-option
										v-for="item in silverCoinsOptions"
										:key="item.val"
										:label="item.lab"
										:value="item.val"
									></el-option>
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-button
									type="primary"
									@click="SearchSilver('silverForm')"
									size="small"
								>
									查询
								</el-button>
							</el-form-item>
						</el-form>
						<Table
							:loadData="getList"
							ref="silverTable"
							v-if="activeName === 'SILVER'"
							:params="{ id: id, balanceType: activeName }"
							:column="Column"
						>
							<template v-slot:orderNum="{ scope }">
								<router-link
									tag="a"
									class="nickName"
									:to="{ path: '/order/detail', query: { id: scope.orderId } }"
								>
									{{ scope.orderNum }}
								</router-link>
							</template>
						</Table>
					</el-tab-pane>
					<el-tab-pane label="现金流水明细" name="MONEY">
						<p>
							<span>
								累计管理津贴（金币）收益：{{
									moneyFormat(moneyInfo.goldTransferSum || 0)
								}}元
							</span>
							<span>
								累计管理津贴（银币）收益：{{
									moneyFormat(moneyInfo.silverTransferSum || 0)
								}}元
							</span>
							<span>
								累计粉丝返现：{{ moneyFormat(moneyInfo.totalMoney || 0) }}元
							</span>
							<span>现金余额：{{ moneyFormat(moneyInfo.currentMoney || 0) }}元</span>
						</p>
						<el-form
							:inline="true"
							:model="moneyForm"
							ref="moneyForm"
							class="demo-form-inline"
						>
							<el-form-item label="来源：" prop="type">
								<el-select
									v-model.trim="moneyForm.type"
									placeholder="全部"
									size="small"
								>
									<el-option
										v-for="item in cashOptions"
										:key="item.val"
										:label="item.lab"
										:value="item.val"
									></el-option>
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-button
									type="primary"
									@click="SearchMoney('moneyForm')"
									size="small"
								>
									查询
								</el-button>
							</el-form-item>
						</el-form>
						<Table
							:loadData="getList"
							v-if="activeName === 'MONEY'"
							:params="{ id: id, balanceType: activeName }"
							ref="moneyTable"
							:column="Column"
						>
							<template v-slot:orderNum="{ scope }">
								<router-link
									tag="a"
									class="nickName"
									:to="{ path: '/order/detail', query: { id: scope.orderId } }"
								>
									{{ scope.orderNum }}
								</router-link>
							</template>
						</Table>
					</el-tab-pane>
				</el-tabs>
			</div>
		</el-card>
		<!-- 修改模态窗 -->
		<el-dialog
			title="修改经销商"
			:close-on-click-modal="false"
			center
			:visible.sync="dialogFormVisible"
			width="200px"
		>
			<el-form :model="levelForm" :rules="rules" ref="levelForm">
				<el-form-item
					label="等级"
					prop="level"
					style="display: flex;justify-content: center;"
				>
					<el-select v-model.trim="levelForm.level" placeholder="等级名称" size="small">
						<el-option label="一级经销商" value="ONE"></el-option>
						<el-option label="二级经销商" value="TWO"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="onClickCancel('levelForm')">取 消</el-button>
				<el-button type="primary" @click="submitForm('levelForm')">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import Table from '@/components/Table/index';
import { parseTime } from '@/utils';
import {
	mapEnumItemArray,
	mapEnumGoldCoinsArray,
	mapEnumSilverCoinsArray,
	mapDistributorType,
} from '@/utils/distributorEnum';
import { moneyFormat } from '@/core/directives/money';
import { Message } from 'element-ui';
import {
	getDistributorFansList,
	getDistributorBalanceList,
	getGoldCountInfo,
	getsilverCountInfo,
	getMoneyCountInfo,
	editDistributor,
} from '@/api/distributorManage';
import { getUserInfo } from '@/api/user';

export default {
	name: 'distributorDetail',
	components: {
		Table,
	},
	data() {
		return {
			activeName: '',
			// 粉丝表头
			fansColumn: [
				{
					prop: 'createTime',
					label: '关系绑定时间',
					formatter: row => {
						return parseTime(row.createTime);
					},
				},
				{
					prop: 'id',
					label: '关系类型',
					formatter: row => {
						return '直属粉丝';
					},
				},
				{ prop: 'nickName', label: '用户昵称', render: true },
				{ prop: 'name', label: '真实姓名' },
				{ prop: 'phone', label: '手机号' },
				{
					prop: 'sex',
					label: '性别',
					formatter: row => {
						switch (row.sex) {
							case 'MAN':
								return '男';
								break;
							case 'WOMAN':
								return '女';
								break;
							default:
								return '';
								break;
						}
					},
				},
				{
					prop: 'level',
					label: '等级',
					formatter: row => {
						switch (row.level) {
							case 'NORMAL':
								return '注册用户';
								break;
							case 'TWO':
								return '二级经销商';
								break;
							case 'ONE':
								return '一级经销商';
								break;
							default:
								return '';
								break;
						}
					},
				},
				{ prop: 'totalReturnGoldCoin', label: '累计返佣金币' },
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
			// 现金流水明细表头
			Column: [
				{
					prop: 'createTime',
					label: '发生时间',
					formatter: row => {
						return parseTime(row.createTime);
					},
				},
				{
					prop: 'type',
					label: '类型',
					formatter: row => {
						return mapDistributorType(row.type);
					},
				},
				{ prop: 'orderNum', label: '关联订单编号', render: true },
				{ prop: 'value', label: '内容' },
			],
			// 用户基本信息
			userInfo: {},
			searchFansForm: {
				bindTimeEnd: null, // 绑定开始时间
				bindTimeStart: null, // 绑定结束时间
				time: [],
			},
			goldForm: {},
			silverForm: {},
			moneyForm: {},
			circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',

			cashOptions: [{ val: '', lab: '全部' }, ...mapEnumItemArray],
			goldCoinsOptions: [{ val: '', lab: '全部' }, ...mapEnumGoldCoinsArray],
			silverCoinsOptions: [{ val: '', lab: '全部' }, ...mapEnumSilverCoinsArray],
			id: this.$route.query.id || null,
			goldInfo: {}, // 金币统计信息
			silverInfo: {}, // 银币统计信息
			moneyInfo: {}, // 现金统计信息
			// 修改用户等级数据
			dialogFormVisible: false,
			levelForm: {
				level: null, // 用户等级
				id: null, // 用户id
			},
			rules: {
				level: [{ required: true, message: '请选择等级', trigger: 'blur' }],
			},
		};
	},
	computed: {
		getFansList() {
			return getDistributorFansList;
		},
		getList() {
			return getDistributorBalanceList;
		},
	},
	mounted() {
		this.getInitUersInfo();
	},
	watch: {
		activeName(newVal, oldVal) {
			if (newVal === 'GOLD') {
				// 获取金币统考数据
				getGoldCountInfo({ id: this.id }).then(res => {
					if (res.success) {
						this.goldInfo = res.data;
					}
				});
			} else if (newVal === 'SILVER') {
				// 获取银币统计数据
				getsilverCountInfo({ id: this.id }).then(res => {
					if (res.success) {
						this.silverInfo = res.data;
					}
				});
			} else if (newVal === 'MONEY') {
				// 获取现金统计数据
				getMoneyCountInfo({ id: this.id }).then(res => {
					if (res.success) {
						this.moneyInfo = res.data;
					}
				});
			}
		},
	},
	methods: {
		moneyFormat(num) {
			return moneyFormat(num);
		},
		parseTime(time) {
			return parseTime(time);
		},
		// 初始化用户基本信息
		getInitUersInfo() {
			getUserInfo({ id: this.id }).then(res => {
				if (res.success) {
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
				}
			});
		},
		// 修改用户等级Btu 事件
		editLevel(id) {
			console.log('======>>id', id);
			this.dialogFormVisible = true;
			this.levelForm.id = id;
		},
		// 模态窗取消事件
		onClickCancel(formName) {
			this.$refs[formName].resetFields();
			this.dialogFormVisible = false;
		},
		// 模态窗确定事件
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					editDistributor({ ...this.levelForm }).then(res => {
						if (res.success) {
							this.dialogFormVisible = false;
							Message.success('操作成功！！！！');
							this.$refs.TableList.reset();
							this.getInitUersInfo();
						}
					});
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		// 选择时间
		onChangeTime(val) {
			// console.log(val)
			if (val) {
				this.searchFansForm.bindTimeStart = val[0];
				this.searchFansForm.bindTimeEnd = val[1];
			} else {
				this.searchFansForm.bindTimeStart = null;
				this.searchFansForm.bindTimeEnd = null;
			}
		},
		// 粉丝列表查询事件
		fansSearch() {
			if (this.searchFansForm.time && this.searchFansForm.time.length < 1) {
				this.searchFansForm.bindTimeStart = null;
				this.searchFansForm.bindTimeEnd = null;
			}
			this.$refs.fansTable.update({ ...this.searchFansForm });
		},
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
	},
};
</script>

<style lang="scss" scoped>
.distributorDetail {
	display: flex;
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
	flex: 1;
	margin-right: 20px;
}
.right-card {
	flex: 5;
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
	width: 49%;
	border-top: 1px solid #999;
	border-left: 1px solid #999;
	display: flex;
	align-items: center;
	justify-content: center;
	.el-button {
		padding: 0;
	}
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
h4 {
	margin: 0;
}
p {
	font-size: 16px;
	font-weight: 600;
	color: #555555;
	span {
		margin-right: 20px;
	}
}
.nickName {
	color: blue;
}
.nickName:hover {
	color: red;
}
</style>
