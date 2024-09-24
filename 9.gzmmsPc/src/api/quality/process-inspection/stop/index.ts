import { AxiosPromise } from "axios";
import { ResPage } from "@/api/interface";
import request from "@/utils/request";
import {
  ChecKRetParams,
  Details,
  List,
  OrderParams,
  SaveFileParams,
  SearchParams,
  StopcipBaseData,
} from "./types";

export function getList(data: SearchParams): AxiosPromise<ResPage<List>> {
  return request({
    url: "/qlty/Stopcip/getList",
    method: "post",
    data: data,
  });
}

export function getInfo(id: any): AxiosPromise<Details> {
  return request({
    url: "/qlty/Stopcip/getInfo",
    method: "post",
    data: { id },
  });
}

export function saveOrder(data: OrderParams): AxiosPromise {
  return request({
    url: "/qlty/Stopcip/saveOrder",
    method: "post",
    data: data,
  });
}

export function updateChecKRet(data: ChecKRetParams): AxiosPromise {
  return request({
    url: "/qlty/Stopcip/updateChecKRet",
    method: "post",
    data: data,
  });
}

export function del(id: any): AxiosPromise {
  return request({
    url: "/qlty/Stopcip/deleteOrder",
    method: "post",
    data: { id },
  });
}

export function delFile(id: any[]): AxiosPromise {
  return request({
    url: "/qlty/Stopcip/delFile",
    method: "post",
    data: { id },
  });
}
export function saveFile(data: SaveFileParams): AxiosPromise {
  return request({
    url: "/qlty/Stopcip/saveFile",
    method: "post",
    data: data,
  });
}
export function getStopcipBaseData(): AxiosPromise<StopcipBaseData> {
  return request({
    url: "/qlty/Post/getStopcipBaseData",
    method: "post",
  });
}

export function makeReportApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Stopcip/makeReport",
    method: "post",
    data,
  });
}
