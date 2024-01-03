<template>
	<view class="index nav_cont">
		<privacy-popup ref="privacyPopup"></privacy-popup>
		<mescroll-body id="mescrollBody" ref="mescrollRef" @init="mescrollInit" @down="goodsMixin_downCallback"
			:down="goodsMixin_downOption" :up="goodsMixin_upOption" @up="goodsMixin_upCallback">
			<!-- 轮播图 -->
			<home-swiper />
			<!-- 用户头像与名称 -->
			<view class="user-info" v-if="isLogin">
				<view class="user-header" @click="goPages('/pages/personal/userInfo/index')">
					<image class="user-img" mode="aspectFill" :src="userInfo?userInfo.avatar_url : ''" />
					<view class="user-info-details">
						<view class="user-info-name">{{userInfo?userInfo.nick_name:'未登录'}}
							<!-- <image class="sex" mode="aspectFill"  src="../../../static/images/vip.png" /> -->
						</view>
						<view class="user-info-id">ID：{{userInfo?userInfo.id:''}}</view>
					</view>
				</view>
				<view class="user-tools">
					<view class="grand-prize" v-if="cactGetInfo" @click="goPages('/pages/scan/grandPrize/index')">
						<image class="grand-prize-icon" src="/static/images/grand_prize_icon.png" mode="aspectFill">
						</image>
						<view class="grand-prize-text">特等奖</view>
						<!-- 去填写 -->
						<view class="go-edit-user" v-if="!isCactComplete">去填写</view>
					</view>
					<view class="scan-scan" @click="goPages('/pages/scan/sweepRingCode/sweepRingCode')">
						<image class="scan-icon" src="/static/images/personal_icon_scan.png" mode="aspectFill">
						</image>
						<view class="scan-text">扫一扫</view>
					</view>
				</view>
			</view>
			<!-- 未登录状态 -->
			<view class="user-info" v-else @click="goPages('/pages/loginInner/loginInner')">
				<view class="user-header">
					<image class="user-img" mode="aspectFill" src="/static/images/user_icon.png" />
					<view class="user-info-details">
						<view class="user-info-name">Hello!</view>
						<view class="user-info-id">登录享受更多精彩服务</view>
					</view>
				</view>
				<view class="login-tools">注册/登录</view>
			</view>
			<!-- 天天享礼积分 -->
			<view class="ttxl-user" id="ttxlUser" @click="goTtxl('my_score')">
				<!-- 背景 -->
				<image class="ttxl-user-bg" src="/static/ttxl/ttxl_user_jfbg.png" mode="scaleToFill"></image>
				<!-- 可用积分 -->
				<view class="ttxl-user-credits">
					<image style="width: 178rpx;height: 30rpx;margin-right: 10rpx;" src="/static/ttxl/ttxl_user_jf.png"
						mode="aspectFill">
					</image>
					<text v-if="!isLogin" style="margin-left: 10rpx;">*</text>
					<view v-else style="font-size: 40rpx;color: #FD4B47;line-height: 56rpx;height: 56rpx;">{{credits}}
					</view>
				</view>
				<!-- 按钮 -->
				<view class="ttxl-user-btn">
					<image v-if="creditsData.credits>10" class="ttxl-icon" src="/static/ttxl/ttxl_user_syjf.png"
						mode="aspectFill"></image>
					<image v-else class="ttxl-icon" src="/static/ttxl/ttxl_user_zjf.png" mode="aspectFill"></image>
				</view>
			</view>
			<!-- 红牛 -->
			<view class="p-card p-card-box">
				<!-- 角标 -->
				<view class="corner hn">红牛</view>
				<!-- 左边内容 -->
				<view class="pcb-left" @click="goPages('/pages/personal/myCardBag/index?type=0')">
					<view class="p-card-num" v-if="isLogin">
						<text>{{statistics.hn_unused||0}}</text>
						<view class="go-exchange">去换购</view>
					</view>
					<view class="p-card-num" v-else>
						<text>*</text>
						<view class="go-exchange">去换购</view>
					</view>
					<view class="p-card-label">可用换购券(张)</view>
				</view>
				<!-- 右边内容 -->
				<view class="pcb-right" @click="goPages('/pages/personal/shop/index?type=0')">
					<image class="pcb-right-icon" src="/static/images/p_hn_location.png" mode="aspectFill"></image>
					<view class="pcb-right-box">
						<view class="prb-title">
							查看换购点<image class="p-arrow" src="/static/images/p_arrow.png" mode="aspectFill"></image>
						</view>
						<view class="prb-label">可查看附近的换购店铺</view>
					</view>
				</view>
			</view>
			<!-- 战马 -->
			<view class="p-card  p-card-box" v-if="isShowZm">
				<!-- 角标 -->
				<view class="corner zm">战马</view>
				<!-- 左边内容 -->
				<view class="pcb-left" @click="goPages('/pages/personal/myCardBag/index?type=1')">
					<view class="p-card-num" v-if="isLogin">
						<text>{{statistics.zm_unused||0}}</text>
						<view class="go-exchange" v-if="statistics.zm_unused>0">去换购</view>
					</view>
					<view class="p-card-num" v-else>
						<text>*</text>
						<view class="go-exchange" v-if="statistics.zm_unused>0">去换购</view>
					</view>
					<view class="p-card-label">可用换购券(张)</view>
				</view>
				<!-- 右边内容 -->
				<view class="pcb-right" @click="goPages('/pages/personal/shop/index?type=1')">
					<image class="pcb-right-icon" src="/static/images/p_zm_location.png" mode="aspectFill"></image>
					<view class="pcb-right-box">
						<view class="prb-title">
							查看换购点<image class="p-arrow" src="/static/images/p_arrow.png" mode="aspectFill"></image>
						</view>
						<view class="prb-label">可查看附近的换购店铺</view>
					</view>
				</view>
			</view>
			<!-- 四小模块 -->
			<view class="p-card four-small-modules">
				<view class="fsm-item fsm-item-first" @click="goTtxl('my_shop')">
					<view class="fsm-item-logo">
						<image class="fsm-item-logo-icon" mode="aspectFill"
						src="../../../static/images/personal_icon_05.png"></image>
						<view class="fsm-item-new-188" v-if="user_tt_word">{{user_tt_word}}</view>
					</view>
					<view class="fsm-item-text" v-if="ttxlJumpConfig['my_shop']">
						{{ttxlJumpConfig['my_shop'].title}}
					</view>
				</view>
				<view class="fsm-item" @click="goPages('/pages/personal/scanRecord/scanRecord')">
					<image class="fsm-item-logo"  mode="aspectFill"
						src="../../../static/images/personal_icon_06.png"></image>
					<view class="fsm-item-text">扫码记录</view>
				</view>
				<!-- @click="goPages('/pages/personal/welfare/index')" -->
				<view class="fsm-item" @click="goTtxl('my_benefits')">
					<image class="fsm-item-logo" src="../../../static/images/personal_icon_07.png" mode="aspectFill">
					</image>
					<view class="fsm-item-text" v-if="ttxlJumpConfig['my_benefits']">
						{{ttxlJumpConfig['my_benefits'].title}}
					</view>
					<!-- 小红点 -->
					<view class="fsm-item-red animated rubberBand delay-1s" v-if="welfareTop.unused"></view>
				</view>
				<view class="fsm-item" @click="goPages('/pages/personal/aboutUs/index')">
					<image class="fsm-item-logo" mode="aspectFill"
						src="../../../static/images/personal_icon_08.png"></image>
					<view class="fsm-item-text">关于我们</view>
				</view>
			</view>
			<!-- 公众号引流 -->
			<!-- <xh-official-account customClass="official-account-home" eventName="followwoa_1"></xh-official-account> -->
			<!-- 底部 -->
			<view class="banner-ad" v-if="isShowAd">
				<ad unit-id="adunit-11a5f3c61ef44f16"></ad>
			</view>
			<!-- 天天卡券模块 -->
			<view v-if="goodsMixin_list.length>0" style="text-align: center;font-size: 0;padding-top: 25rpx;">
				<van-image width="260rpx" height="44rpx" src="/static/ttxl/ttxl_card_title.png" />
			</view>
			<!-- 商品列表 -->
			<goodList :list="goodsMixin_list" />
			<!-- 天天订单 -->
			<ttxlOrder :redRot="goodsMixin_redRot" />
		</mescroll-body>
		<!-- 固定模块 -->
		<view class="ttxl-sticky" :style="isSticky ? 'z-index:1000;opacity: 1;' : 'z-index:-1;opacity: 0;'">
			<view class="ttxl-kyjf">
				<text>可用积分：</text>
				<text v-if="!isLogin" style="font-size: 32rpx;color: #FD4B47;">*</text>
				<text v-else style="font-size: 32rpx;color: #FD4B47;">{{credits}}</text>
				<!-- 背景 -->
				<image class="ttxl-user-kyjf" src="/static/ttxl/ttxl_user_kyjf.png" mode="aspectFill"></image>
			</view>
			<view class="ttxl-gddh" @click="goTtxl('my_exchange')">
				<text>更多兑换</text>
				<van-icon name="arrow" />
			</view>
		</view>
		<!-- 导航栏 -->
		<custom-tab-bar currentIndex="2" />
	</view>
