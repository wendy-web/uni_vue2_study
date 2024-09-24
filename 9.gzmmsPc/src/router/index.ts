import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";

// const modules: Record<string, any> = import.meta.glob(["./modules/**/*.ts","!./modules/quality","!./modules/energy","!./modules/material/product-stock.ts",], {
//   eager: true,
// });
const modules: Record<string, any> = import.meta.glob(["./modules/**/*.ts",], {
  eager: true,
});

export const Layout = () => import("@/layout/index.vue");

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue"),
      },
    ],
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "/dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        name: "Dashboard",
        meta: {
          title: "首页",
          icon: "homepage",
          keepAlive: true,
          affix: true,
        },
      },
      {
        path: "401",
        component: () => import("@/views/error-page/401.vue"),
        meta: { hidden: true },
      },
      {
        path: "/404",
        component: () => import("@/views/error-page/404.vue"),
        meta: { hidden: true },
      },
      {
        path: "/noredirect",
        redirect: "/404",
      },
    ],
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: { hidden: true },
  },
  {
    path: "/switch",
    component: () => import("@/views/switch/index.vue"),
    meta: { hidden: true },
  },
];

const routes: RouteRecordRaw[] = [];

Object.keys(modules).forEach((key) => {
  routes.push(modules[key].default);
});

/** 按照路由中meta下的rank等级升序来排序路由 */
function ascending(arr: any[]) {
  return arr.sort((a: { meta: { rank: number } }, b: { meta: { rank: number } }) => {
    return a?.meta.rank - b?.meta.rank;
  });
}

ascending(routes);

const resultRoute = constantRoutes.concat(...routes);

// 创建路由
const router = createRouter({
  history: createWebHashHistory(),
  // routes: constantRoutes as RouteRecordRaw[],
  routes: resultRoute as RouteRecordRaw[],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export default router;
