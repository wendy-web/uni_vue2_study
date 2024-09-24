import http from "@/api/http/xhHttp.js";

// 获取维修单列表
export function getRepairListApi(data) {
    return http.request({
        url: "/mro/Repair/list",
        method: "post",
        data,
    });
}

// 验收通过
export function finishOrderApi(data) {
    return http.request({
        url: "/mro/Repair/finishOrder",
        method: "post",
        data,
    });
}

// 提交验证
export function commitAcceptOrderApi(data) {
    return http.request({
        url: "/mro/Repair/commitAcceptOrder",
        method: "post",
        data,
    });
}

// 作废
export function cancelRepairOrderApi(data) {
    return http.request({
        url: "/mro/Repair/cancelRepairOrder",
        method: "post",
        data,
    });
}
// 驳回
export function rejectOrderApi(data) {
    return http.request({
        url: "/mro/Repair/rejectOrder",
        method: "post",
        data,
    });
}

// 撤回
export function revokeOrderApi(data) {
    return http.request({
        url: "/mro/Repair/revokeOrder",
        method: "post",
        data,
    });
}
// 删除
export function deleteOrderApi(data) {
    return http.request({
        url: "/mro/Repair/deleteOrder",
        method: "post",
        data,
    });
}

// 创建/提审维修单/驳回修改
export function repairOrderApi(data) {
    return http.request({
        url: "/mro/Repair/repairOrder",
        method: "post",
        data,
    });
}
// 维修单编辑数据
export function getRepairDetailApi(data) {
    return http.request({
        url: "/mro/Repair/Repairinfo",
        method: "post",
        data,
    });
}

// 班次的获取
export function getClasstimeMap(data) {
    return http.request({
        url: "/qlty/Post/getClasstimeMap",
        method: "post",
        data,
    });
}

// 获取列表
export function getEqBaseSelect(data) {
    return http.request({
        url: "/mro/Post/getEqBaseSelect",
        method: "post",
        data,
    });
}

// 获取故障原因
export function getRepairReasonList(data) {
    return http.request({
        url: "/mro/Basics/getRepairReasonList",
        method: "post",
        data,
    });
}

export function getReBaseSelect(data) {
    return http.request({
        url: "/mro/Post/getReBaseSelect",
        method: "post",
        data,
    });
}

// 换上领用单
export function getWarehouseRecDetailApi(data) {
    return http.request({
        url: "/mro/Post/getWarehouseRecDetail",
        method: "post",
        data,
    });
}
// 换下领用单
export function getDownEqListApi(data) {
    return http.request({
        url: "/mro/Post/getDownEqList",
        method: "post",
        data,
    });
}

// 获取库存明细唯一标签码
export function getStocksUniqueLabelApi(data) {
    return http.request({
        url: "/apios/post/getStocksUniqueLabel",
        method: "post",
        data,
    });
}

export function getLabelInfoMroApi(data) {
    return http.request({
        url: "/apios/home/getLabelInfoMro",
        method: "post",
        data,
    });
}
