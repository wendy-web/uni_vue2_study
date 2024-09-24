import { AxiosPromise, ResponseType } from "axios";
import request from "@/utils/request";
import { BuyinRecordData, BuyinRecordQuery } from "./types";

// 采购入库单明细列表
export function getBuyinRecordApi(data: BuyinRecordQuery): AxiosPromise<BuyinRecordData> {
  return request({
    url: "/apios/warehouse_in/statsReport",
    method: "post",
    data: data,
  });
}

// 采购入库单明细列表导出
export function BuyinRecordExportApi(
  data: any,
  responseType: ResponseType = "json",
): AxiosPromise<any> {
  return request({
    url: "/apios/warehouse_in/statsReportExport",
    method: "post",
    data,
    responseType,
  });
}
