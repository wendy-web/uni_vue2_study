/**
 * @example 详情页骨架屏的状态和样式以及统一的 back()回退上一页的方法
 */
const detailMixin = {
	data() {
		return {
			/** 骨架屏状态 */
			skeletonLoading: true,
			/** 骨架屏动画 */
			skeletonAnimate: true,
			/** 骨架屏样式 */
			skeleton: [{
					type: "flex",
					num: 1,
					style: "height:30rpx;padding:20rpx;background: linear-gradient(to left, #DAE3FF, #ECF4FF, #E1E8FF);",
					children: [{
							type: "line",
							num: 1,
							style: "width:200rpx;margin:auto",
						},
						{
							type: "line",
							num: 1,
							style: "width:200rpx;margin:auto",
						},
					],
				},
				30,
				{
					type: "flex",
					num: 1,
					style: "padding:20rpx;background:#fff",
					children: [{
						type: "line",
						num: 4,
						style: [null, "width:560rpx;", "width:400rpx;", "width:200rpx;"],
					}, ],
				},
				50,
				{
					type: "flex",
					num: 1,
					style: "padding:20rpx;height:300rpx;background:#fff;flexDirection:column",
					children: [{
							type: "line",
							num: 1,
							style: "width:200rpx;height:60rpx;",
						},
						{
							type: "line",
							num: 4,
							style: ["width:300rpx;", "width:400rpx;", "width:560rpx;", null],
						},
					],
				},
				50,
				{
					type: "flex",
					num: 1,
					style: "padding:20rpx;height:300rpx;background:#fff;flexDirection:column",
					children: [{
							type: "line",
							num: 1,
							style: "width:200rpx;height:60rpx;",
						},
						{
							type: "line",
							num: 4,
							style: ["width:300rpx;", "width:400rpx;", "width:560rpx;", null],
						},
					],
				},
			],
		}
	},
	methods: {
		// 点击回退到上一页面
		back() {
			uni.navigateBack({
				delta: 1,
			});
		},
	},

}

export default detailMixin