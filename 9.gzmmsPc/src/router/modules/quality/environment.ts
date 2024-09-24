const Layout = () => import("@/layout/index.vue");
// Environment
export default {
  path: "/quality/environment",
  component: Layout,
  redirect: "noredirect",
  meta: { title: "环境检测", icon: "caigou" },
  children: [
    {
      path: "check-config",
      component: () => import("@/views/quality/environment/check-config/index.vue"),
      name: "EnvironmentCheckConfig",
      meta: { title: "检查表配置", icon: "caigou", keepAlive: true },
    },
    {
      path: "cip-hygiene",
      component: () => import("@/views/quality/environment/cip-hygiene/index.vue"),
      name: "EnvironmentCipHygiene",
      meta: { title: "CIP灌装间卫生检查表", icon: "caigou", keepAlive: true },
    },
    {
      path: "cip-hygiene/add",
      component: () => import("@/views/quality/environment/cip-hygiene/add.vue"),
      name: "EnvironmentCipHygieneAdd",
      meta: {
        title: "新建CIP灌装间卫生检查表",
        icon: "caigou",
        keepAlive: true,
        hidden: true,
        activeMenu: "/quality/environment/cip-hygiene",
      },
    },
    {
      path: "online-verify",
      component: () => import("@/views/quality/environment/online-verify/index.vue"),
      name: "EnvironmentOnlineVerify",
      meta: { title: "在线检测设备验证表", icon: "caigou", keepAlive: true },
    },
    {
      path: "online-verify/add",
      component: () => import("@/views/quality/environment/online-verify/add.vue"),
      name: "EnvironmentOnlineVerifyAdd",
      meta: {
        title: "新建在线检测设备验证表",
        icon: "caigou",
        keepAlive: true,
        hidden: true,
        activeMenu: "/quality/environment/online-verify",
      },
    },
    {
      path: "fly-lamp",
      component: () => import("@/views/quality/environment/fly-lamp/index.vue"),
      name: "EnvironmentFlyLamp",
      meta: { title: "生产灭蝇灯检查记录", icon: "caigou", keepAlive: true },
    },
    {
      path: "fly-lamp/add",
      component: () => import("@/views/quality/environment/fly-lamp/add.vue"),
      name: "EnvironmentFlyLampAdd",
      meta: {
        title: "新建生产灭蝇灯检查记录",
        icon: "caigou",
        keepAlive: true,
        hidden: true,
        activeMenu: "/quality/environment/fly-lamp",
      },
    },
    {
      path: "cans-camera",
      component: () => import("@/views/quality/environment/cans-camera/index.vue"),
      name: "EnvironmentCansCamera",
      meta: { title: "空罐照相设备验证表", icon: "caigou", keepAlive: true },
    },
    {
      path: "cans-camera/add",
      component: () => import("@/views/quality/environment/cans-camera/add.vue"),
      name: "EnvironmentCansCameraAdd",
      meta: {
        title: "新建空罐照相设备验证表",
        icon: "caigou",
        keepAlive: true,
        hidden: true,
        activeMenu: "/quality/environment/cans-camera",
      },
    },
    {
      path: "capper-rinse",
      component: () => import("@/views/quality/environment/capper-rinse/index.vue"),
      name: "EnvironmentCapperRinse",
      meta: { title: "灌装封口机清洗记录", icon: "caigou", keepAlive: true },
    },
    {
      path: "capper-rinse/add",
      component: () => import("@/views/quality/environment/capper-rinse/add.vue"),
      name: "EnvironmentCapperRinseAdd",
      meta: {
        title: "新建灌装封口机清洗记录",
        icon: "caigou",
        keepAlive: true,
        hidden: true,
        activeMenu: "/quality/environment/capper-rinse",
      },
    },
    {
      path: "bottling-air",
      component: () => import("@/views/quality/environment/bottling-air/index.vue"),
      name: "EnvironmentBottlingAir",
      meta: { title: "灌装间空气沉降检测", icon: "caigou", keepAlive: true },
    },
    {
      path: "bottling-air/add",
      component: () => import("@/views/quality/environment/bottling-air/add.vue"),
      name: "EnvironmentBottlingAirAdd",
      meta: {
        title: "新建灌装间空气沉降检测",
        icon: "caigou",
        keepAlive: true,
        hidden: true,
        activeMenu: "/quality/environment/bottling-air",
      },
    },
    {
      path: "batching-air",
      component: () => import("@/views/quality/environment/batching-air/index.vue"),
      name: "EnvironmentBatchingAir",
      meta: { title: "称配料空气沉降检测", icon: "caigou", keepAlive: true },
    },
    {
      path: "batching-air/add",
      component: () => import("@/views/quality/environment/batching-air/add.vue"),
      name: "EnvironmentBatchingAirAdd",
      meta: {
        title: "新建称配料空气沉降检测",
        icon: "caigou",
        keepAlive: true,
        hidden: true,
        activeMenu: "/quality/environment/batching-air",
      },
    },
    {
      path: "laboratory-air",
      component: () => import("@/views/quality/environment/laboratory-air/index.vue"),
      name: "EnvironmentLaboratoryAir",
      meta: { title: "化验室空气沉降检测", icon: "caigou", keepAlive: true },
    },
    {
      path: "laboratory-air/add",
      component: () => import("@/views/quality/environment/laboratory-air/add.vue"),
      name: "EnvironmentLaboratoryAirAdd",
      meta: {
        title: "新建化验室空气沉降检测",
        icon: "caigou",
        keepAlive: true,
        hidden: true,
        activeMenu: "/quality/environment/laboratory-air",
      },
    },
    {
      path: "cleanroom-particles",
      component: () => import("@/views/quality/environment/cleanroom-particles/index.vue"),
      name: "EnvironmentCleanroomParticles",
      meta: { title: "洁净间悬浮粒子检测", icon: "caigou", keepAlive: true },
    },
    {
      path: "cleanroom-particles/add",
      component: () => import("@/views/quality/environment/cleanroom-particles/add.vue"),
      name: "EnvironmentCleanroomParticlesAdd",
      meta: {
        title: "新建洁净间悬浮粒子检测",
        icon: "caigou",
        keepAlive: true,
        hidden: true,
        activeMenu: "/quality/environment/cleanroom-particles",
      },
    },
    {
      path: "hand-rub",
      component: () => import("@/views/quality/environment/hand-rub/index.vue"),
      name: "EnvironmentHandRub",
      meta: { title: "手部涂抹实验检验", icon: "caigou", keepAlive: true },
    },
    {
      path: "hand-rub/add",
      component: () => import("@/views/quality/environment/hand-rub/add.vue"),
      name: "EnvironmentHandRubAdd",
      meta: {
        title: "新建手部涂抹实验检验记录",
        icon: "caigou",
        keepAlive: true,
        hidden: true,
        activeMenu: "/quality/environment/hand-rub",
      },
    },
    {
      path: "fingerprint-film",
      component: () => import("@/views/quality/environment/fingerprint-film/index.vue"),
      name: "EnvironmentFingerprintFilm",
      meta: { title: "生产部指膜实验", icon: "caigou", keepAlive: true },
    },
    {
      path: "fingerprint-film/add",
      component: () => import("@/views/quality/environment/fingerprint-film/add.vue"),
      name: "EnvironmentFingerprintFilmAdd",
      meta: {
        title: "新建生产部指模检验记录",
        icon: "caigou",
        keepAlive: true,
        hidden: true,
        activeMenu: "/quality/environment/fingerprint-film",
      },
    },
    {
      path: "cleanroom-bacteria",
      component: () => import("@/views/quality/environment/cleanroom-bacteria/index.vue"),
      name: "EnvironmentCleanroomBacteria",
      meta: { title: "配料洁净间浮游菌检测", icon: "caigou", keepAlive: true },
    },
    {
      path: "cleanroom-bacteria/add",
      component: () => import("@/views/quality/environment/cleanroom-bacteria/add.vue"),
      name: "EnvironmentCleanroomBacteriaAdd",
      meta: {
        title: "新建配料洁净间浮游菌检测",
        icon: "caigou",
        keepAlive: true,
        hidden: true,
        activeMenu: "/quality/environment/cleanroom-bacteria",
      },
    },
    {
      path: "laboratory-bacteria",
      component: () => import("@/views/quality/environment/laboratory-bacteria/index.vue"),
      name: "EnvironmentLaboratoryBacteria",
      meta: { title: "化验室空气浮游菌检测", icon: "caigou", keepAlive: true },
    },
    {
      path: "laboratory-bacteria/add",
      component: () => import("@/views/quality/environment/laboratory-bacteria/add.vue"),
      name: "EnvironmentLaboratoryBacteriaAdd",
      meta: {
        title: "新建化验室空气浮游菌检测",
        icon: "caigou",
        keepAlive: true,
        hidden: true,
        activeMenu: "/quality/environment/laboratory-bacteria",
      },
    },
  ],
} as RouteConfigsTable;
