import { AxiosPromise, ResponseType } from "axios";
import request from "@/utils/request";

/** 成品质量检查列表 */
export function getCheckListApi(data: {}): AxiosPromise {
  return request({
    url: "/apios/product_in/getCheckList",
    method: "post",
    data,
  });
}
/** 成品质量检查解除限制 */
export function removeCheckApi(data: {}): AxiosPromise {
  return request({
    url: "/apios/product_in/removeCheck",
    method: "post",
    data,
  });
}
/** 成品质量检查撤回限制 */
export function revokeCheckApi(data: {}): AxiosPromise {
  return request({
    url: "/apios/product_in/revokeCheck",
    method: "post",
    data,
  });
}
