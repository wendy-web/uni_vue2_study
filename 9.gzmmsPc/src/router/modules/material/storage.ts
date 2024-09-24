const Layout = () => import("@/layout/index.vue");

export default {
  // 仓库
  path: "/storage",
  component: Layout,
  meta: { title: "仓库", icon: "cangku1", rank: 2 },
  redirect: "noredirect",
  children: [
    // 采购入库单
    {
      path: "buy-in",
      component: () => import("@/views/storage/buy-in/list.vue"),
      name: "StoBuyInList",
      meta: { title: "采购入库单", icon: "cangku1", keepAlive: true },
    },
    {
      path: "buy-in/add",
      component: () => import("@/views/storage/buy-in/addIndex.vue"),
      name: "StoBuyInAddIndex",
      meta: {
        title: "新建采购入库单",
        hidden: true,
        keepAlive: true,
        activeMenu: "/storage/buy-in",
      },
    },
    {
      path: "buy-in/detail",
      component: () => import("@/views/storage/buy-in/detail.vue"),
      name: "StoBuyInDetail",
      meta: {
        title: "采购入库单详情",
        hidden: true,
        activeMenu: "/storage/buy-in",
      },
    },
    // 其他入库单
    {
      path: "other-in",
      component: () => import("@/views/storage/other-in/list.vue"),
      name: "StoOtherInList",
      meta: { title: "其他入库单", icon: "cangku1", keepAlive: true },
    },
    {
      path: "other-in/add",
      component: () => import("@/views/storage/other-in/addIndex.vue"),
      name: "StoOtherInAddIndex",
      meta: {
        title: "新建其他入库单",
        hidden: true,
        keepAlive: true,
        activeMenu: "/storage/other-in",
      },
    },
    {
      path: "other-in/detail",
      component: () => import("@/views/storage/other-in/detail.vue"),
      name: "StoOtherInDetail",
      meta: {
        title: "其他入库单详情",
        hidden: true,
        activeMenu: "/storage/other-in",
      },
    },
    // 退货出库单
    {
      path: "ret-goods",
      component: () => import("@/views/storage/ret-goods/list.vue"),
      name: "StoRetGoodsList",
      meta: { title: "其他出库单", icon: "cangku1", keepAlive: true },
    },
    {
      path: "ret-goods/add",
      component: () => import("@/views/storage/ret-goods/addIndex.vue"),
      name: "StoRetGoodsAddIndex",
      meta: {
        title: "新建其他出库单",
        hidden: true,
        keepAlive: true,
        activeMenu: "/storage/ret-goods",
      },
    },
    {
      path: "ret-goods/detail",
      component: () => import("@/views/storage/ret-goods/detail.vue"),
      name: "StoRetGoodsDetail",
      meta: {
        title: "其他出库单详情",
        hidden: true,
        activeMenu: "/storage/ret-goods",
      },
    },
    // 领料出库单
    {
      path: "get-supplier",
      component: () => import("@/views/storage/get-supplier/list.vue"),
      name: "StoGetSupList",
      meta: { title: "领料出库单", icon: "cangku1", keepAlive: true },
    },
    {
      path: "get-supplier/add",
      component: () => import("@/views/storage/get-supplier/addIndex.vue"),
      name: "StoGetSupAddIndex",
      meta: {
        title: "新建领料出库单",
        hidden: true,
        keepAlive: true,
        activeMenu: "/storage/get-supplier",
      },
    },
    {
      path: "get-supplier/detail",
      component: () => import("@/views/storage/get-supplier/detail.vue"),
      name: "StoGetSupDetail",
      meta: {
        title: "领料出库详情",
        hidden: true,
        activeMenu: "/storage/get-supplier",
      },
    },
    // 退料入库单
    {
      path: "ret-supplier",
      component: () => import("@/views/storage/ret-supplier/list.vue"),
      name: "StoRetSupInList",
      meta: { title: "退料入库单", icon: "cangku1", keepAlive: true },
    },
    {
      path: "ret-supplier/add",
      component: () => import("@/views/storage/ret-supplier/addIndex.vue"),
      name: "StoRetSupInAddIndex",
      meta: {
        title: "新建退料入库单",
        hidden: true,
        keepAlive: true,
        activeMenu: "/storage/ret-supplier",
      },
    },
    {
      path: "ret-supplier/detail",
      component: () => import("@/views/storage/ret-supplier/detail.vue"),
      name: "StoRetSupInDetail",
      meta: {
        title: "退料入库单详情",
        hidden: true,
        activeMenu: "/storage/ret-supplier",
      },
    },
    // 退库清单
    {
      path: "ret-stocks",
      component: () => import("@/views/storage/ret-stocks/list.vue"),
      name: "StoRetStocksList",
      meta: { title: "退库清单", icon: "cangku1", keepAlive: true },
    },
    {
      path: "ret-stocks/add",
      component: () => import("@/views/storage/ret-stocks/addIndex.vue"),
      name: "StoRetStocksAddIndex",
      meta: {
        title: "新建退库清单",
        icon: "cangku1",
        keepAlive: true,
        hidden: true,
        activeMenu: "/storage/ret-stocks",
      },
    },
    {
      path: "ret-stocks/detail",
      component: () => import("@/views/storage/ret-stocks/detail.vue"),
      name: "StoRetStocksdDetail",
      meta: {
        title: "退库清单详情",
        icon: "cangku1",
        keepAlive: true,
        hidden: true,
        activeMenu: "/storage/ret-stocks",
      },
    },
    // 拆装单
    {
      path: "split",
      component: () => import("@/views/storage/split/list.vue"),
      name: "StoSplitList",
      meta: { title: "拆装单", icon: "cangku1", keepAlive: true },
    },
    {
      path: "split/add",
      component: () => import("@/views/storage/split/addIndex.vue"),
      name: "StoSplitAddIndex",
      meta: {
        title: "新建拆装单",
        hidden: true,
        keepAlive: true,
        activeMenu: "/storage/split",
      },
    },
    {
      path: "split/detail",
      component: () => import("@/views/storage/split/detail.vue"),
      name: "StoSplitDetail",
      meta: {
        title: "拆装单详情",
        hidden: true,
        activeMenu: "/storage/split",
      },
    },
    // 调拨单
    {
      path: "allot",
      component: () => import("@/views/storage/allot/list.vue"),
      name: "StoAllotList",
      meta: { title: "调拨单", icon: "cangku1", keepAlive: true },
    },
    {
      path: "allot/add",
      component: () => import("@/views/storage/allot/addIndex.vue"),
      name: "StoAllotAddIndex",
      meta: {
        title: "新建调拨单",
        hidden: true,
        keepAlive: true,
        activeMenu: "/storage/allot",
      },
    },
    {
      path: "allot/detail",
      component: () => import("@/views/storage/allot/detail.vue"),
      name: "StoAllotDetail",
      meta: {
        title: "调拨单详情",
        hidden: true,
        activeMenu: "/storage/allot",
      },
    },
    // 盘点单
    {
      path: "check",
      component: () => import("@/views/storage/check/list.vue"),
      name: "StoCheckList",
      meta: { title: "盘点单", icon: "cangku1", keepAlive: true },
    },
    {
      path: "check/add",
      component: () => import("@/views/storage/check/addIndex.vue"),
      name: "StoCheckAddIndex",
      meta: {
        title: "盘点单",
        keepAlive: true,
        hidden: true,
        activeMenu: "/storage/check",
      },
    },
    {
      path: "check/detail",
      component: () => import("@/views/storage/check/detail.vue"),
      name: "StoCheck",
      meta: {
        title: "盘点单详情",
        hidden: true,
        activeMenu: "/storage/check",
      },
    },
    // 报废单
    {
      path: "scrap",
      component: () => import("@/views/storage/scrap/list.vue"),
      name: "StoScrapList",
      meta: { title: "报废单", icon: "cangku1", keepAlive: true },
    },
    {
      path: "scrap/add",
      component: () => import("@/views/storage/scrap/addIndex.vue"),
      name: "StoScrapAddIndex",
      meta: {
        title: "新建报废单",
        keepAlive: true,
        hidden: true,
        activeMenu: "/storage/scrap",
      },
    },
    {
      path: "scrap/detail",
      component: () => import("@/views/storage/scrap/detail.vue"),
      name: "StoScrapDetail",
      meta: {
        title: "报废单详情",
        hidden: true,
        activeMenu: "/storage/scrap",
      },
    },
    // 货品管理
    // {
    //   path: "goods-manage",
    //   component: () => import("@/views/storage/goods-manage/index.vue"),
    //   name: "StoGoodsManage",
    //   meta: { title: "货品管理", icon: "cangku1", keepAlive: true },
    // },
  ],
} as RouteConfigsTable;
