import { defineStore } from "pinia";
import { store } from "@/store";
import { ref } from "vue";
import { getMenuListApi } from "@/api/system/menu";
import { IMenuList } from "@/api/system/types";
import { constantRoutes } from "@/router/index";

// setup
export const usePermissionStore = defineStore("permission", () => {
  // state
  // 右侧menu菜单
  const routes = ref<IMenuList[]>([]);
  const perms = ref<string[]>([]);
  // const routes = ref<any[]>(constantRoutes);
  // 是否已经获取左侧菜单标识
  const hasMenu = ref<Boolean>(false);

  // actions
  // 获取用户的左侧菜单
  function getMenuList() {
    return new Promise((resolve, reject) => {
      getMenuListApi()
        .then((response) => {
          const menuRoutes = response.data.list;
          // console.log("返回的左侧菜单", menuRoutes);
          const btnPerms = response.data.hide;
          // console.log("返回的按钮数组", btnPerms);
          routes.value = menuRoutes;
          perms.value = btnPerms;
          hasMenu.value = true;
          resolve(menuRoutes);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  function setHasMenu(isHasMenu = false){
    hasMenu.value = isHasMenu;
  }


  return {
    routes,
    getMenuList,
    hasMenu,
    perms,
    setHasMenu
  };
});

// 非setup
export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
