import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { ISearchQuery } from "@/api/storage/stotypes";
import { IScrapList, IScrapDetail } from "./types";

// 获取报废单列表API
export function getScrapListApi(data: ISearchQuery): AxiosPromise<IScrapList> {
  return request({
    url: "/apios/warehouse_scr/getList",
    method: "post",
    data,
  });
}

// 创建报废单API
export function addScrapApi(data: any): AxiosPromise {
  return request({
    url: "/apios/warehouse_scr/create",
    method: "post",
    data,
  });
}

// 编辑报废单API
export function editScrapApi(data: any): AxiosPromise {
  return request({
    url: "/apios/warehouse_scr/edit",
    method: "post",
    data,
  });
}

// 获取报废单详情API
export function detailScrapApi(data: { id: number }): AxiosPromise<IScrapDetail> {
  return request({
    url: "/apios/warehouse_scr/details",
    method: "post",
    data,
  });
}

// 提审报废单API
export function submitScrapApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_scr/review",
    method: "post",
    data,
  });
}

// 撤回报废单API
export function recallScrapApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_scr/withdrawal",
    method: "post",
    data,
  });
}

// 作废报废单API
export function voidScrapApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_scr/nullify",
    method: "post",
    data,
  });
}

// 删除报废单API
export function delScrapApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_scr/delete",
    method: "post",
    data,
  });
}

// 驳回报废单API
export function rejectScrapApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_scr/reject",
    method: "post",
    data,
  });
}

// 通过报废单API
export function approveScrapApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_scr/approve",
    method: "post",
    data,
  });
}
