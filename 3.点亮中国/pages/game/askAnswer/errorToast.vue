<template>
	<view class="error-toast">
		<van-popup
			:show="show"
			@close="popupClose"
			custom-style="background-color: transparent; overflow:visible"
			:close-on-click-overlay="false"
		>
			<view class="error-toast-box">
				<image class="close" src="/static/images/close.png" mode="aspectFill" @click="popupClose"></image>
				<!-- 背景 -->
				<van-image width="600rpx" height="786rpx" src="/pages/game/static/error_bg.png" fit="cover"
					use-loading-slot>
					<van-loading slot="loading" type="spinner" size="20" vertical />
				</van-image>
				<view class="error_con">
					<!-- icon -->
					<view class="error-toast-icon">
						<van-image width="172rpx" height="172rpx" src="/pages/game/static/error_icon.png" fit="cover"
							use-loading-slot>
							<van-loading slot="loading" type="spinner" size="20" vertical />
						</van-image>
					</view>
					<!-- info -->
					<view class="error-toast-info">
						<view class="eti-tips-01">
							您的成绩为：{{score}}分
						</view>
						<view class="eti-tips-02">
							成绩必须达到60分才能点亮城市
						</view>
					</view>
					<view class="again-over-btn">
						<view class="again_btn" @click="again">再玩一次</view>
						<view class="again_btn active" @click="goToChatGPT">闯关秘籍</view>
					</view>
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
					show: false,
					score: 0,
					scenario_value: 0
				}
			},
			computed: {
				...mapGetters(['lightModePower', 'isAuthorization'])
			},
			methods: {
				popupShow(score, scenario_value = 0) {
					this.show = true
					this.score = score;
					this.scenario_value = scenario_value;
				},
				popupClose() {
					this.show = false
					uni.navigateBack({
						fail() {
							uni.reLaunch({
								url: '/pages/tabBar/home/index'
							})
						}
					})
				},
				again() {
					this.show = false;
					if (this.lightModePower['QUIZ']) {
						this.$emit('again')
						return
					}
					this.$emit('periodPopupShow');
				},
				goToChatGPT() {
					wx.reportEvent("click_secret", {
						authorized_or_not: Number(this.isAuthorization),
						scenario_value: this.scenario_value
					});
					const link = 'https://txc.y1b.cn/api/get/gptview.html?type=1';
					uni.navigateTo({
						url: `/pages/tabBar/webview/webview?link=${encodeURIComponent(link)}`
					});
				}
			}
		}
	</script>
	
	<style lang="scss">
		.error-toast {
			.error-toast-box {
				position: relative;
				width: 600rpx;
				height: 786rpx;
				font-size: 0;
				.close {
					position: absolute;
					width: 56rpx;
					height: 56rpx;
					top: -88rpx;
					right: 0;
				}
			}
			.error_con {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				.error-toast-icon {
					width: 172rpx;
					height: 172rpx;
					margin: 183rpx auto 40rpx;
				}
				.error-toast-info {
					text-align: center;
					.eti-tips-01 {
						font-size: 36rpx;
						font-weight: 700;
						color: #e5404f;
						line-height: 50rpx;
					}
					.eti-tips-02 {
						padding-top: 12rpx;
						font-size: 32rpx;
						font-weight: 400;
						color: #4e4d52;
						line-height: 40rpx;
					}
				}
			}
			.again-over-btn{
				display: flex;
				justify-content: space-around;
				align-items: center;
				margin: 154rpx auto 50rpx;
				.again_btn {
					width: 240rpx;
					box-sizing: border-box;
					line-height: 80rpx;
					text-align: center;
					border: 4rpx solid #f5882e;
					border-radius: 44rpx;
					color: #f5882e;
					font-size: 28rpx;
					width: 240rpx;
					&.active {
						color: #fff;
						background: linear-gradient(180deg,#ffad08, #f58631);
					}
				}
			}
			.van-popup {
			overflow: visible !important;
		}
		}
		
	</style>
	