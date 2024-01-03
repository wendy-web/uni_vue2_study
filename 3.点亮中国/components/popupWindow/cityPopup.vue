<template>
	<view class="city-popup">
		<van-popup :show="show" @close="popupClose" custom-style="background-color: transparent;"
			:close-on-click-overlay="false">
			<view class="city-popup-box">
				<!-- 背景 -->
				<van-image width="692rpx" height="826rpx"
					src="https://file.y1b.cn/public/img/dlzg/dlzg_citypopup_bg.png" fit="cover" use-loading-slot>
					<van-loading slot="loading" type="spinner" size="20" vertical />
				</van-image>
				<view class="city-popup-cimage" :class="{'un-light':!config.isLightUp}">
					<van-image width="502rpx" height="352rpx" :src="config.cityImage" fit="cover" use-loading-slot>
						<van-loading slot="loading" type="spinner" size="20" vertical />
					</van-image>
				</view>
				<view v-if="config.isLightUp" class="city-popup-sbtn" @click="share">
					分享
				</view>
				<view class="city-popup-sbtn" v-if="isSpeed" @click="speed">
					<van-icon name="play-circle-o" size="50rpx" />
					<text class="cps-text">加速点亮</text>
				</view>
			</view>
			<image class="close" src="/static/images/close.png" mode="aspectFill" @click="popupClose"></image>
		</van-popup>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				config: {
					cityImage: '',
					isLightUp: false,
					cityName: '',
					lightDate: ''
				},
				isSpeed: false
			}
		},
		methods: {
			popupShow(data, isSpeed = false) {
				this.config = data
				this.isSpeed = isSpeed
				this.show = true
			},
			popupClose() {
				this.show = false
				this.$emit('popupClose')
			},
			share() {
				this.$emit('share', {
					...this.config
				});
				this.show = false;
			},
			speed() {
				this.$emit('speed')
			}
		}
	}
</script>

<style lang="scss">
	.city-popup {
		.city-popup-box {
			position: relative;

			&::after {
				content: '';
				position: absolute;
				bottom: -80rpx;
				left: 367rpx;
				width: 2rpx;
				height: 164rpx;
				background-color: #ffffff;
			}
		}

		.close {
			width: 56rpx;
			height: 56rpx;
			display: block;
			margin-left: 340rpx;
			margin-top: 80rpx;
		}

		.city-popup-cimage {
			width: 502rpx;
			height: 352rpx;
			position: absolute;
			left: 120rpx;
			top: 246rpx;
		}

		.city-popup-sbtn {
			width: 340rpx;
			height: 80rpx;
			position: absolute;
			bottom: 98rpx;
			left: 200rpx;
			background: linear-gradient(180deg, #ffad08, #f58631);
			border: 4rpx solid #fedbce;
			font-size: 32rpx;
			font-weight: 700;
			color: #ffffff;
			border-radius: 30px;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.cps-text {
			margin-left: 20rpx;
		}

		.un-light {
			filter: brightness(.4);
		}

	}
</style>
