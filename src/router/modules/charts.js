/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const chartsRouter = {
  path: '/charts',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Charts',
  meta: {
    title: '图表管理',
    icon: 'chart'
  },
  children: [
    // {
    //   path: 'keyboard',
    //   component: () => import('@/views/charts/keyboard'),
    //   name: 'KeyboardChart',
    //   meta: { title: '键盘表', noCache: true }
    // },
    {
      path: 'line',
      component: () => import('@/views/charts/line'),
      name: 'LineChart',
      meta: { title: '收费情况曲线图', noCache: true }
    },
    {
      path: 'mix-chart',
      component: () => import('@/views/charts/mix-chart'),
      name: 'MixChart',
      meta: { title: '收费情况柱状图', noCache: true }
    }
  ]
}

export default chartsRouter
