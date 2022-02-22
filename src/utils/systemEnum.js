/*
 * @Author: wei.chen
 * @Date: 2020-11-06 16:43:52
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-12-29 11:43:03
 * @Description: 枚举数据
 */
// 数组转换成对象
const listToObj = (list, key = "value") => {
  let obj = {};
  list.forEach(item => {
    obj[item[key]] = {
      ...item
    };
  });
  return obj;
};
const typeEnum = {
	'1': '瑜伽',
	// '2': '普拉提',
	'3': '冥想',
	'4': '智慧',
	// '5': '音乐',
	'6': '教练',
	'7': '百科',
	'8': '新闻',
	'9': 'H5',
	'11': '瑜伽栏目',
};
const typeEnums= {
	'1': '瑜伽课程',
	'11': '瑜伽栏目',
	'3': '冥想',
	'4': '智慧',
	// '5': '音乐',
	'6': '教练',
	'7': '百科',
	'8': '新闻',
	'9': 'H5',
};
// 注册源
const registeredSource = {
	'': '全部',
	iOS: '苹果手机',
	Android: '安卓手机',
	WechatMP: '微信小程序',
	Store: '门店',
	NONE: '未知来源',
	YQH5: '邀请注册',
};

// 注册源
const platform = {
	iOS: '苹果',
	Android: '安卓',
	WechatMP: '微信小程序',
	WechatSUB: '微信公众号',
};

// 状态
const stateList = [
	{
		label: '全部',
		value: '',
	},
	// {
	//   label:'未上线',
	//   value:'0'
	// },
	{
		label: '已上线',
		value: '1',
	},
	{
		label: '已下线',
		value: '0',
	},
];
// 状态
const stateLists = [
	{
		label: '全部',
		value: '',
	},
	{
	  label:'未上线',
	  value:'0'
	},
	{
		label: '已上线',
		value: '1',
	},
	{
		label: '已下线',
		value: '2',
	},
];
const stateObj = {
	'': '全部',
	null: '未上线',
	'0': '未上线',
	'1': '已上线',
	'2': '已下线',
};
 const buyList = [
  {
    label: '免费',
    value: "0",
  },
  {
    label: '积分付费',
    value: "1",
  },
  {
    label: '积分+现金付费',
    value: "2",
  },
]
// 1:瑜伽课程 2:冥想 3:智慧幸福
export const resourcesList = [
  {
    label: '瑜伽课程',
    value: "1",
  },
  {
    label: '冥想',
    value: "2",
  },
  {
    label: '智慧幸福',
    value: "3",
  },
]
export const resourcesObj= listToObj(resourcesList)
const buyType = {
  0:'免费',
  1:'积分付费' ,
  2:'积分+现金付费'
};



export { typeEnum,typeEnums, registeredSource, platform, stateList,stateLists, stateObj ,buyType,buyList};
