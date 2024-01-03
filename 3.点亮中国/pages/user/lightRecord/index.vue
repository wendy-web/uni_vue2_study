<template>
	<view class="light-record">
		<view class="custom-nav"
			:style="{lineHeight: navbarData.lineHeight+'px',paddingTop:navbarData.paddingTop+'px'}">
			点亮中国
			<view class="custom-nav-arrow" @click="navClick"
				:style="{top:navbarData.paddingTop+'px',height:navbarData.lineHeight+'px'}">
				<van-icon name="arrow-left" size="40rpx" />
			</view>
		</view>
		<view class="light-record-box" :style="{top:navbarData.height+'px'}">
			<mescroll-uni ref="mescrollRef" :fixed="false" @init="mescrollInit" :down="downOption" @down="downCallback"
				:up="upOption" @up="upCallback">
				<view class="light-record-total">
					<view class="lrt-r">
						<text class="num">{{total.prov_num}}</text>个省份，<text class="num">{{total.city_num}}</text>座城市被点亮
					</view>
					<view class="lrt-l">
						历时<text>{{total.time_span}}</text>天
					</view>
				</view>
				<!-- 待点亮 -->
				<view class="wait-light" v-if="nextCity">
					<view class="wait-light-head">
						待点亮
					</view>
					<view class="wait-light-box" @click="goToLightUpClick">
						<van-image style="filter: brightness(0.5);" width="100%" height="210rpx" fit="cover"
							:src="nextCity.image" radius="10px" use-loading-slot>
							<van-loading slot="loading" type="spinner" size="20" vertical />
						</van-image>
						<view class="wait-light-city">
							{{nextCity.city}}
						</view>
						<view class="go-light">
							去点亮
						</view>
					</view>
				</view>
				<!-- 點亮記錄列表 -->
				<view class="lrb-head">
					<view class="lrb-head-title">
						最近点亮
					</view>
					<view class="look-all" @click="goAllCities">
						查看全部城市
						<van-icon name="arrow" />
					</view>
				</view>
				<!-- list -->
				<view class="list-box">
					<view class="list-item" v-for="item in listData" :key="item.lit_date">
						<view class="time-day">
							{{item.lit_date}}
						</view>
						<view class="list-item-content" @click="showCity(_item)" v-for="(_item,index) in item.list"
							:key="index">
							<van-image width="440rpx" height="210rpx" fit="cover" :src="_item.image"
								radius="10px 0 0 10px" use-loading-slot>
								<van-loading slot="loading" type="spinner" size="20" vertical />
							</van-image>
							<view class="lic-r">
								<view class="city-name">
									{{_item.city}}
								</view>
								<view class="city-date">
									{{_item.lit_time}}点亮
								</view>
							</view>
						</view>
					</view>
				</view>
			</mescroll-uni>
		</view>
		<!-- 城市点击弹窗 -->
		<city-popup ref="cityPopup" @share="cityShare" />
		<!-- 城市分享 -->
		<city-share-card ref="cityShareCard" />
		<!-- 自定义分享 -->
		<van-share-sheet
			:show="showShare"
			:options="shareOptions"
			@select="shareSelect"
			@close="shareClose"
			:overlay="false"
		/>
		<!-- 分享朋友圈 -->
		<wechat-moments ref="wechatMoments" :isCustomNavbar="true" />
		<!-- 点亮方式组件 -->
		<lighting-mode
			ref="lightingMode"
			@refresh="downCallback"
			@videoAdShow="videoAdShowFinish"
			@cityShareObject ="cityShareObjectHandle"
		/>
		<!-- 隐私协议的组件 -->
		<privacy ref="privacy"></privacy>
	</view>
</template>

