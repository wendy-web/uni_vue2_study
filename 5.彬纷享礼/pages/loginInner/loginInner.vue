<template>
	<view>
		<view class="logo">

			<van-image width="220rpx" height="220rpx" fit="cover" src="/static/images/logo.png" />

		</view>
		<view class="login">
			<van-button round type="primary" block color="linear-gradient(180deg,#e71919 26%, #a31015 100%);"
				size="large" @click="login">立即登录</van-button>
		</view>
		<view class="agreement">
			<xh-check @change="agreement" labelClass="agreement-read" labelColor="#999999" primaryColor="#E71919"
				:checked="isAgreement" label="我已阅读、理解并接受以下规定" />
			<view class="agreement-name" @click="agreementLook('/index/index/bfxl.html')">《个人信息保护政策》</view>
			<view class="agreement-name" @click="agreementLook('/index/index/bfxlfl.html')">《平台服务协议》</view>
		</view>
		<!-- 消息提示 -->
		<!-- <xh-notify ref="xhNotify" /> -->
		<!-- 协议确认 -->
		<protocol-confirm ref="protocolConfirm" @agree="agree" />
	</view>
</template>

<script>
	import {
		baseUrl
	} from '@/api/http/xhHttp.js';
	import {
		mapMutations
	} from "vuex"
	export default {
		data() {
			return {
				isAgreement: false
			}
		},
		methods: {
			...mapMutations({
				setLoginState: 'login/setLoginState',
			}),
			agreement(flag) {
				this.isAgreement = flag;
			},
			//查看协议
			agreementLook(link) {
				link = baseUrl + link;
				this.$go({
					url: `/pages/webview/webview?link=${link}`
				});
			},
			agree() {
				this.isAgreement = true;
				setTimeout(() => {
					this.login()
				}, 500)
			},
			login() {
				if (!this.isAgreement) {
					this.$refs.protocolConfirm.show()
					return
					// return this.$refs.xhNotify.show({
					// 	type: 'warning',
					// 	message: '请阅读并同意登录协议',
					// 	duration: 2000
					// });
				}
				this.setLoginState(true)
				this.$navigateBack({
					fail: () => {
						this.$reLaunch({
							url: '/pages/tabBar/personal/index'
						})
					}
				})
			}
		}
	}
</script>

<style>
	.logo {
		padding-top: 260rpx;
		text-align: center;
		font-size: 0;
	}

	.agreement {
		margin: 30rpx 80rpx 28rpx 80rpx;
		font-size: 28rpx;
	}

	.agreement-read {
		margin-left: 10rpx;
	}

	.agreement-name {
		color: #A61115;
		padding: 10rpx 0;
		margin-left: 30rpx;
	}

	.login {
		margin: 120rpx 40rpx 0;
	}
</style>