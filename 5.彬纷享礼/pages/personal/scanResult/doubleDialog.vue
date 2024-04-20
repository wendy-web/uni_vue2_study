<template>
<van-popup :show="isShow" @close="close" custom-style="background-color: transparent;overflow: visible;"
			:close-on-click-overlay="false" :z-index="10000">
	<view class="double-dialog-body animated  bounceInDown">
		<image class="ddb-bg" src="../static/scanResult/bfxl_scan_reslut_01.png" mode="widthFix"></image>
		<view class="title-text">恭喜你</view>
		<!-- 额外获得 -->
		<view class="dd-btn-item added added-with">
			<view class="added-text-location added-text-font">额外获得{{integral}}积分</view>
			<image class="dd-btn-item-bg added-with" mode="widthFix"
				src="../static/scanResult/bfxl_scan_reslut_02.png"></image>
		</view>
		<!-- 积分获取来源 -->
		<view class="integral-source">
			<image class="tips-icon" src="../static/scanResult/bfxl_scan_reslut_03.png" mode="widthFix"></image>
			<text class="tips-text">看视频获得的积分</text>
		</view>
		<!-- 前往兑换 -->
		<view class="dd-btn-item exchange exchange-width heartBeat" @click="goShopMall">
			<view class="exchange-text-location exchange-text-font">前往换购</view>
			<image class="dd-btn-item-bg exchange-width" mode="widthFix"
				src="../static/scanResult/bfxl_scan_reslut_04.png"></image>
		</view>
		<!-- 关闭按钮 -->
		<image class="double-dialog-close" @click="close" src="/static/images/toast_close.png" mode="aspectFill">
		</image>
	</view>
</van-popup>
</template>

<script>
import { mapGetters } from 'vuex';
	export default {
		data() {
			return {
				isShow: false,
				integral: 0
			};
		},
		computed: {
			...mapGetters(['token'])
		},
		methods: {
			show(integral) {
				this.integral = integral
				this.isShow = true
			},
			close() {
				this.isShow = false
			},
			async goShopMall() {
				const statues = await this.$ttxlUserPositionAsync('code_popover_button');
				this.close();
				!statues && this.$emit('close');
			}
		},
	};
</script>

<style lang="scss" scoped>
		.double-dialog-close {
			width: 70rpx;
			height: 70rpx;
			position: absolute;
			bottom: -100rpx;
			left: 50%;
			transform: translateX(-50%);
		}

		.double-dialog-body {
			width: 636rpx;
			height: 758rpx;
			.ddb-bg {
				width: 100%;
				position: absolute;
				z-index: -1;
				left: 0;
				top: 0;
			}
		}

		.title-text {
			padding-top: 277rpx;
			text-align: center;
			font-size: 68rpx;
			font-weight: bold;
			color: #FFFFFF;
		}

		.added-with {
			width: 482rpx;
			height: 164rpx;
		}

		.added {
			margin-top: 15rpx;
			position: relative;
			margin: auto;
		}

		.dd-btn-item-bg {
			position: absolute;
			left: 0;
			top: 0;
		}

		.added-text-font {
			color: #F8512C;
			font-weight: bold;
			font-size: 48rpx;
			white-space: nowrap;
		}

		.added-text-location {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			top: 38rpx;
			z-index: 1;
		}

		.integral-source {
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 16rpx;
			color: #FFFFFF;
		}

		.tips-icon {
			width: 16rpx;
			margin-right: 5rpx;
		}

		.exchange {
			margin: auto;
			margin-top: 24rpx;
			position: relative;
		}

		.exchange-width {
			width: 314rpx;
			height: 110rpx;
		}

		.exchange-text-font {
			color: #FFFFFF;
			font-weight: bold;
			font-size: 36rpx;
			white-space: nowrap;
		}

		.exchange-text-location {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			top: 20rpx;
			z-index: 1;
		}
</style>
