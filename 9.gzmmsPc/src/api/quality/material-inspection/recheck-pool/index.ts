/* 复检池单据API */
import { AxiosPromise } from "axios";
import request from "@/utils/request";

/** 列表  */
export function getListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Recheckorder/getList",
    method: "post",
    data,
  });
}
/** 删除   */
export function deleteOrderApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Recheckorder/deleteOrder",
    method: "post",
    data,
  });
}
/** 确认  */
export function confirmOrderApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Recheckorder/confirmOrder",
    method: "post",
    data,
  });
}

/** 保存  */
export function updateOrderApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Recheckorder/updateOrder",
    method: "post",
    data,
  });
}

/** 详情接口 */
export function getInfoApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Recheckorder/details",
    method: "post",
    data,
  });
}
/** 撤回 */
// export function revokeOrderApi(data: {}): AxiosPromise {
//   return request({
//     url: "/qlty/essence_entering_order/withdrawal",
//     method: "post",
//     data,
//   });
// }

/** 审核通过 */
// export function finishOrderApi(data: {}): AxiosPromise {
//   return request({
//     url: "/qlty/essence_entering_order/approve",
//     method: "post",
//     data,
//   });
// }

/** 审核不通过  */
// export function rejectOrderApi(data: {}): AxiosPromise {
//   return request({
//     url: "/qlty/essence_entering_order/reject",
//     method: "post",
//     data,
//   });
// }
