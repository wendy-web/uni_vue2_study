import { AxiosPromise, ResponseType } from "axios";
import request from "@/utils/request";

/**  月报表列表 */
export function getMonthlyListApi(data: {}): AxiosPromise {
  return request({
    url: "/emis/energy_report/list",
    method: "post",
    data,
  });
}

/**  月报表导出 */
export function monthlyExportApi(data: {}, responseType: ResponseType = "json"): AxiosPromise {
  return request({
    url: "/emis/energy_report/export",
    method: "post",
    data,
    responseType
  });
}

/**  月报表统计图 */
export function monthlyChartApi(data: {}): AxiosPromise {
  return request({
    url: "/emis/energy_report/statisticChart",
    method: "post",
    data,
  });
}
