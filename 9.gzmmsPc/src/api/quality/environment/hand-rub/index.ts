/* 手部涂抹实验检验-列表页面 */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

/** 列表  */
export function getListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/hand_application_order/list",
    method: "post",
    data,
  });
}

/** 撤回 */
export function revokeOrderApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/hand_application_order/withdrawal",
    method: "post",
    data,
  });
}

/** 反审 */
export function countertrialApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/hand_application_order/countertrial",
    method: "post",
    data,
  });
}

/** 审核通过（签字复核） */
export function finishOrderApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/hand_application_order/approve",
    method: "post",
    data,
  });
}

/** 驳回  */
export function rejectOrderApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/hand_application_order/reject",
    method: "post",
    data,
  });
}

/** 删除   */
export function deleteOrderApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/hand_application_order/delete",
    method: "post",
    data,
  });
}

/** 提审（签字提交）  */
export function reviewrderApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/hand_application_order/review",
    method: "post",
    data,
  });
}
/** 详情接口 */
export function getInfoApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/hand_application_order/detail",
    method: "post",
    data,
  });
}

/** 编辑  */
export function editOrderApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/hand_application_order/edit",
    method: "post",
    data,
  });
}

/** 创建  */
export function createOrderApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/hand_application_order/create",
    method: "post",
    data,
  });
}
/** 导出：勾选ids  */
export function makeReportApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/hand_application_order/export",
    method: "post",
    data,
  });
}
