<template>
	<view>
		<van-popup :show="show" round position="bottom" custom-style="background-color: #fff9f2;"
			:close-on-click-overlay="true" @close="onClose">

			<!-- head -->
			<view class="lighting-mode-head">
				点亮方式
				<image class="lighting-mode-head-icon" src="/static/images/light_mode.png" mode="aspectFill"></image>
			</view>
			<!-- 点亮方式列表 -->
			<view class="lighting-mode-list">
				<view v-for="(item,index) in lightModeList" :key="index" class="lighting-mode-list-item"
					:class="{'light-disabled':item.disabled}">
					<view class="light-mode-name">
						{{item.name}}
					</view>
					<view class="light-mode-num" v-if="item.tag === 'HELP'">
						好友助力即可点亮城市
					</view>
					<view class="light-mode-num" v-else>
						{{item.surplus_num > 0  ? `每日${item.num}次，剩${item.surplus_num}次` : '今日次数已用完'}}
					</view>
					<view class="go-light-btn" @click="lightHandle(item)">
						去点亮
					</view>
				</view>
			</view>
		</van-popup>
		<!-- 扫码引导 -->
		<scan-tutor ref="scanTutor" @scanCodeType="scanCodeType" @resetScanState="resetScanState" />
		<!-- 助力列表 -->
		<help-list-pop ref="helpListPop" @clearHelpMarker="$emit('clearHelpMarker')" />
		<!-- 立即助力 -->
		<immediate-help ref="immediateHelp" @cancelHelp="cancelHelp" @helpSuccess="helpSuccess"
			@loginToast="loginToast" />
		<!-- 助力关闭 抢救一下 -->
		<discard-help ref="discardHelp" @helpSuccess="helpSuccess" />
		<!-- 助力成功提示 -->
		<power-success ref="powerSuccess" @goScan="scanCheck" />
		<!--扫码点亮城市-->
		<light-city ref="lightCity" @scan="direcTscan" @scanEndDialogShow="scanEndDialogShow"
			@closeRefresh="closeRefreshAcce" @close="closeHandle" @shareDataObj="getShareData" />
		<!--即將點亮-->
		<soon-light-city ref="soonLightCity" @scan="direcTscan" />
		<!--重复扫码-->
		<scanned ref="scanned" @scan="direcTscan" />
		<!--扫码錯誤提示-->
		<scan-error ref="scanError" @scan="direcTscan" />
		<!-- 游戏引导 -->
		<game-tutor ref="gameTutor" />
		<!-- 邀请助力 -->
		<invited-help ref="invitedHelp" />
		<!-- 游戲結束 -->
		<game-over ref="gameOver" />
		<!-- 扫吗次数完 -->
		<scan-end-dialog ref="scanEndDialog" @close="popupShow" />
		<!-- 换其他的点亮方式 -->
		<period-popup ref='periodPopup' @goLightUp="show = true" />
	</view>
