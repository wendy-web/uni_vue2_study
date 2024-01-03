<template>
	<view class="light-city-popup">
		<van-popup :show="show" @close="popupClose" custom-style="background-color: transparent;"
			:close-on-click-overlay="false" :z-index="10000">
			<view class="light-city-popup-box">
				<!--fa guang beijing-->
				<image class="aperture aperturerRotate" src="https://file.y1b.cn/public/img/dlzg/aperture.png"
					mode="aspectFill"></image>
				<!--shang ban bufen-->
				<view class="lcpb-top">
					<!--title-->
					<view class="lcpb-top-title">
						<image class="lcpb-top-title-icon" src="/static/scan/home_scan_title.png" mode="scaleToFill">
						</image>
						<view class="lcpb-top-title-text">
							{{lightCityTitle}}
						</view>
					</view>
					<!--city-->
					<view class="light-city">
						<text>{{userInfo.city_num == 1?'点亮':''}}</text><text class="city-name">{{config.city}}</text>
					</view>
					<!--love-->
					<view class="love">
						<view class="love-num">
							获得能量+1
						</view>
						<!-- 						<view class="love-btn" @click="goLove">
							去捐献
						</view> -->
					</view>
					<!--省-->
					<view class="province-tips" v-if="config.province">
						点亮{{config.province}}所有城市即可获得勋章哦！
					</view>
				</view>
				<!--xia ban bufen-->
				<view class="city-icon">
					<van-image width="604rpx" height="380rpx" :src="config.image" fit="cover" radius="10px"
						use-loading-slot>
						<van-loading slot="loading" type="spinner" size="20" vertical />
					</van-image>
				</view>
				<!--lian jie lagou-->
				<view class="hook-list">
					<image class="hook-icon" src="/static/scan/home_scan_hook.png" mode="aspectFill"></image>
					<image class="hook-icon" src="/static/scan/home_scan_hook.png" mode="aspectFill"></image>
				</view>
			</view>
			<!-- tools -->
			<!-- 			<view class="tools-box">
				<view class="tools-btn" @click="share">
					炫耀一下
				</view>
				<view class="tools-btn" @click="proceed">
					继续扫码
				</view>
			</view> -->
			<!-- <image class="close" src="/static/images/close.png" mode="aspectFill" @click="show = false"></image> -->
		</van-popup>
	</view>
</template>

<script>
	import {
		parseTime
	} from '@/utils/index.js';
	import {
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				show: false,
				config: {
					image: '',
					city: '',
					need_scan_num: 0,
					province: '',
					scan_num: 0
				}
			}
		},
		computed: {
			...mapGetters(['userInfo']),
			lightCityTitle() {
				if (!this.userInfo) {
					return '成功点亮'
				}
				return this.userInfo.city_num > 1 ? '成功点亮' : '欢迎参与'
			}
		},
		methods: {
			showTime(data) {
				this.config = data
				this.show = true
				setTimeout(() => {
					this.popupClose()
				}, 4000)
			},
			popupClose() {
				this.show = false
				this.$emit('lightCityClose')
			},
			goLove() {
				this.show = false
				//直接跳详情
				uni.navigateTo({
					url: `/pages/love/loveDetails/index?com_id=1&type=0`
				})
			},
			proceed() {
				this.show = false
				this.$emit('scan')
			},
			share() {
				this.show = false
				let today = parseTime(Date.now(), '{y}-{m}-{d}')
				uni.navigateTo({
					url: `/pages/user/lightRecord/index?type=0&cityImage=${this.config.image}&cityName=${this.config.city}&lightDate=${today}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.light-city-popup {
		.light-city-popup-box {
			position: relative;
			padding-top: 152rpx;
			overflow: hidden;
		}

		.lcpb-top {
			position: relative;
			width: 604rpx;
			background-color: #ffffff;
			border-radius: 10px;
			padding-top: 100rpx;
			padding-bottom: 24rpx;
		}

		.lcpb-top-title {
			position: absolute;
			width: 534rpx;
			height: 88rpx;
			left: 50%;
			top: -15.6rpx;
			transform: translateX(-50%);
			font-size: 48rpx;
			font-weight: 700;
			color: #ffffff;
			text-align: center;
			line-height: 75rpx;
		}

		.lcpb-top-title-icon {
			position: absolute;
			width: 534rpx;
			height: 80rpx;
			left: 0;
			top: 0;
		}

		.lcpb-top-title-text {
			position: relative;
			z-index: 1;
		}

		.light-city {
			font-size: 48rpx;
			font-weight: 700;
			color: #000018;
			text-align: center;
		}

		.aperture {
			position: absolute;
			top: 0;
			left: 0;
			width: 604rpx;
			height: 604rpx;
		}

		.city-name {
			color: #017BFF;
			margin-left: 20rpx;
		}

		.love {
			display: flex;
			padding: 20rpx 30rpx 18rpx;
			justify-content: space-between;
			align-items: center;
		}

		.love-num {
			font-size: 36rpx;
			font-weight: 400;
			color: #37373a;

			.van-icon {
				margin-left: 5rpx;
			}
		}

		.love-btn {
			width: 144rpx;
			height: 56rpx;
			border: 2rpx solid #ff7f48;
			border-radius: 15px;
			font-size: 28rpx;
			font-weight: 400;
			text-align: center;
			color: #ff7f48;
			line-height: 56rpx;
		}

		.province-tips {
			font-size: 28rpx;
			font-weight: 400;
			color: #8b8b8b;
			padding-left: 30rpx;
			padding-top: 14rpx;
			border-top: 1rpx solid rgba(255, 127, 72, .15);
		}

		.hook-list {
			position: absolute;
			top: 472rpx;
			left: 0;
			right: 0;
			padding: 0 86rpx;
			display: flex;
			justify-content: space-between;
			font-size: 0;
		}

		.hook-icon {
			width: 14rpx;
			height: 66rpx;
		}

		.city-icon {
			margin-top: 20rpx;
			font-size: 0;
		}

		.tools-box {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 40rpx;
			margin-bottom: 50rpx;
		}

		.tools-btn {
			width: 280rpx;
			height: 80rpx;
			border-radius: 22px;
			text-align: center;
			line-height: 80rpx;
			font-size: 32rpx;
			font-weight: 700;
			color: #ffffff;
		}

		.tools-btn:first-child {
			background-color: #3891f1;
			border: 4rpx solid #a1ceff;
		}

		.tools-btn:last-child {
			background-color: #ff7f48;
			border: 4rpx solid #ffd0bc;
		}

		.close {
			width: 56rpx;
			height: 56rpx;
			display: block;
			margin: 0 auto;
		}

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
</style>
