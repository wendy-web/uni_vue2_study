import { AxiosPromise } from "axios";
import request from "@/utils/request";
import { LineListType } from "./types";

// 产线列表
export function getProductLineListApi(): AxiosPromise<LineListType> {
  return request({
    url: "/mro/Basics/getProductLineList",
    method: "post",
  });
}

// 产线列表-删除
export function deleteProductLineApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/mro/Basics/deleteProductLine",
    method: "post",
    data,
  });
}

// 产线列表-更新(编辑)
export function updateProductLineApi(data: { name: string; id: number }): AxiosPromise {
  return request({
    url: "/mro/Basics/updateProductLine",
    method: "post",
    data,
  });
}

// 产线列表-新增
export function createProductLineApi(data: { name: string }): AxiosPromise {
  return request({
    url: "/mro/Basics/createProductLine",
    method: "post",
    data,
  });
}
