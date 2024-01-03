<template>
	<view class="win-again-four" :style="{display: isShow?'block':'none'}">
		<!-- 满天星 -->
		<image class="animated anim-waf-8 babys-breath" src="../static/winAgainFour/img_8.png"></image>
		<!-- 底盘背景 -->
		<image class="animated anim-waf-26  chassis" src="../static/winAgainFour/img_26.png"></image>
		<!-- 金元宝 -->
		<image class="animated anim-waf-26 gold-ingot" src="../static/winAgainFour/img_11.png"></image>
		<!-- 金币 -->
		<image class="animated anim-waf-9 gold-coin" src="../static/winAgainFour/img_9.png"></image>
		<!-- 财神爷 -->
		<view class="animated anim-waf-csy god-wealth">
			<!-- 头 -->
			<image class="animated anim-waf-13 god-wealth-header" src="../static/winAgainFour/img_13.png"></image>
			<!-- 身子 -->
			<image class="animated anim-waf-16 god-wealth-hand" src="../static/winAgainFour/img_16.png"></image>
			<image class="god-wealth-body" src="../static/winAgainFour/img_15.png"></image>
			<!-- 脚 -->
			<image class="god-wealth-foot" src="../static/winAgainFour/img_17.png"></image>
		</view>
		<!-- 灯光 -->
		<image class="animated anim-waf-10 lighting" src="../static/winAgainFour/img_10.png"></image>
		<!-- 红包 -->
		<image class="animated anim-waf-18 all-around-red" src="../static/winAgainFour/img_18.png"></image>
		<!-- 左边花边 -->
		<image class="animated anim-waf-23 left-lace-03" src="../static/winAgainFour/img_23.png"></image>
		<image class="animated anim-waf-19 left-lace-02" src="../static/winAgainFour/img_19.png"></image>
		<image class="animated anim-waf-14 left-lace-01" src="../static/winAgainFour/img_14.png"></image>
		<!-- 右边花边 -->
		<image class="animated anim-waf-22 right-lace-03" src="../static/winAgainFour/img_22.png"></image>
		<image class="animated anim-waf-21 right-lace-02" src="../static/winAgainFour/img_21.png"></image>
		<image class="animated anim-waf-20 right-lace-01" src="../static/winAgainFour/img_20.png"></image>
		<!-- 牛气冲天 -->
		<image class="animated anim-waf-6 hydt-bg" src="../static/winAgainFour/img_6.png"></image>
		<image class="animated anim-waf-0 hydt-h" src="../static/winAgainFour/img_0.png"></image>
		<image class="animated anim-waf-1 hydt-y " src="../static/winAgainFour/img_1.png"></image>
		<image class="animated anim-waf-2 hydt-d" src="../static/winAgainFour/img_2.png"></image>
		<image class="animated anim-waf-3 hydt-t" src="../static/winAgainFour/img_3.png"></image>
		<!-- 您已连续中奖 -->
		<image class="animated anim-waf-4 win-Again-tips" src="../static/winAgainFour/img_4.png"></image>
		<image class="animated anim-waf-5 wa-four" src="../static/winAgainFour/img_5.png"></image>
		<!-- 卡劵 -->
		<view class="animated bounceIn card-coupons">
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
		<!-- 按钮部分 -->
		<view class="animated wat-show-btn wat-gocardbag" @click="goCardBag">
			<image class="xdb-item-bg" src="../static/winAgainThree/img_6.png"></image>
		</view>
		<view class="animated wat-show-btn wat-exchange">
			<image class="xdb-item-bg" src="../static/winAgainThree/img_7.png"></image>
			<button v-if="userInfo.mobile" class="xdb-item-bg" @click="exchange"></button>
			<button v-else class="xdb-item-bg" open-type="getPhoneNumber" @getphonenumber="exchangeBefore"></button>
		</view>
		<!-- 关闭按钮 -->
		<image class="wat-show-btn xwwh-xh-dialog-close" src="/static/images/toast_close.png" @click="close" />
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
		// 		prizeratetype: 6
		// 	}
		// }
	};
</script>

