/* 标签标识检验报告API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";
import type { LabelDataType, LabelDetailType } from "./types";

/** 标签标识检验报告-列表数据api */
export function getLabelListApi(data: {}): AxiosPromise<LabelDataType> {
  return request({
    url: "/qlty/label_recog_order/list",
    method: "post",
    data,
  });
}

/** 标签标识检验报告-详情数据api */
export function getLabelDetailApi(data: {}): AxiosPromise<LabelDetailType> {
  return request({
    url: "/qlty/label_recog_order/detail",
    method: "post",
    data,
  });
}

/** 标签标识检验报告-新建数据api */
export function labelAddApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/label_recog_order/create",
    method: "post",
    data,
  });
}

/** 标签标识检验报告-编辑数据api */
export function labelEditApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/label_recog_order/edit",
    method: "post",
    data,
  });
}

/** 标签标识检验报告-签字提交api */
export function labelSubmitApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/label_recog_order/review",
    method: "post",
    data,
  });
}

/** 标签标识检验报告-撤回api */
export function labelRecallApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/label_recog_order/withdrawal",
    method: "post",
    data,
  });
}

/** 标签标识检验报告-删除api */
export function labelDelApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/label_recog_order/delete",
    method: "post",
    data,
  });
}

/** 标签标识检验报告-反审api */
export function labelReverseApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/label_recog_order/countertrial",
    method: "post",
    data,
  });
}

/** 标签标识检验报告-审批通过api */
export function labelApproveApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/label_recog_order/approve",
    method: "post",
    data,
  });
}

/** 标签标识检验报告-审批驳回api */
export function labelRejectApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/label_recog_order/reject",
    method: "post",
    data,
  });
}

/** 标签标识检验报告-生成报告api */
export function labelReportApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/label_recog_order/makeReport",
    method: "post",
    data,
  });
}
