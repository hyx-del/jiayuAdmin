/*
 * @Author: wei.chen
 * @Date: 2020-11-06 16:43:52
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-05-11 13:29:38
 * @Descripttion: 枚举数据
 */

const enumGoldCoins = {
	REWARD_GOLD: '金币返佣',
	CLEAR_GOLD: '金币到期',
	CALC_GOLD: '金币到期转化',
};

const enumSilverCoins = {
	CLEAR_SILVER: '银币到期',
	REWARD_SILVER: '银币返佣',
	CALC_SILVER: '银币到期转化',
};

const enumAccountDetails = {
	SYSTEM_EDIT: '系统修改',
	SIGN_IN: '签到',
	SIGN_SHARE_DOUBLE: '签到分享翻倍',
	SIGN_TIME_REWARD: '定时签到奖励',
	WITHDRAW: '提现',
	WITHDRAW_RETURN: '提现返还',
	CASH_BACK: '粉丝首次消费返现',
	BALANCE_PAY: '购物支出',
	REWARD_MONEY: '首单返现',
	GOLD_2_MONEY: '金币转化余额',
	SILVER_2_MONEY: '银币转化余额',
	RED_PACK: '新人红包',
	DEDUCTION_RETURN_ORDER_CLOSE: '订单取消',
	ORDER_REFUND: '售后退款',
	ORDER_CLOSE_RETURN: '订单关闭返还余额',
	ORDER_REFUND_RETURN_MONEY: '售后退回余额',
	NEW_ACT_REWARD: '邀友活动奖励',
};

const mapEnumItem = { ...enumGoldCoins, ...enumSilverCoins, ...enumAccountDetails };
const tempMapEnumItem = [];
const tempEnumGoldCoinsItem = [];
const tempEnumSilverCoinsItem = [];
for (const item in enumGoldCoins) {
	tempEnumGoldCoinsItem.push({ val: item, lab: mapEnumItem[item] });
}
for (const item in enumSilverCoins) {
	tempEnumSilverCoinsItem.push({ val: item, lab: mapEnumItem[item] });
}

for (const item in mapEnumItem) {
	tempMapEnumItem.push({ val: item, lab: mapEnumItem[item] });
}

export const mapEnumItemArray = [...tempMapEnumItem];
export const mapEnumGoldCoinsArray = [...tempEnumGoldCoinsItem];
export const mapEnumSilverCoinsArray = [...tempEnumSilverCoinsItem];

export function mapDistributorType(status) {
	let _str = mapEnumItem[status];
	return _str;
}
