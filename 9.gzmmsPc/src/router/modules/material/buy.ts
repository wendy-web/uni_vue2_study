const Layout = () => import("@/layout/index.vue");

export default {
  path: "/buy",
  component: Layout,
  redirect: "noredirect",
  meta: { title: "采购", icon: "caigou", rank: 1 },
  children: [
    // 采购单
    {
      path: "order",
      component: () => import("@/views/buy/order/list.vue"),
      name: "BuyOrderList",
      meta: { title: "采购单", icon: "caigou", keepAlive: true },
    },
    {
      path: "order/add",
      component: () => import("@/views/buy/order/addIndex.vue"),
      name: "BuyOrderAddIndex",
      meta: {
        title: "新建采购单",
        hidden: true,
        activeMenu: "/buy/order",
        keepAlive: true,
      },
    },
    {
      path: "order/detail",
      component: () => import("@/views/buy/order/detail.vue"),
      name: "BuyDetailOrder",
      meta: { title: "采购单详情", hidden: true, activeMenu: "/buy/order" },
    },
    // 采购退货单
    {
      path: "refund",
      component: () => import("@/views/buy/refund/list.vue"),
      name: "BuyRefundList",
      meta: {
        title: "采购退货单",
        icon: "caigou",
        keepAlive: true,
      },
    },
    {
      path: "refund/add",
      component: () => import("@/views/buy/refund/addIndex.vue"),
      name: "BuyRefundAddIndex",
      meta: {
        title: "新建采购退货单",
        hidden: true,
        keepAlive: true,
        activeMenu: "/buy/refund",
      },
    },
    {
      path: "refund/detail",
      component: () => import("@/views/buy/refund/detail.vue"),
      name: "BuyRefundDetail",
      meta: {
        title: "采购退货单详情",
        hidden: true,
        activeMenu: "/buy/refund",
      },
    },
    // 采购换货单
    {
      path: "swap",
      component: () => import("@/views/buy/swap/list.vue"),
      name: "BuySwapList",
      meta: {
        title: "采购换货单",
        icon: "caigou",
        keepAlive: true,
      },
    },
    {
      path: "swap/add",
      component: () => import("@/views/buy/swap/addIndex.vue"),
      name: "BuySwapAddIndex",
      meta: {
        title: "新建采购换货单",
        icon: "caigou",
        keepAlive: true,
        activeMenu: "/buy/swap",
      },
    },
    {
      path: "swap/detail",
      component: () => import("@/views/buy/swap/detail.vue"),
      name: "BuySwapDetail",
      meta: {
        title: "采购换货单详情",
        hidden: true,
        activeMenu: "/buy/swap",
      },
    },
    // 供应商管理
    // {
    //   path: "supplier",
    //   component: () => import("@/views/buy/supplier/index.vue"),
    //   name: "BuySupplierManage",
    //   meta: { title: "供应商管理", icon: "caigou", keepAlive: true },
    // },
  ],
} as RouteConfigsTable;
