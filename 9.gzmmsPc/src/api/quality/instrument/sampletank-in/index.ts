/* 标准样罐入库记录API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

/** 标准样罐入库记录-列表数据api */
export function getSampletankInListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Samplestock/getList",
    method: "post",
    data,
  });
}

/** 标准样罐入库记录-删除api */
export function sampletankInDelApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Samplestock/deleteOrder",
    method: "post",
    data,
  });
}

/** 标准样罐入库记录-创建/编辑/提审api */
export function sampletankInSaveApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Samplestock/saveOrder",
    method: "post",
    data,
  });
}

/** 标准样罐入库记录-提交审核api */
export function sampletankInSubmitApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Samplestock/commitAcceptOrder",
    method: "post",
    data,
  });
}

/** 标准样罐入库记录-撤回api */
export function sampletankInRecallApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Samplestock/revokeOrder",
    method: "post",
    data,
  });
}

/** 标准样罐入库记录-驳回api */
export function sampletankInRejectApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Samplestock/rejectOrder",
    method: "post",
    data,
  });
}

/** 标准样罐入库记录-审核通过api */
export function sampletankInApproveApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Samplestock/finishOrder",
    method: "post",
    data,
  });
}

/** 标准样罐入库记录-反审api */
export function sampletankInReverseApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Samplestock/countertrial",
    method: "post",
    data,
  });
}

/** 标准样罐入库记录-报告api */
export function sampletankInReportApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Samplestock/makeReport",
    method: "post",
    data,
  });
}

