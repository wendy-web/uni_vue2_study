//引入base64加密，
import { Base64 } from "js-base64";
import { defineStore } from "pinia";
import { ref } from "vue";
// 导入登录,退出api
import { loginApi, logoutApi } from "@/api/auth";
// 导入 types
import { LoginData } from "@/api/auth/types";
// 导入封装的设置token方法
import { getToken, removeToken, setToken } from "@/utils/auth";
import { localStorage } from "@/utils/localStorage";
import { store } from "@/store";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { useSettingsStoreHook } from "@/store/modules/settings";
import defaultSettings from "../../settings";

export const useUserStore = defineStore("user", () => {
  // state
  // token
  const token = ref<string>(getToken() || "");
  // 用户昵称
  const nickname = ref<string>(localStorage.get("nickname") || "");
  // 用户头像
  const avatar = ref<string>(localStorage.get("avatar"));
  // "https://s2.loli.net/2022/04/07/gw1L2Z5sPtS8GIl.gif?imageView2/1/w/80/h/80",

  // 用户角色id
  const role_id = ref<string>(localStorage.get("role_id"));
  /** 用户id */
  const uid = ref<number>(localStorage.get("uid"));
  /** 0物料,1设备,2安全,3质量,4生产,5能源*/
  const module_type = ref<number>(localStorage.get("module_type") ?? -1);
  console.log("🚀 ~ useUserStore ~ module_type:", module_type);

  const permissionStore = usePermissionStoreHook();
  const useSettingsStore = useSettingsStoreHook();
  // actions

  function setModuleType(type: number) {
    module_type.value = type;
    localStorage.set("module_type", module_type.value);
    setSettingAdminTitle();
  }
  function setSettingAdminTitle() {
    useSettingsStore.setAdminTitle(module_type.value);
  }

  // 登录
  function login(loginData: LoginData) {
    return new Promise<void>((resolve, reject) => {
      loginApi(loginData)
        .then((response) => {
          console.log(response.data);
          const { token: accessToken, user } = response.data;
          token.value = accessToken;
          nickname.value = user.name;
          uid.value = user.id;
          console.log("user.head_url", user.head_url);
          avatar.value = user.head_url
            ? defaultSettings.baseHttp + user.head_url
            : defaultSettings.baseHttp + "/static/img/default.jpg";
          role_id.value = Base64.encode(user.role_id);
          localStorage.set("nickname", nickname.value);
          localStorage.set("avatar", avatar.value);
          localStorage.set("role_id", Base64.encode(user.role_id));
          localStorage.set("uid", uid.value);
          setToken(accessToken);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // 点击注销的事件
  function logout() {
    return new Promise<void>((resolve, reject) => {
      logoutApi()
        .then(() => {
          resetToken();
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // 重置
  function resetToken() {
    removeToken();
    token.value = "";
    nickname.value = "";
    avatar.value = "";
    uid.value = -1;
    permissionStore.hasMenu = false;
    localStorage.remove("nickname");
    localStorage.remove("avatar");
    localStorage.remove("role_id");
    localStorage.remove("module_type");
    localStorage.set("vueuse-color-scheme", "light");
    useSettingsStore.resetSetting();
  }

  return {
    token,
    nickname,
    avatar,
    login,
    logout,
    resetToken,
    role_id,
    setModuleType,
    module_type,
    uid,
    setSettingAdminTitle,
  };
});

// 非setup
export function useUserStoreHook() {
  return useUserStore(store);
}
