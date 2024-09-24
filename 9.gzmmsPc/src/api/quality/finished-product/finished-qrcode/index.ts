/* 成品二维码确认单API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";
import type { FinishedQrcodeDataType, FinishedQrcodeDetailType } from "./types";

/** 成品二维码确认单-列表数据api */
export function getFinishedQrcodeListApi(data: {}): AxiosPromise<FinishedQrcodeDataType> {
  return request({
    url: "/qlty/product_qr_code_confirm_order/list",
    method: "post",
    data,
  });
}

/** 成品二维码确认单-详情数据api */
export function getFinishedQrcodeDetailApi(data: {}): AxiosPromise<FinishedQrcodeDetailType> {
  return request({
    url: "/qlty/product_qr_code_confirm_order/detail",
    method: "post",
    data,
  });
}

/** 成品二维码确认单-新建数据api */
export function finishedQrcodeAddApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_qr_code_confirm_order/create",
    method: "post",
    data,
  });
}

/** 成品二维码确认单-编辑数据api */
export function finishedQrcodeEditApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_qr_code_confirm_order/edit",
    method: "post",
    data,
  });
}

/** 成品二维码确认单-驳回api */
export function finishedQrcodeRejectApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_qr_code_confirm_order/reject",
    method: "post",
    data,
  });
}

/** 成品二维码确认单-审批通过api */
export function finishedQrcodeApproveApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_qr_code_confirm_order/approve",
    method: "post",
    data,
  });
}

/** 成品二维码确认单-反审api */
export function finishedQrcodeReverseApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_qr_code_confirm_order/countertrial",
    method: "post",
    data,
  });
}

/** 成品二维码确认单-提审签字提交api */
export function finishedQrcodeSubmitApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_qr_code_confirm_order/review",
    method: "post",
    data,
  });
}

/** 成品二维码确认单-删除api */
export function finishedQrcodeDelApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_qr_code_confirm_order/delete",
    method: "post",
    data,
  });
}

/** 成品二维码确认单-撤回api */
export function finishedQrcodeRecallApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_qr_code_confirm_order/withdrawal",
    method: "post",
    data,
  });
}

/** 成品二维码确认单-生成报告api */
export function finishedQrcodeReportApi(data: {id:number}): AxiosPromise {
  return request({
    url: "/qlty/product_qr_code_confirm_order/makeReport",
    method: "post",
    data,
  });
}
