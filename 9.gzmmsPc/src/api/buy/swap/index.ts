import request from "@/utils/request";
import { AxiosPromise } from "axios";
import type { ISwapData, ISwapDetail } from "./types";

/**@explain 采购换货单列表api */
export function getSwapListApi(data: any): AxiosPromise<ISwapData> {
  return request({
    url: "/apios/pro_replacement/index",
    method: "post",
    data,
  });
}

/**@explain 新建采购换货单api */
export function addSwapApi(data: any): AxiosPromise<any> {
  return request({
    url: "/apios/pro_replacement/create",
    method: "post",
    data,
  });
}

/**@explain 编辑采购换货单api */
export function editSwapApi(data: any): AxiosPromise<any> {
  return request({
    url: "/apios/pro_replacement/edit",
    method: "post",
    data,
  });
}

/**@explain 采购换货单详情api */
export function getSwapDetailApi(data: { id: number }): AxiosPromise<ISwapDetail> {
  return request({
    url: "/apios/pro_replacement/detail",
    method: "post",
    data,
  });
}

/**@explain 作废采购换货单api */
export function voidSwapApi(data: { id: number }): AxiosPromise<ISwapDetail> {
  return request({
    url: "/apios/pro_replacement/invalid",
    method: "post",
    data,
  });
}

/**@explain 删除采购换货单api */
export function delSwapApi(data: { id: number }): AxiosPromise<ISwapDetail> {
  return request({
    url: "/apios/pro_replacement/delete",
    method: "post",
    data,
  });
}
/**@explain 提审采购换货单api */
export function submitSwapApi(data: { id: number }): AxiosPromise<ISwapDetail> {
  return request({
    url: "/apios/pro_replacement/submit",
    method: "post",
    data,
  });
}
/**@explain 撤回采购换货单api */
export function recallSwapApi(data: { id: number }): AxiosPromise<ISwapDetail> {
  return request({
    url: "/apios/pro_replacement/recall",
    method: "post",
    data,
  });
}
/**@explain 驳回采购换货单api */
export function rejectSwapApi(data: { id: number }): AxiosPromise<ISwapDetail> {
  return request({
    url: "/apios/pro_replacement/reject",
    method: "post",
    data,
  });
}

/**@explain 通过采购换货单api */
export function approveSwapApi(data: { id: number }): AxiosPromise<ISwapDetail> {
  return request({
    url: "/apios/pro_replacement/approve",
    method: "post",
    data,
  });
}
