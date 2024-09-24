import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { IGetSupList, IGetSupDetail } from "@/api/storage/get-supplier/types";
import { ISearchQuery } from "@/api/storage/stotypes";
// 获取领料出库单列表API
export function getGetSupListApi(data: ISearchQuery): AxiosPromise<IGetSupList> {
  return request({
    url: "/apios/warehouse_rec/getList",
    method: "post",
    data,
  });
}

// 创建领料出库单API
export function addGetSupApi(data: any): AxiosPromise {
  return request({
    url: "/apios/warehouse_rec/create",
    method: "post",
    data,
  });
}

// 编辑领料出库单API
export function editGetSupApi(data: any): AxiosPromise {
  return request({
    url: "/apios/warehouse_rec/edit",
    method: "post",
    data,
  });
}

// 获取领料出库单详情API
export function detailGetSupApi(data: { id: number }): AxiosPromise<IGetSupDetail> {
  return request({
    url: "/apios/warehouse_rec/details",
    method: "post",
    data,
  });
}

// 提审领料出库单API
export function submitGetSupApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_rec/review",
    method: "post",
    data,
  });
}

// 撤回领料出库单API
export function recallGetSupApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_rec/withdrawal",
    method: "post",
    data,
  });
}

// 作废领料出库单API
export function voidGetSupApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_rec/nullify",
    method: "post",
    data,
  });
}

// 删除领料出库单API
export function delGetSupApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_rec/delete",
    method: "post",
    data,
  });
}

// 驳回领料出库单API
export function rejectGetSupApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_rec/reject",
    method: "post",
    data,
  });
}

// 通过领料出库单API
export function approveGetSupApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_rec/approve",
    method: "post",
    data,
  });
}

// 仓库驳回领料出库单API
export function rejectGetSupWhApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_rec/whReject",
    method: "post",
    data,
  });
}

// 仓库通过领料出库单API  --- 202311改为仓库发料接口,参数,id和goods
export function approveGetSupWhApi(data: { id: number; goods: any[] }): AxiosPromise {
  return request({
    url: "/apios/warehouse_rec/whApprove",
    method: "post",
    data,
  });
}

/** 列表页弹窗-修改指定领料人 */
export function editReceiverApi(data: { id: number; receiver: string }): AxiosPromise {
  return request({
    url: "/apios/warehouse_rec/whSetReceiver",
    method: "post",
    data,
  });
}

/** 列表页-领取确认弹窗信息 废弃? */
// export function getReceiveStatusApi(data: { id: number }): AxiosPromise {
//   return request({
//     url: "/apios/warehouse_rec/whReceiverDetail",
//     method: "post",
//     data,
//   });
// }

/** 详情页-领取确认 */
export function confirmReceiveApi(data: { id: number; goods: any[] }): AxiosPromise {
  return request({
    url: "/apios/warehouse_rec/whReceiverApprove",
    method: "post",
    data,
  });
}
/** 详情页-发料明细api */
export function giveDetailApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_rec/materialIssueDetail",
    method: "post",
    data,
    dialogParams: true,
  });
}

/** 详情页-发料撤回api */
export function recallGiveApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_rec/issuanceWithDrawal",
    method: "post",
    data,
    dialogParams: true,
  });
}

/** 详情页-领料完结api */
export function overGetSupApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_rec/whReceiverComplete",
    method: "post",
    data,
  });
}
