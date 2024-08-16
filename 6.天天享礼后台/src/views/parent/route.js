const Layout = () => import('@/layout/index.vue')

export default {
  name: 'Parent',
  path: '/',
  component: Layout,
  redirect: '/parent',
  meta: {
    title: '自营商城',
    icon: 'icon-park-outline:shop',
    order: 10,
    requireAuth: true,
    role: ['partner'],
  },
  children: [
    {
      name: 'parentList',
      path: 'parentList',
      component: () => import('@/views/parent/goods-list/index.vue'),
      meta: {
        title: '自营商品',
        icon: 'ri:file-list-line',
        requireAuth: true,
        role: ['thirdgoods_goodslist_3'],
      },
    },
    {
      name: 'parentOrder',
      path: 'parentOrder',
      component: () => import('@/views/parent/goods-order/index.vue'),
      meta: {
        title: '自营订单',
        icon: 'fluent-mdl2:hard-drive-group',
        requireAuth: true,
        role: ['thirdgoods_orderlist_3'],
      },
    },
  ],
}
