import { AxiosPromise } from "axios";
import request from "@/utils/request";

/* 库位管理列表 */
export function getListApi(data: {}): AxiosPromise {
  return request({
    url: "/apios/product_ws_code/list",
    method: "post",
    data,
  });
}
/* 库位——新增 */
export function createApi(data: {}): AxiosPromise {
  return request({
    url: "/apios/product_ws_code/create",
    method: "post",
    data,
  });
}

/* 库位——编辑 */
export function editApi(data: {}): AxiosPromise {
  return request({
    url: "/apios/product_ws_code/edit",
    method: "post",
    data,
  });
}

/* 库位——删除 */
export function deleteApi(data: {}): AxiosPromise {
  return request({
    url: "/apios/product_ws_code/delete",
    method: "post",
    data,
  });
}

/* 库位——下载模板 */
export function getTemplateApi(): AxiosPromise {
  return request({
    url: "/static/库位导入模版.xlsx",
    method: "get",
  });
}

/* 库位——导入模板 */
export function importApi(file: any): AxiosPromise<any> {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/apios/product_ws_code/import",
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
