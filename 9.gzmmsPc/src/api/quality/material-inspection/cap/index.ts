/* 底盖检验报告API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";
import { CapModule } from "./types";

// 顶盖/底盖检验报告单下拉框数据 /qlty/Post/getCapInitAction
export function getCapInitApi(): AxiosPromise<CapModule.BaseData> {
  return request({
    url: "/qlty/Post/getCapInit",
    method: "post",
  });
}
// 底盖尾盖列表
export function getListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Cap/getList",
    method: "post",
    data,
  });
}

// 创建编辑
export function saveOrderApi(data: {}): AxiosPromise{
  return request({
    url: "/qlty/Cap/saveOrder",
    method: "post",
    data,
  });
}
// 详情接口
export function getInfoApi(data: {id: number}): AxiosPromise{
  return request({
    url: "/qlty/Cap/getInfo",
    method: "post",
    data,
  });
}
// 审核通过 
export function finishOrderApi(data: {}): AxiosPromise{
  return request({
    url: "/qlty/Cap/finishOrder",
    method: "post",
    data,
  });
}
// 审核不通过 
export function rejectOrderApi(data: {}): AxiosPromise{
  return request({
    url: "/qlty/Cap/rejectOrder",
    method: "post",
    data,
  });
}
// 提交审核 
export function commitAcceptOrderApi(data: {}): AxiosPromise{
  return request({
    url: "/qlty/Cap/commitAcceptOrder",
    method: "post",
    data,
  });
}
// 撤回 
export function revokeOrderApi(data: {}): AxiosPromise{
  return request({
    url: "/qlty/Cap/revokeOrder",
    method: "post",
    data,
  });
}
// 删除 
export function deleteOrderApi(data: {}): AxiosPromise{
  return request({
    url: "/qlty/Cap/deleteOrder",
    method: "post",
    data,
  });
}
// 反审核 
export function countertrialApi(data: {}): AxiosPromise{
  return request({
    url: "/qlty/Cap/countertrial",
    method: "post",
    data,
  });
}
// 生成报告 
export function makeReportApi(data: {}): AxiosPromise{
  return request({
    url: "/qlty/Cap/makeReport",
    method: "post",
    data,
  });
}