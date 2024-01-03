<template>
	<van-popup :show="isShow" round position="center" custom-style="width: 90%;padding:50rpx 35rpx">
		<view class="protocol-confirm">
			<text>请阅读</text>
			<text class="protocol-confirm-name" @click="agreementLook('/index/index/bfxl.html')">《个人信息保护政策》</text>
			<text class="protocol-confirm-name" @click="agreementLook('/index/index/bfxlfl.html')">《平台服务协议》</text>
			<text>的全部条款，接受后可以开始使用我们的服务</text>
		</view>
		<view class="protocol-confirm-tools">
			<van-button round type="default" block style="width: 280rpx;" @click="isShow = false">不同意</van-button>
			<van-button round type="primary" block style="width: 280rpx;"
				color="linear-gradient(180deg,#e71919 26%, #a31015 100%);" @click="agree">同意</van-button>
		</view>
	</van-popup>
</template>

<script>
	import {
		baseUrl
	} from '@/api/http/xhHttp.js';
	export default {
		name: "protocolConfirm",
		data() {
			return {
				isShow: false
			};
		},
		methods: {
			show() {
				this.isShow = true
			},
			//查看协议
			agreementLook(link) {
				link = baseUrl + link;
				this.$go({
					url: `/pages/webview/webview?link=${link}`
				});
			},
			agree() {
				this.isShow = false
				this.$emit('agree')
			}
		}
	}
</script>

<style lang="less">
	.protocol-confirm {
		font-size: 28rpx;

		.protocol-confirm-name {
			color: #006FFF;
		}
	}

	.protocol-confirm-tools {
		display: flex;
		justify-content: space-between;
		padding: 40rpx 10rpx 0;
	}
</style>