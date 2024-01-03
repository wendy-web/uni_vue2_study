<template>
	<div class="total-earn-box">
		
	</div>
</template>

<script>
	import {
		parseTime
	} from "@/utils/index.js";
	export default {
		components: {
		},
		data() {
			return {
				navbarColor: "linear-gradient(45deg,#f04037,#f05b37)",
				title: "邀请明细",
				weekMonthTab: [{
						name: "近7天",
						type: "week",
					},
					{
						name: "近30天",
						type: "month",
					},
				],
				wmIndex: 0, //默认选中近7天
				ec: {
					option: {}, //echart 配置项
				},
				selectDate: parseTime(Date.now(), "{y}/{m}"),
				showDatePicker: false, //日期组件弹窗
				timestamp: 0, //选中的日期时间戳
				minDate: new Date(2022, 0, 1),
				maxDate: new Date(Date.now()),
				currentDate: new Date(),

			};
		},
		computed: {},
		methods: {
		
		},
		watch: {},

		// 页面周期函数--监听页面加载
		created() {

		},
		// 页面周期函数--监听页面初次渲染完成
		mounted() {},
		// 页面周期函数--监听页面显示(not-nvue)
		activated() {},
	};
</script>

<style scoped lang="scss">
	@nav-bar-arrow-size: 80rpx;

	/deep/ .van-nav-bar {
		background: linear-gradient(45deg, #f04037, #f05b37);
		position: sticky;
		top: 0;
		z-index: 999;

		.van-icon {
			color: #ffffff;

		}

		.van-nav-bar__text {
			font-size: 36rpx;
			font-family: PingFang SC, PingFang SC-Medium;
			font-weight: 500;
			text-align: left;
			color: #ffffff;
		}
	}

	.total-earn-box {
		max-width: 1280rpx;
		margin: 0 auto;
		.available-withdrawal-box {
			height: 170rpx;
			box-sizing: border-box;
			background: linear-gradient(45deg, #f04037, #f05b37);
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 32rpx;

			.aw-left {
				color: #ffffff;

				.aw-title {
					font-size: 28rpx;
				}

				.aw-amount {
					margin-top: 8rpx;
				}
			}

			.btn-withdrawal {
				width: 120rpx;
				height: 56rpx;
				line-height: 56rpx;
				text-align: center;
				background: #ffffff;
				border-radius: 8rpx;
				font-size: 28rpx;
				color: #ef2b20;


			}
		}



		.income-title {
			box-sizing: border-box;
			padding: 32rpx;
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.it-pseudo-line {

				position: relative;
				padding-left: 14rpx;
				font-size: 32rpx;
				font-family: PingFang SC, PingFang SC-Medium;
				font-weight: 500;
				text-align: left;
				color: #333333;
			}

			.it-pseudo-line::before {
				content: "";
				position: absolute;
				top: 50%;
				left: 0;
				transform: translateY(-50%);
				width: 4rpx;
				height: 26rpx;
				background: #ef2b20;
			}

			.week-month-tab {
				display: flex;
				align-items: center;

				.wm-item {
					font-size: 26rpx;
					color: #333333;
					margin-left: 14rpx;
					padding: 6rpx 18rpx;
					box-sizing: border-box;
				}

				.wm-active {
					background: #f4f4f4;
					border-radius: 24rpx;
				}
			}
		}

		.echart-box {
			box-sizing: border-box;
			height: 600rpx;
			width: 100%;
			padding: 0 20rpx;
		}

		.current-income-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 32rpx;
			margin: 0 32rpx;
			height: 104rpx;
			background: #f7f7f7;
			border-radius: 8rpx;
			box-sizing: border-box;

			.ci-left {
				font-size: 28rpx;
				color: #333333;

				.ci-money {
					font-size: 40rpx;
					font-weight: 500;
					color: #333333;
				}
			}

			.ci-right {
				display: flex;
				align-items: center;
				font-size: 28rpx;
				font-weight: 400;
				color: #333333;

				.icon-date {
					width: 24rpx;
					height: 24rpx;
				}

				.ci-date {
					margin: 0 4rpx;
				}

				.icon-delta {
					width: 20rpx;
					height: 12rpx;
				}
			}
		}

		.date-pop-box {
			height: 600rpx;
			box-sizing: border-box;
			width: 100%;
		}

		// 现金券列表
		.cash-list-box {
			box-sizing: border-box;
			padding: 40rpx 32rpx 40rpx 48rpx;

			.list-item {
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 28rpx;
				font-family: PingFang SC, PingFang SC-Regular;
				font-weight: 400;
				text-align: left;
				color: #333333;
				margin-bottom: 36rpx;

				.item-date {
					font-size: 28rpx;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 400;
					text-align: left;
					color: #cccccc;
				}

				.item-cash {
					font-size: 28rpx;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 400;
					text-align: left;
					color: #333333;
				}
			}
		}
	}
</style>