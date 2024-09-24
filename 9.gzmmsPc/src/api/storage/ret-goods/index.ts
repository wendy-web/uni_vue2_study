import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { IRetGoodsList, IRetGoodsDetail, IRetGoodsImport } from "@/api/storage/ret-goods/types";
import { ISearchQuery } from "@/api/storage/stotypes";

// 获取退货出库单列表API
export function getRetGoodsListApi(data: ISearchQuery): AxiosPromise<IRetGoodsList> {
  return request({
    url: "/apios/warehouse_ret/getList",
    method: "post",
    data,
  });
}

// 创建退货出库单API
export function addRetGoodsApi(data: any): AxiosPromise {
  return request({
    url: "/apios/warehouse_ret/create",
    method: "post",
    data,
  });
}

// 编辑退货出库单API
export function editRetGoodsApi(data: any): AxiosPromise {
  return request({
    url: "/apios/warehouse_ret/edit",
    method: "post",
    data,
  });
}

// 获取退货出库单详情API
export function detailRetGoodsApi(data: { id: number }): AxiosPromise<IRetGoodsDetail> {
  return request({
    url: "/apios/warehouse_ret/details",
    method: "post",
    data,
  });
}

// 导入退货出库单API
export function importRetGoodsApi(data: { procure_no: string }): AxiosPromise<IRetGoodsImport> {
  return request({
    url: "/apios/warehouse_ret/import",
    method: "post",
    data,
    customParams: true,
  });
}

// 提审退货出库单API
export function submitRetGoodsApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_ret/review",
    method: "post",
    data,
  });
}

// 撤回退货出库单API
export function recallRetGoodsApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_ret/withdrawal",
    method: "post",
    data,
  });
}

// 作废退货出库单API
export function voidRetGoodsApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_ret/nullify",
    method: "post",
    data,
  });
}

// 删除退货出库单API
export function delRetGoodsApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_ret/delete",
    method: "post",
    data,
  });
}

// 驳回退货出库单API
export function rejectRetGoodsApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_ret/reject",
    method: "post",
    data,
  });
}

// 通过退货出库单API
export function approveRetGoodsApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/warehouse_ret/approve",
    method: "post",
    data,
  });
}
