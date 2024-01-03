<!-- 已过期 -->
<template>
	<view class="lost-efficacy">
		<!-- 右边详情 -->
		<view class="convert-right">
			<!-- 25周年 -->
			<image class="icon-logo" :src="'../static/lostEfficacy'+(config.prizeratetype+24)+'.png'" mode="aspectFill">
			</image>
			<!-- 26周年 -->
			<text class="tcr-top-text">{{CARDTITLES[config.prizeratetype-1]}}</text>
			<view class="tcr-bottom">{{config.create_time}}至{{config.expire}}</view>
			<view class="tcr-bottom product">产品：红牛维生素功能饮料250ml</view>
			<!-- 右边背景 -->
			<image class="right-bg" src="../../../static/images/mcb_bg_white.png"></image>
			<!-- icon -->
			<image class="cr-icon" src="../static/lost_efficacy.png"></image>
		</view>
	</view>
</template>

<script>
	import {CARDTITLES} from '@/utils/configJson.js';
	export default {
		props: {
			config: {
				type: Object
			}
		},
		data(){
		  return {
			  CARDTITLES:CARDTITLES
		  };		 
		}
	};
</script>

<style lang="scss">
	/*未兑换 start*/
	.lost-efficacy {
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
			margin-bottom: 15rpx;
		}

		.tcr-bottom {
			font-size: 20rpx;
			color: #666;
		}
		
		.product{
			color:rgba(102,102,102,0.5);
		}

		.cr-icon {
			width: 109rpx;
			height: 109rpx;
			position: absolute;
			top: 0;
			right: 0;
		}
	}

	/*未兑换 end*/
</style>
