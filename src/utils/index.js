/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */

import { compareTime } from "@/components/FormList/utils";
import { Message } from "element-ui";

export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string") {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time);
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), "/");
      }
    }

    if (typeof time === "number" && time.toString().length === 10) {
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
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    return value.toString().padStart(2, "0");
  });
  return time_str;
}

// 判断一个时间是否在区间里,如果在时间区间里返回true
export function testTimeIn(start, end, check) {
  let startTime = new Date(start || "1900-01-01").getTime();
  let endTime = new Date(end || "2300-12-31").getTime();
  let checkTime = new Date(check || new Date()).getTime();
  return checkTime < endTime && checkTime > startTime;
}
/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (("" + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return "刚刚";
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + "分钟前";
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + "小时前";
  } else if (diff < 3600 * 24 * 2) {
    return "1天前";
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return d.getMonth() + 1 + "月" + d.getDate() + "日" + d.getHours() + "时" + d.getMinutes() + "分";
  }
}
export function Time(time) {
  var min = Math.floor(time % 3600);
  return `${Math.floor(time / 3600)}时${Math.floor(min / 60)}分${time % 60}秒`;
}
/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split("?")[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, " ") +
      '"}'
  );
}

/**
 * @name:
 * @description: sku解析  [{properties:"材质:羊毛;尺寸:M;颜色:黑色;"},{properties:"材质:羊毛;尺寸:M;颜色:黑色;"}]
 * @param {Array}   val  包含properties值数组
 * @return: names:属性名  sku 属性值
 */
export function getSku(val) {
  if (!val) {
    return false;
  }
  let properties = [];
  let names = [];
  let sku = [];
  let arr2 = [];
  let obj = {};
  let handle = [];
  for (let i = 0; i < val.length; i++) {
    properties.push(val[i].properties);
  }
  for (let i = 0; i < properties.length; i++) {
    let item = properties[i].split(";");

    let arr1 = [];
    for (let j = 0; j < item.length; j++) {
      let name = item[j].split(":");
      handle.push(name[0], name[1]);
      arr1.push(name[0]);
      arr2.push(name[1]);
      obj[name[0]] = [];
      Object.keys(obj).forEach((item) => {
        if (item == name[0]) {
          // console.log(name[1], obj[item])
          obj[item].push(name[1]);
        }
      });
    }
    // 由于拼接时候最后一个会有空，需要删除
    arr1.splice(arr1.length - 1, 1);
    arr2.splice(arr2.length - 1, 1);
    names = arr1;
    sku = Array.from(new Set(arr2));
  }
  // 模拟用户操作
  handle = handle.filter((item) => {
    return item;
  });
  return { names, sku, handle };
}

/**
 * @name:
 * @description: 复制内容到粘贴板
 * @param {str} content : 需要复制的内容
 * @param {str} message : 复制完后的提示，不传则默认提示"复制成功"
 * @return:
 */

export function copyToClip(content, message) {
  var aux = document.createElement("input");
  aux.setAttribute("value", content);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
  if (message == null) {
    Message.success("复制成功！！！");
  } else {
    Message(message);
  }
}
//数字千分位
export function toLocaleString(num) {
  return  parseInt(num).toLocaleString("en-US")
}
//对象变url的字符串拼接
export function objToUrl(obj) {
  let str=''
  for (let key in obj) {
    str+=`&${key}=${obj[key]}`
  }
  return str.substring(1)
}

// 从 一个对象总获取到一个新的对象
export const getSomeKey = (obj={},list=[]) => {
  let backObj={}
  list.forEach(item=>{
    backObj[item]=obj[item]
  })
  return backObj
}

// 取两数组之间的差值,arrA小数组，arrB大数组，a相当于b的差值
export const differenceArray = (arrA,arrB) => {
  let setA=new Set([...arrA])
  let setB=new Set([...arrB])
  let diff =  Array.from(new Set(arrB.filter(x => !setA.has(x))));
  return diff||[]
}

//表格排序 设置顺序小-到 未填写在后面
export let  tableSort=(table)=>{
  let haveList = table.filter((item) => item.sort);
  haveList.sort((a, b) => a.sort - b.sort);
  let none = table.filter((item) => !item.sort);
  return [...haveList, ...none];
}
