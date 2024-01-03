<template>
	<view class="welfare-not-converted">
		<!-- card -->
		<image class="wnc-card-icon" :src="config.icon"></image>
		<!-- 背景 -->
		<image class="wnc-bg" src="../static/welfare_item_icon.png"></image>
		<!-- 名称 -->
		<view class="card-info">
			<view class="card-name">
				{{config.name||config.desc}}
			</view>
			<!-- 			<view class="create-time">
				领取时间：{{config.create_time}}
			</view> -->
		</view>
		<!-- 去领取 -->
		<view class="to-use" @click="toUse">
			去领取
		</view>
		<!-- 有效期至 -->
		<!-- 		<view class="expire-time">
			有效期至：{{config.expire_time}}
		</view> -->
	</view>
</template>

<script>
	import {
		togifts
	} from '@/api/homeApi.js';
	export default {
		props: {
			config: {
				type: Object
			}
		},
		methods: {
			toUse() {
				togifts({
					gid: this.config.id
				}).then(res => {
					if (res.code == 1) {
						return this.$go({
							url: '/pages/webview/webview?link=' + encodeURIComponent(res.data.url)
						});
					}
					wx.showModal({
						title: '温馨提示',
						content: res.msg,
						showCancel: false
					});
				});
			}
		}
	};
</script>

<style lang="scss">
	.welfare-not-converted {
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
			margin-top: 55rpx;
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

		.to-use,
		.expire-time {
			position: absolute;
			right: 40rpx;
			font-size: 20rpx;
		}

		.to-use {
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

		.expire-time {
			color: #999;
			bottom: 10rpx;
		}

		.create-time {
			font-size: 20rpx;
			color: #999;
		}
	}
</style>