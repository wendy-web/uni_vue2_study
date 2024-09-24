import { AxiosPromise } from "axios";
import request from "@/utils/request";
import type { MeterRecoedDataType } from "./types";

// 点巡检抄表记录-列表
export function getMeterRecordListApi(data: {}): AxiosPromise<MeterRecoedDataType> {
  return request({
    url: "/mro/energy_meter/list",
    method: "post",
    data,
  });
}

// 点巡检抄表记录-详情
export function getMeterRecordDetailApi(data: {}): AxiosPromise {
  return request({
    url: "/mro/energy_meter/details",
    method: "post",
    data,
  });
}

// 点巡检抄表记录-编辑
export function getMeterRecordEditApi(data: {}): AxiosPromise {
  return request({
    url: "/mro/energy_meter/edit",
    method: "post",
    data,
  });
}

// 点巡检抄表记录-创建
export function getMeterRecordAddApi(data: {}): AxiosPromise {
  return request({
    url: "/mro/energy_meter/create",
    method: "post",
    data,
  });
}

// 点巡检抄表记录-删除
export function getMeterRecordDelApi(data: {}): AxiosPromise {
  return request({
    url: "/mro/energy_meter/del",
    method: "post",
    data,
  });
}
