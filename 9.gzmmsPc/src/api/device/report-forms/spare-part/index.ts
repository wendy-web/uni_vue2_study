import { AxiosPromise, ResponseType } from "axios";
import request from "@/utils/request";
import { StatsReportDataType } from "./types";

/* 维保备件周期报表-列表*/
export function getStatsReportListApi(data: {}): AxiosPromise<StatsReportDataType> {
  return request({
    url: "/mro/repair/statsReport",
    method: "post",
    data,
  });
}

/* 维保备件周期报表-导出*/
export function getExportpartsCycleApi(
  data: {},
  responseType: ResponseType = "json",
): AxiosPromise<any> {
  return request({
    url: "/mro/repair/statsReportExport",
    method: "post",
    data,
    responseType,
  });
}
