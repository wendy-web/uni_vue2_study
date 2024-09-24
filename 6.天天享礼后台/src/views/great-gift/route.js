const Layout = () => import('@/layout/index.vue')

export default {
  name: 'GreatGift',
  path: '/great-gift',
  component: Layout,
  meta: {
    title: '天天兑大礼',
    icon: 'icon-park-outline:shop',
    order: 7,
    requireAuth: true,
    role: ['interior'],
  },
  children: [
    {
      name: 'productRecommendGift',
      path: 'product-recommend-gift',
      component: () => import('@/views/great-gift/product-recommend/index.vue'),
      meta: {
        title: '商品推荐',
        icon: 'ep:goods-filled',
        order: 15,
        requireAuth: true,
        role: ['goodsrecommend_index_3'],
      },
    },
    {
      name: 'taskManageGift',
      path: 'task-manage-gift',
      component: () => import('@/views/great-gift/task-manage/index.vue'),
      meta: {
        title: '任务管理',
        icon: 'fluent-mdl2:task-manager',
        order: 15,
        requireAuth: false,
      },
      children: [
        {
          name: 'taskListGift',
          path: 'task-list-gift',
          component: () => import('@/views/great-gift/task-manage/task-list/index.vue'),
          meta: {
            title: '任务列表',
            icon: 'ic:baseline-menu',
            requireAuth: true,
            role: ['task_index_3'],
          },
        },
      ],
    },
    {
      name: 'marketActivitieGift',
      path: 'market-activitie-gift',
      component: () => import('@/views/great-gift/market-activitie/index.vue'),
      meta: {
        title: '营销活动',
        icon: 'jam:task-list-f',
        order: 15,
        requireAuth: false,
      },
      children: [
        {
          name: 'luckyDrawGift',
          path: 'lucky-draw-gift',
          component: () => import('@/views/great-gift/market-activitie/lucky-draw/index.vue'),
          meta: {
            title: '幸运抽奖',
            icon: 'tabler:award-filled',
            requireAuth: true,
            role: ['drawgroup_index_3'],
          },
        },
      ],
    },
    {
      name: 'goodsManageGift',
      path: 'goods-manage-gift',
      component: () => import('@/views/great-gift/goods-manage/index.vue'),
      meta: {
        title: '商品管理',
        icon: 'icon-park-solid:commodity',
        order: 15,
        requireAuth: false,
      },
      children: [
        {
          name: 'storeGoodsListGift',
          path: 'goods-list-gift',
          component: () => import('@/views/great-gift/goods-manage/goods-list/index.vue'),
          meta: {
            title: '商品列表',
            icon: 'ri:file-list-line',
            requireAuth: true,
            role: ['goods_index_3'],
          },
        },
        {
          name: 'goodsGroupGift',
          path: 'goods-group-gift',
          component: () => import('@/views/great-gift/goods-manage/goods-group/index.vue'),
          meta: {
            title: '商品分组',
            icon: 'fluent-mdl2:hard-drive-group',
            requireAuth: true,
            role: ['goodsgroup_index_3'],
          },
        },
      ],
    },
    {
      name: 'orderManageGift',
      path: 'order-manage-gift',
      component: () => import('@/views/great-gift/order-manage/index.vue'),
      meta: {
        title: '订单管理',
        icon: 'material-symbols:border-all-rounded',
        order: 15,
        requireAuth: false,
      },
      children: [
        {
          name: 'orderListGift',
          path: 'order-list-gift',
          component: () => import('@/views/great-gift/order-manage/order-list/index.vue'),
          meta: {
            title: '订单列表',
            icon: 'mdi:order-alphabetical-descending',
            requireAuth: true,
            role: ['order_index_3'],
          },
        },
      ],
    },
  ],
}
