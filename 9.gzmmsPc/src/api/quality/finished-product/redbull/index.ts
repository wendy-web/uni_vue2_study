/* 红牛成品检验结果API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";
import type { RedbullDataType, RedbullDetailDataType } from "./types";

/** 红牛成品检验-列表数据api */
export function getProductRedbullListApi(data: {}): AxiosPromise<RedbullDataType> {
  return request({
    url: "/qlty/red_bull_product_order/list",
    method: "post",
    data,
  });
}

/** 红牛成品检验-详情数据api */
export function getProductRedbullDetailApi(data: {}): AxiosPromise<RedbullDetailDataType> {
  return request({
    url: "/qlty/red_bull_product_order/detail",
    method: "post",
    data,
  });
}

/** 红牛成品检验-新建数据api */
export function productRedbullAddApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/red_bull_product_order/create",
    method: "post",
    data,
  });
}

/** 红牛成品检验-编辑数据api */
export function productRedbullEditApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/red_bull_product_order/edit",
    method: "post",
    data,
  });
}

/** 红牛成品检验-驳回api */
export function productRedbullRejectApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/red_bull_product_order/reject",
    method: "post",
    data,
  });
}

/** 红牛成品检验-审批通过api */
export function productRedbullApproveApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/red_bull_product_order/approve",
    method: "post",
    data,
  });
}

/** 红牛成品检验-反审api */
export function productRedbullReverseApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/red_bull_product_order/countertrial",
    method: "post",
    data,
  });
}

/** 红牛成品检验-提审签字提交api */
export function productRedbullSubmitApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/red_bull_product_order/review",
    method: "post",
    data,
  });
}

/** 红牛成品检验-删除api */
export function productRedbullDelApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/red_bull_product_order/delete",
    method: "post",
    data,
  });
}

/** 红牛成品检验-撤回api */
export function productRedbullRecallApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/red_bull_product_order/withdrawal",
    method: "post",
    data,
  });
}

/** 红牛成品检验-生成报告api */
export function productRedbullReportApi(data: {id:number}): AxiosPromise {
  return request({
    url: "/qlty/red_bull_product_order/makeReport",
    method: "post",
    data,
  });
}
