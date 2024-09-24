import { AxiosPromise, ResponseType } from "axios";
import request from "@/utils/request";

/**库存类型下拉列表  */
export type stockTypeListType = {
  name: string;
  key: number;
};


/**库存工厂编码下拉列表数据类型  */
export type FactoryCodeListType = {
  factory_code: string;
  factory_name: string;
  id: number;
};

/** 库存工厂编码下拉列表数据类型  */
export type WsCodeDropListType = {
  ws_code: string;
  ws_code_name: string;
  id: number;
};

/** 存放库位下拉列表数据类型  */
export function getFactoryCodeDropApi(data?: {
  keyword?: string;
}): AxiosPromise<FactoryCodeListType[]> {
  return request({
    url: "/apios/post/getFactoryCodeMap",
    method: "post",
    data,
  });
}

/** 物料信息（物料编码）下拉列表  */
export function getWlCodeDropApi(data?: { keyword?: string; type?: number }): AxiosPromise {
  return request({
    url: "/apios/post/wlCodeDrop",
    method: "post",
    data,
  });
}

/** 获取存放库位下拉列表 */
export function getWsCodeDropApi(data?: { keyword?: string }): AxiosPromise<WsCodeDropListType[]> {
  return request({
    url: "/apios/post/wsCodeDrop",
    method: "post",
    data,
  });
}
