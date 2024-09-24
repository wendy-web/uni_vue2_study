/* 生产班组API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

/** 列表api */ 
export function getListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Classtime/getClasstimeList",
    method: "post",
    data,
  });
}
/** 创建api */ 
export function createApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Classtime/createClasstime",
    method: "post",
    data,
  });
}
/** 更新api */ 
export function editApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Classtime/editClasstime",
    method: "post",
    data,
  });
}
/** 删除api */
export function deleteApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Classtime/delClasstime",
    method: "post",
    data,
  });
}
/** 开启、停用 */
export function changeStatusApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Classtime/updEnableStatus",
    method: "post",
    data,
    customParams: true, // code == 0的时候也能返回数据
  });
}
