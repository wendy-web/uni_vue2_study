/*定量项目API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

// 定量项目api
// 列表信息
export function getListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Quantify/getQuantifyList",
    method: "post",
    data,
  });
}
// 创建
export function createQuantifyApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Quantify/createQuantify",
    method: "post",
    data,
  });
}
// 更新
export function editQuantifyApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Quantify/editQuantify",
    method: "post",
    data,
  });
}
// 删除
export function delQuantifyApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Quantify/delQuantify",
    method: "post",
    data,
  });
}
// 开启、停用
export function changeStatusApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Quantify/updEnableStatus",
    method: "post",
    data,
  });
}
