import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// 导入modules下面的路由模块
// import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 * 不论什么权限一直显示的侧边栏
 */
export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: {
          title: '控制台',
          icon: 'dashboard',
          affix: true
        }
      }
    ]
  },
  {
    path: '/payAll',
    component: Layout,
    // redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/bill_pay/payAll'),
        name: 'payAll',
        meta: {
          title: '费用清缴',
          icon: 'money',
          noCache: true
        }
      }
    ]
  },
  {
    // 住宅费用收缴端口
    path: '/pay/house',
    component: Layout,
    // redirect: '/pay',
    name: 'pay_house',
    meta: {
      title: '费用收缴--住宅',
      icon: 'house'
    },
    children: [
      {
        path: 'electric',
        component: () => import('@/views/bill_pay/house/electric'),
        name: 'electric',
        meta: {
          title: '住宅电费'
        }
      },
      {
        path: 'water',
        component: () => import('@/views/bill_pay/house/water'),
        name: 'water',
        meta: {
          title: '住宅水费'
        }
      },
      {
        path: 'property',
        component: () => import('@/views/bill_pay/house/property'),
        name: 'property',
        meta: {
          title: '住宅物业费'
        }
      },
      {
        path: 'parking',
        component: () => import('@/views/bill_pay/house/parking'),
        name: 'parking',
        meta: {
          title: '停车场维护费'
        }
      },
      {
        path: 'decorationDeposit',
        component: () => import('@/views/bill_pay/house/decorationDeposit'),
        name: 'decorationDeposit',
        meta: {
          title: '住宅装修保证金'
        }
      },
      {
        path: 'heat',
        component: () => import('@/views/bill_pay/house/heat'),
        name: 'heat',
        meta: {
          title: '住宅暖气费'
        }
      },
      {
        path: 'trash',
        component: () => import('@/views/bill_pay/house/trash'),
        name: 'trash',
        meta: {
          title: '垃圾清运费'
        }
      }
    ]
  },
  {
    // 商铺费用收缴端口
    path: '/pay/shop',
    component: Layout,
    // redirect: '/pay',
    name: 'pay_shop',
    meta: {
      title: '费用收缴--商铺',
      icon: 'shop'
    },
    children: [
      {
        path: 'electric',
        component: () => import('@/views/bill_pay/shop/electric'),
        name: 'electric',
        meta: {
          title: '商铺电费'
        }
      },
      {
        path: 'property',
        component: () => import('@/views/bill_pay/shop/property'),
        name: 'property',
        meta: {
          title: '商铺物业费'
        }
      },
      {
        path: 'decorationDeposit',
        component: () => import('@/views/bill_pay/shop/decorationDeposit'),
        name: 'decorationDeposit',
        meta: {
          title: '商铺装修保证金'
        }
      }
    ]
  },
  {
    // 杂项费用收缴端口
    path: '/pay/sundries',
    component: Layout,
    children: [
      {
        path: 'paySundries',
        component: () => import('@/views/bill_pay/sundries'),
        name: 'Sundries',
        meta: { title: '费用收缴--杂项', icon: 'bill' }
      }
    ]
  },
  {
    // 费用总览------暂未开发
    path: '/billOverall',
    component: Layout,
    children: [
      {
        path: 'summation',
        component: () => import('@/views/billOverall/billSummation'),
        name: 'summation',
        meta: { title: '费用总览', icon: 'overall' }
      }
    ]
  },
  {
    // 操作记录
    path: '/operationLog',
    component: Layout,
    // redirect: '/bill_all/electric',
    name: 'operationLog',
    meta: {
      title: '操作记录',
      icon: 'log'
    },
    children: [
      {
        path: 'moneyGet',
        component: () => import('@/views/operationLog/moneyGet'),
        name: 'moneyGet',
        meta: {
          title: '收费记录'
        }
      },
      {
        path: 'moneyReturn',
        component: () => import('@/views/operationLog/moneyReturn'),
        name: 'moneyReturn',
        meta: {
          title: '装修保证金退款记录'
        }
      },
      {
        path: 'houseInfoChange',
        component: () => import('@/views/operationLog/houseInfoChange'),
        name: 'houseInfoChange',
        meta: {
          title: '房屋信息变更记录'
        }
      },
      {
        path: 'parkingInfoChange',
        component: () => import('@/views/operationLog/parkingInfoChange'),
        name: 'parkingInfoChange',
        meta: {
          title: '车辆信息变更记录'
        }
      }
    ]
  },
  {
    // 物业流水
    path: '/waterBill',
    component: Layout,
    // redirect: '/bill_all/electric',
    name: 'waterBill',
    meta: {
      title: '流水管理',
      icon: 'waterbill'
    },
    children: [
      {
        path: 'propertyWaterBill',
        component: () => import('@/views/waterBill/propertyWaterBill'),
        name: 'propertyWaterBill',
        meta: {
          title: '物业流水总览'
        }
      },
      {
        path: 'exportPropertyWaterBill',
        component: () => import('@/views/waterBill/exportPropertyWaterBill'),
        name: 'exportPropertyWaterBill',
        meta: {
          title: '物业流水导出'
        }
      }
    ]
  },
  {
    // 台账管理
    path: '/standingBook',
    component: Layout,
    // redirect: '/bill_all/electric',
    name: 'standingBook',
    meta: {
      title: '台账管理',
      icon: 'standingbook'
    },
    children: [
      {
        path: 'electricStandingBook',
        component: () => import('@/views/standingBookManage/electricStandingBook'),
        name: 'electricStandingBook',
        meta: {
          title: '电费台账管理'
        }
      },
      {
        path: 'electricNotification',
        component: () => import('@/views/standingBookManage/electricNotification'),
        name: 'electricNotification',
        meta: {
          title: '电费通知单'
        }
      },
      {
        path: 'propertyHouseStandingBook',
        component: () => import('@/views/standingBookManage/propertyHouseStandingBook'),
        name: 'propertyHouseStandingBook',
        meta: {
          title: '住宅物业费台账'
        }
      },
      {
        path: 'propertyShopStandingBook',
        component: () => import('@/views/standingBookManage/propertyShopStandingBook'),
        name: 'propertyShopStandingBook',
        meta: {
          title: '商铺物业费台账'
        }
      },
      {
        path: 'decorationDepositStandingBook',
        component: () => import('@/views/standingBookManage/decorationDepositStandingBook'),
        name: 'decorationDepositStandingBook',
        meta: {
          title: '装修保证金台账'
        }
      }
    ]
  },
  {
    path: '/info',
    component: Layout,
    // redirect: '/info',
    children: [
      {
        path: 'Housechange',
        component: () => import('@/views/infoChange/houseChange'),
        name: 'infoChange',
        meta: {
          title: '房源信息变更',
          icon: 'housechange',
          noCache: true
        }
      }
    ]
  },
  // Excel表格管理
  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'Excel',
    meta: {
      title: 'Excel管理',
      icon: 'excel'
    },
    children: [
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/upload-excel'),
        name: 'UploadExcel',
        meta: {
          title: '上传电表读数Excel'
        }
      }
    ]
  },
  // 通知公告管理
  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: '公告管理',
      icon: 'example'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/example/create'),
        name: 'CreateArticle',
        meta: {
          title: '发布文章',
          icon: 'edit'
        }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit'),
        name: 'EditArticle',
        meta: {
          title: '编辑文章',
          noCache: true,
          activeMenu: '/example/list'
        },
        hidden: false
      },
      {
        path: 'list',
        component: () => import('@/views/example/list'),
        name: 'ArticleList',
        meta: {
          title: '文章列表',
          icon: 'list'
        }
      }
    ]
  },
  // 图表管理
  chartsRouter,
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  }
  // {
  //   path: '/profile',
  //   component: Layout,
  //   redirect: '/profile/index',
  //   hidden: false,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/profile/index'),
  //       name: 'Profile',
  //       meta: {
  //         title: 'Profile',
  //         icon: 'user',
  //         noCache: true
  //       }
  //     }
  //   ]
  // }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 * 根据不同的权限动态加载出侧边栏目
 */
