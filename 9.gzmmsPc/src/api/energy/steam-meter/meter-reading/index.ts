import { AxiosPromise } from "axios";
import request from "@/utils/request";

/** 蒸汽表抄表记录-列表Api */
export function getSteamMeterReadListApi(data: {}): AxiosPromise {
  return request({
    url: "/emis/steam_meter/list",
    method: "post",
    data,
  });
}

/** 蒸汽表抄表记录-创建Api */
export function steamMeterReadAddApi(data: {}): AxiosPromise {
  return request({
    url: "/emis/steam_meter/create",
    method: "post",
    data,
  });
}

/** 蒸汽表抄表记录-编辑Api */
export function steamMeterReadEditApi(data: {}): AxiosPromise {
  return request({
    url: "/emis/steam_meter/edit",
    method: "post",
    data,
  });
}

/** 蒸汽表抄表记录-详情Api */
export function steamMeterReadDetailApi(data: {}): AxiosPromise {
  return request({
    url: "/emis/steam_meter/details",
    method: "post",
    data,
  });
}

/** 蒸汽表抄表记录-删除Api */
export function steamMeterReadDelApi(data: {}): AxiosPromise {
  return request({
    url: "/emis/steam_meter/del",
    method: "post",
    data,
  });
}
