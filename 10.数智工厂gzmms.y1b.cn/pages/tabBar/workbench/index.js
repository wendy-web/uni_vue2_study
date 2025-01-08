export const documentDetailMap = new Map([
    [1, "/pages/purchaseModule/order/detail/detail"], // 采购单
    [2, "/pages/purchaseModule/refund/detail/detail"], //采购退货单
    [3, "/pages/purchaseModule/swap/detail/detail"], //换货单
    [4, "/pages/warehouseModule/buyIn/detail/detail"], //采购入库单
    [5, "/pages/warehouseModule/getSupplier/detail/detail"], //领料出库单  按照后端返回的类型,5是领料出库单
    [6, "/pages/warehouseModule/retGoods/detail/detail"], //退货出库单
    [7, "/pages/warehouseModule/retSupplier/detail/detail"], //退料入库单
    [8, "/pages/warehouseModule/split/detail/detail"], //拆装单
    [9, "/pages/warehouseModule/allot/detail/detail"], //调拨单
    [10, "/pages/warehouseModule/check/detail/detail"], //盘点单
    [11, "/pages/warehouseModule/scrap/detail/detail"], //报废单
    [12, "/pages/warehouseModule/otherIn/detail/detail"], //其他入库单

    [14, "/pages/deviceModule/maintain/repair/list"], // 维修单14
    [15, "/pages/deviceModule/maintain/workOrder/list"], // 保养工单15
    [16, "/pages/deviceModule/inspection/record/list"], //点巡检记录16
    [26, "/pages/deviceModule/maintain/plan/list"], // 保养计划单26
    [27, "/pages/deviceModule/inspection/plan/list"], // 点巡检计划单27
])

export const documentTypeMap = new Map([
    [1, "采购单"], // 采购单
    [2, "采购退货单"], //采购退货单
    [3, "换货单"], //换货单
    [4, "采购入库单"], //采购入库单
    [5, "领料出库单"], //领料出库单  按照后端返回的类型,5是领料出库单
    [6, "退货出库单"], //退货出库单
    [7, "退料入库单"], //退料入库单
    [8, "拆装单"], //拆装单
    [9, "调拨单"], //调拨单
    [10, "盘点单"], //盘点单
    [11, "报废单"], //报废单
    [12, "其他入库单"], //报废单

])

export const documentKeyMap = new Map([
    [1, "procure_no"], // 采购单
    [2, "procure_ret_no"], //采购退货单
    [3, "replacement_no"], //换货单
    [4, "wh_in_no"], //采购入库单
    [5, "wh_rec_no"], //领料出库单  按照后端返回的类型,5是领料出库单
    [6, "wh_ret_no"], //退货出库单
    [7, "wh_recin_no"], //退料入库单
    [8, "split_assemble_no"], //拆装单
    [9, "wh_tra_no"], //调拨单
    [10, "wh_inv_no"], //盘点单
    [11, "wh_scr_no"], //报废单
    [12, "wh_in_no"], //其他入库单
])