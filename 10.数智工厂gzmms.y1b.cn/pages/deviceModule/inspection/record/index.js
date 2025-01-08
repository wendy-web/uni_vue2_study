/** 提交数据时 转换一下tables数据 */
export function changeTable(list, listId) {
	let arr = list.map((item) => {
		let itemObj = {
			item_content: item.item_content,
			method: item.method,
			record_method: item.record_method,
			std_explain: item.std_explain,
			upper_limit_val: item.upper_limit_val,
			lower_limit_val: item.lower_limit_val,
			note: item.note,
			result_content: changeResultContent(
				item.result_content,
				item.val,
				item.record_method,
				item.upper_limit_val,
				item.lower_limit_val,
			),
		};

		return listId ? { id: item.id, ...itemObj } : itemObj;
	});
	return arr;
}

function isArray(value) {
	return Array.isArray(value);
}


/** 提交数据时转换table里面的 result_content */
export function changeResultContent(
	restContent,
	value,
	method,
	upper_limit_val,
	lower_limit_val,
) {
	if ([0, 1].includes(method)) {
		return restContent.map((item, index) => {
			let { is_check, ...rest } = item;
			return {
				is_check: isArray(value) ? Number(value.includes(index)) : Number(index === value),
				...rest,
			};
		});
	} else if (method === 2) {
		return restContent.map((item, index) => {
			let { is_check, type } = item;
			let is_normal =
				Number(value) > Number(upper_limit_val) || Number(value) < Number(lower_limit_val) ? 1 : 0;
			console.log("🚀 ~ returnrestContent.map ~ is_normal:", is_normal);
			return {
				is_check,
				is_normal: is_normal,
				type,
				val: value,
			};
		});
	} else {
		return restContent.map((item, index) => {
			let { is_check, is_normal, type } = item;
			return {
				is_check,
				is_normal,
				type,
				val: value,
			};
		});
	}
}

/** 转换一下详情返回的item_arr数据 */
export function changeDetail(list) {
	let arr = list.map((item) => {
		let { result_content, record_method } = item;
		return {
			val: getResultContentIndex(result_content, record_method),
			...item,
		};
	});
	return arr;
}

/** 获取index */
function getResultContentIndex(list = [], record_method) {
	if (record_method === 0) {
		let findIndex = list.findIndex((item) => {
			return item.is_check;
		});
		return findIndex;
	} else if (record_method === 1) {
		let indexList = list.map((item, index) => (item.is_check ? index : "")).filter(String);
		return indexList;
	} else if ([2, 3].includes(record_method)) {
		return list[0].val;
	}
}


export function getCheckTotal(tableList = []) {
	let list = changeTable(tableList);
	let newList = list.map((item) => {
		let count = 0;
		let { result_content, record_method } = item;
		if (record_method == 0 || record_method == 1) {
			result_content.forEach((item) => {
				if (item.is_check === 1 && item.is_normal === 1) {
					count++;
				}
			});
		} else if (record_method == 2) {
			result_content.forEach((item) => {
				if (item.is_normal === 1) {
					count++;
				}
			});
		}
		return {
			count,
		};
	});

	let totalCount = 0;

	for (let i = 0; i < newList.length; i++) {
		totalCount += newList[i].count || 0;
	}
	return totalCount
}
export const allScrollList = [
	{
		name: "设备信息",
		scrollId: "#one",
	},
	{
		name: "检查信息",
		scrollId: "#twe",
	},
	{
		name: "检查项内容",
		scrollId: "#three",
	},
	{
		name: "现场照片",
		scrollId: "#four",
	},
	{
		name: "签名",
		scrollId: "#five",
	},
	{
		name: "流程",
		scrollId: "#seven",
	},
]
export const scanScrollList = [
	{
		name: "设备信息",
		scrollId: "#one",
	},
	{
		name: "检查项内容",
		scrollId: "#three",
	},
	{
		name: "现场照片",
		scrollId: "#four",
	},
	{
		name: "签名",
		scrollId: "#five",
	},
]