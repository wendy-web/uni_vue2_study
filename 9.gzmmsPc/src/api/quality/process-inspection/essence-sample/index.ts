/* 香精留样记录API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

/** 香精留样记录-列表数据api */
export function getEssenceSampleListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/essence_entering_order/sampleRetentionRecord",
    method: "post",
    data,
  });
}

/** 香精留样记录-执行销毁api */
export function essenceSampleDestroyApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/essence_entering_order/executeDestroy",
    method: "post",
    data,
  });
}

/** 香精留样记录-导出报告api */
export function essenceSampleReportApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/essence_entering_order/makeSampleReport",
    method: "post",
    data,
  });
}

/** 香精留样记录-批量执行销毁api */
export function executeSelectDestroyApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/essence_entering_order/executeSelectDestroy",
    method: "post",
    data,
  });
}
