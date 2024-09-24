import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { ISearchQuery } from "@/api/storage/stotypes";
import { IAllotList, IAllotDetail } from "./types";

// 获取调拨单列表API
export function getRllotListApi(data: ISearchQuery): AxiosPromise<IAllotList> {
  return request({
    url: "/apios/warehouse_tra/getList",
    method: "post",
    data,
  });
}

// 创建调拨单API
export function addRllotApi(data: any): AxiosPromise {
  return request({
    url: "/apios/warehouse_tra/create",
    method: "post",
    data,
  });
}

// 编辑调拨单API
export function editRllotApi(data: any): AxiosPromise {
  return request({
    url: "/apios/warehouse_tra/edit",
    method: "post",
    data,
  });
}

// 获取调拨单详情API
export function detailRllotApi(data: { id: number }): AxiosPromise<IAllotDetail> {
  return request({
    url: "/apios/warehouse_tra/details",
    method: "post",
    data,
  });
}

// 提审调拨单API
export function submitRllotApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_tra/review",
    method: "post",
    data,
  });
}

// 撤回调拨单API
export function recallRllotApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_tra/withdrawal",
    method: "post",
    data,
  });
}

// 作废调拨单API
export function voidRllotApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_tra/nullify",
    method: "post",
    data,
  });
}

// 删除调拨单API
export function delRllotApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_tra/delete",
    method: "post",
    data,
  });
}

// 驳回调拨单API
export function rejectRllotApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_tra/reject",
    method: "post",
    data,
  });
}

// 通过调拨单API
export function approveRllotApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_tra/approve",
    method: "post",
    data,
  });
}

// 仓库驳回领料出库单API
export function rejectRllotWhApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_tra/whReject",
    method: "post",
    data,
  });
}

// 仓库通过领料出库单API
export function approveRllotWhApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_tra/whApprove",
    method: "post",
    data,
  });
}
