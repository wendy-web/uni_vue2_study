/* 原材料检验配置 */
import { AxiosPromise } from "axios";
import request from "@/utils/request";
import { BaseValSetModule } from "./types";

// 获取标准值配置信息
export function getBaseValSettingApi(data: {}): AxiosPromise<BaseValSetModule.BaseValSetData[]> {
  return request({
    url: "/qlty/Post/getBaseValSetting",
    method: "post",
    data,
  });
}
// 保存标准值
export function saveBaseValSettingApi(data: {
  data: BaseValSetModule.BaseValSetParams[];
}): AxiosPromise {
  return request({
    url: "/qlty/Post/saveBaseValSetting",
    method: "post",
    data,
  });
}
