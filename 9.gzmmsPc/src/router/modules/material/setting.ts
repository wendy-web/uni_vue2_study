const Layout = () => import("@/layout/index.vue");

export default {
  path: "/setting",
  component: Layout,
  meta: { title: "设置", icon: "shezhi", rank: 4 },
  redirect: "noredirect",
  children: [
    {
      path: "account",
      component: () => import("@/views/system/account/index.vue"),
      name: "SetAccount",
      meta: { title: "账号管理", icon: "shezhi", keepAlive: true },
    },
    {
      path: "role",
      component: () => import("@/views/system/role/index.vue"),
      name: "setRole",
      meta: { title: "角色管理", icon: "shezhi", keepAlive: true },
    },
    {
      path: "menu",
      component: () => import("@/views/system/menu/index.vue"),
      name: "setMenu",
      meta: { title: "菜单管理", icon: "shezhi", keepAlive: true },
    },
    {
      path: "flow",
      component: () => import("@/views/system/flow/index.vue"),
      name: "SetFlow",
      meta: { title: "流程设置", icon: "shezhi", keepAlive: true },
    },
    {
      path: "basics",
      component: () => import("@/views/system/basics/index.vue"),
      name: "SetBasics",
      meta: { title: "基础设置", icon: "shezhi", keepAlive: true },
    },
  ],
} as RouteConfigsTable;