</template>

<script>
	import {
		mapGetters,
		mapActions
	} from 'vuex';
	import {
		PLAQUEADVERTISING,
		parseTime,
		debounce
	} from '@/utils/index.js';
	import {
		setWxScanQrCode,
		getWxScanQrCode,
		setReferer,
		getAppLaunchNum
	} from '@/utils/auth.js';
	import {
		cactGetInfo,
		getTtxlUser
	} from '@/api/homeApi.js';
	import customTabBar from '@/components/customTabBar/index.vue';
	import homeSwiper from './homeSwiper.vue';
	// import xhOfficialAccount from '@/components/xh-official-account.vue';
	import goodList from "@/components/ttxl/goodList.vue"
	import ttxlOrder from "@/components/ttxl/ttxlOrder.vue"
	import goodsMixin from "@/components/ttxl/goodsMixin.js"
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import WxCountUp from "@/utils/WxCountUp.js"

	//插屏广告管理
	let _PLAQUEADVERTISING = null;
	export default {
		mixins: [MescrollMixin, goodsMixin],
		components: {
			homeSwiper,
			// xhOfficialAccount,
			customTabBar,
			goodList,
			ttxlOrder
		},
		computed: {
			...mapGetters(['userInfo', 'statistics', 'isAuthorization', 'isLogin', 'isShowAd',
				'welfareTop', 'user_tt_word', 'ttxlJumpConfig'
			]),
			isShowZm() {
				if (!this.statistics || Object.keys(this.statistics).length === 0) return true
				let {
					zm_unused,
					zm_used,
					zm_overdue
				} = this.statistics
				return zm_unused > 0 || zm_used > 0 || zm_overdue > 0
			},
			isCactComplete() {
				if (!this.cactGetInfo) return false
				let {
					id_card,
					mobile,
					detailed,
					region
				} = this.cactGetInfo
				return id_card && mobile && detailed && region
			},

		},
		data() {
			return {
				fileUrl: 'https://file.y1b.cn/public/img/bfxn/202101/',
				cactGetInfo: null,
				creditsData: {
					credits: 0,
					page: ""
				},
				credits: 0,
				credits2: 0,
				isSticky: false,
				ttxlCardHeadTop: 0
			};
		},
		watch: {
			userInfo(j, k) {
				//防止多次调用
				// if (ONESTART !== 0) return
				//没有授权过，滚去重新授权
				if (!this.isAuthorization) {
					return this.$redirectTo({
						url: '/pages/login/login'
					});
				}
				//初始化扫码数据
				// if (this.isLogin) {
				this.initScanCodeInfo();
				//刷新数据
				this.init()
				// }
			}
		},
		// 页面初始化 options为页面跳转所带来的参数
		onLoad(o) {

			wx.getPrivacySetting && wx.getPrivacySetting({
				success: (res) => {
					if (res.needAuthorization) {
						this.$refs.privacyPopup.popUp()
					}
				}
			})

			//扫码进入当前页获取 二维码携带信息 
			if (o && o.q) { //sid代表店铺ID
				let _setReferer = 0;
				if (new RegExp('sid').test(o.q)) {
					//店铺码不做处理
					_setReferer = 1;
				} else { //拉环二维码
					let qr = decodeURIComponent(o.q);
					setWxScanQrCode(decodeURIComponent(o.q));
					//判断是否为拉环二维码
					if (RegExp('HTTP://4XV.CN').test(qr)) {
						_setReferer = 2;
					}
				}
				//设置判断
				setReferer(_setReferer);
			}
			//天天积分动画初始化
			this.countUp = new WxCountUp('credits', 0, {
				separator: '',
				duration: 1,
			}, this);

			this.countUp.start();

			//获取tt模块吸顶top值
			const query = wx.createSelectorQuery()
			query.select('#ttxlUser').boundingClientRect()
			query.selectViewport().scrollOffset()
			query.exec((res) => {
				this.ttxlCardHeadTop = res[0].top
			})
		},
		onShow() {
			//更新用户信息
			this.getUserInfo()
			//插屏广告管理初始化
			_PLAQUEADVERTISING = PLAQUEADVERTISING({
				onLoadBack: () => {
					//广告弹窗
					let wxScanQrCode = getWxScanQrCode();
					if (!wxScanQrCode) {
						_PLAQUEADVERTISING.play();
					}
				}
			});
			//初始化广告
			_PLAQUEADVERTISING.init('adunit-2fc278170a691d0f');
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				// console.log(res.target)
			}
			return {
				title: '中国红牛 1元换购',
				path: '/pages/tabBar/personal/index',
				imageUrl: 'https://file.y1b.cn/public/img/bfxl/2023/bfxl_share_2023.png'
			};
		},
		// filters: {
		// 	credits(val) {
		// 		if (val && val > 9999) {
		// 			let data = parseFloat(999999 / 10000).toString().split('.');
		// 			return data[0] + '万+';
		// 		}
		// 		return val;
		// 	}
		// },
		methods: {
			...mapActions({
				getCardTopCount: 'personal/getCardTopCount',
				getUserInfo: 'login/getUserInfo',
				getWelfareTop: 'personal/getWelfareTop',
				// getIsShowAd: 'login/getIsShowAd'
			}),
			//部分需要查询显示的模块功能
			init: debounce(function() {
				//查询用户是否中大奖
				cactGetInfo().then(res => {

					if (res.code == 1) {
						this.cactGetInfo = res.data
					}

				})
				getTtxlUser().then(res => {
					this.creditsData = res.data || {
						credits: 0,
						page: "/pages/tabBar/shopMall/index"
					}
					this.countUp.reset();
					this.countUp.update(this.creditsData.credits)
				})
				//更新顶部统计
				this.getCardTopCount();
				//获取福利统计
				this.getWelfareTop();
			}, 500),
			//对微信扫码信息进行处理
			initScanCodeInfo() {
				//是否有用户信息
				if (this.userInfo) {
					//获取扫描的拉环码信息
					let wxScanQrCode = getWxScanQrCode();

					//处理用户通过微信扫描的罐码
					if (wxScanQrCode) {
						setTimeout(() => {
							this.winningCheck(wxScanQrCode);
						}, 0);
					}

				}
			},
			goTtxl(key) {
				this.$ttxlUserPosition(key)
			},
			//跳转指定页面
			goPages(url) {
				this.$go({
					url
				});
			},
			winningCheck(wxScanQrCode) {
				//统一去扫码页处理
				this.$redirectTo({
					url: `/pages/scan/sweepRingCode/sweepRingCode?wxScanQrCode=${wxScanQrCode}`
				});
			}
		},
		onPageScroll({
			scrollTop
		}) {
			let ttxlCardHeadTop = this.ttxlCardHeadTop || 210
			let flag = scrollTop > ttxlCardHeadTop

			if (flag && flag != this.isSticky) {
				this.countUp.reset();
				this.countUp.update(this.creditsData.credits)
			}
			this.isSticky = flag
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #eeeeef;
	}

	.index {
		// position: fixed;
		// z-index: 0;
		// top: 0;
		// bottom: 0;
		// left: 0;
		// width: 100%;
		// height: 100%;
		// box-sizing: border-box;

	}


	/*头部用户信息相关*/
	.user-info {
		padding: 25rpx 80rpx 8rpx 60rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
	}

	.user-header {
		display: flex;
		align-items: center;
	}

	.user-img {
		width: 72rpx;
		height: 72rpx;
		border-radius: 50%;
		margin-right: 14rpx;
	}

	.user-info-details {
		width: 240rpx;
	}

	.user-info-name {
		color: #333;
		font-size: 32rpx;
		margin-bottom: 2rpx;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: 700;
	}

	.user-info-id {
		color: #999;
		font-size: 24rpx;
	}

	.user-tools {
		display: flex;
		align-items: center;
	}

	.scan-scan,
	.grand-prize {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.scan-scan {
		padding-top: 4rpx;
	}

	.grand-prize {
		margin-right: 120rpx;
		position: relative;
	}

	.grand-prize-icon {
		width: 56rpx;
		height: 56rpx;
	}

	.scan-icon {
		width: 40rpx;
		height: 40rpx;
		margin-bottom: 8rpx;
	}

	.scan-text,
	.grand-prize-text {
		color: #B48C33;
		font-size: 24rpx;
	}

	.go-edit-user {
		width: 64rpx;
		height: 28rpx;
		background-color: #ce141c;
		border-radius: 6px 6px 6px 0;
		position: absolute;
		right: -64rpx;
		top: 0;
		font-size: 16rpx;
		font-weight: 400;
		color: #ffffff;
		text-align: center;
		line-height: 28rpx;
	}

	.login-tools {
		width: 182rpx;
		height: 68rpx;
		border: 2rpx solid #ce141c;
		border-radius: 36rpx;
		font-size: 28rpx;
		color: #ce141c;
		text-align: center;
		line-height: 68rpx;
	}



	/*头部用户信息相关*/


	.p-card {
		border-radius: 10px;
		// box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.16);
		background-color: #FFFFFF;
		margin: 0 20rpx;
		position: relative
	}

	.p-card-box {
		display: flex;
		align-items: center;
		height: 155rpx;
		margin-bottom: 20rpx;
	}

	.p-card-box::after {
		content: '';
		position: absolute;
		border-left: 2rpx dashed #e5e5e5;
		height: 78rpx;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.corner {
		width: 88rpx;
		height: 34rpx;
		border-radius: 10px 0px 10px 0px;
		font-size: 24rpx;
		font-family: PingFang SC, PingFang SC-Bold;
		font-weight: 700;
		text-align: center;
		line-height: 34rpx;
		color: rgba(255, 255, 255, 0.95);
		position: absolute;
		left: 0;
		top: 0;
	}

	.corner.hn {
		background-color: #1d2088;
	}

	.corner.zm {
		background-color: #A50004;
	}

	.pcb-left,
	.pcb-right {
		flex: 1;
	}

	.pcb-left {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.pcb-right {
		display: flex;
		align-items: flex-end;
		justify-content: center;
	}

	.p-card-num {
		color: rgba(0, 0, 0, 0.95);
		font-size: 56rpx;
		font-weight: 700;
		position: relative;
	}

	.p-card-label {
		font-size: 24rpx;
		font-weight: 400;
		color: rgba(47, 47, 47, 1);
	}

	.go-exchange {
		width: 80rpx;
		height: 38rpx;
		background-color: #fe2119;
		border: 2rpx solid #fe140d;
		border-radius: 10px 10px 10px 0px;
		font-size: 20rpx;
		font-weight: 400;
		text-align: center;
		line-height: 38rpx;
		color: #ffffff;
		position: absolute;
		right: -8rpx;
		top: -12rpx;
		transform: translateX(100%);
	}

	.pcb-right-box {
		margin-left: 22rpx;
	}

	.pcb-right-icon {
		width: 76rpx;
		height: 76rpx;
	}

	.p-arrow {
		width: 28rpx;
		height: 28rpx;
	}

	.prb-title {
		font-size: 24rpx;
		font-weight: 800;
		color: #242424;
		display: flex;
		align-items: center;
		margin-bottom: 5rpx;
	}

	.prb-label {
		color: #707274;
		font-size: 16rpx;
	}

	.four-small-modules {
		display: flex;
		justify-content: space-between;
		padding: 35rpx 60rpx 35rpx;
	}

	.fsm-item {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.fsm-item-first {
		z-index: 1;
	}

	.fsm-item-red {
		width: 20rpx;
		height: 20rpx;
		background-color: #d81e06;
		border-radius: 50%;
		position: absolute;
		top: 0;
		right: 15rpx;
	}

	// .fsm-item-new {
	// 	position: absolute;
	// 	right: -45rpx;
	// 	top: -18rpx;
	// 	width: 80rpx;
	// 	height: 40rpx;
	// 	border-radius: 10px 0px 10px 0px;
	// 	font-size: 24rpx;
	// 	font-weight: 700;
	// 	text-align: center;
	// 	line-height: 40rpx;
	// 	color: #ffffff;
	// 	background-color: #d81e06;
	// 	animation: fsmItemNew 3s ease-in-out infinite;
	// }

	.fsm-item-new-188 {
		position: absolute;
		left: 60rpx;
		top: -18rpx;
		height: 40rpx;
		padding: 0 15rpx;
		border-radius: 10px 0px 10px 0px;
		font-size: 24rpx;
		font-weight: 700;
		text-align: center;
		line-height: 40rpx;
		white-space: nowrap;
		color: #ffffff;
		background-color: #d81e06;
		transform-origin: bottom left;
		animation: fsmItemNew 3s ease-in-out infinite;
	}

	.fsm-item-logo {
		width: 60rpx;
		height: 60rpx;
		position: relative;
		font-size: 0;
		// z-index: 1;
	}

	.fsm-item-logo-icon {
		width: 60rpx;
		height: 60rpx;
	}

	.fsm-item-text {
		font-size: 24rpx;
		color: #242424;
		margin-top: 5rpx;
	}

	.doll-item {
		padding-left: 30rpx;
		width: 140rpx;
		height: 108rpx;
	}

	.banner-ad {
		width: 100%;
		margin-top: 30rpx;
	}

	.fast-expiration {
		width: 80rpx;
		height: 43rpx;
		position: absolute;
		right: 0;
		top: 0;
	}

	.ttxl-user {
		box-sizing: border-box;
		width: 670rpx;
		height: 104rpx;
		padding: 13.5rpx 15rpx 0 24rpx;
		position: relative;
		z-index: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-left: 50rpx;
		margin-bottom: 40rpx;

	}

	.ttxl-user-bg {
		position: absolute;
		left: 0;
		top: 0;
		width: 670rpx;
		height: 104rpx;
		z-index: -1;
	}

	.ttxl-user-btn {
		font-size: 0;
	}

	.ttxl-icon {
		width: 184rpx;
		height: 68rpx;
	}

	.ttxl-user-credits {
		white-space: nowrap;
		font-size: 40rpx;
		font-weight: 800;
		color: #fd4b47;
		display: flex;
		align-items: center;
	}

	@keyframes fsmItemNew {
		0% {
			transform: scale(0.1);
		}

		15% {
			transform: scale(1.5);
		}

		20% {
			transform: scale(1);
		}

		100% {
			transform: scale(1);
		}

	}

	.ttxl-sticky {
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		padding: 0 20rpx;
		height: 76rpx;
		width: 100%;
		background-color: #ffffff;
		position: fixed;
		top: 0;
		left: 0;
		z-index: -1;
		width: 100%;
	}

	.ttxl-kyjf {
		position: relative;
		padding-left: 18rpx;
		font-size: 32rpx;
		font-weight: 800;
		color: #333333;
		height: 44rpx;
		line-height: 44rpx;
		display: flex;
		align-items: center;
	}

	.ttxl-user-kyjf {
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 270rpx;
		height: 38rpx;
	}

	.ttxl-gddh {
		font-size: 28rpx;
		color: #999999;
		line-height: 40rpx;
	}
</style>
