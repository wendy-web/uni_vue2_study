/* 工序控制检验报告API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

/** 工序控制检验报告-列表数据api */
export function getControlListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Operation/getList",
    method: "post",
    data,
  });
}

/** 工序控制检验报告-创建/编辑/提审Api */
export function controlAddApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Operation/saveOrder",
    method: "post",
    data,
  });
}

/** 工序控制检验报告-详情Api */
export function controlDetailApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Operation/getInfo",
    method: "post",
    data,
  });
}

/** 工序控制检验报告-提交审核Api */
export function controlSubmitApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Operation/commitAcceptOrder",
    method: "post",
    data,
  });
}

/** 工序控制检验报告-撤回Api */
export function controlRecallApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Operation/revokeOrder",
    method: "post",
    data,
  });
}

/** 工序控制检验报告-驳回Api */
export function controlRejectApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Operation/rejectOrder",
    method: "post",
    data,
  });
}

/** 工序控制检验报告-反审核api */
export function controlReverseApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Operation/countertrial",
    method: "post",
    data,
  });
}

/** 工序控制检验报告-审核通过api */
export function controlApproveApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Operation/finishOrder",
    method: "post",
    data,
  });
}

/** 工序控制检验报告-删除api */
export function controlDelApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Operation/deleteOrder",
    method: "post",
    data,
  });
}

/** 工序控制检验报告-生成报告api */
export function controlReportApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/qlty/Operation/makeReport",
    method: "post",
    data,
  });
}
