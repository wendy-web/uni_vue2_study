import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { ISearchQuery, IListType, DetailDataType } from "./types";

// 获取拆箱单列表API
export function getSplitListApi(data: ISearchQuery): AxiosPromise<IListType> {
  return request({
    url: "/apios/split_assemble/index",
    method: "post",
    data,
  });
}

// 创建拆箱单API
export function addSplitApi(data: any): AxiosPromise {
  return request({
    url: "/apios/split_assemble/create",
    method: "post",
    data,
  });
}

// 编辑拆箱单API
export function editSplitApi(data: any): AxiosPromise {
  return request({
    url: "/apios/split_assemble/edit",
    method: "post",
    data,
  });
}

// 获取拆箱单详情API
export function detailSplitApi(data: { id: number }): AxiosPromise<DetailDataType> {
  return request({
    url: "/apios/split_assemble/detail",
    method: "post",
    data,
  });
}

// 提审拆箱单API
export function submitSplitApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/split_assemble/submit",
    method: "post",
    data,
  });
}

// 撤回拆箱单API
export function recallSplitApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/split_assemble/recall",
    method: "post",
    data,
  });
}

// 作废拆箱单API
export function voidSplitApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/split_assemble/invalid",
    method: "post",
    data,
  });
}

// 删除拆箱单API
export function delSplitApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/split_assemble/delete",
    method: "post",
    data,
  });
}

// 驳回拆箱单API
export function rejectSplitApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/split_assemble/reject",
    method: "post",
    data,
  });
}

// 通过拆箱单API
export function approveSplitApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/split_assemble/approve",
    method: "post",
    data,
  });
}

// 仓库驳回领料出库单API
export function rejectSplitWhApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/split_assemble/whReject",
    method: "post",
    data,
  });
}

// 仓库通过领料出库单API
export function approveSplitWhApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/apios/split_assemble/whApprove",
    method: "post",
    data,
  });
}
