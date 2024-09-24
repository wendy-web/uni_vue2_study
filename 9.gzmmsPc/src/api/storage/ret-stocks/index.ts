import { AxiosPromise } from "axios";
import request from "@/utils/request";
import type { RetStocksDataType, RetStocksDetailType } from "./types";

// 退库单-列表API
export function getRetStocksListApi(data: {}): AxiosPromise<RetStocksDataType> {
  return request({
    url: "/apios/warehouse_inv_ret/getList",
    method: "post",
    data,
  });
}

// 退库单-撤回API
export function getRetStocksRecallApi(data: {}): AxiosPromise {
  return request({
    url: "/apios/warehouse_inv_ret/withdrawal",
    method: "post",
    data,
  });
}

// 退库单-详情
export function getRetStocksDetailApi(data: {}): AxiosPromise<RetStocksDetailType> {
  return request({
    url: "/apios/warehouse_inv_ret/details",
    method: "post",
    data,
  });
}

// 退库单-提审
export function getRetStockSubmitApi(data: {}): AxiosPromise {
  return request({
    url: "/apios/warehouse_inv_ret/review",
    method: "post",
    data,
  });
}

// 退库单-驳回
export function getRetStockRejectApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_inv_ret/reject",
    method: "post",
    data,
  });
}

// 退库单-通过
export function getRetStockApproveApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_inv_ret/approve",
    method: "post",
    data,
  });
}

// 退库单-作废
export function getRetStockVoidApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_inv_ret/nullify",
    method: "post",
    data,
  });
}

// 退库单-删除
export function getRetStockDelApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_inv_ret/delete",
    method: "post",
    data,
  });
}

// 退库单-新建
export function getRetStockCreatApi(data: {}): AxiosPromise {
  return request({
    url: "/apios/warehouse_inv_ret/create",
    method: "post",
    data,
  });
}

// 退库单-编辑
export function getRetStockEditApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_inv_ret/edit",
    method: "post",
    data,
  });
}

// 退库单-仓库确认-通过
export function getRetStockWhApproveApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_inv_ret/whApprove",
    method: "post",
    data,
  });
}

// 退库单-仓库确认-驳回
export function getRetStockWhRejectApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_inv_ret/whReject",
    method: "post",
    data,
  });
}
