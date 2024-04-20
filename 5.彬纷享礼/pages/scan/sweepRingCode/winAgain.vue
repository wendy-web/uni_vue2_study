<template>
	<view class="win-again" :style="{display: isShow?'block':'none'}">
		<!-- 旋转背景  -->
		<image class="animated bounceInBgRotate01  bg-rotate" src="../static/animWinAgain/img_7.png"></image>
		<image class="animated bounceInBgRotate02  bg-rotate" src="../static/animWinAgain/img_7.png"></image>
		<!-- 背景一 -->
		<image class="animated bounceInBg01 bg-01" src="../static/animWinAgain/img_5.png"></image>
		<!-- 背景二 -->
		<image class="animated bounceInBg02 bg-02" src="../static/animWinAgain/img_6.png"></image>
		<!-- 礼盒 -->
		<image class="animated tadaGiftBoxTop gift-box-top delay-1s" src="../static/animWinAgain/img_1.png" />
		<image class="animated tadaGiftBoxBottom gift-box-bottom delay-1s" src="../static/animWinAgain/img_2.png" />
		<!-- 恭喜您又中奖了 -->
		<image class="gift-box-again animated bounceInAgainText delay-1s" src="../static/animWinAgain/img_4.png" />
		<!-- 卡劵 -->
		<view class="animated bounceInCardCoupons card-coupons">
			<!-- 25,26,27周年 -->
			<image class="cc-left-icon" :src="cardNotConverted[prizeratetype]">
			</image>
			<!-- 右边背景 -->
			<image class="cc-right-bg" src="/static/images/mcb_bg_white.png"></image>
			<view class="cc-right-info" v-if="prizeratetype<14">
				<view class="cc-r-i-title">{{CARDTITLES[Number(prizeratetype)]}}</view>
				<view class="cc-r-i-time">领取时间：{{time}}</view>
				<!--  有效期 -->
				<view class="cc-r-i-effective animateFast tadaFast infinite">
					有效期：<text class="day">7</text>天
					<view class="high-light highLight"></view>
				</view>
				<view class="product">产品：红牛维生素功能饮料250ml</view>
			</view>
			<!-- 29周年 -->
			<view class="cc-right-29-info" v-else style="line-height: 1;">
				<view class="cc-r-i-title">{{CARDTITLES[Number(prizeratetype)]}}</view>
				<view class="cc-r-i-time" style="margin: 6rpx 0;">领取时间：{{time}}</view>
				<view class="cc-r-i-time" style="margin: 6rpx 0;">有效期：{{expire}}</view>
				<view class="product-29">产品：红牛维生素功能饮料250ml</view>
			</view>
		</view>
		<!-- 按钮部分 -->
		<view class="animated lightSpeedIn xwwh-xh-dialog-btn">
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
		mixins: [winMixin],
		// data() {
		// 	return {
		// 		isShow: true,
		// 		prizeratetype: 14
		// 	}
		// }
	};
</script>

<style lang="scss">
	.win-again {
		.bg-rotate {
			position: absolute;
			width: 720rpx;
			height: 720rpx;
			top: 150rpx;
			z-index: 1;
		}

		.bg-01 {
			position: absolute;
			width: 100%;
			top: 0;
			bottom: 0;
			height: auto;
			z-index: 1;
		}

		.bg-02 {
			position: absolute;
			width: 700rpx;
			height: 710rpx;
			z-index: 1;
			left: 50%;
			top: 50%;
			margin-left: -1250rpx;
			margin-top: -1255rpx;
		}

		.jackpot {
			position: absolute;
			top: 300rpx;
			z-index: 1;
			width: 100%;
		}

		.gift-box-top {
			width: 120rpx;
			height: 79rpx;
			position: absolute;
			z-index: 2;
			left: 50%;
			margin-left: -60rpx;
			top: 300rpx;
		}

		.gift-box-bottom {
			width: 120rpx;
			height: 132rpx;
			position: absolute;
			z-index: 1;
			left: 50%;
			margin-left: -60rpx;
			top: 296rpx;
		}

		.gift-box-again {
			width: 400rpx;
			height: 228rpx;
			position: absolute;
			z-index: 1;
			left: 50%;
			margin-left: -200rpx;
			top: 430rpx;
		}

		// 卡劵
		.card-coupons {
			width: 554rpx;
			height: 148rpx;
			position: absolute;
			top: 415rpx;
			left: 50%;
			margin-left: -269rpx;
			display: flex;
			align-items: center;
			border-radius: 5px;
			overflow: hidden;
			z-index: 3;
			-webkit-animation-delay: 4.5s;
			animation-delay: 4.5s
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
			color: #666;
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
			-webkit-animation-delay: 7s;
			animation-delay: 7s;
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
			-webkit-animation-delay: 8s;
			animation-delay: 8s;
		}

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
			-webkit-animation-delay: 3.3s;
			animation-delay: 3.3s
		}

		.deposit {
			color: #F5231F;
		}

		.exchange {
			color: #614900;
		}


		.xwwh-xh-dialog-close {
			width: RPX(40);
			height: RPX(40);
			position: fixed;
			top: 950rpx;
			left: 380rpx;
			z-index: 2;
			animation-delay: 6.4s;
			-webkit-animation-delay: 6.4s
		}

		.cc-right-29-info {
			flex: 1;
			margin-left: 20rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
		}

		.product-29 {
			font-size: 22rpx;
			color: rgba(102, 102, 102, 0.5);
		}
	}
</style>