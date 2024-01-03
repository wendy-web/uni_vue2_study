<template>
	<view class="login">
		<!-- 头部 -->
		<view class="login-head">
			<view class="login-head-title">
				点亮中国
			</view>
			<view class="login-head-tips">
				平台出资你助力，一起做公益！
			</view>
			<image class="login-love" src="/static/images/login_love.png" mode="aspectFill"></image>
		</view>

		<view class="login-content">
			<!-- 欢迎登陆 -->
			<view class="wecome-login">
				<view class="wecome-logo-box">
					<van-image class="wecome-logo" width="144.8rpx" height="144.8rpx" radius="50%" fit="cover"
						:src="avatarUrl" />
					<button v-if="isShowAvatar" class="wecome-logo-button" open-type="chooseAvatar"
						@chooseavatar="chooseavatar"></button>
					<button v-else class="wecome-logo-button" @click="selectPhoto"></button>
					<image class="wecome-camera" src="/static/images/camera.png" mode="aspectFill"></image>
					<!-- 点击编辑 -->
					<view class="wecome-camera-tips">
						点击编辑头像
					</view>
				</view>
				<view class="wecome-msg">
					<van-field :value="nickName" :border="false" :input-align="'left'" type="nickname"
						placeholder="请输入用户名" :maxlength="15" @change="nickNameChange" />
				</view>
			</view>
			<!-- 提示信息 -->
			<!-- 		<view class="tips">
			请点击下方按钮跳转微信授权登录
		</view> -->
			<!-- 登录按钮  @click="login"-->
			<!-- 协议 -->
			<view class="agreement">
				<text>登录即同意</text>
				<text class="agreement-name" @click="agreementLook('/web/privacy-policy.html')">《个人信息保护政策》</text>
				<text class="agreement-name" @click="agreementLook('/web/service-agreement.html')">《平台服务协议》</text>
			</view>
			<view class="login-btn">
				<van-button custom-style="border-radius: 8px;" type="primary" block color="#F9991C"
					size="large" icon="wechat" form-type="submit" :loading="loading" @click="login">微信授权一键登录
				</van-button>
			</view>
<!-- 			<view class="cancel-login-btn">
				<van-button round type="default" block @click="backHome" size="large">取消</van-button>
			</view> -->
			<!-- login error -->
			<view class="login-warn">
				<text class="login-warn-tips"  @click="linkService">登录遇到问题</text>
			</view>
		</view>
		<confirmDia
			:isShow="isShowConfirmDia"
			@close="isShowConfirmDia = false"
			@confirm="confirmHandle"
		>
		</confirmDia>
	</view>
</template>

<script>
	import { mapActions, mapGetters, mapMutations } from 'vuex';
	import uploadImgAI from '@/utils/uploadImgAI.js';
	import confirmDia from './confirmDia.vue';
	import { compareVersion } from '@/utils/index.js'
	export default {
		components:{
			confirmDia
		},
		data() {
			return {
				avatarUrl: '/static/images/defult_avatarUrl.png',
				nickName: "",
				loading: false,
				isShowAvatar: false,
				isShowConfirmDia: false
			};
		},
		onLoad(option) {
			//兼容性判断
			const version = wx.getSystemInfoSync().SDKVersion;
			this.isShowAvatar = compareVersion(version, '2.21.2') >= 0;
			// 进行确认登录的信息
			if(option.isLocal && this.userInfo.oldAvaUrl) {
				this.isShowConfirmDia = true;
			}
		},
		onShow() {
			// 隐私协议判断
			this.$refs.privacy.LifetimesShow();
		},
		computed: {
			...mapGetters(['token', 'userInfo'])
		},
		methods: {
			...mapActions({
				getUserInfo: 'user/getUserInfo',
				updateUserNew: 'user/updateUserNew',
				wxloginSmall: 'user/wxloginSmall'
			}),
			...mapMutations({
				setAutoLogin: 'user/setAutoLogin'
			}),
			//跳转客服
			linkService() {
				uni.navigateTo({
					url: '/pages/user/service/service'
				});
			},
			//查看协议
			agreementLook(link) {
				link = 'https://bfzx.y1b.cn' + link;
				this.$go(`/pages/tabBar/webview/webview?link=${link}#ISLOGIN`);
			},
			//刷新token并返回首页
			backHome() {
				uni.reLaunch({
					url: '/pages/tabBar/home/index'
				});
			},
			chooseavatar(event) {
				this.selectImage(event.detail.avatarUrl)
			},
			async selectImage(imgPath) {
				try {
					// await this.wxloginSmall()
					//上传图片
					let res = await uploadImgAI(imgPath, {});
					//展示上传结果
					this.avatarUrl = res.url
				} catch (error) {
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
					let imgPath = tempFile.tempFilePath
					// 是否压缩
					if (tempFile.size / 1024 > 60) {
						let {
							tempFilePath
						} = await wx.compressImage({
							src: imgPath,
							quality: 70
						})
						imgPath = tempFilePath
					}
					// 上传图片
					let res = await uploadImgAI(imgPath, {})
					// 展示上传结果
					this.avatarUrl = res
				} catch (error) {
					wx.hideLoading()
					if (error && error.isRefresh) {
						this.wxloginSmall().then(res => {})
					}
				} finally {}
			},
			nickNameChange({ detail }) {
				this.nickName = detail
			},
			// 确认上次登录的使用
			confirmHandle() {
				this.isShowConfirmDia = false;
				this.setAutoLogin(true);
				this.$leftBack();
			},
			/*微信登录*/
			login() {
				this.loading = true
				if (this.avatarUrl === '/static/images/defult_avatarUrl.png' || !this.avatarUrl) {
					this.loading = false;
					this.$toast('请选择您的头像');
					return
				}
				let nickName = this.nickName.replace(/\s/g, '');
				if (!nickName) {
					this.loading = false;
					this.$toast('请输入您的用户名');
					return
				}
				this.updateUserNew({
					nick_name: nickName,
					avatar_url: this.avatarUrl
				}).then(res => {
					// 跳回首页
					this.getUserInfo();
					// this.setAutoLogin(true);
					this.$leftBack();
				}).catch(() => {
					this.nickName = "";
					this.loading = false;
				});
			}
		}
	};
