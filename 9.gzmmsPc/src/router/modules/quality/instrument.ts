const Layout = () => import("@/layout/index.vue");
export default {
  path: "/quality/instrument",
  component: Layout,
  redirect: "noredirect",
  meta: { title: "仪器管理", icon: "caigou" },
  children: [
    {
      path: "rinse-record",
      component: () => import("@/views/quality/instrument/rinse-record/index.vue"),
      name: "InstrumentRinseRecord",
      meta: { title: "比色皿清洗记录", icon: "caigou", keepAlive: true },
    },
    {
      path: "balance-calibration",
      component: () => import("@/views/quality/instrument/balance-calibration/index.vue"),
      name: "InstrumentBalanceCalibration",
      meta: { title: "天平校准记录", icon: "caigou", keepAlive: true },
    },
    {
      path: "balance-calibration/add",
      component: () => import("@/views/quality/instrument/balance-calibration/add.vue"),
      name: "InstrumentBalanceCalibrationAdd",
      meta: {
        title: "新建天平校准记录",
        icon: "caigou",
        keepAlive: true,
        hidden: true,
        activeMenu: "/quality/instrument/balance-calibration",
      },
    },
    {
      path: "balance-use",
      component: () => import("@/views/quality/instrument/balance-use/index.vue"),
      name: "InstrumentBalanceUse",
      meta: { title: "电子天平使用记录", icon: "caigou", keepAlive: true },
    },
    {
      path: "device-use",
      component: () => import("@/views/quality/instrument/device-use/index.vue"),
      name: "InstrumentDeviceUse",
      meta: { title: "仪器设备使用记录", icon: "caigou", keepAlive: true },
    },
    {
      path: "projector",
      component: () => import("@/views/quality/instrument/projector/index.vue"),
      name: "InstrumentProjector",
      meta: { title: "卷封投影仪校准记录表", icon: "caigou", keepAlive: true },
    },
    {
      path: "replace-record",
      component: () => import("@/views/quality/instrument/replace-record/index.vue"),
      name: "InstrumentReplaceRecord",
      meta: { title: "仪器更换记录", icon: "caigou", keepAlive: true },
    },
    {
      path: "sampletank-receive",
      component: () => import("@/views/quality/instrument/sampletank-receive/index.vue"),
      name: "InstrumentSampletankReceive",
      meta: { title: "标准样罐领用记录", icon: "caigou", keepAlive: true },
    },
    {
      path: "sampletank-in",
      component: () => import("@/views/quality/instrument/sampletank-in/index.vue"),
      name: "InstrumentSampletankIn",
      meta: { title: "标准样罐入库记录", icon: "caigou", keepAlive: true },
    },
    {
      path: "incubator",
      component: () => import("@/views/quality/instrument/incubator/index.vue"),
      name: "InstrumentIncubator",
      meta: { title: "恒温培养箱使用记录", icon: "caigou", keepAlive: true },
    },
    {
      path: "incubator/add",
      component: () => import("@/views/quality/instrument/incubator/add.vue"),
      name: "InstrumentIncubatorAdd",
      meta: { title: "新建恒温培养箱使用记录", icon: "caigou", keepAlive: true },
    },
  ],
} as RouteConfigsTable;
