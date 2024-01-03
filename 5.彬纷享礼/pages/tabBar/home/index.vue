<template>
	<view class="home">
		<privacy-popup ref="privacyPopup"></privacy-popup>
		<!-- 头部导航 -->
		<home-tabs :currTabs="currTabs" @tabsChange="tabsChange" />
		<!-- 轮播 -->
		<view class="home-page-list nav_cont">
			<swiper :current="currTabs" @change="swiperChange">
				<!-- 新闻 -->
				<!-- <swiper-item>
					<news-list v-if="showbrand" :isShowAd="isShowAd"/>
				</swiper-item> -->
				<!-- 品牌 -->
				<swiper-item>
					<currency-list v-if="showactivity" :config="adData.A4.value" />
				</swiper-item>
				<!-- 热门活动 -->
				<swiper-item>
					<currency-list :isAd="isShowAd" :config="adData.A5.value" />
				</swiper-item>
			</swiper>
			<!-- 公众号引流 -->
		<xh-official-account customClass="official-account-home" eventName="followwoa_1"></xh-official-account>
		</view>

		<!-- 自定義廣告 -->
		<user-guide ref="userGuide" ids="home" :isNoJump="true" />
		
		<!-- 福利广告 -->
		<welfare-ppopup ref="welfarePpopup" :isCustom="true"></welfare-ppopup>
		<!-- 导航栏 -->
		<custom-tab-bar currentIndex="0" />
	</view>
</template>
<script>
	import homeTabs from './homeTabs';
	import currencyList from './currencyList';
	import customTabBar from '@/components/customTabBar/index.vue';
	import xhOfficialAccount from '@/components/xh-official-account.vue';
	// import newsList from './newsList';
	import {
		mapGetters,
		// mapActions
	} from 'vuex';
	import {
		getUserLocation
	} from "@/utils/getUserLocation.js"
	import {
		PLAQUEADVERTISING
	} from '@/utils/index.js'; //插屏广告
	let _PLAQUEADVERTISING = null; //插屏广告管理
	let _isOneP = 0;
	export default {
		data() {
			return {
				currTabs: 1,
				showbrand: false,
				showactivity: false
			};
		},
		computed: {
			...mapGetters(['adData', 'isShowAd'])
		},
		components: {
			homeTabs,
			currencyList,
			customTabBar,
			xhOfficialAccount
		},
		onLoad() {
			wx.getPrivacySetting && wx.getPrivacySetting({
				success: (res) => {
					if (res.needAuthorization) {
						this.$refs.privacyPopup.popUp()
					}
				}
			})
		},
		onShow() {
			this.$refs.userGuide.close(true);
			//插屏广告管理
			_PLAQUEADVERTISING = PLAQUEADVERTISING({
				isAutoPlay: true,
				errback: () => {
					this.$refs.userGuide.show();
				}
			});
			_PLAQUEADVERTISING.init('adunit-1af16654ee3f3330');
		},
		methods: {
			// ...mapActions({
			// 	getIsShowAd: 'login/getIsShowAd'
			// }),
			//兑换卷类型切换
			tabsChange(index) {
				this.currTabs = index;
				this.showSwiperItem(index);
			},
			swiperChange(data) { //滑动
				this.currTabs = data.detail.current; //切换tab
				this.showSwiperItem(data.detail.current);
			},
			showSwiperItem(index) {
				if (index == 0) this.showbrand = true;
				if (index == 0) this.showactivity = true;
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				// console.log(res.target)
			}
			return {
				title: '中国红牛 1元换购',
				path: '/pages/tabBar/home/index',
				imageUrl: 'https://file.y1b.cn/public/img/bfxl/2023/bfxl_share_2023.png'
				//imageUrl// //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
			};
		},
		// onHide() {
		// 	_PLAQUEADVERTISING.destroy();
		// },
		onUnload() {
			// _PLAQUEADVERTISING.destroy();
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #eaeaea;
	}

	// button, text, image {
	//     filter: grayscale(1);
	// }

	.home-page-list {
		width: 100%;
		position: fixed;
		top: 80rpx;
		bottom: 0;
		height: auto;
		box-sizing: border-box;
	}
</style>
