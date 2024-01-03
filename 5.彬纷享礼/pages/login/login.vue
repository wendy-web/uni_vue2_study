<template>
	<view class="login">
		<privacy-popup></privacy-popup>
		<xh-navbar title="授权" titleColor="#000000" titleAlign="titleCenter" leftImage="../../static/images/home.png"
			@leftCallBack="backHome" :leftCallBack="true" :isHome="true" />
		<!-- 欢迎登陆 -->
		<view class="wecome-login">
			<view class="wecome-logo-box" ref="avatarRef">
				<van-image class="wecome-logo" width="144.8rpx" height="144.8rpx" radius="50%" fit="cover"
					:src="avatarUrl" />
				<button v-if="isShowAvatar" class="wecome-logo-button" open-type="chooseAvatar"
					@chooseavatar="chooseavatar"></button>
				<button v-else class="wecome-logo-button" @click="selectPhoto"></button>
				<image class="wecome-camera" src="/static/images/camera.png" mode="aspectFill"></image>
			</view>
			<view class="wecome-msg" @click="checkAvatarUrl">
				<van-field :value="nickName" :disabled="hasAvatarUrl" :input-align="'center'" right-icon="edit"
					type="nickname" placeholder="请输入用户名" :maxlength="15" :focus="focus" @blur="focus = false"
					@change="nickNameChange" />
			</view>
		</view>
		<!-- 提示信息 -->
		<!-- 		<view class="tips">
			请点击下方按钮跳转微信授权登录
		</view> -->
		<!-- 登录按钮  @click="login"-->
		<view class="login-btn">
			<van-button round type="primary" block color="linear-gradient(180deg,#e71919 26%, #a31015 100%);"
				size="large" form-type="submit" :loading="loading" @click="loginConfirm">立即登录</van-button>
		</view>
		<view class="cancel-login-btn">
			<van-button round type="default" block @click="backHome" size="large">取消</van-button>
		</view>
		<!-- 协议 -->
		<view class="agreement">
			<xh-check @change="agreement" labelClass="agreement-read" labelColor="#999999" primaryColor="#E71919"
				:checked="isAgreement" label="我已阅读、理解并接受以下规定" />
			<view class="agreement-name" @click="agreementLook('/index/index/bfxl.html')">《个人信息保护政策》</view>
			<view class="agreement-name" @click="agreementLook('/index/index/bfxlfl.html')">《平台服务协议》</view>
		</view>
		<!-- login error -->
		<view class="login-warn">
			<icon type="info" size="18" color="#e8a010" />
			<text class="login-warn-tips">登录遇到问题请</text>
			<text class="link-service" @click="linkService">联系客服</text>
		</view>
		<!-- 消息提示 -->
		<xh-notify ref="xhNotify" :isCustom="true" />
		<!-- 协议确认 -->
		<protocol-confirm ref="protocolConfirm" @agree="agree" />
		<!-- 授权确认 -->
		<!-- <author-confirm ref="authorConfirm" @handler="handler" /> -->
		<van-popup :show="isShow" round position="center" custom-style="width: 90%;padding:50rpx 35rpx">
			<view class="protocol-confirm">
				<text><text style="color: #e71919;">同意授权使用您的"微信和昵称"可以带来更加友好的体验</text>，点击不同意将为您随机创建昵称或头像</text>
			</view>
			<view class="protocol-confirm-tools">
				<van-button round type="default" block style="width: 280rpx;" @click="handler(true)">不同意</van-button>
				<button v-if="isShowAvatar&&hasAvatarUrl" class="protocol-confirm-avatar" open-type="chooseAvatar"
					@chooseavatar="chooseavatar">去授权</button>
				<van-button v-else round type="primary" block style="width: 280rpx;"
					color="linear-gradient(180deg,#e71919 26%, #a31015 100%);" @click="handler(false)">去授权</van-button>
			</view>
		</van-popup>
	</view>
</template>

