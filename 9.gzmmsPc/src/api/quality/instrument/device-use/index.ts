/* 仪器设备使用记录API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

/** 仪器设备使用记录-列表数据api */
export function getDeviceUseListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Instuse/getList",
    method: "post",
    data,
  });
}

/** 仪器设备使用记录-删除api */
export function deviceUseDelApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Instuse/deleteOrder",
    method: "post",
    data,
  });
}

/** 仪器设备使用记录-创建api */
export function deviceUseAddApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Instuse/saveOrder",
    method: "post",
    data,
  });
}

/** 仪器设备使用记录-确认api */
export function deviceUseConfirmApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Instuse/confirmOrder",
    method: "post",
    data,
  });
}

/** 仪器设备使用记录-编辑api */
export function deviceUseEditApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Instuse/updateOrder",
    method: "post",
    data,
  });
}


/** 仪器设备使用记录-编辑api */
export function deviceUseReportApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Instuse/makeReport",
    method: "post",
    data,
  });
}