<style lang="scss">
	.win-again-four {

		.chassis {
			width: 535rpx;
			height: 153rpx;
			position: absolute;
			z-index: 1;
			top: 670rpx;
			left: 50%;
			margin-left: -267.5rpx;
		}

		.gold-ingot {
			width: 197rpx;
			height: 119rpx;
			position: absolute;
			z-index: 3;
			top: 600rpx;
			left: 50%;
			margin-left: -98.5rpx;
			animation-delay: 0.4s;
		}

		.babys-breath {
			width: 714rpx;
			height: 579rpx;
			position: absolute;
			z-index: 1;
			top: 218rpx;
			left: 50%;
			margin-left: -357rpx;
			opacity: 0;
		}

		.gold-coin {
			width: 349rpx;
			height: 139rpx;
			position: absolute;
			z-index: 1;
			top: 614rpx;
			right: 118rpx;
		}

		.god-wealth {
			position: absolute;
			top: 358rpx;
			z-index: 2;
			left: 250rpx;
			width: 250rpx;
			height: 280rpx;
		}

		.god-wealth-header {
			width: 252rpx;
			height: 177rpx;
			position: absolute;
			z-index: 2;
		}

		.god-wealth-body {
			width: 236rpx;
			height: 152rpx;
			position: absolute;
			z-index: 1;
			top: 138rpx;
		}

		.god-wealth-hand {
			width: 83rpx;
			height: 115rpx;
			position: absolute;
			z-index: 0;
			top: 100rpx;
			left: -18rpx;
		}

		.god-wealth-foot {
			width: 189rpx;
			height: 38rpx;
			position: absolute;
			z-index: 0;
			top: 240rpx;
		}

		.lighting {
			width: 709rpx;
			height: 303rpx;
			position: absolute;
			top: 416rpx;
			left: 50%;
			margin-left: -354.5rpx;
		}

		.all-around-red {
			width: 722rpx;
			height: 683rpx;
			position: absolute;
			top: 205rpx;
			left: 25rpx;
			z-index: 1;
		}

		.left-lace-01 {
			width: 110rpx;
			height: 115rpx;
			position: absolute;
			top: 628rpx;
			left: 224rpx;
			z-index: 2;
		}

		.left-lace-02 {
			width: 137rpx;
			height: 176rpx;
			position: absolute;
			z-index: 1;
			top: 552rpx;
			left: 146rpx;
			transform: rotate(20deg);
		}

		.left-lace-02 {
			width: 137rpx;
			height: 176rpx;
			position: absolute;
			z-index: 1;
			top: 568rpx;
			left: 112rpx;
			transform-origin: right bottom;
			transform: rotate(20deg);
		}

		.left-lace-03 {
			width: 191rpx;
			height: 188rpx;
			position: absolute;
			z-index: 1;
			top: 514rpx;
			left: 108rpx;
			transform-origin: right bottom;
			transform: rotate(20deg);
		}

		.right-lace-01 {
			width: 97rpx;
			height: 95rpx;
			position: absolute;
			z-index: 1;
			top: 587rpx;
			right: 230rpx;
			transform-origin: left bottom;
			transform: rotate(37deg);
		}

		.right-lace-02 {
			width: 194rpx;
			height: 208rpx;
			position: absolute;
			z-index: 1;
			top: 426rpx;
			right: 230rpx;
			transform-origin: left bottom;
			transform: rotate(37deg);
		}

		.right-lace-03 {
			width: 250rpx;
			height: 245rpx;
			position: absolute;
			z-index: 1;
			top: 460rpx;
			right: 22rpx;
			transform-origin: left bottom;
			transform: rotate(-30deg);
		}

		.hydt-bg {
			width: 569rpx;
			height: 233rpx;
			position: absolute;
			z-index: 2;
			top: 115rpx;
			left: 50%;
			margin-left: -284.5rpx;
		}

		.hydt-h {
			width: 174rpx;
			height: 127rpx;
			position: absolute;
			top: 200rpx;
			left: 100rpx;
			z-index: 1;
		}

		.hydt-y {
			width: 130rpx;
			height: 104rpx;
			position: absolute;
			top: 215rpx;
			left: 270rpx;
			z-index: 1;
		}

		.hydt-d {
			width: 128rpx;
			height: 103rpx;
			position: absolute;
			top: 210rpx;
			left: 388rpx;
			z-index: 1;
		}

		.hydt-t {
			width: 150rpx;
			height: 127rpx;
			position: absolute;
			top: 192rpx;
			left: 500rpx;
			z-index: 1;
		}

		.win-Again-tips {
			width: 415rpx;
			height: 66rpx;
			position: absolute;
			top: 125rpx;
			left: 50%;
			z-index: 2;
			margin-left: -207.5rpx;
		}

		.wa-four {
			width: 341rpx;
			height: 148rpx;
			position: absolute;
			top: 206rpx;
			left: 50%;
			z-index: 2;
			margin-left: -170.5rpx;
		}



		// 卡劵
		.card-coupons {
			width: 554rpx;
			height: 148rpx;
			position: absolute;
			top: 175rpx;
			left: 50%;
			margin-left: -269rpx;
			display: flex;
			align-items: center;
			border-radius: 5px;
			overflow: hidden;
			z-index: 1;
			-webkit-animation-delay: 5s;
			animation-delay: 5s
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
			-webkit-animation-delay: 6s;
			animation-delay: 6s;
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
			-webkit-animation-delay: 7s;
			animation-delay: 7s;
		}


		.wat-gocardbag,
		.wat-exchange {
			width: 238rpx;
			height: 68rpx;
			position: absolute;
			z-index: 1;
			top: 875rpx;

			.xdb-item-bg {
				width: 238rpx;
				height: 68rpx;
				position: absolute;
				left: 0;
				top: 0;
				z-index: -1;
			}

			& button:after {
				border: none;
			}

			& button {
				background-color: transparent;
				padding: 0;
			}
		}

		.wat-gocardbag {
			left: 60px;
			animation-delay: 5.5s;
			-webkit-animation-delay: 5.5s
		}

		.wat-exchange {
			left: 400rpx;
			animation-delay: 5.7s;
			-webkit-animation-delay: 5.7s
		}

		.xwwh-xh-dialog-close {
			width: RPX(40);
			height: RPX(40);
			position: fixed;
			top: 1000rpx;
			left: 350rpx;
			z-index: 2;
			animation-delay: 5.9s;
			-webkit-animation-delay: 5.9s
		}

	}


	@-webkit-keyframes anim-waf-26 {
		0% {
			opacity: 0;
			-webkit-transform: scaleX(0.1) scaleY(0.1);
		}

		46% {
			opacity: 1;
			-webkit-transform: scaleX(1.1) scaleY(1.1);
		}

		74% {
			-webkit-transform: scaleX(0.9) scaleY(0.9);
		}

		100% {
			opacity: 1;
			-webkit-transform: scaleX(1) scaleY(1);
		}
	}

	@-webkit-keyframes anim-waf-8 {
		0% {
			opacity: 1;
		}

		50% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}

	@-webkit-keyframes anim-waf-9 {
		0% {
			opacity: 0;
			-webkit-transform: scaleX(0.1) scaleY(0.1);
		}

		46% {
			opacity: 1;
			-webkit-transform: scaleX(1.05) scaleY(1.05);
		}

		74% {
			-webkit-transform: scaleX(0.95) scaleY(0.95);
		}

		100% {
			opacity: 1;
			-webkit-transform: scaleX(1) scaleY(1);
		}
	}

	@-webkit-keyframes anim-waf-10 {
		0% {
			opacity: 0;

		}

		100% {
			opacity: 1;
		}
	}

	@-webkit-keyframes anim-waf-19 {
		0% {
			-webkit-transform: rotate(60deg);
			-webkit-transform-origin: right bottom;
			opacity: 0;
			transform: rotate(60deg);
			transform-origin: right bottom
		}

		to {
			-webkit-transform: translateZ(0) rotate(20deg);
			-webkit-transform-origin: right bottom;
			opacity: 1;
			transform: translateZ(0) rotate(20deg);
			transform-origin: right bottom
		}
	}

	@-webkit-keyframes anim-waf-20 {
		0% {
			-webkit-transform: rotate(-30deg);
			-webkit-transform-origin: left bottom;
			opacity: 0;
			transform: rotate(-30deg);
			transform-origin: left bottom
		}

		to {
			-webkit-transform: translateZ(0) rotate(37deg);
			-webkit-transform-origin: left bottom;
			opacity: 1;
			transform: translateZ(0) rotate(37deg);
			transform-origin: left bottom
		}
	}

	@-webkit-keyframes anim-waf-22 {
		0% {
			-webkit-transform: rotate(-60deg);
			-webkit-transform-origin: left bottom;
			opacity: 0;
			transform: rotate(-60deg);
			transform-origin: left bottom
		}

		to {
			-webkit-transform: translateZ(0) rotate(-30deg);
			-webkit-transform-origin: left bottom;
			opacity: 1;
			transform: translateZ(0) rotate(-30deg);
			transform-origin: left bottom
		}
	}

	@-webkit-keyframes anim-waf-0 {

		0%,
		17.5%,
		26.25%,
		35% {
			animation-timing-function: ease;
		}

		0% {
			opacity: 0;
			-webkit-transform: scaleX(6) scaleY(6);
		}

		17.5% {
			opacity: 1;
			-webkit-transform: scaleX(1.1) scaleY(1.1);
		}

		26.25% {
			-webkit-transform: scaleX(0.9) scaleY(0.9);
		}

		35%,
		65% {
			opacity: 1;
			-webkit-transform: scaleX(1) scaleY(1);
		}

		100% {
			opacity: 0;
		}
	}

	@-webkit-keyframes anim-waf-1 {

		0%,
		19%,
		29%,
		38.8% {
			animation-timing-function: ease-in;
		}

		0% {
			opacity: 0;
			-webkit-transform: scaleX(6) scaleY(6);
		}

		19% {
			opacity: 1;
			-webkit-transform: scaleX(1.1) scaleY(1.1);
		}

		29% {
			-webkit-transform: scaleX(0.9) scaleY(0.9);
		}

		38.8%,
		61% {
			opacity: 1;
			-webkit-transform: scaleX(1) scaleY(1);
		}

		100% {
			opacity: 0;
		}
	}

	@-webkit-keyframes anim-waf-2 {

		0%,
		21.8%,
		32.8%,
		43.75% {
			animation-timing-function: ease-in;
		}

		0% {
			opacity: 0;
			-webkit-transform: scaleX(6) scaleY(6);
		}

		21.8% {
			opacity: 1;
			-webkit-transform: scaleX(1.1) scaleY(1.1);
		}

		32.8% {
			-webkit-transform: scaleX(0.9) scaleY(0.9);
		}

		43.75%,
		56.25% {
			opacity: 1;
			-webkit-transform: scaleX(1) scaleY(1);
		}

		100% {
			opacity: 0;
		}
	}

	@-webkit-keyframes anim-waf-3 {

		0%,
		25%,
		37.5%,
		50% {
			animation-timing-function: ease-in;
		}

		0% {
			opacity: 0;
			-webkit-transform: scaleX(6) scaleY(6);
		}

		25% {
			opacity: 1;
			-webkit-transform: scaleX(1.1) scaleY(1.1);
		}

		37.5% {
			-webkit-transform: scaleX(0.9) scaleY(0.9);
		}

		50%,
		51% {
			opacity: 1;
			-webkit-transform: scaleX(1) scaleY(1);
		}

		100% {
			opacity: 0;
		}
	}


	@-webkit-keyframes anim-waf-4 {

		0%,
		25%,
		37.5%,
		50% {
			animation-timing-function: ease-in;
		}

		0% {
			opacity: 0;
			-webkit-transform: scaleX(0.1) scaleY(0.1);
		}

		25% {
			opacity: 1;
			-webkit-transform: scaleX(1.05) scaleY(1.05);
		}

		37.5% {
			-webkit-transform: scaleX(0.95) scaleY(0.95);
		}

		50%,
		63.15% {
			opacity: 1;
			-webkit-transform: scaleX(1) scaleY(1);
		}

		100% {
			opacity: 0;
		}
	}

	@-webkit-keyframes anim-waf-13 {

		0% {
			transform: rotate(0);
		}

		50% {
			transform: rotate(10deg);
		}

		100% {
			transform: rotate(0);
		}
	}

	@-webkit-keyframes anim-waf-16 {

		0% {
			transform: rotate(-20deg);
		}

		50% {
			transform: rotate(15deg);
		}

		100% {
			transform: rotate(-20deg);
		}
	}

	.anim-waf-16 {
		-webkit-animation: anim-waf-16 1s 1s infinite linear normal forwards;
	}

	.anim-waf-13 {
		-webkit-animation: anim-waf-13 1s 1s infinite linear normal forwards;
	}

	.anim-waf-4 {
		animation-name: anim-waf-4;
		animation-duration: 1.9s;
		animation-delay: 3s;
		animation-fill-mode: both;
	}

	.anim-waf-5 {
		animation-name: anim-waf-3;
		animation-duration: 1.4s;
		animation-delay: 3.5s;
		animation-fill-mode: both;
	}

	.anim-waf-0 {
		animation-name: anim-waf-0;
		animation-duration: 2s;
		animation-delay: 1.4s;
		animation-fill-mode: both;
	}

	.anim-waf-1 {
		animation-name: anim-waf-1;
		animation-duration: 1.8s;
		animation-delay: 1.6s;
		animation-fill-mode: both;
	}

	.anim-waf-2 {
		animation-name: anim-waf-2;
		animation-duration: 1.6s;
		animation-delay: 1.8s;
		animation-fill-mode: both;
	}

	.anim-waf-3 {
		animation-name: anim-waf-3;
		animation-duration: 1.4s;
		animation-delay: 2s;
		animation-fill-mode: both;
	}



	.anim-waf-22 {
		animation-name: anim-waf-22;
		animation-delay: 1.6s;
		animation-duration: 0.5s;
		animation-timing-function: ease-in;
	}

	.anim-waf-19 {
		animation-name: anim-waf-19;
		animation-delay: 1.3s;
		animation-duration: 0.5s;
		animation-timing-function: ease-in;
	}

	.anim-waf-20 {
		animation-name: anim-waf-20;
		animation-delay: 1.3s;
		animation-duration: 0.5s;
		animation-timing-function: ease-in;
	}

	.anim-waf-21 {
		animation-name: anim-waf-20;
		animation-delay: 1.4s;
		animation-duration: 0.5s;
		animation-timing-function: ease-in;
	}

	.anim-waf-23 {
		animation-name: anim-waf-19;
		animation-delay: 1.5s;
		animation-duration: 0.5s;
		animation-timing-function: ease-in;
	}

	.anim-waf-10 {
		-webkit-animation: anim-waf-10 0.5s 0s 1 ease-in-out normal both;
	}

	.anim-waf-csy {
		-webkit-transform-origin: center bottom;
		-webkit-animation: anim-waf-9 0.8s 0.9s 1 ease-out normal both;
	}

	.anim-waf-9 {
		-webkit-transform-origin: left top;
		-webkit-animation: anim-waf-9 0.8s 0.9s 1 ease-out normal both;
	}

	.anim-waf-8 {
		-webkit-animation: anim-waf-8 3s 0.8s infinite linear normal forwards;
	}

	.anim-waf-26 {
		-webkit-animation: anim-waf-26 0.8s 0s 1 ease-in-out normal both;
	}

	.anim-waf-6 {
		-webkit-animation: anim-waf-26 0.8s 1.6s 1 ease-in-out normal both;
	}

	.anim-waf-18 {
		-webkit-animation: anim-waf-26 0.8s 1.1s 1 ease-in-out normal both;
	}

	.anim-waf-14 {
		-webkit-animation: anim-waf-26 0.8s 1.1s 1 ease-in-out normal both;
	}
</style>
