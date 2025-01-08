<template>
<view class="normal-card">
	<view class="cowpea_box">
		<image class="cowpea_bg" src="https://file.y1b.cn/store/1-0/23713/64afeac5caead.png" mode="aspectFill"></image>
		<text class="cowpea-num">{{ config.is_popover ? 0 : config.credits}}</text>
		<text class="cowpea-label">牛金豆</text>
		<view class="cowpea_value" v-if="Number(config.face_value)">
			<image class="bg_img" src="../static/tag_bg01.png" mode="widthFix"></image>
			￥{{Number(config.face_value)}}
		</view>
	</view>
	<view class="cowpea_cont">
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
			<image class="cowpea_bg" src="../static/share_detail.png" mode="aspectFill"></image>
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
 						title: '',
						is_popover: 0
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
				subImgUrl: `${getImgUrl()}static/subPackages/shopMallModule`,
			}
		}
 	}
 </script>

 <style lang="scss" scoped>
.normal-card {
	position: relative;
	.cowpea_box {
		width: 100%;
		position: relative;
		z-index: 0;
		padding: 22rpx 0 18rpx 24rpx;
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
			font-size: 28rpx;
			padding: 0 8rpx 0 78rpx;
			position: relative;
			z-index: 0;
			min-width: 88rpx;
			font-weight: 600;
			color: #fe4f45;
			text-align: center;
		}
	}
	.cowpea_cont {
		margin: 0 24rpx;
		background: #ffffff;
		border-radius: 24rpx 56rpx 24rpx 24rpx;
		position: relative;
		padding: 32rpx 26rpx 32rpx 24rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
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
}
 </style>
