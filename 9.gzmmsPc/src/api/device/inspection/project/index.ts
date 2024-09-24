import { AxiosPromise } from "axios";
import request from "@/utils/request";
import { InspectionProjectList,InspectionProjectDetail } from "./types";

// 点巡检标准-列表
export function getInspectionProjectListApi(data: {}): AxiosPromise<InspectionProjectList> {
  return request({
    url: "/mro/point_inspect_std/list",
    method: "post",
    data,
  });
}

// 点巡检标准-删除
export function getInspectionProjectDelApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/mro/point_inspect_std/del",
    method: "post",
    data,
  });
}

// 点巡检标准-编辑
export function getInspectionProjectEditApi(data: {}): AxiosPromise {
  return request({
    url: "/mro/point_inspect_std/edit",
    method: "post",
    data,
  });
}

// 点巡检标准-详情
export function getInspectionProjectDetailApi(data: {}): AxiosPromise<InspectionProjectDetail> {
  return request({
    url: "/mro/point_inspect_std/details",
    method: "post",
    data,
  });
}

// 点巡检标准-新建
export function getInspectionProjectAddApi(data: {}): AxiosPromise {
  return request({
    url: "/mro/point_inspect_std/create",
    method: "post",
    data,
  });
}
