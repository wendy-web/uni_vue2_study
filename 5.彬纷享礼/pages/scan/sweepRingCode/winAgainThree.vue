<template>
	<view class="win-again-three" :style="{display: isShow?'block':'none'}">
		<!-- 背景一 -->
		<image class="animated bounceIn-wat-19 bg-19" src="../static/winAgainThree/img_19.png"></image>
		<!-- 背景二 -->
		<image class="animated bounceIn-wat-16 bg-16" src="../static/winAgainThree/img_16.png"></image>
		<image class="animated bounceIn-wat-166 bg-16" src="../static/winAgainThree/img_16.png"></image>
		<!-- 吉星高照 -->
		<image class="animated bounceIn-wat-031 jxgz-01" src="../static/winAgainThree/img_0.png"></image>
		<image class="animated bounceIn-wat-032 jxgz-02" src="../static/winAgainThree/img_3.png"></image>
		<image class="animated bounceIn-wat-033 jxgz-03" src="../static/winAgainThree/img_1.png"></image>
		<image class="animated bounceIn-wat-034 jxgz-04" src="../static/winAgainThree/img_2.png"></image>
		<!-- 中心四小福 放大-->
		<image class="animated bounceIn-wat-15 flb-01" src="../static/winAgainThree/img_15.png"></image>
		<!-- 中心四小福 闪烁-->
		<image class="animated bounceIn-wat-151 flb-02" src="../static/winAgainThree/img_15.png"></image>
		<!-- 四射红包 -->
		<image class="animated glamorous-01 bounceIn-wat-11" src="../static/winAgainThree/img_11.png"></image>
		<image class="animated glamorous-02 bounceIn-wat-12" src="../static/winAgainThree/img_12.png"></image>
		<image class="animated glamorous-03 bounceIn-wat-13" src="../static/winAgainThree/img_13.png"></image>
		<image class="animated glamorous-04 bounceIn-wat-10" src="../static/winAgainThree/img_10.png"></image>
		<image class="animated glamorous-05 bounceIn-wat-14" src="../static/winAgainThree/img_14.png"></image>
		<image class="animated glamorous-06 bounceIn-wat-17" src="../static/winAgainThree/img_17.png"></image>
		<!-- 四射组 -->
		<view class="glamorous-group bounceIn-wat-151">
			<image class="animated glamorous-01" src="../static/winAgainThree/img_11.png"></image>
			<image class="animated glamorous-02" src="../static/winAgainThree/img_12.png"></image>
			<image class="animated glamorous-03" src="../static/winAgainThree/img_13.png"></image>
			<image class="animated glamorous-04" src="../static/winAgainThree/img_10.png"></image>
			<image class="animated glamorous-05" src="../static/winAgainThree/img_14.png"></image>
		</view>
		<image class="animated bounceIn-wat-151 glamorous-06 glamorous-066" src="../static/winAgainThree/img_17.png">
		</image>
		<!-- 您已连续中奖三次 -->
		<image class="animated bounceIn-wat-9 series-win" src="../static/winAgainThree/img_9.png"></image>
		<image class="animated bounceIn-wat-4 series-win-three" src="../static/winAgainThree/img_4.png"></image>
		<!-- 卡劵 -->
		<view class="animated bounceInDown card-coupons">
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
	.win-again-three {

		// 卡劵
		.card-coupons {
			width: 554rpx;
			height: 148rpx;
			position: absolute;
			top: 325rpx;
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
			-webkit-animation-delay: 6.5s;
			animation-delay: 6.5s;
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
			-webkit-animation-delay: 7.5s;
			animation-delay: 7.5s;
		}

		.deposit {
			color: #F5231F;
		}

		.exchange {
			color: #614900;
		}

		//其它动画样式
		.bg-19 {
			position: absolute;
			left: 48%;
			top: 160rpx;
			width: 594rpx;
			height: 530rpx;
			margin-left: -297rpx;
			z-index: 1;
		}

		.bg-16 {
			position: absolute;
			top: 165rpx;
			left: 50%;
			width: 458rpx;
			height: 442rpx;
			margin-left: -210rpx;
			z-index: 1;
		}

		.jxgz-01,
		.jxgz-02,
		.jxgz-03,
		.jxgz-04 {
			position: absolute;
			z-index: 2;
		}

		.jxgz-01 {
			width: 374rpx;
			height: 205rpx;
			top: 288rpx;
			left: 30rpx;
		}

		.jxgz-02 {
			width: 136rpx;
			height: 114rpx;
			top: 370rpx;
			left: 275rpx;
		}

		.jxgz-03 {
			width: 128rpx;
			height: 117rpx;
			top: 360rpx;
			left: 405rpx;
		}

		.jxgz-04 {
			width: 137rpx;
			height: 114rpx;
			top: 348rpx;
			left: 518rpx;
		}

		.flb-01,
		.flb-02 {
			width: 258rpx;
			height: 248rpx;
			position: absolute;
			top: 290rpx;
			z-index: 1;
			left: 50%;
			margin-left: -78rpx;
		}

		.flb-01 {
			animation-delay: 1.5s;
			-webkit-animation-delay: 1.5s
		}

		.glamorous-01 {
			width: 64rpx;
			height: 70rpx;
			position: absolute;
			z-index: 1;
			top: 268rpx;
			right: 216rpx;
		}

		.glamorous-02 {
			width: 97rpx;
			height: 77rpx;
			position: absolute;
			z-index: 1;
			top: 254rpx;
			right: 98rpx;
		}

		.glamorous-03 {
			width: 145rpx;
			height: 120rpx;
			position: absolute;
			z-index: 1;
			top: 215rpx;
			left: 100rpx;
		}

		.glamorous-04 {
			width: 145rpx;
			height: 120rpx;
			position: absolute;
			z-index: 1;
			top: 442rpx;
			left: 108rpx;
		}

		.glamorous-05 {
			width: 198rpx;
			height: 176rpx;
			position: absolute;
			z-index: 1;
			top: 388rpx;
			right: 48rpx;
		}

		.glamorous-06 {
			width: 358rpx;
			height: 253rpx;
			position: absolute;
			z-index: 1;
			top: 512rpx;
			right: 175rpx;
		}

		.glamorous-066 {
			top: 512rpx;
			right: 175rpx;
			animation-delay: 4.5s;
		}

		.glamorous-group {
			position: absolute;
			top: 215rpx;
			height: 564rpx;
			width: 600rpx;
			left: 100rpx;
			z-index: 1;

			.glamorous-01 {
				top: 59rpx;
				right: 166rpx;
			}

			.glamorous-02 {
				top: 40rpx;
				right: 50rpx;
			}

			.glamorous-03 {
				top: 0;
				right: 0;
			}

			.glamorous-04 {
				top: 231rpx;
				left: 7rpx;
			}

			.glamorous-05 {
				top: 172rpx;
				right: 0;
			}
		}

		.series-win {
			width: 380rpx;
			height: 79rpx;
			position: absolute;
			z-index: 1;
			top: 270rpx;
			left: 218rpx;
		}

		.series-win-three {
			width: 313rpx;
			height: 155rpx;
			position: absolute;
			z-index: 1;
			top: 360rpx;
			left: 230rpx;
		}

		.wat-gocardbag,
		.wat-exchange {
			width: 238rpx;
			height: 68rpx;
			position: absolute;
			z-index: 1;

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
			top: 810rpx;
			left: 60px;
			animation-delay: 6s;
			-webkit-animation-delay: 6s
		}

		.wat-exchange {
			top: 810rpx;
			left: 400rpx;
			animation-delay: 6.2s;
			-webkit-animation-delay: 6.2s
		}

		.xwwh-xh-dialog-close {
			width: RPX(40);
			height: RPX(40);
			position: fixed;
			top: 950rpx;
			left: 350rpx;
			z-index: 2;
			animation-delay: 6.4s;
			-webkit-animation-delay: 6.4s
		}
	}

	@-webkit-keyframes bounceIn-wat-19 {

		0%,
		70%,
		to {
			-webkit-animation-timing-function: cubic-bezier(.215, .61, .355, 1);
			animation-timing-function: cubic-bezier(.215, .61, .355, 1)
		}

		0% {
			-webkit-transform: scale3d(.3, .3, .3);
			opacity: 0;
			transform: scale3d(.3, .3, .3)
		}



		70% {
			-webkit-transform: scale3d(1.6, 1.6, 1.6);
			opacity: 0.6;
			transform: scale3d(1.6, 1.6, 1.6)
		}


		to {
			-webkit-transform: scaleX(1);
			opacity: 1;
			transform: scaleX(1)
		}
	}

	@-webkit-keyframes bounceIn-wat-16 {

		0%,
		70%,
		to {
			-webkit-animation-timing-function: cubic-bezier(.215, .61, .355, 1);
			animation-timing-function: cubic-bezier(.215, .61, .355, 1)
		}

		0% {
			-webkit-transform: scale3d(.1, .1, .1);
			opacity: 0;
			transform: scale3d(.1, .1, .1)
		}



		70% {
			-webkit-transform: scale3d(1.3, 1.3, 1.3);
			opacity: 0.6;
			transform: scale3d(1.3, 1.3, 1.3)
		}


		to {
			-webkit-transform: scaleX(1);
			opacity: 0;
			transform: scaleX(1)
		}
	}


	@-webkit-keyframes bounceIn-wat-031 {

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

	@-webkit-keyframes bounceIn-wat-032 {

		0%,
		19%,
		29%,
		38.8% {
			animation-timing-function: ease;
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

	@-webkit-keyframes bounceIn-wat-033 {

		0%,
		21.8%,
		32.8%,
		43.75% {
			animation-timing-function: ease;
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

	@-webkit-keyframes bounceIn-wat-034 {

		0%,
		25%,
		37.5%,
		50% {
			animation-timing-function: ease;
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





	@-webkit-keyframes bounceIn-wat-15 {
		0% {
			opacity: 0;
			-webkit-transform: scaleX(0.1) scaleY(0.1);
		}

		59% {
			opacity: 0.6;
			-webkit-transform: scaleX(1.3) scaleY(1.3);
		}

		83% {
			opacity: 1;
			-webkit-transform: scaleX(1) scaleY(1);
		}

		100% {
			opacity: 0;
			-webkit-transform: scaleX(1) scaleY(1);
		}
	}

	@-webkit-keyframes bounceIn-wat-151 {
		0% {
			opacity: 1;
			-webkit-transform: scaleX(1) scaleY(1);
		}

		40% {
			-webkit-transform: scaleX(1.1) scaleY(1.1);
		}

		79% {
			-webkit-transform: scaleX(0.9) scaleY(0.9);
		}

		100% {
			opacity: 0.8;
			-webkit-transform: scaleX(1) scaleY(1);
		}

	}


	@-webkit-keyframes bounceIn-wat-11 {
		0% {
			-webkit-transform: scaleX(0.3) scaleY(0.3) translateX(-100rpx) translateY(150rpx);
			opacity: 0;
		}

		18% {
			opacity: 1;
			-webkit-transform: scaleX(1.2) scaleY(1.2);
		}

		25.5% {
			opacity: 0.8;
			-webkit-transform: scaleX(0.8) scaleY(0.8);
		}

		33% {
			-webkit-transform: scaleX(1) scaleY(1) translateX(0) translateY(0);
			opacity: 1;
		}

		100% {
			-webkit-transform: scaleX(1) scaleY(1) translateX(0) translateY(0);
			opacity: 0;
		}
	}

	@-webkit-keyframes bounceIn-wat-12 {
		0% {
			-webkit-transform: scaleX(0.3) scaleY(0.3) translateX(-200rpx) translateY(150rpx);
			opacity: 0;
		}

		21% {
			opacity: 1;
			-webkit-transform: scaleX(1.2) scaleY(1.2);
		}

		29.5% {
			opacity: 0.8;
			-webkit-transform: scaleX(0.8) scaleY(0.8);
		}

		38% {
			-webkit-transform: scaleX(1) scaleY(1) translateX(0) translateY(0);
			opacity: 1;
		}

		100% {
			-webkit-transform: scaleX(1) scaleY(1) translateX(0) translateY(0);
			opacity: 0;
		}
	}

	@-webkit-keyframes bounceIn-wat-13 {
		0% {
			-webkit-transform: scaleX(0.3) scaleY(0.3) translateX(300rpx) translateY(150rpx);
			opacity: 0;
		}

		25% {
			opacity: 1;
			-webkit-transform: scaleX(1.2) scaleY(1.2);
		}

		35% {
			opacity: 0.8;
			-webkit-transform: scaleX(0.8) scaleY(0.8);
		}

		45% {
			-webkit-transform: scaleX(1) scaleY(1) translateX(0) translateY(0);
			opacity: 1;
		}

		100% {
			-webkit-transform: scaleX(1) scaleY(1) translateX(0) translateY(0);
			opacity: 0;
		}
	}

	@-webkit-keyframes bounceIn-wat-10 {
		0% {
			-webkit-transform: scaleX(0.3) scaleY(0.3) translateX(300rpx) translateY(-150rpx);
			opacity: 0;
		}

		30.5% {
			opacity: 1;
			-webkit-transform: scaleX(1.2) scaleY(1.2);
		}

		42.5% {
			opacity: 0.8;
			-webkit-transform: scaleX(0.8) scaleY(0.8);
		}

		55% {
			-webkit-transform: scaleX(1) scaleY(1) translateX(0) translateY(0);
			opacity: 1;
		}

		100% {
			-webkit-transform: scaleX(1) scaleY(1) translateX(0) translateY(0);
			opacity: 0;
		}
	}

	@-webkit-keyframes bounceIn-wat-14 {
		0% {
			-webkit-transform: scaleX(0.3) scaleY(0.3) translateX(-300rpx) translateY(-150rpx);
			opacity: 0;
		}

		38.5% {
			opacity: 1;
			-webkit-transform: scaleX(1.2) scaleY(1.2);
		}

		54% {
			opacity: 0.8;
			-webkit-transform: scaleX(0.8) scaleY(0.8);
		}

		70% {
			-webkit-transform: scaleX(1) scaleY(1) translateX(0) translateY(0);
			opacity: 1;
		}

		100% {
			-webkit-transform: scaleX(1) scaleY(1) translateX(0) translateY(0);
			opacity: 0;
		}
	}

	@-webkit-keyframes bounceIn-wat-17 {
		0% {
			-webkit-transform: scaleX(0.3) scaleY(0.3);
			opacity: 0;
		}

		25% {
			opacity: 1;
			-webkit-transform: scaleX(1.2) scaleY(1.2);
		}

		45% {
			opacity: 0.8;
			-webkit-transform: scaleX(0.8) scaleY(0.8);
		}

		65% {
			-webkit-transform: scaleX(1) scaleY(1);
			opacity: 1;
		}

		100% {
			-webkit-transform: scaleX(1) scaleY(1);
			opacity: 0;
		}
	}


	@-webkit-keyframes bounceIn-wat-9 {

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
		63% {
			opacity: 1;
			-webkit-transform: scaleX(1) scaleY(1);
		}

		100% {
			opacity: 0;
		}
	}

	@-webkit-keyframes bounceIn-wat-4 {

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

		50% {
			opacity: 1;
			-webkit-transform: scaleX(1) scaleY(1);
		}

		100% {
			opacity: 0;
		}
	}


	.bounceIn-wat-9 {
		animation-name: bounceIn-wat-9;
		animation-duration: 1.9s;
		animation-delay: 3s;
		animation-fill-mode: both;
	}

	.bounceIn-wat-4 {
		animation-name: bounceIn-wat-4;
		animation-duration: 1.4s;
		animation-delay: 3.5s;
		animation-fill-mode: both;
	}

	/*魅力四射*/
	.bounceIn-wat-17 {
		-webkit-animation: bounceIn-wat-17 2s 2.6s 1 ease normal both;
	}

	.bounceIn-wat-14 {
		-webkit-animation: bounceIn-wat-14 1.4s 2.4s 1 ease normal both;
	}

	.bounceIn-wat-10 {
		-webkit-animation: bounceIn-wat-10 1.8s 2.2s 1 ease normal both;
	}

	.bounceIn-wat-13 {
		-webkit-animation: bounceIn-wat-13 2.2s 2s 1 ease normal both;
	}

	.bounceIn-wat-12 {
		-webkit-animation: bounceIn-wat-12 2.6s 1.8s 1 ease normal both;
	}

	.bounceIn-wat-11 {
		-webkit-animation: bounceIn-wat-11 3s 1.6s 1 ease normal both;
	}

	/*魅力四射*/
	.bounceIn-wat-151 {
		-webkit-animation: bounceIn-wat-151 0.75s 4s infinite linear normal forwards;
		opacity: 0;
	}

	.bounceIn-wat-166 {
		-webkit-animation: bounceIn-wat-166 3s 2.5s infinite linear normal forwards;
		opacity: 0;
	}

	.bounceIn-wat-15 {
		-webkit-animation: bounceIn-wat-15 1.5s 1.4s 1 ease-in-out normal both;
	}

	.bounceIn-wat-19 {
		-webkit-animation-duration: 1s;
		-webkit-animation-name: bounceIn-wat-19;
		animation-duration: 1s;
		animation-name: bounceIn-wat-19
	}

	.bounceIn-wat-16 {
		-webkit-animation-name: bounceIn-wat-16;
		-webkit-animation-duration: 1.9s;
		-webkit-animation-delay: 0.8s
	}

	.bounceIn-wat-031 {
		animation-name: bounceIn-wat-031;
		animation-duration: 2s;
		animation-delay: 1s;
		animation-fill-mode: both;
	}

	.bounceIn-wat-032 {
		animation-name: bounceIn-wat-032;
		animation-duration: 1.8s;
		animation-delay: 1.2s;
		animation-fill-mode: both;
	}

	.bounceIn-wat-033 {
		animation-name: bounceIn-wat-033;
		animation-duration: 1.6s;
		animation-delay: 1.4s;
		animation-fill-mode: both;
	}

	.bounceIn-wat-034 {
		animation-name: bounceIn-wat-034;
		animation-duration: 1.4s;
		animation-delay: 1.6s;
		animation-fill-mode: both;
	}
</style>
