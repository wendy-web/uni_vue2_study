const Layout = () => import('@/layout/index.vue')

export default {
  name: 'smallStoreDiscount',
  path: '/small-store-discount',
  component: Layout,
  //   redirect: '/orderMange/list',
  meta: {
    title: '小店有惠',
    icon: 'icon-park-outline:shop',
    requireAuth: false,
    order: 5,
  },
  children: [
    // {
    //   name: 'productRecommend',
    //   path: 'product-recommend',
    //   component: () => import('@/views/small-store-discount/product-recommend/index.vue'),
    //   meta: {
    //     title: '商品推荐',
    //     icon: 'ep:goods-filled',
    //     order: 15,
    //     requireAuth: true,
    //     role: ['goodsrecommend_index_2']
    //   },
    // },
    {
      name: 'taskManage',
      path: 'task-manage',
      component: () => import('@/views/small-store-discount/task-manage/index.vue'),
      meta: {
        title: '任务管理',
        icon: 'fluent-mdl2:task-manager',
        order: 15,
        requireAuth: false,
      },
      children: [
        {
          name: 'taskList',
          path: 'task-list',
          component: () => import('@/views/small-store-discount/task-manage/task-list/index.vue'),
          meta: {
            title: '任务列表',
            icon: 'ic:baseline-menu',
            requireAuth: true,
            role: ['task_index_2'],
          },
        },
      ],
    },
    {
      name: 'marketActivitie',
      path: 'market-activitie',
      component: () => import('@/views/small-store-discount/market-activitie/index.vue'),
      meta: {
        title: '营销活动',
        icon: 'jam:task-list-f',
        order: 15,
        requireAuth: false,
      },
      children: [
        {
          name: 'luckyDraw',
          path: 'lucky-draw',
          component: () => import('@/views/small-store-discount/market-activitie/lucky-draw/index.vue'),
          meta: {
            title: '幸运抽奖',
            icon: 'tabler:award-filled',
            requireAuth: true,
            role: ['drawgroup_index_2'],
          },
        },
      ],
    },
    {
      name: 'goodsManage',
      path: 'goods-manage',
      component: () => import('@/views/small-store-discount/goods-manage/index.vue'),
      meta: {
        title: '商品管理',
        icon: 'icon-park-solid:commodity',
        order: 15,
        requireAuth: false,
      },
      children: [
        {
          name: 'storeGoodsList',
          path: 'goods-list',
          component: () => import('@/views/small-store-discount/goods-manage/goods-list/index.vue'),
          meta: {
            title: '商品列表',
            icon: 'ri:file-list-line',
            requireAuth: true,
            role: ['goods_index_2'],
          },
        },
        {
          name: 'goodsGroup',
          path: 'goods-group',
          component: () => import('@/views/small-store-discount/goods-manage/goods-group/index.vue'),
          meta: {
            title: '商品分组',
            icon: 'fluent-mdl2:hard-drive-group',
            requireAuth: true,
            role: ['goodsgroup_index_2'],
          },
        },
      ],
    },
    {
      name: 'orderManage',
      path: 'order-manage',
      component: () => import('@/views/small-store-discount/order-manage/index.vue'),
      meta: {
        title: '订单管理',
        icon: 'material-symbols:border-all-rounded',
        order: 15,
        requireAuth: false,
      },
      children: [
        {
          name: 'orderList',
          path: 'order-list',
          component: () => import('@/views/small-store-discount/order-manage/order-list/index.vue'),
          meta: {
            title: '订单列表',
            icon: 'mdi:order-alphabetical-descending',
            requireAuth: true,
            role: ['order_index_2'],
          },
        },
      ],
    },
    {
      name: 'smallPopover',
      path: 'small-popover/list',
      component: () => import('@/views/small-store-discount/popover/index.vue'),
      meta: {
        title: '场景弹窗',
        icon: 'fa6-regular:window-restore',
        order: 16,
        keepAlive: true,
        requireAuth: true,
        role: ['popover_getlist_2'],
      },
    },
    {
      name: 'siteManageStore',
      path: 'site-manage-store',
      component: () => import('@/views/small-store-discount/site-group/index.vue'),
      meta: {
        title: '系统设置',
        icon: 'material-symbols:brightness-7-rounded',
        order: 17,
        requireAuth: false,
      },
      children: [
        {
          name: 'keywordStore',
          path: 'site-keyword/list',
          component: () => import('@/views/small-store-discount/site-group/site-keyword/index.vue'),
          meta: {
            title: '搜索关键词',
            icon: 'ic:round-manage-search',
            order: 1,
            keepAlive: true,
            requireAuth: true,
            role: ['jd_getkeywordlist_2'],
          },
        },
        {
          name: 'homeImage',
          path: 'home-image/list',
          component: () => import('@/views/small-store-discount/home-image/index.vue'),
          meta: {
            title: '首页单例图',
            icon: 'fa6-regular:image',
            order: 2,
            keepAlive: true,
            requireAuth: true,
            role: ['team_singletonxq_2'],
          },
        },
        {
          name: 'eventNotice2',
          path: 'event-notice2/index',
          component: () => import('@/views/small-store-discount/event-notice/index.vue'),
          meta: {
            title: '消息模板',
            icon: 'material-symbols:chat-paste-go-outline',
            order: 3,
            keepAlive: true,
            requireAuth: true,
            role: ['templete_getinfo_2'],
          },
        },
      ],
    },
    {
      name: 'profitManageStore',
      path: 'profit-manage-store',
      component: () => import('@/views/small-store-discount/profit-group/index.vue'),
      meta: {
        title: '分佣管理',
        icon: 'ic:twotone-currency-yen',
        order: 18,
        requireAuth: false,
      },
      children: [
        {
          name: 'userStore',
          path: 'user-group/list',
          component: () => import('@/views/small-store-discount/profit-group/user-group/index.vue'),
          meta: {
            title: '用户列表',
            icon: 'fa6-regular:user',
            order: 1,
            keepAlive: true,
            requireAuth: true,
            role: ['team_userlist_2'],
          },
        },
        {
          name: 'withdrawStore',
          path: 'withdraw-group/list',
          component: () => import('@/views/small-store-discount/profit-group/withdraw-group/index.vue'),
          meta: {
            title: '提现记录',
            icon: 'ic:twotone-currency-yen',
            order: 2,
            keepAlive: true,
            requireAuth: true,
            role: ['team_withdrawlist_2'],
          },
        },
      ],
    },
  ],
}
