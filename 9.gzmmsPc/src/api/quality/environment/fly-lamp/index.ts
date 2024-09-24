/* 生产灭蝇灯检查记录-列表页面 */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

// 生产灭蝇灯检查记录-列表API
export function getFlyLampListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Envcheck/getZapperList",
    method: "post",
    data,
  });
}

// 生产灭蝇灯检查记录-详情API
export function flyLampDetailApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Envcheck/getZapperInfo",
    method: "post",
    data,
  });
}

// 生产灭蝇灯检查记录-创建API
export function flyLampAddApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Envcheck/saveZapper",
    method: "post",
    data,
  });
}

// 生产灭蝇灯检查记录-删除API
export function flyLampDelApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Envcheck/delZapper",
    method: "post",
    data,
  });
}

// 生产灭蝇灯检查记录-反审API
export function flyLampReverseApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Envcheck/backZapper",
    method: "post",
    data,
  });
}

// 生产灭蝇灯检查记录-签字确认API
export function flyLampConfirmApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Envcheck/confirmZapper",
    method: "post",
    data,
  });
}

// 生产灭蝇灯检查记录-执行检查API
export function flyLampExecuteApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Envcheck/checkZapper",
    method: "post",
    data,
  });
}

// 生产灭蝇灯检查记录-导出API
export function flyLampExportApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Envcheck/ZapperExport",
    method: "post",
    data,
  });
}
