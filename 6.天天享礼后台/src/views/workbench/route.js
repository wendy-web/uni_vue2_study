const Layout = () => import('@/layout/index.vue')

export default {
  name: 'Dashboard',
  path: '/',
  component: Layout,
  redirect: '/workbench',
  meta: {
    title: '终端管理',
    icon: 'material-symbols:airplay-rounded',
    order: 1,
  },
  children: [
    {
      name: 'Workbench',
      path: 'workbench',
      component: () => import('./index.vue'),
      meta: {
        title: '账户中心',
        icon: 'material-symbols:person-pin',
        order: 1,
      },
    },
  ],
}
