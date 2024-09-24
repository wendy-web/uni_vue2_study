/* 战马成品检验结果API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

/** 战马成品-列表数据api */
export function getProductWarhorseListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/warhorse_product_order/list",
    method: "post",
    data,
  });
}

/** 战马成品-详情数据api */
export function getProductWarhorseDetailApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/warhorse_product_order/detail",
    method: "post",
    data,
  });
}

/** 战马成品-新建数据api */
export function productWarhorseAddApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/warhorse_product_order/create",
    method: "post",
    data,
  });
}

/** 战马成品-编辑数据api */
export function productWarhorseEditApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/warhorse_product_order/edit",
    method: "post",
    data,
  });
}

/** 战马成品-驳回api */
export function productWarhorseRejectApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/warhorse_product_order/reject",
    method: "post",
    data,
  });
}

/** 战马成品-审批通过api */
export function productWarhorseApproveApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/warhorse_product_order/approve",
    method: "post",
    data,
  });
}

/** 战马成品-反审api */
export function productWarhorseReverseApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/warhorse_product_order/countertrial",
    method: "post",
    data,
  });
}

/** 战马成品-提审签字提交api */
export function productWarhorseSubmitApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/warhorse_product_order/review",
    method: "post",
    data,
  });
}

/** 战马成品-删除api */
export function productWarhorseDelApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/warhorse_product_order/delete",
    method: "post",
    data,
  });
}

/** 战马成品-撤回api */
export function productWarhorseRecallApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/warhorse_product_order/withdrawal",
    method: "post",
    data,
  });
}

/** 战马成品-生成报告api */
export function productWarhorseReportApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/qlty/warhorse_product_order/makeReport",
    method: "post",
    data,
  });
}
