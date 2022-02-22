// 获取继承属性
export const getInherit = (item, el, obj = {}) => {
  let list =
    el && inheritObj[el]
      ? [...(inheritObj[el].list || []), "class", "style"]
      : ["class", "style"];
  let defaltObj = el && inheritObj[el] ? inheritObj[el].default || {} : {};
  let backObj = { ...defaltObj };
  backObj = { ...backObj, ...obj };

  if ((backType(item), "Object")) {
    list.forEach((key) => {
      if (item[key]) {
        backObj[key] = item[key];
      }
    });
  }
  if (item.code) {
    backObj.ref = item.code;
  }
  if (item.placeholder) {
    backObj.placeholder = item.placeholder;
  }

  return backObj;
};
export const inheritObj = {
  inSlot: {
    el: "span",
    name: "",
    list: [],
  },
  span: {
    el: "span",
    name: "span",
    list: [],
  },
  div: {
    el: "div",
    name: "div",
    list: [],
  },
  button: {
    el: "el-button",
    name: "按钮",
    list: [
      "size",
      "type",
      "plain",
      "round",
      "circle",
      "loading",
      "disabled",
      "icon",
      "autofocus",
      "ativeType",
      "autoInsertSpace",
    ],
  },
  elButton: {
    el: "el-button",
    name: "按钮",
    list: [
      "size",
      "type",
      "plain",
      "round",
      "circle",
      "loading",
      "disabled",
      "icon",
      "autofocus",
      "ativeType",
      "autoInsertSpace",
    ],
  },
}
export function parseTime(time, cFormat) {
	if (arguments.length === 0 || !time) {
		return null;
	}
	const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
	let date;
	if (typeof time === 'object') {
		date = time;
	} else {
		if (typeof time === 'string') {
			if (/^[0-9]+$/.test(time)) {
				// support "1548221490638"
				time = parseInt(time);
			} else {
				// support safari
				// https://stackoverflow.com/questions/4310953/invalid-date-in-safari
				time = time.replace(new RegExp(/-/gm), '/');
			}
		}

		if (typeof time === 'number' && time.toString().length === 10) {
			time = time * 1000;
		}
		date = new Date(time);
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay(),
	};
	const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
		const value = formatObj[key];
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') {
			return ['日', '一', '二', '三', '四', '五', '六'][value];
		}
		return value.toString().padStart(2, '0');
	});
	return time_str;
}

// 比较两个时间star<end,返回 true
export function compareTime(star, end) {
	var starTime = new Date(star).getTime();
	var endTime = new Date(end).getTime();
	return starTime < endTime;
}
export function backType(cc, string) {
	var typeName = Object.prototype.toString.call(cc);
	if (typeName == '[object Object]') {
		typeName = '[object ' + cc.constructor.name;
	}
	typeName = typeName.replace(']', '').slice(8);
	if (string) {
		return typeName == string;
	}
	return typeName;
}

export const dataFormat = {
	year: '{y}',
	month: '{m}',
	date: '{y}-{m}-{d}',
	dates: '{y}-{m}-{d}',
	week: '{y}-{m}-{d}',
	datetime: '{y}-{m}-{d} {h}:{i}:{s}',
	daterange: '{y}-{m}-{d}',
	monthrange: '{y}-{m}-{d}',
	datetimerange: '{y}-{m}-{d} {h}:{i}:{s}',
};

export const checkArr = {
	// img
};

export const checkType = {
	number: {
		name: '数字检查',
		regular: /^[0-9]*$/,
		error: '请输入正整数',
	},
	numberPoint: {
		name: '无限制小数点的数字检查',
		regular: /^([1-9][0-9]*)+(.[0-9]{1,})?$/,
		error: '请输入数字',
	},
	numberPoint2: {
		name: '最多两个小数点的数字检查',
		regular: /^([0-9]*)+(.[0-9]{1,2})?$/,
		error: '请输入最多两个小数点的数字',
	},	numberPoint3: {
		name: '请输入两位小数点的数字检查',
        regular: /^[0-9]{1,5}(.[0-9]{2})$/,
		error: '请输入最多两个小数点的数字',
	},
	phone: {
		name: '手机号检查',
		regular: /^[1]([3-9])[0-9]{9}$/,
		error: '请输入正确的手机号',
	},
	email: {
		name: '邮箱验证',
		regular: /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/,
		error: '请输入正确的邮箱',
	},
	zh: {
		name: '中文检查',
		regular: /^[\u4e00-\u9fa5]+$/,
		error: '请输入中文',
	},
	password: {
		name: '密码数字加特殊字符',
		regular: /^(?![0-9]+$)(?![a-zA-Z\.!@#$%^&*()_+|{}?><\-\]\\[\/'"\:\;\,\<\>]+$)[0-9A-Za-z\.!@#$%^&*()_+|{}?><\-\]\\[\/'"\:\;\,\<\>]{6,20}$/,
		error: '请输入中文',
	},
	letter: {
		name: '字母检查',
		regular: /^[A-Za-z]+$/,
		error: '请输入英文字母',
	},
	letterNum: {
		name: '数字加字母检查',
		regular: /^[A-Za-z0-9]{4,40}$/,
		error: '请输入英文字母加数字',
	},
	goodsCode: {
		name: '数字加字母检查',
		regular: /^[A-Za-z0-9]{3,40}$/,
		error: '请输入长度不少于三位的英文字母加数字',
	},
};
export const checkTypeArr = Object.keys(checkType);
// 重置时的默认值 reset
export const resetDefalt = {
  switch: false,
  slider: 0,
  rate: 0,
  inputNumber: 0,
  checkbox: [],
  checkBox: [],
};
export const resetDefaltList = Object.keys(resetDefalt);
