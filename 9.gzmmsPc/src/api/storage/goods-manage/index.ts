import { AxiosPromise, ResponseType } from "axios";
import request from "@/utils/request";
import { IAddGoods, IGoods, IGoodsDetail, IGoodsInfo, IGoodsItem, exportQueryType } from "./types";

/* 货品管理页面 */

// 获取货品列表API
export function getGoodsListApi(data: IGoods): AxiosPromise<IGoodsInfo> {
  return request({
    url: "/apios/goods/list",
    method: "post",
    data,
  });
}

// 添加货品API
export function addGoodsApi(data: IAddGoods): AxiosPromise<IGoodsItem> {
  return request({
    url: "/apios/goods/create",
    method: "post",
    data,
  });
}
// 删除货品API
export function delGoodsApi(data: { id: number }): AxiosPromise<IGoodsInfo> {
  return request({
    url: "/apios/goods/del",
    method: "post",
    data,
  });
}

// 编辑货品API
export function editGoodsApi(data: IAddGoods): AxiosPromise<IGoodsInfo> {
  return request({
    url: "/apios/goods/edit",
    method: "post",
    data,
  });
}

// 导入货品API
export function importGoodsApi(file: any): AxiosPromise<any> {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/apios/goods/goodsImport",
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// 货品明细导出
export function goodsExportApi(
  data: exportQueryType,
  responseType: ResponseType = "json",
): AxiosPromise<any> {
  return request({
    url: "/apios/goods/excle",
    method: "post",
    data,
    responseType,
  });
}

/* 货品详情 */
export function goodsDetailApi(data: { id: number }): AxiosPromise<IGoodsDetail> {
  return request({
    url: "/apios/goods/detail",
    method: "post",
    data,
  });
}

/** 获取条码信息 */
export function getBarcodeInfoApi(data: { barcode: string }): AxiosPromise<IGoodsDetail> {
  return request({
    url: "/apios/goods/getGood",
    method: "post",
    data,
  });
}

/** 设置拆零,调用编辑接口前调用 */
export function setSplitApi(data: {
  parent_id: number;
  child_id: number;
  quantity: string;
}): AxiosPromise<any> {
  return request({
    url: "/apios/goods/split",
    method: "post",
    data,
  });
}

/**
 * @example 启用/停用货品
 * @param data  两个属性{goods_id:商品id, is_stop: 1启用 0停用}
 */
export function setGoodsStatusApi(data: { goods_id: number; is_stop: number }): AxiosPromise {
  return request({
    url: "/apios/goods/stopUsing",
    method: "post",
    data,
    dialogParams: true,
  });
}

/**
 * @example 货品操作日志
 * @param data  两个属性{goods_id:商品id,}
 */
export function getGoodsLogApi(data: { goods_id: number }): AxiosPromise {
  return request({
    url: "/apios/post/logList",
    method: "post",
    data,
  });
}
