import { AxiosPromise } from "axios";
import request from "@/utils/request";
import { VersionDataType } from "./types";

/** 版本信息-列表页面接口 */
export function getVersionListApi(data: {}): AxiosPromise<VersionDataType> {
  return request({
    url: "/qlty/version_info/getVersionList",
    method: "post",
    data,
  });
}

/** 版本信息-开启/停用版本 */
export function changeStatusApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/version_info/updEnableStatus",
    method: "post",
    data,
  });
}

/** 版本信息-创建版本 */
export function createVersionApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/version_info/createVersion",
    method: "post",
    data,
  });
}

/** 版本信息-编辑版本 */
export function editVersionApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/version_info/editVersion",
    method: "post",
    data,
  });
}

/** 版本信息-删除版本 */
export function delVersionApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/version_info/delVersion",
    method: "post",
    data,
  });
}
