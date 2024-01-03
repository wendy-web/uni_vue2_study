<!-- 已用 -->
<template>
	<view class="zm-convert-item">
		<view class="zci-body">
			<!-- 背景 -->
			<image class="card-used-head" src="/pages/personal/static/warHorse/card_used_head.png" mode="aspectFill">
			</image>
			<image class="card-used-body" src="/pages/personal/static/warHorse/card_used_body.png" mode="aspectFill">
			</image>
			<view class="cr-header">
				<!-- 数量 -->
				<view class="num">
					{{config.card_count}}
				</view>
				<!-- 单位 -->
				<view class="unit">
					张
				</view>
			</view>
			<!-- 标题 -->
			<view class="zci-title">
				1元乐享战马换购券
			</view>
			<!-- 换购店铺 -->
			<view class="zci-shop-name">
				换购店铺：{{config.shop_name}}
			</view>
			<!-- 换购时间 -->
			<view class="zci-time">
				换购时间：{{config.call_time||config.pay_time}}
			</view>
			<!-- 战马icon -->
			<image class="card-used-icon" src="/pages/personal/static/warHorse/card_used_icon.png" mode="aspectFill">
			</image>
			<!-- icon -->
			<image class="cr-icon" src="/pages/personal/static/converted.png"></image>
			<!-- 详情按钮 -->
			<view class="look-info" @click="lookExchangeCode">
				查看详情 <van-icon name="arrow" />
			</view>
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
			lookExchangeCode() {
				this.$go({
					url: `/pages/zm/exchangeCode/index?codeData=${this.config.out_trade_no}&type=2`
				});
			}
		}
	};
</script>

<style lang="scss">
	.zm-convert-item {
		display: flex;
		align-items: center;
		margin: 40rpx 20rpx 40rpx 36rpx;

		.zci-body {
			width: 694rpx;
			height: 150rpx;
			position: relative;
			box-sizing: border-box;
			padding-left: 164rpx;
		}

		.card-used-head,
		.cr-header {
			width: 142rpx;
			height: 150rpx;
			position: absolute;
			left: 0;
			top: 0;

		}

		.card-used-body {
			width: 552rpx;
			height: 150rpx;
			position: absolute;
			right: 0;
			top: 0;
		}


		.num {
			font-size: 64rpx;
			font-weight: 700;
			color: #fefefe;
			position: absolute;
			top: 10rpx;
			left: 50%;
			transform: translateX(-50%);
		}

		.unit {
			font-size: 24rpx;
			font-weight: 500;
			color: #fefefe;
			position: absolute;
			bottom: 22rpx;
			left: 50%;
			transform: translateX(-50%);
		}

		.zci-title {
			font-size: 28rpx;
			font-weight: 400;
			color: #000000;
			position: relative;
			z-index: 1;
			margin-top: 24rpx;
			margin-bottom: 16rpx;
			line-height: 1;
		}

		.zci-shop-name {
			font-size: 20rpx;
			font-weight: 400;
			color: #666666;
			position: relative;
			z-index: 1;
			margin-bottom: 2rpx;
		}

		.zci-time {
			opacity: 0.95;
			font-size: 20rpx;
			font-weight: 400;
			color: #666666;
			position: relative;
			z-index: 1;
		}

		.card-used-icon {
			width: 62rpx;
			height: 142rpx;
			position: absolute;
			right: 134rpx;
			top: 50%;
			transform: translateY(-50%);
		}

		.cr-icon {
			width: 80rpx;
			height: 80rpx;
			position: absolute;
			top: 12rpx;
			right: 34rpx;
		}

		.look-info {
			white-space: nowrap;
			font-size: 20rpx;
			color: #5BD243;
			position: absolute;
			right: 12rpx;
			bottom: 8rpx;
			padding: 10rpx;
			z-index: 2;
		}
	}
</style>