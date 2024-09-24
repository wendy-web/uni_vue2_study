/* PH计校准表API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

/** 列表  */
export function getListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/ph_calibration_order/list",
    method: "post",
    data,
  });
}
/** 删除   */
export function deleteOrderApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/ph_calibration_order/delete",
    method: "post",
    data,
  });
}
/** 创建 */
export function createOrderApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/ph_calibration_order/create",
    method: "post",
    data,
  });
}
/** 生成报告 */
export function makeReportApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/ph_calibration_order/makeReport",
    method: "post",
    data,
  });
}

/** 签字确认 */
export function reviewOrderApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/ph_calibration_order/review",
    method: "post",
    data,
  });
}

/** 详情接口 */
export function getInfoApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/ph_calibration_order/detail",
    method: "post",
    data,
  });
}

/** 编辑接口 */
export function editApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/ph_calibration_order/edit",
    method: "post",
    data,
  });
}
