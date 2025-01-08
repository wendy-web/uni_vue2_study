import http from "../http/xhHttp.js";

// 获取采购入库单列表API
export function getBuyInListApi(data) {
    return http.request({
        url: "/apios/warehouse_in/getList",
        method: "post",
        data,
    });
}

// 获取采购入库单详情API
export function detailBuyInApi(data) {
    return http.request({
        url: "/apios/warehouse_in/details",
        method: "post",
        data,
    });
}

/**
 * @param {Object} {id} 提审入库单API
 */
export function submitBuyInApi(data) {
    return http.request({
        url: "/apios/warehouse_in/review",
        method: "post",
        data,
    });
}

/**
 * @param {Object} {id} 撤回入库单API
 */
export function recallBuyInApi(data) {
    return http.request({
        url: "/apios/warehouse_in/withdrawal",
        method: "post",
        data,
    });
}

/**
 * @param {Object} {id} 作废入库单API
 */
export function voidBuyInApi(data) {
    return http.request({
        url: "/apios/warehouse_in/nullify",
        method: "post",
        data,
    });
}

/**
 * @param {Object} {id} 删除入库单API
 */
export function delBuyInApi(data) {
    return http.request({
        url: "/apios/warehouse_in/delete",
        method: "post",
        data,
    });
}

/**
 * @param {Object} {reason,id} 驳回入库单API
 */
export function rejectBuyInApi(data) {
    return http.request({
        url: "/apios/warehouse_in/reject",
        method: "post",
        data,
    });
}

/**
 * @param {Object} {id} 通过入库单API
 */
export function approveBuyInApi(data) {
    return http.request({
        url: "/apios/warehouse_in/approve",
        method: "post",
        data,
    });
}
// 入库单-仓库确认-通过
export function whApproveApi(data) {
    return http.request({
        url: "/apios/warehouse_in/whApprove",
        method: "post",
        data,
    });
}
// 入库单-仓库确认-驳回
export function whRejectApi(data) {
    return http.request({
        url: "/apios/warehouse_in/whReject",
        method: "post",
        data,
    });
}
