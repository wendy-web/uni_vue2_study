<template>
	<view class="medal">
		<!-- 顶部背景 -->
		<image class="head-bg" src="../static/medal_bg.png" mode="aspectFill"></image>
		<xh-navbar :title="navTitle" titleColor="#ffffff" titleAlign="titleCenter" leftImage="/static/images/back.png"
			@leftCallBack="backHome" />
		<!-- head -->
		<scroll-view :scroll-y="true" class="medal-box"
			:style="{top:navBarConfig.navBarHeight+navBarConfig.statusBarHeight+'px'}">
			<!-- 团队基本信息 -->
			<view class="basic-info">
				<view class="basic-info-left">
					<image v-if="basicInfo.image" class="basic-image" :src="basicInfo.image" mode="aspectFill"></image>
					<image v-else class="basic-image" src="/static/images/avatar_default.png" mode="aspectFill"></image>
					<text class="basic-name">
						{{nkName}}
					</text>
				</view>
				<view class="basic-value">
					<view class="medal-total"><text class="yellow">{{total.num}}</text>枚</view>
					<view class="medal-total-tips">已获得</view>
				</view>
			</view>
			<!-- 我的勛章 -->
			<view class="my-medal-content">
				<!-- 背景板 -->
				<image class="medal-box-border" src="/pages/user/static/box_border.png" mode="aspectFill"></image>
				<view class="my-medal" v-if="list1.length>0">
					<view class="my-medal-head">
						已获得勋章
					</view>
					<view class="medal-list">
						<view class="medal-item" v-for="item in list1" :key="item.id" @click="showMedal(item)">
							<view class="medal-item-box mib-lock">
								<van-image width="158rpx" height="158rpx" :src="item.image" fit="cover" lazy-load
									use-loading-slot>
									<van-loading slot="loading" type="spinner" size="20" vertical />
								</van-image>
							</view>
							<view class="medal-date">
								{{item.create_time}}
							</view>
						</view>
					</view>
				</view>
				<!-- 待解锁勋章 -->
				<view class="my-medal" v-if="list0.length>0">
					<view class="my-medal-head unlock">
						待解锁勋章
					</view>
					<view class="medal-list">
						<view class="medal-item" v-for="item in list0" :key="item.id" @click="showMedal(item)">
							<view class="medal-item-box mib-unlock">
								<van-image width="158rpx" height="158rpx" :src="item.image" fit="cover" lazy-load
									use-loading-slot>
									<van-loading slot="loading" type="spinner" size="20" vertical />
								</van-image>
								<!-- 水波纹 -->
								<image v-if="item.status === 0" class="water" mode="heightFix"
									src="/static/home/water_black.png" :style="{bottom:item.propRate}">
							</view>
							<!-- 解锁进度 -->
							<view class="unlock-progress" v-if="item.prop>0||item.id==soonMedalId">
								{{item.propRate}}
							</view>
							<!-- 待解锁 -->
							<view class="stay-unlock" v-if="item.prop === 0&&item.id!=soonMedalId">
								<image class="stay-unlock-icon" src="/static/home/lock.png" mode="aspectFill"></image>
								待解锁
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 勛章展示彈窗 -->
		<medal-popup ref="medalPopup" @share="medalShare" />
		<!--勋章分享 -->
		<medal-share-card ref="medalShareCard" />
		<!-- 自定义分享 -->
		<van-share-sheet :show="showShare" :options="shareOptions" @select="shareSelect" @close="shareClose"
			:overlay="false" />
		<!-- 分享朋友圈 -->
		<wechat-moments ref="wechatMoments" :isCustomNavbar="true" />
		<!-- 隐私协议的组件 -->
		<privacy ref="privacy"></privacy>
	</view>
</template>

