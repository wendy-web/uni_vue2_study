/*仪器管理API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";
// 列表信息
export function getListApi(data: {}): AxiosPromise {
    return request({
      url: "/qlty/Inst/getInstList",
      method: "post",
      data,
    });
  }
  // 创建
  export function createApi(data: {}): AxiosPromise {
    return request({
      url: "/qlty/Inst/createInst",
      method: "post",
      data,
    });
  }
  // 更新
  export function editApi(data: {}): AxiosPromise {
    return request({
      url: "/qlty/Inst/editInst",
      method: "post",
      data,
    });
  }
  // 删除
  export function deleteApi(data: {}): AxiosPromise {
    return request({
      url: "/qlty/Inst/delInst",
      method: "post",
      data,
    });
  }
  // 开启、停用
  export function changeStatusApi(data: {}): AxiosPromise {
    return request({
      url: "/qlty/Inst/updEnableStatus",
      method: "post",
      data,
    });
  }