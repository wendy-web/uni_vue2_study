import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { IroleList } from "./types";

/* 角色设置页面 */

// 获取角色列表
export function getRoleListApi(): AxiosPromise<IroleList[]> {
  return request({
    url: "/apios/role/roleList",
    method: "post",
  });
}

// 新增角色获取下拉数据
export function getRoleDropApi(): AxiosPromise<IroleList[]> {
  return request({
    url: "/apios/role/roleAddDrop",
    method: "post",
    dialogParams: true,
  });
}
interface IaddRole {
  role_title: string;
  remark: string;
  ids: number[];
}
// 新增角色api
export function addRoleApi(data: IaddRole): AxiosPromise<any> {
  return request({
    url: "/apios/role/roleAdd",
    method: "post",
    data: data,
    dialogParams: true,
  });
}

//  编辑角色获取下拉数据
export function getEditDropApi(data: any): AxiosPromise {
  return request({
    url: "/apios/role/roleEditDrop",
    method: "post",
    data: data,
    dialogParams: true,
  });
}

// 编辑角色api
export function editRoleApi(data: any): AxiosPromise<any> {
  return request({
    url: "/apios/role/roleEdit",
    method: "post",
    data: data,
    dialogParams: true,
  });
}

// 删除角色api
export function delRoleApi(data: any): AxiosPromise<any> {
  return request({
    url: "/apios/role/roleDel",
    method: "post",
    data: data,
    dialogParams: true,
  });
}
