/* 检查表配置-列表页面 */
import { AxiosPromise } from "axios";
import request from "@/utils/request";
import { CheckConfigListType } from "./types";

// 获取检测表配置类型
export function getPointInspectTypeApi(): AxiosPromise<SelectOpitonType[]> {
  return request({
    url: "/qlty/Post/getPointInspectType",
    method: "post",
  });
}

// 检测表配置列表API

export function getcheckConfigListApi(): AxiosPromise<CheckConfigListType[]> {
  return request({
    url: "/qlty/Pointinspect/getList",
    method: "post",
  });
}

// 新建/编辑检测表配置
export function checkConfigSaveApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Pointinspect/save",
    method: "post",
    data,
  });
}
