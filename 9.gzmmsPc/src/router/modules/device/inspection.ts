const Layout = () => import("@/layout/index.vue");
export default {
  path: "/device/inspection",
  component: Layout,
  redirect: "noredirect",
  meta: { title: "点巡检管理", icon: "caigou" },
  children: [
    {
      path: "project",
      component: () => import("@/views/device/inspection/project/index.vue"),
      name: "deviceInspectionProject",
      meta: { title: "点巡检内容", icon: "caigou", keepAlive: true },
    },
    {
      path: "project/add",
      component: () => import("@/views/device/inspection/project/add.vue"),
      name: "deviceInspectionProjectAdd",
      meta: {
        title: "新建点巡检项目",
        icon: "caigou",
        keepAlive: true,
        hidden: true,
        activeMenu: "/device/inspection/project",
      },
    },
    {
      path: "plan",
      component: () => import("@/views/device/inspection/plan/index.vue"),
      name: "deviceInspectionPlan",
      meta: { title: "点巡检计划", icon: "caigou", keepAlive: true },
    },
    {
      path: "plan/add",
      component: () => import("@/views/device/inspection/plan/add.vue"),
      name: "deviceInspectionPlanAdd",
      meta: {
        title: "新建点巡检计划",
        icon: "caigou",
        keepAlive: true,
        hidden: true,
        activeMenu: "/device/inspection/plan",
      },
    },
    {
      path: "plan/edit",
      component: () => import("@/views/device/inspection/plan/edit.vue"),
      name: "deviceInspectionPlanEdit",
      meta: {
        title: "编辑点巡检计划",
        icon: "caigou",
        keepAlive: true,
        hidden: true,
        activeMenu: "/device/inspection/plan",
      },
    },
    {
      path: "record",
      component: () => import("@/views/device/inspection/record/index.vue"),
      name: "deviceInspectionRecord",
      meta: { title: "点巡检记录", icon: "caigou", keepAlive: true },
    },
    {
      path: "record/add",
      component: () => import("@/views/device/inspection/record/add.vue"),
      name: "deviceInspectionRecordAdd",
      meta: {
        title: "新建点巡检记录",
        icon: "caigou",
        keepAlive: true,
        hidden: true,
        activeMenu: "/device/inspection/record",
      },
    },
    {
      path: "record/detail",
      component: () => import("@/views/device/inspection/record/detail.vue"),
      name: "deviceInspectionRecordDetail",
      meta: {
        title: "点巡检记录详情",
        icon: "caigou",
        hidden: true,
        activeMenu: "/device/inspection/record",
      },
    },
  ],
} as RouteConfigsTable;
