import request from "@/utils/request";
import { AxiosPromise } from "axios";
import type { IBacklog, IMessageQuery, INews, INoticeQuery, IPlanQuery } from "./types";

/** 获取待办列表API */
export function getBacklogApi(data: INoticeQuery): AxiosPromise<IBacklog> {
  return request({
    url: "/apios/get/getMyWorkPending",
    method: "get",
    params: data,
  });
}

/** 获取消息列表API */
export function getWorkMsgApi(data: IMessageQuery): AxiosPromise<INews> {
  return request({
    url: "/apios/get/getMyWorkMessage",
    method: "get",
    params: data,
  });
}

/** 设置消息为已读 */
export function setReadMsgApi(data: { id?: number }): AxiosPromise<INews> {
  return request({
    url: "/apios/post/markReadMessage",
    method: "post",
    data: data,
  });
}

/** 首页获取库存预警信息 */
export function getWarningDataApi(): AxiosPromise {
  return request({
    url: "/apios/home/getWarningData",
    method: "get",
  });
}

// 首页-获取保养、点巡检计划提醒统计
export function getPlanNoticeApi(): AxiosPromise<IPlanQuery> {
  return request({
    url: "/apios/home/getPlanNoticeData",
    method: "get",
  });
}
