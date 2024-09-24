/* 卷封投影仪记录API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

/** 卷封投影仪记录-列表数据api */
export function getProjectorListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Projector/getList",
    method: "post",
    data,
  });
}

/** 卷封投影仪记录-删除api */
export function projectorDelApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Projector/deleteOrder",
    method: "post",
    data,
  });
}

/** 卷封投影仪记录-创建api */
export function projectorAddApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Projector/saveOrder",
    method: "post",
    data,
  });
}

/** 卷封投影仪记录-确认api */
export function projectorConfirmApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Projector/confirmOrder",
    method: "post",
    data,
  });
}

/** 卷封投影仪记录-编辑api */
export function projectorEditApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Projector/updateOrder",
    method: "post",
    data,
  });
}

/** 卷封投影仪记录-导出报告api */
export function projectorReportApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Projector/makeReport",
    method: "post",
    data,
  });
}
