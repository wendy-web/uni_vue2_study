<template>
	<view class="task nav_cont">
		<view class="sticky-tabs-head">
			<view :class="['sth-bg', !showWhiteBg ? '' : 'whiteBg']">
				<view class="rgbaBg_color"></view>
			</view>
			<xh-navbar :fixed="false" :fixedNum="9" titleAlign="titleRight" :overFlow="true">
				<view class="nav-custom fl_bet" slot="title" id="taskTitle">
					<image class="title_icon"
					:class="showMyBean ? 'fade-out' : 'fade-in'" mode="aspectFill"
					src="https://file.y1b.cn/store/1-0/2368/64817390944af.png"></image>
					<view class="my-beans" :class="!showMyBean ? 'fade-out' : 'fade-in'" @click="goMyCowpeaHandle">
						<image class="my-beans-icon" :src="imgUrl +'static/shopMall/beans-icon.png'" mode=""></image>
						<p-countup :num="userInfo.credits" width="11" height='18' color="#FE9B22" fontSize="18" fontWeight="600">
						</p-countup>
					</view>
					<image
						class="search_icon"
						src="https://file.y1b.cn/store/1-0/231123/655eeada7864e.png"
						mode="aspectFill"
						@click="toSearchHandle"
					></image>
				</view>
			</xh-navbar>
		</view>
		<mescroll-body
			ref="mescrollRef"
			@init="mescrollInit"
			@down="downCallback"
			:down="downOption"
			:up="{use: false}"
			:top=" stickyTop + 'px'"
		>
			<!-- 牛金豆 -->
			<view class="golden-beans" @click="goMyCowpeaHandle">
				<!-- 大背景图 -->
				<van-image class="bg" use-loading-slot lazy-load width="100%" height="390rpx"
					:src="imgUrl+'/task/bg_golden_beans.png'">
					<van-loading slot="loading" type="spinner" size="20" vertical />
				</van-image>
				<!-- 我的金豆 -->
				<view class="bean-box">
					<view class="today-bean">今日收益：
						<!-- {{userInfo.credits>99999?'99999+':userInfo.credits}} -->
						<p-countup :num="isAutoLogin ? totalToady : 0" width="8" height='13' color="#999999" fontSize="12"></p-countup>
					</view>
					<view class="total-bean-box">
						<view class="bean-title">
							<image class="icon_beans" :src="imgUrl+'task/icon_beans.png'" mode="aspectFit">
							</image>
							<view>牛金豆</view>
							<image class="icon-colon-tr" :src="imgUrl+'task/icon_colon_top.png'" mode="aspectFit">
							</image>
						</view>
						<view class="total-bean">
							<image class="icon-colon-bl" :src="imgUrl+'task/icon_colon_bottom.png'" mode="aspectFit">
							</image>
							<!-- {{userInfo.credits>9999?'9999+':userInfo.credits}} -->
							<view style="margin-bottom: -4rpx;">
								<p-countup id="todayBean" :num="userInfo.credits" width="20" height='36' color="#666666"
									fontSize="36"></p-countup>
							</view>
							<image class="task-triangle" :src="imgUrl + 'static/network/task_triangle.png'" mode="aspectFit">
							</image>
						</view>
					</view>
				</view>
			</view>
			<!-- 积分升级预留 -->
			<!-- <pointsUpgrade ref="pointsUpgrade" v-if="taskReward['RCREDITS_UPGRADE'].isShow"
				:taskReward="taskReward['RCREDITS_UPGRADE']"
				@updateSuccess="pointUpdateSuccess"></pointsUpgrade> -->
			<!-- 订单超时 -->
			<orderTimeout ref="orderTimeout"></orderTimeout>
			<!-- 看视频奖励 -->
			<videoReward v-if="taskReward['WATCH_VIDEO'].isShow" ref="videoReward"
				:taskReward="taskReward['WATCH_VIDEO']" @showAd="showAd"></videoReward>
			<!-- 牛金豆翻倍任务 -->
			<machine
				v-if="taskReward['CREDITS_DOUBLE'].isShow"
				ref="machine"
				@refresh="updateData"
				@deductBeans="deductBeans"
				:taskReward="taskReward['CREDITS_DOUBLE']"
				@showAwardModel="startAnim"
			>
			</machine>

			<!-- 领红包任务 -->
			<redPacket ref="redPacket"></redPacket>
			<!-- 插入插屏广告 -->
			<bannerAd unitId="adunit-9215c2ae472b0873"></bannerAd>
			<!-- 关注公众号 -->
			<focusWechatAccount v-if="taskReward['FOLLOW_EMS_CNPL'].isShow" ref="focusWechatAccount" :taskReward="taskReward['FOLLOW_EMS_CNPL']"></focusWechatAccount>
			<!-- 优惠券即将过期 -->
			<discountCoupon v-if="taskReward['COUPON_EXPIRE'].isShow"
				:taskReward="taskReward['COUPON_EXPIRE']" ref="discountCoupon"></discountCoupon>
			<!-- 答题闯关 -->
			<answerQuestion v-if="taskReward['QUIZ_ANSWER'].isShow" ref="answerQuestion"
			:taskReward="taskReward['QUIZ_ANSWER']"></answerQuestion>
			<!-- 换购券即将过期:已授权&有即将过期的换购券才显示 -->
			<exchangeCoupon v-if="taskReward['CARD_EXPIRE'].isShow"
				:taskReward="taskReward['CARD_EXPIRE']" ref="exchangeCoupon"></exchangeCoupon>
			<!-- 广告 -->
			<!-- <bannerAd></bannerAd> -->
			<!-- 转盘游戏 -->
			<turnTable v-if="taskReward['BIG_WHEEL'].isShow" ref="turnTable" @success="turntableSuccess"
				@deductBeans="deductBeans" @showAwardModel="startAnim"
				:taskReward="taskReward['BIG_WHEEL']"></turnTable>
			<!-- 看文拿奖 -->
			<viewArticle v-if="taskReward['READ_ARTICLE'].isShow" ref="viewArticle"
				:taskReward="taskReward['READ_ARTICLE']"></viewArticle>
			<!-- 星座特权 -->
			<starSign v-if="(!userInfo.gender||!userInfo.constellation)&&taskReward['HOROSCOPE'].isShow" ref="starSign"
				:userInfo='userInfo' :taskReward="taskReward['HOROSCOPE']" @showToast="showToast"
				@starSignSuccess="starSignSuccess"></starSign>
			<!-- 扫拉环任务 -->
			<pullRingQr v-if="taskReward['SCAN_PULL'].isShow" ref="pullRingQr"
				:taskReward="taskReward['SCAN_PULL']" @showAwardModel="startAnim"></pullRingQr>
			<!-- 点亮中国 -->
			<lightUp ref="lightUp" v-if="taskReward['MINI_PROGRAM'].isShow"></lightUp>
			<!-- 插入插屏广告 -->
			<bannerAd unitId="adunit-9e6abbb19accaec7"></bannerAd>
			<listImg ref="listImg" @imgItem="imgItemHandle"></listImg>
		</mescroll-body>
		<!-- toast提示 -->
		<van-toast id="van-toast" />
		<!-- 任务完成 -->
		<task-complete ref="taskComplete" @startAnim="showCowpeaAnim" />
		<!-- 动画 -->
		<cowpea-anim ref="cowpeaAnim" @animEnd="updateData" />
		<!-- 牛金豆翻倍 -->
		<cowpea-double ref="cowpeaDouble" @startAnim="showCowpeaAnim" @again="again" />
		<!-- 大转盘 -->
		<turntable-model ref="turntableModel" @startAnim="showCowpeaAnim" @again="again" />
		<!-- 开心收豆 -->
		<happy-harvest ref="happyHarvest" @startAnim="showCowpeaAnim" />
		<!-- 积分升级成功 -->
		<point-upgrade ref="pointUpgrade" @startAnim="showCowpeaAnim"></point-upgrade>
		<!-- 用户引导 -->
		<userGuidance ref="userGuidance"></userGuidance>
		<!-- 导航栏 -->
		<custom-tab-bar currentIndex="2"/>
		<!-- 配置的弹窗管理 -->
		<configurationDia
			ref="configurationDia"
			:isShow="isShowConfig"
			@close="closeShowConfig"
			:config="config"
			@popoverRember="requestPopoverRember"
			:remainTime="remainTime"
		></configurationDia>
        <!-- 优惠推荐商品的弹窗 -->
        <recommendDia ref="recommendDia"></recommendDia>
		<!-- 商品专题的半屏组件 -->
		<specialLisMiniPage
			ref="specialLisMiniPage"
			@notEnoughCredits="notEnoughCreditsHandle"
			@specialLisShare="specialLisShareHandle"
  			@isBannerClick="goodListBannerHandle"
		></specialLisMiniPage>
		<!-- 牛金豆不足的情况 -->
		<exchangeFailed
			:isShow="exchangeFailedShow"
			@goTask="goTaskHandle"
			@close="exchangeFailedShow = false"
		></exchangeFailed>
		<!-- 赚取牛金豆 -->
		<serviceCredits
			ref="serviceCredits"
			:isShow="serviceCreditsShow"
			@showAdPlay="showAdPlayHandle"
			@close="closeHandle"
		></serviceCredits>
	</view>
