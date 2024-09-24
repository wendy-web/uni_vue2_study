import { AxiosPromise } from "axios";
import request from "@/utils/request";

/** 蒸汽表采集配置-列表Api */
export function getSteamMeterListApi(data: {}): AxiosPromise {
  return request({
    url: "/emis/steam_meter_config/list",
    method: "post",
    data,
  });
}

/** 蒸汽表采集配置-创建Api */
export function steamMeterAddApi(data: {}): AxiosPromise {
  return request({
    url: "/emis/steam_meter_config/create",
    method: "post",
    data,
  });
}

/** 蒸汽表采集配置-编辑Api */
export function steamMeterEditApi(data: {}): AxiosPromise {
  return request({
    url: "/emis/steam_meter_config/edit",
    method: "post",
    data,
  });
}

/** 蒸汽表采集配置-读数明细Api */
export function steamMeterReadDetailsApi(data: {}): AxiosPromise {
  return request({
    url: "/emis/steam_meter_config/readDetails",
    method: "post",
    data,
  });
}
