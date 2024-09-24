import { AxiosPromise } from "axios";
import request from "@/utils/request";
import { CreateEquipmentQuery, IEquipmentList, UpdateEquipmentQuery } from "./types";

// 资产类型列表
export function getEquipmentListApi(data?: { name?: string }): AxiosPromise<IEquipmentList> {
  return request({
    url: "/mro/Basics/getEquipmentList",
    method: "post",
    data,
  });
}

// 资产类型-更新
export function updateEquipmentListApi(data: UpdateEquipmentQuery): AxiosPromise {
  return request({
    url: "/mro/Basics/updateEquipmentList",
    method: "post",
    data,
  });
}

// 资产类型-添加
export function createEquipmentListApi(data: CreateEquipmentQuery): AxiosPromise {
  return request({
    url: "/mro/Basics/createEquipmentList",
    method: "post",
    data,
  });
}

// 资产类型-删除
export function deleteEquipmentListApi(data: { ids: number[] }): AxiosPromise {
  return request({
    url: "/mro/Basics/deleteEquipmentList",
    method: "post",
    data,
  });
}
