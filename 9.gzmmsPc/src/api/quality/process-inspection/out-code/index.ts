/* 外箱二维码信息检测表API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

/** 列表  */
export function getListApi(data: {}): AxiosPromise {
    return request({
      url: "/qlty/Boxqr/getList",
      method: "post",
      data,
    });
  }
  /** 删除   */
  export function deleteOrderApi(data: {}): AxiosPromise {
    return request({
      url: "/qlty/Boxqr/deleteOrder",
      method: "post",
      data,
    });
  }
  /** 撤回 */
  export function revokeOrderApi(data: {}): AxiosPromise {
    return request({
      url: "/qlty/Boxqr/revokeOrder",
      method: "post",
      data,
    });
  }
  /** 生成报告 */
  export function makeReportApi(data: {}): AxiosPromise {
    return request({
      url: "/qlty/Boxqr/makeReport",
      method: "post",
      data,
    });
  }
  /** 反审核 */
  export function countertrialApi(data: {}): AxiosPromise {
    return request({
      url: "/qlty/Boxqr/countertrial",
      method: "post",
      data,
    });
  }
  
  /** 审核通过 */
  export function finishOrderApi(data: {}): AxiosPromise {
    return request({
      url: "/qlty/Boxqr/finishOrder",
      method: "post",
      data,
    });
  }
  
  /** 详情接口 */
  export function getInfoApi(data: {}): AxiosPromise {
    return request({
      url: "/qlty/Boxqr/getInfo",
      method: "post",
      data,
    });
  }
  
  /** 审核不通过  */
  export function rejectOrderApi(data: {}): AxiosPromise {
    return request({
      url: "/qlty/Boxqr/rejectOrder",
      method: "post",
      data,
    });
  }
  
  /** 创建 编辑 提审  */
  export function createOrderApi(data: {}): AxiosPromise {
    return request({
      url: "/qlty/Boxqr/saveOrder",
      method: "post",
      data,
    });
  }
  
  /** 提审  */
  export function reviewrderApi(data: {}): AxiosPromise {
    return request({
      url: "/qlty/Boxqr/commitAcceptOrder",
      method: "post",
      data,
    });
  }