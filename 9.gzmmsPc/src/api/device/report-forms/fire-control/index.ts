import { AxiosPromise, ResponseType } from "axios";
import request from "@/utils/request";

/* 点巡检报表-消防月报-列表*/
export function getFireControlListApi(data: {}): AxiosPromise {
  return request({
    url: "/mro/PointCheck/safeReport",
    method: "post",
    data,
  });
}

/* 点巡检报表-消防月报-导出*/
export function exportSaleReportDataApi(data: {}): AxiosPromise {
  return request({
    url: "/mro/Post/exportSaleReportData",
    method: "post",
    data,
  });
}