</template>
<script>
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
// import pointsUpgrade from './components/pointsUpgrade.vue';
import pCountup from '@/components/p-countUp/countUp.vue';
import answerQuestion from './components/answerQuestion.vue';
import bannerAd from './components/bannerAd.vue';
import discountCoupon from './components/discountCoupon.vue';
import exchangeCoupon from './components/exchangeCoupon.vue';
import focusWechatAccount from './components/focusWechatAccount.vue';
import lightUp from './components/lightUp.vue';
import listImg from './components/listImg.vue';
import machine from './components/machine.vue';
import orderTimeout from './components/orderTimeout.vue';
import pullRingQr from './components/pullRingQr.vue';
import redPacket from './components/redPacket.vue';
import starSign from './components/starSign.vue';
import turnTable from './components/turnTable.vue';
import videoReward from './components/videoReward.vue';
import viewArticle from './components/viewArticle.vue';
/*任务完成弹窗*/
import cowpeaDouble from '@/components/serviceCredits/popup/cowpeaDouble.vue';
import happyHarvest from '@/components/serviceCredits/popup/happyHarvest.vue';
import taskComplete from '@/components/taskComplete.vue';
import cowpeaAnim from './popup/cowpeaAnim.vue';
import turntableModel from './popup/turntableModel.vue';
/* 积分升级成功 */
import {
taskReward,
totalToady,
videoAward
} from '@/api/modules/task.js';
import configurationFun from '@/components/configurationDia/configurationFun.js';
import configurationDia from '@/components/configurationDia/index.vue';
import customTabBar from '@/components/customTabBar/index.vue';
import specialLisMiniPage from "@/components/specialLisMiniPage.vue";
import { getImgUrl } from '@/utils/auth.js';
import createRewardVideoAd from "@/utils/createRewardVideoAd.js";
import getViewPort from '@/utils/getViewPort.js';
import goDetailsFun from '@/utils/goDetailsFun.js';
import shareMixin from '@/utils/mixin/shareMixin.js'; // 混入分享的混合方法
import Toast from '@/wxcomponents/vant_update/toast/toast.js';

