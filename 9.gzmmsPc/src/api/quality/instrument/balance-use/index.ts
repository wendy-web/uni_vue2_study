/* 电子天平使用记录API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

/** 电子天平-列表数据api */
export function getBalanceUseListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Scaleuse/getList",
    method: "post",
    data,
  });
}

/** 电子天平-删除api */
export function balanceUseDelApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Scaleuse/deleteOrder",
    method: "post",
    data,
  });
}

/** 电子天平-创建api */
export function balanceUseAddApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Scaleuse/saveOrder",
    method: "post",
    data,
  });
}

/** 电子天平-确认api */
export function balanceUseConfirmApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Scaleuse/confirmOrder",
    method: "post",
    data,
  });
}

/** 电子天平-编辑api */
export function balanceUseEditApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Scaleuse/updateOrder",
    method: "post",
    data,
  });
}


/** 电子天平-导出api */
export function balanceUseReportApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Scaleuse/makeReport",
    method: "post",
    data,
  });
}
