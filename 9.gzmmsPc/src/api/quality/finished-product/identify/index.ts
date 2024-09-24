/* 成品标签标识报告API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";
import type { IdentifyDataType } from "./types";

/** 成品标签标识-列表数据api */
export function getIdentifyListApi(data: {}): AxiosPromise<IdentifyDataType> {
  return request({
    url: "/qlty/product_label_identify_order/list",
    method: "post",
    data,
  });
}

/** 成品标签标识-详情数据api */
export function getIdentifyDetailApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_label_identify_order/detail",
    method: "post",
    data,
  });
}

/** 成品标签标识-新建数据api */
export function identifyAddApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_label_identify_order/create",
    method: "post",
    data,
  });
}

/** 成品标签标识-编辑数据api */
export function identifyEditApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_label_identify_order/edit",
    method: "post",
    data,
  });
}

/** 成品标签标识-驳回api */
export function identifyRejectApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_label_identify_order/reject",
    method: "post",
    data,
  });
}

/** 成品标签标识-审批通过api */
export function identifyApproveApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_label_identify_order/approve",
    method: "post",
    data,
  });
}

/** 成品标签标识-反审api */
export function identifyReverseApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_label_identify_order/countertrial",
    method: "post",
    data,
  });
}

/** 成品标签标识-提审签字提交api */
export function identifySubmitApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_label_identify_order/review",
    method: "post",
    data,
  });
}

/** 成品标签标识-删除api */
export function identifyDelApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_label_identify_order/delete",
    method: "post",
    data,
  });
}

/** 成品标签标识-撤回api */
export function identifyRecallApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_label_identify_order/withdrawal",
    method: "post",
    data,
  });
}

/** 成品标签标识-生成报告api */
export function identifyReportApi(data: {id:number}): AxiosPromise {
  return request({
    url: "/qlty/product_label_identify_order/makeReport",
    method: "post",
    data,
  });
}
