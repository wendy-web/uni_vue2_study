import { AxiosPromise, ResponseType } from "axios";
import request from "@/utils/request";
import { getsupplierRecordList } from "./types";

// 领料单统计报表
export function statsReportApi(data: any): AxiosPromise<getsupplierRecordList> {
  return request({
    url: "/apios/warehouse_rec/statsReport",
    method: "post",
    data: data,
  });
}

// 领料单明细导出
export function statsReportExportApi(
  data: any,
  responseType: ResponseType = "json",
): AxiosPromise<any> {
  return request({
    url: "/apios/warehouse_rec/statsReportExport",
    method: "post",
    data,
    responseType,
  });
}
