/* 成品发货通知单API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";
import type { ProductNoticeDataType } from "./types";

/** 成品发货通知单-列表数据api */
export function getProductNoticeListApi(data: {}): AxiosPromise<ProductNoticeDataType> {
  return request({
    url: "/qlty/product_shipping_notice_order/list",
    method: "post",
    data,
  });
}

/** 成品发货通知单-详情数据api */
export function getProductNoticeDetailApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_shipping_notice_order/detail",
    method: "post",
    data,
  });
}

/** 成品发货通知单-新建数据api */
export function productNoticeAddApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_shipping_notice_order/create",
    method: "post",
    data,
  });
}

/** 成品发货通知单-编辑数据api */
export function productNoticeEditApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_shipping_notice_order/edit",
    method: "post",
    data,
  });
}

/** 成品发货通知单-驳回api */
export function productNoticeRejectApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_shipping_notice_order/reject",
    method: "post",
    data,
  });
}

/** 成品发货通知单-审批通过api */
export function productNoticApproveApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_shipping_notice_order/approve",
    method: "post",
    data,
  });
}

/** 成品发货通知单-反审api */
export function productNoticReverseApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_shipping_notice_order/countertrial",
    method: "post",
    data,
  });
}

/** 成品发货通知单-提审签字提交api */
export function productNoticSubmitApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_shipping_notice_order/review",
    method: "post",
    data,
  });
}

/** 成品发货通知单-删除api */
export function productNoticDelApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_shipping_notice_order/delete",
    method: "post",
    data,
  });
}

/** 成品发货通知单-撤回api */
export function productNoticRecallApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/product_shipping_notice_order/withdrawal",
    method: "post",
    data,
  });
}

/** 成品发货通知单-生成报告api */
export function productNoticReportApi(data: {id:number}): AxiosPromise {
  return request({
    url: "/qlty/product_shipping_notice_order/makeReport",
    method: "post",
    data,
  });
}