const Layout = () => import('@/layout/index.vue')

export default {
  name: 'promotion',
  path: '/',
  component: Layout,
  redirect: '/promotion',
  meta: {
    title: '商品推广',
    icon: 'carbon:autoscaling',
    order: 10,
    requireAuth: true,
    role: ['interior'],
  },
  children: [
    {
      name: 'group',
      path: 'group',
      component: () => import('./group/index.vue'),
      meta: {
        title: '群管理',
        icon: 'majesticons:checkbox-list',
        order: 1,
        requireAuth: true,
        role: ['group_grouplist_1'],
      },
    },
    {
      name: 'merchandise',
      path: 'merchandise',
      component: () => import('./merchandise/index.vue'),
      meta: {
        title: '批量商品',
        icon: 'majesticons:applications-add',
        keepAlive: true,
        order: 2,
        requireAuth: true,
        role: ['group_grouplist_1'],
      },
      children: [
        {
          name: 'merchandiseJD',
          path: 'merchandiseJD',
          component: () => import('./merchandise/jdIndex.vue'),
          meta: {
            title: '京东批量商品',
            icon: 'tdesign:bulletpoint',
            keepAlive: true,
            order: 1,
            requireAuth: true,
            role: ['group_grouplist_1'],
          },
        },
        {
          name: 'merchandisePDD',
          path: 'merchandisePDD',
          component: () => import('./merchandise/pddIndex.vue'),
          meta: {
            title: '拼多多批量商品',
            icon: 'tdesign:bulletpoint',
            keepAlive: true,
            order: 2,
            requireAuth: true,
            role: ['group_grouplist_1'],
          },
        },
      ],
    },
  ],
}
