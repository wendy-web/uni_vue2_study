import { AxiosPromise } from "axios";
import { ISearchQuery } from "@/api/storage/stotypes";
import request from "@/utils/request";
import { IOtherInDetail, IOtherInList } from "./types";

// 获取其他入库单列表API
export function getOtherInListApi(data: ISearchQuery): AxiosPromise<IOtherInList> {
  return request({
    url: "/apios/warehouse_otr_in/getList",
    method: "post",
    data,
  });
}

// 创建其他入库单API
export function addOtherInApi(data: any): AxiosPromise {
  return request({
    url: "/apios/warehouse_otr_in/create",
    method: "post",
    data,
  });
}

// 编辑其他入库单API
export function editOtherInApi(data: any): AxiosPromise {
  return request({
    url: "/apios/warehouse_otr_in/edit",
    method: "post",
    data,
  });
}

// 获取其他入库单详情API
export function detailOtherInApi(data: any): AxiosPromise<IOtherInDetail> {
  return request({
    url: "/apios/warehouse_otr_in/details",
    method: "post",
    data,
  });
}

// 提审其他入库单API
export function submitOtherInApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_otr_in/review",
    method: "post",
    data,
  });
}

// 撤回其他入库单API
export function recallOtherInApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_otr_in/withdrawal",
    method: "post",
    data,
  });
}

// 作废其他入库单API
export function voidOtherInApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_otr_in/nullify",
    method: "post",
    data,
  });
}

// 删除其他入库单API
export function delOtherInApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_otr_in/delete",
    method: "post",
    data,
  });
}

// 驳回其他入库单API
export function rejectOtherInApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_otr_in/reject",
    method: "post",
    data,
  });
}

// 通过其他入库单API
export function approveOtherInApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_otr_in/approve",
    method: "post",
    data,
  });
}

// 仓库驳回其他入库单API
export function rejcetOtherInWhApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_otr_in/whReject",
    method: "post",
    data,
  });
}

// 仓库通过其他入库单API
export function approveOtherInWhApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_otr_in/whApprove",
    method: "post",
    data,
  });
}
