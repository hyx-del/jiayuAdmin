//获取动态路由方法
import Layout from "@/layout";
let constantRoutes2 = [
  {
    code: 'd',
    path: "/dataCenter",
    component: Layout,
    redirect: "/dataCenter/user",
    name: "dataCenter",
    meta: { title: "数据中心", icon: "setting", code: "d" },
    children:[
      {
        path: "user",
        name: "用户数据",
        component: () => import("@/views/dataCenter/user/user"),
        meta: { title: "用户数据", icon: "user", code: "da" },
      },
      {
        path: "yogaCourse",
        name: "瑜伽课程数据",
        component: () => import("@/views/dataCenter/yogaCourse/index"),
        meta: { title: "瑜伽课程数据", icon: "course", code: "db" },
      },
      {
        path: "meditation",
        name: "冥想数据",
        component: () => import("@/views/dataCenter/meditation/index"),
        meta: { title: "冥想数据", icon: "Meditation", code: "dc" },
      },
      {
        path: "meditationListen",
        name: "脑环监测数据",
        component: () => import("@/views/dataCenter/meditationListen/index"),
        meta: { title: "脑环监测数据", icon: "jianting", code: "dd" },
      },
      {
        path: "happiness",
        name: "幸福智慧数据",
        component: () => import("@/views/dataCenter/happiness/index"),
        meta: { title: "幸福智慧数据", icon: "feedback", code: "de" },
      },
      {
        path: "integrate",
        name: "积分数据",
        component: () => import("@/views/dataCenter/integrate/index"),
        meta: { title: "积分数据", icon: "taskScore", code: "df" },
      },
      {
        path: "daiy",
        name: "运营日报",
        component: () => import("@/views/dataCenter/daiy/index"),
        meta: { title: "运营日报", icon: "taskScore", code: "dg" },
      },
    ]
  },
  {
    path: "/operation",
    component: Layout,
    redirect: "/operation",
    name: "operation",
    meta: { title: "运营管理", icon: "operation1", code: "p" },
    children:[
      {
        path: "homeConfig",
        name: "homeConfig",
        component: () => import("@/views/index"),
        meta: { title: "APP首页配置", icon: "setting", code: "pa" },
        children:[
          {
            path: "homeTabConfig",
            name: "homeTabConfig",
            component: () => import("@/views/homeConfig/tabConfig/index"),
            meta: { title: "Tab选项管理", icon: "homeTabConfig", code: "paa" },
          },
          {
            path: "masterRegion",
            name: "masterRegion",
            component: () => import("@/views/homeConfig/masterRegion/index"),
            meta: { title: "校长专区", icon: "admin", code: "pab" },
          },
          {
            path: "highQualityCourses",
            name: "highQualityCourses",
            component: () => import("@/views/homeConfig/highQualityCourses/index"),
            meta: { title: "精品课程", icon: "highQualityCourses", code: "pac" },
          },
          {
            path: "highQualityCoursesAdd",
            name: "highQualityCoursesAdd",
            hidden: true,
            component: () => import("@/views/homeConfig/highQualityCourses/add"),
            meta: { title: "新增精品课程", icon: "admin" },
          },
        ]
      },
      {
        path: "userList",
        name: "用户管理",
        component: () => import("@/views/user/userList/index"),
        meta: { title: "用户管理", icon: "user", code: "pb" },
      },
      {
        path: "userDetail",
        name: "用户详情",
        component: () => import("@/views/user/userDetail/index"),
        hidden: true,
        activeMenu: "/user/userList",
        meta: { title: "用户详情", icon: "setting" },
      },
      {
        path: "search",
        name: "搜索历史管理",
        component: () => import("@/views/search/index"),
        meta: { title: "搜索历史管理", icon: "search", code: "pc" },
      },

      {
        path: "searchHot",
        name: "热门搜索管理",
        component: () => import("@/views/search/hot"),
        meta: { title: "热门搜索管理", icon: "hot", code: "pd" },
      },
      {
        path: "toastModalWindow",
        name: "toastModalWindow",
        component: () => import("@/views/operation/toastModalWindow/index"),
        meta: { title: "弹窗管理", icon: "toastModalWindow", code: "pe" },
      },
      {
        path: "bannerList",
        name: "bannerList",
        component: () => import("@/views/operation/banner/index"),
        meta: { title: "banner管理", icon: "banner", code: "pf" },
      },
      {
        path: "coopen",
        name: "coopen",
        component: () => import("@/views/operation/coopen/index"),
        meta: { title: "开屏广告管理", icon: "ad", code: "pg" },
      },
      {
        path: "practice",
        name: "practice",
        component: () => import("@/views/operation/practice/index"),
        meta: { title: "练习广告管理", icon: "ad", code: "ph" },
      },
      {
        path: "welcomingSpeech",
        name: "welcomingSpeech",
        component: () => import("@/views/Admin/welcomingSpeech/index"),
        meta: { title: "欢迎词管理", icon: "welcomingSpeech", code: "pi" },
      },
      {
        path: "comment",
        name: "comment",
        component: ()=> import("@/views/index"),
        meta: { title: "评论管理", icon: "commentManagement", code: "pj" },
        children:[
          {
            path: "index",
            name: "index",
            component: () => import("@/views/operation/comment/index.vue"),
            meta: { title: "评论管理", icon: "commentManagement", code: "pj" },
          },
          {
            path: "sensitive",
            name: "sensitive",
            component: () => import("@/views/operation/comment/sensitive/index.vue"),
            meta: { title: "敏感词管理", icon: "newUserTaskConfig", code: "ppbss" },
          },
          {
            path: "sensitiveType",
            name: "sensitiveType",
            component: () => import("@/views/operation/comment/sensitiveType/index"),
            meta: { title: "敏感词类型管理", icon: "newUserTaskConfig", code: "ppcs" },
          },
        ]
      },
      {
        path: "inviteFriends",
        name: "inviteFriends",
        component: () => import("@/views/operation/inviteFriends/index"),
        meta: { title: "邀请好友管理", icon: "invitation", code: "pk" },
      },
      {
        path: "feedback",
        name: "feedback",
        component: () => import("@/views/operation/feedback/index"),
        meta: { title: "意见反馈", icon: "opinion", code: "pl" },
      },
      {
        path: "systemNotice",
        name: "系统公告",
        component: () => import("@/views/operation/systemNotice/index"),
        meta: { title: "系统公告", icon: "systemNotice", code: "pm" },
      },
      {
        path: "luckyDrawList",
        name: "抽奖列表",
        component: () => import("@/views/operation/luckyDraw/index"),
        meta: { title: "抽奖列表", icon: "luckyDraw", code: "pn",},
      },
      {
        path: "luckyDrawConfig",
        name: "抽奖管理",
        component: () => import("@/views/operation/luckyDraw/config"),
        meta: { title: "抽奖管理", icon: "luckyDraw",code: "po", },
      },
      {
        path: "taskScore",
        name: "taskScore",
        component: () => import("@/views/index"),
        meta: { title: "积分管理", icon: "taskScore", code: "pp" },
        children:[
          {
            path: "taskScoreList",
            name: "taskScoreList",
            component: () => import("@/views/taskScore/taskScoreList/index"),
            meta: { title: "积分明细", icon: "taskScoreList", code: "ppa" },
          },
          {
            path: "newUserTaskConfig",
            name: "newUserTaskConfig",
            component: () => import("@/views/taskScore/newUserTask/index"),
            meta: { title: "新手任务", icon: "newUserTaskConfig", code: "ppb" },
          },
          {
            path: "signTask",
            name: "signTask",
            component: () => import("@/views/taskScore/signManage/index"),
            meta: { title: "签到积分", icon: "signTask", code: "ppc" },
          },
          {
            path: "everyDayTask",
            name: "everyDayTask",
            component: () => import("@/views/taskScore/everyDayTask/index"),
            meta: { title: "每日任务", icon: "everyDayTask", code: "ppd" },
          },
        ]
      },
      {
        path: "blacklist",
        name: "blacklist",
        component: () => import("@/views/index"),
        meta: { title: "黑名单管理", icon: "taskScore", code: "pq" },
        children:[
          {
            path: "blacklist",
            name: "blacklist",
            component: () => import("@/views/blacklist/index"),
            meta: { title: "黑名单管理", icon: "taskScoreList", code: "pqa" },
          },
        ]
      },
    ]
  },
  {
    path: "/content",
    component: Layout,
    redirect: "/content",
    name: "operation",
    meta: { title: "内容管理", icon: "neirong", code: "c" },
    children:[
      {
        path: "wiki",
        name: "wiki",
        component: () => import("@/views/index"),
        meta: { title: "百科管理", icon: "operation", code: "ca" },
        children:[
          {
            path: "index",
            name: "index",
            component: () => import("@/views/wiki/index"),
            meta: { title: "百科管理", icon: "operation", code: "caa" },
          },
          {
            path: "add",
            name: "add",
            hidden: true,
            component: () => import("@/views/wiki/add"),
            meta: { title: "添加百科", icon: "feedback" },
          },
          {
            path: "detail",
            name: "百科详情",
            hidden: true,
            component: () => import("@/views/wiki/detail"),
            meta: { title: "百科详情", icon: "feedback" },
          },
          {
            path: "column",
            name: "百科栏目",
            component: () => import("@/views/wiki/column"),
            meta: { title: "百科栏目", icon: "column", code: "cab" },
          },
        ]
      },
      {
        path: "information",
        name: "梵音资讯管理",
        component: () => import("@/views/information/index"),
        meta: { title: "梵音资讯管理", icon: "feedback", code: "cb" },
      },
      {
        path: "information/add",
        hidden: true,
        name: "添加资讯",
        component: () => import("@/views/information/add"),
        meta: { title: "添加资讯" },
      },
      {
        path: "information/detail",
        hidden: true,
        name: "资讯详情",
        component: () => import("@/views/information/detail"),
        meta: { title: "资讯详情" },
      },
      {
        path: "meditation",
        name: "meditation",
        component: () => import("@/views/index"),
        meta: { title: "冥想管理", icon: "Meditation", code: "cc" },
        children:[
          {
            path: "index",
            name: "冥想管理",
            component: () => import("@/views/meditation/index"),
            meta: { title: "冥想管理", icon: "Meditation", code: "cca" },
          },
          {
            path: "add",
            name: "添加冥想",
            hidden: true,
            component: () => import("@/views/meditation/add"),
            meta: { title: "添加冥想", icon: "feedback" },
          },
          {
            path: "detail",
            name: "冥想详情",
            hidden: true,
            component: () => import("@/views/meditation/detail"),
            meta: { title: "冥想详情", icon: "feedback" },
          },
          {
            path: "column",
            name: "冥想栏目",
            component: () => import("@/views/meditation/column"),
            meta: { title: "冥想栏目", icon: "meditationcolumn", code: "ccb" },
          },
        ]
      },
      {
        path: "wisdom",
        name: "wisdom",
        component: () => import("@/views/index"),
        meta: { title: "幸福智慧管理", icon: "operation", code: "cd" },
        children:[
          {
            path: "index",
            name: "幸福智慧管理",
            component: () => import("@/views/wisdom/index"),
            meta: { title: "幸福智慧管理", icon: "feedback", code: "cda" },
          },
          {
            path: "column",
            name: "幸福智慧管理",
            component: () => import("@/views/wisdom/column"),
            meta: { title: "幸福智慧栏目", icon: "feedback", code: "cdb" },
          },
          {
            path: "add",
            name: "添加幸福智慧",
            hidden: true,
            component: () => import("@/views/wisdom/add"),
            meta: { title: "添加幸福智慧", icon: "feedback" },
          },
          {
            path: "detail",
            name: "幸福智慧详情",
            hidden: true,
            component: () => import("@/views/wisdom/detail"),
            meta: { title: "幸福智慧详情", icon: "feedback" },
          },
        ]
      },
      {
        path: "course",
        name: "course",
        component: () => import("@/views/index"),
        meta: { title: "瑜伽课程管理", icon: "course", code: "ce" },
        children:[
          {
            path: "index",
            name: "瑜伽课程管理",
            component: () => import("@/views/course/index"),
            meta: { title: "瑜伽课程管理", icon: "course", code: "cea" },
          },
          {
            path: "add",
            name: "添加瑜伽课程",
            hidden: true,
            component: () => import("@/views/course/add"),
            meta: { title: "添加瑜伽课程", icon: "feedback" },
          },
          {
            path: "detail",
            name: "瑜伽课程详情",
            hidden: true,
            component: () => import("@/views/course/detail"),
            meta: { title: "瑜伽课程详情", icon: "feedback" },
          },
          {
            path: "column",
            name: "瑜伽栏目",
            component: () => import("@/views/course/column"),
            meta: { title: "瑜伽栏目", icon: "coursecolumn", code: "ceb" },
          },

          {
            path: "columnAdd",
            name: "添加栏目",
            hidden: true,
            component: () => import("@/views/course/columnAdd"),
            meta: { title: "添加栏目", icon: "feedback" },
          },
          {
            path: "columnDetail",
            name: "栏目详情",
            hidden: true,
            component: () => import("@/views/course/columnDetail"),
            meta: { title: "栏目详情", icon: "feedback" },
          },
          {
            path: "yogaScreen",
            name: "瑜伽筛选数据",
            component: () => import("@/views/yogaManage/yogaScreen/index"),
            meta: { title: "瑜伽筛选数据", icon: "yogaScreen", code: "cec" },
          },
          {
            path: "yogaScreen/yogaScreenVal",
            name: "筛选数据值",
            hidden: true,
            component: () => import("@/views/yogaManage/yogaScreenVal/index"),
            meta: { title: "筛选数据值", icon: "form" },
          },

        ]
      },
      //----------
      {
        path: "order",
        name: "课程订单",
        component: () => import("@/views/yogaManage/order/index"),
        meta: { title: "课程订单", icon: "yogaScreen", code: "cg" },
      },
      //----------
      {
        path: "coach",
        name: "coach",
        component: () => import("@/views/index"),
        meta: { title: "教练管理", icon: "coach", code: "cf" },
        children:[
          {
            path: "index",
            name: "教练列表",
            component: () => import("@/views/coachManage/coachList/index"),
            meta: { title: "教练列表", icon: "coachList", code: "cfa" },
          },
          {
            path: "add",
            name: "添加教练",
            hidden: true,
            component: () => import("@/views/coachManage/coachList/add"),
            meta: { title: "添加教练", icon: "admin" },
          },
          {
            path: "detail",
            name: "教练详情",
            hidden: true,
            component: () => import("@/views/coachManage/coachList/detail"),
            meta: { title: "教练详情", icon: "admin" },
          },
          {
            path: "coachLevel",
            name: "coachLevel",
            component: () => import("@/views/coachManage/coachLevel/index"),
            meta: { title: "教练等级", icon: "coachLevel", code: "cfb" },
          },
          {
            path: "assistant",
            name: "assistant",
            component: () => import("@/views/coachManage/assistant/index"),
            meta: { title: "助教管理", icon: "coach", code: "cfc" },
          },
        ]
      },
    ]
  },
  {

    path: "/mall",
    component: Layout,
    redirect: "/mall",
    name: "积分商城管理",
    meta: { title: "积分商城管理", icon: "mall", code: "i" },
    children:[
      {
        path: "operation",
        name: "商城配置",
        component: () => import("@/views/index"),
        meta: { title: "商城配置", icon: "mall", code: "ia" },
        children:[
          {
            path: "banner",
            name: "banner配置",
            component: () => import("@/views/mall/banner/index"),
            meta: { title: "banner配置", icon: "banner", code: "iaa" },
          },
          {
            path: "catManage",
            name: "类目管理",
            component: () => import("@/views/mall/catManage/index"),
            meta: { title: "类目管理", icon: "cat", code: "iab" },
          },
          {
            path: "catManage/attribute",
            name: "类目属性",
            hidden: true,
            component: () => import("@/views/mall/catManage/attribute"),
            meta: { title: "类目属性", icon: "cat" },
          },
          {
            path: "logistics",
            name: " 物流配置",
            component: () => import("@/views/mall/logistics/index"),
            meta: { title: " 物流配置", icon: "logistics", code: "iac" },
          },
          {
            path: "brand",
            name: "品牌配置",
            component: () => import("@/views/mall/brand/index"),
            meta: { title: "品牌配置", icon: "brand", code: "iad" },
          },
          {
            path: "rules",
            name: "规则及服务",
            component: () => import("@/views/mall/rules/index"),
            meta: { title: "规则及服务", icon: "operation", code: "iae" },
          },
          {
            path: "orderRule",
            name: "订单规则",
            component: () => import("@/views/mall/orderRule/index"),
            meta: {title: "订单规则",icon: "admin", activeMenu: "/order/orderRule", code: "iaf",},
          },
        ]
      },
      {
        path: "malloperation",
        name: "商城运营配置",
        component: () => import("@/views/index"),
        meta: { title: "商城运营配置", icon: "malloperation", code: "ib" },
        children:[
          {
            path: "index",
            name: "index",
            component: () => import("@/views/malloperation/activity/index.vue"),
            meta: { title: "限时抢购", icon: "activity", code: "iba" },
          },
          {
            path: "add",
            name: "add",
            hidden: true,
            component: () => import("@/views/malloperation/activity/addActivity.vue"),
            meta: { title: "添加活动", icon: "activity" },
          },
          {
            path: "activityDetail",
            name: "activityDetail",
            hidden: true,
            component: () => import("@/views/malloperation/activity/activityDetail.vue"),
            meta: { title: "活动明细", icon: "activity" },
          },
          {
            path: "hotsale",
            name: "热销配置",
            component: () => import("@/views/malloperation/hotsale/index.vue"),
            meta: { title: "热销配置", icon: "hotsale", code: "ibb" },
          },
        ]
      },
      {
        path: "goodsList",
        name: "goodsList",
        component: () => import("@/views/goodsManage/goodsList/index"),
        meta: { title: "商品管理", icon: "goodsManage", code: "ic" },
      },
      {
        path: "goodsList/goodsForm",
        name: "goodsList/goodsForm",
        hidden: true,
        component: () => import("@/views/goodsManage/goodsList/goodsForm/index"),
        meta: { title: "添加商品" },
      },
      {
        path: "goodsList/goodsDetail",
        name: "goodsList/goodsDetail",
        hidden: true,
        component: () => import("@/views/goodsManage/goodsList/goodsDetail/index"),
        meta: { title: "商品详情" },
      },
      {
        path: "orderList",
        name: "订单列表",
        component: () => import("@/views/order/orderList/index"),
        meta: { title: "订单列表",icon:'order', code: "id" },
      },
      {
        path: "detail",
        name: "订单详情",
        hidden: true,
        component: () => import("@/views/order/orderList/detail/detail"),
        meta: {title: "订单详情", icon: "", activeMenu: "/order/orderList",},
      },
    ]
  },
  {
    path: "/voucher",
    component: Layout,
    redirect: "voucher",
    name: "梵因美业管理",
    meta: { title: "梵因美业管理", icon: "voucher", code: "m" },
    children:[
      {
        path: "voucherList",
        name: "梵因美业代金券",
        component: () => import("@/views/voucher/voucherList/index"),
        meta: { title: "梵因美业代金券",  icon: "voucher",code: "ma" ,},
      },
    ]
  },
  {
    path: "/system",
    component: Layout,
    redirect: "/system/admin",
    name: "系统管理",
    meta: { title: "系统管理", icon: "system", code: "s" },
    children:[
      {
        path: "yogaRoomManage",
        name: "门店管理",
        component: () => import("@/views/Admin/yogaRoomManage/index"),
        meta: { title: "门店管理", icon: "yogaRoomManage", code: "sa" },
      },
      {
        path: "admin",
        name: "管理员列表",
        component: () => import("@/views/Admin"),
        meta: { title: "管理员列表", icon: "coachList", code: "sb" },
      },
      {
        path: "permission",
        name: "角色权限",
        component: () => import("@/views/Admin/permission/index"),
        meta: { title: "角色权限", icon: "permission", code: "sc" },
      },
      {
        path: "versionManage",
        name: "versionManage",
        component: () => import("@/views/Admin/versionManage/index"),
        meta: { title: "版本管理", icon: "versionManage", code: "sd" },
      },
    ]
  },
];
constantRoutes2=constantRoutes2.map(v1=>{
  if (v1.children&&v1.children.length>0) {
    v1.children.map(v2=>{
      if (v2.children&&v2.children.length>0) {
        v2.children=v2.children.map(v3=>{
          v3.path=`${v1.path}/${v2.path}/${v3.path}`
          return v3
        })
      }
    })
  }
  return v1
})
// console.log('constantRoutes2',constantRoutes2)
function getRouterList() {
  //登录之后获取动态路由
  let role_router = "";
  role_router = sessionStorage.getItem("role_router") || "[]";
  var userRouter = JSON.parse(role_router);
  var userRouters = [];
  constantRoutes2.map((value, i) => {
    let child = [];
    // 权限code 的判断
    if ((value.meta && value.meta.code && userRouter && userRouter.includes(value.meta.code)) || (value.meta && userRouter && !value.meta.code)) {
      value.children.forEach(function(item, i) {
        if (userRouter.includes(item.meta.code) || !item.meta.code) {
          child.push(item);
        }
      });
      if (child.length > 0) {
        value.children = child;
      }
      userRouters.push(value);
    }
  });
  return userRouters;
}

// console.log('getRouterList',getRouterList())
export default getRouterList;
