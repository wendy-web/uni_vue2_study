<template>
<van-popup :show="show" @close="popupClose" custom-style="background-color: transparent;"
	:close-on-click-overlay="false" :z-index="10000">
	<view class="exchange-success-box">
		<van-image class="head-bg-icon" width="628rpx" height="564rpx"
			src="https://file.y1b.cn/store/1-0/23713/64afe8fb6623a.png" fit="cover" use-loading-slot>
			<van-loading slot="loading" type="spinner" size="20" vertical />
		</van-image>
		<view class="exchange-success-info">
			优惠券可在<text class="esi-red">我的-优惠券</text>查看
		</view>
		<view class="card-name">{{config.title}}</view>
		<view class="card-price">
			<text class="card-price-unit">¥</text>
			<text>{{config.face_value}}</text>
		</view>
		<view class="take-first" @click="$leftBack">先收下</view>
		<view class="use-button" @click="toUse">去使用</view>
	</view>
</van-popup>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				config: {}
			}
		},
		methods: {
			popupShow(config) {
				this.config = config
				this.show = true
			},
			popupClose() {
				this.show = false
			},
			toUse() {
				this.show = false
				let {
					voucherType,
					is_main,
					article_url,
					main_url,
					video_account_id,
					video_id,
					type_id,
					type_sid
				} = this.config

				switch (voucherType) {
					// 公众号
					case 2:
						let link = is_main === 1 ? article_url : main_url;
						this.$go(`/pages/webview/webview?link=${encodeURIComponent(link)}`);
						break
						// 视频号
					case 3:
						if (wx.openChannelsActivity) {
							wx.openChannelsActivity({
								finderUserName: video_id,
								feedId: video_account_id,
							})
						} else {
							wx.showModal({
								icon: 'none',
								title: '当前微信版本过低',
								content: '升级后再使用,微信版本要求>=8.0.10'
							})
						}
						break
						// 小程序
					case 4:
						wx.navigateToMiniProgram({
							appId: type_id,
							path: type_sid,
							// envVersion: 'trial',
						})
						break
				}
			}
		}
	}
</script>

<style lang="scss">
.exchange-success-box {
	position: relative;
	width: 628rpx;
	height: 564rpx;
	font-size: 0;
}

.exchange-success-info {
	position: absolute;
	top: 124rpx;
	left: 24rpx;
	font-size: 24rpx;
	font-weight: 400;
	color: #666666;
}

.esi-red {
	color: #EF2B20;
}

.card-name {
	position: absolute;
	left: 70rpx;
	top: 236rpx;
	line-height: 1;
	font-size: 32rpx;
	font-weight: 500;
	color: #983b23;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 80%;
}

.card-price {
	position: absolute;
	top: 282rpx;
	right: 100rpx;
	line-height: 1;
	font-size: 60rpx;
	font-weight: 700;
	color: #ffffff;
	letter-spacing: -2rpx;
	display: flex;
	align-items: flex-start;
	transform: skew(-8deg);
}

.card-price-unit {
	font-size: 30rpx;
	font-weight: 700;
	color: #ffffff;
	margin-top: 4rpx;
	margin-right: 6rpx;
}

.take-first {
	width: 200rpx;
	height: 104rpx;
	background-color: #fff1c5;
	border-radius: 12px;
	font-size: 36rpx;
	font-weight: 400;
	text-align: center;
	color: #fb8f10;
	line-height: 104rpx;
	position: absolute;
	left: 24rpx;
	bottom: 48rpx;
}

.use-button {
	width: 356rpx;
	height: 104rpx;
	background: linear-gradient(135deg, #f97f02, #ef2b20);
	border: 2rpx solid;
	border-image: linear-gradient(180deg, rgba(255, 255, 255, 0.30), rgba(255, 255, 255, 0.00)) 1 1;
	border-radius: 12px;
	box-shadow: 0px 4px 12rpx 2rpx rgba(238, 81, 73, 0.50);
	font-size: 36rpx;
	font-weight: 500;
	text-align: center;
	color: #ffffff;
	line-height: 104rpx;
	position: absolute;
	right: 24rpx;
	bottom: 48rpx;
}

.tips {
	font-size: 32rpx;
	font-weight: 400;
	text-align: center;
	color: #983b23;
	position: absolute;
	bottom: 80rpx;
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
	animation: dot 3s infinite step-start both;
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
</style>