import exchangeFailed from "@/components/serviceCredits/exchangeFailed.vue";
import serviceCredits from "@/components/serviceCredits/index.vue";
import serviceCreditsFun from "@/components/serviceCredits/serviceCreditsFun.js";
import {
mapActions,
mapGetters
} from 'vuex';
import pointUpgrade from './popup/pointUpgrade.vue';
import userGuidance from './popup/userGuidance.vue';
	// 观看视频签名
	let _verify = null
	export default {
		mixins: [MescrollMixin, configurationFun, shareMixin, goDetailsFun, serviceCreditsFun],
		components: {
			// pointsUpgrade,
			pullRingQr,
			redPacket,
			videoReward,
			exchangeCoupon,
			focusWechatAccount,
			discountCoupon,
			bannerAd,
			orderTimeout,
			answerQuestion,
			viewArticle,
			starSign,
			turnTable,
			lightUp,
			machine,
			pCountup,
			taskComplete,
			cowpeaAnim,
			cowpeaDouble,
			turntableModel,
			happyHarvest,
			pointUpgrade,
			userGuidance,
			customTabBar,
			configurationDia,
			listImg,
			specialLisMiniPage,
			exchangeFailed,
			serviceCredits
		},
		computed: {
			...mapGetters(['userInfo', 'isAutoLogin'])
		},
		watch: {
			userInfo(newValue, oldValue) {
				if((newValue.id !== null && newValue.id != oldValue.id)) {
					this.downCallback();
				}
			},
		},
		data() {
			return {
				downOption: {
					auto: false, // 不自动加载 (mixin已处理第一个tab触发downCallback)
					bgColor: "#ffffff",
				},
				navTitle: "福利中心",
				showPoints: true, //积分升级
				gbHeight: uni.upx2px(220), //牛金豆高度
				showMyBean: false,
				showWhiteBg: false,
				totalToady: 0, //今日收益
				taskReward: {
					SCAN_PULL: {
						isShow: false
					},
					CARD_EXPIRE: {
						isShow: false
					},
					DAILY_SIGN: {
						isShow: false
					},
					FOLLOW_EMS_CNPL: {
						isShow: false
					},
					QUIZ_ANSWER: {
						isShow: false
					},
					READ_ARTICLE: {
						isShow: false
					},
					RCREDITS_UPGRADE: {
						isShow: false
					},
					HOROSCOPE: {
						isShow: false
					},
					BIG_WHEEL: {
						isShow: false
					},
					CREDITS_DOUBLE: {
						isShow: false
					},
					WATCH_VIDEO: {
						isShow: false
					},
					COUPON_EXPIRE: {
						isShow: false
					},
					PAYMENT_REMINDER: {
						isShow: false
					},
					MINI_PROGRAM: {
						isShow: false
					},
				},
				imgUrl: getImgUrl(),
				stickyTop: 0,
				_RewardedVideoAd: null, // 激励视频
				adunit: 'adunit-bc00b5948e4bbd52',
			}
		},
		onLoad(options) {
			// // 彬纷享礼跳转传参：积分，头像，昵称
			// var {
			// 	data,
			// 	type
			// } = options;
			// this.handleOptions(type, data)
			this.stickyTop = getViewPort().navHeight;
			/*初始化激励视频*/
			this.initRewardedVideoAd()
		},
		onShow() {
			/* 看文拿奖返回处理 */
			if (uni.getStorageSync('READ_ARTICLE')) {
				let reward = uni.getStorageSync('READ_ARTICLE')
				//立即清除
				uni.removeStorageSync('READ_ARTICLE')
				//启用动画
				this.$refs.happyHarvest.show({
					title: '恭喜您',
					reward: reward
				})
				// 延时处理
				wx.nextTick(() => {
					this.initOptions(false);
				});
			} else {
				this.initOptions();
			}
		},
		onUnload() {
        	this._RewardedVideoAd.videoAdDestroy();
    	},
		methods: {
			...mapActions({
				getUserTotal: 'user/getUserTotal',
			}),
			// 分享的文案获取
			specialLisShareHandle({ share_word, share_img }) {
				this.currentSharePageObj.btnShareObj = {
					share_title: share_word,
					share_img
				}
			},
			imgItemHandle(item) {
				this.textDetailsFun_mixins({
					...item,
					configDia: true
				});
			},
			// 列表广告位 - 跳转至半屏推券
			goodListBannerHandle(item) {
				this.$refs.recommendDia.initGtData({
					...item,
					interval_time: item.type_sid
				});
			},
			// 牛金豆不足，打开弹窗
			notEnoughCreditsHandle() {
				this.exchangeFailedShow = true;
			},
			initOptions(isUpdate = true) {
				isUpdate && this.updateData();
				//任务奖励消耗
				taskReward().then(res => {
					let o = {}
					res.data.forEach(item => {
						o[item.tag] = {
							cost: item.cost,
							credits: item.credits,
							isShow: Boolean(item.status),
							title: item.title,
							subtitle: item.subtitle,
							article_url: item.article_url || '',
							image: item.image || ''
						}
					})
					this.taskReward = o
					// 更新拉环组件数据
					this.initCommon()

				})
			},
			toSearchHandle() {
				if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
				this.$go(`/pages/userModule/productList/search`);
			},
			startAnim(key, data) {
				switch (key) {
					/*拉环奖励弹窗*/
					case 'SCAN_PULL':
						this.$refs.taskComplete.show(data)
						break;
					case 'CREDITS_DOUBLE':
						this.$refs.cowpeaDouble.popupShow(data)
						break;
					case 'BIG_WHEEL':
						this.$refs.turntableModel.popupShow(data)
						break;
				}
			},
			starSignSuccess() {
				//启用动画
				this.$refs.happyHarvest.show({
					title: '恭喜您',
					reward: this.taskReward['HOROSCOPE'].credits
				})
				// this.updateData()
			},
			again(key) {
				switch (key) {
					case 'CREDITS_DOUBLE':
						this.$refs.machine.game()
						break;
					case 'BIG_WHEEL':
						this.$refs.turnTable.start()
						break;
				}
			},
			showCowpeaAnim() {
				let attrId = this.showMyBean ? '#taskTitle' : '#todayBean'
				let query = uni.createSelectorQuery().in(this)
				query.select(attrId).boundingClientRect()
				query.exec((res) => {
					let {
						left,
						top,
						width,
						height
					} = res[0]
					this.$refs.cowpeaAnim.show({
						left: left + width / 2,
						top: top + height / 2
					})
				});
			},
			initCommon() {
				wx.nextTick(() => {
					Object.keys(this.$refs).forEach((key) => {
						if (this.$refs[key].init) {
							this.$refs[key].init()
						}
					})
					if (this.$refs.userGuidance) this.$refs.userGuidance.popupInit()
				})
			},
			downCallback(event) {
				this.initOptions()
				//延时
				setTimeout(() => {
					this.mescroll.endSuccess();
				}, 200)
			},
			turntableSuccess(event) {
				this.updateData();
			},
			showHide() {
				this.showPoints = !this.showPoints
			},
			onPageScroll(e) {
				this.showWhiteBg = Math.ceil(e.scrollTop) > 10 ? true : false;
				this.showMyBean = Math.ceil(e.scrollTop) >= this.gbHeight;
			},
			showToast({
				msg,
				position = 'center'
			}) {
				return Toast({
					message: msg,
					position
				})
			},
			countFinished(e) {
			},
			// 玩游戏扣除豆子
			deductBeans(num) {
				this.userInfo.credits -= num;
			},
			updateData() {
				this.getUserTotal();
				totalToady().then(res => {
					let {
						code,
						data
					} = res;
					if (code == 1) {
						this.totalToady = data;
					}
				})
			},
			goPages(path, isCean) {
                if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
                this.$go(path);
			},
			pointUpdateSuccess() {
				this.$refs.pointUpgrade.show()
			},
			//播放视频拿奖励
			initRewardedVideoAd() {
				this._RewardedVideoAd = createRewardVideoAd(
                	this.adunit,
					(status) => {
						videoAward({
							type: 2,
							verify: _verify
						}).then(res => {
							if (res.data > 0) {
								//启用动画
								this.$refs.happyHarvest.show({
									title: '恭喜您',
									reward: res.data
								})
							}
						})
					}
				);
				this._RewardedVideoAd.videoAdCreate();
			},
			showAd() {
				_verify = null
				videoAward({
					type: 1
				}).then(res => {
					_verify = res.data;
					this._RewardedVideoAd.videoPlay(); // 视频的播放
				})
			},
			goMyCowpeaHandle(){
                if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
				this.$wxReportEvent('goldenbeans');
				this.goPages('/pages/userModule/myCowpea/index');
			},
			// handleOptions(type, data) {
			// 	log.addFilterMsg('taskIndex')
			// 	log.info("type,data:", type, data)
			// 	// 彬纷享礼跳转
			// 	if (type && type == "bfxl") {
			// 		setStorage('bfxl_userdata', decodeURIComponent(data))
			// 		wx.nextTick(() => {
			// 			if (this.$refs.pointsUpgrade) this.$refs.pointsUpgrade.showPop();
			// 		})
			// 	}
			// }
		},
	}
