/* 成品检验报告API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

/** 列表  */
export function getListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Endproduct/getList",
    method: "post",
    data,
  });
}
/** 删除   */
export function deleteOrderApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Endproduct/deleteOrder",
    method: "post",
    data,
  });
}
/** 撤回 */
export function revokeOrderApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Endproduct/revokeOrder",
    method: "post",
    data,
  });
}
/** 生成报告 */
export function makeReportApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Endproduct/makeReport",
    method: "post",
    data,
  });
}
/** 反审核 */
export function countertrialApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Endproduct/countertrial",
    method: "post",
    data,
  });
}

/** 审核通过 */
export function finishOrderApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Endproduct/finishOrder",
    method: "post",
    data,
  });
}

/** 详情接口 */
export function getInfoApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Endproduct/getInfo",
    method: "post",
    data,
  });
}

/** 审核不通过  */
export function rejectOrderApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Endproduct/rejectOrder",
    method: "post",
    data,
  });
}

/** 创建 编辑 提审  */
export function createOrderApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Endproduct/saveOrder",
    method: "post",
    data,
  });
}

/** 提审  */
export function reviewrderApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Endproduct/commitAcceptOrder",
    method: "post",
    data,
  });
}

/** 根据批次获取检测信息  */
export function submitOrderApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Post/getEndProductForBatch",
    method: "post",
    data,
  });
}