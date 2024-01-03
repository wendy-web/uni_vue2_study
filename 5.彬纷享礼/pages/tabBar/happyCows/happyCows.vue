<template>
	<view class="niuniu-paradise">
		<!-- 背景 -->
		<image class="niuniu-paradise-bg" :src="bgImage" mode="aspectFill"></image>
		<!-- head -->
		<image class="niuniu-paradise-head" :src="headImage" mode="widthFix"></image>
		<!-- 跳转按钮 -->
		<!-- <image class="niuniu-paradise-btn tada" :src="btnImage"  @click="goNiuniuParadise" mode="widthFix"></image> -->

	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		fileBaseUrl
	} from '@/api/http/xhHttp.js'
	import {
		PLAQUEADVERTISING
	} from '@/utils/index.js' //插屏广告
	let _PLAQUEADVERTISING = null //插屏广告管理
	export default {
		// onTabItemTap() {
		// 	if(_PLAQUEADVERTISING)_PLAQUEADVERTISING.play()
		// },
		data() {
			return {
				bgImage: fileBaseUrl + '/public/img/nnly/miniProgram/bg.png',
				btnImage: fileBaseUrl + '/public/img/nnly/miniProgram/btn.png',
				headImage: fileBaseUrl + '/public/img/nnly/miniProgram/head.png'
			};
		},
		onLoad() {
			_PLAQUEADVERTISING = PLAQUEADVERTISING({
				isAutoPlay: true
			});
			_PLAQUEADVERTISING.init('adunit-a7942f39a6a1a7df');
			// _PLAQUEADVERTISING.play()
		},
		methods: {
			goNiuniuParadise() {
				this.$navigateToMiniProgram({
					appId: 'wx6aef93f01a5d8d05', //小程序appid
					success(res) {
						// console.log(res, '跳转成功')
					}
				})
			}
		}
	}
</script>

<style>
	/* pages/zongduan/niuniuParadise.wxss */
	.niuniu-paradise>.niuniu-paradise-bg {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 100%;
	}

	.niuniu-paradise>.niuniu-paradise-btn {
		position: fixed;
		bottom: 15%;
		width: 120px;
		left: 50%;
		margin-left: -60px;
	}

	.niuniu-paradise>.niuniu-paradise-head {
		position: fixed;
		top: 2%;
		width: 50%;
		left: 50%;
		margin-left: -25%;
	}


	page::after {
		content: '';
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 2rpx;
		box-shadow: 0px -1px 7px 0px rgba(192, 196, 204, 1);
		z-index: 9999;
	}

	@-webkit-keyframes tada {
		0% {
			-webkit-transform: scaleX(1);
			transform: scaleX(1);
		}

		10%,
		20% {
			-webkit-transform: scale3d(0.9, 0.9, 0.9) rotate(-3deg);
			transform: scale3d(0.9, 0.9, 0.9) rotate(-3deg);
		}

		30%,
		50%,
		70%,
		90% {
			-webkit-transform: scale3d(1.1, 1.1, 1.1) rotate(3deg);
			transform: scale3d(1.1, 1.1, 1.1) rotate(3deg);
		}

		40%,
		60%,
		80% {
			-webkit-transform: scale3d(1.1, 1.1, 1.1) rotate(-3deg);
			transform: scale3d(1.1, 1.1, 1.1) rotate(-3deg);
		}

		to {
			-webkit-transform: scaleX(1);
			transform: scaleX(1);
		}
	}

	@keyframes tada {
		0% {
			-webkit-transform: scaleX(1);
			transform: scaleX(1);
		}

		10%,
		20% {
			-webkit-transform: scale3d(0.9, 0.9, 0.9) rotate(-3deg);
			transform: scale3d(0.9, 0.9, 0.9) rotate(-3deg);
		}

		30%,
		50%,
		70%,
		90% {
			-webkit-transform: scale3d(1.1, 1.1, 1.1) rotate(3deg);
			transform: scale3d(1.1, 1.1, 1.1) rotate(3deg);
		}

		40%,
		60%,
		80% {
			-webkit-transform: scale3d(1.1, 1.1, 1.1) rotate(-3deg);
			transform: scale3d(1.1, 1.1, 1.1) rotate(-3deg);
		}

		to {
			-webkit-transform: scaleX(1);
			transform: scaleX(1);
		}
	}

	.tada {
		-webkit-animation-name: tada;
		animation-name: tada;
		-webkit-animation-duration: 1s;
		-webkit-animation-fill-mode: both;
		animation-duration: 1s;
		animation-fill-mode: both;
		animation-iteration-count: infinite;
		animation-delay: 1s;
	}
</style>