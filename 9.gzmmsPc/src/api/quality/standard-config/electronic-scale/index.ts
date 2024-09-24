/* 电子天平电子秤检验报告API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

// 电子天平电子秤检验-列表信息
export function getElectronicScaleListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Scaledevice/getScaledeviceList",
    method: "post",
    data,
  });
}

// 电子天平电子秤检验-创建
export function electronicScaleAddApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Scaledevice/createScaledevice",
    method: "post",
    data,
  });
}

// 电子天平电子秤检验-编辑
export function electronicScaleEditApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Scaledevice/editScaledevice",
    method: "post",
    data,
  });
}

// 电子天平电子秤检验-删除
export function electronicScaleDelApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Scaledevice/delScaledevice",
    method: "post",
    data,
  });
}
