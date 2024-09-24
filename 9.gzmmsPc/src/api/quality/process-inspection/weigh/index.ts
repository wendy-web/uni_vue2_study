/* 空罐顶盖重量检测API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

/** 列表api */
export function getListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Ecw/getList",
    method: "post",
    data,
  });
}
/** 创建api */
export function createApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Ecw/saveOrder",
    method: "post",
    data,
  });
}
/** 新增附件api */
export function saveFileApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Ecw/saveFile",
    method: "post",
    data,
  });
}
/** 删除附件api */
export function delFileApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Ecw/delFile",
    method: "post",
    data,
  });
}

/** 获取详情api */
export function getInfoApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Ecw/getInfo",
    method: "post",
    data,
  });
}

/** 生成报告api */
export function makeReportApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Ecw/makeReport",
    method: "post",
    data,
  });
}
