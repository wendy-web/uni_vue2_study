<template>
	<view class="currently-lit">
		<!-- 顶部背景 -->
		<xh-navbar title="解锁勋章" titleColor="#000018" :navberColor="showMask?'#ffffff':'transparent'"
			titleAlign="titleCenter" leftImage="/static/images/black_back.png" @leftCallBack="backHome" />
		<!--顶部模块-->
		<view class="top-box">
			<!--背景-->
			<image class="head-bg" src="../static/jjdl/jjdl_icon_01.png" mode="aspectFill"></image>
			<!--台子-->
			<image class="stage" src="../static/jjdl/jjdl_icon_02.png" mode="aspectFill"></image>
			<!--光-->
			<image class="light" src="../static/jjdl/jjdl_icon_03.png" mode="aspectFill"></image>
			<!--勋章-->
			<view class="medals-being-lit">
				<view class="mbl-box">
					<van-image width="256rpx" height="256rpx" :src="medal.image" radius="50%" fit="cover" rad lazy-load
						use-loading-slot>
						<van-loading slot="loading" type="spinner" size="20" vertical />
					</van-image>
					<!-- 水波纹 -->
					<image class="water" src="/static/home/water_black.png" mode="heightFix"
						:style="{bottom:(medal.prop*100).toFixed(0)+'%'}"></image>
				</view>
				<!-- 进度 -->
				<view class="mbl-progress" v-if="medal.prop<1">
					{{(medal.prop*100).toFixed(0)}}%
				</view>
				<view class="mbl-province">
					{{medal.province}}
				</view>
			</view>
			<!--统计-->
			<view class="total-box">
				<!--标题-->
				<view class="total-box-title">
					{{ medal.status == 0 ? `点亮${medal.province}所有城市即可解锁` : "恭喜你成功解锁" }}
				</view>
				<!--背景-->
				<image class="total-box-bg" src="../static/jjdl/jjdl_icon_04.png" mode="aspectFill"></image>
				<!--内容-->
				<view class="total-list">
					<view class="total-list-item">
						<image class="tli-icon" src="../static/jjdl/jjdl_icon_05.png" mode="aspectFill"></image>
						<view class="tli-name">
							点亮城市
						</view>
						<view class="tli-value">
							x{{medal.city_num||0}}
						</view>
					</view>
					<view class="total-list-item">
						<image class="tli-icon" src="../static/jjdl/jjdl_icon_06.png" mode="aspectFill"></image>
						<view class="tli-name">
							公益能量
						</view>
						<view class="tli-value">
							x{{medal.love||0}}
						</view>
					</view>
					<view class="total-list-item">
						<image class="tli-icon" src="../static/jjdl/jjdl_icon_07.png" mode="aspectFill"></image>
						<view class="tli-name">
							加奖能量
						</view>
						<view class="tli-value">
							x{{medal.reward_love||0}}
						</view>
					</view>
				</view>
			</view>
		</view>

		<!--点亮记录-->
		<view class="axis-box">
			<image class="bg-title" src="/pages/user/static/jjdl/bg_title.png" mode="aspectFill"></image>
			<!--背景-->
			<view class="axis-box-bg">
				<van-image width="100%" height="4214rpx" src="/pages/user/static/jjdl/axis_bg.png" fit="cover" lazy-load
					use-loading-slot>
					<van-loading slot="loading" type="spinner" size="20" vertical />
				</van-image>
			</view>
			<!-- 多个 -->
			<block v-if="!isOneChild">
				<!--固定区域-->
				<view v-if="given_01" class="axis-01-box" :class="{'not-active':given_01.status == 0}">
					<!--城市-->
					<view class="axis-city ac-trans01">
						<van-icon name="location" />{{given_01.city}}
					</view>
					<!--城市图片-->
					<view class="axis-city-icon aci-trans01">
						<van-image width="258rpx" height="178rpx" :src="given_01.image" fit="cover" lazy-load
							use-loading-slot>
							<van-loading slot="loading" type="spinner" size="20" vertical />
						</van-image>
					</view>
					<!--线-->
					<image class="axis-line1" src="/pages/user/static/jjdl/axis_line1.png" mode="aspectFill"></image>
					<!-- 小飞机 -->
					<image v-if="given_01.status == 1" class="plane plane-trans01"
						src="/pages/user/static/jjdl/plane.png" mode="aspectFill"></image>
				</view>
				<view v-if="given_02" class="axis-02-box" :class="{'not-active':given_02.status == 0}">
					<!--城市-->
					<view class="axis-city ac-trans02">
						<van-icon name="location" />{{given_02.city}}
					</view>
					<!--城市图片-->
					<view class="axis-city-icon aci-trans02">
						<van-image width="258rpx" height="178rpx" :src="given_02.image" fit="cover" lazy-load
							use-loading-slot>
							<van-loading slot="loading" type="spinner" size="20" vertical />
						</van-image>
					</view>
					<!--线-->
					<image class="axis-line2" src="/pages/user/static/jjdl/axis_line2.png" mode="aspectFill"></image>
					<!-- 小飞机 -->
					<image v-if="given_02.status == 1" class="plane plane-trans02"
						src="/pages/user/static/jjdl/plane.png" mode="aspectFill"></image>
				</view>
				<view v-if="given_03" class="axis-03-box" :class="{'not-active':given_03.status == 0}">
					<!--城市-->
					<view class="axis-city ac-trans03">
						<van-icon name="location" />{{given_03.city}}
					</view>
					<!--城市图片-->
					<view class="axis-city-icon aci-trans03">
						<van-image width="258rpx" height="178rpx" :src="given_03.image" fit="cover" lazy-load
							use-loading-slot>
							<van-loading slot="loading" type="spinner" size="20" vertical />
						</van-image>
					</view>
					<!--线-->
					<image class="axis-line3" src="/pages/user/static/jjdl/axis_line3.png" mode="aspectFill"></image>
					<!-- 小飞机 -->
					<image v-if="given_03.status == 1" class="plane plane-trans03"
						src="/pages/user/static/jjdl/plane.png" mode="aspectFill"></image>
				</view>
				<!--loop区域-->
				<block v-for="(item,index) in list" :key="index">
					<view class="axis-loop01-box" :class="{'not-active':item[0].status == 0}">
						<!--城市-->
						<view class="axis-city ac-loop-trans01">
							<van-icon name="location" />{{item[0].city}}
						</view>
						<!--城市图片-->
						<view class="axis-city-icon aci-loop-trans01">
							<van-image width="258rpx" height="178rpx" :src="item[0].image" fit="cover" lazy-load
								use-loading-slot>
								<van-loading slot="loading" type="spinner" size="20" vertical />
							</van-image>
						</view>
						<!--线 -->
						<image class="axis-loop-line1" :class="{'last-line1':item[0].last}"
							src="/pages/user/static/jjdl/axis_line4.png" mode="aspectFill"></image>
						<!-- 小飞机 -->
						<image v-if="item[0].status == 1&&!item[0].last" class="plane plane-trans04"
							src="/pages/user/static/jjdl/plane.png" mode="aspectFill"></image>
					</view>
					<view v-if="item[1]" class="axis-loop02-box" :class="{'not-active':item[1].status == 0}">
						<!--城市-->
						<view class="axis-city ac-loop-trans02">
							<van-icon name="location" />{{item[1].city}}
						</view>
						<!--城市图片-->
						<view class="axis-city-icon aci-loop-trans02">
							<van-image width="258rpx" height="178rpx" :src="item[1].image" fit="cover" lazy-load
								use-loading-slot>
								<van-loading slot="loading" type="spinner" size="20" vertical />
							</van-image>
						</view>
						<!--线-->
						<image class="axis-loop-line2" :class="{'last-line2':item[1].last}"
							src="/pages/user/static/jjdl/axis_line5.png" mode="aspectFill"></image>
						<!-- 小飞机 -->
						<image v-if="item[1].status == 1&&!item[1].last" class="plane plane-trans05"
							src="/pages/user/static/jjdl/plane.png" mode="aspectFill"></image>
					</view>
				</block>
			</block>
			<!-- 单个 -->
			<block v-else>
				<view class="axis-one-box" :class="{'one-not-active':given_01.status == 0}">
					<!--城市图片-->
					<view class="axis-one-city-icon">
						<van-image width="444rpx" height="300rpx" :src="given_01.image" radius="13px" fit="cover"
							lazy-load use-loading-slot>
							<van-loading slot="loading" type="spinner" size="20" vertical />
						</van-image>
					</view>
					<!--城市-->
					<view class="axis-city">
						<van-icon name="location" />{{given_01.city}}
					</view>
				</view>
			</block>
		</view>

		<!-- 操作按钮 -->
		<view class="jsdl-box">
			<view class="jsdl-btn" @click="speedLight">
				<van-icon name="play-circle-o" size="30" />
				<text v-if="!isLoading" class="jsdl-btn-text">加速解锁</text>
				<van-loading color="#ffffff" v-else />
			</view>
			<view class="watch-num">
				{{ (surplus_num <= 0) ? '今日次数已用完' : '3倍速度解锁，每日1次'}}
			</view>
		</view>
		<!-- 次数用完了 -->
		<period-popup ref="periodPopup" @goLightUp="goHomeLightUp" />
		<!-- 城市点亮 -->
		<!-- <city-popup ref="cityPopup" @speed="speed" @popupClose="popupClose"/> -->
		<!-- 恭喜点亮的三个勋章 -->
		<light-city-dialog ref="lightCityDialog" @lightCityClose="lightCityClose" />
		<!-- 勋章弹窗 -->
		<medal-popup ref="medalShare" @share="medalShare" @close="medalShareClose" />
		<!-- 隐私协议的组件 -->
		<privacy ref="privacy"></privacy>
	</view>
