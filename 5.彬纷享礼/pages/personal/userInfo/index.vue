<template>
	<view>
		<privacy-popup></privacy-popup>
		<!-- 头像 -->
		<view class="user-item">
			<view class="item-label">
				头像
			</view>
			<view class="item-rtool">
				<view class="user-image-box">
					<button v-if="isShowAvatar" class="user-image-native" open-type="chooseAvatar"
						@chooseavatar="chooseavatar"></button>
					<button v-else class="user-image-api" @click="selectPhoto"></button>
					<van-image width="85rpx" height="85rpx" radius="50%" fit="cover" :src="userInfo.avatar_url" />
					<van-icon color="#A3A2A8" name="arrow" size="16px" />
				</view>
			</view>
		</view>
		<!-- 昵称 -->
		<view class="user-item" @click="editNick">
			<view class="item-label">
				昵称
			</view>
			<view class="item-rtool">
				<text>{{userInfo.nick_name}}</text><van-icon color="#A3A2A8" name="arrow" size="16px" />
			</view>
		</view>
		<!-- id -->
		<view class="user-item">
			<view class="item-label">
				ID
			</view>
			<view class="item-rtool">
				<text>{{userInfo.id}}</text>
			</view>
		</view>
		<!-- 更换手机号 -->
		<view class="user-item">
			<view class="item-label">
				更换手机号
			</view>
			<view class="item-rtool">
				<text>{{userInfo.mobile|encryMobile}}</text><van-icon color="#A3A2A8" name="arrow" size="16px" />
				<button class="phone-btn" open-type="getPhoneNumber" @getphonenumber="getphonenumber"></button>
			</view>
		</view>
		<view class="login-out  ios-safe">
			<van-button round type="primary" block color="linear-gradient(180deg,#e71919 26%, #a31015 100%);"
				size="large" @click="loginOut">退出登录</van-button>
		</view>
	</view>
</template>

<script>
	import {
		compareVersion
	} from '@/utils/index.js'
	import {
		mapGetters,
		mapActions,
		mapMutations
	} from "vuex"
	import uploadImgAI from '@/utils/uploadImgAI.js'
	import {
		userprofile
	} from '@/api/login.js'
	export default {
		computed: {
			...mapGetters(['userInfo'])
		},
		data() {
			return {
				isShowAvatar: false
			}
		},
		filters: {
			encryMobile(val) {
				if (!val) return '绑定手机号'
				return val.slice(0, 3) + '****' + val.slice(7, 11)
			}
		},
		onShow() {
			//兼容性判断
			const version = this.$getSystemInfo().SDKVersion
			this.isShowAvatar = compareVersion(version, '2.21.2') >= 0
		},
		methods: {
			...mapActions({
				updateUserMobileNew: 'login/updateUserMobileNew',
				getUserInfo: 'login/getUserInfo',
				wxloginSmall: 'login/wxloginSmall'
			}),
			...mapMutations({
				setLoginState: 'login/setLoginState',
			}),
			chooseavatar(event) {
				this.selectImage(event.detail.avatarUrl)
			},
			async selectImage(imgPath) {
				try {
					//上传图片
					let res = await uploadImgAI(imgPath, {})
					//展示上传结果   
					//更新用户信息
					this.update({
						avatarUrl: res
					})
				} catch (error) {
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
					//更新用户信息   
					this.update({
						avatarUrl: res
					})
				} catch (error) {
					wx.hideLoading()
					if (error && error.isRefresh) {
						this.wxloginSmall().then(res => {})
					}
				} finally {}

			},
			update(data) {
				userprofile(data).then(res => {
					wx.showToast({
						title: res.msg,
						icon: 'none'
					})
					if (res.code == 1) {
						this.getUserInfo()
					}
				}).catch(() => {})
			},
			getphonenumber(e) {
				this.updateUserMobileNew(e).then(() => {
					//异步更新用户信息
					this.getUserInfo(true);
				}).catch(() => {});
			},
			editNick() {
				this.$go({
					url: "/pages/personal/editUser/index?title=修改昵称&key=nickName"
				})
			},
			loginOut() {
				this.setLoginState(false)
				this.$reLaunch({
					url: '/pages/tabBar/personal/index'
				})
			}
		}
	}
</script>

<style>
	.user-item {
		height: 100rpx;
		padding: 0 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
	}

	:first-child.user-item::before {
		border-bottom: 1px solid #ebedf0;
		top: 0;
		box-sizing: border-box;
		content: " ";
		left: 30rpx;
		pointer-events: none;
		position: absolute;
		right: 30rpx;
		transform: scaleY(.5);
		transform-origin: center;
		border-bottom-width: 1px;
		border-bottom-style: solid;
		border-bottom-color: rgb(235, 237, 240);
	}

	.user-item::after {
		border-bottom: 1px solid #ebedf0;
		bottom: 0;
		box-sizing: border-box;
		content: " ";
		left: 30rpx;
		pointer-events: none;
		position: absolute;
		right: 30rpx;
		transform: scaleY(.5);
		transform-origin: center;
		border-bottom-width: 1px;
		border-bottom-style: solid;
		border-bottom-color: rgb(235, 237, 240);
	}

	.item-label {
		font-size: 28rpx;
		color: #000018;
	}

	.user-image-native,
	.user-image-api,
	.phone-btn {
		box-sizing: border-box;
		height: 100%;
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 1;
		opacity: 0;
	}

	.user-image-box {
		font-size: 0;
	}

	.item-rtool,
	.user-image-box {
		display: flex;
		align-items: center;
		position: relative;
	}

	.item-rtool {
		font-size: 28rpx;
		color: #a3a2a8;
		position: relative;
	}

	.login-out {
		position: fixed;
		left: 40rpx;
		right: 40rpx;
		bottom: 0;
	}
</style>