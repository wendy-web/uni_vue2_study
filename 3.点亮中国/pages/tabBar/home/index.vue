<template>
	<view>
		<!-- :style="{paddingTop:navbarData.height+'px'}" -->
		<!-- <scroll-view class="home"  :scroll-y="true" @scroll="scroll"> @down="downCallback"-->
		<view class="home">
			<mescroll-uni
				class="home"
				ref="mescrollRef"
				:fixed="false"
				@init="mescrollInit"
				:down="{use:false}"
				:up="{
					use: false
				}"
			>
				<!-- 导航 -->
				<view :style="{paddingTop:navbarData.height+'px'}"></view>
				<!-- :class="showMask?'custom-scroll':'custom-top'" -->
				<view class="custom-nav" :style="{height:navbarData.height+'px',paddingTop:navbarData.paddingTop+'px'}">
					点亮全中国，一起攒能量
				</view>
				<!-- 占据空间 -->
				<!-- <view v-if="showMask" class="space-occupa" :style="{paddingTop:navbarData.height+'px'}"></view> -->
				<!-- 空间占据者 -->
				<view class="space-occupier">
					<!-- 地图 -->
					<user-map ref="userMap" v-show="[0,1].includes(tabIndex)" @loginToast="loginToast" />
				</view>
				<!-- 个人 勋章与城市  -->
				<user
					v-show="tabIndex == 0"
					ref="userModalCity"
					:TYPE="0"
					@scan="scan"
					@showModal="showModal"
					@loginToast="loginToast"
					@goLightUp="goLightUp"
					@touchstart="touchstartHandle"
					@touchend="touchendHandle"
				/>
				<!-- 捐爱心 -->
				<loveModular ref="loveModular" @loginToast="loginToast" />
				<!-- 引導頁 -->
				<guide-model ref="guideModel" />
			</mescroll-uni>
		</view>
		<!-- 底部菜单 -->
		<view class="bottom-menu-box">
			<view class="bottom-menu">
				<view class="bottom-menu-btn" @click="goMine">我的</view>
				<view class="bottom-menu-btn" @click="moreLightUpClick">更多点亮</view>
			</view>
			<image class="bottom-menu-scan tada" src="../../../static/home/smdl.png" mode="aspectFill" @click="scan">
			</image>
		</view>
		<!-- 扫码引导 -->
		<!-- <scan-tutor ref="scanTutor" @scanCodeType="scanCodeType" @resetScanState="resetScanState" /> -->
		<!-- 助力列表 -->
		<!-- <help-list-pop ref="helpListPop" @clearHelpMarker="clearHelpMarker" /> -->
		<!-- 立即助力 -->
		<!-- 	<immediate-help ref="immediateHelp" @cancelHelp="cancelHelp" @helpSuccess="helpSuccess" @loginToast="loginToast"
			@showGuide="showGuide" /> -->
		<!-- 助力关闭 抢救一下 -->
		<!-- <discard-help ref="discardHelp" @showGuide="showGuide" @helpSuccess="helpSuccess" /> -->
		<!-- 助力成功提示 -->
		<!-- <power-success ref="powerSuccess" @goScan="scan" @showGuide="showGuide" /> -->
		<!-- 勋章弹窗 -->
		<medal-popup ref="medalPopup" @share="medalShare" />
		<medal-share-show ref="medalShareShow"/>
		<!--扫码点亮城市-->
		<!-- <light-city ref="lightCity" @scan="direcTscan" /> -->
		<!--即將點亮-->
		<!-- <soon-light-city ref="soonLightCity" @scan="direcTscan" /> -->
		<!--重复扫码-->
		<!-- <scanned ref="scanned" @scan="direcTscan" /> -->
		<!--扫码錯誤提示-->
		<!-- <scan-error ref="scanError" @scan="direcTscan" /> -->
		<!-- 游戲結束 -->
		<!-- <game-over ref="gameOver" /> -->
		<period-popup ref='periodPopup' @goLightUp="goLightUp" />
		<!-- 点亮方式组件 -->
		<lighting-mode
			ref="lightingMode"
			@setScanTutor="setScanTutor"
			@clearHelpMarker="clearHelpMarker"
			@loginToast="loginToast"
			@videoAdShow="videoAdShowFinish"
			@cityShareObject ="cityShareObjectHandle"
		/>
		<!-- 荣誉证书 -->
		<honor-card ref="honorCard" @continueLight="goLightUp"/>
		<home-guideDia ref="homeGuideDia"></home-guideDia>
		<city-share-card ref="cityShareCard" />
		<!-- 隐私协议的组件 -->
		<!-- <privacy ref="privacy"></privacy> -->
	</view>
