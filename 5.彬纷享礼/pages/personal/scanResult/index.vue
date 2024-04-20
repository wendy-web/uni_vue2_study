<!-- 扫码结果页 -->
<template>
	<view :class="{'scan_result': true, 'active': !newUser && !isSticky }">
		<mescroll-body id="mescrollBody" ref="mescrollRef" @init="mescrollInit" @down="goodsMixin_downCallback"
			:down="goodsMixin_downOption" :up="goodsMixin_upOption" @up="goodsMixin_upCallback">
			<xh-navbar title="扫码结果" navberColor="#F5F6FA" titleAlign="titleCenter"
				leftImage="../../static/images/left_black_arrow.png" titleColor="#333" :leftCallBack="true"
				@leftCallBack="leftCallBackHandle" />
			<block v-if="newUser">
				<view :style="{ '--height': newUserDomHeight + 'px'}" :class="{'cont_box': true,
				'active': isBackAni , 'height_active': isBackAni
			}">
					<view :class="['front_box', startAni ? 'active' : '']" @click="backAniHandle">
						<image class="hand_icon" mode="widthFix"
							src="https://file.y1b.cn/store/1-0/2415/65979eac94c5e.png"></image>
						<image class="front_img_ava1" mode="widthFix"
							src="https://file.y1b.cn/store/1-0/231220/6582511f0823f.png"></image>
						<image class="front_img_lightBg" mode="scaleToFill"
							src="https://file.y1b.cn/store/1-0/231220/65825c495e708.png"></image>
						<image class="ava_left" mode="widthFix"
							src="https://file.y1b.cn/store/1-0/231220/65825c266c2be.png"></image>
						<image class="gift_icon" mode="widthFix"
							src="https://file.y1b.cn/store/1-0/231220/65825bed8ba15.png"></image>
						<image class="gift_text" mode="widthFix"
							src="https://file.y1b.cn/store/1-0/231220/65825c657b99b.png"></image>
						<view class="num_list">
							<image class="text_num text_num3" mode="scaleToFill"
								src="https://file.y1b.cn/store/1-0/231220/658284289d9f5.png"></image>
							<image class="text_num text_num2" mode="scaleToFill"
								src="https://file.y1b.cn/store/1-0/231220/6582843f45ccd.png"></image>
							<image class="text_num text_num1" mode="scaleToFill"
								src="https://file.y1b.cn/store/1-0/231220/6582847019788.png"></image>
						</view>
					</view>
					<view class="back_box" @click="goToNewUserHandle">
						<image class="back_img" id="newUserId" mode="widthFix" :src="losingIcon"></image>
					</view>
				</view>
				<view class="cont_lab">
					积分奖励及积分活动由平台方提供，“1元换购”活动主办方不提供任何保证，且不承担任何法律责任，您可以自行决定是否参与相关活动。
				</view>
			</block>
			<view id="oldUserId" v-else>
				<view class="scan-result-bg" v-if="!isSticky">
					<easy-loadimage imageClass="scan-result-bgIcon" mode="widthFix"
						:image-src="fileBaseUrl + 'bfxn_scan_result_01.png'">
					</easy-loadimage>
				</view>
				<!-- 内容部分 -->
				<view class="scan-result-body">
					<view class="srb-i-text">奖励您<text class="srb-i-text-num">{{data.inc_num}}</text>个积分</view>
					<view class="tips-msg">可在彬纷享礼小程序-积分商城中查看</view>
					<view class="xy-text-list">
						<view class="xtl-item">
							积分奖励及积分活动由平台方提供，“{{[4,15].includes(data.prizeratetype) ? '战马1元乐享' : '1元换购'}}”活动
						</view>
						<view class="xtl-item">主办方不提供任何保证，且不承担任何法律责任，</view>
						<view class="xtl-item">您可以自行决定是否参与积分相关活动。</view>
					</view>
					<easy-loadimage imageClass="srb-bg" mode="widthFix"
						image-src="https://file.y1b.cn/public/img/bfxn/202103/bfxn_scan_result_210501_2.png"></easy-loadimage>
				</view>
				<anNoticeBarShow v-if="![4,15].includes(data.prizeratetype)" :awardList="awardList" bg-color="#5544BF"
					margin="0 auto 40rpx" />
				<!-- 继续扫码按钮 -->
				<view class="btn-tools">
					<view v-if="integralBtn" class="btn-item" @click="lookIntegralDouble">
						<view class="btn-item-text fs-32 text-red">看视频积分翻倍</view>
						<image class="btn-item-bg" mode="widthFix" src="../static/scanResult/bfxl_scan_reslut_05.png">
						</image>
						<!-- 天天享礼引导 -->
						<!-- <view class="ttxl-tips heartBeat" :class="integralBtn?'ttxl-tips-01':'ttxl-tips-02'">
				福利待领取
			</view> -->
					</view>
					<view class="btn-item animated tada infinite" @click="goShopMall">
						<view class="btn-item-text fs-36">{{scanResult.btn_word}}</view>
						<image class="btn-item-bg" mode="widthFix" src="../static/scanResult/bfxl_scan_reslut_06.png">
						</image>
						<view class="ttxl-tips ttxl-tips-02">
							{{scanResult.suspend_word}}
						</view>
					</view>
				</view>
				<!-- 积分规则 -->
				<view class="jf-details" @click="goAgreementLook">
					<text class="jf-details-text">积分规则</text>
					<image class="jf-details-icon" src="../static/tips.png"></image>
				</view>
				<!-- 底部 -->
				<view class="banner-ad" v-if="isShowAd">
					<xh-official-account customClass="official-account-scan"
						eventName="followwoa_2"></xh-official-account>
					<ad unit-id="adunit-5ed880a587aa1a35"></ad>
					<view class="van-submit-bar__safe"></view>
				</view>
			</view>
			<!-- 天天卡券模块 -->
			<view id="scanResultBody" class="scanResult_bg">
				<block v-if="showListCont">
					<view class="card_title">
						<van-image width="260rpx" height="44rpx"
							src="https://file.y1b.cn/public/hn29th/ttxl/ttxl_card_title.png" />
					</view>
					<!-- 商品列表 -->
					<goodList id="goodList" :list="goodsMixin_list" :path-type="goodsMixin_pathType" />
				</block>
			</view>
		</mescroll-body>
		<!-- 固定模块 - 暂时关闭列表 -->
		<view v-if="goodsMixin_list && goodsMixin_list.length" :class="['ttxl-sticky', isSticky ? 'active' : '']"
			:style="{top: navHeight + 'px'}">
			<view class="ttxl-kyjf">
				<text>可用积分：</text>
				<text v-if="!isLogin" style="margin-left: 10rpx;">*</text>
				<text v-else style="font-size: 32rpx;color: #FD4B47;">{{credits}}</text>
				<image class="ttxl-user-kyjf" src="https://file.y1b.cn/public/hn29th/ttxl/ttxl_user_kyjf.png"
					mode="aspectFill"></image>
			</view>
			<view class="ttxl-gddh" @click="goTtxl('code_exchange')">
				<text>更多兑换</text>
				<van-icon name="arrow" />
			</view>
		</view>
		<!-- 积分翻倍 -->
		<double-dialog ref="doubleDialog" @close="closeDoubleDialogHandle"/>
	</view>
