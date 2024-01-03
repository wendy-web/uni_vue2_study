<template>
	<view class="container">
		<view class="dizzy-box">
			<!-- 背景 -->
			<image class="img-nav" src="/static/home/home_city_nav.png"></image>
			<!-- sticky -->
			<view class="tab-box-bg" v-show="tabIndex == 2"></view>
			<view class="tab-box">
				<van-tabs :active="tabIndex" @change="tabChange" color="#F55B21" title-active-color="#F55B21"
					title-inactive-color="#676767">
					<van-tab title="最近点亮" :name="0"></van-tab>
					<van-tab title="全民周榜" :name="1"></van-tab>
					<van-tab title="城市总榜" :name="2"></van-tab>
				</van-tabs>
			</view>
			<!-- <van-sticky id="vanSticky" :offset-top="15">
				<van-tabs :active="tabIndex" @change="tabChange" color="#F55B21" title-active-color="#F55B21"
					title-inactive-color="#676767">
					<van-tab title="最近点亮" :name="0"></van-tab>
					<van-tab title="全民总榜" :name="1"></van-tab>
					<van-tab title="城市总榜" :name="2"></van-tab>
				</van-tabs>
			</van-sticky> -->
		</view>
		<view class="content-wrap">
			<!-- 最近点亮 -->
			<recently-rank ref="recentlyRank" v-if="tabIndex == 0"></recently-rank>
			<!-- 全民总榜 -->
			<whole-rank ref="wholeRank" v-if="tabIndex == 1"></whole-rank>
			<!-- 城市总榜 -->
			<city-rank ref="cityRank" v-if="tabIndex == 2"></city-rank>
		</view>
		<!-- 隐私协议的组件 -->
		<privacy ref="privacy"></privacy>
	</view>
</template>

<script>
	import recentlyRank from './content/recentlyRank.vue'
	import wholeRank from './content/wholeRank.vue'
	import cityRank from './content/cityRank.vue'
	export default {
		components: {
			recentlyRank,
			wholeRank,
			cityRank
		},
		data() {
			return {
				tabIndex: 0, //默认城市总榜
			}
		},
		onShow() {
			// 隐私协议判断
			this.$refs.privacy.LifetimesShow();
		},
		methods: {
			tabChange(e) {
				this.tabIndex = e.detail.name;
				setTimeout(() => {
					switch (this.tabIndex) {
						// case 0:
						// 	break;
						case 1:
							wx.reportEvent("click_nationallist", {
							    authorized_or_not:1
							})
							break;
						case 2:
							wx.reportEvent("click_citieslist", {
								authorized_or_not:1
							})
							this.initCityRank()
							break;
					}
				}, 0)

			},
			initRecentRank(){
				// this.$refs.recentlyRank.mescroll.myScrollTo(0,300);
				// this.$refs.recentlyRank.initData();
			},
			initWholeRank(){
				// this.$refs.wholeRank.mescroll.myScrollTo(0,300);
				// this.$refs.wholeRank.initData();
			},
			initCityRank() {
				if (this.$refs.cityRank) this.$refs.cityRank.initHotMap();
				// this.$refs.cityRank.mescroll.myScrollTo(0,300)
				// this.$refs.cityRank.initData();
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #efefef;
	}
	.container {
		position: relative;
		box-sizing: border-box;

		.tab-box-bg {
			height: 110rpx;
			background-color: #ffffff;
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			border-radius: 24rpx 24rpx 0 0;
			z-index: 2;
		}

		.tab-box {
			margin: 0 8rpx;
			box-sizing: border-box;
			width: 100%;
			height: 110rpx;
			background-color: #ffffff;
			border-radius: 48rpx 48rpx 0 0;
			overflow: hidden;
			z-index: 3;
		}

		.content-wrap {
			position: fixed;
			top: 170rpx;
			width: 100%;
			height: calc(100vh - 170rpx);
			overflow: auto;
			background-color: #efefef;
			box-sizing: border-box;
		}

		.dizzy-box {
			background-color: #efefef;
			box-sizing: border-box;
			z-index: 999;
			position: sticky;
			top: 0px;
			height: 170rpx;
			display: flex;
			align-items: flex-end;

			.img-nav {
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				height: 150rpx;
				width: 100%;
			}

		}
	}

	.van-tabs {
		height: 100%;
		background-color: #ffffff;
	}

	.van-tabs__scroll {
		border-radius: 24rpx 24rpx 0 0 !important;
		background-color: #ffffff !important;
	}

	.van-sticky {
		background-color: #fff5e8 !important;
	}
</style>
