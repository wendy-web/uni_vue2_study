export const keyMap = new Map([
	[1, {
		key: "procure_no",
		label: "采购单号"
	}], // 采购单号
	[2, {
		key: "procure_ret_no",
		label: "采购退货单号"
	}], //采购退货单号
	[3, {
		key: "replacement_no",
		label: "换货单号"
	}], //换货单号
	[4, {
		key: "wh_in_no",
		label: "采购入库单号"
	}], //采购入库单号
	[5, {
		key: "wh_ret_no",
		label: "退货出库单号"
	}], //退货出库单号
	[6, {
		key: "wh_rec_no",
		label: "领料出库单号"
	}], //领料出库单号
	[7, {
		key: "wh_recin_no",
		label: "退料入库单号"
	}], //退料入库单号
	[8, {
		key: "split_assemble_no",
		label: "拆装单号"
	}], //拆装单单号
	[9, {
		key: "wh_tra_no",
		label: "调拨单号"
	}], //调拨单单号
	[10, {
		key: "wh_inv_no",
		label: "盘点单号"
	}], //盘点单单号
	[11, {
		key: "wh_scr_no",
		label: "报废单号"
	}], //报废单单号
	[12, {
		key: "wh_in_no",
		label: "其他入库单号"
	}], //其他入库单号
])

export const statusMap = new Map([
	[0, '待提审'],
	[1, "待审核"],
	[2, "待入库"],
	[3, "已完成"],
	[4, "已撤回"],
	[5, "已驳回"],
	[6, "已作废"],
	[7, "已审批"],
	[8, "待领料"],
	[9, "已发料"],
	[10, "待确认"]
])