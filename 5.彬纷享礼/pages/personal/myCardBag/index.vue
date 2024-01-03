<template>
	<view class="my-card-bag">
		<privacy-popup></privacy-popup>
		<!-- 背景 -->
		<view class="mcb-bg" :class="type==0?'mcb-hn-bg':'mcb-zm-bg'" :style="{height:navHeight+'px'}"></view>
		<!-- 自定义导航栏 -->
		<xh-navbar title="换购券" navberColor="transparent" titleAlign="titleCenter"
			leftImage="../../static/images/left_arrow.png" />
		<!-- 红牛战马切换 -->
		<type-tabs :currTabs="type" @tabsChange="typeChange" :navHeight="navHeight" />
		<!-- 头部导航 -->
		<home-tabs :currTabs="currTabs" :type="type" @tabsChange="tabsChange" :navHeight="navHeight" />
		<!-- 数据展示 start-->
		<div class="page-list" :style="{'padding-top':navHeight+'px'}" v-if="isShowList">
			<swiper class="page-list-box" :current="currTabs" @change="swiperChange">
				<swiper-item v-for="(tab,i) in tabs" :key="i">
					<mescroll-item ref="mescrollItem" :type="type" :isCheckAll="isCheckAll" :currTabs="i"
						@checkback="checkback" @directExchange="directExchange" @refreshCardPackage="refreshCardPackage"
						@xhNotify="xhNotify" @showSubmitBar="showSubmitBar">
					</mescroll-item>
				</swiper-item>
			</swiper>
		</div>
		<!-- 提交tools start-->
		<view class="xh-submit-bar" v-if="currTabs==0&&isShowSubmitBar">
			<!-- 数据展示 end-->
			<view class="operat-instructions" @click="gofavoredMovie">
				<image class="operat-instructions-icon" src="../static/operat-icon.png" mode="aspectFill"></image>使用说明
			</view>
			<view class="xh-submit-bar-body">
				<xh-check class="service" checkedClass="checked-select" label="全选" labelClass="submit-check-label"
					labelColor="#333" :checked="isCheckAll" @change="checkAll" />
				<view v-if="selectedNum > 0">
					<text class="selected-num-text">
						合计:<text class="selected-num-red">{{selectedNum}}</text>(张)
					</text>
					<!-- 直接兑换 -->
					<van-button :disabled="selectedNum === 0" color="linear-gradient(to right, #E71919, #A31015)"
						@click="exchange" custom-style="border-radius:0;padding-right:60rpx;padding-left:60rpx;">去使用
					</van-button>
				</view>
			</view>
			<view class="van-submit-bar__safe"></view>
		</view>
		<!-- 提交tools end-->
		<!-- 确认兑换弹窗 -->
		<confirm-exchange ref="confirmExchange" />
		<!-- 战马兑换确认 -->
		<zm-confirm-exchange ref="zmConfirmExchange" />
		<!-- 消息提示 -->
		<xh-notify ref="xhNotify" />
		<!-- 自定義廣告 -->
		<!-- <user-guide ids="myCardBag" ref="userGuide" /> -->
		<!-- 换购操作弹窗 -->
		<operat ref="OID" />
	</view>
