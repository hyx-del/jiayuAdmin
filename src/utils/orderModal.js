/*
 * @Author: wei.chen
 * @Date: 2020-11-06 16:43:52
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-06-16 09:30:02
 * @Descripttion:
 */
export function mapOrderState(status) {
	let _str = '--';
	switch (status) {
		case 0:
			_str = '待支付';
			break;
		case 1:
			_str = '待发货';
			break;
		case 2:
			_str = '待收货';
			break;
		case 3:
			_str = '已完成';
			break;
		case 4:
			_str = '已取消';
			break;
		case 5:
			_str = '已关闭';
			break;

		default:
			_str = '--';
	}
	return _str;
}
export function mapSourceInfo(source) {
	switch (source) {
		case 'ANDROID':
			return 'APP';
			break;
		case 'IOS':
			return 'APP';
			break;
		case 'MINI':
			return '小程序';
			break;
		case 'H5':
			return '小程序';
			break;
		case 'WEB':
			return 'PC';
			break;
		case 'BYTE_DANCE_MINI':
			return '抖音小程序';
			break;
		default:
			return '-';
			break;
	}
}
