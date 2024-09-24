/* 空罐进货检验报告API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";
import type { CansStockDataType } from "./types";

/** 空罐进货检验报告-列表数据api */
export function getCansStockListApi(data: {}): AxiosPromise<CansStockDataType> {
  return request({
    url: "/qlty/empty_purchase_order/list",
    method: "post",
    data,
  });
}

/** 空罐进货检验报告-详情数据api */
export function getCansStockDetailApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/empty_purchase_order/detail",
    method: "post",
    data,
  });
}

/** 空罐进货检验报告-新建数据api */
export function cansStockAddApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/empty_purchase_order/create",
    method: "post",
    data,
  });
}

/** 空罐进货检验报告-编辑数据api */
export function cansStockEditApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/empty_purchase_order/edit",
    method: "post",
    data,
  });
}

/** 空罐进货检验报告-提审签字提交api  */
export function cansStockSubmitApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/empty_purchase_order/review",
    method: "post",
    data,
  });
}

/** 空罐进货检验报告-撤回api */
export function cansStockRecallApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/empty_purchase_order/withdrawal",
    method: "post",
    data,
  });
}

/** 空罐进货检验报告-反审api */
export function cansStockReverseApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/empty_purchase_order/countertrial",
    method: "post",
    data,
  });
}
/** 空罐进货检验报告-删除api */
export function cansStockDelApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/empty_purchase_order/delete",
    method: "post",
    data,
  });
}

/** 空罐进货检验报告-审批通过api */
export function cansStockApproveApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/empty_purchase_order/approve",
    method: "post",
    data,
  });
}

/** 空罐进货检验报告-审批驳回api */
export function cansStockRejectApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/empty_purchase_order/reject",
    method: "post",
    data,
  });
}

/** 空罐进货检验报告-生成报告api */
export function cansStockReportApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/empty_purchase_order/makeReport",
    method: "post",
    data,
  });
}

/** 空罐进货检验报告-动态删除还原清单数据（空罐进货检测）api */
export function cansStockDelSelectApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/post/delSelectInnerCoating",
    method: "post",
    data,
  });
}
