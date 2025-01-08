import http from "../http/xhHttp.js";

// 获取其他入库单列表API
export function getOtherInListApi(data) {
    return http.request({
        url: "/apios/warehouse_otr_in/getList",
        method: "post",
        data,
    });
}

// 获取采购入库单详情API
export function detailOtherInApi(data) {
    return http.request({
        url: "/apios/warehouse_otr_in/details",
        method: "post",
        data,
    });
}

/**
 * @param {Object} {id} 提审入库单API
 */
export function submitOtherInApi(data) {
    return http.request({
        url: "/apios/warehouse_otr_in/review",
        method: "post",
        data,
    });
}

/**
 * @param {Object} {id} 撤回入库单API
 */
export function recallOtherInApi(data) {
    return http.request({
        url: "/apios/warehouse_otr_in/withdrawal",
        method: "post",
        data,
    });
}

/**
 * @param {Object} {id} 作废入库单API
 */
export function voidOtherInApi(data) {
    return http.request({
        url: "/apios/warehouse_otr_in/nullify",
        method: "post",
        data,
    });
}

/**
 * @param {Object} {id} 删除入库单API
 */
export function delOtherInApi(data) {
    return http.request({
        url: "/apios/warehouse_otr_in/delete",
        method: "post",
        data,
    });
}

/**
 * @param {Object} {reason,id} 驳回入库单API
 */
export function rejectOtherInApi(data) {
    return http.request({
        url: "/apios/warehouse_otr_in/reject",
        method: "post",
        data,
    });
}

/**
 * @param {Object} {id} 通过入库单API
 */
export function approveOtherInApi(data) {
    return http.request({
        url: "/apios/warehouse_otr_in/approve",
        method: "post",
        data,
    });
}
// 入库单-仓库确认-通过
export function whApproveApi(data) {
    return http.request({
        url: "/apios/warehouse_otr_in/whApprove",
        method: "post",
        data,
    });
}

// 入库单-仓库确认-驳回
export function whRejectApi(data) {
    return http.request({
        url: "/apios/warehouse_otr_in/whReject",
        method: "post",
        data,
    });
}