</template>
<script>
	import {
		getLitWay,
		finish,
		getScanWxMsgId,
		callWxMsgAuth
	} from '@/api/modules/home.js';
	import {
		getH5UserInfo
	} from '@/utils/auth.js';
	import {
		RewardedVideoAd,
		parseTime
	} from '@/utils/index.js'
	import {
		getUserLocation
	} from '@/utils/getUserLocation.js'
	import {
		mapGetters,
		mapActions
	} from 'vuex';
	import gameTutor from '@/components/lightingMode/gameTutor';
	import invitedHelp from '@/components/lightingMode/invitedHelp';
	import immediateHelp from '@/components/lightingMode/immediateHelp';
	import helpListPop from '@/components/lightingMode/helpListPop';
	import discardHelp from '@/components/lightingMode/discardHelp'
	import powerSuccess from '@/components/lightingMode/powerSuccess'
	import scanTutor from '@/components/lightingMode/scanTutor';
	import lightCity from '@/components/scanBusiness/lightCity';
	import soonLightCity from '@/components/scanBusiness/soonLightCity';
	import scanned from '@/components/scanBusiness/scanned';
	import scanError from '@/components/scanBusiness/scanError';
	import gameOver from '@/components/lightingMode/gameOver';
	import scanEndDialog from '@/components/scanBusiness/scanEndDialog.vue';
	import periodPopup from '@/components/periodPopup.vue';
	// 激励视频实例
	let _RewardedVideoAd = null;
	// 定位参数
	let _loaction = null;
	export default {
		components: {
			gameTutor,
			invitedHelp,
			helpListPop,
			discardHelp,
			powerSuccess,
			scanTutor,
			lightCity,
			soonLightCity,
			scanned,
			scanError,
			gameOver,
			scanEndDialog,
			immediateHelp,
			periodPopup
		},
		computed: {
			...mapGetters(['isAuthorization', 'userInfo', 'lightModeList', 'lightModePower', 'nextCity'])
		},
		data() {
			return {
				show: false,
				// isLoading: false,
				watchNum: 0, // 点亮的次数
				scenario_value: 0, // 埋点的场景值

			}
		},
		created() {
			// _RewardedVideoAd = null;
			/*初始化激励视频*/
			// this.initRewardedVideoAd();

		},
		mounted() {
			// this.init();
			// /*初始化激励视频*/
			// this.initRewardedVideoAd();
			// this.$refs.lightCity.showTime({});
		},
		methods: {
			...mapActions({
				getUserInfo: 'user/getUserInfo',
				updateUserNew: 'user/updateUserNew',
				updateLightModeList: 'business/updateLightModeList',
				getHelpInviteData: 'business/getHelpInviteData',
				getNextCity: 'business/getNextCity'
			}),
			popupShow(scenario_value) {
				this.scenario_value = scenario_value;
				this.show = true;
				this.init(); // 初始化
			},
			// getShareCityData() {
			// 	this.$refs.lightCity.shareData();
			// },
			getShareData(shareDataObject) {
				console.log('shareDataObject----light', shareDataObject);
				this.$emit('cityShareObject', shareDataObject);
			},
			init() {
				// this.$refs.lightCity.showTime({
				// 	image: 'https://file.y1b.cn/api3/litchina/city/guangdong/zhaoqing.png',
				// 	city: '广东--mock',
				// 	province: '',
				// 	isH5: false,
				// 	donated_love: 1
				// });
				// this.$refs.scanTutor.popupShow({city: '广东'}, this.isAuthorization);
				_loaction = null
				//更新扫码模式列表
				this.updateLightModeList().then(() => {});
				this.getNextCity().then(() => {});
			},
			lightHandle(item) {
				//次数用完了
				if (item.disabled) return;
				//未授权用户信息
				if (!this.isAuthorization) {
					//前往授权
					this.loginToast()
					return
				}

				//没有下一个需要点亮的城市，代表游戏结束
				if (!this.nextCity) {
					this.showGameOver();
					return;
				}
				switch (item.tag) {
					case 'SCAN':
						// 码上点亮
						this.scanCheck(item.reportLoa);
						// this.$refs.lightCity.showTime({
						// 	image: 'https://file.y1b.cn/api3/litchina/city/guangdong/zhaoqing.png',
						// 	city: '广东--mock',
						// 	province: '',
						// 	isH5: false,
						// 	donated_love: 1
						// });
						break;
					case 'WATCH':
						// 加速点亮
						this.accelerateLightUp();
						break;
					case 'QUIZ':
						// 闯关点亮
						this.goGame();
						break;
					case 'HELP':
						// 好友助力
						this.goHelp();
						break;
					default:
						break;
				}
			},
			//扫码点亮前验证
			scanCheck(reportLoa) {
				wx.reportEvent("click_omslight", {
					authorized_or_not: Number(this.isAuthorization),
					scenario_value: this.scenario_value
				});
				//没有下一个需要点亮的城市，代表游戏结束
				if (!this.nextCity) {
					this.showGameOver();
					return;
				}

				/*上次订阅发起时的时间*/
				let scanWxMsgDate = uni.getStorageSync('scanWxMsgDate')
				/*scanWxMsgDate为空或者记录的时间与当前时间(日期)不一样，则重新发起*/
				if ((reportLoa === 'home') && (!scanWxMsgDate || parseTime(scanWxMsgDate, '{y}-{m}-{d}') !== parseTime(Date.now(), '{y}-{m}-{d}'))) {
					getScanWxMsgId().then(res => {
						if (res.data) {
							uni.requestSubscribeMessage({
								tmplIds: [res.data],
								complete: (e) => {
									//扫一扫点亮
									this.scan(reportLoa)
								},
								success(e) {
									/*回调*/
									callWxMsgAuth({
										template: 'qdtx'
									}).then(res => {})
								}
							})
							/*记录发起时间*/
							uni.setStorageSync('scanWxMsgDate', Date.now())
							return
						}
						//扫一扫点亮
						this.scan()
					})
					return
				}
				//扫一扫点亮
				this.scan(reportLoa);
			},
			//扫码点亮
			scan(reportLoa) {
				//扫码次数已用完,弹出对应弹窗
				if (!this.lightModePower['SCAN']) {
					this.scanEndDialogShow();
					return;
				}
				this.$emit('setScanTutor', true);
				if(reportLoa === 'home') {
					this.$refs.scanTutor.popupShow(this.nextCity, this.isAuthorization);
					return;
				};
				// 直接调用扫一扫
				this.$refs.scanTutor.wxScan(this.scenario_value);
			},
			scanSuccResult(codeId) {
				this.$refs.scanTutor.wxScanSuccess(codeId);
			},
			scanFailResult() {
				this.$refs.scanTutor.wxScanFail(this.scenario_value);
			},
			//直接扫一扫
			direcTscan() {
				//扫码次数已用完,弹出对应弹窗
				if (!this.lightModePower['SCAN']) {
					this.scanEndDialogShow();
					return;
				}

				this.getNextCity().then(() => {
					// 没有下一个需要点亮的城市，代表游戏结束
					if (!this.nextCity) {
						this.showGameOver();
					} else {
						//扫一扫点亮
						this.$emit('setScanTutor', true);
						this.$refs.scanTutor.wxScan();
					}
				})
			},
			//h5跳转点亮
			h5QrCode(data) {
				//扫码次数已用完,弹出对应弹窗
				if (!this.lightModePower['SCAN']) {
					this.scanEndDialogShow()
					return;
				}
				this.getNextCity().then(() => {
					// 没有下一个城市
					if (!this.nextCity) {
						return this.showGameOver();
					}
					this.$refs.scanTutor.h5QrCode(data);
				});
			},
			//重置扫码状态
			resetScanState() {
				this.$emit('setScanTutor', false);
				/*防止主动调用loginToast*/
				if (this.isAuthorization) {
					this.init()
					this.getUserInfo()
					// this.getNextCity()
					//提示刷新
					this.$emit('refresh')
				}
			},
			//扫码结果处理
			scanCodeType(data) {
				switch (data.type) {
					//點亮了城市
					case 1:
						console.log('点亮了城市', data);
						this.$refs.lightCity.showTime(data);
						break
					case 2:
						this.$refs.soonLightCity.popupShow(data, this.isAuthorization);
						break
					case 3:
						this.$refs.scanned.popupShow(this.isAuthorization);
						break
					case 4:
						this.scanEndDialogShow();
						break;
					case 5:
						this.$refs.scanError.popupShow(data.msg, this.isAuthorization);
						break
				}
			},
			lightCityClose() {
				this.$refs.lightCity.popupClose();
			},
			// 扫码次数已经用完
			scanEndDialogShow() {
				this.$refs.scanEndDialog.popupShow();
			},
			// 加速点亮
			accelerateLightUp() {
				//正在处理
				wx.reportEvent("click_oexlight", {
					authorized_or_not: 1,
					scenario_value: this.scenario_value
				});
				//防止多次点击
				// if (this.isLoading) return;
				// this.isLoading = true;
				/*第一次*/
				if (this.userInfo.city_num == 0) {
					getUserLocation().then(res => {
						let {
							longitude,
							latitude
						} = res.data;
						_loaction = {
							longitude,
							latitude
						}
						// _RewardedVideoAd.show();
						this.$emit('videoAdShow', _loaction);
					})
					// .catch(res => {
					// 	this.isLoading = false
					// })
					return
				};
				// _RewardedVideoAd.show();
				this.$emit('videoAdShow');
			},
			// 游戏点亮
			goGame() {
				/*点击【闯关点亮】 */
				wx.reportEvent("click_opglight", {
					authorized_or_not: Number(this.isAuthorization),
					scenario_value: this.scenario_value
				});
				//未授权用户信息
				if (!this.isAuthorization) {
					//前往授权
					this.loginToast();
					return;
				};
				//扫一扫点亮
				this.$refs.gameTutor.popupShow(this.isAuthorization, this.scenario_value)
			},
			// 好友助力
			goHelp() {
				/*点击【好友助力】 */
				wx.reportEvent("click_ofalight", {
					authorized_or_not: Number(this.isAuthorization),
					scenario_value: this.scenario_value
				});

				//未授权用户信息
				if (!this.isAuthorization) {
					//前往授权
					this.loginToast()
					return
				}
				/*助力时需要*/
				this.getHelpInviteData().then(() => {
					this.$refs.invitedHelp.popupShow(this.scenario_value);
				});
			},
			//初始化助力相关数据
			initHelp() {
				//助理記錄
				this.$refs.helpListPop.init()
				/*助力时需要*/
				this.getHelpInviteData().then(() => {})
			},
			immediateHelp(data) {
				this.$refs.immediateHelp.popupShow(data)
			},
			cancelHelp() {
				//显示是否放弃助力，抢救下
				this.$refs.discardHelp.popupShow(_parmas)
			},
			helpSuccess(data) {
				this.$refs.powerSuccess.popupShow(data)
			},
			//游戏结束
			showGameOver() {
				this.$refs.gameOver.popupShow();
			},
			//授权登录确认
			loginToast() {
				this.$emit('loginToast')
			},
			showPeriodPopup() {
				this.$refs.periodPopup.popupShow();
			},
			showLightCity(data) {
				this.$refs.lightCity.popupShow(data);
			},
			closeRefreshAcce() {
				// //更新用户信息
				// this.getUserInfo();
				// //刷新当前
				// this.init();
				// //下一个城市
				// this.getNextCity()

				//提示刷新
				this.$emit('refresh');
				if (!this.lightModePower['WATCH']) {
					this.showPeriodPopup();
					return;
				}
				this.accelerateLightUp();
			},
			closeHandle() {
				this.$emit('refreshClose');
			},
			/*揭秘*/
			// initRewardedVideoAd() {
			// 	if (_RewardedVideoAd) return;
			// 	_RewardedVideoAd = RewardedVideoAd(this.common.adunitId.accelerateLightUp, (res) => {
			// 		if (res) {
			// 			let params = {}
			// 			if (_loaction) {
			// 				params = _loaction
			// 			}
			// 			finish(params).then(res => {
			// 				// 更新用户信息
			// 				this.getUserInfo();
			// 				// 刷新当前
			// 				this.init();
			// 				// this.isLoading = false;
			// 				if (res.data) {
			// 					let {
			// 						city,
			// 						image
			// 					} = res.data;
			// 					if (city && image) {
			// 						return this.$refs.lightCity.popupShow(res.data);
			// 					}
			// 					this.showGameOver();
			// 					return;
			// 				}
			// 				// 换种方式点亮的提示
			// 				this.showPeriodPopup();
			// 			});
			// 		}
			// 	});
			// 	_RewardedVideoAd.init({
			// 		errMsg: '视频跑丢了，换种方式继续点亮吧'
			// 	});
			// },
			onClose() {
				this.show = false;
			}
		}
	}
