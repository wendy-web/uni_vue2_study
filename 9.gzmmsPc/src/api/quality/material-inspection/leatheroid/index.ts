/* 纸皮进货检验报告API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";
import { LeatheroidDataType, LeatheroidDetailData } from "./types";

/** 纸皮检验报告-列表数据api */
export function getLeatheroidListApi(data: {}): AxiosPromise<LeatheroidDataType> {
  return request({
    url: "/qlty/paper_restock_order/list",
    method: "post",
    data,
  });
}

/** 纸皮检验报告-详情数据api */
export function getLeatheroidDetailApi(data: { id: number }): AxiosPromise<LeatheroidDetailData> {
  return request({
    url: "/qlty/paper_restock_order/detail",
    method: "post",
    data,
  });
}

/** 纸皮检验报告-新建数据api */
export function leatheroidAddApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/paper_restock_order/create",
    method: "post",
    data,
  });
}

/** 纸皮检验报告-编辑数据api */
export function leatheroidEditApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/paper_restock_order/edit",
    method: "post",
    data,
  });
}

/** 纸皮检验报告-签字提交api */
export function leatheroidSubmitApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/paper_restock_order/review",
    method: "post",
    data,
  });
}

/** 纸皮检验报告-撤回api */
export function leatheroidRecallApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/paper_restock_order/withdrawal",
    method: "post",
    data,
  });
}

/** 纸皮检验报告-删除api */
export function leatheroidDelApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/paper_restock_order/delete",
    method: "post",
    data,
  });
}

/** 纸皮检验报告-反审api */
export function leatheroidReverseApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/paper_restock_order/countertrial",
    method: "post",
    data,
  });
}

/** 纸皮检验报告-审批通过api */
export function leatheroidApproveApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/paper_restock_order/approve",
    method: "post",
    data,
  });
}

/** 纸皮检验报告-审批驳回api */
export function leatheroidRejectApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/paper_restock_order/reject",
    method: "post",
    data,
  });
}

/** 纸皮检验报告-生成报告api */
export function leatheroidReportApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/qlty/paper_restock_order/makeReport",
    method: "post",
    data,
  });
}
