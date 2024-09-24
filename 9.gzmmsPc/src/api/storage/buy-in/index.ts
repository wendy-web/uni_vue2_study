import { AxiosPromise } from "axios";
import { ISearchQuery } from "@/api/storage/stotypes";
import request from "@/utils/request";
import { IBuyInDetail, IBuyInImport, IBuyInList } from "./types";

// 获取采购入库单列表API
export function getBuyInListApi(data: ISearchQuery): AxiosPromise<IBuyInList> {
  return request({
    url: "/apios/warehouse_in/getList",
    method: "post",
    data,
  });
}

// 创建采购入库单API
export function addBuyInApi(data: any): AxiosPromise {
  return request({
    url: "/apios/warehouse_in/create",
    method: "post",
    data,
  });
}

// 编辑采购入库单API
export function editBuyInApi(data: any): AxiosPromise {
  return request({
    url: "/apios/warehouse_in/edit",
    method: "post",
    data,
  });
}

// 获取采购入库单详情API
export function detailBuyInApi(data: any): AxiosPromise<IBuyInDetail> {
  return request({
    url: "/apios/warehouse_in/details",
    method: "post",
    data,
  });
}

// 导入采购入库单API
export function importBuyInApi(data: any): AxiosPromise<IBuyInImport> {
  return request({
    url: "/apios/warehouse_in/import",
    method: "post",
    data,
    customParams: true,
  });
}

// 提审入库单API
export function submitBuyInApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_in/review",
    method: "post",
    data,
  });
}

// 撤回入库单API
export function recallBuyInApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_in/withdrawal",
    method: "post",
    data,
  });
}

// 作废入库单API
export function voidBuyInApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_in/nullify",
    method: "post",
    data,
  });
}

// 删除入库单API
export function delBuyInApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_in/delete",
    method: "post",
    data,
  });
}

// 驳回入库单API
export function rejectBuyInApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_in/reject",
    method: "post",
    data,
  });
}

// 通过入库单API
export function approveBuyInApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_in/approve",
    method: "post",
    data,
  });
}

// 仓库驳回入库单API
export function rejectBuyInWhApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_in/whReject",
    method: "post",
    data,
  });
}

// 仓库通过入库单API
export function approveBuyInWhApi(data: { id: number; in_time: string }): AxiosPromise {
  return request({
    url: "/apios/warehouse_in/whApprove",
    method: "post",
    data,
  });
}
