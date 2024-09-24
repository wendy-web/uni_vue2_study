const Layout = () => import('@/layout/index.vue')

export default {
  name: 'lightChina',
  path: '/light-china',
  component: Layout,
  //   redirect: '/orderMange/list',
  meta: {
    title: '点亮中国',
    icon: 'material-symbols:light-mode-outline-sharp',
    order: 4,
    requireAuth: true,
    role: ['interior'],
  },
  children: [
    {
      name: 'publicBenefit',
      path: 'public-benefit',
      component: () => import('@/views/light-china/public-benefit/index.vue'),
      meta: {
        title: '公益计划',
        icon: 'iconoir:donate',
        order: 15,
        keepAlive: true,
        requireAuth: true,
        role: ['commonweal_getlist_4'],
      },
    },
    // {
    //   name: 'ceshi001',
    //   path: 'ceshi001',
    //   component: () => import('@/views/light-china/ceshi001/index.vue'),
    //   meta: {
    //     title: '测试页面',
    //     icon: 'icon-park-solid:align-text-both-one',
    //     order: 15,
    //     keepAlive: true,
    //   },
    // },
  ],
}
