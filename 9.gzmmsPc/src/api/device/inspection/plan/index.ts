import { AxiosPromise } from "axios";
import request from "@/utils/request";
import { InspecDetailType, InspectionListType } from "./types";

// 点巡检计划-列表
export function getInspectionPlanListApi(data: {}): AxiosPromise<InspectionListType> {
  return request({
    url: "/mro/point_inspect_plan/list",
    method: "post",
    data,
  });
}

// 点巡检计划-删除
export function getInspectionPlanDelApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/mro/point_inspect_plan/del",
    method: "post",
    data,
  });
}

// 点巡检计划-编辑
export function getInspectionPlanEditApi(data: {}): AxiosPromise {
  return request({
    url: "/mro/point_inspect_plan/edit",
    method: "post",
    data,
  });
}

// 点巡检计划-详情
export function getInspectionPlanDetailApi(data: {}): AxiosPromise<InspecDetailType> {
  return request({
    url: "/mro/point_inspect_plan/details",
    method: "post",
    data,
  });
}

// 点巡检计划-新建
export function getInspectionPlanAddApi(data: {}): AxiosPromise {
  return request({
    url: "/mro/point_inspect_plan/create",
    method: "post",
    data,
  });
}

// 点巡检计划-启用-停用
export function getInspectionPlanSetApi(data: { id: number; status: number }): AxiosPromise {
  return request({
    url: "/mro/point_inspect_plan/updEnableStatus",
    method: "post",
    data,
  });
}
