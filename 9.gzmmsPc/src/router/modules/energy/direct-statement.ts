const Layout = () => import("@/layout/index.vue");
export default {
  path: "/energy/direct-statement",
  component: Layout,
  redirect: "noredirect",
  meta: { title: "能源报表", icon: "caigou" },
  children: [
    {
      path: "daily",
      component: () => import("@/views/energy/direct-statement/daily/index.vue"),
      name: "EnergyDirectStatementDaily",
      meta: { title: "日报表", icon: "caigou", keepAlive: true },
    },
    {
      path: "monthly",
      component: () => import("@/views/energy/direct-statement/monthly/index.vue"),
      name: "EnergyDirectStatementMonthly",
      meta: { title: "月报表", icon: "caigou", keepAlive: true },
    },
  ],
} as RouteConfigsTable;
