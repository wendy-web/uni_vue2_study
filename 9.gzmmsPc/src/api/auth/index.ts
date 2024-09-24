import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { LoginData, TokenResult } from "./types";

// 用户登录
export function loginApi(data: LoginData): AxiosPromise<TokenResult> {
  return request({
    url: "/apios/login/check",
    method: "post",
    data: data,
  });
}

// 退出登录
export function logoutApi(): AxiosPromise {
  return request({
    url: "/apios/home/logout",
    method: "post",
  });
}

// 退出登录
export function changePasswordApi(data: {
  original_pwd: string;
  pwd1: string;
  pwd2: string;
}): AxiosPromise {
  return request({
    url: "/apios/post/passwordChange",
    method: "post",
    data: data,
  });
}
