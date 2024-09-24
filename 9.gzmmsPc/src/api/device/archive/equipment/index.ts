import { AxiosPromise, ResponseType } from "axios";
import { EquipmentModule } from "@/api/device/common/types";
import request from "@/utils/request";
// import { EquipmentListType,EditDataType  } from "./types";
import { EditDataType } from "./types";

// 设备档案列表
export function getEquipmentListApi(data: {}): AxiosPromise<EquipmentModule.EquipmentListType> {
  return request({
    url: "/mro/Equipment/equipment",
    method: "post",
    data,
  });
}

// 设备档案详情
export function getEquipmentInfoApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/mro/Equipment/getEquipmentInfo",
    method: "post",
    data,
  });
}

// 设备绑定选择
export function getNoBandEquipmentListApi(data: {}): AxiosPromise {
  return request({
    url: "/mro/Equipment/getNoBandEquipmentList",
    method: "post",
    data,
  });
}

// 编辑登记设备
export function updateEquipmentApi(data: {}): AxiosPromise {
  return request({
    url: "/mro/Equipment/updateEquipment",
    method: "post",
    data,
  });
}

// 新增登记设备
export function createEquipmentApi(data: {}): AxiosPromise {
  return request({
    url: "/mro/Equipment/createEquipment",
    method: "post",
    data,
  });
}

// 根据备件ID获取备件库存
export function getIdGoodsStockApi(data: {}): AxiosPromise {
  return request({
    url: "/mro/Basics/getGoodsStock",
    method: "post",
    data,
  });
}

// 获取登记设备编辑数据
export function getEquipmentDetailsApi(data: {}): AxiosPromise<EditDataType> {
  return request({
    // url: "/mro/Equipment/getEquipmentDetails",
    url: "/mro/post/getEquipmentDetails",
    method: "post",
    data,
  });
}

// 设备附件下载
export function downloadEqFileApi(
  data: { id: number },
  responseType: ResponseType = "json",
): AxiosPromise {
  return request({
    // url: "/mro/File/downloadEqFile",
    url: "/mro/post/downloadEqFile",
    method: "post",
    data,
    responseType,
  });
}
