import { AxiosPromise } from "axios";
import request from "@/utils/request";

/* 日报表列表 */
export function getDayListApi(data: {}): AxiosPromise {
  return request({
    url: "/emis/Report/makeDayReport",
    method: "post",
    data,
  });
}

/* 日报表导出 */
export function dayReportApi(data: {}): AxiosPromise {
  return request({
    url: "/emis/Report/exportDayReport",
    method: "post",
    data,
  });
}