export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    // alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: '权限管理',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'role',
        component: () => import('@/views/permission/permissionChange'),
        name: 'RolePermission',
        meta: {
          title: '权限管理',
          roles: ['admin'] // 只有admin权限的人才能看见
        }
      }
    ]
  },

  /** when your routing map is too long, you can split it into small modules **/
  // 直接导入modules下面的路由模块
  // componentsRouter,
  // nestedRouter,
  // tableRouter,

  // {
  //   path: '/tab',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/tab/index'),
  //       name: 'Tab',
  //       meta: { title: 'Tab标签', icon: 'tab' }
  //     }
  //   ]
  // },

  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: '错误页面',
  //     icon: '404'
  //   },
  //   children: [
  //     {
  //       path: '401',
  //       component: () => import('@/views/error-page/401'),
  //       name: 'Page401',
  //       meta: { title: '401', noCache: true }
  //     },
  //     {
  //       path: '404',
  //       component: () => import('@/views/error-page/404'),
  //       name: 'Page404',
  //       meta: { title: '404', noCache: true }
  //     }
  //   ]
  // },

  // {
  //   path: '/error-log',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'log',
  //       component: () => import('@/views/error-log/index'),
  //       name: 'ErrorLog',
  //       meta: { title: 'Bug日志', icon: 'bug' }
  //     }
  //   ]
  // },

  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   alwaysShow: true,
  //   name: 'Zip',
  //   meta: { title: 'Zip压缩包', icon: 'zip' },
  //   children: [
  //     {
  //       path: 'download',
  //       component: () => import('@/views/zip/index'),
  //       name: 'ExportZip',
  //       meta: { title: '导出Zip' }
  //     }
  //   ]
  // },

  // {
  //   path: '/pdf',
  //   component: Layout,
  //   redirect: '/pdf/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/pdf/index'),
  //       name: 'PDF',
  //       meta: { title: 'PDF', icon: 'pdf' }
  //     }
  //   ]
  // },
  // {
  //   path: '/pdf/download',
  //   component: () => import('@/views/pdf/download'),
  //   hidden: true
  // },

  // {
  //   path: '/theme',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/theme/index'),
  //       name: 'Theme',
  //       meta: { title: '主题', icon: 'theme' }
  //     }
  //   ]
  // },

  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/clipboard/index'),
  //       name: 'ClipboardDemo',
  //       meta: { title: 'Clipboard', icon: 'clipboard' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://github.com/PanJiaChen/vue-element-admin',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
      y: 0
    }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
