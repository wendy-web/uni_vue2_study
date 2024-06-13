<template>
<view class="seckill-card">
	<view class="cowpea_box">
		<image class="cowpea_bg" src="https://file.y1b.cn/store/1-0/23713/64afeac5caead.png" mode="aspectFill"></image>
		<text class="cowpea-num">{{config.seckill_credits}}</text>
		<text class="cowpea-label">牛金豆</text>
		<view class="cowpea_value">
			价值￥{{Number(config.face_value)}}
		</view>
		<view class="cowpea_right">即将开始秒杀</view>
	</view>
	<view class="cowpea_cont">
		<view class="cont_box">
			<view class="cont_left">
				<view class="coupon-title">
					{{config.title}}
				</view>
				<!-- 兑换人数 -->
				<view class="exchange-num">
					<!-- {{config.exch_user_num}}人兑换 -->
					{{Number(config.exch_user_num) + Number(config.user_num)}}人兑换
				</view>
			</view>
			<view class="cont_right"  v-if="samePlatform">
				<button open-type="share" class="share_btn"></button>
				<image class="cowpea_bg" :src="subImgUrl + '/share_icon.png'" mode="aspectFill"></image>
			</view>
		</view>
		<view class="seckill_box">
			<image class="seckill_bg" src="https://file.y1b.cn/store/1-0/23713/64afea0b03062.png" mode="aspectFill"></image>
			<view class="seckill_left">
				<image class="seckill_left-icon" :src="subImgUrl +'/xsms_start.png'" mode="aspectFill"></image>
				<text class="cowpea-num">{{config.seckill_credits}}</text>
				<text class="cowpea-label">牛金豆</text>
			</view>
			<!-- 倒计时 -->
			<van-count-down use-slot :time="config.seckillTime" @change="onChange" @finish="finish"
				format="HH:mm:ss:SS">
				<view class="sch-right-diy">
					<view class="label">距开始</view>
					<view  v-if="timeData.days" class="label">{{timeData.days}}天</view>
					<view class="item">{{ timeData.hours}}</view>
					<view class="spot">:</view>
					<view class="item">{{ timeData.minutes}}</view>
					<view class="spot">:</view>
					<view class="item">{{ timeData.seconds}}</view>
				</view>
			</van-count-down>
		</view>
	</view>
</view>
</template>

<script>
 	import { getImgUrl } from '@/utils/auth.js';
	export default {
		props: {
			config: {
				type: Object,
				default () {
					return {
						credits: 0,
						face_value: 0,
						exch_user_num: 0,
						title: ''
					}
				}
			},
			samePlatform: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				timeData: {},
				subImgUrl: `${getImgUrl()}static/subPackages/shopMallModule`,
			}
		},
		methods: {
			finish() {
				this.$emit('finish')
			},
			onChange(e) {
				let {
					days,
					hours,
					minutes,
					seconds,
					milliseconds
				} = e.detail
				hours = hours < 10 ? '0' + hours : hours
				minutes = minutes < 10 ? '0' + minutes : minutes
				seconds = seconds < 10 ? '0' + seconds : seconds
				milliseconds = String(milliseconds).slice(0, 2)
				this.timeData = {
					hours,
					minutes,
					seconds,
					milliseconds,
					days
				}
			}
		}
	}
</script>

