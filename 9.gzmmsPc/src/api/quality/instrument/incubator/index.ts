/* 恒温培养箱使用记录API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

/** 恒温培养箱使用记录-列表数据api */
export function getIncubatorListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Incubator/getList",
    method: "post",
    data,
  });
}

/** 恒温培养箱使用记录-详情数据api */
export function incubatorDetailApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Incubator/getInfo",
    method: "post",
    data,
  });
}

/** 恒温培养箱使用记录-创建/编辑/确认api */
export function incubatorSaveApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Incubator/saveOrder",
    method: "post",
    data,
  });
}

/** 恒温培养箱使用记录-列表签字确认api */
export function incubatorConfirmApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Incubator/confirmOrder",
    method: "post",
    data,
  });
}

/** 恒温培养箱使用记录-列表签字取出api */
export function incubatorOutOrderApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Incubator/outOrder",
    method: "post",
    data,
  });
}

/** 恒温培养箱使用记录-列表签字复核api */
export function incubatorRecheckOrderApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Incubator/recheckOrder",
    method: "post",
    data,
  });
}

/** 恒温培养箱使用记录-导出报告api */
export function incubatorReportApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Incubator/makeReport",
    method: "post",
    data,
  });
}
