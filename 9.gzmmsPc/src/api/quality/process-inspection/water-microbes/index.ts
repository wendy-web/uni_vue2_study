/* 水处理微生物检验报告API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

/** 水处理微生物检验报告-列表数据api */
export function getWaterMicrobesListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Watermicrobe/getList",
    method: "post",
    data,
  });
}

/** 水处理微生物检验报告-详情数据api */
export function waterMicrobesDetailApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Watermicrobe/getInfo",
    method: "post",
    data,
  });
}

/** 水处理微生物检验报告-删除api */
export function waterMicrobesDelApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Watermicrobe/deleteOrder",
    method: "post",
    data,
  });
}

/** 水处理微生物检验报告-审核通过api */
export function waterMicrobesApproveApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Watermicrobe/finishOrder",
    method: "post",
    data,
  });
}

/** 水处理微生物检验报告-驳回api */
export function waterMicrobesRejectApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Watermicrobe/rejectOrder",
    method: "post",
    data,
  });
}

/** 水处理微生物检验报告-撤回api */
export function waterMicrobesRecallApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Watermicrobe/revokeOrder",
    method: "post",
    data,
  });
}

/** 水处理微生物检验报告-提交审核api */
export function waterMicrobesSubmitApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Watermicrobe/commitAcceptOrder",
    method: "post",
    data,
  });
}

/** 水处理微生物检验报告-保存api */
export function waterMicrobesSaveApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Watermicrobe/saveOrder",
    method: "post",
    data,
  });
}

/** 水处理微生物检验报告-反审核api */
export function waterMicrobesReverseApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Watermicrobe/countertrial",
    method: "post",
    data,
  });
}

/** 水处理微生物检验报告-获取检验初始化信息api */
export function waterMicrobesInfoInitApi(): AxiosPromise {
  return request({
    url: "/qlty/Post/getCheckInfoInit",
    method: "post",
  });
}

/** 水处理微生物检验报告-生成报告api */
export function waterMicrobesReportApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/qlty/Watermicrobe/makeReport",
    method: "post",
    data,
  });
}

