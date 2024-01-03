<template>
	<view class="about-us">
		<view class="about-us-header">
			<image class="about-us-icon" src="../../../static/images/logo.png" mode="widthFix"></image>
		</view>
		<van-cell title="版本更新" @click="checkVersion" is-link />
		<van-cell @click="agreementLook('/index/index/bfxl.html',true)" is-link>
			<view slot="title">
				<view :class="{'title-text':isShowRed}">个人信息保护政策</view>
			</view>
		</van-cell>
		<van-cell title="平台服务协议" @click="agreementLook('/index/index/bfxlfl.html')" is-link />
		<van-cell title="开发者" @click="developer" is-link />
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	import {
		baseUrl
	} from '@/api/http/xhHttp.js';
	import {
		setStorage,
		getStorage
	} from "@/utils/auth.js"
	let updateManager = null;
	export default {
		data() {
			return {
				isShowRed: false
			}
		},
		onLoad() {
			updateManager = null;
			this.isShowRed = !getStorage('about_us_red')
		},
		methods: {
			agreementLook(link, flag) {
				link = baseUrl + link;
				this.$go({
					url: `/pages/webview/webview?link=${encodeURIComponent(link)}`
				});
				if (flag) {
					setStorage('about_us_red', true)
					this.isShowRed = false
				}
			},
			checkVersion() {
				if (updateManager) return;

				updateManager = uni.getUpdateManager();

				updateManager.onCheckForUpdate(function(res) {
					// 请求完新版本信息的回调
					if (!res.hasUpdate) {
						uni.showToast({
							title: '已经是最新版本啦~',
							icon: 'none',
							duration: 2000
						});
					}
				});

				updateManager.onUpdateReady(function() {
					wx.showModal({
						title: '更新提示',
						content: '新版本已经准备好，是否重启应用？',
						success: function(res) {
							if (res.confirm) {
								// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
								updateManager.applyUpdate();
							}
						}
					});
				});

				updateManager.onUpdateFailed(function() {
					// 新版本下载失败
					uni.showToast({
						title: '更新失败，稍后请重新尝试~',
						icon: 'none',
						duration: 2000
					});
				});
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
	.about-us {
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

		.title-text {
			position: relative;
		}

		.title-text::before {
			content: '';
			width: 20rpx;
			height: 20rpx;
			border-radius: 50%;
			background-color: #e71919;
			position: absolute;
			left: -22rpx;
			top: 50%;
			transform: translateY(-50%);
		}
	}
</style>