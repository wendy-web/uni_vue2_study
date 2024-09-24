const Layout = () => import("@/layout/index.vue");
export default {
  path: "/device/maintain",
  component: Layout,
  redirect: "noredirect",
  meta: { title: "维保管理", icon: "caigou" },
  children: [
    {
      path: "repair",
      component: () => import("@/views/device/maintain/repair/index.vue"),
      name: "deviceMaintainRepair",
      meta: { title: "设备维修单", icon: "caigou", keepAlive: true },
    },
    {
      path: "repair/add",
      component: () => import("@/views/device/maintain/repair/add.vue"),
      name: "deviceMaintainRepairAdd",
      meta: {
        title: "新建设备维修单",
        icon: "caigou",
        keepAlive: true,
        hidden: true,
        activeMenu: "/device/maintain/repair",
      },
    },
    {
      path: "repair/detail",
      component: () => import("@/views/device/maintain/repair/detail.vue"),
      name: "deviceMaintainRepairDetail",
      meta: {
        title: "设备维修单详情",
        icon: "caigou",
        keepAlive: true,
        hidden: true,
        activeMenu: "/device/maintain/repair",
      },
    },
    {
      path: "project",
      component: () => import("@/views/device/maintain/project/index.vue"),
      name: "deviceMaintainProject",
      meta: { title: "保养项目", icon: "caigou", keepAlive: true },
    },
    {
      path: "plan",
      component: () => import("@/views/device/maintain/plan/index.vue"),
      name: "deviceMaintainPlan",
      meta: {
        title: "保养计划",
        icon: "caigou",
        keepAlive: true,
      },
    },
    {
      path: "plan/add",
      component: () => import("@/views/device/maintain/plan/add.vue"),
      name: "deviceMaintainPlanAdd",
      meta: {
        title: "新建保养计划",
        icon: "caigou",
        keepAlive: true,
        hidden: true,
        activeMenu: "/device/maintain/plan",
      },
    },
    {
      path: "plan/edit",
      component: () => import("@/views/device/maintain/plan/edit.vue"),
      name: "deviceMaintainPlanEdit",
      meta: {
        title: "编辑保养计划",
        icon: "caigou",
        keepAlive: true,
        hidden: true,
        activeMenu: "/device/maintain/plan",
      },
    },
    {
      path: "work-order",
      component: () => import("@/views/device/maintain/work-order/index.vue"),
      name: "deviceMaintainWorkorder",
      meta: { title: "保养工单", icon: "caigou", keepAlive: true },
    },
    {
      path: "work-order/add",
      component: () => import("@/views/device/maintain/work-order/add.vue"),
      name: "deviceMaintainWorkorderAdd",
      meta: {
        title: "新建保养工单",
        icon: "caigou",
        keepAlive: true,
        hidden: true,
        activeMenu: "/device/maintain/work-order",
      },
    },
    {
      path: "work-order/detail",
      component: () => import("@/views/device/maintain/work-order/detail.vue"),
      name: "deviceMaintainWorkorderDetail",
      meta: {
        title: "保养工单详情",
        icon: "caigou",
        keepAlive: true,
        hidden: true,
        activeMenu: "/device/maintain/work-order",
      },
    },
  ],
} as RouteConfigsTable;
