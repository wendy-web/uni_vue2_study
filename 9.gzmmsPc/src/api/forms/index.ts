import { AxiosPromise } from "axios";
import request from "@/utils/request";
import { IStockList, IWarehouseData, IsearchQuery } from "./types";

// 货品库存列表
export function getGoodsStockApi(data: IsearchQuery): AxiosPromise<any> {
  return request({
    url: "/apios/report_form/goodsStock",
    method: "post",
    data: data,
  });
}

// 新的货品库存列表接口
export function getStockApi(data: any): AxiosPromise<IStockList> {
  return request({
    url: "/apios/inventory/getstock",
    method: "post",
    data: data,
  });
}

// 获取仓库列表
export function getWarehouseApi(): AxiosPromise<IWarehouseData[]> {
  return request({
    url: "/apios/get/getwarehouse",
    method: "get",
  });
}

// 设置库存预警接口
export function setStockWarningApi(data: {
  ids: number[];
  stock_warning_qty: number;
}): AxiosPromise {
  return request({
    url: "/apios/inventory/setStockWarning",
    method: "post",
    data,
  });
}

// 设置订货预警数量接口
export function setOrderWarningApi(data: {
  ids: number[];
  goods_warning_qty: number;
}): AxiosPromise {
  return request({
    url: "/apios/inventory/setGoodsWarningQty",
    method: "post",
    data,
  });
}
