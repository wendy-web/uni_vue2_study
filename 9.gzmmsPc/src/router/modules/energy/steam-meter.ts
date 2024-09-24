const Layout = () => import("@/layout/index.vue");
export default {
  path: "/energy/steam-meter",
  component: Layout,
  redirect: "noredirect",
  meta: { title: "蒸汽表管理", icon: "caigou" },
  children: [
    {
      path: "gather",
      component: () => import("@/views/energy/steam-meter/gather/index.vue"),
      name: "EnergySteamMeterGather",
      meta: { title: "蒸汽表采集配置", icon: "caigou", keepAlive: true },
    },
    {
      path: "meter-reading",
      component: () => import("@/views/energy/steam-meter/meter-reading/index.vue"),
      name: "EnergySteamMeterReadingRecord",
      meta: { title: "蒸汽表抄表记录", icon: "caigou", keepAlive: true },
    },
  ],
} as RouteConfigsTable;
