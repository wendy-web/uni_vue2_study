<template>
	<view class="welfare-converted">
		<!-- card -->
		<image class="wnc-card-icon" :src="config.icon"></image>
		<!-- 背景 -->
		<image class="wnc-bg" src="../static/welfare_item_icon.png"></image>
		<!-- 标识 -->
		<!-- <image class="wnc-icon" src="../static/welfare_collected.png"></image> -->
		<!-- 名称 -->
		<view class="card-info">
			<view class="card-name">
				{{config.name||config.desc}}
			</view>
			<view class="create-time">
				领取时间：{{config.create_time}}
			</view>
		</view>
		<!-- 有效期至 -->
		<!-- 		<view class="expire-time">
			有效期至：{{config.expire_time}}
		</view> -->
		<!-- 去使用 -->
		<view class="to-use" @click="toUse">
			去使用
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			config: {
				type: Object
			}
		},
		methods: {
			toUse() {
				this.$go({
					url: '/pages/webview/webview?link=' + encodeURIComponent(this.config.ext2_desc)
				});
			}
		}
	};
</script>

<style lang="scss">
	.welfare-converted {
		width: 670rpx;
		height: 222rpx;
		position: relative;
		margin: 40rpx;
		display: flex;

		.wnc-card-icon {
			width: 190rpx;
			height: 94rpx;
			margin-top: 30rpx;
			margin-left: 30rpx;
			margin-right: 20rpx;
		}

		.card-name {
			margin-top: 40rpx;
			font-size: 30rpx;
			color: #333;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			max-width: 400rpx;
			margin-bottom: 8rpx;
		}

		.wnc-bg {
			position: absolute;
			width: 100%;
			height: 100%;
			left: 0;
			top: 0;
			z-index: -1;
		}

		.to-use {
			position: absolute;
			right: 20rpx;
			font-size: 20rpx;
			width: 120rpx;
			height: 44rpx;
			box-sizing: border-box;
			border: 2rpx solid;
			color: #ff4d4d;
			border-radius: 5px;
			bottom: 66rpx;
			text-align: center;
			line-height: 40rpx;
		}

		.create-time {
			font-size: 20rpx;
			color: #999;
		}

		.expire-time {
			font-size: 20rpx;
			color: #999;
			position: absolute;
			right: 20rpx;
			bottom: 10rpx;
		}

		.wnc-icon {
			position: absolute;
			top: 10rpx;
			right: 20rpx;
			width: 80rpx;
			height: 80rpx;
		}
	}
</style>