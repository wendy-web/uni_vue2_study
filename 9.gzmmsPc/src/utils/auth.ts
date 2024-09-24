//引入base64加密，
import { Base64 } from "js-base64";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { useUserStoreHook } from "@/store/modules/user";

const TokenKey = "wlAccessToken";

export function getToken() {
  return localStorage.getItem(TokenKey);
}

export function setToken(token: string) {
  localStorage.setItem(TokenKey, token);
}

export function removeToken() {
  return localStorage.removeItem(TokenKey);
}

/**
 *
 * @param val string[] 权限数组
 * @returns 判断是否拥有传入的权限,拥有返回true,否则false
 */
export function perms(val: string[]) {
  // 「超级管理员」拥有所有的按钮权限
  let { role_id } = useUserStoreHook();
  // 拿到的role_id是通过 Base64加密的,需要解密
  role_id = Base64.decode(role_id);

  const { perms: permsList } = usePermissionStoreHook();

  // 如果角色id === '0'  role_id为0表示是物料系统管理员角色 -1表示超级管理员角色, 其他小于0的各个系统的管理员
  if (role_id === "0" || Number(role_id) < 0) {
    return true;
  }

  if (val) {
    const requiredPerms = val; // 需要的按钮权限标识
    const hasPerm = permsList?.some((perm) => {
      return requiredPerms.includes(perm);
    });

    if (hasPerm) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

/**
 *
 * @param assocType 接口返回的assoc_type数组
 * @param query 需要判断的值
 * @returns
 */
export function checkAssocType(assocType: number[], query: number | number[]) {
  if (Array.isArray(query)) {
    return query.some((item) => assocType.includes(item));
  }
  if (assocType.includes(query)) {
    return true;
  } else {
    return false;
  }
}

/** 判断传入的id和用户的id是否一致 */
export function isCreateUser(uid: number) {
  const userStore = useUserStoreHook();
  return uid === userStore.uid;
}
