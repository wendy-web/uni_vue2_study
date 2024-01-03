<template>

	<view class="love-details">
		<xh-navbar :title="navTitle" titleColor="#000018" :shareImg="true" leftImage="/static/images/black_back.png"
			@leftCallBack="backHome" />
		<view class="loading_box" v-if="false">
			<image class="loading_box-img" src="/static/images/loading.gif" mode="aspectFill"></image>
		</view>
		<view class="tab_box" :style="{
			opacity: opacityNum,
			background: `linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,${opacityNum}) 100%)`
		}">
			<van-tabs :active="tabIndex" color="#F55B21" title-active-color="#FF7507" title-inactive-color="#676767" scrollspy
				sticky @change="changeTabHandle" id="tabBox" v-if="tabList.length">
				<van-tab v-for="item in tabList" :key="item.id" :title="item.title">
				</van-tab>
			</van-tabs>
		</view>
		<!-- 内容的展示 -->
		<scroll-view class="love-details-box" :scroll-with-animation='true' :scroll-y="true" :scroll-into-view="scrollValue"
			:enhanced="true" @scroll="bindScrollHandle">
			<view id="top_con_id">
				<view class="top-content">
					<!-- 顶部图片 -->
					<image class="top-img" :src="config.image" mode="aspectFill"></image>
					<!-- logo -->
					<image class="top-logo" src="../../../static/home/yjj.png" mode="aspectFill" v-if="!isLoveFinish">
					</image>
					<image v-else class="top-finish_icon" src="/static/images/finish_icon.png" mode="aspectFill">
					</image>
					<!-- 滚动通知 -->
					<an-notice-bar class="position" :list="config.donate"
						v-if="config.donate && config.donate.length && (rate<100) && !isLoveFinish"></an-notice-bar>
				</view>
				<!-- 自定义内容 -->
				<view class="diy-content">
					<view class="diy-title">
						{{config.title}}
					</view>
					<view class="diy-ad">
						<text v-for="(_item,index) in config.intro" :key="index" :style="{color:_item.color}">{{_item.text}}</text>
					</view>
					<view class="diy-tips">
						{{config.explain}}
					</view>
					<view class="diy-target">
						本期目标：帮助{{config.plan_num}}名儿童
						<!-- （={{config.plan_love|love}}万能量） -->
					</view>
					<view class="progress-box">
						<view class="progress" :style="{width:rate+'%'}"></view>
					</view>
					<view class="progress-text" v-if="(!isLoveFinish) && (rate <100)">
						当前进度{{rate}}%，还有<text class="yellow">{{config.plan_num-config.num}}人</text>待帮助
					</view>
					<view class="progress-text" v-if="(isLoveFinish)">
						当前进度{{rate}}%，本期目标<text class="yellow">已达成</text>
					</view>
					<view class="line"></view>
					<!-- 捐献记录 -->
					<view class="donate-record" v-if="config.donate_total.num">
						<view class="donate-record-head">
							<view class="donate-record-title">
								{{type==0?'我的':'团队'}}捐献记录
							</view>
							<view class="donate-record-details" @tap="showDetails(config.id)">
								查看详情
								<van-icon name="arrow" />
							</view>
						</view>
						<view class="donate-record-info">
							已<text class="yellow">捐献{{config.donate_total.num||0}}次</text>，<text
								class="yellow">累计{{config.donate_total.love||0}}</text>能量
						</view>
					</view>
				</view>
			</view>
			<!-- 项目详情 -->
			<view class="content_box" id="content_detail" :style="{height: showMoreDetail ? '500px' : 'auto'}"
				v-if="introduceCont">
				<rich-text :nodes="introduceCont"></rich-text>
				<view class="more_btn" v-if="showMoreDetail" @click="getShowMoreDetailHandle">
					查看更多<van-icon name="arrow-down" class="more_btn_icon" size="14" />
				</view>
			</view>

			<!-- 进展 -->
			<view id="content_progress">
				<!-- 项目进展 -->
				<view class="donate" v-if="performCont && performCont.title">
					<view class="donate-title">项目进展</view>
					<view class="donate-cont">
						<view class="donate-cont_love">
							<view> {{performCont.title}}</view>
							<view class="donate_love" @click="donateLoveHandle">
								<van-icon name="like" :color="loveStatus.isLove ? '#F4344C' : 'gray'" />
								<text>{{loveStatus.num}}</text>
							</view>
						</view>
						<view class="donate-cont-text">{{ performCont.subtitle }}</view>
						<view class="donate-cont-text">
							{{ performCont.content }}
						</view>
						<view v-for="item in performCont.perform" :key="item.id">
							<view class="donate-title">{{item.title}}</view>
							<view class="donate-cont-text">
								{{ item.content }}
							</view>
							<view class="love_list-img">
								<view v-for="(imgItem, index) in item.images" :key="index"
									@click="previewImgHandle(imgItem, item.images)">
									<image class="love_img" :src="imgItem" mode="aspectFill"></image>
									<text class="love_text" v-if="index == 2">
										共{{ item.images.length }}张
									</text>
								</view>
							</view>
						</view>
					</view>
					<!-- 公益进行中 -->
					<!-- <view class="donate-cont_nll">
						<image class="donate-cont-bg" src="../static/null_bg.png" mode="aspectFill"></image>
						<view>项目进行中，暂未更新进展</view>
					</view> -->
				</view>

				<!-- 捐献排行Top5 -->
				<view class="donate" v-if="isLoveFinish && topList && topList.length">
					<view class="donate-title" :class="[{mb4: config.type && isLoveFinish}]">捐献排行Top5</view>
					<view class="donate-hint" v-if="config.type">
						以下小伙伴将获得活动主办方的精美礼物一份
					</view>
					<view class="donate-list donate_top" v-for="(item, index) in topList" :key="item.uid">
						<view class="pro_list-left">
							<view class="pro_list-num">
								<image v-if="index < 3" class="donate-num" :src="`../static/top_icon${index + 1}.png`"
									mode="aspectFill"></image>
							</view>
							<view class="pro_list-user">
								<image class="pro_user-img" :src="item.avatar_url" mode="aspectFill"></image>
								<text>{{item.nick_name}}</text>
							</view>
						</view>
						<view class="pro_list-right">
							<image class="pro_right-icon" src="/static/images/medal_popup_icon02.png" mode="aspectFill">
							</image>
							<text>{{item.love}}</text>
						</view>
					</view>
				</view>

				<!-- 捐献列表的展示 -->
				<view class="donate" v-if="isLoveFinish && donateList && donateList.length">
					<view class="donate-title">感谢所有爱心小标兵(排名不分先后)</view>
					<view class="donate-list" v-for="item in donateList" :key="item.uid">
						<view class="pro_list-left">
							<view class="pro_list-user">
								<image class="pro_user-img" :src="item.avatar_url" mode="aspectFill"></image>
								<text>{{item.nick_name}}</text>
							</view>
						</view>
						<view class="pro_list-right">
							<text>已捐出</text>
							<image class="pro_right-icon" src="/static/images/medal_popup_icon02.png" mode="aspectFill">
							</image>
							<text>{{item.love}}</text>
						</view>
					</view>
					<view class="more_btn" @click="getMoreDonateListHandle" v-if="isShowMoreDonateBtn">
						查看更多<van-icon name="arrow-down" class="more_btn_icon" size="14" />
					</view>
				</view>
			</view>

			<!-- 机构 -->
			<view class="content_box" id="content_organization" v-if="institutionCont">
				<rich-text :nodes="institutionCont"></rich-text>
			</view>
		</scroll-view>

		<!-- 底部的导航 -->
		<!-- 温暖包 -->
		<view class="donate-btn-position" v-if="(type == 0 || userInfo.condition == 1) && (rate<100) && !isLoveFinish">
			<!-- 我要捐献 个人 或者 队长可以捐赠 -->
			<view class="dbp-tips">
				每捐一份能量，助力一份公益
			</view>
			<view class="donate-btn_box" @click="showWantDonate">
				<tex class="donate_box-text">捐能量</tex>
			</view>
		</view>
		<!-- 阅读包 -->
		<view class="donate-btn-position" v-else @click="goBenefitPlanHandle">
			<view class="donate-btn_box">
				<view>目标已达成，助力更多公益</view>
				<view>
					可用能量
					<image class="donate-btn-icon" src="/static/images/medal_popup_icon02.png" mode="aspectFill">
					</image>
					{{ availableLoveNum }}
				</view>
			</view>
		</view>
		<!-- 我要捐献 -->
		<want-donate ref="wantDonate" @wantDonateBack="wantDonateBack"></want-donate>
		<!-- 荣誉证书 -->
		<honor-card ref="honorCard" @continueLight="goToLightHandle" />
		<!-- 捐献记录 -->
		<donate-record ref="donateRecord" />
		<!-- 能力不足的弹窗 -->
		<context-dialog ref="contextDialog" @goToLight="goToLightHandle" />
		<!-- 点亮方式组件 -->
		<lighting-mode ref="lightingMode" @videoAdShow="videoAdShowFinish" @refreshClose="refreshLove"
			@cityShareObject="cityShareObjectHandle" />
		<view class="love_ani-box" v-show="likeAni">
			<image class="love_ani" src="https://file.y1b.cn/public/img/dlzg/ani.gif" mode="aspectFill"></image>
		</view>
		<!-- 收货地址弹窗 -->
		<addressDialog :dialogShow='addressDialog' @close="closeDialog" @submit="submitAddress"></addressDialog>
		<!-- 隐私协议的组件 -->
		<privacy ref="privacy"></privacy>
	</view>
