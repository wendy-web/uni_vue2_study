import { AxiosPromise } from "axios";
import request from "@/utils/request";
import { WorkOrderDetailType, WorkOrderListType } from "./types";

// 保养工单-列表
export function getMaintainWorkApi(data: {}): AxiosPromise<WorkOrderListType> {
  return request({
    url: "/mro/maintenance_order/list",
    method: "post",
    data,
  });
}

// 保养工单-新增（保养计划=》执行计划用这个接口）
export function getMaintainWorkAddApi(data: {}): AxiosPromise {
  return request({
    url: "/mro/maintenance_order/create",
    method: "post",
    data,
  });
}

// 保养工单-撤回
export function getMaintainWorkRecallApi(data: {}): AxiosPromise {
  return request({
    url: "/mro/maintenance_order/withdrawal",
    method: "post",
    data,
  });
}
// 保养工单-编辑
export function getMaintainWorkEditApi(data: {}): AxiosPromise {
  return request({
    url: "/mro/maintenance_order/edit",
    method: "post",
    data,
  });
}

// 保养工单-详情
export function getMaintainWorkDetailApi(data: { id: number }): AxiosPromise<WorkOrderDetailType> {
  return request({
    url: "/mro/maintenance_order/details",
    method: "post",
    data,
  });
}

// 保养工单-验收通过
export function getMaintainWorkApproveApi(data: {id: number}): AxiosPromise {
  return request({
    url: "/mro/maintenance_order/approve",
    method: "post",
    data,
  });
}

// 保养工单-驳回
export function getMaintainWorkRejectApi(data: {id: number}): AxiosPromise {
  return request({
    url: "/mro/maintenance_order/reject",
    method: "post",
    data,
  });
}

// 保养工单-提交验收
export function getMaintainWorkSubmitApi(data: {id: number}): AxiosPromise {
  return request({
    url: "/mro/maintenance_order/review",
    method: "post",
    data,
  });
}
