<template>
	<view class="xh-shop-list">
		<privacy-popup></privacy-popup>
		<xh-navbar title="附近换购店铺列表" navberColor="#B31212" titleAlign="titleCenter"
			leftImage="../../static/images/left_arrow.png" />
		<!-- logo header -->
		<view class="logo-header">
			<image class="logo" src="../static/map/logo.png"></image>
		</view>
		<!-- 战马红牛切换 -->
		<type-tabs :currTabs="type" @tabsChange="tabsChange" />
		<!-- 店铺列表 -->
		<view class="shop-box" :style="{'padding-top':navHeight+'px'}">
			<view class="shop-box-body">
				<!-- mytab -->
				<view class="shop-tabs">
					<view class="shop-tab-item" :class="{'active':tabIndex === 0}" @click="tabItemChange(0)">按推荐星级排序
					</view>
					<view class="shop-tab-item" :class="{'active':tabIndex === 1}" @click="tabItemChange(1)">按距离排序
					</view>
					<view class="divider-line"></view>
				</view>
				<scroll-view :scroll-top="scrollTop" @scroll="scroll" scroll-with-animation scroll-y class="shop-list">
					<!-- shop-item -->
					<view class="shop-item" v-for="item in list" :key="item.id">
						<!-- 上面部分 -->
						<view class="shop-item-top">
							<view class="sit-left">
								<image class="shop-icon" src="../static/map/shop_icon.png"></image>
								<text class="shop-name">{{item.shop_name}}</text>
								<!-- 红太阳 -->
								<image class="icon-img" v-if="item.bottom_num === 0" src="../static/map/red_sun.png">
								</image>
								<!-- 太阳 -->
								<image class="icon-img" v-else-if="item.bottom_num > -1" src="../static/map/sun.png">
								</image>
								<!-- 月亮 -->
								<image class="icon-img" v-if="item.alias_id" src="../static/map/moon.png"></image>
								<van-rate :value="item.gradeNumber" allow-half :size="15" :count="3"
									icon="https://file.y1b.cn/public/img/bfxn/202105/stars.png" color="#FB7A06"
									void-color="#AFAEAE" readonly />
							</view>
							<van-button @click="openLocation(item)" class="sit-right" size="small" color="#B31212"
								type="default">前往换购</van-button>
						</view>
						<!-- 下面部分 -->
						<view class="shop-item-bottom">
							<view class="sib-left">
								<image class="location-icon" src="../static/map/location.png"></image>
								<view class="shop-address">{{item.addressText}}</view>
								<view class="shop-address">{{item.shopId}}</view>
							</view>
							<view class="sib-right">{{item.distText}}</view>
						</view>
					</view>
					<!-- 没有数据 -->
					<image v-if="isNoData" class="empty-icon"
						src="https://file.y1b.cn/public/img/bfxn/202201/no-data.png" mode="widthFix" />
				</scroll-view>
			</view>
		</view>
		<!-- 消息提示 -->
		<xh-notify ref="xhNotify" :isCustom="true" />
	</view>
</template>