</template>

<script>
	import userMap from './components/userMap.vue'
	import user from './content/user.vue'
	import loveModular from './content/loveModular.vue'
	// import scanTutor from './business/scanTutor.vue'
	// import helpListPop from './business/helpListPop.vue'
	// import immediateHelp from './business/immediateHelp.vue'
	// import discardHelp from './business/discardHelp.vue'
	// import powerSuccess from './business/powerSuccess.vue'
	import medalPopup from '@/components/popupWindow/medalPopup.vue';
	import medalShareShow from '@/components/popupWindow/medalShareShow.vue';
	// import lightCity from './scanBusiness/lightCity.vue'
	// import soonLightCity from './scanBusiness/soonLightCity.vue'
	// import scanned from './scanBusiness/scanned.vue'
	// import scanError from './scanBusiness/scanError.vue'
	import guideModel from './business/guideModel.vue'
	import periodPopup from '@/components/periodPopup.vue'
	import honorCard from '@/components/honorCard/honorCard.vue';
	import homeGuideDia from '@/components/homeGuideDia.vue';
	import cityShareCard from '@/components/popupWindow/cityShareCard/index.vue'

	import {
		mapGetters,
		mapActions,
		mapMutations
	} from 'vuex'
	import {
		getShareUrl
	} from '@/api/modules/help.js'
	import {
		finish,
		geRealtUserMedal,
		getRealTeamMedal,
		getScanWxMsgId
	} from '@/api/modules/home.js'
	import {
		getAppLaunchNum,
		setUserGuide,
		getUserGuide,
		setH5UserInfo,
		getH5UserInfo,
	} from '@/utils/auth.js'
	import {
		getNavbarData
	} from '@/components/xhNavbar/xhNavbar.js'
	import {
		getUserLocation
	} from '@/utils/getUserLocation.js'
	import {
		setStorage
	} from '@/utils/auth.js'
	import {
		parseTime
	} from '@/utils/index.js'
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	import {
		RewardedVideoAd
	} from '@/utils/index.js';
	//页面参数
	let _PAGEPARMAS;
	//是否在当前页
	let _isCurrPage = true;
	//是否在处理扫码弹窗
	let isScanTutor = false;
	// 在页面中定义插屏广告
	let interstitialAd = null;
	export default {
		mixins: [MescrollMixin],
		components: {
			userMap,
			user,
			loveModular,
			// scanTutor,
			// helpListPop,
			// immediateHelp,
			// discardHelp,
			// powerSuccess,
			medalPopup,
			// lightCity,
			// soonLightCity,
			// scanned,
			// scanError,
			guideModel,
			periodPopup,
			// gameOver,
			honorCard,
			homeGuideDia,
			cityShareCard,
			medalShareShow
		},
		data() {
			return {
				// downOption: {
				// 	auto: false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				// },
				tabIndex: 0,
				navbarData: {
					height: 88,
					paddingTop: 28
				},
				showMask: false,
				adunitId: this.common.adunitId.home,
				_loaction:'',
				scanCodeVal : null,
				videoAdObject: null, // 视频对象
				shareCityObject: '', //城市分享
			}
		},
		computed: {
			...mapGetters(['userInfo', 'new_user', 'isAuthorization', 'helpInviteData', 'lightModePower', 'nextCity', 'isAutoLogin'])
		},
		watch: {
			userInfo() {
				if (_isCurrPage) {
					setTimeout(() => {
						//初始化
						if (this.$refs.loveModular) this.$refs.loveModular.initData(_PAGEPARMAS.temp)
						//个人地图数据
						if (this.$refs.userMap && !this.isAuthorization) this.$refs.userMap.initRankBoard(this
							.tabIndex)
						//个人勋章
						if (this.$refs.userModalCity && !this.isAuthorization) this.$refs.userModalCity.initMedal(
							this.tabIndex)
					}, 0);
					//未授权
					if (!this.isAuthorization) {
						if (_PAGEPARMAS && _PAGEPARMAS.type) {
							this.initLoadParmas()
							return
						}
						//授权登录确认
						// this.loginToast();
						// return
					}
					//处理外部分享或其它方式带参进入页面
					this.initLoadParmas()
					//初始化用户信息
					this.tabChange({
						detail: {
							name: this.tabIndex
						}
					})
				}
			},
			new_user(value, oldValue) {
				// 首次进入的弹窗
				if(value && _PAGEPARMAS.type != 'h5QrCode') {
					this.$refs.homeGuideDia.popupShow();
				}
			}
		},
		onLoad(option) {
			// debugger;
			//是否在当前页
			_isCurrPage = true;
			//是否在处理扫码弹窗
			isScanTutor = false
			//保存参数
			_PAGEPARMAS = option;
			//自定义导航栏需要
			getNavbarData().then(res => {
				let {
					navBarHeight,
					statusBarHeight
				} = res;
				this.navbarData = {
					height: navBarHeight + statusBarHeight,
					paddingTop: statusBarHeight
				}
			});
			// 在页面onLoad回调事件中创建插屏广告实例
			if (wx.createInterstitialAd) {
				interstitialAd = wx.createInterstitialAd({
					adUnitId: this.adunitId
				});
			}
			// 点亮方式列表的初始化
			this.$refs.lightingMode.init();
			// this.$refs.medalShareShow.showTime({});
		},
		onShow(o) {
			if(this.scanCodeVal && (this.scanCodeVal == 'fail')) {
				this.$refs.lightingMode.scanFailResult();
			} else if (this.scanCodeVal) {
				this.$refs.lightingMode.scanSuccResult(this.scanCodeVal);
			}
			this.scanCodeVal = null;
			//保存参数
			if (!_PAGEPARMAS) _PAGEPARMAS = o;
			//当前页
			_isCurrPage = true
			// 避免当前页多次触发onshow
			if (isScanTutor) return
			//刷新用户信息
			this.getUserInfo();
			//回到顶部
			this.mescroll.scrollTo(0, 0);
			// 视频的初始化
			this.videoAdCreate();
			// 每次显示页面重新获取已积攒的能量
			this.$refs.userMap.getEnergyNum();
			// 隐私协议判断
			this.$refs.privacy.LifetimesShow();
		},
		onHide(){
			this.$refs.userMap.clearAutoTimer()
		},
		onUnload() {
			_isCurrPage = false;
			this.videoAdObject.destroy();
			this.$refs.userMap.clearAutoTimer()
		},
		onShareAppMessage(data) {
			let share = {
				title: '点亮全中国，一起攒能量',
				path: '/pages/tabBar/home/index',
				imageUrl: 'https://file.y1b.cn/public/img/dlzg/dlzg_share_2023.png'
			}
			if (data.from == 'button') {
				if(data.target.dataset && (data.target.dataset.name === 'shareCity')){
					console.log('shareCity');
					const shareCityObject = this.shareCityObject;
					const shareImgData = JSON.stringify(shareCityObject.shareImgData);
					console.log('getShareCityData', shareCityObject);
					share.title = shareCityObject.share_title;
					share.imageUrl = shareCityObject.shareImg;
					share.path = '/pages/tabBar/home/index?type=cityShare&shareImgData=' + shareImgData;
					// 分享城市
				} else {
					share.title = '好友们都在为我助力，点击参与！'
					share.imageUrl = 'https://file.y1b.cn/public/img/dlzg/zl_share02.png'
					share.path = '/pages/tabBar/home/index?type=inviteHelp&' + this.helpInviteData
				}
			}
			return share;
		},
		methods: {
			...mapActions({
				getUserInfo: 'user/getUserInfo',
				updateUserNew: 'user/updateUserNew',
				isLoginFinish: 'user/isLoginFinish',
				getHelpInviteData: 'business/getHelpInviteData'
			}),
			...mapMutations({
				setOperaType: 'business/setOperaType'
			}),
			// 城市分享的button
			cityShareObjectHandle(shareTitleObject) {
				const shareCityObject = shareTitleObject;
				this.shareCityObject = shareCityObject;
			},
			// 用于ios的兼容性处理
			touchstartHandle() {
				this.$refs.userMap.setMapEnableFal();
			},
			touchendHandle() {
				this.$refs.userMap.setMapEnableTrue();
			},
			videoPlay() {
				// 用户触发广告后，显示激励视频广告
				if (this.videoAdObject) {
					this.videoAdObject.show().then(() => {
					}).catch((err) => {
						this.videoAdObject
							.load()
							.then(() => {
								this.videoAdObject.show();
							})
							.catch(err => {
								wx.showToast({
									title: this.videoAdErrHandle(err),
									icon: 'none'
								});
							});
					})
				}
			},
			videoAdCreate() {
				// 在页面onLoad回调事件中创建激励视频广告实例
				if (wx.createRewardedVideoAd) {
					this.videoAdObject = wx.createRewardedVideoAd({
						adUnitId: this.common.adunitId.accelerateLightUp,
						multiton: true
					});
					this.videoAdObject.onError((err) => {
						wx.showToast({
							title: this.videoAdErrHandle(err),
							icon: 'none'
						});
						console.log(this.videoAdErrHandle(err), 'this.videoAd__create的onError')
					});
                	// 监听关闭
                	this.videoAdObject.onClose((status) => {
						if (status && status.isEnded || status === undefined) {
							this.finishShow();
						} else {
							// 播放中途退出，进行提示
							wx.showToast({title: '未完整观看视频不能获取奖励哦', icon: 'none'})
						}
					});
				}
			},
			// 视频播放完正常关闭
			finishShow() {
				let params = {}
				if (this._loaction) {
					params = this._loaction
				}
				finish(params).then(res => {
					// 更新用户信息
					this.getUserInfo();
					// 刷新当前
					this.$refs.lightingMode.init();
					if (res.data) {
						let {
							city,
							image
						} = res.data;
						if (city && image) {
							this.$refs.lightingMode.showLightCity(res.data);
							return;
						}
						this.$refs.lightingMode.showGameOver();
						return;
					}
					// 换种方式点亮的提示
					this.$refs.lightingMode.showPeriodPopup();
				});
			},
			videoAdErrHandle(err){
				const errHandle={
					1000:'后端接口调用失败',
					1001:'参数错误',
					1002:'广告单元无效',
					1003:'内部错误',
					1004:'无合适的广告',
					1005:'广告组件审核中',
					1006:'广告组件被驳回',
					1007:'广告组件被封禁',
					1008:'广告单元已关闭',
				}
				return errHandle[err.errCode] || '视频跑丢了，换种方式继续点亮吧';
			},
			// 视频播放
			videoAdShowFinish(_loaction) {
				this._loaction = _loaction;
				this.videoPlay();
			},
			/*下拉刷新的回调 */
			downCallback() {
				//初始化用户信息
				this.tabChange({
					detail: {
						name: this.tabIndex
					}
				})
			},
			scroll(e) {
				let {
					scrollTop
				} = e.detail
				this.showMask = scrollTop > 50
			},
			//展示引导页
			showGuide() {
				//没有出现过引导页并且没有授权过
				// if(!getUserGuide()&&this.new_user!=0){
				//   this.$refs.guideModel.showGuide()
				// 	setUserGuide()
				// }
			},
			//处理外部分享或其它方式带参进入页面
			initLoadParmas() {
				/*没有参数则不处理*/
				if (!_PAGEPARMAS || !_PAGEPARMAS.type) {
					this.showGuide()
					return
				};
				setTimeout(() => {
					//加入团队链接处理
					if (_PAGEPARMAS.type == 'teamInvite' && !this.userInfo.team_id) {
						this.$refs.acceptTeam.popupShow({
							..._PAGEPARMAS
						})
						//防止自己给自己助力
					} else if (_PAGEPARMAS.type == 'inviteHelp' && this.userInfo.id != _PAGEPARMAS.uid) { //立即助力
						this.$refs.lightingMode.immediateHelp({
							..._PAGEPARMAS
						})
						//h5跳入处理
					} else if (_PAGEPARMAS.type == 'h5QrCode') {
						/*h5传递的信息*/
						let {
							h5QrCode,
							HeadPic,
							NickName,
							Lng,
							Lat
						} = _PAGEPARMAS
						/*没有授权，先存储h5传递的用户信息到本地*/
						if (!this.isAuthorization) {
							setH5UserInfo({
								HeadPic,
								NickName
							})
						}
						this.$refs.lightingMode.h5QrCode({
							Lng,
							Lat,
							h5QrCode,
							HeadPic,
							NickName
						})

						setStorage('getUserLocation', JSON.stringify({
							lastModified: Date.now(),
							data: {
								latitude: Lat,
								longitude: Lng
							}
						}));

					} else if (_PAGEPARMAS.type == 'continueLight') {
						this.$refs.lightingMode.direcTscan()
					} else if (_PAGEPARMAS.type === 'showLightMode') {
						if (_PAGEPARMAS.page === 'askAnswer') {
							this.$refs.periodPopup.popupShow();
						} else {
							// 弹起点亮方式的弹窗
							this.goLightUp();
						}
					} else if(_PAGEPARMAS.type === 'shareImg' && _PAGEPARMAS.shareImgData) {
						// 分享证书的展示
						const shareImgData = JSON.parse(_PAGEPARMAS.shareImgData);
						this.$refs.honorCard.popupShowImg(shareImgData);
					} else if(_PAGEPARMAS.type === 'shareReadPlan' && _PAGEPARMAS.shareImgData) {
						const shareImgData = JSON.parse(_PAGEPARMAS.shareImgData);
						// 分享阅读包的证书
						uni.navigateTo({
							url: `/pages/tabBar/shareCard/index?data=${JSON.stringify(shareImgData)}&source=home&com_id=${_PAGEPARMAS.com_id}`
						});
					} else if(_PAGEPARMAS.type === 'cityShare' && _PAGEPARMAS.shareImgData){
						const shareImgData = JSON.parse(_PAGEPARMAS.shareImgData);
						shareImgData.context = '每点亮一座城市，助力一份公益';
						shareImgData.closeShowScanImg = true;
						this.$refs.cityShareCard.showTime(shareImgData, true);
					} else if (_PAGEPARMAS.type === 'medalShare' && _PAGEPARMAS.shareImgData){
						// 分享的勋章
						const shareImgData = JSON.parse(_PAGEPARMAS.shareImgData);
						console.log('shareImgData', shareImgData)
						// this.showModal(shareImgData, 'home');
						this.$refs.medalShareShow.showTime(shareImgData);
						// console.log('shareImgData++_PAGEPARMAS.type', shareImgData)
					}
					//清除参数
					_PAGEPARMAS = {}
				}, 0)
			},
			//用户关闭助力
			// cancelHelp(_parmas) {
			// 	//显示是否放弃助力，抢救下
			// 	this.$refs.discardHelp.popupShow(_parmas)
			// 	//置空避免重复处理
			// 	_PAGEPARMAS = {}
			// },
			// //显示助力成功弹窗
			// helpSuccess(data) {
			// 	this.$refs.powerSuccess.popupShow(data)
			// },
			// clickScan() {
			// 	/*点击【码上点亮】 */
			// 	wx.reportEvent("click_mslight", {
			// 		authorized_or_not: Number(this.isAuthorization)
			// 	})
			// 	this.scan()
			// },
			// scanCheck() {
			// 	//未授权用户信息
			// 	if (!this.isAuthorization) {
			// 		//前往授权
			// 		this.loginToast()
			// 		return
			// 	}
			// 	//没有下一个需要点亮的城市，代表游戏结束
			// 	if (!_nextCity.user) {
			// 		this.showGameOver()
			// 		return
			// 	}

			// 	/*上次订阅发起时的时间*/
			// 	let scanWxMsgDate = uni.getStorageSync('scanWxMsgDate')
			// 	/*scanWxMsgDate为空或者记录的时间与当前时间(日期)不一样，则重新发起*/
			// 	if (!scanWxMsgDate || parseTime(scanWxMsgDate, '{y}-{m}-{d}') !== parseTime(Date.now(), '{y}-{m}-{d}')) {
			// 		getScanWxMsgId().then(res => {
			// 			if (res.data) {
			// 				uni.requestSubscribeMessage({
			// 					tmplIds: [res.data],
			// 					complete: (e) => {
			// 						//扫一扫点亮
			// 						this.scan()
			// 					},
			// 					success(e) {
			// 						/*回调*/
			// 						callWxMsgAuth().then(res => {})
			// 					}
			// 				})
			// 				/*记录发起时间*/
			// 				uni.setStorageSync('scanWxMsgDate', Date.now())
			// 				return
			// 			}
			// 			//扫一扫点亮
			// 			this.scan()
			// 		})
			// 		return
			// 	}
			// 	//扫一扫点亮
			// 	this.scan()
			// },
			scan() {
				//扫一扫点亮
				// isScanTutor = true
				// this.$refs.scanTutor.popupShow(this.tabIndex == 1 ? _nextCity.team : _nextCity.user, this.isAuthorization);
				/*点击【码上点亮】 */
				wx.reportEvent("click_mslight", {
					authorized_or_not: Number(this.isAuthorization)
				});
				if (!this.isAutoLogin) return this.loginToast(true);
				if (!this.lightModePower['SCAN']) {
					this.$refs.lightingMode.scanEndDialogShow()
					return
				}
				//调用扫码
				this.$refs.lightingMode.lightHandle({
					tag: 'SCAN',
					disabled: false,
					reportLoa: 'home'
				});
			},
			//直接扫一扫
			// direcTscan() {
			// 	//扫一扫点亮
			// 	isScanTutor = true
			// 	this.$refs.scanTutor.wxScan()
			// },
			resetScanState() {
				isScanTutor = false
				/*防止主动调用loginToast*/
				if (this.isAuthorization) this.getUserInfo()
			},
			// scanCodeType(data) {
			// 	switch (data.type) {
			// 		//點亮了城市
			// 		case 1:
			// 			this.$refs.lightCity.showTime(data, this.isAuthorization)
			// 			break
			// 		case 2:
			// 			this.$refs.soonLightCity.popupShow(data, this.isAuthorization)
			// 			break
			// 		case 3:
			// 			this.$refs.scanned.popupShow(this.isAuthorization)
			// 			break
			// 		case 4:
			// 			this.$refs.scanError.popupShow(data.msg, this.isAuthorization)
			// 			break
			// 	}
			// },
			// 进入我的界面
			goMine() {
				wx.reportEvent("click_pcenter", {
					authorized_or_not: Number(this.isAuthorization)
				});
				// if (!this.isAutoLogin) return this.loginToast(true);
				this.isLoginFinish(this.showInterstitialAd).then(() => {
					this.$router.navigateTo({
						url: '/pages/tabBar/user/index'
					});
				});
			},
			// 更多点亮
			moreLightUpClick() {
				wx.reportEvent("click_moptions", {
					authorized_or_not: Number(this.isAuthorization),
				});
				// 前往授权
				if (!this.isAuthorization) {
					this.loginToast();
					return;
				}
				if (!this.isAutoLogin) return this.loginToast(true);
				//没有下一个需要点亮的城市，代表游戏结束
				if (!this.nextCity) {
					this.showGameOver()
					return
				}
				this.goLightUp(3);
			},
			// 去点亮
			goLightUp(scenario_value = 0) {
				this.$refs.lightingMode.popupShow(scenario_value);
			},
			setScanTutor(scanTutor) {
				isScanTutor = scanTutor;
			},
			//游戏结束提示
			showGameOver() {
				this.$refs.lightingMode.showGameOver()
			},
			// 切换菜单
			tabChange(e) {
				this.tabIndex = e.detail.name;
				this.setOperaType(this.tabIndex)
				setTimeout(() => {
					switch (this.tabIndex) {
						case 0:
							this.initUser()
							break;
							// case 1:
							// this.initTeam()
							// break;
							// case 2:
							// this.initWhole()
							// break;
					}
				}, 0)
			},
			//个人
			initUser() {
				// 个人地图数据
				if (this.$refs.userMap) this.$refs.userMap.initData(this.tabIndex)
				//个人点亮城市
				if (this.$refs.userModalCity) this.$refs.userModalCity.initCity(this.tabIndex)
				//个人勋章
				if (this.$refs.userModalCity) this.$refs.userModalCity.initMedal(this.tabIndex)
				//刷新助力相关
				if (['teamInvite', 'inviteHelp'].indexOf(_PAGEPARMAS.type) == -1) {
					//助理記錄
					this.$refs.lightingMode.initHelp()
				}
			},
			//清除助力列表标记
			clearHelpMarker() {
				_PAGEPARMAS = {}
				//最新获取的勋章展示
				this.getNewModal()
			},
			/*实时勋章弹窗*/
			getNewModal() {
				// const Api = this.tabIndex == 0 ? geRealtUserMedal : getRealTeamMedal;
				geRealtUserMedal().then(res => {
					if (res.data) {
						const {
							province,
							image,
							create_time,
							love,
							reward_love,
							city_num,
							user_prop,
							id,
							credits
						} = res.data;
						this.showModal({
							medalImage: image,
							isLightUp: true,
							province: province,
							create_time: create_time,
							type: this.tabIndex,
							love,
							reward_love,
							city_num,
							user_prop,
							id,
							credits
						});
					}
				});
			},
			//显示弹窗
			showModal(data, type) {
				this.$refs.lightingMode.lightCityClose();
				console.log("res.data",data)
				this.$refs.medalPopup.showTime(data, type);
			},
			/*实时勋章弹窗 分享*/
			medalShare(data) {
				const {
					cityAllNum,
					date,
					medalIcon,
					nextTarge,
					province,
					rate
				} = data;
				this.$router.navigateTo({
					url: `/pages/user/medal/index?type=${this.tabIndex}&cityAllNum=${cityAllNum}&date=${date}&medalIcon=${medalIcon}&nextTarge=${nextTarge}&province=${province}&rate=${rate}`
				});
			},
			showInterstitialAd() {
				interstitialAd && interstitialAd.show();
			},
			//授权登录确认
			loginToast(isLocal = false) {
				let h5UserInfo = getH5UserInfo();
				if (h5UserInfo) {
					uni.showModal({
						title: '温馨提示',
						content: '您需要授权彬纷在线使用您的微信头像和昵称？',
						success: (res) => {
							if (res.confirm) {
								this.updateUserNew({
									nick_name: h5UserInfo.NickName,
									avatar_url: h5UserInfo.HeadPic
								}).then(() => {
									this.getUserInfo()
								})
								wx.reportEvent("click_confirm_0", {
									authorized_or_not: Number(this.isAuthorization)
								});
							} else if (res.cancel) {
								wx.reportEvent("click_cancel_0", {
									authorized_or_not: Number(this.isAuthorization)
								});
								// 在适合的场景显示插屏广告
								if (interstitialAd) interstitialAd.show();
							}

						}
					});
					return;
				}
				this.$go(`/pages/tabBar/login/index?isLocal=${isLocal}`);
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F7F6F2;
	}

	.home {
		position: fixed;
		top: 0;
		bottom: 125rpx;
		left: 0;
		width: 100%;
		box-sizing: border-box;

		.space-occupier {
			height: 370px;
			position: relative;
		}

		.van-tabs__scroll,
		.van-tabs__wrap {
			background-color: rgb(39, 55, 96);
		}

		.van-tabs__nav {
			background-color: #2E3C59;
			border-radius: 20px 20px 0 0;
		}

		.van-tabs__line {
			bottom: 20rpx;
		}
	}

	.bottom-menu-box {
		padding: 30rpx 30rpx 30rpx;
		background-color: #FFF5E8;
		position: fixed;
		width: 100%;
		bottom: 0;
		left: 0;
		box-sizing: border-box;
		z-index: 1;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
	}

	.bottom-menu {
		display: flex;
		justify-content: space-between;

		.bottom-menu-btn {
			width: 220rpx;
			height: 76rpx;
			box-sizing: border-box;
			background-color: #ffe0b9;
			border: 2rpx solid #ffb676;
			border-radius: 40px;
			color: #99673D;
			font-size: 28rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.bottom-menu-scan {
		width: 214rpx;
		height: 138rpx;
		position: absolute;
		top: -40rpx;
		left: 50%;
		margin-left: -107rpx;
		z-index: 100;
	}

	.custom-nav {
		box-sizing: border-box;
		font-size: 28rpx;
		font-weight: 400;
		color: #000018;
		display: flex;
		align-items: center;
		padding-left: 20px;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		z-index: 12;
		background-image: linear-gradient(180deg, #2cb8b8, #ffffff);
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
	}

	.custom-top {
		background-image: linear-gradient(180deg, #2cb8b8 3%, rgba(144, 204, 204, 0.00));
	}

	.custom-scroll {
		background-color: transparent;
	}

	.space-occupa {
		// height: 130rpx;
		position: fixed;
		z-index: 11;
		width: 100%;
		top: 0;
		left: 0;
		background-image: linear-gradient(180deg, #2cb8b8, #ffffff);
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
	}
</style>
