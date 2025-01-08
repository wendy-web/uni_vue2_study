import http from "../http/xhHttp.js";

// 仓库分类列表
export function storageListApi(data) {
    return http.request({
        url: "/apios/get/warehouseclasslist",
        method: "get",
        data: data,
    });
}

// 部门列表
export function departmentListApi() {
    return http.request({
        url: "/apios/get/deptlist",
        method: "get",
    });
}
// 部门列表 - 无需校验登录
export function departmentScanListApi() {
    return http.request({
        url: "/mro/Scan/deptlist",
        method: "get",
    });
}


/**
 * 获取审批日志
 * @param {Number} document_type 单据交易类型 1采购入库 2退货出库 3领料出库 4退料入库 5调拨 6盘点 7报废 8采购单 9采购退货单 10换货单 11拆装单
 * @param {Number} document_id 单据id 
 */
export function getapproveLogApi(data) {
    return http.request({
        url: "/apios/post/approveLog",
        method: "post",
        isNoLoading: true,
        data: data,
    });
}

/** 领料出库单 - 流程详情 */
export function flowGetSup(data) {
    return http.request({
        url: "/apios/post/recProList",
        method: "post",
        data,
    });
}

/**
 * 获取流程详情
 * @param {Number} id 单据id
 * @param {Number} type 单据类型；1：调拨单;2：采购入库单;3:其它入库单
 */
export function flowDetailApi(data) {
    return http.request({
        url: "/apios/post/receiptProList",
        method: "post",
        data,
    });
}

/** 
 * 获取人员列表 
 */
export function getUserListApi(data) {
    return http.request({
        url: "/apios/home/user",
        method: "post",
        data,
    });
}

// 新-已入库-分组
export function getInstockApi(data) {
    return http.request({
        url: "/apios/get/getInstockGoods",
        method: "get",
        data: data,
    });
}

// 基础设置 使用地点列表
export function placeListApi() {
    return http.request({
        url: "/apios/get/allList",
        method: "get",
    });
}


/** 领料单获取领料类型数据 */
export function getRecTypeApi() {
    return http.request({
        url: "/apios/get/getWarehouseRecType",
        method: "get",
    });
}


/** 库存标签(二维码)识别 */
export function getLabelInfoApi(data) {
    return http.request({
        url: "/apios/home/getLabelInfo",
        method: "post",
        data: data,
    });
}

/** 货品标签(二维码)识别 */
export function getLabelGoodsApi(data) {
    return http.request({
        url: "/apios/home/getLabelGoodsInfo",
        method: "post",
        data: data,
    });
}


/** 库存标签识别-小程序 */
export function getLabelInfoXcxApi(data) {
    return http.request({
        url: "/apios/home/getLabelInfoXcx",
        method: "post",
        data: data,
    });
}


/** 获取库存明细唯一标签码 */
export function getStocksUniqueLabelApi(data) {
    return http.request({
        url: "/apios/post/getStocksUniqueLabel",
        method: "post",
        data: data,
    });
}
// 获取可选列表
export function getEqBaseSelect(data) {
    return http.request({
        url: "/mro/Post/getEqBaseSelect",
        method: "post",
        data,
    });
}

export function getScanEqBaseSelect(data) {
    return http.request({
        url: "/mro/Scan/getEqBaseSelect",
        method: "post",
        data,
    });
}