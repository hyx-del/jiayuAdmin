# FormList 使用
### html
```
<formList :formObj="formObj" :list="list" @button="formButton"/>
```


## js 内
### 引入
```
import formList from '@/components/FormList/index';
```
```
components: {
    formList
},
```
##props
###loading提交的loading事件
双向绑定的
###formObj赋值对象
接收返回值对象，可以传入相对应的值，即可赋值到表单里 ，例如：
```
formObj:{
    title:'法外狂徒',
    name:'张三',
}
```
###config
表单的配置，下面的这些都是默认的值
```
 config:{
        buttonsArea:'',// popButtom固定到底部
        enter:true,// 在input里按下enter键是否验证，会触发提交事件
        allRequired:true,// 是否全部必填
        labelShow:true,//是否显示前面的label
        labelWidth:'',//label的宽度，优先会用这个，其次会自动计算最大label长度加上colon的长度再+是否有必填选项＋1得到一个值，例如10em
        inline:false,//是否是行内
        inputStyle:{//input框样式，css
          width:'360px',
        },
        size:'small',//表单的尺寸
        colon:'：',// label后的冒号，可以替换成其他的
        mainStyle:{//主体的样式，css，下面的注释里的是在单独页面或者弹窗里可以用的样式
          // width:'80%',
          // marginLeft:'10%',
          // display:'flex',
          // flexWrap:'wrap',
          // justifyContent:'space-between'
        }
},
```

list：生成表单的数组，el代生成的什么样的组件目前有input(默认),select,date,

list内的元素说明：必填的必须写不然可能报错

| 字段  | 类型 |默认值or是否必填|说明|
| --- | ------ | ------ |--------- |
| el   | String|  input |非必填,select(下拉),CheckBox(多选),radio(单选),area(省市区),area(省市区) |
| label   | String|  必填 |表单前面名字 |
| code   | String|  必填 |字段名，用于接收表单返回值，formObj里填入相对于值，可以用于编辑|
| required   | Boolean|  true |是否必填，默认必填 |
| select说明 | ------ | ------ |--------- |
| list   | Array|  非必填 |在select，radio，checkbox,里可填 元素例子：{label:'选择1',value:'1',}, |
| maxlength   | Number|  非必填 |最大长度 |
| minlength   | Number|  非必填 |最小长度 |
| radio 说明 单选 | ------ | ------ |返回值字符串（value的字符串），数组（选中的数组） |
| checkbox 说明 多选选 | ------ | ------ |返回值字符串（选中的value的字符串），数组（选中的数组） |
| list   | Array|  非必填 |传入的数组 |
| endVal   | string|  非必填 |值：'all',，返回所选的对象数组 |



## 省市区插件

```
item.areaCode 接收字段 province(省),provinceId(省id),city(市),cityId(市ID),county(区),countyId(区ID)
```


## **获取结果**
@formButton="formButton" 点击按钮的回调
```
val:{
    name:'按钮名称',//confirm会获取验证过的结果，没通过是false，reset重置表单，其他的名字不会触发表单事件
    valid:true,//是否通过验证
    value:{}//验证通过后会把结果以对象形式返回
}

formButton(val){
  if (val.name=='confirm'&&val.valid) {
        let data=val.value
        // data 就是结果
  }
}
```

# list 示例
```
list:[
    {
        code:'title',
        label:'新闻标题',
    },
     {
        el:'select',
        code:'select',
        label:'选择',
        list:[
            {
                label:'选择1',
                value:'1',
            },
             {
                label:'选择2',
                value:'2',
            }
        ]
    },
     {
        el:'date',
        code:'title',
        label:'选择时间',
    },
]
```