<script>
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	import {
		finish,
		getUserCity2
	} from '@/api/modules/home.js'
	import {
		mapGetters,
		mapActions
	} from 'vuex'
	import cityPopup from '@/components/popupWindow/cityPopup.vue'
	import cityShareCard from '@/components/popupWindow/cityShareCard/index.vue'
	import wechatMoments from '@/components/wechatMoments.vue'
	import {
		getUserLocation
	} from '@/utils/getUserLocation.js'
	import {
		getNavbarData
	} from '@/components/xhNavbar/xhNavbar.js';
	import {
		RewardedVideoAd
	} from '@/utils/index.js'
	//分页
	let NEXT = 0;
	//onshow次数
	let ONSHOWCOUNT = 0
	export default {
		mixins: [MescrollMixin],
		components: {
			cityPopup,
			cityShareCard,
			wechatMoments
		},
		data() {
			return {
				downOption: {
					auto: true, // 不自动加载 (mixin已处理第一个tab触发downCallback)
					textColor: '#333'
				},
				upOption: {
					auto: false, // 不自动加载
					noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					toTop: {
						src: ''
					},
					textNoMore: '~ 暂无更多信息 ~'
				},
				listData: [],
				total: {
					time_span: '',
					prov_num: '',
					city_num: ''
				},
				showShare: false,
				shareOptions: [{
						name: '微信',
						icon: 'wechat',
						openType: 'share'
					},
					{
						name: '朋友圈',
						icon: 'wechat-moments'
					},
					{
						name: '保存图片',
						icon: 'https://file.y1b.cn/public/img/dlzg/downImage.png'
					}
				],
				navbarData: {
					height: 88,
					paddingTop: 28
				},
				_loaction: '',
				scanCodeVal: null, // 扫码的value值
				videoAdObject: null, // 视频对象
				share_title: '我正在[点亮中国]公益现场，点击一起参加吧！',
				shareCityObject: ''
			}
		},
		watch:{
			lightModeList(n,o){
				if (ONSHOWCOUNT > 0) {
					this.getNextCity().then(() => {})
					this.downCallback()
				}
				ONSHOWCOUNT++
			}
		},
		computed: {
			...mapGetters(['userInfo', 'nextCity', 'helpInviteData','lightModeList', 'isAuthorization'])
		},
		onShareAppMessage(data) {
			let share = {
				title: '点亮全中国，一起攒能量',
				path: '/pages/tabBar/home/index'
			}
			const shareImgData = JSON.stringify(this.$refs.cityShareCard.getShareImgData());
			if (data.from == 'button') {
				if(data.target.dataset && (data.target.dataset.name === 'shareCity')){
					// 分享城市
					const shareCityObject = this.shareCityObject;
					const shareCityData = JSON.stringify(shareCityObject.shareImgData);
					console.log('getShareCityData', shareCityObject);
					share.title = shareCityObject.share_title;
					share.imageUrl = shareCityObject.shareImg;
					share.path = '/pages/tabBar/home/index?type=cityShare&shareImgData=' + shareCityData;
				} else {
					share.title = this.share_title;
					share.imageUrl = this.$refs.cityShareCard.getImageUrl();
					share.path = `/pages/tabBar/home/index?type=cityShare&shareImgData=${shareImgData}`;
				}
				if (!share.imageUrl) {
					return {
						title: '好友们都在为我助力，点击参与！',
						imageUrl: 'https://file.y1b.cn/public/img/dlzg/zl_share02.png',
						path: '/pages/tabBar/home/index?type=inviteHelp&' + this.helpInviteData
					}
				}
			}
			return share;
		},
		onShareTimeline(data) {
			let share = {
				title: '点亮全中国，一起攒能量'
			}
			share.path = '/pages/tabBar/home/index'
			const imageUrl = this.$refs.cityShareCard.getImageUrl()
			if (imageUrl) {
				share.title = this.share_title;
				share.imageUrl = imageUrl
			}
			return share;
		},
		onLoad(o) {
			ONSHOWCOUNT = 0
			//从首页点亮的城市点击进入
			setTimeout(() => {
				if (o.image) {
					this.showCity(o)
				} else if (o.cityImage) {
					this.cityShare(o)
				}
			}, 1000)
			//自定义导航栏需要
			getNavbarData().then(res => {

				let {
					navBarHeight,
					statusBarHeight
				} = res

				this.navbarData = {
					height: navBarHeight + statusBarHeight,
					lineHeight: navBarHeight,
					paddingTop: statusBarHeight
				}

			})
			//获取待点亮城市
			this.getNextCity().then(() => {});
			this.videoAdCreate();
			this.$refs.lightingMode.init();
		},
		// 组件销毁时
		onUnload() {
			this.videoAdObject.destroy();
		},
		onShow() {
			if(this.scanCodeVal && (this.scanCodeVal == 'fail')) {
				this.$refs.lightingMode.scanFailResult();
			} else if (this.scanCodeVal) {
				this.$refs.lightingMode.scanSuccResult(this.scanCodeVal);
			}
			this.scanCodeVal = null;
			// 隐私协议判断
			this.$refs.privacy.LifetimesShow();
		},

		// onShow() {
		// 	debugger
		// 	//获取下一个待点亮城市
		// 	if (ONSHOWCOUNT > 0) {
		// 		this.getNextCity().then(() => {})
		// 		this.$refs.lightingMode
		// 			.init()
		// 		this.downCallback()
		// 	}
		// 	ONSHOWCOUNT++
		// },
		methods: {
			...mapActions({
				getNextCity: 'business/getNextCity',
				getUserInfo: 'user/getUserInfo',
			}),
			// 城市分享的button
			cityShareObjectHandle(shareTitleObject) {
				const shareCityObject = shareTitleObject;
				this.shareCityObject = shareCityObject;
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
								console.log(this.videoAdErrHandle(err), 'this.videoAd.load()中的catch')
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
							console.log('视频正常关闭 下发奖励');
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
				return errHandle[err.errCode] || '视频加载错误,重新加载页面试试吧'
			},
			// 视频播放
			videoAdShowFinish(_loaction) {
				this._loaction = _loaction;
				this.videoPlay();
			},
			navClick() {
				uni.navigateBack({
					fail: function() {
						uni.redirectTo({
							url: '/pages/tabBar/home/index'
						})
					}
				})
			},
			shareSelect(e) {
				//保存图片
				if (e.detail.name == "保存图片") {
					this.$refs.cityShareCard.save()
				} else if (e.detail.icon == "wechat-moments") {
					//朋友圈
					this.shareClose()
					this.$refs.wechatMoments.show()
				}
			},
			shareClose() {
				this.showShare = false
				this.$refs.cityShareCard.popupClose()
			},
			cityShare(data) {
				/*点亮记录，城市名片【分享】 */
				wx.reportEvent("click_sharecity", {
					authorized_or_not: 1
				});
				let avatar = this.userInfo.avatar_url;
				let name = this.userInfo.nick_name;
				this.$refs.cityShareCard.showTime({
					avatar,
					name,
					cityImage: data.cityImage,
					date: data.lightDate,
					cityName: data.cityName
				});
				this.showShare = true;
			},
			showCity(item) {
				console.log('item', item);
				const {
					city,
					image,
					lit_time,
					share_title
				} = item;
				this.share_title = share_title;
				this.$refs.cityPopup.popupShow({
					cityImage: image,
					isLightUp: true,
					cityName: city,
					lightDate: lit_time
				});
			},
			goAllCities() {
				uni.navigateTo({
					url: '/pages/user/allCities/index?type=0'
				});
			},
			/*下拉刷新的回调 */
			downCallback() {
				NEXT = 0;
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
				this.mescroll.resetUpScroll();
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				let parmas = {
					limit: 10
				};
				if (NEXT != 0) parmas.next = NEXT

				//获取数据next:NEXT,
				getUserCity2(parmas).then(res => {
					const {
						total,
						list,
						next
					} = res.data;
					let data = {
						list: list || []
					};
					// 处理数据
					data.list = data.list.map(item => {
						let {
							list,
							lit_date
						} = item

						return {
							lit_date: lit_date.replace(/^(\d{4})-(\d{2})$/, '$1年$2月'),
							list: list.map(item => {
								return {
									...item,
									lit_time: item.lit_time.slice(0, 10)
								}
							})
						}

					})

					//联网成功的回调,隐藏下拉刷新和上拉加载的状态
					this.mescroll.endSuccess(data.list.length);
					//设置列表数据
					if (NEXT == 0) {
						this.listData = [] //如果是第一页需手动制空列表
						this.total = total
					}
					NEXT = next
					//填充数据
					this.listData = this.listData.concat(data.list);

				}).catch(err => {
					//联网失败, 结束加载
					this.mescroll.endErr();
				});

			},
			// 	去点亮城市
			goToLightUpClick() {
				wx.reportEvent("click_rlcity", {
					authorized_or_not: Number(this.isAuthorization)
				});
				this.$refs.lightingMode.popupShow({
					user: this.nextCity
				}, 0);
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F2F2F2;
	}

	.light-record {

		.custom-nav {
			box-sizing: border-box;
			background-image: linear-gradient(304deg, #f9ede0 37%, #fffcf3 95%);
			font-weight: 400;
			color: #000018;
			display: flex;
			// align-items: center;
			justify-content: center;
			position: fixed;
			width: 100%;
			height: 294rpx;
		}


		.custom-nav-arrow {
			font-size: 28rpx;
			position: absolute;
			left: 0;
			padding: 0 20rpx;
		}

		.light-record-box {
			position: fixed;
			bottom: 88rpx;
			left: 20rpx;
			right: 20rpx;
			background-color: #FFFEFB;
			border-radius: 10px;
		}


		.light-record-total {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 136rpx;
			padding: 40rpx;
			background-color: #FFFEFB;
			border-radius: 10px 10px 0 0;
			box-sizing: border-box;
			position: relative;

			&::after {
				content: '';
				position: absolute;
				left: 40rpx;
				right: 40rpx;
				bottom: 0;
				height: 1rpx;
				background-color: #E5E3DC;

			}
		}

		.lrt-r {
			font-size: 28rpx;
			font-weight: 400;
			color: #000018;

			.num {
				font-size: 40rpx;
				color: #F7304D;
			}
		}

		.lrt-l {
			font-size: 28rpx;
			font-weight: 400;
			color: #4e4d52;
		}

		.lrb-head {
			height: 130rpx;
			padding: 0 20rpx 0 40rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			background-color: #FFFEFB;
		}

		.lrb-head-title {
			font-size: 36rpx;
			font-weight: 700;
			color: #000018;
		}

		.wait-light {
			padding: 38rpx 20rpx 0;
		}

		.wait-light-head {
			padding: 0 20rpx 24rpx;
			font-size: 36rpx;
			font-weight: 700;
			color: #000018;
		}

		.wait-light-box {
			position: relative;
		}

		.wait-light-city {
			position: absolute;
			top: 50rpx;
			left: 50%;
			transform: translateX(-50%);
			font-size: 32rpx;
			font-weight: 700;
			color: #ffffff;
			z-index: 1;
		}

		.go-light {
			width: 136rpx;
			height: 50rpx;
			background-color: rgba(255, 255, 255, 0.20);
			border: 1rpx solid rgba(255, 255, 255, 0.50);
			border-radius: 13px;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: 50rpx;
			font-size: 24rpx;
			font-weight: 500;
			color: #ffffff;
			text-align: center;
			line-height: 48rpx;
			box-sizing: border-box;
		}


		.look-all {
			font-size: 28rpx;
			font-weight: 400;
			color: #F55B21;
			padding: 20rpx 10rpx;
		}

		.list-box {
			padding: 0 20rpx 20rpx;

		}

		.list-item+.list-item {
			margin-top: 40rpx;
		}

		.list-item-content {
			display: flex;
			align-items: center;
			background-image: linear-gradient(138deg, #ffffff 30%, #f9ede0 98%);
			border-radius: 10px;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
			font-size: 0;
		}

		.list-item-content+.list-item-content {
			margin-top: 22rpx;
		}

		.time-day {
			font-size: 28rpx;
			font-weight: 400;
			color: #4E4D52;
			padding-left: 20rpx;
			padding-bottom: 22rpx;
		}

		.lic-r {
			padding-left: 20rpx;
		}

		.city-name {
			font-size: 32rpx;
			font-weight: 700;
			color: #4E4D52;
		}

		.city-date {
			font-size: 24rpx;
			font-weight: 400;
			color: #4E4D52;
			margin-top: 20rpx;
		}
	}
</style>
