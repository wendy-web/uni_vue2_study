import { AxiosPromise } from "axios";
import request from "@/utils/request";

/** 电表采集配置-列表Api */
export function getElectricMeterListApi(data: {}): AxiosPromise {
  return request({
    url: "/emis/Meter/getList",
    method: "post",
    data,
  });
}

/** 电表采集配置-保存(新建/编辑)Api */
export function electricMeterSaveApi(data: {}): AxiosPromise {
  return request({
    url: "/emis/Meter/saveMeter",
    method: "post",
    data,
  });
}

/** 电表采集配置-读数明细Api */
export function electricMeterReadDetailsApi(data: {}): AxiosPromise {
  return request({
    url: "/emis/Meter/getMeterInfo",
    method: "post",
    data,
  });
}
