/* 开机确认人配置 API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

/** 列表api */
export function getListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/power_confirm_user_basic/list",
    method: "post",
    data,
  });
}
/** 创建api */
export function createApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/power_confirm_user_basic/create",
    method: "post",
    data,
  });
}
/** 更新api */
export function editApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/power_confirm_user_basic/edit",
    method: "post",
    data,
  });
}
/** 删除api */
export function deleteApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/power_confirm_user_basic/del",
    method: "post",
    data,
  });
}
