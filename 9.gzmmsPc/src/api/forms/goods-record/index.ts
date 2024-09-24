import { AxiosPromise, ResponseType } from "axios";
import request from "@/utils/request";
import { GoodsRecordQuery, GoodsRecordType,LabelData } from "./types";

// 货品库存明细列表
export function getGoodsRecordApi(data: GoodsRecordQuery): AxiosPromise<GoodsRecordType> {
  return request({
    url: "/apios/Inventory/stockDetails",
    method: "post",
    data: data,
  });
}

// 货品库存明细列表导出
export function goodsRecordExportApi(
  data: any,
  responseType: ResponseType = "json",
): AxiosPromise<any> {
  return request({
    url: "/apios/inventory/stockDetailsExport",
    method: "post",
    data,
    responseType,
  });
}

// 库位设置
export function setWsCodeApi(data: { ids: number[]; ws_code: string }): AxiosPromise {
  return request({
    url: "/apios/inventory/setWsCode",
    method: "post",
    data: data,
  });
}

// 货品库存明细-生成唯一标签
export function generateStocksLabelApi(data: { stock_id:number }): AxiosPromise {
  return request({
    url: "/apios/home/generateStocksLabel",
    method: "post",
    data: data,
  });
}

// 货品库存明细-查看标签
export function getStocksLabelApi(data: { stock_id:number }): AxiosPromise<LabelData> {
  return request({
    url: "/apios/home/getStocksLabel",
    method: "post",
    data: data,
  });
}