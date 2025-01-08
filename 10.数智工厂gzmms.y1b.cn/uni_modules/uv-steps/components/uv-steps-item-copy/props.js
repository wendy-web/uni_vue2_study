export default {
	props: {
		// 标题
		title: {
			type: [String, Number],
			default: ''
		},
		/* 自定义添加的右侧标题 */
		rightTitle: {
			type: [String, Number],
			default: ""
		},
		/* 自定义添加的右侧描述(时间) */
		rightDesc: {
			type: [String, Number],
			default: ""
		},
		/* 自定义 步骤成功状态 */
		success: {
			type: Boolean,
			default: false,
		},
		/* 自定义是否倒序显示index */
		reverse: {
			type: Boolean,
			default: false,
		},
		// 描述文本
		desc: {
			type: [String, Number],
			default: ''
		},
		// 图标大小
		iconSize: {
			type: [String, Number],
			default: 17
		},
		// 当前步骤是否处于失败状态
		error: {
			type: Boolean,
			default: false
		},

		...uni.$uv?.props?.stepsItem
	}
}