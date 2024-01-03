<!-- 中奖提示传 -->
<template>

	<view class="xh-winning-window-home" :style="{display: isShow?'block':'none'}">

		<!-- toast 背景 -->
		<image class="xwwh-dialog-bg animated  bounceInDown" src="/static/images/dialog_bg.png"></image>
		<!-- toast header -->
		<image :class="'xwwh-dialog-bg-header-'+(prizeratetype+24)+' animated  bounce'"
			:src="'/static/images/dialog_header_'+(prizeratetype+24)+'.png'"></image>
		<!-- 恭喜获得 -->
		<image class="xwwh-dialog-tips-img animated rubberBand" src="/static/images/dialog_tips_img.png">
		</image>
		<!-- 主要内容 -->
		<view class="card-coupons animated bounceInRight">
			<!-- 25,26,27周年 -->
			<image class="cc-left-icon" :src="'/static/images/mcb_no_converted'+(prizeratetype+24)+'.png'">
			</image>
			<!-- 右边背景 -->
			<image class="cc-right-bg" src="/static/images/mcb_bg_white.png"></image>
			<view class="cc-right-info">
				<view class="cc-r-i-title">{{CARDTITLES[prizeratetype-1]}}</view>
				<view class="cc-r-i-time">领取时间：{{time}}</view>
				<view v-if="prizeratetype  >=  3" class="cc-r-i-effective animateFast tadaFast infinite">
					有效期：<text class="day">7</text>天
					<view class="high-light highLight"></view>
				</view>
				<view class="product">产品：红牛维生素功能饮料250ml</view>
			</view>
		</view>
		<!-- 花边 -->
		<image class="xh-winning-window-lace animated bounceIn" src="/static/images/xh_winning_window.png">
		</image>
		<!-- 按钮部分 -->
		<view class="xwwh-xh-dialog-btn animated lightSpeedIn">
			<view class="xdb-item" @click="goCardBag">
				<view class="xdb-item-text deposit">存入卡包</view>
				<image class="xdb-item-bg" src="/static/images/dialog_btn_bg02.png"></image>
			</view>
			<view class="xdb-item">
				<image class="xdb-item-bg" src="/static/images/dialog_btn_bg01.png"></image>
				<button v-if="userInfo.mobile" class="xdb-item exchange" @click="exchange">马上换购</button>
				<button v-else class="xdb-item exchange" open-type="getPhoneNumber"
					@getphonenumber="exchangeBefore">马上换购</button>
			</view>
		</view>

		<!-- 关闭按钮 -->
		<image class="xwwh-xh-dialog-close fadeInOpacity" :style="{display: isShow?'block':'none'}"
			src="/static/images/toast_close.png" @click="close" />
		<!-- 黑幕 -->
		<view class="xh-dialog-black" @touchmove.stop></view>
	</view>

</template>

<script>
	import winMixin from './winMixin.js'

	export default {
		mixins: [winMixin]
	};
</script>

<style lang="scss">
	.xh-winning-window-home {

		//背景
		.xwwh-dialog-bg {
			width: auto;
			height: 614rpx;
			position: fixed;
			left: 44rpx;
			right: 58rpx;
			z-index: 2;
			top: 150rpx;
		}

		// header
		.xwwh-dialog-bg-header-25,
		.xwwh-dialog-bg-header-26,
		.xwwh-dialog-bg-header-27 {
			position: fixed;
			left: 50%;
			z-index: 4;
		}

		.xwwh-dialog-bg-header-27 {
			width: 424rpx;
			height: 258rpx;
			top: 172rpx;
			margin-left: -212rpx;
		}

		.xwwh-dialog-bg-header-26 {
			width: 534rpx;
			height: 268rpx;
			top: 176rpx;
			margin-left: -276rpx;
		}

		.xwwh-dialog-bg-header-25 {
			width: 516rpx;
			height: 266rpx;
			top: 194rpx;
			margin-left: -258rpx;
		}


		// 恭喜获得
		.xwwh-dialog-tips-img {
			width: 294rpx;
			height: 80rpx;
			position: fixed;
			top: 448rpx;
			left: 50%;
			margin-left: -147rpx;
			z-index: 3;
		}

		// 卡劵
		.card-coupons {
			width: 554rpx;
			height: 148rpx;
			position: fixed;
			top: 554rpx;
			left: 50%;
			margin-left: -269rpx;
			display: flex;
			align-items: center;
			border-radius: 5px;
			overflow: hidden;
			z-index: 3;
		}

		//按钮
		.xwwh-xh-dialog-btn {
			position: fixed;
			top: 750rpx;
			left: 50%;
			width: 623rpx;
			margin-left: -304rpx;
			padding-top: 20rpx;
			display: flex;
			justify-content: space-around;
			margin-top: 15rpx;
			z-index: 2;
		}

		.xwwh-xh-dialog-close {
			width: RPX(40);
			height: RPX(40);
			position: fixed;
			top: 900rpx;
			left: 50%;
			transform: translateX(-50%);
			z-index: 2;
		}

		// 花边
		.xh-winning-window-lace {
			position: fixed;
			z-index: 2;
			top: 510rpx;
			left: 20rpx;
			right: 20rpx;
			width: auto;
			height: 500rpx;
		}

		//动画出场顺序
		.xwwh-dialog-tips-img {
			-webkit-animation-delay: 0.5s;
			animation-delay: 0.5s;
		}

		.card-coupons,
		.xh-winning-window-lace {
			-webkit-animation-delay: 1s;
			animation-delay: 1s;
		}

		.xwwh-xh-dialog-btn {
			-webkit-animation-delay: 2s;
			animation-delay: 2s;
		}

		.cc-left-icon {
			width: 148rpx;
			height: 148rpx;
		}

		.cc-right-bg {
			position: absolute;
			z-index: -1;
			left: 148rpx;
			height: 148rpx;
			width: auto;
			right: 0;
			top: 0;
		}

		.cc-right-info {
			flex: 1;
			margin-left: 30rpx;
			padding-bottom: 50rpx;
		}

		.cc-r-i-title {
			font-size: 30rpx;
			color: #333;
			font-weight: bold;
		}

		.cc-r-i-time {
			font-size: 22rpx;
			color: #999;
			margin: 5rpx 0;
		}

		.product {
			font-size: 22rpx;
			color: rgba(102, 102, 102, 0.5);
			position: absolute;
			bottom: 5rpx;
		}

		.cc-r-i-effective {
			font-size: 22rpx;
			color: #FB619A;
			position: absolute;
			font-weight: bold;
			overflow: hidden;
			-webkit-animation-delay: 2.5s;
			animation-delay: 2.5s;
			bottom: 32rpx;
		}

		.day {
			font-size: 30rpx;
			font-weight: bolder;
		}

		.high-light {
			position: absolute;
			height: 100%;
			width: 10rpx;
			top: 0;
			left: -40rpx;
			background-color: #fffde9;
			-webkit-animation-delay: 3.5s;
			animation-delay: 3.5s;
		}

		.deposit {
			color: #F5231F;
		}

		.exchange {
			color: #614900;
		}

	}
</style>