</script>
<style lang="scss">
	.login {
		.login-head {
			height: 300rpx;
			position: relative;
			background-color: #FEEBD2;
			box-sizing: border-box;
			padding-top: 65rpx;
			padding-left: 40rpx;
		}

		.login-head-title {
			font-size: 40rpx;
			font-weight: 500;
			color: #333333;
			margin-bottom: 20rpx;
		}

		.login-love {
			position: absolute;
			right: 24rpx;
			bottom: 88rpx;
			width: 280rpx;
			height: 194rpx;
		}

		.login-head-tips {
			font-size: 26rpx;
			font-weight: 400;
			color: #333333;
		}
		
		.login-content{
			background-color: #ffffff;
			border-radius: 20px 20px 0px 0px;
			margin-top: -95rpx;
			position: relative;
			z-index: 1;
			padding-top: 80rpx;
		}
		

		.wecome-login {
			color: #000000;
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		.wecome-logo-box {
			width: 144.8rpx;
			height: 144.8rpx;
			margin-bottom: 36.2rpx;
			position: relative;
		}

		.wecome-logo {
			position: absolute;
			left: 0;
			top: 0;
		}

		.wecome-logo-button {
			width: 144.8rpx;
			height: 144.8rpx;
			position: absolute;
			z-index: 1;
			left: 0;
			top: 0;
		}

		.wecome-camera {
			width: 60rpx;
			height: 60rpx;
			position: absolute;
			right: -20rpx;
			bottom: 0;
		}
		
		.wecome-camera-tips{
			font-size: 24rpx;
			font-weight: 400;
			color: #aaaaaa;
			position: absolute;
			bottom: -35rpx;
			left: 50%;
			transform: translateX(-50%);
			white-space: nowrap;
		}

		.wecome-msg {
			font-size: 36.2rpx;
			color: #000000;
			margin-bottom: 116rpx;
			width: 670rpx;
			height: 88rpx;
			background-color: #f8f8f8;
			border-radius: 8px;
			margin: 40rpx auto 0;
		}
		
		.van-cell{
			background-color: transparent;
		}

		.wecome-msg-stress {
			color: #A61115;
		}

		.tips {
			text-align: center;
			color: #000000;
			font-size: 32.58rpx;
			margin-bottom: 14.48rpx;
		}

		.login-btn,
		.cancel-login-btn {
			margin-left: 66.97rpx;
			margin-right: 66.97rpx;
		}

		.cancel-login-btn {
			margin-top: 15rpx;
		}

		.van-button--default {
			color: #999;
		}

		.agreement {
			margin-top: 112rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 24rpx;
			font-weight: 400;
			color: #333333;
		}

		.agreement-name {
			color: #F9991C;
			padding: 10rpx 0;
		}


		.login-warn {
			margin-top: 32rpx;
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

		& button:after {
			border: none;
		}

		& button {
			background-color: transparent;
			padding: 0;
		}

		.van-cell:after {
			border-bottom-color: #BFBFBF;
		}
	}
</style>
