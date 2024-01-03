<template>
	<view class="exchange-success">
		<van-popup :show="show" @close="popupClose" custom-style="background-color: transparent;"
			:close-on-click-overlay="false" :z-index="10000" overlay-style="background-color: rgba(0,0,0,0.20);">

			<view class="exchange-success-box">
				<!-- 背景 -->
				<image class="exchange_bg" :src="imgUrl + '/change_bg.png'" mode="aspectFill"></image>
				<!-- title -->
				<view class="exchange-success-title">
					兑换成功
				</view>
				<!-- 价值 -->
				<view class="face-value">
					<image class="face-value-icon" :src="imgUrl + '/card_icon.png'" mode="aspectFill">
					</image>
					<!-- 价值 -->
					<view class="face-value-price">
						{{Number(config.face_value).toLocaleString()}}元
					</view>
				</view>
				<view class="tips">
					<text>
						正前往优惠券使用页
					</text>
					<view class="dotting"></view>
				</view>
			</view>

		</van-popup>

	</view>
</template>

<script>
	import { getImgUrl } from '@/utils/auth.js';
	let _time = null
	export default {
		data() {
			return {
				show: false,
				config: {
					face_value: 0
				},
				imgUrl: `${getImgUrl()}static/subPackages/shopMallModule`,
			}
		},
		methods: {
			popupShow(config) {
				clearTimeout(_time)
				this.config = config;
				if(config.open_mini_type == 2 || config.credits < 1) return this.toUse();
				this.show = true;
				_time = setTimeout(() => {
					this.show = false
					this.toUse();
					// 倒计时从2秒改到4秒 现在确认3秒
				}, 2000);
			},
			popupClose() {
				this.show = false
			},
			goHome() {
				uni.navigateBack({
					fail() {
						uni.reLaunch({
							url: '/pages/tabBar/shopMall/index'
						})
					}
				})
			},
			toUse() {
				let {
					id,
					voucherType,
					is_main,
					article_url,
					main_url,
					video_account_id,
					video_id,
					type_id,
					type_sid,
					open_mini_type,
					qz_url
				} = this.config;
				this.show = false;
				this.$emit('exchangeEnd');
				if (!voucherType || voucherType === 1) {
					this.$emit('openServiceRecharge', id);
					return;
					// 去使用
					// uni.navigateTo({
					// 	url: `/pages/userModule/serviceRecharge/index?id=${id}&source=0`
					// });
					// return;
				}
				switch (voucherType) {
					//公众号
					case 2:
						let link = is_main === 1 ? article_url : main_url;
						uni.redirectTo({
							url: `/pages/webview/webview?link=${encodeURIComponent(link)}`
						});
						break;
						//视频号
					case 3:
						if (wx.openChannelsActivity) {
							wx.openChannelsActivity({
								finderUserName: video_id,
								feedId: video_account_id,
								complete(res) {
									console.log(res)
								}
							});
						} else {
							wx.showModal({
								icon: 'none',
								title: '当前微信版本过低',
								content: '升级后再使用,微信版本要求>=8.0.10'
							});
						}
						break;
						//小程序
					case 4:
						let openMiniProgram = wx.navigateToMiniProgram;
						if(open_mini_type == 2 && wx.canIUse('openEmbeddedMiniProgram')) {
							openMiniProgram =  wx.openEmbeddedMiniProgram;
						}
						openMiniProgram({
							appId: type_id,
							path: type_sid,
							// envVersion: 'trial',
							success: (res) => {
								this.$emit('openMiniSucc', open_mini_type);
							}
						});
						break;
					case 5:
						// 千猪外链
						if (qz_url) {
							uni.redirectTo({
								url: `/pages/webview/webview?link=${encodeURIComponent(qz_url)}`
							});
						}
						break;
				}

			}
		},
		beforeDestroy() {
			clearTimeout(_time)
		}
	}
</script>

<style lang="scss">
	.exchange-success {
		.exchange-success-box {
			position: relative;
			width: 448rpx;
			height: 300rpx;
			font-size: 0;
			.exchange_bg {
				width: 100%;
				height: 100%;
			}
		}
		.exchange-success-title {
			font-size: 26rpx;
			opacity: 0.55;
			font-weight: 400;
			color: #ffffff;
			position: absolute;
			top: 8rpx;
			left: 50%;
			transform: translateX(-50%);
			white-space: nowrap;
		}

		.face-value {
			width: 186rpx;
			height: 114rpx;
			font-size: 0;
			position: absolute;
			top: 77rpx;
			left: 50%;
			transform: translateX(-50%);
		}

		.face-value-icon {
			width: 186rpx;
			height: 114rpx;
		}

		.face-value-price {
			font-size: 34rpx;
			font-weight: 400;
			text-align: center;
			color: #ffffff;
			position: absolute;
			top: 55rpx;
			left: 50%;
			transform: translateX(-50%);
			white-space: nowrap;
		}


		.tips {
			font-size: 28rpx;
			font-weight: 400;
			text-align: center;
			color: #ffffff;
			position: absolute;
			bottom: 40rpx;
			left: 50%;
			transform: translateX(-50%);
			white-space: nowrap;
		}




		.dotting {
			display: inline-block;
			min-width: 2px;
			min-height: 2px;
			box-shadow: 2px 0 currentColor, 6px 0 currentColor, 10px 0 currentColor;
			/* for IE9+, ..., 3个点 */
			animation: dot 2s infinite step-start both;
			/* for IE10+, ... */
		}


		@keyframes dot {
			25% {
				box-shadow: none;
			}

			/* 0个点 */
			50% {
				box-shadow: 2px 0 currentColor;
			}

			/* 1个点 */
			75% {
				box-shadow: 2px 0 currentColor, 6px 0 currentColor;
				/* 2个点 */
			}
		}

	}
</style>