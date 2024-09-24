/* CIP灌装间卫生检查表-列表页面 */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

// CIP灌装间卫生-列表API
export function getCipHygieneListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Envcheck/getCipList",
    method: "post",
    data,
  });
}

// CIP灌装间卫生-详情API
export function cipHygieneDetailApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Envcheck/getCipInfo",
    method: "post",
    data,
  });
}

// CIP灌装间卫生-创建API
export function cipHygieneAddApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Envcheck/saveCip",
    method: "post",
    data,
  });
}

// CIP灌装间卫生-删除API
export function cipHygieneDelApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Envcheck/delCip",
    method: "post",
    data,
  });
}

// CIP灌装间卫生-反审API
export function cipHygieneReverseApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Envcheck/backCip",
    method: "post",
    data,
  });
}

// CIP灌装间卫生-签字确认API
export function cipHygieneConfirmApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Envcheck/confirmCip",
    method: "post",
    data,
  });
}

// CIP灌装间卫生-执行检查API
export function cipHygieneExecuteApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Envcheck/checkCip",
    method: "post",
    data,
  });
}

// CIP灌装间卫生-导出API
export function cipHygieneExportApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Envcheck/cipExport",
    method: "post",
    data,
  });
}

