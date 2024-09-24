const Layout = () => import("@/layout/index.vue");
export default {
  path: "/energy/electric-meter",
  component: Layout,
  redirect: "noredirect",
  meta: { title: "电表管理", icon: "caigou" },
  children: [
    {
      path: "gather",
      component: () => import("@/views/energy/electric-meter/gather/index.vue"),
      name: "EnergyElectricMeterGather",
      meta: { title: "电表采集配置", icon: "caigou", keepAlive: true },
    },
    {
      path: "meter-reading",
      component: () => import("@/views/energy/electric-meter/meter-reading/index.vue"),
      name: "EnergyElectricMeterReadingRecord",
      meta: { title: "电表抄表记录", icon: "caigou", keepAlive: true },
    },
  ],
} as RouteConfigsTable;
