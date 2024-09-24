import { AxiosPromise } from "axios";
import request from "@/utils/request";

/** 水表采集配置-列表Api */
export function getWaterMeterListApi(data: {}): AxiosPromise {
  return request({
    url: "/emis/water_meter_config/list",
    method: "post",
    data,
  });
}

/** 水表采集配置-创建Api */
export function waterMeterAddApi(data: {}): AxiosPromise {
  return request({
    url: "/emis/water_meter_config/create",
    method: "post",
    data,
  });
}

/** 水表采集配置-编辑Api */
export function waterMeterEditApi(data: {}): AxiosPromise {
  return request({
    url: "/emis/water_meter_config/edit",
    method: "post",
    data,
  });
}

/** 水表采集配置-读数明细Api */
export function waterMeterReadDetailsApi(data: {}): AxiosPromise {
  return request({
    url: "/emis/water_meter_config/readDetails",
    method: "post",
    data,
  });
}
