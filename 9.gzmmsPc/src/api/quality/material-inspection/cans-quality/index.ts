/* 战马空罐质量检验报告API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";
import type { CansQualityDataType, CansQualityDetailType } from "./types";

/** 战马空罐质量检验报告-列表数据api */
export function getCansQualityListApi(data: {}): AxiosPromise<CansQualityDataType> {
  return request({
    url: "/qlty/empty_quality_order/list",
    method: "post",
    data,
  });
}

/** 战马空罐质量检验报告-详情数据api */
export function getCansQualityDetailApi(data: {}): AxiosPromise<CansQualityDetailType> {
  return request({
    url: "/qlty/empty_quality_order/detail",
    method: "post",
    data,
  });
}

/** 战马空罐质量检验报告-新建数据api */
export function cansQualityAddApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/empty_quality_order/create",
    method: "post",
    data,
  });
}

/** 战马空罐质量检验报告-编辑数据api */
export function cansQualityEditApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/empty_quality_order/edit",
    method: "post",
    data,
  });
}

/** 战马空罐质量检验报告-提审签字提交api  */
export function cansQualitySubmitApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/empty_quality_order/review",
    method: "post",
    data,
  });
}

/** 战马空罐质量检验报告-撤回api */
export function cansQualityRecallApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/empty_quality_order/withdrawal",
    method: "post",
    data,
  });
}

/** 战马空罐质量检验报告-反审api */
export function cansQualityReverseApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/empty_quality_order/countertrial",
    method: "post",
    data,
  });
}
/** 战马空罐质量检验报告-删除api */
export function cansQualityDelApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/empty_quality_order/delete",
    method: "post",
    data,
  });
}

/** 战马空罐质量检验报告-审批通过api */
export function cansQualityApproveApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/empty_quality_order/approve",
    method: "post",
    data,
  });
}

/** 战马空罐质量检验报告-审批驳回api */
export function cansQualityRejectApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/empty_quality_order/reject",
    method: "post",
    data,
  });
}

/** 战马空罐质量检验报告-生成报告api */
export function cansQualityReportApi(data: {id:number}): AxiosPromise {
  return request({
    url: "/qlty/empty_quality_order/makeReport",
    method: "post",
    data,
  });
}
