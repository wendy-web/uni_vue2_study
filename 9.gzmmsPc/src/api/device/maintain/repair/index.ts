import { AxiosPromise } from "axios";
import request from "@/utils/request";
import { RepairListType,RepairInfoType } from "./types";

// 维修单列表
export function getRepairListApi(data: {}): AxiosPromise<RepairListType> {
  return request({
    url: "/mro/Repair/list",
    method: "post",
    data,
  });
}

// 维修单编辑数据
export function getRepairInfoApi(data: { id: number }): AxiosPromise<RepairInfoType> {
  return request({
    url: "/mro/Repair/Repairinfo",
    method: "post",
    data,
  });
}

// 维修单-作废
export function getRepairVoidApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/mro/Repair/cancelRepairOrder",
    method: "post",
    data,
  });
}

// 维修单-撤回
export function getRepairRecallApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/mro/Repair/revokeOrder",
    method: "post",
    data,
  });
}

// 维修单-提交验证
export function getRepairSubmitApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/mro/Repair/commitAcceptOrder",
    method: "post",
    data,
  });
}

// 维修单-驳回
export function getRepairRejectApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/mro/Repair/rejectOrder",
    method: "post",
    data,
  });
}

// 维修单-验收通过
export function getRepairApproveApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/mro/Repair/finishOrder",
    method: "post",
    data,
  });
}

// 维修单-删除
export function getRepairDelApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/mro/Repair/deleteOrder",
    method: "post",
    data,
  });
}

// 维修单-新建编辑
export function getRepairAddEditApi(data: {}): AxiosPromise {
  return request({
    url: "/mro/Repair/repairOrder",
    method: "post",
    data,
  });
}
