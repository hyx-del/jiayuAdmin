# 后台

## 第三方插件

-   省市区数据源 https://github.com/airyland/china-area-data
-   省市区级联组件 element-china-area-data 演示地址: https://plortinus.github.io/element-china-area-data/index.html

## 项目初始化环境

第一步: npm install or yarn
第二步: npm run dev 启动本地服务,配置的是链接测试环境  
 npm run build 编译项目

## 项目架构

> 项目技术：vue(2.6)、element、vue-router、axios、vuex、saas、html2canvas、 cookie、videojs-flash、vue-cropper、vuedraggable 具体版本可以查看 package.json 文件，主要的框架，是将版本锁定的，其他的一些插件是可以随意升级

### 关键说明

-   项目分为测试环境与生产环境，有环境配置文件来区分,通过 npm run dev 自动配置测试环境链接地址，npm run build 自动配置生产环境链接地址
-   图片服务器是使用的七牛云，关于七牛云的具体细节配置是运维(紫阳)在负责管理，如果后期需要图片优化配置，可以在七牛上统一配置，可以设置图片访问参数
-   图片上传是基于 token 上传到七牛云,在 app.vue 文件里面会全局管理 token,token 有效期是 10 分钟，所有每 9 分钟都会去后台请求一次 token 数据，并存放到 vuex 里面，这样在项目中任何地方上传图片只需要从 vuex 里面去获取 token 来上传图片
-   整个项目的地址管理全部是 area.js 文件里面，小程序和 APP 也同步了这个文件的内容，地址的数据源是京东,但是暂时把台湾西沙群岛,香港，澳门注释了(所属中国领土)，这里物流暂时不做配送

### 结构说明

|-public 默认配置

|-src 所有业务代码

|--api 网络接口层,所有的网络接口都放在这里,这里面是按照路由模块来进行接口分类

|--assets 静态资源

|--components 所有的公共组件

|---Breadcrumb 面包屑模块

|---cropperImg 自定义图片剪切，剪切完成后自动上传到远程图片服务器

|---Hamburger 菜单缩放组件

|---HotZone 热区组件(用户上传图片后，在图片区域上方划分 div 区域，并给 div 预设值 行为跳转值，从而达到灵活多变的业务场景)

|---SvgIcon svgIcon 组件

|---Table 自定义表格组件，主要是分页，刷新 自定义表头,单选，多选，内部序号等功能

|---upload 图片上传组件，这个有区分于图片剪切组件，这个是自动上传图片，不做剪切

|---uploadDrag 自动上传图片，并且可以多图多动，并自动同步 value 的文件顺序

|---uploadSlot 遗弃

|---videoPreview 视频预览组件

|--config 配置项目的全局环境变量,主要是七牛的地址

|--core 指令配置，主要是金额格式化，时间格式化

|--icons icon 静态文件

|--layout 后台主界面布局文件

|--router 路由文件，配置了默认路由，logo,404 等。和动态路由(权限),通过用户登录获取菜单 code 值，重现往路由添加匹配的菜单路由(菜单 code excel 文件在项目附件了可以查看),绝大部分的文件路由名称都是这个模块在 views 中对应的文件名称

|--store store 里面主要是存了用户基本信息和 七牛 token

|--styles 主要是项目主题覆盖文件，项目全局样式文件，和一些其他公共组件样式文件

|--utils 这里主要是存放了一些公共的工具，函数功能

|--views 按照菜单来拆分的路由文件，为了更方便的查看文件，建议你可以冲 router 文件来做索引

|--App.vue 项目主入口文件模板

|--main.js 项目主入口文件

|--setting.js

|-jsonfig.json 默认配置

|-package.json 默认配置

|-vue.config.js 配置了别名，其他都是项目默认配置

### util

    1、时间格式化
    2、传递区间日期对象， 返回 开始时间为当天的 00:00:00    结束时间为 23:59:59
    3、判断数据是否为空数据  ''  null undefined
    4、图片上传组件

## 自定义过滤器

    1、时间格式
    2、金额格式化  123456> 123,456  1211.36 > 1,211.36