<script>
	import {
		mapActions,
		mapGetters,
		mapMutations
	} from 'vuex';
	import {
		PLAQUEADVERTISING
	} from '@/utils/index.js';
	import {
		baseUrl
	} from '@/api/http/xhHttp.js';
	import uploadImgAI from '@/utils/uploadImgAI.js'
	import {
		userprofile
	} from '@/api/login.js'
	import {
		compareVersion
	} from '@/utils/index.js'
	// import authorConfirm from "./authorConfirm"
	//插屏广告管理
	let _PLAQUEADVERTISING = null
	export default {
		// components: {
		// 	authorConfirm
		// },
		data() {
			return {
				isAgreement: false,
				avatarUrl: '/static/images/defult_avatarUrl.png',
				nickName: "",
				loading: false,
				isShowAvatar: false,
				isShow: false,
				focus: false
			};
		},
		onLoad(option) {
			//是否同意了协议
			if (option.isAgreement) {
				this.isAgreement = true;
			}
			//初始化广告
			_PLAQUEADVERTISING = PLAQUEADVERTISING({
				isAutoPlay: true
			});
			_PLAQUEADVERTISING.init('adunit-7d704bfc0a67a060');
			//兼容性判断
			const version = this.$getSystemInfo().SDKVersion
			this.isShowAvatar = compareVersion(version, '2.21.2') >= 0
		},
		onUnload() {
			// _PLAQUEADVERTISING.destroy();
		},
		computed: {
			...mapGetters(['token']),
			hasAvatarUrl() {
				return this.avatarUrl === '/static/images/defult_avatarUrl.png' || !this.avatarUrl
			}
		},
		methods: {
			...mapActions({
				wxlogin: 'login/wxlogin',
				wxloginSmall: 'login/wxloginSmall'
			}),
			...mapMutations({
				setLoginState: 'login/setLoginState',
			}),
			//跳转客服
			linkService() {
				this.$switchTab({
					url: '/pages/tabBar/service/service'
				});
			},
			//协议勾选
			agreement(flag) {
				this.isAgreement = flag;
			},
			checkAvatarUrl() {
				if (this.hasAvatarUrl) {
					return this.$refs.xhNotify.show({
						type: 'warning',
						message: '先选择您的头像',
						duration: 2000
					});
				}
			},
			//查看协议
			agreementLook(link) {
				link = baseUrl + link;
				this.$go({
					url: `/pages/webview/webview?link=${link}#ISLOGIN`
				});
			},
			//刷新token并返回首页
			backHome() {
				if (!this.token) {
					this.wxlogin().then(function(res) {});
				}
				this.$reLaunch({
					url: '/pages/tabBar/home/index'
				});
			},
			chooseavatar(event) {
				this.isShow = false
				this.loading = false
				this.selectImage(event.detail.avatarUrl)
			},
			async selectImage(imgPath) {
				try {
					// await this.wxloginSmall()
					//上传图片
					let res = await uploadImgAI(imgPath, {})
					//展示上传结果   
					this.avatarUrl = res

					this.handleTouchInput()

				} catch (error) {
					console.log(error)
					wx.hideLoading()
					if (error && error.isRefresh) {
						this.wxloginSmall().then(res => {})
					}
				} finally {}
			},
			async selectPhoto() {

				let chooseImage = wx.chooseMedia || wx.chooseImage

				try {
					/**图片获取 */
					let [tempFile] = (await chooseImage({
						count: 1,
						sizeType: 'compressed',
						mediaType: ['image'],
						sourceType: ['camera'],
						camera: 'back'
					})).tempFiles
					let imgPath = tempFile.path || tempFile.tempFilePath
					//是否压缩
					if (tempFile.size / 1024 > 60) {
						let {
							tempFilePath
						} = await wx.compressImage({
							src: imgPath,
							quality: 70,
							compressedWidth: 800,
							compressHeight: 800
						})
						imgPath = tempFilePath
					}
					//上传图片
					let res = await uploadImgAI(imgPath, {})
					//展示上传结果   
					this.avatarUrl = res
				} catch (error) {
					wx.hideLoading()
					if (error && error.isRefresh) {
						this.wxloginSmall().then(res => {})
					}
				} finally {}

			},
			nickNameChange({
				detail
			}) {
				this.nickName = detail
				this.loginConfirm()
			},
			agree() {
				this.isAgreement = true
				this.loginConfirm()
			},
			/*微信登录*/
			loginConfirm() {
				this.loading = true
				// if (this.hasAvatarUrl) {
				// 	this.loading = false
				// 	return this.$refs.xhNotify.show({
				// 		type: 'warning',
				// 		message: '请选择您的头像',
				// 		duration: 2000
				// 	});
				// }

				let nickName = this.nickName.replace(/\s/g, '')

				// if (!nickName) {
				// 	this.loading = false
				// 	return this.$refs.xhNotify.show({
				// 		type: 'warning',
				// 		message: '请输入您的用户名',
				// 		duration: 2000
				// 	});
				// }
				//未勾选协议
				if (!this.isAgreement) {
					this.loading = false
					this.$refs.protocolConfirm.show()
					// return this.$refs.xhNotify.show({
					// 	type: 'warning',
					// 	message: '请阅读并同意登录协议',
					// 	duration: 2000
					// });
					return
				}

				if (!nickName || this.hasAvatarUrl) {

					this.isShow = true

					// wx.showModal({
					// 	title: '温馨提示',
					// 	content: "我们未获得您的微信昵称或头像使用授权，将为您随机创建昵称和头像，是否同意继续",
					// 	confirmText: "同意",
					// 	confirmColor: "#67C23A",
					// 	success: (res) => {
					// 		if (res.confirm) {
					// 			this.login({
					// 				nickName,
					// 				avatarUrl: this.hasAvatarUrl ? '' : this.avatarUrl
					// 			})
					// 			return
					// 		}
					// 		this.loading = false
					// 	},
					// 	fail: () => {
					// 		this.loading = false
					// 	}
					// })

				} else {
					this.login({
						nickName,
						avatarUrl: this.avatarUrl
					})
				}
			},
			// 默认授权确认
			handler(confirm) {
				this.isShow = false
				let nickName = this.nickName.replace(/\s/g, '');
				if (confirm) {
					this.login({
						nickName,
						avatarUrl: this.hasAvatarUrl ? '' : this.avatarUrl
					})
				} else {
					// debugger
					this.loading = false
					if (!this.hasAvatarUrl) {
						this.handleTouchInput()
					}
				}
			},
			handleTouchInput() {
				if (wx.requirePrivacyAuthorize) {
					wx.requirePrivacyAuthorize({
						success: res => {
							console.log('用户同意了隐私协议 或 无需用户同意隐私协议')
							// 用户同意隐私协议后给昵称input聚焦
							this.focus = true;
						},
						fail: res => {
							console.log('用户拒绝了隐私协议')
						}
					})
				} else {
					this.focus = true;
				}
			},
			login(data) {
				userprofile(data).then(res => {
					if (res.code == 1) {
						//提示成功
						this.$refs.xhNotify.show({
							type: 'success',
							message: '授权成功',
							duration: 1500
						});
						//等提示结束后操作
						setTimeout(() => {
							//登录成功
							this.$switchTab({
								url: '/pages/tabBar/personal/index'
							});
						}, 1500);
						this.setLoginState(true)
						return
					}
					this.loading = false
					this.nickName = ""
					wx.showModal({
						title: '温馨提示',
						content: res.msg
					})
				}).catch(() => {
					this.loading = false
				})
			}
		}
	};
