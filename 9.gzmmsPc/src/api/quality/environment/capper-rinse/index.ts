/* 灌装封口机清洗记录-列表页面 */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

// 灌装封口机清洗记录-列表API
export function getCapperRinseListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/fill_seal_machine_clean_order/list",
    method: "post",
    data,
  });
}

// 灌装封口机清洗记录-详情API
export function capperRinseDetailApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/fill_seal_machine_clean_order/detail",
    method: "post",
    data,
  });
}

/** 灌装封口机清洗记录-新建数据api */
export function capperRinseAddApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/fill_seal_machine_clean_order/create",
    method: "post",
    data,
  });
}

/** 灌装封口机清洗记录-编辑数据api */
export function capperRinseEditApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/fill_seal_machine_clean_order/edit",
    method: "post",
    data,
  });
}

/** 灌装封口机清洗记录-驳回api */
export function capperRinseRejectApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/fill_seal_machine_clean_order/reject",
    method: "post",
    data,
  });
}

/** 灌装封口机清洗记录-审批通过api */
export function capperRinseApproveApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/fill_seal_machine_clean_order/approve",
    method: "post",
    data,
  });
}

/** 灌装封口机清洗记录-反审api */
export function capperRinseReverseApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/fill_seal_machine_clean_order/countertrial",
    method: "post",
    data,
  });
}

/** 灌装封口机清洗记录-提审签字提交api */
export function capperRinseSubmitApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/fill_seal_machine_clean_order/review",
    method: "post",
    data,
  });
}

/** 灌装封口机清洗记录-删除api */
export function capperRinseDelApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/fill_seal_machine_clean_order/delete",
    method: "post",
    data,
  });
}

/** 灌装封口机清洗记录-撤回api */
export function capperRinseRecallApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/fill_seal_machine_clean_order/withdrawal",
    method: "post",
    data,
  });
}

/** 灌装封口机清洗记录-生成报告api */
export function capperRinseReportApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/fill_seal_machine_clean_order/makeReport",
    method: "post",
    data,
  });
}
