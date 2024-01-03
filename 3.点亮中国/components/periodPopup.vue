<template>
	<view class="period-popup">
		<van-popup :show="show" custom-style="background-color: transparent;overflow:hidden;"
			:close-on-click-overlay="false" :z-index="10000">
			<image class="jjdl-medal-icon" src="/static/images/jjdl_medal_icon.png" mode="aspectFill"></image>
			<!-- 光圈 -->
			<image class="aperture aperturerRotate" src="https://file.y1b.cn/public/img/dlzg/aperture.png"
				mode="aspectFill"></image>
			<view class="period-popup-box">
				<view class="ppb-tips">
					今日次数已用完，可用其他方式继续
				</view>
				<view class="ppb-tools">
					<view class="ppd-btn ppb-roger" @click="more">
						我知道了
					</view>
					<!-- <view class="ppd-btn ppb-more" @click="more">
						更多点亮方式
					</view> -->
				</view>
			</view>
			<image class="close" src="/static/images/close.png" mode="aspectFill" @click="popupClose"></image>
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
				this.show = true
			},
			popupClose() {
				this.show = false
			},
			more() {
				this.popupClose();
				if (this.isAuthorization) {
					this.$emit('goLightUp');
				}
			}
		}
	}
</script>

<style lang="scss">
	.period-popup {
		position: relative;
		overflow: hidden;

		.period-popup-box {
			position: relative;
			width: 632rpx;
			height: 632rpx;
			box-sizing: border-box;
			background-color: #ffffff;
			border-radius: 10px;
			border: 10rpx solid #fcc982;
			margin-top: -140rpx;
		}

		.jjdl-medal-icon {
			width: 386rpx;
			height: 322rpx;
			display: block;
			margin: 0 auto;
			position: relative;
			z-index: 1;
		}

		.aperture {
			position: absolute;
			top: 0;
			width: 480rpx;
			height: 480rpx;
			left: 50%;
			margin-left: -240rpx;
		}

		.close {
			width: 56rpx;
			height: 56rpx;
			display: block;
			margin: 60rpx auto 0;
		}

		.ppb-tools {
			padding: 170rpx 14rpx 0;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.ppb-tips {
			text-align: center;
			color: #fc9f1d;
			padding-top: 232rpx;
			font-size: 34rpx;
			font-weight: 400;
		}

		.ppd-btn {
			width: 280rpx;
			height: 80rpx;
			box-sizing: border-box;
			border-width: 4rpx;
			border-style: solid;
			border-radius: 44px;
			font-size: 32rpx;
			font-weight: 700;
			color: #ffffff;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.ppb-roger {
			background-color: #3891f1;
			border-color: #a3c8f0;
		}

		.ppb-more {
			background-color: #ff7f48;
			border-color: #ffd0bc;
		}

		.aperturerRotate {
			animation: aperturerRotate 2s linear infinite;
			animation-delay: 0.5s;
		}

		@keyframes aperturerRotate {
			form {
				transform: rotate(0);
			}

			to {
				transform: rotate(180deg);
			}
		}
	}
</style>
