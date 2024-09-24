import { AxiosPromise } from "axios";
import request from "@/utils/request";
import type { LastMeterRecordType } from "./types";

/** 获取远程仪表名 */
export function getRelListApi(data: {}): AxiosPromise {
  return request({
    url: "/emis/Post/getRelList",
    method: "post",
    data,
  });
}

/** 获取仪表列表 */
export function getEqipmentListApi(data: {}): AxiosPromise {
  return request({
    url: "/emis/Post/getEqipmentSelect",
    method: "post",
    data,
  });
}

/** 通过采集表名获取设备信息 */
export function getEqipmentByRelApi(data: {}): AxiosPromise {
  return request({
    url: "/emis/Post/getEqipmentByRel",
    method: "post",
    data,
  });
}

/** 获取实时表读数 */
export function getMeterNowRecordApi(data: {}): AxiosPromise {
  return request({
    url: "/emis/Post/getMeterNowRecord",
    method: "post",
    data,
  });
}

/** 获取最近一次抄表数据 */
export function getLastMeterRecordApi(data: {}): AxiosPromise<LastMeterRecordType[]> {
  return request({
    url: "/emis/Post/getLastMeterRecord",
    method: "post",
    data,
  });
}
