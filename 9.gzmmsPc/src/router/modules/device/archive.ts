const Layout = () => import("@/layout/index.vue");
export default {
  path: "/device/archive",
  component: Layout,
  redirect: "noredirect",
  meta: { title: "固资管理", icon: "caigou" },
  children: [
    {
      path: "equipment",
      component: () => import("@/views/device/archive/equipment/index.vue"),
      name: "deviceArchiveEquipment",
      meta: { title: "资产档案", icon: "caigou", keepAlive: true },
    },
    {
      path: "equipment/add",
      component: () => import("@/views/device/archive/equipment/add.vue"),
      name: "deviceArchiveEquipmentAdd",
      meta: {
        title: "新建资产档案",
        hidden: true,
        activeMenu: "/device/archive/equipment",
        keepAlive: true,
      },
    },
    {
      path: "study-file",
      component: () => import("@/views/device/archive/study-file/index.vue"),
      name: "deviceStudyFile",
      meta: { title: "学习附件", icon: "caigou", keepAlive: true },
    },
  ],
} as RouteConfigsTable;
