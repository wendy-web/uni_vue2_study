import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { ISupItem, ISupList, IQuery } from "./types";

/* 供应商管理页面 */

// 获取供应商列表API
export function getGoodsListApi(data: IQuery): AxiosPromise<ISupList> {
  return request({
    url: "/apios/goods/suplist",
    method: "post",
    data,
  });
}

// 新建供应商
export function addSupplierApi(data: any): AxiosPromise {
  return request({
    url: "/apios/goods/supcreate",
    method: "post",
    data,
  });
}

// 编辑供应商
export function editSupplierApi(data: any): AxiosPromise {
  return request({
    url: "/apios/goods/supEdit",
    method: "post",
    data,
  });
}

// 删除供应商
export function delSupplierApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/goods/supDel",
    method: "post",
    data,
  });
}
