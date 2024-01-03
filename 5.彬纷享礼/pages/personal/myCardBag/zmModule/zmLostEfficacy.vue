<!-- 已用 -->
<template>
	<view class="zm-convert-item">
		<view class="zci-body">
			<!-- 背景 -->
			<image class="card-used-head" src="/pages/personal/static/warHorse/card_ overdue_head.png"
				mode="aspectFill">
			</image>
			<image class="card-used-body" src="/pages/personal/static/warHorse/card_used_body.png" mode="aspectFill">
			</image>
			<!-- 标题 -->
			<view class="zci-title">
				1元乐享战马换购券
			</view>
			<!-- 换购时间 -->
			<view class="zci-time">
				{{config.create_time}}至{{config.expire}}
			</view>
			<!-- icon -->
			<image class="cr-icon" src="/pages/personal/static/lost_efficacy.png"></image>
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

		.card-used-head {
			width: 142rpx;
			height: 150rpx;
			position: absolute;
			left: 0;
			top: 0;
		}

		.card-used-icon {
			width: 50rpx;
			height: 112rpx;
			position: absolute;
			left: 46rpx;
			top: 20rpx;
		}

		.card-used-body {
			width: 552rpx;
			height: 150rpx;
			position: absolute;
			right: 0;
			top: 0;
		}


		.zci-title {
			font-size: 28rpx;
			font-weight: 400;
			color: #000000;
			position: relative;
			z-index: 1;
			margin-top: 38rpx;
			margin-bottom: 18rpx;
			line-height: 1;
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
			width: 130rpx;
			height: 130rpx;
			position: absolute;
			top: 10rpx;
			right: 26rpx;
		}

	}
</style>