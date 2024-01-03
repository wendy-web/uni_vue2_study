<template>
	<view class="cont-over">
		<van-popup :show="show" custom-style="background-color: transparent;" @close="popupClose"
			:close-on-click-overlay="false" :z-index="10000">
			<view class="cont-over-box">
				<image class="cont-over_bg" src="/static/images/scanEndbg.png" mode="scaleToFill"></image>
				<image class="cont-over_icon" src="/static/images/scanEndicon.png" mode="scaleToFill"></image>

				<view class="tips-title">今日扫码次数已用完</view>
				<view class="tips-info">罐子别扔，明天可以继续扫哦</view>
				<view class="cont-over-btn">
					<button class="cont_btn" @click="popupClose">知道了</button>
				</view>
			</view>
		</van-popup>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				show: false
			}
		},
		computed: {
			...mapGetters(['isAuthorization'])
		},
		methods: {
			popupShow() {
				this.show = true;
			},
			popupClose() {
				this.show = false;
				if (this.isAuthorization) {
					this.$emit('close')
				}
			}
		}
	}
</script>

<style lang="scss">
	.cont-over {
		.cont-over-box {
			position: relative;
			width: 522rpx;
			height: 690rpx;
			z-index: 0;

			.cont-over_bg {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				z-index: -1;
			}

			.cont-over_icon {
				width: 416rpx;
				height: 328rpx;
				display: block;
				margin: auto;
				position: relative;
				top: -120rpx;
			}
		}

		.tips-title {
			text-align: center;
			padding-bottom: 28rpx;
			font-size: 30rpx;
			font-weight: 400;
			color: #333333;
			margin-top: -80rpx;
		}

		.tips-info {
			text-align: center;
			font-size: 34rpx;
			font-weight: 500;
			text-align: center;
			color: #333333;
			padding-bottom: 152rpx;
		}

		.cont-over-btn {
			display: flex;
			justify-content: space-around;
			align-items: center;

			.cont_btn {
				width: 240rpx;
				height: 72rpx;
				line-height: 72rpx;
				border: 2rpx solid #b94200;
				border-radius: 38rpx;
				color: #b94200;
				font-size: 28rpx;
				background: transparent;
			}
		}

	}
</style>
