/* 比色皿清洗记录API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

/** 比色器皿-列表数据api */
export function getRinseRecordListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Cuvette/getList",
    method: "post",
    data,
  });
}
/** 比色器皿-创建api */
export function rinseRecordAddApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Cuvette/saveOrder",
    method: "post",
    data,
  });
}

/** 比色器皿-编辑api */
export function rinseRecordEditApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Cuvette/updateOrder",
    method: "post",
    data,
  });
}

/** 比色器皿-删除api */
export function rinseRecordDelApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Cuvette/deleteOrder",
    method: "post",
    data,
  });
}

/** 比色器皿-确认api */
export function rinseRecordConfirmApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Cuvette/confirmOrder",
    method: "post",
    data,
  });
}

/** 比色器皿-确认api */
export function rinseRecordReportApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Cuvette/makeReport",
    method: "post",
    data,
  });
}
