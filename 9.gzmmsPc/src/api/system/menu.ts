import { AxiosPromise } from "axios";
import request from "@/utils/request";
import { IMenuList } from "./types";

// 菜单设置页面获取菜单列表
export function menuListApi(data: {}): AxiosPromise<IMenuList[]> {
  return request({
    url: "/apios/role/list",
    method: "post",
    data,
  });
}

// 点击添加菜单时 获取的下拉菜单数据
export function menuDownListApi(): AxiosPromise<IMenuList[]> {
  return request({
    url: "/apios/role/listdrop",
    method: "post",
    dialogParams: true,
  });
}

// 添加菜单
export function addMenuApi(data: any): AxiosPromise<any> {
  return request({
    url: "/apios/role/listadd",
    method: "post",
    data: data,
    dialogParams: true,
  });
}

// 编辑菜单\修改菜单
export function editMenuApi(data: any): AxiosPromise<any> {
  return request({
    url: "/apios/role/listEdit",
    method: "post",
    data: data,
    dialogParams: true,
  });
}

// 删除菜单
export function delMenuApi(data: any): AxiosPromise<any> {
  return request({
    url: "/apios/role/listDel",
    method: "post",
    data: data,
    dialogParams: true,
  });
}

interface IMenuInfo {
  list: [IMenuList];
  hide: string[];
}

// 获取用户左侧菜单列表
export function getMenuListApi(): AxiosPromise<IMenuInfo> {
  return request({
    // url: "/apios/home/index",
    url: "/apios/home/getRoleList",
    method: "post",
  });
}
