//引入base64加密，
import { Base64 } from "js-base64";
import { Directive, DirectiveBinding } from "vue";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { useUserStoreHook } from "@/store/modules/user";

/**
 * 按钮权限
 */
export const hasPerm: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // 「超级管理员」拥有所有的按钮权限
    let { role_id } = useUserStoreHook();

    // 拿到的role_id是通过 Base64加密的,需要解密
    role_id = Base64.decode(role_id);

    const { perms } = usePermissionStoreHook();

    // 如果角色id === '0'  role_id为0表示是物料系统管理员角色 -1表示超级管理员角色, 其他小于0的各个系统的管理员
    if (role_id === "0" || Number(role_id) < 0) {
      return true;
    }
    // 「其他角色」按钮权限校验
    const { value } = binding;
    // console.log("value", value);
    if (value) {
      const requiredPerms = value; // DOM绑定需要的按钮权限标识
      // console.log("requiredPerms", requiredPerms);
      const hasPerm = perms?.some((perm) => {
        return requiredPerms.includes(perm);
      });
      // console.log("hasPerm", hasPerm);

      if (!hasPerm) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error("need perms! Like v-has-perm=\"['sys:user:add','sys:user:edit']\"");
    }
  },
};

/**
 * 某些按钮判断是否同一个模块下,如: 基础设置中的编辑按钮,同一模块下才显示
 */
export const hasModule: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    let { module_type } = useUserStoreHook();
    const { value } = binding;
    if (typeof value === "number") {
      const requiredModuleType = value; // DOM绑定需要的按钮权限标识
      const hasPerm = requiredModuleType === module_type;
      if (!hasPerm) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error('need perms! Like v-hasModule="moduleType",moduleType need number');
    }
  },
};

/**
 * 某些按钮判断是否同一个模块下且是否是管理员,如: 基础设置中的删除按钮,同一模块下且是管理员才显示
 */
export const hasModuleAdmin: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    let { module_type } = useUserStoreHook();
    let { role_id } = useUserStoreHook();
    // 拿到的role_id是通过 Base64加密的,需要解密
    let new_role_id = Base64.decode(role_id);

    const roleList = ["0", "-1"];

    const { value } = binding;
    if (typeof value === "number") {
      const requiredModuleType = value; // DOM绑定需要的按钮权限标识
      let hasPerm = false;
      if (requiredModuleType === module_type && roleList.includes(new_role_id)) {
        hasPerm = true;
      }

      if (!hasPerm) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error('need perms! Like v-hasModule="moduleType",moduleType need number');
    }
  },
};
