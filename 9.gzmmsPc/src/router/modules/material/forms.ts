const Layout = () => import("@/layout/index.vue");

export default {
  path: "/forms",
  component: Layout,
  meta: { title: "报表", icon: "baobiao", rank: 3 },
  redirect: "noredirect",
  children: [
    {
      path: "goods-stock",
      component: () => import("@/views/forms/goods-stock/index.vue"),
      name: "FormsGoodsStock",
      meta: { title: "货品库存总表", icon: "baobiao", keepAlive: true },
    },
    {
      path: "goods-record",
      component: () => import("@/views/forms/goods-record/index.vue"),
      name: "FormsGoodsRecord",
      meta: { title: "货品库存明细", icon: "baobiao", keepAlive: true },
    },
    // {
    //   path: "stock-check",
    //   component: () => import("@/views/forms/stock-check/index.vue"),
    //   name: "FormsStockCheck",
    //   meta: { title: "库存核算", icon: "baobiao", keepAlive: true },
    // },
    {
      path: "inout-record",
      component: () => import("@/views/forms/inout-record/index.vue"),
      name: "FormsInoutRecord",
      meta: { title: "出入库明细报表", icon: "baobiao", keepAlive: true },
    },
    {
      path: "getsupplier-record",
      component: () => import("@/views/forms/getsupplier-record/index.vue"),
      name: "FormsGetSupplierRecord",
      meta: { title: "领料单明细报表", icon: "baobiao", keepAlive: true },
    },
    {
      path: "buyin-record",
      component: () => import("@/views/forms/buyin-record/index.vue"),
      name: "FormsBuyinRecord",
      meta: { title: "采购入库明细报表", icon: "baobiao", keepAlive: true },
    },
    {
      path: "allot-record",
      component: () => import("@/views/forms/allot-record/index.vue"),
      name: "FormsAllotRecord",
      meta: { title: "调拨明细报表", icon: "baobiao", keepAlive: true },
    },
    {
      path: "retstock-report",
      component: () => import("@/views/forms/retstock-report/index.vue"),
      name: "FormsRetstockReport",
      meta: { title: "退库物资报表", icon: "baobiao", keepAlive: true },
    },
  ],
} as RouteConfigsTable;
