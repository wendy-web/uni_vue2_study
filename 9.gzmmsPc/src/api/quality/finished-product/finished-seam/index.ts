/* 成品卷封检验报告API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

/** 列表  */
export function getListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_roll_inspection_order/list",
    method: "post",
    data,
  });
}
/** 删除   */
export function deleteOrderApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_roll_inspection_order/delete",
    method: "post",
    data,
  });
}
/** 撤回 */
export function revokeOrderApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_roll_inspection_order/withdrawal",
    method: "post",
    data,
  });
}
/** 生成报告 */
export function makeReportApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_roll_inspection_order/makeReport",
    method: "post",
    data,
  });
}
/** 反审核 */
export function countertrialApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_roll_inspection_order/countertrial",
    method: "post",
    data,
  });
}

/** 审核通过 */
export function finishOrderApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_roll_inspection_order/approve",
    method: "post",
    data,
  });
}

/** 详情接口 */
export function getInfoApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_roll_inspection_order/detail",
    method: "post",
    data,
  });
}

/** 审核不通过  */
export function rejectOrderApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_roll_inspection_order/reject",
    method: "post",
    data,
  });
}

/** 创建  */
export function createOrderApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_roll_inspection_order/create",
    method: "post",
    data,
  });
}

/** 编辑  */
export function editOrderApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_roll_inspection_order/edit",
    method: "post",
    data,
  });
}
/** 提审  */
export function reviewrderApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_roll_inspection_order/review",
    method: "post",
    data,
  });
}
