/* 标准样罐领用记录API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

/** 标准样罐领用记录-列表数据api */
export function getSampletankReceiveListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Isuse/getList",
    method: "post",
    data,
  });
}

/** 标准样罐领用记录-删除api */
export function sampletankReceiveDelApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Isuse/deleteOrder",
    method: "post",
    data,
  });
}

/** 标准样罐领用记录-创建api */
export function sampletankReceiveAddApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Isuse/saveOrder",
    method: "post",
    data,
  });
}

/** 标准样罐领用记录-确认api */
export function sampletankReceiveConfirmApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Isuse/confirmOrder",
    method: "post",
    data,
  });
}

/** 标准样罐领用记录-编辑api */
export function sampletankReceiveEditApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Isuse/updateOrder",
    method: "post",
    data,
  });
}

/** 标准样罐领用记录-执行销毁api */
export function sampletankReceiveDestroyApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Isuse/destroyOrder",
    method: "post",
    data,
  });
}

/** 标准样罐领用记录-导出报告api */
export function sampletankReceiveReportApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Isuse/makeReport",
    method: "post",
    data,
  });
}
