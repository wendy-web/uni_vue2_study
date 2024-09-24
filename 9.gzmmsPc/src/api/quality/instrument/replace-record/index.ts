/* 仪器更换记录API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

/** 仪器更换记录-列表数据api */
export function getReplaceRecordListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Instreplace/getList",
    method: "post",
    data,
  });
}

/** 仪器更换记录-删除api */
export function replaceRecordDelApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Instreplace/deleteOrder",
    method: "post",
    data,
  });
}

/** 仪器更换记录-创建api */
export function replaceRecordAddApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Instreplace/saveOrder",
    method: "post",
    data,
  });
}

/** 仪器更换记录-确认api */
export function replaceRecordConfirmApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Instreplace/confirmOrder",
    method: "post",
    data,
  });
}

/** 仪器更换记录-编辑api */
export function replaceRecordEditApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Instreplace/updateOrder",
    method: "post",
    data,
  });
}

/** 仪器更换记录-生成报告api */
export function replaceRecordReportApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Instreplace/makeReport",
    method: "post",
    data,
  });
}
