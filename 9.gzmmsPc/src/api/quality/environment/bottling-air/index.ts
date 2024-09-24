/* 灌装间空气沉降检测-列表页面 */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

// 灌装间空气沉降检测-列表API
export function getBottlingAirListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/fill_room_air_settling_order/list",
    method: "post",
    data,
  });
}

// 灌装间空气沉降检测-详情API
export function bottlingAirDetailApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/fill_room_air_settling_order/detail",
    method: "post",
    data,
  });
}

/** 灌装间空气沉降检测-新建数据api */
export function bottlingAirAddApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/fill_room_air_settling_order/create",
    method: "post",
    data,
  });
}

/** 灌装间空气沉降检测-编辑数据api */
export function bottlingAirEditApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/fill_room_air_settling_order/edit",
    method: "post",
    data,
  });
}

/** 灌装间空气沉降检测-驳回api */
export function bottlingAirRejectApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/fill_room_air_settling_order/reject",
    method: "post",
    data,
  });
}

/** 灌装间空气沉降检测-审批通过api */
export function bottlingAirApproveApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/fill_room_air_settling_order/approve",
    method: "post",
    data,
  });
}

/** 灌装间空气沉降检测-反审api */
export function bottlingAirReverseApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/fill_room_air_settling_order/countertrial",
    method: "post",
    data,
  });
}

/** 灌装间空气沉降检测-提审签字提交api */
export function bottlingAirSubmitApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/fill_room_air_settling_order/review",
    method: "post",
    data,
  });
}

/** 灌装间空气沉降检测-删除api */
export function bottlingAirDelApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/fill_room_air_settling_order/delete",
    method: "post",
    data,
  });
}

/** 灌装间空气沉降检测-撤回api */
export function bottlingAirRecallApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/fill_room_air_settling_order/withdrawal",
    method: "post",
    data,
  });
}

/** 灌装间空气沉降检测-生成报告api */
export function bottlingAirReportApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/qlty/fill_room_air_settling_order/makeReport",
    method: "post",
    data,
  });
}