<script>
	import {
		getNavbarData
	} from '@/components/xhNavbar/xhNavbar.js'
	import {
		getTeamAll,
		getTeamMedalDiff,
		getUserMedalDiff
	} from '@/api/modules/home.js'
	import {
		mapGetters
	} from 'vuex'
	import medalPopup from '@/components/popupWindow/medalPopup.vue'
	import medalShareCard from '@/components/popupWindow/medalShareCard/index.vue'
	import wechatMoments from '@/components/wechatMoments.vue'
	//page参数
	let _pageParams = null
	//邀请数据
	export default {
		components: {
			medalPopup,
			medalShareCard,
			wechatMoments
		},
		data() {
			return {
				navBarConfig: {
					navBarHeight: 0,
					statusBarHeight: 0, //状态栏高度
					menuWidth: 0
				},
				navTitle: '我的勋章',
				basicInfo: {
					image: '',
					name: '',
					num: 0
				},
				type: 0, //个人还是团队
				list0: [],
				list1: [],
				total: {
					num: 0
				},
				showShare: false,
				shareOptions: [{
                    	id: 1,
						name: '微信',
						icon: 'wechat',
						openType: 'share'
					},
					{
						id: 2,
						name: '朋友圈',
						icon: 'wechat-moments'
					},
					{
						id: 3,
						name: '保存图片',
						icon: 'https://file.y1b.cn/public/img/dlzg/downImage.png'
					}
				],
				share_title: '点亮中国集勋章，快看我新得的勋章！',
				shareImgData: null,
				shareItemDataItem: null
			}
		},
		computed: {
			...mapGetters(['userInfo', 'soonMedalId']),
			nkName() {

				let name = this.basicInfo.name

				if (name) return name

				return this.type == 0 ? '暂无授权' : '暂无团队'

			}
		},
		onShareAppMessage(data) {
			let share = {
				title: '点亮全中国，一起攒能量',
				path: '/pages/tabBar/home/index'
			}
			if (data.from == 'button') {
				share.imageUrl = this.$refs.medalShareCard.getImageUrl();
				const shareData = {
					...this.shareImgData,
					...this.shareItemDataItem
				}
				share.title = this.share_title || shareData.share_title;
				console.log('data---shareImgData', shareData)
				const shareImgData = JSON.stringify(shareData);
				share.path =`/pages/tabBar/home/index?type=medalShare&shareImgData=${shareImgData}`;
			}
			return share;
		},
		onShareTimeline(data) {
			let share = {
				title: '点亮全中国，一起攒能量'
			}
			share.path = '/pages/tabBar/home/index'
			const imageUrl = this.$refs.medalShareCard.getImageUrl()
			if (imageUrl) {
				share.title = '点亮中国集勋章，快看我新得的勋章！'
				share.imageUrl = imageUrl
			}
			return share;
		},
		onLoad(o) {
			//个人还是团队
			// this.type = +o.type
			//获取导航栏数据
			getNavbarData().then(res => {
				this.navBarConfig = res
			})
			_pageParams = o
		},
		onShow() {
			// 隐私协议判断
			this.$refs.privacy.LifetimesShow();
			//获取基本信息
			this.initData(_pageParams)
			_pageParams = null
		},
		methods: {
			shareSelect(e) {
				//保存图片
				if (e.detail.name == "保存图片") {
					this.$refs.medalShareCard.save()
				} else if (e.detail.icon == "wechat-moments") {
					//朋友圈
					this.shareClose()
					this.$refs.wechatMoments.show()
				}
			},
			shareClose() {
				this.showShare = false
				this.$refs.medalShareCard.popupClose()
			},
			medalShare(data) {
				let avatar = this.basicInfo.image;
				let name = this.basicInfo.name;
				this.shareImgData = {
					...data,
					avatar,
					name,
					type: this.type,
				}
				this.$refs.medalShareCard.showTime(this.shareImgData)
				this.showShare = true
			},
			showMedal(item) {
				this.share_title = item.share_title;
				if (item.status == 0 && item.prop > 0) {
					uni.navigateTo({
						url: '/pages/user/currentlyLit/index?medal_id=' + item.id
					});
					return;
				}
				this.shareItemDataItem = {
					medalImage: item.image,
					isLightUp: Boolean(+item.status),
					province: item.province,
					create_time: item.create_time,
					type: this.type,
					love: item.love,
					reward_love: item.reward_love,
					city_num: item.city_num,
					user_prop: item.user_prop,
					id: item.id,
					next_num: item.next_num,
					credits:item.credits
				}
				this.$refs.medalPopup.showTime(this.shareItemDataItem);
			},
			initData(o) {
				//动态title
				this.navTitle = this.type == 0 ? '我的勋章' : '团队勋章';
				//个人
				if (this.type == 0) {

					const {
						avatar_url,
						nick_name
					} = this.userInfo

					this.basicInfo = {
						image: avatar_url,
						name: nick_name
					}

				} else {
					//团队
					getTeamAll(true).then(res => {

						const {
							image,
							name
						} = res.data.team

						this.basicInfo = {
							image: image,
							name: name
						}

					})
				}
				//获取勋章信息
				const Api = this.type == 0 ? getUserMedalDiff : getTeamMedalDiff
				Api(true).then(res => {
					const {
						list_0,
						list_1,
						total
					} = res.data
					// let num = Date.now()
					// list_0.forEach(item => {
					// 	item.image += '?' + num
					// })
					// list_1.forEach(item => {
					// 	item.image += '?' + num
					// })
					this.list0 = list_0.map(function(item) {
						return {
							...item,
							propRate: (item.prop * 100).toFixed(0) + '%'
						}

					})
					this.list1 = list_1
					this.total = total
					//带信息跳转
					console.log('medalShare',o, o.medalIcon)
					if (o && o.medalIcon) {
						o.medalIcon = o.medalIcon;
						this.medalShare(o)
					}
				})

			},
			backHome() {
				uni.reLaunch({
					url: `/pages/tabBar/home/index`
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
	}

	.medal {
		.head-bg {
			width: 100%;
			height: 494rpx;
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
		}

		.medal-box {
			width: 100%;
			position: absolute;
			left: 0;
			bottom: 40rpx;
			height: auto;
		}

		.basic-info {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-left: 50rpx;
			padding-right: 100rpx;
			padding-top: 80rpx;
			margin-bottom: 46rpx;
		}

		.basic-image {
			width: 130rpx;
			height: 130rpx;
			border: 2px solid #ff7507;
			border-radius: 50%;
		}

		.basic-info-left {
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.basic-name {
			font-size: 32rpx;
			font-weight: 700;
			color: #F2F2F2;
			margin-left: 25rpx;
		}

		.medal-total {
			font-size: 38rpx;
			font-weight: 400;
			color: #f2f2f2;
		}

		.yellow {
			font-size: 60rpx;
			font-weight: 400;
			text-align: left;
			color: #FCD232;
		}

		.medal-total-tips {
			font-size: 28rpx;
			font-weight: 400;
			color: #f2f2f2;
		}

		.my-medal-content {
			position: relative;
			padding-top: 78rpx;
		}

		.my-medal {
			background-color: #FFFFFF;
			border-radius: 40px 40px 0 0;
			padding-bottom: 40rpx;
		}

		.my-medal+.my-medal {
			padding-top: 40rpx;
			border-radius: 0;
		}

		.my-medal-head {
			font-size: 32rpx;
			font-weight: 700;
			color: #FF7507;
			padding-left: 20rpx;
			padding-bottom: 20rpx;
			position: relative;
			z-index: 2;
			background-color: #FFFFFF;
			padding: 0 40rpx 0;
		}

		.my-medal-head.unlock {
			color: #000018;
		}

		.medal-list {
			display: flex;
			flex-wrap: wrap;
			position: relative;
			z-index: 2;
			background-color: #FFFFFF;
			padding: 0 20rpx;
		}

		.medal-item {
			width: 33.33%;
			padding-top: 30rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			position: relative;
		}

		.medal-item-box {
			position: relative;
			width: 158rpx;
			height: 158rpx;
			padding: 6rpx;
			border-radius: 50%;
			overflow: hidden;
			-webkit-backface-visibility: hidden;
			-webkit-transform: translate3d(0, 0, 0);
		}

		.mib-lock {
			background-image: linear-gradient(180deg, #FFD690, #FF8902);
		}

		.mib-unlock {
			background-color: #939393;
		}

		.medal-date {
			font-size: 28rpx;
			font-weight: 400;
			color: #a3a2a8;
		}

		.water {
			position: absolute;
			height: 180rpx;
			bottom: 0%;
			left: 100%;
			transform: translateX(-100%);
			animation: waterAnim 5s infinite linear alternate;
		}

		.unlock-progress {
			width: 76rpx;
			height: 36rpx;
			background: #ff7507;
			border-radius: 18px;
			position: absolute;
			right: 30rpx;
			top: 30rpx;
			font-size: 24rpx;
			font-weight: 700;
			text-align: center;
			color: #ffffff;
			line-height: 36rpx;
		}

		.stay-unlock {
			width: 128rpx;
			height: 38rpx;
			background-color: #ffffff;
			border: 2rpx solid #a3a2a8;
			border-radius: 22px;
			font-size: 20rpx;
			font-weight: 400;
			color: #4e4d52;
			position: absolute;
			left: 50%;
			bottom: 0;
			transform: translateX(-50%);
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.stay-unlock-icon {
			width: 24rpx;
			height: 24rpx;
			margin-right: 2rpx;
		}

		.medal-box-border {
			width: 100%;
			height: 78rpx;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 1;
		}
	}
</style>