</template>

<script>
	import {
		getNavbarData
	} from '@/components/xhNavbar/xhNavbar.js'
	import {
		getMedalCity,
		begin,
		finish2
	} from '@/api/modules/home.js'
	import {
		setTwoDimensionalArray
	} from '@/utils/index.js'
	import periodPopup from '@/components/periodPopup.vue'
	import lightCityDialog from './lightCityDialog.vue'
	import medalPopup from '@/components/popupWindow/medalPopup.vue'
	import {
		RewardedVideoAd
	} from '@/utils/index.js'
	import {
		mapActions,
		mapGetters
	} from 'vuex'
	import {
		getUserLocation
	} from '@/utils/getUserLocation.js'
	//定位参数
	let _loaction = null;
	export default {
		components: {
			periodPopup,
			// cityPopup,
			medalPopup,
			lightCityDialog
		},
		data() {
			return {
				navBarConfig: {
					navBarHeight: 0,
					statusBarHeight: 0, //状态栏高度
					menuWidth: 0
				},
				medal_id: 1,
				given_01: null,
				given_02: null,
				given_03: null,
				list: [],
				medal: {
					prop: 0
				},
				isLoading: false,
				watchData: {
					// watchId:null,
					cityData: null,
					last: false //如果是最后一个，城市点亮后，弹起勋章
				},
				noLightUpCityNum: 0,
				isOneChild: false,
				showMask: false,
				surplus_num: 0, // 剩余的点亮次数
				adunitId: this.common.adunitId.unlockCity,
				videoAdObject: null, // 视频对象
			}
		},
		onLoad(option) {
			//重置
			_loaction = null
			//获取导航栏数据
			getNavbarData().then(res => {
				this.navBarConfig = res
			});
			this.medal_id = option.medal_id;
			this.getData(false);

			// 视频的初始化
			this.videoAdCreate();
		},
		onShow() {
			// 隐私协议判断
			this.$refs.privacy.LifetimesShow();
		},
		onUnload() {
			this.videoAdObject.destroy();
		},
		onPageScroll(e) {
			let {
				scrollTop
			} = e
			this.showMask = scrollTop > 50
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		methods: {
			...mapActions({
				getUserInfo: 'user/getUserInfo'
			}),
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
						adUnitId: this.adunitId,
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
							this.finishShow();
						} else {
							this.isLoading = false;
							// 播放中途退出，进行提示
							wx.showToast({title: '未完整观看视频不能获取奖励哦', icon: 'none'})
						}
					});
				}
			},
			// 视频播放完正常关闭
			finishShow() {
				let params = {}
				if (_loaction) {
					params = _loaction;
				}
				finish2(params).then(res => {
					this.isLoading = false;
					if (res.data) {
						// 剩余的勋章
						if (this.noLightUpCityNum <= 3) {
							this.$refs.medalShare.showTime({
								medalImage: this.medal.image,
								isLightUp: true,
								province: this.medal.province,
								type: 0,
								love: this.medal.love || 0,
								reward_love: this.medal.reward_love || 0,
								city_num: this.medal.city_num || 0,
								user_prop: this.medal.user_prop || 0.25
							});
						} else {
							const data = res.data;
							data.medal['oldProp'] = this.medal.prop;
							this.$refs.lightCityDialog.popupShow(data);
						}
						//更新用户信息
						this.getUserInfo();
					}
				}).catch(err => {
					this.isLoading = false
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
			backHome() {
				uni.navigateBack({
					fail(e) {
						uni.reLaunch({
							url: '/pages/tabBar/home/index'
						})
					}
				})
			},
			getData(showMedal) {
				getMedalCity({
					medal_id: this.medal_id
				}).then(res => {
					if (res.code == 1) {
						let {
							list,
							medal,
							watch
						} = res.data;
						this.medal = medal;
						this.surplus_num = Number(watch.surplus_num);
						if (list.length > 1) {
							this.given_01 = list[0] || null
							this.given_02 = list[1] || null
							this.given_03 = list[2] || null
							let temp = list.length > 3 ? list.slice(3) : []
							if (temp[temp.length - 1]) {
								temp[temp.length - 1].last = true
							}
							this.list = setTwoDimensionalArray(temp, 2)
						} else {
							this.given_01 = list[0]
							this.given_02 = null
							this.given_03 = null
							this.list = null
							this.isOneChild = true
						}
						//总条数
						let size = list.length - 1;
						let noLightUpCityNum = 0;
						list.map((item) => {
							if (!item.status) noLightUpCityNum++;
						});
						this.noLightUpCityNum = noLightUpCityNum;
						/*找出第一个未点亮的城市*/
						for (let i = 0; i < list.length; i++) {
							if (!list[i].status) {}
							let item = list[i]
							if (item.status == 0) {
								this.watchData.cityData = item
								this.watchData.last = size === i
								break;
							}
						}
						/*显示勋章弹窗*/
						if (showMedal) {
							this.$refs.medalShare.showTime({
								medalImage: medal.image,
								isLightUp: true,
								province: medal.province,
								type: 0,
								love: medal.love || 0,
								reward_love: medal.reward_love || 0,
								city_num: medal.city_num || 0,
								user_prop: medal.user_prop || 0.25
							});
						}
					}
				})
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
				} = data
				this.$router.navigateTo({
					url: `/pages/user/medal/index?type=${this.tabIndex}&cityAllNum=${cityAllNum}&date=${date}&medalIcon=${medalIcon}&nextTarge=${nextTarge}&province=${province}&rate=${rate}`
				});
			},
			speedLight() {
				wx.reportEvent("click_accelerationlighting", {
					authorized_or_not: 1
				});
				if(this.surplus_num <= 0){
					this.$refs.periodPopup.popupShow();
					return;
				}
				//防止多次点击
				if (this.isLoading) return;

				this.isLoading = true
				/*第一次*/
				if (this.userInfo.city_num == 0) {
					getUserLocation().then(res => {
						let {
							longitude,
							latitude
						} = res.data
						_loaction = {
							longitude,
							latitude
						}
						this.videoPlay();
					}).catch(res => {
						this.isLoading = false
					});
					return;
				}
				/*正常情况*/
				this.videoPlay();
			},
			goHomeLightUp() {
				uni.reLaunch({
					url: '/pages/tabBar/home/index?type=showLightMode'
				});
			},
			lightCityClose() {
				/*刷新数据*/
				this.getData(this.watchData.last);
			},
			medalShareClose() {
				this.getData(false);
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
	}

	.currently-lit {
		.top-box {
			width: 100%;
			height: 548rpx;
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
			font-size: 0;
		}

		.head-bg {
			width: 100%;
			height: 548rpx;
		}

		.stage {
			width: 410rpx;
			height: 250rpx;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: -80rpx;
		}

		.light {
			position: absolute;
			left: 0;
			top: 0;
			width: 588rpx;
			height: 588rpx;
			opacity: 0.72;
			z-index: 1;
		}

		.total-box {
			position: absolute;
			bottom: -205rpx;
			left: 0;
			width: 100%;
			height: 360rpx;
			font-size: 0;
		}

		.total-box-title {
			font-size: 24rpx;
			font-weight: 400;
			color: #9a3510;
			position: absolute;
			left: 50rpx;
			top: 150rpx;
		}

		.total-box-bg {
			width: 100%;
			height: 360rpx;
		}

		.total-list {
			position: absolute;
			left: 0;
			top: 0;
			box-sizing: border-box;
			width: 100%;
			padding: 200rpx 46rpx 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.total-list-item {
			position: relative;
			padding-left: 68rpx;
			text-align: center;
		}

		.tli-icon {
			width: 56rpx;
			height: 56rpx;
			position: absolute;
			left: 0;
			top: 50%;
			transform: translateY(-50%);
		}

		.tli-name {
			font-size: 24rpx;
			font-weight: 700;
			color: #000018;
		}

		.tli-value {
			font-size: 36rpx;
			font-weight: 700;
			color: #e3001b;
		}

		.medals-being-lit {
			width: 266rpx;
			height: 266rpx;
			position: absolute;
			border-radius: 50%;
			left: 50%;
			bottom: 75rpx;
			transform: translateX(-50%);
			background-image: linear-gradient(180deg, #FFD690, #FF8902);
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.mbl-box {
			position: relative;
			width: 256rpx;
			height: 256rpx;
			overflow: hidden;
			border-radius: 50%;
			font-size: 0;
			-webkit-backface-visibility: hidden;
			-webkit-transform: translate3d(0, 0, 0);
		}

		.mbl-icon {
			width: 256rpx;
			height: 256rpx;
			border-radius: 50%;
		}

		.water {
			position: absolute;
			height: 256rpx;
			bottom: 0%;
			left: 100%;
			transform: translateX(-100%);
			animation: waterAnim 5s infinite linear alternate;
		}

		.mbl-progress {
			position: absolute;
			top: 20rpx;
			right: 0;
			width: 76rpx;
			height: 36rpx;
			background-image: linear-gradient(180deg, #ff7408, #ffb301);
			border: 2rpx solid #ff9518;
			background-color: #FF7507;
			border-radius: 14px;
			font-size: 24rpx;
			font-weight: 700;
			color: #ffffff;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.bg-title {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 90rpx;
			z-index: 10;
		}

		.axis-box {
			// position: absolute;
			// top: 700rpx;
			// bottom: 0;
			// left: 0;
			// width: 100%;
			// box-sizing: border-box;
			// overflow: hidden;
			margin-top: 548rpx;
			padding-bottom: 300rpx;
			position: relative;
		}

		.axis-box-bg {
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			overflow: hidden;
			width: 100%;
		}

		.axis-01-box {
			position: relative;
			z-index: 1;
			height: 420rpx;
			box-sizing: border-box;
			padding-top: 82rpx;
		}

		.axis-city {
			width: 152rpx;
			height: 58rpx;
			background-color: #ffe0b9;
			border: 2rpx solid #ff7507;
			border-radius: 16px;
			font-size: 26rpx;
			font-weight: 400;
			color: #ff7507;
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			z-index: 1;
		}

		.ac-trans01 {
			position: absolute;
			top: 82rpx;
			left: 336rpx;
			z-index: 1;
		}

		.axis-city-icon {
			padding: 15rpx 24rpx 30rpx;
			border: 2rpx dashed #ff7507;
			border-radius: 13px;
			background-color: #ffffff;
			position: relative;
			z-index: 1;

			&::after {
				content: '';
				position: absolute;
				width: 26rpx;
				height: 44rpx;
				background-color: #ffe0b9;
				left: 50%;
				top: 0;
				transform: translate(-50%, -40%);
			}
		}

		.aci-trans01 {
			position: absolute;
			z-index: 1;
			top: 89rpx;
			left: 150rpx;
			transform: rotate(30deg);
			transform-origin: left top;
		}

		.axis-line1 {
			width: 110rpx;
			height: 364rpx;
			position: absolute;
			top: 144rpx;
			left: 350rpx;
		}

		.axis-02-box {
			position: relative;
			height: 340rpx;
			z-index: 1;
		}

		.ac-trans02 {
			position: absolute;
			top: 50rpx;
			left: 224rpx;
			z-index: 1;
		}

		.axis-line2 {
			width: 140rpx;
			height: 174rpx;
			position: absolute;
			top: 90rpx;
			left: 200rpx;
		}

		.aci-trans02 {
			position: absolute;
			z-index: 1;
			top: 0rpx;
			right: 140rpx;
			transform: rotate(-30deg);
			transform-origin: right top;
		}

		.axis-03-box {
			position: relative;
			height: 318rpx;
			z-index: 1;
			margin-top: -50rpx;
		}

		.ac-trans03 {
			position: absolute;
			top: -40rpx;
			left: 60rpx;
			z-index: 1;
		}

		.axis-line3 {
			width: 338rpx;
			height: 232rpx;
			position: absolute;
			top: 19rpx;
			left: 188rpx;
		}

		.aci-trans03 {
			position: absolute;
			z-index: 1;
			top: 0rpx;
			left: 30rpx;
			transform: rotate(-25deg);
			transform-origin: right top;
		}

		.axis-loop01-box {
			position: relative;
			height: 332rpx;
			z-index: 1;
			margin-top: -120rpx;
		}

		.ac-loop-trans01 {
			position: absolute;
			top: 8rpx;
			right: 104rpx;
			z-index: 1;
		}

		.axis-loop-line1 {
			width: 352rpx;
			height: 370rpx;
			position: absolute;
			top: 14rpx;
			right: 219rpx;
		}

		.aci-loop-trans01 {
			position: absolute;
			z-index: 1;
			top: 120rpx;
			right: 70rpx;
			transform: rotate(-5deg);
			transform-origin: right top;
		}

		.axis-loop02-box {
			position: relative;
			height: 356rpx;
			z-index: 1;
			margin-top: -20rpx;
		}

		.ac-loop-trans02 {
			position: absolute;
			top: 0;
			left: 40rpx;
			z-index: 1;
		}

		.axis-loop-line2 {
			width: 320rpx;
			height: 204rpx;
			position: absolute;
			top: 70rpx;
			left: 208rpx;
		}

		.aci-loop-trans02 {
			position: absolute;
			z-index: 1;
			top: 50rpx;
			left: 25rpx;
			transform: rotate(-15deg);
			transform-origin: right top;
		}

		.not-active {

			.axis-city,
			.axis-city-icon,
			.axis-loop-line2,
			.axis-loop-line1,
			.axis-line1,
			.axis-line2,
			.axis-line3 {
				filter: grayscale(1);
			}

			&::after {
				filter: grayscale(1);
			}
		}

		.last-line2 {
			width: 100rpx;
		}

		.last-line1 {
			right: 190rpx;
			top: -20rpx;
			width: 160rpx;
		}

		.jsdl-box {
			height: 218rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			position: fixed;
			z-index: 1;
			bottom: 0;
			left: 0;
			width: 100%;
			background-color: rgba(255, 247, 234, 1);
		}

		.jsdl-btn {
			width: 480rpx;
			height: 100rpx;
			background-image: linear-gradient(180deg, #ffad08, #f58631);
			border: 4rpx solid #fedbce;
			border-radius: 27px;
			font-size: 32rpx;
			font-weight: 700;
			color: #ffffff;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.jsdl-btn-text {
			margin-left: 20rpx;
		}

		.watch-num {
			font-size: 28rpx;
			font-weight: 400;
			text-align: center;
			color: #7f7f7f;
		}

		.axis-one-box {
			padding-top: 120rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.axis-city {
				margin-top: 50rpx;
			}

			.axis-one-city-icon {
				padding: 35rpx 42rpx 56rpx;
				border: 2rpx dashed #ff7507;
				border-radius: 13px;
				background-color: #ffffff;
				position: relative;
				z-index: 1;
			}
		}

		.one-not-active {
			.axis-one-city-icon {
				border-color: #A3A2A8;
			}

			.van-image {
				filter: brightness(0.7);
			}

			.axis-city {
				filter: grayscale(1);
			}
		}

		.plane {
			width: 36rpx;
			height: 36rpx;
			position: absolute;
			z-index: 10;
		}

		.plane-trans01 {
			left: 406rpx;
			bottom: 0;
			transform: rotate(25deg);
		}

		.plane-trans02 {
			left: 214rpx;
			bottom: 100rpx;
			transform: rotate(30deg);
		}

		.plane-trans03 {
			left: 448rpx;
			bottom: 95rpx;
			transform: rotate(-75deg);
		}

		.plane-trans04 {
			left: 316rpx;
			bottom: 150rpx;
			transform: rotate(50deg);
		}

		.plane-trans05 {
			left: 406rpx;
			bottom: 154rpx;
			transform: rotate(-60deg);
		}
	}
</style>
