<template>
	<view class="about-us">
		<view class="about-us-header">
			<image class="about-us-icon" src="https://file.y1b.cn/public/img/dlzg/dlzg_logo_0221.png" mode="widthFix"></image>
		</view>
		<view class="about_version">
			<van-cell title="版本更新" @click="checkVersion" is-link />
			<text class="about_version_num">{{versions}}</text>
		</view>
		<van-cell title="隐私协议" @click="agreementLook('/web/privacy-policy.html')" is-link />
		<van-cell title="平台服务协议" @click="agreementLook('/web/service-agreement.html')" is-link />
		<van-cell title="开发者" @click="developer" is-link />
	</view>
</template>

<script>
	let updateManager = null;
	import { currentVersions } from '@/config';
	export default {
		data() {
			return {
				versions: currentVersions
			}
		},
		onLoad() {
			updateManager = null
		},
		methods: {
			agreementLook(link) {
				link = 'https://bfzx.y1b.cn' + link;
				uni.navigateTo({
					url: `/pages/tabBar/webview/webview?link=${encodeURIComponent(link)}`
				});
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
		.about_version {
			position: relative;
			.about_version_num {
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				right: 80rpx;
				color: #323233;
				font-size: 28rpx;
			}
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
