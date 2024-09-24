/* 热缩膜检验报告API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

import { HotFilmModule } from "./types";

// 获取热缩膜检验报告列表
export function getListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Hotshrink/getList",
    method: "post",
    data,
  });
}
// 获取热缩膜检验报告单下拉框数据
export function getBaseDataInitApi(): AxiosPromise<HotFilmModule.BaseData> {
  return request({
    url: "/qlty/Post/getHotShrinkInit",
    method: "post",
  });
}
// 创建编辑
export function saveOrderApi(data: {}): AxiosPromise{
  return request({
    url: "/qlty/Hotshrink/saveOrder",
    method: "post",
    data,
  });
}
// 详情接口
export function getInfoApi(data: {id: number}): AxiosPromise{
  return request({
    url: "/qlty/Hotshrink/getInfo",
    method: "post",
    data,
  });
}
// 审核通过 
export function finishOrderApi(data: {}): AxiosPromise{
  return request({
    url: "/qlty/Hotshrink/finishOrder",
    method: "post",
    data,
  });
}
// 审核不通过 
export function rejectOrderApi(data: {}): AxiosPromise{
  return request({
    url: "/qlty/Hotshrink/rejectOrder",
    method: "post",
    data,
  });
}
// 提交审核 
export function commitAcceptOrderApi(data: {}): AxiosPromise{
  return request({
    url: "/qlty/Hotshrink/commitAcceptOrder",
    method: "post",
    data,
  });
}
// 撤回 
export function revokeOrderApi(data: {}): AxiosPromise{
  return request({
    url: "/qlty/Hotshrink/revokeOrder",
    method: "post",
    data,
  });
}
// 删除 
export function deleteOrderApi(data: {}): AxiosPromise{
  return request({
    url: "/qlty/Hotshrink/deleteOrder",
    method: "post",
    data,
  });
}
// 反审核 
export function countertrialApi(data: {}): AxiosPromise{
  return request({
    url: "/qlty/Hotshrink/countertrial",
    method: "post",
    data,
  });
}
// 生成报告 
export function makeReportApi(data: {}): AxiosPromise{
  return request({
    url: "/qlty/Hotshrink/makeReport",
    method: "post",
    data,
  });
}