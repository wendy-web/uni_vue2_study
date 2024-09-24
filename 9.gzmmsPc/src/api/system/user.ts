import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { IuserList, IuserForm } from "./types";

// 人员设置页面获取表格数据
export function getUserListApi(data: { rid?: string | number }): AxiosPromise<IuserList[]> {
  return request({
    url: "/apios/role/user",
    method: "post",
    data: data,
  });
}

// 人员设置页面 添加人员api
export function addUserApi(data: IuserForm): AxiosPromise<string> {
  return request({
    url: "/apios/role/userAdd",
    method: "post",
    data: data,
  });
}

// 人员设置页面 编辑人员api
export function editUserApi(data: IuserForm): AxiosPromise {
  return request({
    url: "/apios/role/userEdit",
    method: "post",
    data: data,
  });
}

type delType = { id: number | string };

// 人员设置页面 删除人员api
export function delUserApi(data: delType): AxiosPromise {
  return request({
    url: "/apios/role/userDel",
    method: "post",
    data: data,
  });
}
