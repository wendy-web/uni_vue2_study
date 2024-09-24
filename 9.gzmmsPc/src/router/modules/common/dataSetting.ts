const Layout = () => import("@/layout/index.vue");

const commonRouter = [
  {
    path: "goods-manage",
    component: () => import("@/views/storage/goods-manage/index.vue"),
    name: "StoGoodsManage",
    meta: { title: "货品管理", icon: "cangku1", keepAlive: true },
  },
  {
    path: "supplier",
    component: () => import("@/views/buy/supplier/index.vue"),
    name: "BuySupplierManage",
    meta: { title: "供应商管理", icon: "caigou", keepAlive: true },
  },
  {
    path: "product-warehouse",
    component: () => import("@/views/product-stock/product-warehouse/index.vue"),
    name: "ProductStockProductWarehouse",
    meta: { title: "成品仓库管理", icon: "caigou", keepAlive: true },
  },
  {
    path: "product-wscode",
    component: () => import("@/views/product-stock/product-wscode/index.vue"),
    name: "ProductStockProductWscode",
    meta: { title: "成品库位管理", icon: "caigou", keepAlive: true },
  },
];

const deviceRouter = [
  {
    path: "device-type",
    component: () => import("@/views/device/settings/device-type/index.vue"),
    name: "deviceSettingsDeviceType",
    meta: { title: "资产类型", icon: "caigou", keepAlive: true },
  },
  {
    path: "production-line",
    component: () => import("@/views/device/settings/production-line/index.vue"),
    name: "deviceSettingsProductionLine",
    meta: { title: "产线设置", icon: "caigou", keepAlive: true },
  },
  {
    path: "cause",
    component: () => import("@/views/device/settings/cause/index.vue"),
    name: "deviceSettingsCause",
    meta: { title: "故障原因", icon: "caigou", keepAlive: true },
  },
];

export default {
  path: "/data/settings",
  component: Layout,
  redirect: "noredirect",
  meta: { title: "资料设置", icon: "caigou" },
  children: [
    ...commonRouter, 
    ...deviceRouter,
],
} as RouteConfigsTable;