</script>

<style lang="scss">
	@import 'style/conmon.css';
	page {
		background-color: #f7f7f7;
	}
	.sticky-tabs-head {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 100;
	}
	.sth-bg {
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
		width: 100%;
		height: 100%;
		.rgbaBg_color {
			width: 100%;
			height: 100%;
			background: linear-gradient(270deg, rgba(51, 118, 255, 0.22) 7%, rgba(249, 127, 2, 0.08) 33%, rgba(255, 211, 213, 0.50) 93%);
			filter: blur(40px);
		}
		&.whiteBg {
			background: #fff;
		}
	}
	.nav-custom{
		flex: 1;
		.title_icon{
			width: 162rpx;
			height: 42rpx;
		}
	}
	.search_icon {
		flex: 0 0 64rpx;
		box-sizing: border-box;
		width: 64rpx;
		height: 64rpx;
	}

	.border-line {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 10rpx;
		background: linear-gradient(270deg, rgba(239, 43, 32, 0.00), #ef2b20);
		border-radius: 6rpx;
	}

	.fade-in {
		opacity: 1;
	}

	.fade-out {
		opacity: 0;
	}

	.my-beans {
		display: flex;
		align-items: center;
		position: absolute;
		left: 24rpx;
		top: 50%;
		transform: translateY(-50%);
		transition: opacity .5s;
		min-width: 200rpx;
		// height: 58rpx;
		height: 64rpx;
		box-sizing: border-box;
		// padding-left: 20rpx;
		// padding-right: 20rpx;
		margin-bottom: 8rpx;
		// font-size: 30rpx;
		// font-weight: 500;
		font-weight: 600;
		color: #fe9b22;
		font-size: 36rpx;
		padding-left: 20rpx;
		padding-right: 32rpx;
		background: rgba(255,255,255,0.50);
		border: 2rpx solid  rgba(255,255,255,0.35);
		border-radius: 34rpx;
		&::after {
			content: '';
			position: absolute;
			width: 100%;
			height: 8rpx;
			background: linear-gradient(180deg, #f9efe6, #f1dbc8);
			// background: linear-gradient(180deg,#f9e8d8, #ea8b2e);
			border-radius: 50%;
			filter: blur(2rpx);
			// filter: blur(4rpx);
			bottom: -8rpx;
			left: 50%;
			transform: translateX(-50%);
		}
	}
	


	// .my-beans-icon {
	// 	width: 40rpx;
	// 	height: 32rpx;
	// }
	.my-beans-icon {
		width: 66rpx;
		height: 62rpx;
		margin-top: 5rpx;
	}

	.my-beans-label {
		margin-left: 4rpx;
		line-height: 1;
	}

	.golden-beans {
		position: relative;
		height: 390rpx;
		padding: 90rpx 60rpx 0 80rpx;
		box-sizing: border-box;
		background-color: #f8f7f7;
		margin-top: 20rpx;

		.bg {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			z-index: 0;
			width: 100%;
			height: 390rpx;
		}


		.bean-box {
			position: relative;
			display: flex;
			align-items: flex-end;
			justify-content: space-between;
		}

		.today-bean {
			font-size: 24rpx;
			color: #999999;
			display: flex;
			align-items: center;
		}

		.total-bean-box {
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		.bean-title {
			font-size: 26rpx;
			color: #9fa8b0;
			position: relative;
			display: flex;
			align-items: flex-end;
			justify-content: flex-start;
			box-sizing: border-box;
			width: 160rpx;
			height: 50rpx;
		}

		.icon_beans {
			width: 30rpx;
			height: 27rpx;
			margin-right: 10rpx;
			transform: rotateY(180deg);
		}

		.total-bean {
			font-size: 72rpx;
			font-weight: 500;
			color: #666666;
			text-align: left;
			min-width: 290rpx;
			height: 80rpx;
			line-height: 80rpx;
			box-sizing: border-box;
			flex-shrink: 0;
			display: flex;
			align-items: flex-end;
			justify-content: flex-start;
		}

		.icon-colon-tr {
			width: 40rpx;
			height: 24rpx;
			position: absolute;
			top: 0;
			right: 0;
		}

		.icon-colon-bl {
			width: 40rpx;
			height: 24rpx;
			padding-right: 20rpx;
			// padding-bottom: 14rpx;
		}

		.task-triangle {
			width: 20rpx;
			height: 26rpx;
			margin: 0 0 6rpx 10rpx;
		}
	}
</style>
