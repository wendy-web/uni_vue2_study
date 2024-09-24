const Layout = () => import("@/layout/index.vue");
export default {
  path: "/quality/product-quantify",
  component: Layout,
  redirect: "noredirect",
  meta: { title: "产品定量检验", icon: "caigou" },
  children: [
    {
      path: "source-record",
      component: () => import("@/views/quality/product-quantify/source-record/index.vue"),
      name: "ProductQuantifySourceRecord",
      meta: { title: "定量测定原始记录", icon: "caigou", keepAlive: true },
    },
    {
      path: "source-record/add",
      component: () => import("@/views/quality/product-quantify/source-record/add.vue"),
      name: "ProductQuantifySourceRecordAdd",
      meta: {
        title: "新建定量测定原始记录",
        icon: "caigou",
        keepAlive: true,
        hidden: true,
        activeMenu: "/quality/product-quantify/source-record",
      },
    },
    {
      path: "source-record/vitamin",
      component: () => import("@/views/quality/product-quantify/source-record/vitamin.vue"),
      name: "ProductQuantifySourceRecordVitamin",
      meta: {
        title: "新建VB12测定记录",
        icon: "caigou",
        keepAlive: true,
        hidden: true,
        activeMenu: "/quality/product-quantify/source-record",
      },
    },
    {
      path: "source-record/plumbum",
      component: () => import("@/views/quality/product-quantify/source-record/plumbum.vue"),
      name: "ProductQuantifySourceRecordPlumbum",
      meta: {
        title: "新建A道原始数据",
        icon: "caigou",
        keepAlive: true,
        hidden: true,
        activeMenu: "/quality/product-quantify/source-record",
      },
    },
    {
      path: "direct",
      component: () => import("@/views/quality/product-quantify/direct/index.vue"),
      name: "ProductQuantifyDirect",
      meta: { title: "产品定量检验报告", icon: "caigou", keepAlive: true },
    },
    {
      path: "direct/add",
      component: () => import("@/views/quality/product-quantify/direct/add.vue"),
      name: "ProductQuantifyDirectAdd",
      meta: {
        title: "新建产品定量检验报告",
        icon: "caigou",
        keepAlive: true,
        hidden: true,
        activeMenu: "/quality/product-quantify/direct",
      },
    },
    {
      path: "finished",
      component: () => import("@/views/quality/product-quantify/finished/index.vue"),
      name: "ProductQuantifyFinished",
      meta: { title: "成品检验报告", icon: "caigou", keepAlive: true },
    },
    {
      path: "finished/add",
      component: () => import("@/views/quality/product-quantify/finished/add.vue"),
      name: "ProductQuantifyFinishedAdd",
      meta: {
        title: "新建成品检验报告",
        icon: "caigou",
        keepAlive: true,
        hidden: true,
        activeMenu: "/quality/product-quantify/finished",
      },
    },
  ],
} as RouteConfigsTable;
