import request from "@/utils/request";
import { AxiosPromise, ResponseType } from "axios";
import { ISearchQuery } from "@/api/storage/stotypes";
import { ICheckList, ICheckDetail } from "./types";

// 获取盘点单列表API
export function getCheckListApi(data: ISearchQuery): AxiosPromise<ICheckList> {
  return request({
    url: "/apios/warehouse_inv/getList",
    method: "post",
    data,
  });
}

// 创建盘点单API
export function addCheckApi(data: any): AxiosPromise {
  return request({
    url: "/apios/warehouse_inv/create",
    method: "post",
    data,
  });
}

// 编辑盘点单API
export function editCheckApi(data: any): AxiosPromise {
  return request({
    url: "/apios/warehouse_inv/edit",
    method: "post",
    data,
  });
}

// 获取盘点单详情API
export function detailCheckApi(data: { id: number }): AxiosPromise<ICheckDetail> {
  return request({
    url: "/apios/warehouse_inv/details",
    method: "post",
    data,
  });
}

// 提审盘点单API
export function submitCheckApi(data: { id: number; up_inv: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_inv/review",
    method: "post",
    data,
  });
}

// 撤回盘点单API
export function recallCheckApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_inv/withdrawal",
    method: "post",
    data,
  });
}

// 作废盘点单API
export function voidCheckApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_inv/nullify",
    method: "post",
    data,
  });
}

// 删除盘点单API
export function delCheckApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_inv/delete",
    method: "post",
    data,
  });
}

// 驳回盘点单API
export function rejectCheckApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_inv/reject",
    method: "post",
    data,
  });
}

// 通过盘点单API
export function approveCheckApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_inv/approve",
    method: "post",
    data,
  });
}

// 通过盘点单API
export function exportCheckApi(
  data: { id: number },
  responseType: ResponseType = "json",
): AxiosPromise {
  return request({
    url: "/apios/warehouse_inv/goodsDetailExport",
    method: "post",
    data,
    responseType,
  });
}
