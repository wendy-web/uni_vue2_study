/* 空罐卷封检验报告API */

import { AxiosPromise } from "axios";
import request from "@/utils/request";

import { CansSeamModule } from "./types";

// 空罐卷封列表
export function getEmptypotListApi(data:CansSeamModule.Query): AxiosPromise<CansSeamModule.CansSeamList> {
  return request({
    url: "/qlty/Emptypot/getList",
    method: "post",
    data,
  });
}
// 空罐卷封详情 
export function getEmptypotInfoApi(data:{id:number}): AxiosPromise<CansSeamModule.EmptypotInfo> {
  return request({
    url: "/qlty/Emptypot/getInfo",
    method: "post",
    data,
  });
}
// 创建、编辑、审核空罐卷封检验报告
export function saveEmptypotApi(data: CansSeamModule.EmptypotParams): AxiosPromise {
  return request({
    url: "/qlty/Emptypot/saveOrder",
    method: "post",
    data,
  });
}
// 提交审核
export function commitEmptypotApi(data: CansSeamModule.EmptypotCommit): AxiosPromise {
  return request({
    url: "/qlty/Emptypot/commitAcceptOrder",
    method: "post",
    data,
  });
}
// 撤回
export function revokeEmptypotApi(data: {id: number}): AxiosPromise {
  return request({
    url: "/qlty/Emptypot/revokeOrder",
    method: "post",
    data,
  });
}
// 删除 
export function delEmptypotApi(data: {id: number}): AxiosPromise {
  return request({
    url: "/qlty/Emptypot/deleteOrder",
    method: "post",
    data,
  });
}
// 驳回 
export function rejectEmptypotApi(data: CansSeamModule.EmptypotReject): AxiosPromise {
  return request({
    url: "/qlty/Emptypot/rejectOrder",
    method: "post",
    data,
  });
}
// 签名审核通过
export function finishEmptypotApi(data: CansSeamModule.EmptypotFinish): AxiosPromise {
  return request({
    url: "/qlty/Emptypot/finishOrder",
    method: "post",
    data,
  });
}
// 生成报告
export function makeReportApi(data: {id: number}): AxiosPromise<{name:string,src:string}> {
  return request({
    url: "/qlty/Emptypot/makeReport",
    method: "post",
    data,
  });
}
// 反审核 
export function countertrialApi(data: {id: number,reason?:string}): AxiosPromise<{name:string,src:string}> {
  return request({
    url: "/qlty/Emptypot/countertrial",
    method: "post",
    data,
  });
}