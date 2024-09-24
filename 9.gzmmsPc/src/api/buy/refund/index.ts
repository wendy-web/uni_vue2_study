import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { IRefundList, IImportData, IRefundPreInfo } from "./types";

import { IBuyOrderQuery } from "../order/types";

// 获取采购退货单列表API
export function getRefundListApi(data: IBuyOrderQuery): AxiosPromise<IRefundList> {
  return request({
    url: "/apios/procure_ret/getList",
    method: "post",
    data,
  });
}

// 创建采购退货单API
export function addRefundApi(data: IRefundPreInfo): AxiosPromise {
  return request({
    url: "/apios/procure_ret/create",
    method: "post",
    data,
  });
}

// 编辑采购退货单API
export function editRefundApi(data: IRefundPreInfo): AxiosPromise {
  return request({
    url: "/apios/procure_ret/edit",
    method: "post",
    data,
  });
}

// 导入采购退货单API
export function importRefundApi(data: { procure_no: string }): AxiosPromise<IImportData> {
  return request({
    url: "/apios/procure_ret/import",
    method: "post",
    data,
    customParams: true,
  });
}

// 获取采购退货单详情
export function detailRefundApi(data: { id: number }): AxiosPromise<any> {
  return request({
    url: "/apios/procure_ret/details",
    method: "post",
    data,
  });
}

// 作废采购退货单
export function voidRefundApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/procure_ret/nullify",
    method: "post",
    data,
  });
}

// 删除采购退货单
export function delRefundApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/procure_ret/delete",
    method: "post",
    data,
  });
}

// 提交审核采购退货单
export function submitRefunApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/procure_ret/review",
    method: "post",
    data,
  });
}

// 撤回采购退货单
export function recallRefundApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/procure_ret/withdrawal",
    method: "post",
    data,
  });
}

// 驳回采购退货单
export function rejectRefundApi(data: { id: number; reason: string }): AxiosPromise {
  return request({
    url: "/apios/procure_ret/reject",
    method: "post",
    data,
  });
}

// 通过采购退货单
export function approveRefundApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/procure_ret/approve",
    method: "post",
    data,
  });
}
