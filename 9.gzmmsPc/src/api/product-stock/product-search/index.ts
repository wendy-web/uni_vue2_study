import { AxiosPromise, ResponseType } from "axios";
import request from "@/utils/request";

/** 成品库存查询列表 */
export function getProductSearchApi(data: {}): AxiosPromise {
  return request({
    url: "/apios/product_inventory/getstock",
    method: "post",
    data,
  });
}
