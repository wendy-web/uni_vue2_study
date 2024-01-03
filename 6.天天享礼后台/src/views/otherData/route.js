const Layout = () => import('@/layout/index.vue')

export default {
  name: 'OtherData',
  path: '/otherData',
  component: Layout,
  meta: {
    title: '其它数据',
    icon: 'material-symbols:monitor-heart-rounded',
    order: 6,
  },
  children: [
    {
      name: 'AiRecharge',
      path: 'ai-recharge',
      component: () => import('./ai-recharge/index.vue'),
      meta: {
        title: 'AI充值',
        icon: 'material-symbols:ev-charger-rounded',
        order: 1,
        requireAuth: true,
        role: ['order_getailist_1']
      },
    },
  ],
}
