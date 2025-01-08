<template>
	<view v-if="!isHide">
		<view class="user-guidance" :class="{'open':isShow}" @touchmove="close">
			<view class="up-box">
				<image class="up-icon" :src="imgUrl + 'static/network/upward_slide.png'" mode="aspectFill"></image>
			</view>
			<view class="ug-title">
				上滑更多精彩
			</view>
		</view>
	</view>
</template>

<script>
	import {
		setStorage,
		getStorage
	} from '@/utils/auth.js';
	import { getImgUrl } from '@/utils/auth.js';
	let _time = null
	export default {

		data() {
			return {
				isShow: false,
				isHide: false,
				imgUrl: getImgUrl()
			}
		},
		methods: {
			popupInit() {
				let userGuidance = getStorage('userGuidance')
				if (!userGuidance) {
					this.isShow = true
					this.isHide = false
					wx.nextTick(() => {
						this.show()
					})
					setStorage('userGuidance', true)
				} else {
					this.isHide = true
				}
			},
			close() {

				this.isShow = false

				clearTimeout(_time)

				setTimeout(() => {
					this.isHide = true
				}, 300)
			},
			show() {

				_time = setTimeout(() => {

					this.close()

				}, 5000)

			}
		},
		beforeDestroy() {
			clearTimeout(_time)
		}

	}
</script>

<style lang="scss">
	.user-guidance {
		position: fixed;
		top: 40%;
		bottom: 0;
		left: 0;
		width: 100%;
		background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.00), rgba(0, 0, 0, 0.65));
		font-size: 0;
		z-index: 99;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
		padding-bottom: 50rpx;
		transition: 0.3s;
		opacity: 0;

		&.open {
			opacity: 1;
		}

		.up-icon {
			width: 88rpx;
			height: 166rpx;
		}

		.ug-title {
			font-size: 40rpx;
			font-weight: 600;
			color: #ffffff;
			margin-top: 40rpx;
			margin-bottom: 16rpx;
		}

		.ug-time {
			opacity: 0.8;
			font-size: 28rpx;
			font-weight: 400;
			color: #ffffff;
		}
	}
</style>