import { AxiosPromise } from "axios";
import request from "@/utils/request";

/** 电表抄表记录-列表Api */
export function getElectricMeterReadListApi(data: {}): AxiosPromise {
  return request({
    url: "/emis/Meter/getRecordList",
    method: "post",
    data,
  });
}

/** 电表抄表记录-保存(新建/编辑)Api */
export function ElectricMeterReadSaveApi(data: {}): AxiosPromise {
  return request({
    url: "/emis/Post/saveRecord",
    method: "post",
    data,
  });
}

/** 水表抄表记录-删除Api */
export function electricMeterReadDelApi(data: {}): AxiosPromise {
  return request({
    url: "/emis/Meter/deleteRecord",
    method: "post",
    data,
  });
}