</template>
<script>
	import homeTabs from './homeTabs';
	import confirmExchange from './confirmExchange';
	import zmConfirmExchange from './zmModule/zmConfirmExchange.vue';
	import mescrollItem from './mescroll-item';
	import operat from './operat.vue';
	import typeTabs from './typeTabs.vue'
	import {
		getNavbarData
	} from '@/utils/xhNavbar.js';
	// import {
	// 	getMyCardBadAd
	// } from '@/utils/auth.js';
	import {
		PLAQUEADVERTISING
	} from '@/utils/index.js'; //插屏广告
	let _PLAQUEADVERTISING = null; //插屏广告管理
	let _selectAll = [];
	// let _P_AD = null;
	export default {
		data() {
			return {
				tabs: [{
					name: '未使用'
				}, {
					name: '已使用'
				}, {
					name: '已过期'
				}],
				type: 0,
				currTabs: 0, //当前tab下标
				isCheckAll: false, //是否全选
				selectedNum: 0, //未兑换选中数据
				isLoading: false,
				isShowSubmitBar: true,
				navHeight: 0,
				isShowList: false
			};
		},
		components: {
			homeTabs,
			confirmExchange,
			zmConfirmExchange,
			mescrollItem,
			operat,
			typeTabs
		},
		onLoad(option) {
			_PLAQUEADVERTISING = PLAQUEADVERTISING({
				onLoadBack: () => {
					// _P_AD = setTimeout(() => {
					// getMyCardBadAd() % 2 === 0 ? this.$refs.userGuide.show() : _PLAQUEADVERTISING
					// 	.play();
					_PLAQUEADVERTISING.play();
					// }, 666)
				}
			}); //插屏广告管理
			//接受跳转参数
			if (option.currTabs) this.currTabs = Number(option.currTabs);
			if (option.type) this.type = Number(option.type);
			this.isShowList = true
			//插屏广告初始化
			_PLAQUEADVERTISING.init('adunit-ec6269df22b00e98');
			/*导航栏高度*/
			getNavbarData().then(res => {
				let {
					navBarHeight,
					statusBarHeight
				} = res
				this.navHeight = navBarHeight + statusBarHeight
			})
		},
		methods: {
			//是否显示底部tabs
			showSubmitBar(flag) {
				this.isShowSubmitBar = flag
			},
			//兑换卷类型切换
			tabsChange(index) {
				this.currTabs = index;
			},
			typeChange(index) {
				this.$refs.mescrollItem.forEach(function(item) {
					item.clearData()
				})
				setTimeout(() => {
					this.type = index
					this.currTabs = 0;
				}, 0)
			},
			//滑动切换
			swiperChange(data) {
				this.currTabs = data.detail.current; //切换tab
			},
			//待兑换选中回调
			checkback(data) {
				this.isCheckAll = data.isCheckAll;
				_selectAll = data.checkData;
				this.selectedNum = _selectAll.length;
			},
			//刷新列表
			refreshCardPackage() {
				// this.$refs.mescrollItem[0].downCallback();
				// this.$refs.mescrollItem[1].downCallback();
				// this.$refs.mescrollItem[2].downCallback();
				this.$refs.mescrollItem.forEach(function(item) {
					item.downCallback()
				})
			},
			checkAll() { //全选
				this.$refs.mescrollItem[0].checkAll();
			},
			//直接兑换
			directExchange(data) {
				if (this.type == 0) {
					this.$refs.confirmExchange.show([{
						pid: data.id,
						pull_qr: data.pull_qr
					}]);
				} else {
					this.$refs.zmConfirmExchange.show([{
						pid: data.id,
						pull_qr: data.pull_qr
					}]);
				}

			},
			//开始兑换
			exchange() {
				if (this.type == 0) {
					//兑换确认
					this.$refs.confirmExchange.show(_selectAll.map(function(item) {
						return {
							pid: item.id,
							pull_qr: item.pull_qr
						};
					}));
				} else {
					//兑换确认
					this.$refs.zmConfirmExchange.show(_selectAll.map(function(item) {
						return {
							pid: item.id,
							pull_qr: item.pull_qr
						};
					}));
				}

			},
			//消息提示
			xhNotify(data) {
				this.$refs.xhNotify.show(data);
			},
			//操作提示
			gofavoredMovie() {
				// this.$go({
				// 	url: '/pages/personal/favoredMovie/index'
				// });
				if (this.type == 0) {
					this.$refs.OID.show();
				} else {
					uni.previewImage({
						current: 'https://file.y1b.cn/public/img/2023/zm_rm_02.png',
						urls: ['https://file.y1b.cn/public/img/2023/zm_rm_02.png'] // 需要预览的图片http链接列表
					});
				}
			}
		},
		onUnload() {
			// _PLAQUEADVERTISING.destroy();
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #F5F5F5;
	}

	// .not-converted-list {
	// 	padding-bottom: 74px;
	// }

	.mcb-bg {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
	}

	.mcb-hn-bg {
		background-color: #E60213;
	}

	.mcb-zm-bg {
		background-image: linear-gradient(4deg, #ff6308 3%, #f8bc14 100%);
	}


	.page-list {
		// position: fixed;
		// width: 100%;
		// top: 80rpx;
		// bottom: 0;
		// height: auto;
		// z-index: 0;
		position: fixed;
		overflow: hidden;
		top: 180rpx;
		bottom: 0;
		left: 0;
		width: 100%;
		box-sizing: border-box;
		height: auto;
	}

	.page-list-box {
		height: 100%;
	}


	.page-swiper-item {
		height: 100%;
		-webkit-overflow-scrolling: touch;
	}

	.van-submit-bar__safe {
		height: constant(safe-area-inset-bottom);
		height: env(safe-area-inset-bottom)
	}

	.my-card-bag {

		/*操作说明*/
		.operat-instructions {
			text-align: center;
			color: #FC534D;
			font-size: 24rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			z-index: 1000;
			background-color: #F5F5F5;
			line-height: 30px;
		}

		.operat-instructions-icon {
			width: 32rpx;
			height: 32rpx;
			margin-right: 10rpx;
		}

		/*操作说明*/
		/*底部提交tools start*/
		.xh-submit-bar {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			background-color: #FFFFFF;
			z-index: 1;
		}

		.submit-check-label {
			margin-left: 10rpx;
			font-size: 28rpx;
		}

		.xh-submit-bar-body {
			display: flex;
			align-items: center;
			height: 50px;
			justify-content: space-between;
		}

		.selected-num-text {
			font-size: 28rpx;
			color: #333;
			margin-right: 30rpx;
		}

		.selected-num-red {
			color: #E60E1E;
		}

		.service {
			padding: 0 RPX(11) 0 RPX(33);

			.xh-check {
				font-size: RPX(16);
				color: rgba(199, 10, 27, 1);
			}

		}

		/*底部提交tools end*/
		.its-the-end {
			text-align: center;
			font-size: RPX(12);
			color: #999;
			line-height: RPX(30);
			margin-top: RPX(-20);
		}
	}
</style>