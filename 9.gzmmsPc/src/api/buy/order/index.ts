import { AxiosPromise } from "axios";
import request from "@/utils/request";
import { IBuyOrderList, IBuyOrderQuery, IOrderAddInfo, ProcureImportType } from "./types";

// 获取采购单列表API
export function getOrderListApi(data: IBuyOrderQuery): AxiosPromise<IBuyOrderList> {
  return request({
    url: "/apios/procure/getList",
    method: "post",
    data,
  });
}

// 创建采购单
export function addOrderApi(data: IOrderAddInfo): AxiosPromise {
  return request({
    url: "/apios/procure/create",
    method: "post",
    data,
  });
}

// 采购单详情
export function orderDetailApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/procure/details",
    method: "post",
    data,
  });
}

// 编辑采购单
export function editOrderApi(data: IOrderAddInfo): AxiosPromise {
  return request({
    url: "/apios/procure/edit",
    method: "post",
    data,
  });
}

// 作废采购单
export function voidOrderApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/procure/nullify",
    method: "post",
    data,
  });
}

// 删除采购单
export function delOrderApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/procure/delete",
    method: "post",
    data,
  });
}

// 提交审核采购单
export function submitOrderApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/procure/review",
    method: "post",
    data,
  });
}

// 撤回采购单
export function recallOrderApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/procure/withdrawal",
    method: "post",
    data,
  });
}

// 驳回采购单
export function rejectOrderApi(data: { id: number; reason: string }): AxiosPromise {
  return request({
    url: "/apios/procure/reject",
    method: "post",
    data,
  });
}

// 通过采购单
export function approveOrderApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/procure/approve",
    method: "post",
    data,
  });
}

// 采购货品导入Excel的Api
export function procureImportApi(file: any): AxiosPromise<ProcureImportType[]> {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/apios/post/procureImport",
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
