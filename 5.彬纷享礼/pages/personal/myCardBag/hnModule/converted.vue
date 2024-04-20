<!-- 已用 -->
<template>
	<view class="convert-item">
		<!-- 右边详情 -->
		<view class="convert-right">
			<!-- 头部信息 -->
			<view class="cr-header">
				<image class="icon-logo" src="/pages/personal/static/converted_h_bg.png" mode="aspectFill"></image>
				<!-- 数量 -->
				<view class="num">
					{{config.card_count}}
				</view>
				<!-- 单位 -->
				<view class="unit">
					张
				</view>
			</view>
			<!-- 详情 -->
			<text class="tcr-top-text">红牛换购券</text>
			<view class="tcr-bottom">换购店铺：{{config.shop_name}}</view>
			<view class="tcr-bottom">换购时间：{{config.call_time||config.pay_time}}</view>
			<view class="tcr-bottom product">产品：红牛维生素功能饮料250ml</view>
			<!-- 右边背景 -->
			<image class="right-bg" src="/static/images/mcb_bg_white.png"></image>
			<!-- icon -->
			<image class="cr-icon" src="/pages/personal/static/converted.png"></image>
			<!-- 详情按钮 -->
			<view class="look-info" @click="lookExchangeCode">
				查看详情 >
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
					url: `/pages/personal/exchangeCode/index?codeData=${this.config.out_trade_no}&type=2`
				});
			}
		}
	};
</script>

<style lang="scss">
	/*未兑换 start*/
	.convert-item {
		display: flex;
		align-items: center;
		margin: 50rpx 50rpx;

		.convert-right {
			flex: 1;
			height: 168rpx;
			display: flex;
			padding-left: 188rpx;
			justify-content: center;
			flex-direction: column;
			position: relative;
		}

		.right-bg {
			position: absolute;
			left: 168rpx;
			right: 0;
			width: auto;
			top: 0;
			height: 168rpx;
			z-index: -1;
		}

		.cr-header,
		.icon-logo {
			position: absolute;
			left: 0;
			top: 0;
			width: 168rpx;
			height: 168rpx;
		}

		.tcr-top-text {
			font-size: 30rpx;
			color: #333;
			margin-bottom: 5rpx;
		}

		.tcr-bottom {
			font-size: 20rpx;
			color: #666;
		}

		.product {
			color: rgba(102, 102, 102, 0.5);
		}

		.cr-icon {
			width: 109rpx;
			height: 109rpx;
			position: absolute;
			top: 0;
			right: 0;
		}

		.look-info {
			width: 120rpx;
			height: 44rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 20rpx;
			color: #5BD243;
			position: absolute;
			right: 0;
			bottom: 20rpx;
		}

		.num {
			font-size: 64rpx;
			font-weight: 700;
			color: #FEFEFE;
			position: absolute;
			top: 25rpx;
			left: 50%;
			transform: translateX(-50%);
		}

		.unit {
			font-size: 24rpx;
			color: #FEFEFE;
			font-weight: 500;
			position: absolute;
			bottom: 22rpx;
			left: 50%;
			transform: translateX(-50%);
		}
	}

	/*未兑换 end*/
</style>