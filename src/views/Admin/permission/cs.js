import Layout from "@/layout";

export  const menuList=[
  {
    name: '数据中心',
    code: 'd',
    children:[
      {
        name: '用户数据',
        code: 'da',
      },
      {
        name: '瑜伽课程数据',
        code: 'db',
      },
      {
        name: '冥想数据',
        code: 'dc',
      },
      {
        name: '脑环监测数据',
        code: 'dd',
      },
      {
        name: '幸福智慧数据',
        code: 'de',
      },
      {
        name: '积分数据',
        code: 'df',
      },
      {
        name: '运营日报',
        code: 'dg',
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
        path: "/homeConfig",
        name: "homeConfig",
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
        name: '用户管理',
        code: 'pb',
      },
      {
        name: '搜索历史管理',
        code: 'pc',
      },
      {
        name: '热门搜索管理',
        code: 'pd',
      },
      {
        name: '弹窗管理',
        code: 'pe',
      },
      {
        name: 'banner管理',
        code: 'pf',
      },
      {
        name: '开屏广告管理',
        code: 'pg',
      },
      {
        name: '练习广告管理',
        code: 'ph',
      },
      {
        name: '欢迎词管理',
        code: 'pi',
      },
      {
        name: '评论管理',
        code: 'pj',
      },
      {
        name: '邀请好友管理',
        code: 'pk',
      },
      {
        name: '意见反馈',
        code: 'pl',
      },
      {
        name: '系统公告',
        code: 'pm',
      },
      {
        name: '抽奖列表',
        code: 'pn',
      },
      {
        name: '抽奖管理',
        code: 'po',
      },
      {
        name: '积分管理',
        code: 'pp',
        children:[
          {
            name: '积分明细',
            code: 'ppa',
          },
          {
            name: '新手任务',
            code: 'ppb',
          },
          {
            name: '签到积分',
            code: 'ppc',
          },
          {
            name: '每日任务',
            code: 'ppd',
          },

        ]
      },
    ]
  },
  {
    name: '内容管理',
    code: 'c',
    children:[
      {
        name: '百科管理',
        code: 'ca',
        children:[
          {
            name: '百科管理',
            code: 'caa',
          },
          {
            name: '百科栏目',
            code: 'cab',
          },

        ]
      },
      {
        name: '梵音资讯管理',
        code: 'cb',
      },
      {
        name: '冥想管理',
        code: 'cc',
        children:[
          {
            name: '冥想管理',
            code: 'cca',
          },
          {
            name: '冥想栏目',
            code: 'ccb',
          },

        ]
      },
      {
        name: '幸福智慧管理',
        code: 'cd',
        children:[
          {
            name: '幸福智慧管理',
            code: 'cda',
          },
          {
            name: '幸福智慧栏目',
            code: 'cdb',
          },
        ]
      },
      {
        name: '瑜伽课程管理',
        code: 'ce',
        children:[
          {
            prop: '瑜伽课程管理',
            code: 'cea',
          },
          {
            prop: '瑜伽栏目',
            code: 'ceb',
          },
          {
            prop: '瑜伽筛选数据',
            code: 'cec',
          },
          {
            prop: '瑜伽课程订单',
            code: 'ced',
          },
        ]
      },
      {
        name: '教练管理',
        code: 'cf',
        children:[
          {
            name: '教练列表',
            code: 'cfa',
          },
          {
            name: '教练等级',
            code: 'cfb',
          },
          {
            name: '助教管理',
            code: 'cfc',
          },

        ]
      },
    ]
  },
  {
    name: '积分商城管理',
    code: 'i',
    children:[
      {
        name: '商城配置',
        code: 'ia',
        children:[
          {
            name: 'banner配置',
            code: 'iaa',
          },
          {
            name: '类目管理',
            code: 'iab',
          },
          {
            name: '物流配置',
            code: 'iac',
          },
          {
            name: '品牌配置',
            code: 'iad',
          },
          {
            name: '规则及服务',
            code: 'iae',
          },
          {
            name: '订单规则',
            code: 'iaf',
          },
        ]
      },
      {
        name: '商城运营配置',
        code: 'ib',
        children:[
          {
            name: '限时抢购',
            code: 'iba',
          },
          {
            name: '热销配置',
            code: 'ibb',
          },
        ]
      },
      {
        name: '商品管理',
        code: 'ic',
      },
      {
        name: '订单列表',
        code: 'id',
      },
    ]
  },
  {
    name: '梵因美业管理',
    code: 'm',
    children:[
      {
        name: '代金券管理',
        code: 'ma',
      },

    ]
  },
  {
    name: '系统管理',
    code: 's',
    children:[
      {
        name: '门店管理',
        code: 'sa',
      },
      {
        name: '管理员列表',
        code: 'sb',
      },
      {
        name: '角色权限',
        code: 'sc',
      },
      {
        name: '版本管理',
        code: 'sd',
      },
    ]
  },
]

//
const  test= (str) => {
  let arr=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r']
  let back=''
  arr.forEach(item=>{
    back+=str+item+'\n'
  })
  return  back
}
