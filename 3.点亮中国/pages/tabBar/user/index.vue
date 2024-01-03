<template>
	<view class="user">
		<!-- 顶部背景 -->
		<image class="head-bg" src="/static/user/bg_user_index.png" mode="aspectFill"></image>
		<xh-navbar :title="navTitle" titleColor="#000018" titleAlign="titleCenter" leftImage="/static/images/back.png"
			@leftCallBack="$leftBack"/>
		<mescroll-uni ref="mescrollRef" :top="navBarConfig.navBarHeight+navBarConfig.statusBarHeight+'px'"
			@init="mescrollInit" @down="downCallback" :down="downOption" :up="{use: false}">
			<view class="user-head" v-if="isAutoLogin">
				<!-- 头像 -->
				<view class="user-head-image" v-if="avatarUrl">
					<van-image
						class="wecome-logo"
						width="170rpx" height="170rpx"
						radius="50%" fit="cover"
						:src="avatarUrl"
						lazy-load use-loading-slot
					><van-loading slot="loading" type="spinner" size="20" vertical />
					</van-image>
					<button v-if="isShowAvatar" class="wecome-logo-button" open-type="chooseAvatar"
						@chooseavatar="chooseavatar"></button>
					<button v-else class="wecome-logo-button" @click="selectPhoto"></button>
					<image class="wecome-camera" src="/static/images/camera2.png" mode="aspectFill"></image>
				</view>
				<view class="accredit" v-else>
					<van-button type="primary" @click="userEmpower" size="small">点击授权</van-button>
				</view>
				<!-- 用戶名稱 -->
				<view class="user-nick">
					<view class="user-nick-show" v-if="!isEidt" @click="editHandle">
						<text>{{nickName}}</text>
						<image class="edit-icon" src="/static/images/edit.png" mode="aspectFill"></image>
					</view>
					<van-field v-else :value="nickName" :auto-focus="true" :input-align="'center'" right-icon="edit"
						type="nickname" placeholder="请输入用户名" :maxlength="15" @blur="nickNameChange" />
				</view>
				<!-- 右上角的扫一扫 -->
				<view class="icon-scan" @click="scan">
					<van-icon color="#000018" size="28" name="scan" v-if="!isLoading" />
					<van-loading v-else />
				</view>
			</view>
			<!-- 未登录的情况进入到登录的 -->
			<view class="user_not-login" v-else @click="userEmpower(true)">
				<image class="avatar" mode="aspectFit"
					src='/static/images/avatar_default.png'></image>
				<view class="user_not-txt">
					<view style="color: #000;">立即登录</view>
					<view>点亮全中国，一起攒能量</view>
				</view>
			</view>
			<!-- 主体 -->
			<view class="user-box">
				<!-- 统计 -->
				<view class="user-total">
					<view class="total-item" @click="goPages('/pages/user/lightRecord/index?type=0')">
						<view class="total-num">
							{{userInfo.city_num||'0'}}
						</view>
						<view class="total-label">
							点亮城市
						</view>
					</view>
					<view class="total-item" @click="goPages('/pages/love/loveRecord/index?type=0')">
						<view class="total-num">
							{{userInfo.love||'0'}}
						</view>
						<view class="total-label">
							我的能量
						</view>
					</view>
					<view class="total-item" @click="goPages('/pages/user/benefitPlan/index')">
						<view class="total-num">
							{{userInfo.com_plan_num||'0'}}
						</view>
						<view class="total-label">
							公益计划
						</view>
					</view>
					<view class="total-item" @click="goPages('/pages/user/achievement/index')">
						<view class="total-num">
							{{ (userInfo.com_num + userInfo.medal_num)||'0'}}
						</view>
						<view class="total-label">
							我的成就
						</view>
					</view>
					<!-- <view class="total-item"  @click="goPages('/pages/user/medal/index?type=0')">
						<view class="total-num">
							{{userInfo.medal_num||'0'}}
						</view>
						<view class="total-label">
							我的勋章
						</view>
					</view>
					<view class="total-item" @click="goPages('/pages/user/volunteerCard/index?type=0')">
						<view class="total-num">
							{{userInfo.com_cert_num||'0'}}
						</view>
						<view class="total-label">
							公益证书
						</view>
					</view> -->
				</view>
				<!-- user-tools -->
				<view class="user-tools">
					<!-- 					<view class="tools-item" @click="goPages('/pages/user/medal/index?type=0')">
						<view class="tools-title">
							<image class="tools-icon" src="https://file.y1b.cn/public/img/dlzg/my_icon01.png" mode="aspectFill">
							</image>
							<text>我的勋章</text>
						</view>
						<van-icon name="arrow" color="#ffffff" custom-style="padding:20rpx 34rpx 20rpx" />
					</view> -->
					<!-- <view class="tools-item" @click="goPages('/pages/user/volunteer/index?type=0')">
						<view class="tools-title">
							<image class="tools-icon" src="https://file.y1b.cn/public/img/dlzg/my_icon02.png" mode="aspectFill">
							</image>
							<text>我的公益</text>
						</view>
						<van-icon name="arrow" color="#4E4D52" custom-style="padding:20rpx 34rpx 20rpx" />
					</view> -->
					<!-- 					<view class="tools-item" @click="goTeam()">
						<view class="tools-title">
							<image class="tools-icon" src="https://file.y1b.cn/public/img/dlzg/my_icon03.png" mode="aspectFill">
							</image>
							<text>我的团队</text>
						</view>
						<van-icon name="arrow" color="#4E4D52" custom-style="padding:20rpx 34rpx 20rpx" />
					</view> -->
					<view class="tools-item" @click="handleExchange">
						<view class="tools-title">
							<image class="tools-img" src="https://file.y1b.cn/public/img/bfzx/jifen_icon@2x.png"
								mode="aspectFill">
							</image>
							<text>积分兑换</text>
						</view>
						<view class="tools-num">
							<text v-if="userInfo.credits > 0" :class="{'credits_active': inUnread}">{{userInfo.credits}}积分</text>
							<van-icon name="arrow" color="#4E4D52" custom-style="padding:20rpx 34rpx 20rpx 20rpx" />
						</view>
					</view>
					<view class="tools-item" @click="dlgn">
						<view class="tools-title">
							<image class="tools-icon" src="https://file.y1b.cn/public/img/dlzg/my_icon04.png"
								mode="aspectFill">
							</image>
							<text>点亮攻略</text>
						</view>
						<van-icon name="arrow" color="#4E4D52" custom-style="padding:20rpx 34rpx 20rpx" />
					</view>
					<view class="tools-item" @click="goPages('/pages/user/strategy/index')">
						<view class="tools-title">
							<image class="tools-icon" src="https://file.y1b.cn/public/img/dlzg/my_icon05.png"
								mode="aspectFill">
							</image>
							<text>帮助中心</text>
						</view>
						<van-icon name="arrow" color="#4E4D52" custom-style="padding:20rpx 34rpx 20rpx" />
					</view>
					<view class="tools-item" @click="goPages('/pages/user/aboutUs/index')">
						<view class="tools-title">
							<image class="tools-icon" src="https://file.y1b.cn/public/img/dlzg/my_icon06.png"
								mode="aspectFill">
							</image>
							<text>关于我们</text>
						</view>
						<van-icon name="arrow" color="#4E4D52" custom-style="padding:20rpx 34rpx 20rpx" />
					</view>
				</view>
				<view class="official-account" @tap="handleShowImg">
					<view>
						<view class="official-title">
							第一时间获取项目进展
						</view>
						<view class="official-hint">
							关注【点亮城市攒能量】公众号
						</view>
					</view>
					<van-icon name="arrow" color="#4E4D52" custom-style="padding:20rpx 34rpx 20rpx" />
				</view>
				<view class="exit_btn" @click="exitHandle" v-if="isAutoLogin">退出登录</view>
			</view>
		</mescroll-uni>
		<van-overlay :show="overlayShow" >
			<view class="overlay-wrapper">
				<view class="overlay-content">
					<image src="https://file.y1b.cn/public/img/bfzx/qrcode_for_official_account@2x.jpg" mode="" show-menu-by-longpress></image>
					<text>长按关注公众号</text>
				</view>
				<view class="close-img" @tap="overlayShow = false">
					<image src="/static/images/close.png" mode=""></image>
				</view>
			</view>
		</van-overlay>
		<!-- 隐私协议的组件 -->
		<!-- <privacy ref="privacy"></privacy> -->
		<confirmDia
			:isShow="isShowConfirmDia"
			remindText="确定退出登录？"
			@close="isShowConfirmDia = false"
			@confirm="confirmExitLoginHandle"
		></confirmDia>
	</view>
