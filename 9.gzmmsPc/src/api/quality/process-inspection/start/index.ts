/* 开机及CIP检测项目API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

/** 开机确认单检验报告-列表数据api */
export function getPowerConfirmListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/power_confirm_order/list",
    method: "post",
    data,
  });
}

/** 开机确认单检验报告-新增数据api  */
export function powerConfirmAddApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/power_confirm_order/create",
    method: "post",
    data,
  });
}

/** 开机确认单检验报告-详情数据api  */
export function powerConfirmDetailApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/power_confirm_order/detail",
    method: "post",
    data,
  });
}

/** 开机确认单检验报告-新增附件api  */
export function powerConfirmFileAddApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/power_confirm_order/saveFile",
    method: "post",
    data,
  });
}

/** 开机确认单检验报告-删除附件api  */
export function powerConfirmFileDelApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/power_confirm_order/delFile",
    method: "post",
    data,
  });
}

/** 开机确认单检验报告-删除api  */
export function powerConfirmDelApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/power_confirm_order/delete",
    method: "post",
    data,
  });
}

/** 开机确认单检验报告-执行检测api  */
export function powerConfirmExecuteApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/power_confirm_order/execute",
    method: "post",
    data,
  });
}

/** 开机确认单检验报告-签字确认api  */
export function powerConfirmSignatureApi(data: {
  id: number;
  signature: string;
  type: number;
}): AxiosPromise {
  return request({
    // url: "/qlty/power_confirm_order/review",
    url: "/qlty/post/powerConfirmReview",
    method: "post",
    data,
  });
}

/** 开机确认单检验报告-生成报告api */
export function powerConfirmReportApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/qlty/power_confirm_order/makeReport",
    method: "post",
    data,
  });
}
