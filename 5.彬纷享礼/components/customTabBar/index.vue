<template>
	<view class="nav" id="nav">
		<view class="nav_cont">
			<view v-for="(item, index) in navBarList" :key="item.id"
				:class="['nav_item', (currentIndex === index) && 'active']" @click="navbarHandle(item.pagePath)">
				<image class="nav_icon" :src="currentIndex == index ? item.icon_active : item.icon" mode="aspectFill">
				</image>
				<view class="nav_icon-point" v-if="isTabBarRedDot[item.key]"></view>
				<view class="nav_text">{{item.title}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from "vuex"
	export default {
		name: "customTabBar",
		props: {
			currentIndex: {
				type: Number,
				default: 0
			}
		},
		computed: {
			...mapGetters(['isTabBarRedDot'])
		},
		data() {
			return {
				navBarList: [{
						id: 0,
						key: 'home',
						pagePath: "/pages/tabBar/home/index",
						icon: '/static/tabsImg/personal.png',
						icon_active: `/static/tabsImg/personal_select.png`,
						title: "首页"
					},
					{
						id: 1,
						key: 'ttxl',
						pagePath: "/pages/tabBar/ttxl/index",
						icon: '/static/tabsImg/ttxl_icon.png',
						icon_active: '/static/tabsImg/ttxl_icon_select.png',
						title: "积分商城"
					},
					{
						id: 2,
						key: 'user',
						pagePath: "/pages/tabBar/personal/index",
						icon: '/static/tabsImg/home-icon.png',
						icon_active: '/static/tabsImg/home-select-icon.png',
						title: "个人中心"
					},
					{
						id: 3,
						key: 'service',
						pagePath: "/pages/tabBar/service/service",
						icon: '/static/tabsImg/customer.png',
						icon_active: '/static/tabsImg/customer_select.png',
						title: "客服中心"
					}
				]
			}
		},
		methods: {
			navbarHandle(url) {
				// const pageList = getCurrentPages();
				// const currentPageObj = pageList[pageList.length - 1];
				// const currentPage = '/' + currentPageObj.route;
				// debugger
				// if (url == currentPage) {
				// this.$emit('currentPage', url);
				// 	return;
				// }
				this.$switchTab({
					url
				});
			}
		},
		mounted() {
			const pageList = getCurrentPages();
			const currentPageObj = pageList[pageList.length - 1];
			this.$emit('currentPage', currentPageObj.route)
		}
	}
</script>

<style scoped lang="scss">
	.nav_icon-point {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 13rpx;
		height: 13rpx;
		background-color: red;
		border-radius: 50%;
		margin-left: 24rpx;
	}

	.nav {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 110rpx;
		line-height: 34rpx;
		font-size: 24rpx;
		background-color: #fff;
		z-index: 99;
		padding-bottom: constant(safe-area-inset-bottom);
		/* 兼容 IOS<11.2 */
		padding-bottom: env(safe-area-inset-bottom);

		/* 兼容 IOS>11.2 */
		.nav_cont {
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: space-around;
			align-items: center;
			border-top: 2rpx solid #e1e1e1;

			.nav_item {
				flex: 1;
				font-weight: 400;
				text-align: center;
				color: #333333;
				display: flex;
				flex-direction: column;
				align-items: center;
				position: relative;

				&.active {
					color: #EF2B20;
				}

				.nav_icon {
					width: 48rpx;
					height: 48rpx;
					display: block;
					margin-bottom: 4rpx;
					position: relative;

					&.unRead_icon::after {
						content: '';
						position: absolute;
						top: 0;
						right: 0;
						width: 20rpx;
						height: 20rpx;
						background-color: red;
						border-radius: 50%;
						margin-left: 5rpx;
					}
				}
			}
		}
	}
</style>