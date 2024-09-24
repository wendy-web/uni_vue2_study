import { AxiosPromise } from "axios";
import request from "@/utils/request";
import { CauseList, CreateCauseQuery, UpdateCauseQuery } from "./types";

// 故障原因列表
export function getRepairReasonListApi(): AxiosPromise<CauseList> {
  return request({
    url: "/mro/Basics/getRepairReasonList",
    method: "post",
  });
}

// 故障原因--添加
export function createRepairReasonApi(data: CreateCauseQuery): AxiosPromise {
  return request({
    url: "/mro/Basics/createRepairReason",
    method: "post",
    data,
  });
}

// 故障原因--更新
export function updateRepairReasonApi(data: UpdateCauseQuery): AxiosPromise {
  return request({
    url: "/mro/Basics/updateRepairReason",
    method: "post",
    data,
  });
}

// 故障原因--删除
export function deleteRepairReasonApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/mro/Basics/deleteRepairReason",
    method: "post",
    data,
  });
}
