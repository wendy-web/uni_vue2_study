<template>
	<view class="about-us">
<!-- 		<view class="about-us-header">
			<image class="about-us-icon" src="/static/images/avatar_default.png" mode="widthFix"></image>
		</view> -->
		<van-cell title="版本号"  :value="version" is-link @click="versionHandle" />
		<van-cell title="隐私协议" @click="$agreementLookHandle('/agreement/privacy-agreement.html')" is-link />
		<van-cell title="服务协议" @click="$agreementLookHandle('/agreement/service-agreement.html')" is-link />
		<van-cell title="开发者" @click="developer" is-link />
		<van-cell title="积分商城" @click="goToPointsMall" is-link v-if="env != 'release'" />
		<!-- 背景 -->
		<view class="about-us-bg"></view>
	</view>
</template>

<script>
	import { getVersion, getENV } from '@/utils/auth.js';
	export default {
		data(){
		   return {
			  version: '',
			  env: ''
		   }
		},
		onLoad() {
			this.version = getVersion();
			this.env = getENV();
		},
		methods: {
			goToPointsMall() {
				this.$go('/pages/homeModule/pointsMall/index')
			},
			versionHandle() {
				this.$toast('已经是最新版本啦~');
			},
			developer() {
				uni.showToast({
					title: 'TXC BIG DATA-DEPTH RESEARCH',
					icon: 'none',
					duration: 2000
				});
			}
		}
	};
</script>

<style lang="scss">
	page{
		background-color: #f7f7f7;
	}
	.about-us {
		position: fixed;
		top: 0;
		bottom:0;
		left: 0;
		width: 100%;
		background-color: #ffffff;
		border-radius: 12px 12px 0px 0px;
		overflow: hidden;
		.about-us-header {
			padding: 80rpx 0;
			position: relative;
		}

		.about-us-header::after {
			position: absolute;
			box-sizing: border-box;
			-webkit-transform-origin: center;
			transform-origin: center;
			content: " ";
			pointer-events: none;
			top: auto;
			right: 0;
			bottom: 0;
			left: 16px;
			border-bottom: 1px solid #ebedf0;
			-webkit-transform: scaleY(.5);
			transform: scaleY(.5);

		}


		.about-us-icon {
			width: 150rpx;
			height: 150rpx;
			display: block;
			margin: 0 auto;
		}
	}
</style>
