/* 空罐照相设备验证表-列表页面 */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

// 空罐照相设备验证表-列表API
export function getCansCameraListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/empty_can_photo_order/list",
    method: "post",
    data,
  });
}

// 空罐照相设备验证表-详情API
export function cansCameraDetailApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/empty_can_photo_order/detail",
    method: "post",
    data,
  });
}

/** 空罐照相设备验证表-新建数据api */
export function cansCameraAddApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/empty_can_photo_order/create",
    method: "post",
    data,
  });
}

/** 空罐照相设备验证表-编辑数据api */
export function cansCameraEditApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/empty_can_photo_order/edit",
    method: "post",
    data,
  });
}

/** 空罐照相设备验证表-驳回api */
export function cansCameraRejectApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/empty_can_photo_order/reject",
    method: "post",
    data,
  });
}

/** 空罐照相设备验证表-审批通过api */
export function cansCameraApproveApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/empty_can_photo_order/approve",
    method: "post",
    data,
  });
}

/** 空罐照相设备验证表-反审api */
export function cansCameraReverseApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/empty_can_photo_order/countertrial",
    method: "post",
    data,
  });
}

/** 空罐照相设备验证表-提审签字提交api */
export function cansCameraSubmitApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/empty_can_photo_order/review",
    method: "post",
    data,
  });
}

/** 空罐照相设备验证表-删除api */
export function cansCameraDelApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/empty_can_photo_order/delete",
    method: "post",
    data,
  });
}

/** 空罐照相设备验证表-撤回api */
export function cansCameraRecallApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/empty_can_photo_order/withdrawal",
    method: "post",
    data,
  });
}

/** 空罐照相设备验证表-生成报告api */
export function cansCameraReportApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/empty_can_photo_order/makeReport",
    method: "post",
    data,
  });
}

/** 空罐照相设备验证表-获取样罐图片信息api */
export function getSampleTankImgApi(): AxiosPromise {
  return request({
    url: "/qlty/post/sampleTankImg",
    method: "post",
  });
}
