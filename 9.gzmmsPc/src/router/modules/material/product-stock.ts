const Layout = () => import("@/layout/index.vue");

export default {
  path: "/product-stock",
  component: Layout,
  meta: { title: "成品库存管理", icon: "baobiao" },
  redirect: "noredirect",
  children: [
    {
      path: "product-search",
      component: () => import("@/views/product-stock/product-search/index.vue"),
      name: "ProductStockProductSearch",
      meta: { title: "成品库存查询", icon: "baobiao", keepAlive: true },
    },
    {
      path: "product-in",
      component: () => import("@/views/product-stock/product-in/index.vue"),
      name: "ProductStockProductIn",
      meta: { title: "成品入库管理", icon: "baobiao", keepAlive: true },
    },
    {
      path: "product-check",
      component: () => import("@/views/product-stock/product-check/index.vue"),
      name: "ProductStockProductCheck",
      meta: { title: "成品质量检查", icon: "baobiao", keepAlive: true },
    },
  ],
} as RouteConfigsTable;
