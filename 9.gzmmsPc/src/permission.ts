import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { RouteRecordRaw } from "vue-router";
import router from "@/router";
//引入noticeStore
import { useNoticeStore } from "@/store/modules/notice";
// 获取permissionStore中的数据
import { usePermissionStoreHook } from "@/store/modules/permission";
// 获取userStore中的数据
import { useUserStoreHook } from "@/store/modules/user";

NProgress.configure({ showSpinner: false }); // 进度条

const permissionStore = usePermissionStoreHook();
const noticeStore = useNoticeStore();

// 白名单路由
const whiteList = ["/login"];

router.beforeEach(async (to, from, next) => {
  NProgress.start();

  const userStore = useUserStoreHook();
  // console.log(userStore.token);
  const module_type = userStore.module_type;

  if (userStore.token) {
    // console.log("token pass");
    // 登录成功，跳转到首页
    if (to.path === "/login") {
      // 如果是去登录页,则跳转到首页
      next({ path: "/" });
      NProgress.done();
    } else if (to.path === "/switch") {
      // 如果是去/switch页面直接放行
      next();
      NProgress.done();
    } else {
      // 如果未选择系统则跳转到/switch页面
      if (module_type < 0 ) {
        permissionStore.setHasMenu();
        next("/switch");
        NProgress.done();
      } else {
        userStore.setSettingAdminTitle()
        const hasMenu = permissionStore.hasMenu;
        if (hasMenu) {
          if (to.matched.length === 0) {
            // console.log("from.name ", from.name);
            from.name ? next({ name: from.name as any }) : next("/401");
          } else {
            next();
          }
        } else {
          try {
            // 右侧menu菜单
            await permissionStore.getMenuList();
            next();
            noticeStore.restNotice();
          } catch (error) {
            // 移除 token 并跳转登录页
            await userStore.resetToken();
            // next(`/login?redirect=${to.path}`);
            next(`/login`);
            NProgress.done();
          }
        }
      }
    }
  } else {
    console.log("no token");
    // next()
    // return
    // 未登录可以访问白名单页面
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      // next(`/login?redirect=${to.path}`);
      next(`/login`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
