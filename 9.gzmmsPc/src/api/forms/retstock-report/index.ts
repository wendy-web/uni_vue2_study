import { AxiosPromise } from "axios";
import request from "@/utils/request";
import { RetstockReportData } from "./types";

// 退库清单报表-列表
export function getRetstockReportApi(data: {}): AxiosPromise {
  return request({
    url: "/apios/warehouse_inv_ret/statsReport",
    method: "post",
    data: data,
  });
}
