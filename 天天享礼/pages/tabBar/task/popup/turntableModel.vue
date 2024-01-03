<template>
	<view class="turntable-model">
		<van-popup :show="show" @close="popupClose" custom-style="background-color: transparent;overflow:visible;"
			:close-on-click-overlay="false" :z-index="10000">
			<view class="turntable-model-box">
				<image class="tmb-bg" src="https://file.y1b.cn/store/1-0/23714/64b09f8682851.png" mode="aspectFill"></image>
				<!-- head -->
				<image class="tmb-head" :src="imgUrl +'static/popup/turntable_head.png'" mode="aspectFill"></image>
				<!-- title -->
				<view class="tmb-title">
					{{config.title}}
				</view>
				<!-- 关闭按钮 -->
				<view class="tmb-close" @click="popupClose">
					<image class="tmb-close-icon" :src="imgUrl +'static/popup/close.png'" />
				</view>
				<!-- 操作按钮 -->
				<view class="tmb-btn" @click="popupConfirm">
					{{config.btnText}}
				</view>
				<!-- 中牛金豆 -->
				<view class="win-cowpea-box" v-if="config.type == 1">
					<image class="win-cowpea-icon" :src="imgUrl +'static/popup/cowpea_win.png'" mode="aspectFill"></image>
					<view class="win-cowpea-num">
						{{config.reward}}牛金豆
					</view>
				</view>
				<view class="win-card-box" v-else-if="config.type == 2">
					<image class="win-card-icon" :src="imgUrl +'static/popup/turntable_card.png'" mode="aspectFill"></image>
					<view class="win-card-text">
						{{config.coupon_title}}
					</view>
				</view>
				<!-- 未中奖 -->
				<view class="fail-cowpea-box" v-else-if="config.type == 3">
					<image class="fail-cowpea-icon" :src="imgUrl +'static/popup/no_win.png'" mode="aspectFill"></image>
					<view class="fail-cowpea-msg">
						{{config.failMsg}}
					</view>
				</view>
			</view>
		</van-popup>

	</view>
</template>

<script>
	import { getImgUrl } from '@/utils/auth.js';
	export default {
		data() {
			return {
				show: false,
				config: {
					title: '恭喜中奖了',
					tips: '剩余抽奖次数：3',
					reward: 0,
					btnText: '继续抽奖',
					failMsg: '哎呀，就差那么一点点~',
					type: 2, //1牛金豆 2.卡券 3.未中奖
				},
				imgUrl: getImgUrl(),
			}
		},
		methods: {
			popupShow(config) {
				this.config = config
				this.show = true;
			},
			popupClose() {
				this.show = false
				if (this.config.type == 1) {
					this.$emit('startAnim');
				}
			},
			popupConfirm() {
				if (this.config.type == 2) {
					// uni.navigateTo({
					// 	url: `/pages/userModule/serviceRecharge/index?id=${this.config.coupon_id}`
					// });
					// uni.navigateTo({
					// 	url: `/pages/shopMallModule/couponDetails/index?id=${this.config.coupon_id}&applyCouponId=${this.config.coupon_log_id}&isGetWxMsgId=true`
					// });
					uni.navigateTo({
						url: `/pages/userModule/myCoupon/index?applyCouponId=${this.config.coupon_log_id}`
					});
				}
				if (this.config.btnText === '继续抽奖') {
					this.$emit('again', 'BIG_WHEEL')
				}
				this.popupClose()
			}
		}
	}
</script>

<style lang="scss">
	.turntable-model {

		.turntable-model-box {
			width: 578rpx;
			height: 988rpx;
			position: relative;
		}

		.tmb-bg {
			position: absolute;
			width: 578rpx;
			height: 988rpx;
			left: 0;
			top: 0;
			z-index: -1;
		}

		.tmb-head {
			width: 644rpx;
			height: 326rpx;
			position: absolute;
			top: 78rpx;
			left: -50rpx;
			z-index: -1;
		}

		.tmb-title {
			font-size: 28rpx;
			font-family: PingFang SC, PingFang SC-Medium;
			font-weight: 500;
			text-align: center;
			color: #ffffff;
			position: absolute;
			top: 345rpx;
			left: 50%;
			transform: translateX(-50%);
		}

		.tmb-close {
			font-size: 0;
			padding: 28rpx;
			position: absolute;
			right: 0;
			top: 390rpx;
		}

		.tmb-close-icon {
			width: 28rpx;
			height: 28rpx;
		}

		.tmb-btn {
			position: absolute;
			left: 50%;
			bottom: 88rpx;
			transform: translateX(-50%);
			width: 386rpx;
			height: 90rpx;
			background: linear-gradient(135deg, #f97f02, #ef2b20);
			border-image: linear-gradient(180deg, rgba(255, 255, 255, 0.30), rgba(255, 255, 255, 0.00)) 1 1;
			border-radius: 12px;
			box-shadow: 0px 4rpx 12rpx 2rpx rgba(238, 81, 73, 0.50);
			font-size: 36rpx;
			font-family: PingFang SC, PingFang SC-Medium;
			font-weight: 500;
			text-align: center;
			color: #ffffff;
			line-height: 90rpx;
		}

		.win-cowpea-box {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			top: 500rpx;
			text-align: center;
		}

		.win-cowpea-icon {
			width: 124rpx;
			height: 152rpx;
		}

		.win-cowpea-num {
			font-size: 30rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			color: #C05C08;
		}

		.fail-cowpea-box {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			top: 500rpx;
			text-align: center;
		}

		.fail-cowpea-icon {
			width: 200rpx;
			height: 186rpx;
		}

		.fail-cowpea-msg {
			font-size: 28rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			color: #c05c08;
		  	white-space: nowrap;
		}

		.win-card-box {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			top: 550rpx;
			text-align: center;
		}

		.win-card-icon {
			width: 116rpx;
			height: 144rpx;
		}

		.win-card-text {
			font-size: 30rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			color: #c05c08;
		}


	}
</style>
