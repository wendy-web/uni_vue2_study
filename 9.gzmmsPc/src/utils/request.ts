import { ElMessage, ElMessageBox } from "element-plus";
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getToken } from "@/utils/auth";
import router from "@/router";
import { useUserStoreHook } from "@/store/modules/user";

export function getBaseUrl() {
  let userAgent = navigator.userAgent.toLowerCase();
  let isElectron = userAgent.indexOf(" electron/") > -1;

  // console.log("isElectron", isElectron);
  let baseURL = "";
  if (isElectron) {
    // 如果是 electron 端, 则使用  https://gzmms.y1b.cn
    baseURL = import.meta.env.VITE_APP_BASE_API;
  } else {
    // 如果是 web 端,且为线上测试环境,则使用window.location.origin 动态获取,否则使用代理环境
    baseURL =
      import.meta.env.MODE == "production"
        ? window.location.origin
        : import.meta.env.VITE_APP_BASE_API;
  }
  return baseURL;
}

const baseURL = getBaseUrl();

// console.log("baseURL", baseURL);

// 创建 axios 实例
const service = axios.create({
  // baseURL:
  //   import.meta.env.MODE == "production"
  //     ? window.location.origin
  //     : import.meta.env.VITE_APP_BASE_API,
  // baseURL: import.meta.env.VITE_APP_BASE_API,
  baseURL,
  timeout: 50000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

declare module "axios" {
  // 自定义添加 返回的数据参数
  interface AxiosResponse<T = any> {
    code: null;
    // 这里追加你的参数
    msg: "";
  }
  // 自定义添加 发送请求的参数
  interface AxiosRequestConfig<D = any> {
    /** 请求时设为true,那么code不是1,-1,-2这三个状态时,会直接返回response.data; */
    customParams?: Boolean;
    /** 请求时设为true,那么code为-2时,会弹窗提示401,且直接返回response.data */
    dialogParams?: Boolean;
  }
  export function create(config?: AxiosRequestConfig): AxiosInstance;
}

// 请求拦截器
service.interceptors.request.use(
  // config: AxiosRequestConfig
  (config: InternalAxiosRequestConfig) => {
    if (!config.headers) {
      throw new Error(`Expected 'config' and 'config.headers' not to be undefined`);
    }
    const user = useUserStoreHook();
    if (user.token) {
      (config.headers as any).Authorization = getToken();
    }
    config.headers["Module-Type"] = user.module_type;
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  },
);

let messageBoxFlag = 0; // 默认 MessageBox 未打开

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, msg } = response.data;
    // 当返回的code不为1, 且customParams为true, 那么直接返回response.data,不显示ElMessage.error
    let customParams = response.config.customParams;
    let dialogParams = response.config.dialogParams;

    const { resetToken } = useUserStoreHook();

    if (code === "1") {
      return response.data;
    } else {
      // 响应数据为二进制流处理(Excel导出)
      let isArrayBuffer = response.data instanceof ArrayBuffer;
      let isBlob = response.data instanceof Blob;
      if (isArrayBuffer || isBlob) {
        return response;
      }
      // token 过期,重新登录
      if (code === "-1") {
        if (messageBoxFlag === 0) {
          messageBoxFlag = 1; // 修改标记，打开 MessageBox
          ElMessageBox.confirm("当前页面已失效，请重新登录", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              messageBoxFlag = 0; // 修改标记
              resetToken();
              // window.location.href = "/";
              router.replace(`/`);
            })
            .catch(() => {
              messageBoxFlag = 0; // 修改标记
            });
          return Promise.reject(new Error(`Error${msg}`));
        } else {
          return Promise.reject(new Error(`Error${msg}`));
        }
      }
      // 没有权限
      if (code === "-2") {
        // 特殊情况 接口设置了 dialogParams 为true,直接弹窗提示
        if (dialogParams) {
          ElMessageBox.confirm(`很抱歉,您没有操作权限!`, "温馨提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: false,
            type: "warning",
          })
            .then(() => {
              console.log("点击了 确定");
            })
            .catch((error) => {
              console.log("error", error);
            });
          return response.data;
        }
        // 普通情况 接口报-2没有权限时,跳转到 401页面
        // window.location.href = "/#/401";
        // location.href = "/#/401";
        console.log("跳转到401");
        checkDialogClose();
        router.replace(`/401`);
        ElMessage({
          message: `很抱歉,您没有操作权限!`,
          type: "error",
        });
        return Promise.reject(new Error(msg || "Error401"));
      }
      if (customParams) {
        return response.data;
      }
      ElMessage({
        message: msg || "系统出错",
        type: "error",
      });
      return Promise.reject(new Error(msg || "Error"));
    }
  },
  (error: any) => {
    if (error.response.data) {
      const { code, msg } = error.response.data;
      const { resetToken } = useUserStoreHook();
      if (code === "-1") {
        ElMessageBox.confirm("当前页面已失效，请重新登录", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          resetToken();
          router.replace(`/`);
        });
      } else {
        ElMessage({
          message: msg || "系统出错",
          type: "error",
        });
      }
    }
    return Promise.reject(error.message);
  },
);

function checkDialogClose() {
  const overlayElement = document.querySelectorAll(".el-overlay");
  if (overlayElement) {
    overlayElement.forEach((dialogWrapper) => {
      dialogWrapper?.remove(); // 移除弹窗遮罩
    });
  }
  const dialogInstance = document.querySelector(".el-dialog");
  dialogInstance?.remove();
}

/**
 * @param { Promise } promise
 * @param { Object= } errorExt - 可以传递给err对象的附加信息
 * @return { Promise }
 */
export function to<T, U = Error>(
  promise: Promise<T>,
  errorExt?: object,
): Promise<[U, undefined] | [null, T]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        const parsedError = Object.assign({}, err, errorExt);
        return [parsedError, undefined];
      }

      return [err, undefined];
    });
}

// 导出 axios 实例
export default service;
