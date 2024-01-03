<template>
	<view class="success-toast">
		<van-popup :show="show" @close="popupClose" custom-style="background-color: transparent;overflow:visible;"
			:close-on-click-overlay="false">
			<view class="success-toast-box">
				<image class="close" src="/static/images/close.png" mode="aspectFill" @click="popupClose"></image>
				<!-- 背景 -->
				<van-image width="600rpx" height="924rpx" src="/pages/game/static/success_bg.png" fit="cover"
					use-loading-slot>
					<van-loading slot="loading" type="spinner" size="20" vertical />
				</van-image>
				<view class="success_cont">
					<!-- icon -->
					<view class="success-toast-icon">
						<van-image width="208rpx" height="196rpx" src="/pages/game/static/success_icon.png" fit="cover"
							use-loading-slot>
							<van-loading slot="loading" type="spinner" size="20" vertical />
						</van-image>
					</view>
					<!-- 詳情 -->
					<view class="success-share-info">
						<text class="label">您的成绩为：</text>答对{{size}}题，得{{score}}分
					</view>
					<view class="tools-box">
						<view class="again-light heartBeat" @click="popupClose">我知道了</view>
					</view>
				</view>
			</view>
		</van-popup>

	</view>
</template>

<script>
	import { mapGetters } from 'vuex';
	export default {
		data() {
			return {
				show: false,
				score: 0
			}
		},
		computed: {
			...mapGetters(['lightModePower']),
			size() {
				if (this.score == 0) return 0
				return this.score / 20
			}
		},
		methods: {
			popupShow(score) {
				this.show = true
				this.score = score
			},
			popupClose() {
				this.show = false;
				if (this.lightModePower['QUIZ']) {
					this.$emit('again');
					return
				}
				this.$emit('periodPopupShow');
			}
		}
	}
</script>

<style lang="scss">
	.success-toast {
		.success-toast-box {
			position: relative;
			width: 600rpx;
			height: 924rpx;
			font-size: 0;
			.close {
				position: absolute;
				width: 56rpx;
				height: 56rpx;
				top: -88rpx;
				right: 0;
			}
		}
		.success_cont {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			.success-toast-icon {
				width: 208rpx;
				height: 196rpx;
				margin-top: 342rpx;
				margin: 342rpx auto 0;
			}
		}
		.success-share-info {
			font-size: 28rpx;
			font-weight: 700;
			color: #000018;
			text-align: center;
			margin-top: 56rpx;
			.label {
				color: #4E4D52;
			}
		}
		.tools-box {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 120rpx;
			.again-light {
				width: 296rpx;
				height: 80rpx;
				line-height: 80rpx;
				background: #1684fc;
				border-radius: 40rpx;
				font-size: 36rpx;
				font-weight: 700;
				text-align: center;
				color: #ffffff;
			}
		}
	}
</style>
