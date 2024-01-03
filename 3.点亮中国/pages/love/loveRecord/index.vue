<template>
	<view class="love-record">
		<view class="love-record-head">
			<view class="love-record-card">
				<view class="love-num">
					{{total.love}}
					<view class="unit">能量</view>
				</view>
				<view class="love-donate-num">
					累计捐献：{{total.donated_love}}
				</view>
				<!-- 頭像與愛心 -->
				<!-- <view class="user-info">
					<image class="user-icon image-round" :src="image" mode="aspectFill"></image>
					<view class="love-logo">
						<image class="love-icon" src="/static/home/love.png"></image>
						<image class="angel-wings" src="/static/home/angel_wings.png"></image>
					</view>
				</view> -->
				<!-- 背景图片 -->
				<image class="bg-love-record" src="/pages/love/static/bg_loveRecord.png" mode="aspectFill"></image>
			</view>
			<!-- 底部背景 -->
			<image class="arc-top" src="/pages/love/static/img_arc.png" mode="aspectFill"></image>
		</view>
		<!-- tab切换 -->
		<love-tabs :currTabs="tabIndex" @tabsChange="tabsChange"></love-tabs>
		<swiper class="love-record-box" :current="tabIndex" @change="swiperChange">
			<swiper-item v-for="item in tabs" :key="item.id">
				<mescroll-item ref="mescrollItem" :currTabs="item.id" :identity="type" @setTotal="setTotal" />
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import {
		getUserCity,
		getTeamCity
	} from '@/api/modules/home.js'
	import loveTabs from './loveTabs.vue'
	import mescrollItem from './mescroll-item.vue'
	export default {
		components: {
			loveTabs,
			mescrollItem
		},
		data() {
			return {
				type: 0,
				image: '',
				tabIndex: 0,
				total: {
					donated_love: 0,
					love: 0
				},
				tabs: []
			}
		},
		onShow() {
			this.$refs.privacy.LifetimesShow();
		},
		onLoad(o) {
			// this.type = o.type
			this.type = 0
			this.image = o.image
			uni.setNavigationBarTitle({
				title: o.type == 0 ? '我的能量' : '团队能量'
			})
			this.tabs = [{
				name: '捐献记录',
				id: 0
			}, {
				name: '获取记录',
				id: 1
			}]
		},
		methods: {
			setTotal(data) {
				this.total = data
			},
			tabsChange(e) {
				this.tabIndex = e
			},
			swiperChange(e) {
				this.tabIndex = e.detail.current; //切换tab
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff5e2;
	}

	.love-record {
		.love-record-head {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			background-color: #eeeeee;
			padding: 40rpx 40rpx 0;
			box-sizing: border-box;
			position: relative;

		}

		.love-record-card {
			height: 290rpx;
			background-color: #fff5e2;
			border-radius: 22px;
			position: relative;
			z-index: 1;

			.bg-love-record {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				z-index: -1;
			}
		}

		.love-num {
			padding-top: 45rpx;
			font-size: 78rpx;
			font-weight: 700;
			color: #f7304d;
			line-height: 114rpx;
			display: flex;
			align-items: baseline;
			justify-content: center;
		}

		.unit {
			font-size: 44rpx;
			font-weight: 400;
			color: #000018;
			position: relative;
			top: -3px;
		}

		.love-donate-num {
			font-size: 28rpx;
			font-weight: 400;
			color: #000018;
			line-height: 52rpx;
			text-align: center;
		}

		.love-record-box {
			position: fixed;
			top: 414rpx;
			left: 20rpx;
			right: 20rpx;
			width: auto;
			height: auto;
			bottom: 20rpx;
			font-size: 0;
			background-color: #fff;
			border-radius: 20px;
			box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.16);
		}

		.arc-top {
			width: 100%;
			height: 102rpx;
			position: absolute;
			bottom: 0;
			left: 0;
			z-index: 1;
		}

		.user-info {
			width: 255rpx;
			height: 74rpx;
			background-color: #a1bedc;
			border-radius: 0px 38px 38px 0px;
			position: absolute;
			top: 68rpx;
			font-size: 0;
			display: flex;
			align-items: center;
		}

		.user-icon {
			width: 74rpx;
			height: 74rpx;
			margin-left: 28rpx;
			margin-right: 20rpx;
		}

		.love-logo {
			position: relative;
			width: 122rpx;
			height: 62rpx;
			color: #FFFFFF;
			font-size: 24rpx;
		}

		.love-icon {
			height: 62rpx;
			width: 68rpx;
			position: absolute;
			left: 50%;
			top: -5rpx;
			margin-left: -34rpx;
			z-index: 1;
		}

		.angel-wings {
			width: 122rpx;
			height: 42rpx;
			position: absolute;
			left: 0;
			top: 0;
		}

	}
</style>
