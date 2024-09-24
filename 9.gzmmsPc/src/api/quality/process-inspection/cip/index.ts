/* 定期CIP检测项目API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

/** 定期CIP检验报告-列表数据api */
export function getFixedCIPListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Cip/getList",
    method: "post",
    data,
  });
}

/** 定期CIP检验报告-新增数据api */
export function fixedCIPAddApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Cip/saveOrder",
    method: "post",
    data,
  });
}
/** 定期CIP检验报告-删除数据api */
export function fixedCIPDelApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Cip/deleteOrder",
    method: "post",
    data,
  });
}

/** 定期CIP检验报告-执行检测api */
export function fixedCIPExecuteApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Cip/updateChecKRet",
    method: "post",
    data,
  });
}

/** 定期CIP检验报告-删除附件api */
export function fixedCIPDelFileApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Cip/delFile",
    method: "post",
    data,
  });
}

/** 定期CIP检验报告-新增附件api */
export function fixedCIPAddFileApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Cip/saveFile",
    method: "post",
    data,
  });
}

/** 定期CIP检验报告-详情数据api */
export function fixedCIPDetailApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Cip/getInfo",
    method: "post",
    data,
  });
}

/** 定期CIP检验报告-生成报告api */
export function fixedCIPReportApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/qlty/Cip/makeReport",
    method: "post",
    data,
  });
}
