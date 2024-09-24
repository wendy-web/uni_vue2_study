import { AxiosPromise } from "axios";
import request from "@/utils/request";
import type { InspecRecordDetailData, InspecRecordListType } from "./types";

// 点巡检记录-列表
export function getInspecRecordListApi(data: {}): AxiosPromise<InspecRecordListType> {
  return request({
    url: "/mro/PointCheck/getList",
    method: "post",
    data,
  });
}

// 点巡检记录-详情
export function getInspecRecordDetailApi(data: {
  id: number;
}): AxiosPromise<InspecRecordDetailData> {
  return request({
    url: "/mro/PointCheck/details",
    method: "post",
    data,
  });
}

// 点巡检记录-驳回
export function getInspecRecordRejectApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/mro/PointCheck/rejectOrder",
    method: "post",
    data,
  });
}

// 点巡检记录-撤回
export function getInspecRecordRecallApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/mro/PointCheck/revokeOrder",
    method: "post",
    data,
  });
}

// 点巡检记录-提审
export function getInspecRecordSubmitApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/mro/PointCheck/commitAcceptOrder",
    method: "post",
    data,
  });
}

// 点巡检记录-创建/编辑
export function getInspecRecordAddEditApi(data: {}): AxiosPromise {
  return request({
    url: "/mro/PointCheck/createPointCheckTask",
    method: "post",
    data,
  });
}

// 点巡检记录-审批通过
export function getInspecRecordApproveApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/mro/PointCheck/finishOrder",
    method: "post",
    data,
  });
}
