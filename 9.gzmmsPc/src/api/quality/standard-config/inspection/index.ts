/*检验依据API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

// 列表信息
export function getListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Insp/getInspList",
    method: "post",
    data,
  });
}
// 创建
export function createApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Insp/createInsp",
    method: "post",
    data,
  });
}
// 更新
export function editApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Insp/editInsp",
    method: "post",
    data,
  });
}
// 删除
export function deleteApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Insp/delInsp",
    method: "post",
    data,
  });
}
// 开启、停用
export function changeStatusApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Insp/updEnableStatus",
    method: "post",
    data,
  });
}
