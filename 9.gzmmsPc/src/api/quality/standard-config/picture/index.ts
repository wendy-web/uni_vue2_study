import { AxiosPromise } from "axios";
import request from "@/utils/request";
import { PictureDataType } from "./types";

/** 纸皮图片标签图片配置-列表页面接口 */
export function getImgConfigListApi(data: {}): AxiosPromise<PictureDataType> {
  return request({
    url: "/qlty/img_config/getImgConfigList",
    method: "post",
    data,
  });
}

/** 纸皮图片标签图片配置-提交图片接口 */
export function submitImgConfigApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/img_config/submit",
    method: "post",
    data,
  });
}
