<template>
	<view class="privacy-popup" v-if="innerShow">
		<view class="privacy-popup-content">
			<!-- icon -->
			<image class="privacy-icon" src="/static/images/privacy_icon.png" mode="aspectFill"></image>
			<!-- title -->
			<view class="privacy_title">
				用户隐私保护提示
			</view>
			<!-- 文案一 -->
			<view class="privacy_p">
				感谢您使用本小程序，请您在使用前阅读完整版<text style="color:#FF492D"
					@click="openPrivacyContract">《彬纷享礼小程序隐私保护指引》</text>了解详细信息。
			</view>
			<!-- 文案二 -->
			<view class="privacy_p" style="margin-top: 40rpx;">
				当您点击同意开始使用我们的产品和服务，即表示您已理解并同意该条款内容，我们将保护您的个人信息安全，并为您提供完整的服务。
			</view>
			<!-- 操作按钮 -->
			<view class="privacy_tools">
				<button class="disagree-btn" id="disagree-btn" @click="handleDisagree">不同意</button>
				<button class="agree-btn" id="agree-btn" open-type="agreePrivacyAuthorization"
					@agreeprivacyauthorization="handleAgree">同意</button>
			</view>
		</view>
	</view>
</template>

<script>
	let privacyHandler
	let privacyResolves = new Set()
	let closeOtherPagePopUpHooks = new Set()

	if (wx.onNeedPrivacyAuthorization) {
		wx.onNeedPrivacyAuthorization(resolve => {
			console.log('触发 onNeedPrivacyAuthorization')
			if (typeof privacyHandler === 'function') {
				privacyHandler(resolve)
			}
			uni.hideLoading();
		})
	}

	const closeOtherPagePopUp = (closePopUp) => {
		closeOtherPagePopUpHooks.forEach(hook => {
			if (closePopUp !== hook) {
				hook()
			}
		})
	}

	export default {
		name: "privacyPopup",
		data() {
			return {
				innerShow: false,
			};
		},
		mounted() {
			//关闭前面的
			// this.closePrevious()

			const closePopUp = () => {
				this.disPopUp()
			}
			privacyHandler = resolve => {
				privacyResolves.add(resolve)
				this.popUp()
				// 额外逻辑：当前页面的隐私弹窗弹起的时候，关掉其他页面的隐私弹窗
				closeOtherPagePopUp(closePopUp)
			}
			this.closePopUp = closePopUp
			closeOtherPagePopUpHooks.add(this.closePopUp)
		},
		methods: {
			// closePrevious() {
			// 	if (this.closePopUp) {
			// 		privacyHandler = resolve => {
			// 			privacyResolves.add(resolve)
			// 			this.popUp()
			// 			// 额外逻辑：当前页面的隐私弹窗弹起的时候，关掉其他页面的隐私弹窗
			// 			closeOtherPagePopUp(this.closePopUp)
			// 		}
			// 	}
			// },
			handleAgree(e) {
				this.disPopUp()
				// 这里演示了同时调用多个wx隐私接口时要如何处理：让隐私弹窗保持单例，点击一次同意按钮即可让所有pending中的wx隐私接口继续执行 （看page/index/index中的 wx.getClipboardData 和 wx.startCompass）
				privacyResolves.forEach(resolve => {
					resolve({
						event: 'agree',
						buttonId: 'agree-btn'
					})
				})
				privacyResolves.clear()
			},
			handleDisagree(e) {
				this.disPopUp()
				privacyResolves.forEach(resolve => {
					resolve({
						event: 'disagree',
					})
				})
				privacyResolves.clear()
			},
			popUp() {
				if (this.innerShow === false) {
					this.innerShow = true
				}
			},
			disPopUp() {
				if (this.innerShow === true) {
					this.innerShow = false
				}
			},
			openPrivacyContract() {
				wx.openPrivacyContract({
					success: res => {
						console.log('openPrivacyContract success')
					},
					fail: res => {
						console.error('openPrivacyContract fail', res)
					}
				})
			},
			LifetimesShow() {
				console.log('LifetimesShow :>> ', );
				if (this.closePopUp) {
					privacyHandler = resolve => {
						privacyResolves.add(resolve)
						this.popUp()
						// 额外逻辑：当前页面的隐私弹窗弹起的时候，关掉其他页面的隐私弹窗
						closeOtherPagePopUp(this.closePopUp)
					}
				}
			}
		},
		beforeDestroy() {
			console.log('privacyPopup------beforeDestroy')
			closeOtherPagePopUpHooks.delete(this.closePopUp)
		}
	}
</script>

<style lang="less">
	.privacy-popup {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.80);
		z-index: 10001;
	}

	.privacy-popup-content {
		width: 648rpx;
		height: 892rpx;
		background: linear-gradient(180deg, #ffe7dd, #ffffff 28%);
		border: 4rpx solid #ffddc4;
		border-radius: 52rpx;
		box-shadow: 0rpx 0rpx 18rpx 0rpx rgba(255, 255, 255, 0.99) inset;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
	}

	.privacy-icon {
		width: 110rpx;
		height: 172rpx;
		padding-top: 64rpx;
	}

	.privacy_title {
		font-size: 40rpx;
		font-weight: 700;
		color: #000000;
		margin-top: 22rpx;
	}

	.privacy_p {
		font-size: 28rpx;
		font-weight: 400;
		color: #6c6c6c;
		padding: 0 58rpx;
		text-align: left;
	}

	.privacy_tools {
		margin-top: 76rpx;
		display: flex;
		justify-content: center;
	}

	.disagree-btn {
		width: 220rpx;
		height: 76rpx;
		background: #ffffff;
		border: 2rpx solid #b6b6b6;
		border-radius: 40rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0;
	}

	.agree-btn {
		width: 220rpx;
		height: 76rpx;
		background: #eb2c0e;
		border-radius: 38rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		margin: 0 0 0 92rpx;
	}
</style>