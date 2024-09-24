const Layout = () => import("@/layout/index.vue");
export default {
  path: "/quality/standard-config",
  component: Layout,
  redirect: "noredirect",
  meta: { title: "标准值配置", icon: "caigou" },
  children: [
    {
      path: "material",
      component: () => import("@/views/quality/standard-config/material/index.vue"),
      name: "StandardConfigMaterial",
      meta: { title: "原材料检验配置", icon: "caigou", keepAlive: true },
    },
    {
      path: "version",
      component: () => import("@/views/quality/standard-config/version/index.vue"),
      name: "StandardConfigVersion",
      meta: { title: "版本信息", icon: "caigou", keepAlive: true },
    },
    {
      path: "picture",
      component: () => import("@/views/quality/standard-config/picture/index.vue"),
      name: "StandardConfigPicture",
      meta: { title: "纸皮/标签图片配置", icon: "caigou", keepAlive: true },
    },
    {
      path: "quantify",
      component: () => import("@/views/quality/standard-config/quantify/index.vue"),
      name: "StandardConfigQuantify",
      meta: { title: "定量项目", icon: "caigou", keepAlive: true },
    },
    {
      path: "instrument",
      component: () => import("@/views/quality/standard-config/instrument/index.vue"),
      name: "StandardConfigInstrument",
      meta: { title: "仪器管理", icon: "caigou", keepAlive: true },
    },
    {
      path: "inspection",
      component: () => import("@/views/quality/standard-config/inspection/index.vue"),
      name: "StandardConfigInspection",
      meta: { title: "检验依据", icon: "caigou", keepAlive: true },
    },
    {
      path: "finished",
      component: () => import("@/views/quality/standard-config/finished/index.vue"),
      name: "StandardConfigFinished",
      meta: { title: "成品检验配置", icon: "caigou", keepAlive: true },
    },
    {
      path: "production-team",
      component: () => import("@/views/quality/standard-config/production-team/index.vue"),
      name: "StandardConfigProductionTeam",
      meta: { title: "生产班组", icon: "caigou", keepAlive: true },
    },
    {
      path: "startup-confirm",
      component: () => import("@/views/quality/standard-config/startup-confirm/index.vue"),
      name: "StandardConfigStartupConfirm",
      meta: { title: "开机确认人配置", icon: "caigou", keepAlive: true },
    },
    {
      path: "process-config",
      component: () => import("@/views/quality/standard-config/process-config/index.vue"),
      name: "StandardConfigProcessConfig",
      meta: { title: "工序检验配置", icon: "caigou", keepAlive: true },
    },
    {
      path: "electronic-scale",
      component: () => import("@/views/quality/standard-config/electronic-scale/index.vue"),
      name: "StandardConfigElectronicScale",
      meta: { title: "电子天平电子秤", icon: "caigou", keepAlive: true },
    },
  ],
} as RouteConfigsTable;
