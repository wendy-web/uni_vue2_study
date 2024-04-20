<template>
	<view class="custom-nav-layout-foot" :style="{background: bgStyle}">
		<view class="cnl-foot-item" @click="goZmHome">
			<image class="cnl-foot-item-icon" src="https://file.y1b.cn/public/hn29th/traceability/icon_09.png"
				mode="aspectFill">
			</image>
			<view class="cnl-foot-item-text">
				战马官网
			</view>
		</view>
		<view class="cnl-foot-item" @click="goZmStar">
			<image class="cnl-foot-item-icon" src="https://file.y1b.cn/public/hn29th/traceability/icon_10.png"
				mode="aspectFill">
			</image>
			<view class="cnl-foot-item-text">
				能量星球
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			bgStyle: {
				type: String,
				default: ""
			}
		},
		methods: {
			goZmHome() {
				const link = "https://www.warhorsechina.com.cn/"
				this.$go({
					url: `/pages/webview/webview?link=${link}`
				});
			},
			goZmStar() {
				this.$navigateToMiniProgram({
					appId: "wx94dca6ef07a54c55",
					path: "pages/home/index",
					envVersion: "release"
				})
			}
		}
	}
</script>

<style>
	.custom-nav-layout-foot {
		width: 100%;
		height: 154rpx;
		padding-top: 24rpx;
		background: #181818;
		position: fixed;
		left: 0;
		bottom: 0;
		display: flex;
		justify-content: space-around;
		z-index: 2;
		border-top: 2rpx solid #111111;
	}

	.cnl-foot-item {
		text-align: center;
		white-space: nowrap;
	}

	.cnl-foot-item-icon {
		width: 60rpx;
		height: 60rpx;
	}

	.cnl-foot-item-text {
		font-size: 28rpx;
		font-weight: 400;
		color: #cbccd6;
		letter-spacing: 2.13rpx;
	}
</style>