<style lang="scss">
.seckill-card {
	position: relative;
	.cowpea_box {
		width: 100%;
		position: relative;
		z-index: 0;
		padding: 22rpx 24rpx 18rpx 24rpx;
		box-sizing: border-box;
		color: #fff;
		display: flex;
		align-items: flex-end;
		.cowpea_bg {
			position: absolute;
			width: 100%;
			height: 152rpx;
			top: 0;
			left: 0;
			z-index: -1;
		}
		.cowpea-num {
			font-size: 48rpx;
			font-family: MiSans, MiSans-Medium;
			font-weight: 500;
			line-height: 1.1;
		}
		.cowpea-label {
			font-size: 28rpx;
			line-height: 40rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 500;
			margin: 0 16rpx 0 6rpx;
		}
		.cowpea_value {
			line-height: 48rpx;
			background: #ffffff;
			border-radius: 24rpx 24rpx 24rpx 0rpx;
			font-size: 28rpx;
			font-family: PingFang SC, PingFang SC-Medium;
			font-weight: 500;
			color: #ea3e34;
			text-align: center;
			padding: 0 22rpx 0 24rpx;
		}
		.cowpea_right{
			flex: 1;
			font-size: 28rpx;
			text-align: right;
			line-height: 40rpx;
		}
	}
	.cowpea_cont {
		margin: 0 24rpx;
		background: #ffffff;
		border-radius: 24rpx 56rpx 24rpx 24rpx;
		position: relative;
		padding: 32rpx 26rpx 32rpx 24rpx;
		box-sizing: border-box;
		.time_icon {
			width: 114rpx;
			height: 40rpx;
			text-align: center;
			background: linear-gradient(135deg,#ffefdf, #fcd5d2);
			border: 2rpx solid #ffd0ce;
			border-radius: 8rpx;
			font-size: 24rpx;
			font-family: YouSheBiaoTiHei, YouSheBiaoTiHei-Regular;
			font-weight: 400;
			color: #f04138;
		}
		.cont_box {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.cont_left {
			flex: 1;
			.coupon-title {
				line-height: 44rpx;
				font-size: 32rpx;
				font-family: PingFang SC, PingFang SC-Semibold;
				font-weight: 600;
				color: #333333;
				line-height: 44rpx;
				margin-bottom: 16rpx;
			}
			.exchange-num {
				font-size: 26rpx;
				font-family: PingFang SC, PingFang SC-Regular;
				font-weight: 400;
				color: #999999;
				line-height: 36rpx;
			}
		}
		.cont_right {
			width: 48rpx;
			height: 48rpx;
			position: relative;
			z-index: 0;
			.cowpea_bg {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				z-index: -1;
			}
			.share_btn {
				width: 100%;
				height: 100%;
				opacity: 0;
			}
		}
	}
	.seckill_box {
		margin-top: 24rpx;
		height: 100rpx;
		padding: 30rpx 24rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
		z-index: 0;
		box-sizing: border-box;
		.seckill_bg {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: -1;
		}
		.seckill_left {
			display: flex;
			align-items: center;
			color: #333333;
			.seckill_left-icon {
				width: 128rpx;
				height: 26rpx;
			}
			.cowpea-num {
				font-size: 40rpx;
				font-weight: 500;
				text-align: left;
				color: #333333;
				line-height: 2;
				margin: -10rpx 8rpx 0;
			}

			.cowpea-label {
				font-size: 24rpx;
				font-family: Barlow, Barlow-6;
				font-weight: 500;
			}
		}
	}

		.seckill-card-head {
			position: absolute;
			left: 0;
			top: -190rpx;
			height: 178rpx;
			width: 100%;
			box-sizing: border-box;
			padding: 12rpx 24rpx;
		}

		.seckill-bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 178rpx;
			border-radius: 12px 12px 28px 12px;
		}

		.sch-left {
			position: relative;
			z-index: 1;
			display: flex;
			align-items: baseline;
			font-size: 30rpx;
			font-weight: 500;
			color: #333333;
			padding-top: 12rpx;
		}
		.label {
			font-size: 24rpx;
			font-weight: 400;
			color: #333333;
			margin-right: 8rpx;
		}
		.item {
			width: 48rpx;
			height: 48rpx;
			background: linear-gradient(135deg, #626262, #333333 100%);
			border-radius: 8rpx;
			font-size: 26rpx;
			font-weight: 500;
			text-align: center;
			color: #fff;
		}
		.spot {
			font-size: 24rpx;
			font-weight: 400;
			color: #333333;
			margin: 0 6rpx;
		}

		.sch-right-diy {
			display: flex;
			line-height: 48rpx;
		}


		.commodity-value-top {
			position: relative;
			padding: 32rpx 24rpx 24rpx;
		}

		.commodity-value-top::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 24rpx;
			right: 24rpx;
			height: 1rpx;
			background-color: #EEEEEE;
		}

		.exchange-num {
			font-size: 24rpx;
			font-family: PingFang SC, PingFang SC-5;
			font-weight: 400;
			color: #999999;
		}

		.exchange-value {
			width: 84rpx;
			height: 84rpx;
			background-image: linear-gradient(135deg, #fbfcfd, #fafbfe);
			border-radius: 8px;
			box-shadow: 2rpx 2rpx 6rpx 2rpx rgba(243, 244, 248, 0.80) inset;
			position: absolute;
			top: 40rpx;
			right: 40rpx;
			text-align: center;
			box-sizing: border-box;
			padding-top: 10rpx;
			line-height: 1;
		}

		.ev-label {
			font-size: 24rpx;
			font-family: PingFang SC, PingFang SC-5;
			font-weight: 400;
			color: #666666;
			margin-bottom: 8rpx;
		}

		.ev-price {
			display: flex;
			justify-content: center;
		}

		.ev-price-unit {
			font-size: 20rpx;
			font-family: PingFang SC, PingFang SC-5;
			font-weight: 400;
			color: #666666;
			margin-top: 4rpx;
		}

		.ev-price-num {
			font-size: 32rpx;
			font-family: Barlow, Barlow-5;
			font-weight: 600;
			color: #666666;
		}
	}
</style>
