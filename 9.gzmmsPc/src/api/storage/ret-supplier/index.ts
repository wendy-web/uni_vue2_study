import { AxiosPromise } from "axios";
import { IRetSupInDetail, IRetSupInImport, IRetSupInList } from "@/api/storage/ret-supplier/types";
import { ISearchQuery } from "@/api/storage/stotypes";
import request from "@/utils/request";

// 获取退料入库单列表API
export function getRetSupInListApi(data: ISearchQuery): AxiosPromise<IRetSupInList> {
  return request({
    url: "/apios/warehouse_rec_in/getList",
    method: "post",
    data,
  });
}

// 创建退料入库单API
export function addRetSupInApi(data: any): AxiosPromise {
  return request({
    url: "/apios/warehouse_rec_in/create",
    method: "post",
    data,
  });
}

// 编辑退料入库单API
export function editRetSupInApi(data: any): AxiosPromise {
  return request({
    url: "/apios/warehouse_rec_in/edit",
    method: "post",
    data,
  });
}

// 获取退料入库单详情API
export function detailRetSupInApi(data: { id: number }): AxiosPromise<IRetSupInDetail> {
  return request({
    url: "/apios/warehouse_rec_in/details",
    method: "post",
    data,
  });
}

// 导入退料入库单API
export function importRetSupInApi(data: {}): AxiosPromise<IRetSupInImport> {
  return request({
    url: "/apios/warehouse_rec_in/import",
    method: "post",
    data,
    customParams: true,
  });
}

// 提审退料入库单API
export function submitRetSupInApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_rec_in/review",
    method: "post",
    data,
  });
}

// 撤回退料入库单API
export function recallRetSupInApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_rec_in/withdrawal",
    method: "post",
    data,
  });
}

// 作废退料入库单API
export function voidRetSupInApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_rec_in/nullify",
    method: "post",
    data,
  });
}

// 删除退料入库单API
export function delRetSupInApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_rec_in/delete",
    method: "post",
    data,
  });
}

// 驳回退料入库单API
export function rejectRetSupInApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_rec_in/reject",
    method: "post",
    data,
  });
}

// 通过退料入库单API
export function approveRetSupInApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_rec_in/approve",
    method: "post",
    data,
  });
}

// 仓库驳回退料入库单API
export function rejectRetSupInWhApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_rec_in/whReject",
    method: "post",
    data,
  });
}

// 仓库通过退料入库单API
export function approveRetSupInWhApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_rec_in/whApprove",
    method: "post",
    data,
  });
}
