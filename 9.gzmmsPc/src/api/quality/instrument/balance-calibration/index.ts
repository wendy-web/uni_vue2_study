/* 天平校准记录API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

/** 天平校准记录-列表数据api */
export function getBalanceCalibrationListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Scale/getList",
    method: "post",
    data,
  });
}

/** 天平校准记录-详情数据api */
export function balanceCalibrationDetailApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Scale/getInfo",
    method: "post",
    data,
  });
}

/** 天平校准记录-创建/编辑/提审api */
export function balanceCalibrationSaveApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Scale/saveOrder",
    method: "post",
    data,
  });
}

/** 天平校准记录-反审核api */
export function balanceCalibrationReverseApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Scale/countertrial",
    method: "post",
    data,
  });
}

/** 天平校准记录-删除api */
export function balanceCalibrationDelApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Scale/deleteOrder",
    method: "post",
    data,
  });
}

/** 天平校准记录-审核通过api */
export function balanceCalibrationApproveApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Scale/finishOrder",
    method: "post",
    data,
  });
}

/** 天平校准记录-驳回api */
export function balanceCalibrationRejectApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Scale/rejectOrder",
    method: "post",
    data,
  });
}

/** 天平校准记录-撤回api */
export function balanceCalibrationRecallApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Scale/revokeOrder",
    method: "post",
    data,
  });
}

/** 天平校准记录-提交审核api */
export function balanceCalibrationSubmitApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Scale/commitAcceptOrder",
    method: "post",
    data,
  });
}

/** 天平校准记录-生成报告api */
export function balanceCalibrationReportApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Scale/makeReport",
    method: "post",
    data,
  });
}

/** 天平校准记录-新增电子秤数据初始化下拉api */
export function getScaledeviceInitApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Post/getScaledeviceInitMap",
    method: "post",
    data,
  });
}
