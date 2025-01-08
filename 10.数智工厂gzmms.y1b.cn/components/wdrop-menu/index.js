/* 使用到的动画css名称 */
const fadeInDown = "animate__newFadeInDown";
const fadeOutUp = "animate__newFadeOutUp"
const fadeIn = "animate__fadeIn";
const fadeOut = "animate__fadeOut";
/**
 * @example 测试用的 部门列表
 */
const deptList = [{
		"id": 6,
		"name": "总经办",
		"pid": 0,
		"top_id": 6,
		"rank": 0,
		"ct_uid": 1,
		"up_uid": 10,
		"create_time": "2023-05-06 09:42:45",
		"_level": 0,
		"_children": []
	},
	{
		"id": 12,
		"name": "仓储品质部",
		"pid": 0,
		"top_id": 12,
		"rank": 0,
		"ct_uid": 1,
		"up_uid": 10,
		"create_time": "2023-06-27 13:45:32",
		"_level": 0,
		"_children": []
	},
	{
		"id": 13,
		"name": "生产技术部",
		"pid": 0,
		"top_id": 13,
		"rank": 0,
		"ct_uid": 1,
		"up_uid": 10,
		"create_time": "2023-06-27 13:45:39",
		"_level": 0,
		"_children": [{
				"id": 23,
				"name": "工程部",
				"pid": 13,
				"top_id": 13,
				"rank": 0,
				"ct_uid": 10,
				"up_uid": null,
				"create_time": "2023-06-28 15:15:30",
				"_level": 1,
				"_children": []
			},
			{
				"id": 24,
				"name": "生产部",
				"pid": 13,
				"top_id": 13,
				"rank": 0,
				"ct_uid": 10,
				"up_uid": null,
				"create_time": "2023-06-28 15:15:40",
				"_level": 1,
				"_children": [{
						"id": 26,
						"name": "广东基地",
						"pid": 24,
						"top_id": 13,
						"rank": 0,
						"ct_uid": 10,
						"up_uid": null,
						"create_time": "2023-06-28 15:15:56",
						"_level": 2,
						"_children": []
					},
					{
						"id": 27,
						"name": "湖北基地",
						"pid": 24,
						"top_id": 13,
						"rank": 0,
						"ct_uid": 10,
						"up_uid": null,
						"create_time": "2023-06-28 15:16:10",
						"_level": 2,
						"_children": []
					},
					{
						"id": 28,
						"name": "江苏基地",
						"pid": 24,
						"top_id": 13,
						"rank": 0,
						"ct_uid": 10,
						"up_uid": null,
						"create_time": "2023-06-28 15:16:19",
						"_level": 2,
						"_children": []
					},
					{
						"id": 29,
						"name": "辽宁基地",
						"pid": 24,
						"top_id": 13,
						"rank": 0,
						"ct_uid": 10,
						"up_uid": null,
						"create_time": "2023-06-28 15:16:26",
						"_level": 2,
						"_children": []
					},
					{
						"id": 30,
						"name": "北京基地",
						"pid": 24,
						"top_id": 13,
						"rank": 0,
						"ct_uid": 10,
						"up_uid": null,
						"create_time": "2023-06-28 15:16:32",
						"_level": 2,
						"_children": []
					},
					{
						"id": 31,
						"name": "贵州基地",
						"pid": 24,
						"top_id": 13,
						"rank": 0,
						"ct_uid": 10,
						"up_uid": null,
						"create_time": "2023-06-28 15:16:37",
						"_level": 2,
						"_children": []
					},
					{
						"id": 32,
						"name": "福建基地",
						"pid": 24,
						"top_id": 13,
						"rank": 0,
						"ct_uid": 10,
						"up_uid": null,
						"create_time": "2023-06-28 15:16:41",
						"_level": 2,
						"_children": []
					}
				]
			},
			{
				"id": 25,
				"name": "测试部",
				"pid": 13,
				"top_id": 13,
				"rank": 0,
				"ct_uid": 10,
				"up_uid": null,
				"create_time": "2023-06-28 15:15:48",
				"_level": 1,
				"_children": []
			}
		]
	},
	{
		"id": 14,
		"name": "人事行政部",
		"pid": 0,
		"top_id": 14,
		"rank": 0,
		"ct_uid": 1,
		"up_uid": 10,
		"create_time": "2023-06-27 14:15:31",
		"_level": 0,
		"_children": []
	},
	{
		"id": 15,
		"name": "采购部",
		"pid": 0,
		"top_id": 15,
		"rank": 0,
		"ct_uid": 1,
		"up_uid": 10,
		"create_time": "2023-06-27 14:15:36",
		"_level": 0,
		"_children": []
	},
	{
		"id": 16,
		"name": "财务部",
		"pid": 0,
		"top_id": 16,
		"rank": 0,
		"ct_uid": 1,
		"up_uid": 10,
		"create_time": "2023-06-27 14:15:44",
		"_level": 0,
		"_children": []
	},
	{
		"id": 17,
		"name": "市场企划部",
		"pid": 0,
		"top_id": 17,
		"rank": 0,
		"ct_uid": 1,
		"up_uid": 10,
		"create_time": "2023-06-27 14:15:52",
		"_level": 0,
		"_children": []
	},
	{
		"id": 18,
		"name": "软件部",
		"pid": 0,
		"top_id": 18,
		"rank": 0,
		"ct_uid": 1,
		"up_uid": 10,
		"create_time": "2023-06-27 14:16:07",
		"_level": 0,
		"_children": []
	},
	{
		"id": 19,
		"name": "运营部",
		"pid": 0,
		"top_id": 19,
		"rank": 0,
		"ct_uid": 10,
		"up_uid": 10,
		"create_time": "2023-06-28 15:09:50",
		"_level": 0,
		"_children": []
	},
	{
		"id": 21,
		"name": "铭天印刷",
		"pid": 0,
		"top_id": 21,
		"rank": 0,
		"ct_uid": 10,
		"up_uid": null,
		"create_time": "2023-06-28 15:13:53",
		"_level": 0,
		"_children": []
	}
]
export {
	fadeInDown,
	fadeOutUp,
	fadeIn,
	fadeOut,
	deptList
}