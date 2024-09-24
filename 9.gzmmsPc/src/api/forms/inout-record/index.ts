import request from "@/utils/request";
import { AxiosPromise, ResponseType } from "axios";
import type { ISearchQuery, IExportQuery, InoutList } from "./types";

// 出入库明细报表
export function getInoutRecordApi(data: ISearchQuery): AxiosPromise<InoutList> {
  return request({
    url: "/apios/Inventory/detailReport",
    method: "post",
    data: data,
  });
}

// 出入库明细导出
export function getExportRecordApi(
  data: IExportQuery,
  responseType: ResponseType = "json",
): AxiosPromise<any> {
  return request({
    url: "/apios/Inventory/detailExport",
    method: "post",
    data,
    responseType,
  });
}
