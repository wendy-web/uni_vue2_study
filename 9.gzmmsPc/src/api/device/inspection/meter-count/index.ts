import { AxiosPromise } from "axios";
import request from "@/utils/request";
import type { meterCountDataType,meterCountLogData } from "./types";

/* 点巡检管理-表计读数-列表*/
export function getCountListApi(data: {}): AxiosPromise<meterCountDataType> {
  return request({
    url: "/mro/Watch/getList",
    method: "post",
    data,
  });
}

/* 点巡检管理-表计读数-日志*/
export function getCountLogApi(data: {}): AxiosPromise<meterCountLogData> {
  return request({
    url: "/mro/Watch/getWatchLog",
    method: "post",
    data,
  });
}

/* 点巡检管理-表计读数-保存计数表信息*/
export function getCountSaveApi(data: {
  id?: number;
  eq_id: number;
  rel_id: number;
}): AxiosPromise {
  return request({
    url: "/mro/Watch/saveWatch",
    method: "post",
    data,
  });
}

/* 点巡检管理-表计读数-获取表计数关联关系*/
export function getCountRelationApi(): AxiosPromise {
  return request({
    url: "/mro/Post/getRelList",
    method: "post",
  });
}
