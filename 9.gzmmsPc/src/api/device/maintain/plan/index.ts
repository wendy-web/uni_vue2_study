import { AxiosPromise } from "axios";
import request from "@/utils/request";
import { MaintainPlanList,PlanDetailType } from "./types";

// 保养计划列表
export function getMaintainPlanApi(data: {}): AxiosPromise<MaintainPlanList> {
  return request({
    url: "/mro/maintenance_plan/list",
    method: "post",
    data,
  });
}

// 保养计划编辑
export function getMaintainPlanEditApi(data: {}): AxiosPromise {
  return request({
    url: "/mro/maintenance_plan/edit",
    method: "post",
    data,
  });
}

// 保养计划详情
export function getMaintainPlanDetailApi(data: {id: number}): AxiosPromise<PlanDetailType> {
  return request({
    url: "/mro/maintenance_plan/details",
    method: "post",
    data,
  });
}

// 保养计划删除
export function getMaintainPlanDelApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/mro/maintenance_plan/del",
    method: "post",
    data,
  });
}
// 保养计划新增
export function getMaintainPlanAddApi(data: {}): AxiosPromise {
  return request({
    url: "/mro/maintenance_plan/create",
    method: "post",
    data,
  });
}

// 保养计划-标记启用或停用
export function updEnableStatusApi(data: { id: number; status: number }): AxiosPromise {
  return request({
    url: "/mro/maintenance_plan/updEnableStatus",
    method: "post",
    data,
  });
}
