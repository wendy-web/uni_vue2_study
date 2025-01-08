export const statusMap = new Map([
	[0, '待提审'],
	[1, "待审核"],
	[3, "已完成"],
	[4, "已撤回"],
	[5, "已驳回"],
	[6, "已作废"],
	[7, "已审批"],
	[8, "待领料"],
	[9, "已发料"],
	[10, "待确认"]
])

/**
 *
 * @param assocType 接口返回的assoc_type数组 number[]
 * @param query 需要判断的值 number | number[]
 * @returns
 */
export const checkAssocType = (assocType, query) => {
	if (Array.isArray(query)) {
		return query.some((item) => assocType.includes(item));
	}
	if (assocType.includes(query)) {
		return true;
	} else {
		return false;
	}
};