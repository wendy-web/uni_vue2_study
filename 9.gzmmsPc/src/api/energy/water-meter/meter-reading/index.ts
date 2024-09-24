import { AxiosPromise } from "axios";
import request from "@/utils/request";
import type { WaterRecordDataType } from "./types";

/** 水表抄表记录-列表Api */
export function getWaterMeterReadListApi(data: {}): AxiosPromise<WaterRecordDataType> {
  return request({
    url: "/emis/water_meter/list",
    method: "post",
    data,
  });
}

/** 水表抄表记录-创建Api */
export function waterMeterReadAddApi(data: {}): AxiosPromise {
  return request({
    url: "/emis/water_meter/create",
    method: "post",
    data,
  });
}

/** 水表抄表记录-编辑Api */
export function waterMeterReadEditApi(data: {}): AxiosPromise {
  return request({
    url: "/emis/water_meter/edit",
    method: "post",
    data,
  });
}

/** 水表抄表记录-详情Api */
export function waterMeterReadDetailApi(data: {}): AxiosPromise {
  return request({
    url: "/emis/water_meter/details",
    method: "post",
    data,
  });
}

/** 水表抄表记录-删除Api */
export function waterMeterReadDelApi(data: {}): AxiosPromise {
  return request({
    url: "/emis/water_meter/del",
    method: "post",
    data,
  });
}
