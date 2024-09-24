/* 内涂膜检验报告API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";
import { InnerFilmModule } from "./types";

// 下拉数据 /qlty/Post/getInnercoatingInit
export function getInnercoatingInitApi(): AxiosPromise<InnerFilmModule.InnerFilmInitOptions> {
  return request({
    url: "/qlty/Post/getInnercoatingInit",
    method: "post",
  });
}
// 列表
export function getListApi(data: InnerFilmModule.ListQuery): AxiosPromise<InnerFilmModule.List> {
  return request({
    url: "/qlty/Innercoating/getList",
    method: "post",
    data,
  });
}
// 创建编辑
// export function saveOrderApi(data: InnerFilmModule.SaveOrderQuery): AxiosPromise{
export function saveOrderApi(data: {}): AxiosPromise{
  return request({
    url: "/qlty/Innercoating/saveOrder",
    method: "post",
    data,
  });
}
// 详情接口
export function getInfoApi(data: {id: number}): AxiosPromise{
  return request({
    url: "/qlty/Innercoating/getInfo",
    method: "post",
    data,
  });
}
// 审核通过 
export function finishOrderApi(data: {}): AxiosPromise{
  return request({
    url: "/qlty/Innercoating/finishOrder",
    method: "post",
    data,
  });
}
// 审核不通过 
export function rejectOrderApi(data: {}): AxiosPromise{
  return request({
    url: "/qlty/Innercoating/rejectOrder",
    method: "post",
    data,
  });
}
// 提交审核 
export function commitAcceptOrderApi(data: {}): AxiosPromise{
  return request({
    url: "/qlty/Innercoating/commitAcceptOrder",
    method: "post",
    data,
  });
}
// 撤回 
export function revokeOrderApi(data: {}): AxiosPromise{
  return request({
    url: "/qlty/Innercoating/revokeOrder",
    method: "post",
    data,
  });
}
// 删除 
export function deleteOrderApi(data: {}): AxiosPromise{
  return request({
    url: "/qlty/Innercoating/deleteOrder",
    method: "post",
    data,
  });
}
// 反审核 
export function countertrialApi(data: {}): AxiosPromise{
  return request({
    url: "/qlty/Innercoating/countertrial",
    method: "post",
    data,
  });
}
// 生成报告 
export function makeReportApi(data: {}): AxiosPromise{
  return request({
    url: "/qlty/Innercoating/makeReport",
    method: "post",
    data,
  });
}