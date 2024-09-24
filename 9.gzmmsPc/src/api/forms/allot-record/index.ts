import { AxiosPromise, ResponseType } from "axios";
import request from "@/utils/request";
import type { AllotRecordDataType } from "./types";

// 调拨单明细列表
export function getAllotRecordApi(data: {}): AxiosPromise<AllotRecordDataType> {
  return request({
    url: "/apios/warehouse_tra/statsReport",
    method: "post",
    data: data,
  });
}

// 调拨单明细列表导出
export function allotRecordExportApi(
  data: any,
  responseType: ResponseType = "json",
): AxiosPromise<any> {
  return request({
    url: "/apios/warehouse_tra/statsReportExport",
    method: "post",
    data,
    responseType,
  });
}
