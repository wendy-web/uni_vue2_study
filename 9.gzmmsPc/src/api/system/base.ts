import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { IDeptAdd, ICate, IDept } from "./types";

// 基础设置
/* 货品分类新增 */
export function addGoodsCateApi(data: ICate): AxiosPromise {
  return request({
    url: "/apios/goods/classadd",
    method: "post",
    data: data,
  });
}

// 货品分类修改
export function editGoodsCateApi(data: ICate): AxiosPromise {
  return request({
    url: "/apios/goods/classedit",
    method: "post",
    data: data,
  });
}
// 货品分类删除
export function delGoodsCateApi(data: ICate): AxiosPromise {
  return request({
    url: "/apios/goods/classdel",
    method: "post",
    data: data,
  });
}

/*  仓库新增 */
export function addStorageApi(data: ICate): AxiosPromise {
  return request({
    url: "/apios/warehouse/classadd",
    method: "post",
    data: data,
  });
}
// 仓库修改
export function editStorageApi(data: ICate): AxiosPromise {
  return request({
    url: "/apios/warehouse/classedit",
    method: "post",
    data: data,
  });
}
// 仓库删除
export function delStorageApi(data: ICate): AxiosPromise {
  return request({
    url: "/apios/warehouse/classdel",
    method: "post",
    data: data,
  });
}

/*  计量单位新增 */
export function addUnitApi(data: ICate): AxiosPromise {
  return request({
    url: "/apios/warehouse/measureadd",
    method: "post",
    data: data,
  });
}

//  计量单位修改
export function editUnitApi(data: ICate): AxiosPromise {
  return request({
    url: "/apios/warehouse/measureedit",
    method: "post",
    data: data,
  });
}

//  计量单位删除
export function delUnitApi(data: ICate): AxiosPromise {
  return request({
    url: "/apios/warehouse/measuredel",
    method: "post",
    data: data,
  });
}

/*  部门新增 */
export function addDeptApi(data: IDept): AxiosPromise<IDeptAdd> {
  return request({
    url: "/apios/dept/add",
    method: "post",
    data: data,
  });
}
// 部门编辑
export function editDeptApi(data: IDept): AxiosPromise {
  return request({
    url: "/apios/dept/edit",
    method: "post",
    data: data,
  });
}
// 部门删除
export function delDeptApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/dept/del",
    method: "post",
    data: data,
  });
}

/*  地点新增 */
export function addPlaceApi(data: { pid: number; place_name: string }): AxiosPromise {
  return request({
    url: "/apios/place/add",
    method: "post",
    data: data,
  });
}

// 地点编辑
export function editPlaceApi(data: { id: number; place_name: string }): AxiosPromise {
  return request({
    url: "/apios/place/edit",
    method: "post",
    data: data,
  });
}

// 部门删除
export function delPlaceApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/place/delete",
    method: "post",
    data: data,
  });
}