</template>
<script>
	import {
awardList,
getTtxlUser,
videofb
} from '@/api/homeApi.js';
import anNoticeBarShow from "@/components/anNoticeBarShow.vue";
import goodList from "@/components/ttxl/goodList.vue";
import goodsMixin from "@/components/ttxl/goodsMixin.js";
import xhOfficialAccount from '@/components/xh-official-account.vue';
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import WxCountUp from "@/utils/WxCountUp.js";
import {
RewardedVideoAd
} from "@/utils/index.js";
import {
getNavbarData
} from '@/utils/xhNavbar.js';
import {
mapGetters
} from 'vuex';
import doubleDialog from "./doubleDialog.vue";
	// 激励视频广告
	let _RewardedVideoAd = null
	let _scrollTop = 0
	export default {
		mixins: [MescrollMixin, goodsMixin],
		components: {
			goodList,
			doubleDialog,
			doubleDialog,
			xhOfficialAccount,
			anNoticeBarShow
		},
		onLoad(option) {
			const pageReportKey = this.newPeople ? 'newuser' : 'olduser';
			this.$ttxlReportEvent(pageReportKey);
			// 重置
			_scrollTop = 0;
			//初始化激励视频
			_RewardedVideoAd = RewardedVideoAd('adunit-0b4435b20332832d', (complete) => {
				if (!complete) {
					return
				}
				//正常查看关闭按钮防止继续看视频
				this.integralBtn = false
				videofb({
					fbid: this.data.fbid
				}).then(res => {
					if (res.code == 1) {
						let {
							num
						} = res.data;
						this.$refs.doubleDialog.show(num)
						return
					}
					/*错误提示*/
					uni.showToast({
						icon: 'none',
						title: res.msg
					})
				})
			}, (err) => {
				this.integralBtn = false
			})
			_RewardedVideoAd.init()
			//处理页面参数
			// this.data = decodeURIComponent(option.data);
			this.data = JSON.parse(decodeURIComponent(option.data));
			this.type = Number(option.type);
			this.path += 'type=' + option.type + '&data=' + option.data;
			// 获取天天用户积分
			getTtxlUser().then(res => {
				this.creditsData = res.data || {
					credits: 0,
					page: "/pages/tabBar/shopMall/index"
				}
				this.countUp.reset();
				this.countUp.update(this.creditsData.credits)
			})
			// 天天积分动画初始化
			this.countUp = new WxCountUp('credits', 0, {
				separator: '',
				duration: 1,
			}, this);
			this.countUp.start();
			setTimeout(() => {
				this.initDomHeight();
			}, 2000);
			getNavbarData().then(res => {
				let {
					navBarHeight,
					statusBarHeight
				} = res;
				this.navHeight = navBarHeight + statusBarHeight
			});

			awardList({ prizeratetype: 14 }).then(res => {
				this.awardList = res.data || []
			})
			this.mescroll.triggerUpScroll();
		},
		onShow() {
			if (!this.newUser) return;
			wx.nextTick(() => {
				setTimeout(() => {
					this.startAni = true;
					this.backTime = null;
					this.backTime = setTimeout(() => {
						clearTimeout(this.backTime)
						this.isBackAni = true;
					}, 6100);
				}, 500);
			});
		},
		data() {
			return {
				integralBtn: true,
				data: {
					name: '',
					end_time: ''
				},
				type: 1, //1积分  2卡劵
				fileBaseUrl: 'https://file.y1b.cn/public/img/bfxn/202103/',
				popoverKey: 'code_losing',
				isSticky: false,
				creditsData: {
					credits: 0,
					page: ""
				},
				credits: 0,
				goodsMixin_pathType: 1, //覆盖goodsMixin
				is_new: true,
				startAni: false,
				isBackAni: false,
				backTime: null,
				isCancel: false,
				newUserDomHeight: 0,
				navHeight: 0,
				awardList: []
			};
		},
		computed: {
			...mapGetters(['isShowAd', 'scanResult', 'isLogin', 'newUser', 'losingIcon', 'newPeople']),
			showListCont() {
				return (this.goodsMixin_list.length > 0) && this.isCancel;
			},
			// 积分兑换的标题头
			ttxlCardHeadTop() {
				let topValue = this.newUserDomHeight - uni.upx2px(76);
				if(this.newUser) {
					topValue = this.newUserDomHeight + uni.upx2px(200);
				}
				return topValue;
			}
		},
		watch: {
			// isBackAni(newValue, oldValue) {
			// 	if (!newValue) return;
			// 	this.mescroll.triggerUpScroll();
			// }
		},
		methods: {
			async goShopMall() {
				const statues = await this.$ttxlUserPositionAsync(this.popoverKey);
				if (statues) return;
				this.isCancel = true;
				setTimeout(() => {
					this.mescroll.scrollTo(this.ttxlCardHeadTop);
				}, 300);
			},
			closeDoubleDialogHandle() {
				this.isCancel = true;
				setTimeout(() => {
					this.mescroll.scrollTo(this.ttxlCardHeadTop);
				}, 300);
			},
			leftCallBackHandle() {
				this.$switchTab({
					url: '/pages/tabBar/personal/index'
				});
			},
			async initDomHeight() {
				let idName = this.newUser ? 'newUserId' : 'oldUserId';
				const domBoxRes = await this.warpRectDom(idName);
				this.newUserDomHeight = domBoxRes && domBoxRes.height || 0;
			},
			goTtxl(key) {
				this.$ttxlUserPosition(key);
			},
			backAniHandle() {
				this.$ttxlReportEvent('ntry');
				this.isBackAni = true;
			},
			async goToNewUserHandle() {
				// 配置的内容
				const ttxlCode = 'code_newuser';
				const statues = await this.$ttxlUserPositionAsync(ttxlCode);
				if (statues) return;
				this.isCancel = true;
				setTimeout(() => {
					this.mescroll.scrollTo(this.ttxlCardHeadTop);
				}, 300);
			},
			// 查看积分翻倍
			lookIntegralDouble() {
				_RewardedVideoAd.show();
				this.popoverKey = 'code_popover_close';
				this.$ttxlReportEvent('lwvideo');
			},
			gowebview() {
				if (!this.data.url) return this.$redirectTo({
					url: '/pages/personal/welfare/index'
				});
				//正常跳转
				this.$go({
					url: '/pages/webview/webview?link=' + encodeURIComponent(this.data.url)
				});
			},
			goAgreementLook() {
				this.$go({
					url: '/pages/webview/webview?link=' + encodeURIComponent(
						'https://txc.y1b.cn/index/index/creditsrule.html')
				});
			},
			warpRectDom(idName) {
				return new Promise((resolve) => {
					setTimeout(() => {
						// 延时确保dom已渲染, 不使用$nextclick
						let query = uni.createSelectorQuery();
						// #ifndef MP-ALIPAY
						query = query.in(this); // 支付宝小程序不支持in(this),而字节跳动小程序必须写in(this), 否则都取不到值
						// #endif
						query.select("#" + idName).boundingClientRect((data) => {
							resolve(data);
						}).exec();
					}, 20);
				});
			},
		},
		onUnload() {
			this.backTime = null;
			clearTimeout(this.backTime);
		},
		onPageScroll({ scrollTop }) {
			let flag = scrollTop >= (this.ttxlCardHeadTop - 5);
			if (flag && flag != this.isSticky) {
				this.countUp.reset();
				this.countUp.update(this.creditsData.credits);
			}
			this.isSticky = flag;
			_scrollTop = scrollTop;
		}
	};