</script>

<style lang="scss">
	.login {
		.wecome-login {
			color: #000000;
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-top: 120rpx;
		}

		.wecome-logo-box {
			width: RPX(80);
			height: RPX(80);
			margin-bottom: RPX(20);
			position: relative;
		}

		.wecome-logo {
			position: absolute;
			left: 0;
			top: 0;
			z-index: 0;
		}

		.wecome-logo-button {
			width: RPX(80);
			height: RPX(80);
			position: absolute;
			z-index: 1;
			left: 0;
			top: 0;
		}

		.wecome-camera {
			width: 44rpx;
			height: 44rpx;
			position: absolute;
			right: 0;
			bottom: 0;
			z-index: 0;
		}

		.wecome-msg {
			font-size: RPX(20);
			color: #000000;
			margin-bottom: 116rpx;
		}

		.wecome-msg-stress {
			color: #A61115;
		}

		.tips {
			text-align: center;
			color: #000000;
			font-size: RPX(18);
			margin-bottom: RPX(8);
		}

		.login-btn,
		.cancel-login-btn {
			margin-left: RPX(37);
			margin-right: RPX(37);
		}

		.cancel-login-btn {
			margin-top: 15rpx;
		}

		.van-button--default {
			color: #999;
		}

		.agreement {
			margin-top: 20rpx;
			font-size: 25rpx;
			padding-left: 100rpx;
		}

		.agreement-read {
			margin-left: 10rpx;
		}

		.agreement-name {
			color: #A61115;
			padding: 10rpx 0;
			margin-left: 30rpx;
		}


		.login-warn {
			margin-top: 130rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28rpx;

			&>.login-warn-tips {
				color: #99abb4;
				margin-left: 10rpx;
			}

			&>.link-service {
				color: #5ea8f2;
				text-decoration: underline;
				margin-left: 5rpx;
				padding: 10rpx 0;
			}
		}

		& .wecome-logo-button:after {
			border: none;
		}

		& .wecome-logo-button {
			background-color: transparent;
			padding: 0;
		}

		.van-cell:after {
			border-bottom-color: #BFBFBF;
		}

		.protocol-confirm {
			font-size: 28rpx;

		}

		.protocol-confirm-tools {
			display: flex;
			justify-content: space-between;
			padding: 40rpx 10rpx 0;
		}

		.protocol-confirm-avatar {
			color: #fff;
			background: linear-gradient(180deg, #e71919 26%, #a31015 100%);
			border: 0;
			border-radius: var(--button-round-border-radius, 999px);
			display: flex;
			width: 280rpx;
			height: var(--button-default-height, 44px);
			justify-content: center;
			line-height: var(--button-line-height, 20px);
			font-size: var(--button-normal-font-size, 14px);
			padding: 0 15px;
			position: relative;
			text-align: center;
			transition: opacity .2s;
			vertical-align: middle;
			box-sizing: border-box;
			-webkit-text-size-adjust: 100%;
			align-items: center;
			-webkit-appearance: none;
			margin: 0;
		}
	}
</style>
