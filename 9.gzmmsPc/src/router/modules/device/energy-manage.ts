const Layout = () => import("@/layout/index.vue");
export default {
  path: "/device/energy-manage",
  component: Layout,
  redirect: "noredirect",
  meta: { title: "能源管理", icon: "caigou" },
  children: [
    {
      path: "meter-count",
      component: () => import("@/views/device/energy-manage/meter-count/index.vue"),
      name: "deviceEnergyManageMeterCount",
      meta: { title: "表计读数", icon: "caigou", keepAlive: true },
    },
    {
      path: "meter-record",
      component: () => import("@/views/device/energy-manage/meter-record/index.vue"),
      name: "deviceEnergyManageMeterRecord",
      meta: { title: "抄表记录", icon: "caigou", keepAlive: true },
    },
  ],
} as RouteConfigsTable;