</template>
<script>
	import { mapGetters, mapActions, mapMutations } from 'vuex';
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import { getStrategy, qr } from '@/api/modules/index.js';
	import { getNavbarData } from '@/components/xhNavbar/xhNavbar.js';
	import { getUserLocation } from '@/utils/getUserLocation.js';
	import uploadImgAI from '@/utils/uploadImgAI.js';
	import { compareVersion } from '@/utils/index.js';
	import { parseTime } from '@/utils/index.js';
	import confirmDia from '@/components/confirmDia.vue';
	export default {
		mixins: [MescrollMixin], // 使用mixin
		components:{
			confirmDia
		},
		data() {
			return {
				downOption: {
					textColor: '#fff',
					auto: false
				},
				navTitle: "我的",
				navBarConfig: {
					navBarHeight: 0,
					statusBarHeight: 0, //状态栏高度
					menuWidth: 0
				},
				isEidt: false,
				isLoading: false,
				nickName: '',
				avatarUrl: '',
				isShowAvatar: false,
				overlayShow: false, //公众号弹窗
				inUnread: false,
				cur_date: '',
				isShowConfirmDia: false
			}
		},
		computed: {
			...mapGetters(['userInfo', 'isAuthorization', 'isAutoLogin'])
		},
		onLoad() {
			//获取导航栏数据
			getNavbarData().then(res => {
				this.navBarConfig = res
			})
			this.nickName = this.userInfo.nick_name
			this.avatarUrl = this.userInfo.avatar_url
			//兼容性判断
			const version = wx.getSystemInfoSync().SDKVersion
			this.isShowAvatar = compareVersion(version, '2.21.2') >= 0;
			this.initUnRead();
		},
		onShow() {
			this.downCallback();
			this.$refs.privacy.LifetimesShow();
		},
		watch: {
			'userInfo.nick_name': {
				handler:async function (newValue, oldValue) {
					if(!newValue) return;
					this.nickName = this.userInfo.nick_name
					this.avatarUrl = this.userInfo.avatar_url
				},
				deep: true
			},
		},
		methods: {
			...mapActions({
				getUserInfo: 'user/getUserInfo',
				updateUserNew: 'user/updateUserNew',
				wxloginSmall: 'user/wxloginSmall'
			}),
			...mapMutations({
				setAuthorization: 'user/setAuthorization',
				setUserInfo: 'user/setUserInfo',
				setAutoLogin: 'user/setAutoLogin'
			}),
			exitHandle() {
				this.isShowConfirmDia = true;
			},
			confirmExitLoginHandle() {
				this.isShowConfirmDia = false;
            	this.setAutoLogin(false);
			},
			initUnRead() {
				let readCreditsDate = uni.getStorageSync('readCreditsDate');
				this.cur_date = parseTime(Date.now(), "{y}-{m}-{d}");
				// 今日已读
				if (readCreditsDate && this.cur_date == readCreditsDate) {
					this.inUnread = false;
					return;
				}
				this.inUnread = true;
			},
			editHandle() {
				if (wx.requirePrivacyAuthorize) {
					wx.requirePrivacyAuthorize({
						success: res => {
							console.log('用户同意了隐私协议 或 无需用户同意隐私协议')
						},
						fail: res => {
							console.log('用户拒绝了隐私协议')
						},
						complete: res => {
							this.isEidt = true;
						}
					})
				} else {
					this.isEidt = true;
				}
			},
			// 点击关注公众号 - 显示公众号图片
			handleShowImg() {
				if (!this.isAutoLogin) return this.userEmpower(true);
				this.overlayShow = true;
			},
			// 点击积分兑换 - 跳转到天天享礼小程序
			handleExchange() {
				if (!this.isAutoLogin) return this.userEmpower(true);
				let openMiniProgram = wx.navigateToMiniProgram;
				if(wx.canIUse('openEmbeddedMiniProgram')) {
					openMiniProgram =  wx.openEmbeddedMiniProgram;
				}
				openMiniProgram({
					appId: 'wx6deb62d876c03d85',
					success: (res) => {
						// 打开成功
						this.inUnread = false;
						uni.setStorageSync('readCreditsDate', this.cur_date);
					},
					fail: (res) => {
						console.log('fail :>> ', res);
					}
				});
			},
			goTeam() {
				if (!this.userInfo.team_id) {
					this.$toast('抱歉，您还没有团队');
					return;
				}
				this.goPages('/pages/user/myTeam/index')
			},
			goPages(url) {
				if (!this.isAuthorization) {
					this.$toast('请先授权用户信息，可以开放更多功能哟');
					this.userEmpower()
					return
				}
				if (!this.isAutoLogin) return this.userEmpower(true);
				this.$go(url);
			},
			/*下拉刷新的回调 */
			downCallback() {
				// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
				// loadSwiper();
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
				this.getUserInfo()
				//延时
				setTimeout(() => {
					this.mescroll.endSuccess()
				}, 200)
			},
			// 登录授权
			userEmpower(isLocal = false) {
				this.$go(`/pages/tabBar/login/index?isLocal=${isLocal}`);
			},
			//点亮攻略
			dlgn() {
				if (!this.isAutoLogin) return this.userEmpower(true);
				getStrategy().then(res => {
					let image = 'https://file.y1b.cn/public/img/dlzg/dlgl.png'
					if (res.data.image) image = res.data.image + '?v=' + Date.now()
					wx.previewImage({
						urls: [image]
					})
				})
			},
			nickNameChange({ detail }) {
				let nickName = detail.value.replace(/\s/g, '')
				if (nickName && nickName != this.userInfo.nick_name) {
					this.nickName = nickName
					this.updateUserInfo({
						nickName: nickName,
						avatarUrl: this.userInfo.avatar_url
					})
				} else {
					this.nickName = this.userInfo.nick_name
				}
				this.isEidt = false
			},
			updateUserInfo({ nickName, avatarUrl }) {
				this.updateUserNew({
					nick_name: nickName,
					avatar_url: avatarUrl
				}).then(res => {
					this.getUserInfo()
				})
			},
			chooseavatar(event) {
				this.selectImage(event.detail.avatarUrl)
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
					//是否压缩
					if (tempFile.size / 1024 > 60) {
						let {
							tempFilePath
						} = await wx.compressImage({
							src: imgPath,
							quality: 70
						})
						imgPath = tempFilePath
					}
					//上传图片
					let res = await uploadImgAI(imgPath, {})
					//展示上传结果
					//展示上传结果
					this.avatarUrl = res.url
					this.updateUserInfo({
						nickName: this.userInfo.nick_name,
						avatarUrl: res.url
					})
				} catch (error) {
					wx.hideLoading()
					if (error && error.isRefresh) {
						this.wxloginSmall().then(res => {})
					}
				} finally {}
			},
			async selectImage(imgPath) {
				try {
					//上传图片
					let res = await uploadImgAI(imgPath, {})
					//展示上传结果
					this.avatarUrl = res.url
					this.updateUserInfo({
						nickName: this.userInfo.nick_name,
						avatarUrl: res.url
					})
				} catch (error) {
					wx.hideLoading()
					if (error && error.isRefresh) {
						this.wxloginSmall().then(res => {})
					}
				} finally {}
			},
			// 扫一扫
			async scan() {
				if (this.isLoading) return
				this.isLoading = true
				try {
					let {
						longitude,
						latitude
					} = (await getUserLocation()).data
					let code = (await uni.scanCode())[1].result
					let res = await qr({
						longitude,
						latitude,
						code
					})
					if (res.data) {
						this.$go(`/pages/scanModular/details/index?data=${JSON.stringify(res.data)}`);
						return;
					}
					this.$toast(res.msg);
				} catch (e) {} finally {
					this.isLoading = false
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		// background-color: #f5f5f5;
		background-color: #FFF5E8;
	}
	.user_not-login{
		display: flex;
		padding: 40rpx 20rpx;
		.avatar{
			width: 112rpx;
			height: 112rpx;
			margin-right: 20rpx;
		}
		.user_not-txt{
			font-size: 30rpx;
			color: #666666;
			line-height: 34rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
		}
	}

	.xh-navber .left-tools {
		filter: brightness(0);
	}

	.user {
		.head-bg {
			width: 100%;
			height: 716rpx;
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
		}

		.user-head {
			height: 344rpx;
			// background-color: #2B7FDA;
			position: relative;
			overflow: hidden;
			.icon-scan {
				position: absolute;
				top: 40rpx;
				right: 30rpx;
			}
		}

		.user-head-image {
			width: 170rpx;
			height: 170rpx;
			border-radius: 50%;
			border: 2rpx solid #FFE0B9;
			margin: 40rpx auto 20rpx;
			position: relative;

			.wecome-logo {
				position: absolute;
				left: 0;
				top: 0;
			}

			.wecome-logo-button {
				width: 170rpx;
				height: 170rpx;
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
			}
		}

		.accredit {
			text-align: center;
			margin: 40rpx 0 20rpx;
		}

		.user-head-arc {
			position: absolute;
			width: 100%;
			height: 108rpx;
			left: 0;
			bottom: 0;
		}

		.user-head-logo {
			position: absolute;
			width: 382rpx;
			height: 304rpx;
			bottom: 0;
			right: -80rpx;
		}

		.user-nick {
			font-size: 32rpx;
			font-weight: 700;
			// color: #ffffff;
			color: #613007;
			text-align: center;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.edit-icon {
			width: 24rpx;
			height: 24rpx;
			margin-left: 5rpx;
		}

		.user-box {
			// background-color: #225BC8;
			padding-left: 20rpx;
			padding-right: 20rpx;
		}

		.user-total {
			display: flex;
			align-items: center;
			height: 208rpx;
			margin-bottom: 30rpx;
			box-sizing: border-box;
			position: relative;
			background: linear-gradient(139deg, #fce8d3 9%, #fbdbc0 97%);
			border-radius: 10rpx;
		}

		.total-item {
			flex: 1;
			text-align: center;
			position: relative;
		}

		.total-item+.total-item {
			&::after {
				content: '';
				position: absolute;
				width: 2rpx;
				height: 26rpx;
				opacity: 0.3;
				background-color: #E5CAAE;
				left: 0;
				bottom: 5%;
			}
		}

		.total-num {
			font-size: 36rpx;
			font-weight: 700;
			color: #FF7507;
		}

		.total-label {
			font-size: 28rpx;
			font-weight: 400;
			color: #613007;
			margin-top: 10rpx;
		}

		.user-tools {
			border-radius: 10px;
			box-sizing: border-box;
			// padding-top: 20rpx;
			// background-image: linear-gradient(0deg, #94c7ff 0%, #3e8de2 53%);
			background: #ffffff;
			// min-height: 350px;
		}

		.official-account {
			height: 150rpx;
			margin-top: 20rpx;
			border-radius: 20rpx;
			padding: 32rpx 0;
			padding-left: 26rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			background: url('https://file.y1b.cn/public/img/bfzx/gzh_icon@2x.png')no-repeat;
			background-size: 94rpx 92rpx;
			background-position: 8rpx 8rpx;
			background-color: #ffffff;
			.official-title {
				font-size: 28rpx;
				color: #4E4D52;
				margin-bottom: 16rpx;
			}

			.official-hint {
				font-size: 24rpx;
				color: #AAAAAA;
			}
		}

		.tools-item {
			display: flex;
			justify-content: space-between;
			padding-left: 30rpx;
			padding-top: 20rpx;
			padding-bottom: 12rpx;
			position: relative;

			.tools-num {
				color: #4E4D52;
				font-size: 28rpx;
				.credits_active {
					position: relative;
					&::after {
						content: '\3000';
						position: absolute;
						top: 0;
						right: -14rpx;
						width: 14rpx;
						height: 14rpx;
						border-radius: 50%;
						background: #E40030;
					}
				}
			}

			&::after {
				content: '';
				position: absolute;
				height: 2rpx;
				opacity: 0.3;
				background-color: #e2e2e2;
				left: 30rpx;
				right: 30rpx;
				bottom: 0;
			}
		}
		.exit_btn {
			margin-top: 20rpx;
			border-radius: 20rpx;
    		padding: 32rpx 0;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28rpx;
			background: #fff;
			color: #4e4d52;
		}

		.tools-title {
			display: flex;
			align-items: center;
			font-size: 28rpx;
			font-weight: 400;
			color: #4e4d52;
		}

		.tools-icon {
			width: 52rpx;
			height: 52rpx;
			margin-right: 30rpx;
			filter: brightness(0);
			opacity: 0.7;
		}

		// 积分iconui设计尺寸与其他icon不统一,重新起一个样式
		.tools-img {
			padding-left: 5rpx;
			width: 47rpx;
			height: 41rpx;
			margin-right: 30rpx;
			filter: brightness(0);
			opacity: 0.7;
		}

		& button:after {
			border: none;
		}

		& button {
			background-color: transparent;
			padding: 0;
		}
	}

	// 公众号遮罩弹窗样式
	.overlay-wrapper {
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.overlay-content {
			width: 408rpx;
			height: 470rpx;
			border-radius: 20rpx;
			border: 8rpx solid #FCC982;
			box-sizing: border-box;
			background-color: #fff;
			text-align: center;
			image{
				width: 384rpx;
				height: 384rpx;
			}
			text{
				color: #999999;
				font-size: 28rpx;	
			}
		}

		.close-img {
			width: 56rpx;
			height: 56rpx;
			margin-top: 24rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>