<!-- 中奖提示传 -->
<template>

	<view class="win-popup-28" :style="{display: isShow?'block':'none'}">

		<!-- toast 背景 -->
		<image class="xwwh-dialog-bg animated  bounceInDown" src="../static/winPopup28/win_popup28_bg.png"></image>
		<!-- 恭喜获得 -->
		<image class="xwwh-dialog-tips-img animated rubberBand" src="../static/winPopup28/win_popup28_tips.png">
		</image>
		<!-- 主要内容 -->
		<view class="card-coupons animated bounceInRight">
			<!-- 右边背景 -->
			<!-- 25,26,27周年 -->
			<!-- 			<image class="cc-left-icon" :src="'/static/images/mcb_no_converted'+(prizeratetype+24)+'.png'">
			</image>
			<image class="cc-right-bg" src="/static/images/mcb_bg_white.png"></image> -->
			<image class="cc-card" src="../static/winPopup28/win_popup28_card.png" mode=""></image>
			<view class="cc-right-info">
				<view class="cc-r-i-title">{{CARDTITLES[prizeratetype-1]}}</view>
				<view class="cc-r-i-time">领取时间：{{time}}</view>
				<view v-if="prizeratetype >= 3" class="cc-r-i-effective animateFast tadaFast infinite">
					有效期：<text class="day">7</text>天
					<view class="high-light highLight"></view>
				</view>
				<view class="product">产品：红牛维生素功能饮料250ml</view>
			</view>
		</view>
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
		// ,
		// data() {
		// 	return {
		// 		isShow: true,
		// 		prizeratetype: 6
		// 	}
		// }
	};
</script>

<style lang="scss">
	.win-popup-28 {

		//背景
		.xwwh-dialog-bg {
			width: 100%;
			height: 650rpx;
			position: fixed;
			left: 0;
			right: 0;
			z-index: 2;
			top: 150rpx;
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
			width: 580rpx;
			height: 184rpx;
			box-sizing: border-box;
			padding-left: 168rpx;
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
			top: 800rpx;
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
			top: 950rpx;
			left: 50%;
			transform: translateX(-50%);
			z-index: 2;
		}


		//动画出场顺序
		.xwwh-dialog-tips-img {
			-webkit-animation-delay: 0.5s;
			animation-delay: 0.5s;
		}

		.xwwh-xh-dialog-btn {
			-webkit-animation-delay: 2s;
			animation-delay: 2s;
		}

		.cc-card {
			position: absolute;
			z-index: -1;
			top: 0;
			left: 0;
			right: 0;
			height: 184rpx;
			width: auto;
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
			padding-bottom: 60rpx;
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
			bottom: 20rpx;
		}

		.cc-r-i-effective {
			font-size: 22rpx;
			color: #FB619A;
			position: absolute;
			font-weight: bold;
			overflow: hidden;
			-webkit-animation-delay: 2.5s;
			animation-delay: 2.5s;
			bottom: 50rpx;
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
