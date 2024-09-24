import { AxiosPromise } from "axios";
import request from "@/utils/request";
import { AddIpType, EditIpType, IUser, IUserList, IpListType, SetIpStatusType } from "./types";

/* 账户管理页面api */

// 获取账户列表api
export function getUserListApi(data?: IUser): AxiosPromise<IUserList> {
  return request({
    url: "/apios/role/user",
    method: "post",
    data: data,
  });
}

// 添加账户api
export function addUserApi(data: any): AxiosPromise {
  return request({
    url: "/apios/role/userAdd",
    method: "post",
    data: data,
    dialogParams: true,
  });
}

// 编辑账户api
export function editUserApi(data: any): AxiosPromise {
  return request({
    url: "/apios/role/userEdit",
    method: "post",
    data: data,
    dialogParams: true,
  });
}

// 删除账户api
export function delUserApi(data: any): AxiosPromise {
  return request({
    url: "/apios/role/userDel",
    method: "post",
    data: data,
    dialogParams: true,
  });
}

// 删除账户api
export function unbindWxApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/role/unbind",
    method: "post",
    data: data,
  });
}

/** 获取已设置的ip列表 */
export function getIpListApi(data?: { page: number; size: number }): AxiosPromise<IpListType> {
  return request({
    url: "/apios/role/listIpRestrict",
    method: "post",
    data,
    dialogParams: true,
  });
}

/** 添加ip */
export function addIpApi(data: AddIpType): AxiosPromise {
  return request({
    url: "/apios/role/addIpRestrict",
    method: "post",
    data,
    dialogParams: true,
  });
}

/** 单元格编辑ip */
export function editIpApi(data: EditIpType): AxiosPromise {
  return request({
    url: "/apios/role/editIpRestrict",
    method: "post",
    data,
    dialogParams: true,
  });
}

/** 单元格删除ip */
export function delIpApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/role/delIpRestrict",
    method: "post",
    data,
    dialogParams: true,
  });
}

/** 单元格设置ip状态 */
export function setIpStatusApi(data: SetIpStatusType): AxiosPromise {
  return request({
    url: "/apios/role/setStatusIpRestrict",
    method: "post",
    data,
    dialogParams: true,
  });
}