</script>

<style lang="scss">
	.lighting-mode-head {
		font-size: 32rpx;
		font-family: PingFang SC, PingFang SC-Medium;
		font-weight: 500;
		color: #ff7f48;
		padding: 48rpx 0;
		text-align: center;
		position: relative;
	}

	.lighting-mode-head-icon {
		width: 186rpx;
		height: 34rpx;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: 42rpx;
		z-index: -1;
	}

	.lighting-mode-list {
		padding: 0 30rpx 48rpx;
	}



	.lighting-mode-list-item {
		height: 136rpx;
		background-color: rgba(255, 255, 255, 0.50);
		border: 2rpx solid rgba(255, 194, 145, 0.50);
		border-radius: 12px;
		box-sizing: border-box;
		padding: 24rpx 32rpx;
		position: relative;

		.light-mode-name {
			font-size: 28rpx;
			font-weight: 700;
			color: #4e4d52;
			margin-bottom: 8rpx;
		}

		.light-mode-num {
			font-size: 28rpx;
			font-weight: 500;
			color: #aaaaaa;
		}

		.go-light-btn {
			width: 132rpx;
			height: 56rpx;
			background-color: #ffe0b9;
			border: 2rpx solid #ffb676;
			border-radius: 15px;
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			right: 34rpx;
			font-size: 28rpx;
			font-weight: 700;
			text-align: center;
			color: #99673d;
			line-height: 54rpx;
			box-sizing: border-box;

			.go-light-native {
				background-color: transparent;
				padding: 0;
				position: absolute;
				width: 100%;
				height: 100%;
				left: 0;
				top: 0;
			}

			.go-light-native:after {
				border: none;
			}
		}

	}

	.lighting-mode-list-item+.lighting-mode-list-item {
		margin-top: 24rpx;
	}

	.light-disabled {
		background-color: #F7F4F1;
		border-color: #E1E1E1;

		.light-mode-name {
			color: #999999;
		}

		.light-mode-num {
			color: #CCCCCC;
		}

		.go-light-btn {
			color: #AAAAAA;
			background-color: #EBEBEB;
			border: none;
		}
	}
</style>
