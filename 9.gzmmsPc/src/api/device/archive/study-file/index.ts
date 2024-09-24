import { AxiosPromise, ResponseType } from "axios";
import request from "@/utils/request";
import { FileListQueryType, FileListType } from "./types";

// 文件列表
export function getFileListApi(data: FileListQueryType): AxiosPromise<FileListType> {
  return request({
    url: "/mro/File/getFileList",
    method: "post",
    data,
  });
}

// 文件下载
export function downloadFileApi(data: {}, responseType: ResponseType = "json"): AxiosPromise {
  return request({
    url: "/mro/File/downloadFile",
    method: "post",
    data,
    responseType,
  });
}

// 文件删除
export function delFileApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/mro/File/delFile",
    method: "post",
    data,
  });
}
// 文件更新
export function updateFileApi(data: {}): AxiosPromise {
  return request({
    url: "/mro/File/updateFile",
    method: "post",
    data,
  });
}

// 文件保存
export function saveFileApi(data: {}): AxiosPromise {
  return request({
    url: "/mro/File/saveFile",
    method: "post",
    data,
  });
}