</template>

<script>
	import {
		getUserDetail,
		getDonateUserTop,
		getDonateUserList,
		like,
		submitAddressApi
	} from '@/api/modules/love.js'
	import {
		getInfo
	} from '@/api/modules/team.js'
	import AnNoticeBar from '@/components/an-notice-bar/an-notice-bar.vue'
	import wantDonate from '@/components/wantDonate.vue'
	import donateRecord from './donateRecord.vue'
	import honorCard from '@/components/honorCard/honorCard.vue'
	import contextDialog from '@/components/lightingMode/contextDialog';
	import addressDialog from "./components/addressDialog.vue"

	import {
		getH5UserInfo
	} from '@/utils/auth.js';
	import {
		finish
	} from '@/api/modules/home.js';

	import {
		mapGetters,
		mapActions
	} from 'vuex';
	//區分個人與團隊
	let _parmas;
	// 在页面中定义插屏广告
	let interstitialAd = null;
	//是否监听userinfo
	let isWatchUser = false
	//从消息模板跳时，等待wx.login userinfo 更新时拉取信息
	let isLoginUpdate = false;

	export default {
		components: {
			AnNoticeBar,
			wantDonate,
			donateRecord,
			honorCard,
			contextDialog,
			addressDialog
		},
		onLoad(o) {
			// console.log('o',o)
			isWatchUser = false
			_parmas = o;
			// this.type = _parmas.type
			// 初始化阅读包的项目进展内容内容
			this.initCont();
			this.initUserTeam();
			// 在页面onLoad回调事件中创建插屏广告实例
			if (wx.createInterstitialAd) {
				interstitialAd = wx.createInterstitialAd({
					adUnitId: this.adunitId
				});
			}
			//从消息模板跳时，等待wx.login userinfo 更新时拉取信息
			isLoginUpdate = false
			if (!this.userInfo.avatar_url) {
				isLoginUpdate = true;
			}
			//从消息模板跳时，等待wx.login userinfo 更新时拉取信息
			// 点亮方式列表的初始化
			this.$refs.lightingMode.init();
			// 用于埋点的监听
			this.isH5 = Number(_parmas.isH5) || 0;
			this.videoAdCreate();
		},
		onShow() {
			if (this.scanCodeVal && (this.scanCodeVal == 'fail')) {
				this.$refs.lightingMode.scanFailResult();
			} else if (this.scanCodeVal) {
				this.$refs.lightingMode.scanSuccResult(this.scanCodeVal);
			}
			this.scanCodeVal = null;
			this.initData(_parmas);
			this.getUserInfo();
			// 隐私协议判断
			this.$refs.privacy.LifetimesShow();
		},
		computed: {
			...mapGetters(['userInfo', 'isAuthorization', 'helpInviteData', 'isAutoLogin']),
			rate() {
				if (this.config.num) {
					return (this.config.num / this.config.plan_num * 100).toFixed(1);
				}
				return 0;
			},
		},
		filters: {
			love(val) {
				if (!val) return 0
				return (val / 10000).toFixed(1)
			}
		},
		watch: {
			userInfo() {
				if (isWatchUser) {
					this.initUserTeam();
					this.showWantDonate();
					isWatchUser = false;
				} else if (isLoginUpdate) {
					// 从消息模板跳时，等待wx.login userinfo 更新时拉取信息
					this.initData(_parmas)
					this.initUserTeam();
					isLoginUpdate = false
				}
				this.initUserTeam();
			},
			tabList() {
				this.tabIndex = 0;
			},

		},
		data() {
			return {
				navTitle: "捐能量，助力公益",
				config: {
					donate_total: {
						num: 0,
						love: 0
					},
					explain: "",
					image: "",
					intro: [],
					love: 4,
					num: 0,
					plan_love: 0,
					plan_num: 0,
					title: "",
					status: 0, // 温暖包是否结束
				},
				type: 0,
				availableLoveNum: 0,
				adunitId: this.common.adunitId.donateLove,
				_loaction: '',
				isH5: 0, // 是否是h5扫码进入，用于埋点的监听
				tabIndex: 0, // tab的index
				opacityNum: 0, // tab的展示
				tabHeight: 0,
				isLoveFinish: true, // 温暖包是否结束
				scrollValue: '',
				tabList: [],
				introduceCont: '', // 项目介绍
				showMoreDetail: true, // 展示更多的详情内容
				institutionCont: '', // 机构介绍
				performCont: null, // 进展内容
				topList: [], // top排名的list
				donateList: [], // 捐献列表
				nextIndex: 1, // 分页
				isShowMoreDonateBtn: false,
				loveStatus: {
					num: 0,
					isLove: false
				},
				loveDetailId: 0,
				scanCodeVal: null, // 扫码的value
				likeAni: false,
				videoAdObject: null, // 视频对象
				isLoadingBg: true,
				shareImgData: null,
				shareCityObject: '',
				addressDialog: false, //填写收货信息弹窗开关
				// region: ['广东省', '广州市', '海珠区'],
				region: ['', '', ''],
				parcel: 0, //接口返回的是否满足前5参数,1满足前5,0不满足
				errName: "", //
				errMobile: "", //
				errArea: "", //
				errAddress: "", //

			}
		},
		onUnload() {
			this.videoAdObject.destroy();
		},
		onShareAppMessage(data) {
			let {
				com_id,
				donated_love,
				type
			} = _parmas;
			let share = {
				title: '点亮全中国，一起攒能量',
				path: '/pages/tabBar/home/index',
				imageUrl: 'https://file.y1b.cn/public/img/dlzg/dlzg_share_2023.png'
			}
			share.title = this.config.title;
			share.imageUrl = this.config.image;
			share.path = `/pages/love/loveDetails/index?com_id=${com_id}&donated_love=${donated_love}&type{type}`;
			if (data.from == 'button') {
				if (data.target.dataset && (data.target.dataset.name === 'topShare')) {

					share.title = this.config.title;
					share.imageUrl = this.config.image;
					share.path = `/pages/love/loveDetails/index?com_id=${com_id}&donated_love=${donated_love}&type{type}`;
				} else if (data.target.dataset && (data.target.dataset.name === 'help')) {
					share.title = '好友们都在为我助力，点击参与！'
					share.imageUrl = 'https://file.y1b.cn/public/img/dlzg/zl_share02.png'
					share.path = '/pages/tabBar/home/index?type=inviteHelp&' + this.helpInviteData
				} else if (data.target.dataset && (data.target.dataset.name === 'shareCity')) {
					// 城市分享
					const shareCityObject = this.shareCityObject;
					const shareImgData = JSON.stringify(shareCityObject.shareImgData);
					console.log('getShareCityData', shareCityObject);
					share.title = shareCityObject.share_title;
					share.imageUrl = shareCityObject.shareImg;
					share.path = '/pages/tabBar/home/index?type=cityShare&shareImgData=' + shareImgData;
					// 分享城市
				} else {
					const shareImg = this.$refs.honorCard.getImageUrl();
					const shareImgData = JSON.stringify(this.shareImgData);
					share.title = `快来看看我的能量证书！`;
					share.path = `/pages/tabBar/home/index?type=shareImg&shareImgData=${shareImgData}`;
					share.imageUrl = shareImg;
				}
			}
			return share;
		},
		methods: {
			// 关闭收货地址弹窗
			closeDialog() {
				this.addressDialog = false;
			},
			// 提交收货地址信息
			async submitAddress(params) {
				console.log("params", params)
				let com_id = this.config.id;
				let data = {
					com_id,
					...params,
				}
				uni.showLoading({
					title: '正在提交中',
					mask: true
				});
				try {
					const result = await submitAddressApi(data)
					uni.hideLoading()
					if (result.code == 1) {
						this.addressDialog = false;
					}
					uni.showToast({
						title: result.msg,
						icon: 'none',
						duration: 3000,
					});
				} catch (e) {
					uni.hideLoading()
				}

			},
			backHome() {
				uni.navigateBack({
					fail(e) {
						uni.reLaunch({
							url: '/pages/tabBar/home/index'
						})
					}
				})
			},

			// 城市分享的button
			cityShareObjectHandle(shareTitleObject) {
				const shareCityObject = shareTitleObject;
				this.shareCityObject = shareCityObject;
			},
			refreshLove() {
				this.getUserInfo();
				this.initUserTeam();
			},
			videoPlay() {
				// 用户触发广告后，显示激励视频广告
				if (this.videoAdObject) {
					this.videoAdObject.show().then(() => {
						console.log('this.videoAdObject.show() ____then');
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
					});
					// 监听关闭
					this.videoAdObject.onClose((status) => {
						if (status && status.isEnded || status === undefined) {
							console.log('视频正常关闭 下发奖励');
							this.finishShow();
						} else {
							// 播放中途退出，进行提示
							wx.showToast({
								title: '未完整观看视频不能获取奖励哦',
								icon: 'none'
							})
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
			videoAdErrHandle(err) {
				const errHandle = {
					1000: '后端接口调用失败',
					1001: '参数错误',
					1002: '广告单元无效',
					1003: '内部错误',
					1004: '无合适的广告',
					1005: '广告组件审核中',
					1006: '广告组件被驳回',
					1007: '广告组件被封禁',
					1008: '广告单元已关闭',
				}
				return errHandle[err.errCode] || '视频加载错误,重新加载页面试试吧'
			},
			// 点赞
			donateLoveHandle() {
				if (!this.isAutoLogin) return this.loginToast(true);
				let { isLove, num } = this.loveStatus;
				if (!isLove) {
					num++;
				} else {
					num--;
				}
				like({
					com_id: Number(this.loveDetailId) || 0
				}).then((res) => {
					if (!res.code) return;
					if (!isLove) {
						this.likeAni = true;
						setTimeout(() => this.likeAni = false, 3000);
						// uni.showToast({
						// 	title: res.msg
						// });
					}
				});
				this.loveStatus = {
					num,
					isLove: !isLove
				}
			},
			initCont() {
				this.nextIndex = 1;
				this.getDonateUserTopList();
				this.getDonateList();
			},
			// 图片的展示
			previewImgHandle(currentUrl, imgList) {
				wx.previewImage({
					current: currentUrl,
					urls: imgList
				});
			},
			// 获取捐献top的list
			getDonateUserTopList() {
				getDonateUserTop({
					com_id: Number(_parmas.com_id),
					limit: 5,
				}).then((res) => {
					if (!res.code) return;
					this.topList = res.data.list;
					this.parcel = res.data.parcel;
					this.getScrollTop(); // 更新位置信息
				});
			},
			// 捐赠用户列表（具体项目）
			getDonateList(next = this.nextIndex) {
				getDonateUserList({
					com_id: Number(_parmas.com_id),
					limit: 5,
					next,
				}).then(res => {
					if (!res.code) return;
					const {
						list,
						next
					} = res.data;
					if (!list || (!list.length || list.length < 5)) {
						return this.isShowMoreDonateBtn = false;
					}
					this.donateList = this.donateList.concat(list);
					this.nextIndex = next;
					this.isShowMoreDonateBtn = true;
					this.getScrollTop(); // 更新位置信息
				});
			},
			// 展示项目详情更多
			getShowMoreDetailHandle() {
				this.showMoreDetail = !this.showMoreDetail;
				this.getScrollTop(); // 更新位置信息
			},
			// 展示捐献列表更多
			getMoreDonateListHandle() {
				this.getDonateList();
			},
			// 获取到模块的距离top的大小
			async getScrollTop() {
				let topConRes = await this.initWarpRect('top_con_id');
				let topConHeight = topConRes.height;
				this.tabList && this.tabList.forEach((item, index) => {
					this.initWarpRect(item.idText).then(async (res) => {
						if (!res) return;
						if ((item.idText === 'content_detail') && this.showMoreDetail && (res.height > 500)) {
							item.height = 500;
						} else {
							item.height = res.height;
						}
						item.scrollTop = res.top;
						if (index == 0) {
							item.actualScrollTop = topConHeight;
						} else if (index == 1) {
							let contProgressHeight = {
								height: 0
							}
							if (item.id !== 1) {
								contProgressHeight = await this.initWarpRect('content_progress');
							}
							item.actualScrollTop = topConHeight + this.tabList[index - 1].height +
								contProgressHeight.height;
						} else if (index == 2) {
							item.actualScrollTop = topConHeight + this.tabList[index - 1].height +
								this.tabList[index - 2].height;
						}
					});
				});
				this.initWarpRect('tabBox').then((res) => this.tabHeight = res.height);

			},
			initWarpRect(id) {
				return new Promise(resolve => {
					setTimeout(() => {
						let query = uni.createSelectorQuery();
						// #ifndef MP-ALIPAY
						query = query.in(this) // 支付宝小程序不支持in(this),而字节跳动小程序必须写in(this), 否则都取不到值
						// #endif
						query.select('#' + id).boundingClientRect(data => {
							resolve(data);
						}).exec();
					}, 20)
				})
			},
			// 监听滚动的
			bindScrollHandle(event) {
				if (!this.tabHeight) return;
				const scrollTop = parseInt(event.detail.scrollTop);
				this.opacityNum = scrollTop / this.tabHeight;
				if (scrollTop < this.tabList[1].actualScrollTop) {
					this.tabIndex = 0;
				}
				if (this.tabList.length > 1 && scrollTop > this.tabList[1].actualScrollTop) {
					this.tabIndex = 1;
				}
				if (this.tabList.length > 2 && scrollTop > this.tabList[2].actualScrollTop) {
					this.tabIndex = 2;
				}
			},
			changeTabHandle(event) {
				const index = event.detail.index;
				this.scrollValue = this.tabList[index].idText;
			},
			...mapActions({
				getUserInfo: 'user/getUserInfo',
				updateUserNew: 'user/updateUserNew'
			}),
			goBenefitPlanHandle() {
				uni.navigateTo({
					url: '/pages/user/benefitPlan/index'
				});
			},
			// 视频播放
			videoAdShowFinish(_loaction) {
				this._loaction = _loaction;
				this.videoPlay();
			},
			// 去点亮
			goToLightHandle() {
				this.$refs.lightingMode.popupShow();
			},
			showWantDonate() {
				/*项目详情【捐能量】 */
				wx.reportEvent("click_projectcenergy", {
					authorized_or_not: Number(this.isAuthorization),
					scenario_value: this.isH5
				});
				if (!this.isAuthorization) {
					this.loginToast();
					return;
				}
				if (!this.isAutoLogin) return this.loginToast(true);
				if (this.availableLoveNum <= 0) {
					return this.$refs.contextDialog.popupShow();
				};
				if (_parmas.donated_love > 0 && this.availableLoveNum < 3) {
					return this.$refs.contextDialog.popupShow('能量不足，3份起捐');
				}
				let miniDonatNum = 1;
				if (_parmas.donated_love > 0) { //个人超一次捐献3星
					miniDonatNum = 3
				}
				// loveDetailId
				this.$refs.wantDonate.showTime({
					type: this.type,
					id: this.loveDetailId,
					love: this.availableLoveNum,
					teamId: _parmas.teamId,
					miniDonatNum,
					isH5: this.isH5
				});
			},
			// 授权登录确认
			loginToast(isLocal = false) {
				let h5UserInfo = getH5UserInfo();
				if (h5UserInfo) {
					isWatchUser = true
					uni.showModal({
						title: '温馨提示',
						content: '您需要授权彬纷在线使用您的微信头像和昵称？',
						success: (res) => {
							if (res.confirm) {
								this.updateUserNew({
									nick_name: h5UserInfo.NickName,
									avatar_url: h5UserInfo.HeadPic
								}).then(() => {
									this.getUserInfo();
								})
								wx.reportEvent("click_confirm_0", {
									authorized_or_not: Number(this.isAuthorization),
									scenario_value: this.isH5
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
			},
			wantDonateBack(data, love) {
				console.log('data', data)
				this.shareImgData = data;
				this.initData(_parmas);
				this.availableLoveNum -= love;
				_parmas.donated_love += love;
				// 温暖包完成,去阅读包的分享页
				if (this.config.type) {
					// this.goToLightHandle();
					uni.navigateTo({
						url: `/pages/tabBar/shareCard/index?data=${JSON.stringify(this.shareImgData)}&source=donate&com_id=${this.config.id}`
					});
				} else {
					this.$refs.honorCard.showTime(data, true);
				}
			},
			showDetails(id) {
				if (!this.isAutoLogin) return this.loginToast(true);
				this.$refs.donateRecord.showTime({
					type: this.type,
					com_id: id
				});
			},
			initData({
				type,
				id,
				com_id,
				temp
			}) {
				let params = {
					com_id: id || com_id || 0
				};
				if (_parmas.temp) {
					params.temp = _parmas.temp
				}
				getUserDetail(params, true, temp).then(res => {
					this.isLoadingBg = false;
					const {
						code,
						data
					} = res;
					if (code == 1 && data) {
						data.intro = data.intro.split('|').map(item => {
							let color = '#000018'
							if (/:color/.test(item)) {
								color = '#FF6F00'
							}
							return {
								color,
								text: item.replace(':color', '')
							}
						})
						this.config = data;
						this.loveDetailId = data.id;
						this.isLoveFinish = data.status;
						this.introduceCont = data.introduce; // 项目介绍
						this.tabList = [];
						// console.log("this.config.type", this.config.type)
						// console.log("this.parcel", this.parcel)
						// console.log("this.isLoveFinish", this.isLoveFinish)

						if (this.config.type && this.parcel && this.isLoveFinish) {
							this.addressDialog = true
						}

						if (this.introduceCont) {
							this.tabList.push({
								id: 0,
								title: '介绍',
								idText: 'content_detail',
								scrollTop: 0,
								height: 0
							});
						}
						this.institutionCont = data.institution; // 机构介绍
						// 进展内容 -
						if (data.progress_title) {
							this.tabList.push({
								id: 1,
								title: '进展',
								idText: 'content_progress',
								scrollTop: 0,
								height: 0,
							});
						}
						if (this.institutionCont) {
							this.tabList.push({
								id: 2,
								title: '机构',
								idText: 'content_organization',
								scrollTop: 0,
								height: 0
							});
						}
						this.performCont = {
							title: data.progress_title,
							subtitle: data.progress_subtitle,
							content: data.progress_content,
							perform: data.perform
						}
						// 点赞的内容
						this.loveStatus = {
							num: data.like_num,
							isLove: Boolean(data.like_status)
						};
						this.getScrollTop();
					}
				}).
				catch(res => {
					this.isLoadingBg = false;
				});
			},
			initUserTeam() {
				const {
					donated_love,
					love
				} = this.userInfo;
				this.availableLoveNum = love;
				_parmas.donated_love = donated_love
			}
		}
	}
</script>

<style lang="scss">
	.xh-navber-box {
		background-color: #fff;
	}

	.loading_box {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999;
		background: #fff;

		.loading_box-img {
			width: 400rpx;
		}
	}

	.love-details {
		background-color: #E8EDFF;
		position: relative;

		.tab_box {
			position: absolute;
			top: 176rpx;
			width: 100%;
			background: gray;
			color: #fff;
			z-index: 100;
			transition: all 1s;
		}

		.love-details-box {
			position: fixed;
			top: 176rpx;
			left: 0;
			bottom: 230rpx;
			width: 100%;
			background-color: #FCECCD;
		}

		.top-content {
			position: relative;
		}

		.position {
			position: absolute;
			top: 30rpx;
			left: 30rpx;
		}

		.top-img {
			width: 100%;
			height: 480rpx;
		}

		.content_box {
			width: 100%;
			position: relative;
			padding: 40rpx;
			box-sizing: border-box;
			overflow: hidden;
			background: #ffffff;
			border-radius: 20rpx;
			margin-bottom: 40rpx;
		}

		.top-logo {
			width: 200rpx;
			height: 32rpx;
			position: absolute;
			top: 30rpx;
			right: 20rpx;
		}

		.top-finish_icon {
			width: 158rpx;
			height: 158rpx;
			position: absolute;
			top: 248rpx;
			right: 7rpx;
		}

		.diy-content {
			border-radius: 10px 10px 0 0;
			padding: 40rpx 30rpx 0;
			background-color: #fff;
			margin-top: -65rpx;
			position: relative;
			overflow: hidden;
			z-index: 1;
		}

		.diy-title {
			font-size: 32rpx;
			font-weight: 700;
			color: #000018;
			margin-bottom: 10rpx;
		}

		.diy-ad {
			font-size: 28rpx;
			font-weight: 400;
			color: #4e4d52;
			letter-spacing: 0.19px;
		}

		.diy-tips {
			font-size: 28rpx;
			font-weight: 400;
			color: #8e8e91;
			letter-spacing: 0.19px;
			margin: 10rpx 0 40rpx;
		}

		.diy-target {
			font-size: 32rpx;
			font-weight: 700;
			color: #000018;
			margin-bottom: 20rpx;
		}

		.progress-box {
			width: 80%;
			height: 18rpx;
			background-color: #dadada;
			border-radius: 10px;
			position: relative;
			margin-top: 16rpx;
			overflow: hidden;
		}

		.progress {
			height: 18rpx;
			background: linear-gradient(90deg, #ec6536 16%, #f0984c 92%);
			border-radius: 10px;
			position: absolute;
			left: 0;
			top: 0;
		}

		.progress-text {
			font-size: 24rpx;
			font-weight: 400;
			color: #8e8e91;
			letter-spacing: 0.18px;
			margin-top: 10rpx;
		}

		.yellow {
			color: #FF6F00;
		}

		.line {
			height: 2rpx;
			background-color: #DCDFE6;
			margin-top: 26rpx;
			margin-right: 30rpx;
			margin-bottom: 32rpx;
		}

		.donate-record-head {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.donate-record-title {
			font-size: 32rpx;
			font-weight: 700;
			color: #000018;
		}

		.donate-record-details {
			font-size: 28rpx;
			font-weight: 400;
			color: #8e8e91;
			display: flex;
			align-items: center;
		}

		.donate-record-info {
			font-size: 24rpx;
			font-weight: 400;
			color: #4e4d52;
			letter-spacing: 0.19px;
			padding: 6rpx 0 30rpx;
		}

		.donate-btn-position {
			width: 100%;
			height: 230rpx;
			position: fixed;
			left: 0;
			bottom: 0;
			background-color: #FCECCD;
			box-sizing: border-box;
			padding-top: 30rpx;
			text-align: center;

			.donate-btn_box {
				width: 640rpx;
				line-height: 44rpx;
				font-size: 32rpx;
				font-weight: 700;
				padding: 16rpx 0;
				margin: auto;
				color: #fff;
				border-radius: 100rpx;
				background: linear-gradient(90deg, #FCA404 16%, #FC750A 92%);

				.donate_box-text {
					line-height: 54rpx;
				}

				>view {
					display: flex;
					align-items: center;
					justify-content: center;

					&:last-child {
						margin-top: 10rpx;
					}
				}

			}

			.donate-btn-icon {
				width: 25rpx;
				height: 42rpx;
				margin-left: 7rpx;
			}
		}

		.popup-tips {
			font-size: 24rpx;
			font-weight: 400;
			color: #4e4d52;
			letter-spacing: 0.19px;
			margin-top: 10rpx;
			margin-bottom: 48rpx;
			text-align: center;
		}

		.popup-title {
			font-size: 32rpx;
			font-weight: 700;
			color: #000018;
			text-align: center;
			padding-top: 40rpx;
			margin-bottom: 30rpx;
		}

		.dbp-tips {
			font-size: 28rpx;
			font-weight: 400;
			color: #FF7F48;
			white-space: nowrap;
			margin-bottom: 20rpx;
		}
	}

	.donate {
		background: #ffffff;
		border-radius: 20rpx;
		padding: 40rpx 40rpx 40rpx 30rpx;
		margin-bottom: 40rpx;
		position: relative;

		.donate-title {
			font-size: 32rpx;
			font-weight: 700;
			color: #000018;
			line-height: 52rpx;
			margin-bottom: 32rpx;
			counter-reset: topNum;

			&.mb4 {
				margin-bottom: 4rpx;
			}
		}

		.donate-hint {
			font-size: 28rpx;
			color: #8e8e91;
			margin-bottom: 20rpx;
		}

		.donate-list {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 24rpx;
			color: #000018;

			&:not(:last-child) {
				margin-bottom: 40rpx;
			}

			&.donate_top:nth-child(-n + 4) {
				.pro_list-right {
					color: #FF4907;
				}
			}

			view {
				display: flex;
				align-items: center;
			}

			.pro_list-left {
				.pro_list-num {
					position: relative;
					width: 46rpx;
					height: 54rpx;
					margin: 0 60rpx 0 10rpx;

					&::before {
						width: 100%;
						content: counter(topNum);
						counter-increment: topNum;
						text-align: center;
						line-height: 54rpx;
						font-size: 32rpx;
					}

					.donate-num {
						position: absolute;
						width: 100%;
						height: 100%;
						top: 0;
						left: 0;
						z-index: 1;
					}
				}

				.pro_list-user {
					.pro_user-img {
						width: 60rpx;
						height: 60rpx;
						border-radius: 50%;
						background: gray;
						margin-right: 10rpx;
					}
				}
			}

			.pro_list-right {
				line-height: 52rpx;
				color: #666666;

				text {
					min-width: 44rpx;
					text-align: center;
				}

				.pro_right-icon {
					padding: 8rpx;
					box-sizing: border-box;
					width: 32rpx;
					height: 52rpx;
					margin: 0 10rpx;
				}
			}
		}
	}

	.more_btn {
		position: absolute;
		width: 100%;
		bottom: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 100rpx 0 30rpx;
		line-height: 64rpx;
		text-align: center;
		background: linear-gradient(to bottom, rgba(255, 255, 255, 0.50) 17%, #ffffff 80%);
		font-size: 26rpx;
		color: #8e8e91;

		.more_btn_icon {
			border: 2rpx solid;
			border-radius: 50%;
			margin-left: 10rpx;
		}
	}

	.donate {
		.more_btn {
			position: relative;
			background: transparent;
			padding: 0;
			line-height: inherit;
		}
	}

	.donate-cont {
		.donate-cont_love {
			font-size: 28rpx;
			font-weight: 700;
			color: #000018;
			line-height: 52rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.donate_love {
				// width: 90rpx;
				padding: 0 12rpx;
				line-height: 40rpx;
				border: 1rpx solid #dadae2;
				border-radius: 21rpx;
				font-size: 26rpx;
				color: #333333;
				letter-spacing: 0.21rpx;
				text-align: center;
			}
		}

		.donate-cont-text {
			font-size: 28rpx;
			color: #4e4d52;
			line-height: 34rpx;
			margin-top: 20rpx;
		}

		.donate-title {
			margin: 40rpx 0 0 0;
		}

		.love_list-img {
			height: 158rpx;
			width: 100%;
			margin-top: 20rpx;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			overflow: hidden;

			>view {
				width: 218rpx;
				height: 158rpx;
				border-radius: 20rpx;
				overflow: hidden;
				position: relative;
				margin-right: 14rpx;

				&:nth-child(3n) {
					margin: 0;
				}

				.love_img {
					width: 100%;
					height: 100%;
					background: gray;
				}

				.love_text {
					position: absolute;
					bottom: 0;
					left: 0;
					width: 100%;
					line-height: 52rpx;
					text-align: center;
					color: #fff;
					background: rgba(0, 0, 0, 0.50);
				}
			}

		}
	}

	.donate-cont_nll {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		font-size: 24rpx;
		text-align: center;
		color: #a3a2a8;
		margin: 57rpx 0 100rpx 0;

		.donate-cont-bg {
			width: 448rpx;
			height: 352rpx;
			margin-bottom: 39rpx;
		}
	}

	.love_ani-box {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
		display: flex;
		justify-content: center;
		align-items: center;

		.love_ani {
			width: 100%;
			height: 100%;
			animation: opactyAni .5s;
		}
	}

	@keyframes opactyAni {
		0% {
			opacity: .5;
			transform: scale(.5);

		}

		100% {
			opacity: 1;
			transform: scale(1);
		}
	}

	.address-wrapper {

		.van-cell {
			background-color: #fff;
			border-radius: 16rpx;
			margin-bottom: 32rpx;
			height: 80rpx;

			.van-cell__title {
				color: #333333;
				font-size: 28rpx;
				border-right: 2rpx solid #e1e1e1;

			}

			.van-cell__value {
				overflow: visible !important;

				// .van-field__error-message {
				// 	margin-top: rpx;
				// }
			}



		}
	}
</style>