</script>
<style lang="scss">
	#oldUserId {
		overflow: hidden;
	}
	.scan_result {
		background-color: #F5F6FA;

		&.active {
			background-color: #4735BD;
		}

		.scan-result-bg {
			position: fixed;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			z-index: 0;
			background-image: linear-gradient(315deg, #402dbb, #402dbb 51%, #aa4ad0);
		}

		.scan-result-bgIcon {
			position: absolute;
			width: 716rpx;
			left: 10rpx;
			top: 26rpx;
		}

		.scan-result-text-icon {
			width: 604rpx;
			height: 66rpx;
			position: absolute;
			top: 120rpx;
			left: 50%;
			margin-left: -302rpx;
		}

		.scan-result-body {
			position: relative;
			width: 700rpx;
			margin: 100rpx auto 0;
			// top: 100rpx;
			// left: 50%;
			// margin-left: -350rpx;
		}

		.srb-bg {
			width: 700rpx;
			height: 633.5rpx;
			left: 0;
			top: 0;
		}

		.srb-i {
			width: 378rpx;
			position: absolute;
			z-index: 1;
			top: 340rpx;
			left: 50%;
			margin-left: -189rpx;
		}

		.srb-i-icon {
			width: 378rpx;
			height: 184rpx;
			position: absolute;
			top: 0;
			left: 0;
		}

		.srb-i-text {
			position: absolute;
			top: 340rpx;
			left: 0;
			right: 0;
			color: #333;
			text-align: center;
			font-size: 32rpx;
			z-index: 1;
		}

		.srb-i-text-num {
			font-size: 52rpx;
			color: #333;
			margin-right: 10rpx;
		}

		.srb-i-text-unit {
			font-size: 30rpx;
			color: #333;
		}

		.term-validity {
			position: absolute;
			top: 320rpx;
			left: 0;
			right: 0;
			text-align: center;
			color: #999;
			z-index: 1;
			font-size: 20rpx;
		}

		.tips-msg {
			position: absolute;
			top: 420rpx;
			left: 0;
			right: 0;
			text-align: center;
			color: #E70516;
			z-index: 1;
			font-size: 20rpx;
			font-weight: bold;
		}

		.btn-tools {
			height: 116rpx;
			width: 100%;
			display: flex;
			justify-content: center;
			margin-bottom: 30rpx;
		}

		.btn-item {
			width: 346rpx;
			height: 116rpx;
			position: relative;
		}

		.fs-36 {
			font-size: 36rpx;
		}

		.fs-32 {
			font-size: 32rpx;
		}

		.btn-item-bg {
			width: 346rpx;
			height: 116rpx;
			position: absolute;
			left: 0;
			top: 0;
		}

		.btn-item-text {
			color: #fff;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: 46rpx;
			z-index: 1;
			white-space: nowrap;
			font-weight: bold;
		}

		.text-red {
			color: #E70516;
		}

		.ttxl-tips {
			font-size: 24rpx;
			font-weight: 700;
			color: #FE0702;
			background-color: #FE1A13;
			border: 2rpx solid #fdd753;
			box-sizing: border-box;
			display: flex;
			justify-content: center;
			align-items: center;
			box-shadow: inset 0 -6rpx 10px #FF8533;
		}

		.ttxl-tips-02 {
			padding: 8rpx 14rpx;
			background: #FFE11B;
			border: 2rpx solid #fdd753;
			border-radius: 26rpx 26rpx 26rpx 0rpx;
			position: absolute;
			right: 80rpx;
			top: -25rpx;
		}

		.card-text {
			color: #333;
			font-size: 28rpx;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			top: 273rpx;
			color: #333;
			z-index: 1;
			font-weight: 700;
		}

		.xy-text-list {
			position: absolute;
			z-index: 1;
			left: 0;
			right: 0;
			top: 490rpx;
			text-align: center;
			font-size: 18rpx;
			color: #999;
		}

		.jf-details {
			display: flex;
			justify-content: center;
			align-items: center;
			padding-bottom: 20rpx;
			white-space: nowrap;
			position: relative;
			z-index: 1;
			margin-bottom: 20rpx;
		}

		.jf-details-text {
			font-size: 24rpx;
			color: #E1E1E1;
		}

		.jf-details-icon {
			width: 28rpx;
			height: 28rpx;
			margin-left: 10rpx;
		}

		.banner-ad {
			width: 100%;
		}

		.van-submit-bar__safe {
			height: constant(safe-area-inset-bottom);
			height: env(safe-area-inset-bottom)
		}
	}

	/*新增15：44*/
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
		width: 100%;
		z-index: -1;
		opacity: 0;

		&.active {
			z-index: 1000;
			opacity: 1;
		}
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

	.card_title {
		text-align: center;
		font-size: 0;
		padding-top: 40rpx;
	}

	.cont_box {
		display: flex;
		justify-content: center;
		width: 100%;
		height: 696rpx;
		position: relative;
		perspective: 1000rpx;
		/* 定义观察点的距离 */
		margin: 48rpx auto 0;

		&.active {
			.front_box {
				transform: rotateY(-180deg);
				opacity: 0;
			}

			.back_box {
				transform: rotateY(0deg);
			}
		}

		&.height_active {
			height: var(--height);
		}

		&::after {
			content: ".";
			clear: both;
			height: 0;
			overflow: hidden;
			display: block;
			visibility: hidden;
		}
	}

	.cont_lab {
		font-size: 24rpx;
		color: #aaa;
		line-height: 34rpx;
		margin: 40rpx 32rpx 0;
	}

	.front_box,
	.back_box {
		box-sizing: border-box;
		position: absolute;
		// left: 0;
		align-self: flex-start;
		backface-visibility: hidden;
		/* 隐藏背面 */
		z-index: 0;
	}

	.front_box {
		width: 100%;
		height: 696rpx;
		z-index: 2;
		transform: rotateY(0deg);
		transition: transform 0.3s;
		padding: 40rpx 0;

		&::before {
			content: '\3000';
			background: url("https://file.y1b.cn/store/1-0/231220/65825616564e9.png") 0 0 / cover;
			width: 686rpx;
			height: 100%;
			position: absolute;
			top: 0;
			left: 50%;
			transform: translateX(-50%);
			z-index: -1;
		}

		.hand_icon {
			position: absolute;
			bottom: 20rpx;
			right: 25%;
			width: 86rpx;
			height: 86rpx;
			animation: headAni .5s infinite alternate;
		}

		.front_img_ava1 {
			width: 400rpx;
			height: 274rpx;
			display: block;
			margin: 198rpx auto 0;
		}

		.front_img_lightBg {
			width: 0;
			height: 546rpx;
			position: absolute;
			left: 0;
			top: 68rpx;
		}

		.ava_left {
			width: 376rpx;
			height: 274rpx;
			position: absolute;
			left: 0;
			top: 214rpx;
			opacity: 0;
		}

		.gift_icon {
			width: 380rpx;
			height: 312rpx;
			position: absolute;
			right: 16rpx;
			top: 196rpx;
			opacity: 0;
		}

		.gift_text {
			width: 384rpx;
			height: 154rpx;
			position: absolute;
			right: 46rpx;
			top: 260rpx;
			opacity: 0;
		}

		.num_list {
			position: absolute;
			z-index: 0;
			top: 242rpx;
			right: 140rpx;
			width: 182rpx;
			height: 162rpx;
			opacity: 0;

			&::before {
				content: '\3000';
				background: url("https://file.y1b.cn/store/1-0/231220/6582866d3032f.png") 0 0 / cover;
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				z-index: -1;
			}

			.text_num {
				width: 96rpx;
				height: 144rpx;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				margin-top: -14rpx;
				opacity: 0;
			}
		}

		&.active {
			.front_img_ava1 {
				animation: ava1Rotate .5s linear;
				animation-fill-mode: forwards;
			}

			.front_img_lightBg {
				animation: lightBgWidth .5s linear;
				animation-delay: .4s;
				animation-fill-mode: forwards;
			}

			.ava_left {
				animation: avaLeftOpacity .5s linear;
				animation-delay: .6s;
				animation-fill-mode: forwards;
			}

			.gift_icon {
				animation: giftIconOpacity .5s linear;
				animation-delay: .9s;
				animation-fill-mode: forwards;
			}

			.gift_text {
				animation: giftTextOpacity 2.5s linear;
				animation-delay: .8s;
				animation-fill-mode: forwards;
			}

			.num_list {
				animation: numListOpacity .4s linear;
				animation-delay: 3s;
				animation-fill-mode: forwards;

				.text_num3 {
					animation: numList3Opacity 1s linear;
					animation-delay: 3.1s;
					animation-fill-mode: forwards;
				}

				.text_num2 {
					animation: numList2Opacity 1s linear;
					animation-delay: 4.1s;
					animation-fill-mode: forwards;
				}

				.text_num1 {
					animation: numList1Opacity 1s linear;
					animation-delay: 5.1s;
					animation-fill-mode: forwards;
				}
			}
		}
	}

	@keyframes headAni {
		0% {
			transform: translate(0, 0);
		}

		100% {
			transform: translate(20rpx, 5rpx);
		}
	}

	@keyframes ava1Rotate {
		0% {
			transform: rotateY(0);
		}

		80% {
			opacity: 1;
		}

		100% {
			opacity: 0;
			transform: rotateY(180deg);
		}
	}

	@keyframes lightBgWidth {
		0% {
			width: 0;
		}

		100% {
			width: 100%;
		}
	}

	@keyframes avaLeftOpacity {
		0% {
			transform: rotate(-90deg) scale(.2);
			opacity: 0;
		}

		100% {
			transform: rotate(0deg) scale(1);
			opacity: 1;
		}
	}

	@keyframes giftIconOpacity {
		0% {
			transform: translateY(50%);
			opacity: 0;
		}

		100% {
			transform: translateY(0);
			opacity: 1;
		}
	}

	@keyframes giftTextOpacity {
		0% {
			transform: translateX(-20%);
			opacity: 0;
		}

		// 30% {
		// 	transform: translateX(0);
		// 	opacity: 1;
		// }
		50% {
			transform: translateX(0);
			opacity: 1;
		}

		75% {
			transform: scale(1.1);
			opacity: 1;
		}

		80% {
			transform: scale(1);
			opacity: 1;
		}

		100% {
			transform: scale(0);
			opacity: 0;
		}
	}

	@keyframes numListOpacity {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}

	@keyframes numList3Opacity {
		0% {
			transform: translate(-50%, -50%) scale(10, 0);
		}

		30% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
		}

		50% {
			transform: translate(-50%, -50%) scale(1);
		}

		75% {
			transform: translate(-50%, -50%) scale(1.1);
		}

		80% {
			transform: translate(-50%, -50%) scale(1);
			opacity: 1;
		}

		100% {
			transform: translate(-50%, -50%) scale(0);
			opacity: 0;
		}
	}

	@keyframes numList2Opacity {
		0% {
			transform: translate(-50%, -50%) scale(0);
			opacity: 0;
		}

		30% {
			transform: translate(-50%, -50%) scale(1);
			opacity: 1;
		}

		50% {
			transform: translate(-50%, -50%) scale(1);
			opacity: 1;
		}

		70% {
			transform: translate(-50%, -50%) scale(1.1);
			opacity: 1;
		}

		100% {
			transform: translate(-50%, -50%) scale(0);
			opacity: 0;
		}
	}

	@keyframes numList1Opacity {
		0% {
			transform: translate(-50%, 100%);
			opacity: 0;
		}

		30% {
			transform: translate(-50%, -50%);
			opacity: 1;
		}
	}

	.back_box {
		transform: rotateY(180deg);
		transition: transform 0.3s;
		width: 686rpx;

		// height: 100%;
		.back_img {
			display: block;
			width: 100%;
			height: 280rpx;
		}
	}
	.scanResult_bg{
		background: #f7f7f7;
		position: relative;
		z-index: 1;
		border-radius: 30rpx 30rpx 0 0;
	}
</style>
