/* CIP微生物检验报告API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

/** CIP微生物检验报告-列表数据api */
export function getCipMicrobesListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Cipmicrobe/getList",
    method: "post",
    data,
  });
}
/** CIP微生物检验报告-详情api */
export function cipMicrobesDetailApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Cipmicrobe/getInfo",
    method: "post",
    data,
  });
}

/** CIP微生物检验报告-创建/编辑/提审api */
export function cipMicrobesSaveApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Cipmicrobe/saveOrder",
    method: "post",
    data,
  });
}

/** CIP微生物检验报告-审核通过api */
export function cipMicrobesApproveApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Cipmicrobe/finishOrder",
    method: "post",
    data,
  });
}

/** CIP微生物检验报告-驳回api */
export function cipMicrobesRejectApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Cipmicrobe/rejectOrder",
    method: "post",
    data,
  });
}

/** CIP微生物检验报告-撤回api */
export function cipMicrobesRecallApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Cipmicrobe/revokeOrder",
    method: "post",
    data,
  });
}

/** CIP微生物检验报告-提交审核api */
export function cipMicrobesSubmitApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Cipmicrobe/commitAcceptOrder",
    method: "post",
    data,
  });
}
/** CIP微生物检验报告-反审核api */
export function cipMicrobesReverseApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Cipmicrobe/countertrial",
    method: "post",
    data,
  });
}
/** CIP微生物检验报告-删除api */
export function cipMicrobesDelApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Cipmicrobe/deleteOrder",
    method: "post",
    data,
  });
}

/** CIP微生物检验报告-生成报告api */
export function cipMicrobesReportApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/qlty/Cipmicrobe/makeReport",
    method: "post",
    data,
  });
}
