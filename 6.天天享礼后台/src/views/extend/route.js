const Layout = () => import('@/layout/index.vue')

export default {
  name: 'Extend',
  path: '/',
  component: Layout,
  redirect: '/extend',
  meta: {
    title: '推广管理',
    icon: 'fa6-regular:paper-plane',
    order: 9,
    requireAuth: true,
    role: ['interior'],
  },
  children: [
    {
      name: 'extend',
      path: 'extend',
      component: () => import('./index.vue'),
      meta: {
        title: '天天享礼',
        icon: 'material-symbols:person-pin',
        keepAlive: true,
        order: 1,
        requireAuth: true,
        role: ['extend_getlist_1'],
      },
    },
    {
      name: 'xdyhextend',
      path: 'xdyhextend',
      component: () => import('./xdyhextend/index.vue'),
      meta: {
        title: '小店有惠',
        icon: 'material-symbols:person-pin',
        order: 1,
        requireAuth: true,
        role: ['extend_getlist_1'],
      },
    },
  ],
}
