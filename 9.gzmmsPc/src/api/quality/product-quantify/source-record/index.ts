/* 定量测定原始记录Api */
import { AxiosPromise } from "axios";
import request from "@/utils/request";
import type { SourceRecordDataType, SourceRecordDetailType } from "./types";

/** 定量测定原始记录-列表数据api */
export function getSourceRecordListApi(data: {}): AxiosPromise<SourceRecordDataType> {
  return request({
    url: "/qlty/Productquantify/getList",
    method: "post",
    data,
  });
}

/** 定量测定原始记录-详情数据api */
export function getSourceRecordDetailApi(data: {}): AxiosPromise<SourceRecordDetailType> {
  return request({
    url: "/qlty/Productquantify/getInfo",
    method: "post",
    data,
  });
}

/** 定量测定原始记录-创建/编辑/提审数据api */
export function sourceRecordSaveApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Productquantify/saveOrder",
    method: "post",
    data,
  });
}

/** 定量测定原始记录-提交审核数据api */
export function sourceRecordSubmitApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Productquantify/commitAcceptOrder",
    method: "post",
    data,
  });
}

/** 定量测定原始记录-撤回数据api */
export function sourceRecordRecallApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Productquantify/revokeOrder",
    method: "post",
    data,
  });
}

/** 定量测定原始记录-驳回数据api */
export function sourceRecordRejectApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Productquantify/rejectOrder",
    method: "post",
    data,
  });
}

/** 定量测定原始记录-审批通过数据api */
export function sourceRecordApproveApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Productquantify/finishOrder",
    method: "post",
    data,
  });
}

/** 定量测定原始记录-删除数据api */
export function sourceRecordDelApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Productquantify/deleteOrder",
    method: "post",
    data,
  });
}

/** 定量测定原始记录-反审核数据api */
export function sourceRecordReverseApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Productquantify/countertrial",
    method: "post",
    data,
  });
}

/** 定量测定原始记录-生成报告api */
export function sourceRecordReportApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/qlty/Productquantify/makeReport",
    method: "post",
    data,
  });
}
