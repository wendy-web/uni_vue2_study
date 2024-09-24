/* 原材料使用通知单API */
import { AxiosPromise, ResponseType } from "axios";
import request from "@/utils/request";
import { UseNoticeDataType, UseNoticeDetailType } from "./types";

/** 原材料使用通知单-列表数据api */
export function getUseNoticeListApi(data: {}): AxiosPromise<UseNoticeDataType> {
  return request({
    url: "/qlty/materials_use_notice_order/list",
    method: "post",
    data,
  });
}

/** 原材料使用通知单-详情数据api */
export function getUseNoticeDetailApi(data: { id: number }): AxiosPromise<UseNoticeDetailType> {
  return request({
    url: "/qlty/materials_use_notice_order/detail",
    method: "post",
    data,
  });
}

/** 原材料使用通知单-新建数据api */
export function useNoticeAddApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/materials_use_notice_order/create",
    method: "post",
    data,
  });
}

/** 原材料使用通知单-编辑数据api */
export function useNoticeEditApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/materials_use_notice_order/edit",
    method: "post",
    data,
  });
}

/** 原材料使用通知单-提审签字提交api  */
export function useNoticeSubmitApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/materials_use_notice_order/review",
    method: "post",
    data,
  });
}

/** 原材料使用通知单-撤回api */
export function useNoticeRecallApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/qlty/materials_use_notice_order/withdrawal",
    method: "post",
    data,
  });
}

/** 原材料使用通知单-反审api */
export function useNoticeReverseApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/materials_use_notice_order/countertrial",
    method: "post",
    data,
  });
}
/** 原材料使用通知单-删除api */
export function useNoticeDelApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/qlty/materials_use_notice_order/delete",
    method: "post",
    data,
  });
}
/** 原材料使用通知单-审批驳回api */
export function useNoticeRejectApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/materials_use_notice_order/reject",
    method: "post",
    data,
  });
}

/** 原材料使用通知单-审批通过api */
export function useNoticeApproveApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/materials_use_notice_order/approve",
    method: "post",
    data,
  });
}

/** 原材料使用通知单-生成报告 */
export function useNoticeReportApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/qlty/materials_use_notice_order/makeReport",
    method: "post",
    data,
  });
}
