import { AxiosPromise } from "axios";
import request from "@/utils/request";
import { MaintainProjectList } from "./types";

// 保养项目列表
export function getMaintainProjectApi(data: {}): AxiosPromise<MaintainProjectList> {
  return request({
    url: "/mro/maintenance_project/list",
    method: "post",
    data,
  });
}

// 保养项目详情
export function getMaintainProjectDetailApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/mro/maintenance_project/details",
    method: "post",
    data,
  });
}

// 保养项目删除
export function getMaintainProjectDelApi(data: { ids: number[] }): AxiosPromise {
  return request({
    url: "/mro/maintenance_project/del",
    method: "post",
    data,
  });
}

// 保养项目编辑
export function getMaintainProjectEditApi(data: {}): AxiosPromise {
  return request({
    url: "/mro/maintenance_project/edit",
    method: "post",
    data,
  });
}

// 保养项目新增
export function getMaintainProjectAddApi(data: {}): AxiosPromise {
  return request({
    url: "/mro/maintenance_project/create",
    method: "post",
    data,
  });
}
