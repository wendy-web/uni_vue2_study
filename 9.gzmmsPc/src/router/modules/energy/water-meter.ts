const Layout = () => import("@/layout/index.vue");
export default {
  path: "/energy/water-meter",
  component: Layout,
  redirect: "noredirect",
  meta: { title: "水表管理", icon: "caigou" },
  children: [
    {
      path: "gather",
      component: () => import("@/views/energy/water-meter/gather/index.vue"),
      name: "EnergyWaterMeterGather",
      meta: { title: "水表采集配置", icon: "caigou", keepAlive: true },
    },
    {
      path: "meter-reading",
      component: () => import("@/views/energy/water-meter/meter-reading/index.vue"),
      name: "EnergyWaterMeterReadingRecord",
      meta: { title: "水表抄表记录", icon: "caigou", keepAlive: true },
    },
  ],
} as RouteConfigsTable;