<script>
	import {
		getUserLocation
	} from '@/utils/getUserLocation.js';
	import {
		getnearby
	} from '@/api/homeApi.js';
	import {
		baseUrl
	} from '@/api/http/xhHttp.js';
	import {
		getNavbarData
	} from '@/utils/xhNavbar.js';
	import typeTabs from './typeTabs.vue'

	export default {
		components: {
			typeTabs
		},
		data() {
			return {
				list: [],
				type: 0,
				tabIndex: 0,
				scrollTop: 0,
				isNoData: false,
				navHeight: 0
			};
		},
		onLoad(o) {
			//类型
			this.type = Number(o.type)

			this.getData(0)

			getNavbarData().then(res => {
				let {
					navBarHeight,
					statusBarHeight
				} = res
				this.navHeight = navBarHeight + statusBarHeight
			})

		},
		methods: {
			tabsChange(val) {
				this.type = val
				this.getData(0);
			},
			scroll(e) {
				this.scrollTop = e.scrollTop;
			},
			tabItemChange(index) {
				if (index === this.tabIndex) return;
				this.scrollTop = 0;
				this.tabIndex = index;
				this.getData(index);
			},
			//导航指定商铺
			openLocation(data) {

				if (!data.l_latitude || !data.l_longitude) {
					return this.$refs.xhNotify.show({
						type: 'warning',
						message: '该商铺没有经纬度，无法前往',
						duration: 2000
					});
				}

				uni.openLocation({
					latitude: data.l_latitude - 0,
					longitude: data.l_longitude - 0,
					name: data.shop_name,
					address: data.address
				});
			},
			async getData(type) {

				let loction = await getUserLocation()

				let {
					latitude,
					longitude
				} = loction.data;

				this.list = [];
				this.isNoData = false;
				let res = await getnearby({
					latitude,
					longitude,
					type: this.type + 1
				})
				let result = res.data || [];

				//附近没店铺数据时提示用户
				if (result.length === 0) {
					this.$refs.xhNotify.show({
						type: 'warning',
						message: '抱歉您附近暂无可换购的商铺',
						duration: 2000
					});
					this.isNoData = true;
					return;
				}

				result.forEach(function(item) {
					//店铺级别
					if (item.star === 0) {
						item.gradeNumber = 0.5;
					} else {
						item.gradeNumber = item.star;
					}
					//距离
					if (item.dist > 1000) {
						item.distText = (item.dist / 1000).toFixed(2) + '公里';
					} else {
						item.distText = Math.round(item.dist) + '米';
					}
					//地址
					item.addressText = item.address;
					item.shopId = '(SID-' + item.id + ')';
				});

				this.sort(result, type);
			},
			sort(array, type = 0) {
				//距离排序
				if (type === 0) {
					array.sort(function(a, b) {
						return b.grade - a.grade;
					});
				}
				//数量多时，分块渲染，优化体验
				if (array.length > 20) {

					this.list = array.slice(0, 20);

					setTimeout(() => {
						this.list = this.list.concat(array.slice(20, array.length));
					}, 0);

				} else {
					this.list = array;
				}
			}
		},
		onUnload() {
			try {
				wx.removeStorageSync(baseUrl + '/api2/ctools/getnearby');
			} catch (e) {}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #EEEEEF;
	}

	.xh-shop-list {

		.logo-header {
			height: 131rpx;
			background-color: #B31212;
		}

		.logo {
			width: 146rpx;
			height: 131rpx;
			margin-left: 97rpx;
		}

		.shop-box {
			position: fixed;
			top: 231rpx;
			bottom: 26rpx;
			left: 20rpx;
			right: 20rpx;
			width: auto;
			height: auto;
			z-index: 1;
		}

		.shop-box-body {
			background-color: #FFFFFF;
			border-radius: 13px;
			height: 100%;
			display: flex;
			flex-direction: column;
		}

		.shop-tabs {
			display: flex;
			font-size: 29rpx;
			color: #252525;
			position: relative;
			justify-content: space-around;
			margin-bottom: 15rpx;
		}


		.shop-tab-item {
			padding-top: 50rpx;
			padding-bottom: 35rpx;
			text-align: center;
			position: relative;
		}

		.divider-line {
			height: 46rpx;
			width: 1px;
			background-color: #B5B5B5;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%) scaleX(0.5);
		}

		.active {
			color: #FB7A06;

			&::after {
				content: '';
				position: absolute;
				height: 1px;
				width: 100%;
				left: 0;
				top: 88rpx;
				background-color: #FB7A06;
			}
		}

		.shop-list {
			overflow: auto;
			position: relative;
			flex: 1;
		}

		.shop-item {
			padding-left: 25rpx;
			padding-right: 25rpx;
			padding-bottom: 22rpx;
			position: relative;
			margin-bottom: 15rpx;

			&::after {
				content: '';
				position: absolute;
				left: 25rpx;
				right: 25rpx;
				bottom: 0;
				height: 1px;
				transform: scaleY(0.5);
				background-color: #B5B5B5;
			}

			&:last-child::after {
				background-color: #FFFFFF;
			}
		}

		.shop-item-top {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.shop-item-bottom {
			display: flex;
			justify-content: space-between;
			margin-top: 15rpx;
		}

		.sit-left {
			display: flex;
			font-size: 26rpx;
			color: #FB7406;
			position: relative;
			padding-left: 22rpx;
			align-items: center;
		}

		.shop-icon {
			width: 22rpx;
			height: 20rpx;
			position: absolute;
			left: 0;
			top: 50%;
			transform: translateY(-50%);
		}

		.shop-name,
		.shop-address {
			margin-left: 10rpx;
			margin-right: 10rpx;
		}

		.shop-name {
			max-width: 160rpx;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.shop-address {
			overflow: hidden;
			word-break: break-all;
			white-space: nowrap;
			text-overflow: ellipsis;
		}

		.van-button--small {
			border-radius: 5px;
		}

		.sib-left {
			font-size: 24rpx;
			color: #797979;
			position: relative;
			padding-left: 22rpx;
			max-width: 60%;
		}

		.location-icon {
			width: 20rpx;
			height: 22rpx;
			position: absolute;
			left: 0;
			top: 5rpx;
		}

		.sib-right {
			color: #797979;
			font-size: 22rpx;
		}

		.empty-icon {
			width: 280rpx;
			height: 280rpx;
			position: absolute;
			left: 50%;
			top: 100rpx;
			transform: translateX(-50%);
		}

		.icon-img {
			width: 30rpx;
			height: 30rpx;
			margin-left: 8rpx;
		}

		.van-button__text {
			white-space: nowrap;
		}

	}
</style>