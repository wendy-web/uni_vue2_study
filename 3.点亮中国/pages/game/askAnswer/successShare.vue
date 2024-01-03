<template>
	<view class="success-share">
		<van-popup :show="show" @close="popupClose" custom-style="background-color: transparent;overflow:visible;"
			:close-on-click-overlay="false">
			<view class="success-share-box">
				<image class="close" src="/static/images/close.png" mode="aspectFill" @click="popupClose"></image>
				<!-- 背景 -->
				<van-image width="600rpx" height="924rpx" src="/pages/game/static/success_bg.png" fit="cover"
					use-loading-slot>
					<van-loading slot="loading" type="spinner" size="20" vertical />
				</van-image>
				<view class="success_cont">
					<!-- title -->
					<view class="title">
						点亮中国
					</view>
					<!-- icon -->
					<view class="success-share-icon">
						<van-image width="210rpx" height="224rpx" src="/pages/game/static/love.png" fit="cover"
							use-loading-slot>
							<van-loading slot="loading" type="spinner" size="20" vertical />
						</van-image>
						<view class="city-name">
							{{cityName}}
						</view>
					</view>
					<!-- info -->
					<view class="success-share-info">
						<text class="label">您的成绩为：</text>答对{{size}}题，得{{score}}分
					</view>
					<view class="tools-box">
						<view class="again-light" @click="againClick">再玩一次</view>
					</view>
				</view>
			</view>
		</van-popup>

	</view>
</template>

<script>
	//待分享数据
	let _shareConfig;
	import { mapGetters } from 'vuex';
	export default {
		data() {
			return {
				show: false,
				score: 0,
				cityName: ''
			}
		},
		computed: {
			...mapGetters(['lightModePower']),
			size() {
				if (this.score == 0) return 0
				return this.score / 20;
			}
		},
		methods: {
			popupShow(score, data) {
				_shareConfig = data
				this.score = score
				this.cityName = data.city
				this.show = true
			},
			popupClose() {
				uni.navigateBack({
					fail() {
						uni.reLaunch({
							url: '/pages/tabBar/home/index'
						});
					}
				})
				this.show = false;
			},
			// share() {
			// 	this.show = false;
			// 	this.$emit('share', _shareConfig)
			// },
			// 再玩一次跳转到首页
			againClick() {
				this.show = false;
				if (this.lightModePower['QUIZ']) {
					this.$emit('again')
					return
				}
				this.$emit('periodPopupShow');
			}
		}
	}
</script>

<style lang="scss">
	.success-share {
		.success-share-box {
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
			.title {
				margin-top: 294rpx;
				font-size: 36rpx;
				font-weight: 700;
				color: #000018;
				text-align: center;
			}
			.success-share-icon {
				height: 224rpx;
				margin-top: 19rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;
				.city-name {
					font-size: 48rpx;
					font-weight: 700;
					color: #ffffff;
					position: absolute;
					top: 54rpx;
					margin: auto;
					white-space: nowrap;
				}
			}
		}

		.success-share-info {
			text-align: center;
			font-size: 28rpx;
			font-weight: 700;
			color: #000018;
			margin-top: 56rpx;
			.label {
				color: #4e4d52;
			}
		}
		.tools-box {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 110rpx;
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
