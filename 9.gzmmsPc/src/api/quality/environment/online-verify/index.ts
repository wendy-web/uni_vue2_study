/* 在线检测设备验证表-列表页面 */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

// 在线检测设备验证表-列表API
export function onlineVerifyListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Envcheck/getOnlineList",
    method: "post",
    data,
  });
}

// 在线检测设备验证表-详情API
export function onlineVerifyDetailApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Envcheck/getOnlineInfo",
    method: "post",
    data,
  });
}

// 在线检测设备验证表-创建API
export function onlineVerifyAddApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Envcheck/saveOnline",
    method: "post",
    data,
  });
}

// 在线检测设备验证表-删除API
export function onlineVerifyDelApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Envcheck/delOnline",
    method: "post",
    data,
  });
}

// 在线检测设备验证表-反审API
export function onlineVerifyReverseApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Envcheck/backOnline",
    method: "post",
    data,
  });
}

// 在线检测设备验证表-签字确认API
export function onlineVerifyConfirmApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Envcheck/confirmOnline",
    method: "post",
    data,
  });
}

// 在线检测设备验证表-执行检查API
export function onlineVerifyExecuteApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Envcheck/checkOnline",
    method: "post",
    data,
  });
}

// 在线检测设备验证表-生成报告API
export function onlineVerifyExportApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Envcheck/onlineExport",
    method: "post",
    data,
  });
}
