const Layout = () => import("@/layout/index.vue");
export default {
  path: "/device/report-forms",
  component: Layout,
  redirect: "noredirect",
  meta: { title: "报表", icon: "caigou" },
  children: [
    // {
    //   path: "delay",
    //   component: () => import("@/views/device/report-forms/delay/index.vue"),
    //   name: "deviceReportFormsDelay",
    //   meta: { title: "停机误时汇总", icon: "caigou", keepAlive: true },
    // },
    {
      path: "spare-part",
      component: () => import("@/views/device/report-forms/spare-part/index.vue"),
      name: "deviceReportSparePart",
      meta: { title: "备件周期报表", icon: "caigou", keepAlive: true },
    },
    {
      path: "fire-control",
      component: () => import("@/views/device/report-forms/fire-control/index.vue"),
      name: "deviceReportFireControl",
      meta: { title: "点巡检报表-消防月报", icon: "caigou", keepAlive: true },
    },
    {
      path: "shutdown",
      component: () => import("@/views/device/report-forms/shutdown/index.vue"),
      name: "deviceReportShutdown",
      meta: { title: "停机误时统计明细", icon: "caigou", keepAlive: true },
    },
    // {
    //   path: "energy",
    //   component: () => import("@/views/device/report-forms/energy/index.vue"),
    //   name: "deviceReportFormsEnergy",
    //   meta: { title: "能耗统计报表", icon: "caigou", keepAlive: true },
    // },
  ],
} as RouteConfigsTable;
