import { AxiosPromise } from "axios";
import request from "@/utils/request";

/* 仓库——列表 */
export function getListApi(data: {}): AxiosPromise {
  return request({
    url: "/apios/product_warehouse/list",
    method: "post",
    data,
  });
}

/* 仓库——新增 */
export function createApi(data: {}): AxiosPromise {
  return request({
    url: "/apios/product_warehouse/create",
    method: "post",
    data,
  });
}

/* 仓库——编辑 */
export function editApi(data: {}): AxiosPromise {
  return request({
    url: "/apios/product_warehouse/edit",
    method: "post",
    data,
  });
}

/* 仓库——删除 */
export function deleteApi(data: {}): AxiosPromise {
  return request({
    url: "/apios/product_warehouse/delete",
    method: "post",
    data,
  });
}
