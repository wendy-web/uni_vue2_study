import { AxiosPromise, ResponseType } from "axios";
import request from "@/utils/request";

/* 停机误时统计明细-列表*/
export function getShutdownlListApi(data: {}): AxiosPromise {
  return request({
    url: "/mro/repair/statsShutDownReport",
    method: "post",
    data,
  });
}

/* 停机误时统计明细-导出*/
export function exportShutdownApi(data: {}, responseType: ResponseType = "json"): AxiosPromise {
  return request({
    url: "/mro/repair/statsShutDownReportExport",
    method: "post",
    data,
    responseType,
  });
}

/* 停机误时统计明细-统计报表*/
export function getShutdownChartDataApi(data: {}): AxiosPromise {
  return request({
    url: "/mro/repair/statsShutDownStat",
    method: "post",
    data,
  });
}

/* 停机误时统计明细-获取年份下拉数据*/
export function getYearsSelectDataApi(): AxiosPromise {
  return request({
    url: "/mro/post/getYearsSelect",
    method: "post",
  });
}

/* 停机误时统计明细-获取设备名称下拉数据*/
export function getEqipmentMapApi(): AxiosPromise {
  return request({
    url: "/mro/Post/getEqipmentMap",
    method: "post",
  });
}
