import { AxiosPromise, ResponseType } from "axios";
import request from "@/utils/request";
import { ProductInDetailData, ProductInListData } from "./types";

/** 入库管理列表 */
export function getProductInListApi(data: {}): AxiosPromise<ProductInListData> {
  return request({
    url: "/apios/product_in/list",
    method: "post",
    data,
  });
}

/** 入库管理-详情 */
export function productInDetailApi(data: {}): AxiosPromise<ProductInDetailData> {
  return request({
    url: "/apios/product_in/details",
    method: "post",
    data,
  });
}

/** 入库管理-审批通过 */
export function productInApproveApi(data: {}): AxiosPromise {
  return request({
    url: "/apios/product_in/approve",
    method: "post",
    data,
  });
}

/** 入库管理-提审 */
export function productInSubmitApi(data: {}): AxiosPromise {
  return request({
    url: "/apios/product_in/review",
    method: "post",
    data,
  });
}

/** 入库管理-编辑 */
export function productInEditApi(data: {}): AxiosPromise {
  return request({
    url: "/apios/product_in/edit",
    method: "post",
    data,
  });
}

/** 入库管理-新建 */
export function productInAddApi(data: {}): AxiosPromise {
  return request({
    url: "/apios/product_in/create",
    method: "post",
    data,
  });
}

/** 入库管理-删除 */
export function productInDelApi(data: {}): AxiosPromise {
  return request({
    url: "/apios/product_in/delete",
    method: "post",
    data,
  });
}

/** 库存工厂编码获取库位信息 */
export function getWsCodeMap(data: {}): AxiosPromise {
  return request({
    url: "/apios/Post/getWsCodeMap",
    method: "post",
    data,
  });
}
/** 库存手动入库---添加 */
export function handManualCreate(data: {}): AxiosPromise {
  return request({
    url: "/apios/product_in/manualCreate",
    method: "post",
    data,
  });
}
/** 库存手动入库---获取编辑回显信息 */
export function getManualEdit(data: {}): AxiosPromise {
  return request({
    url: "/apios/product_in/getManualEdit",
    method: "post",
    data,
  });
}
/** 库存手动入库---编辑 */
export function manualEdit(data: {}): AxiosPromise {
  return request({
    url: "/apios/product_in/manualEdit",
    method: "post",
    data,
  });
}
