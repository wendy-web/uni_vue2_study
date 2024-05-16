<template>
<view class="box">
<xh-navbar
	:leftImage="imgUrl+'/static/images/left_back.png'"
	@leftCallBack="$topCallBack"
	navberColor="#fff"
	:fixedNum="9"
	titleColor="#333"
	title="我的订单"
></xh-navbar>
	<!-- 当设置tab-width,指定每个tab宽度时,则不使用flex布局,改用水平滑动 -->
	<orderTab v-model="tabIndex" :tabs="tabs" class="tab-box"></orderTab>
	<returnCash @confirm="confirmHandle"></returnCash>
	<swiper
		:style="{height: mescrollHeight}"
		:current="tabIndex"
		@change="swiperChange"
		:circular="true" duration="0"
	>
		<swiper-item v-for="(item, index) in tabs" :key="index">
			<orderSwiperItem
				ref="orderSwiperItem"
				:height="mescrollHeight"
				:curTab="index"
				:status="item.status"
				@showTakeCode="showTakeCodeHandle"
				@notEnoughCredits="notEnoughCreditsHandle"
				@againPhone="againPhoneHandle"
			></orderSwiperItem>
		</swiper-item>
	</swiper>
	<!-- toast提示 -->
	<van-toast id="van-toast" />
	<codeDia
		:codes="codes"
		:qr_codes="qr_codes"
		:isShow="isShowDia"
		@close="isShowDia= false"
	></codeDia>
	<!-- 牛金豆不足的情况 -->
	<exchangeFailed
		:isShow="exchangeFailedShow"
		@goTask="goTaskHandle"
		@close="exchangeFailedShow=false"
	></exchangeFailed>
	<!-- 赚取牛金豆 -->
	<serviceCredits
		ref="serviceCredits"
		:isShow="serviceCreditsShow"
		@showAdPlay="showAdPlayHandle"
		@close="closeHandle"
	></serviceCredits>
	<returnCashDia
		:isShow="isShowReturnCashDia"
		@close="isShowReturnCashDia = false"
		@getDraw="getDrawHandle"
	></returnCashDia>
	<van-popup
		:show="isWexinShowDia"
		custom-style="overflow: visible;background: transparent;"
		round
		:z-index="100"
		:safe-area-inset-bottom="false"
		@close="isWexinShowDia= false"
		>
			<view class="cont_box">
    <van-image
      width="750rpx" height="700rpx" fit="widthFix"
      src="https://file.y1b.cn/store/1-0/24419/6622052537a0d.png"
      use-loading-slot class="banner_img"
      :show-menu-by-longpress="true"
    ><van-loading slot="loading" type="spinner" size="20" vertical />
    </van-image>
	</view>
</van-popup>
</view>
</template>
<script>
import returnCashDia from '@/components/returnCashDia.vue';
import { getImgUrl } from '@/utils/auth.js';
import getViewPort from '@/utils/getViewPort.js';
import codeDia from './component/codeDia.vue';
import orderSwiperItem from './component/orderSwiperItem.vue';
import orderTab from './component/orderTab.vue';
import returnCash from './component/returnCash/index.vue';
	// 牛金豆不足混入的组件与方法
	import exchangeFailed from '@/components/serviceCredits/exchangeFailed.vue';
import serviceCredits from '@/components/serviceCredits/index.vue';
import serviceCreditsFun from '@/components/serviceCredits/serviceCreditsFun.js';
import { mapGetters } from "vuex";
	// onshow次数 防止首次更新
	let _onShowCount = 0
	export default {
		mixins: [serviceCreditsFun], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components: {
			orderTab,
			orderSwiperItem,
			codeDia,
			exchangeFailed,
			serviceCredits,
			returnCashDia,
			returnCash
		},
		data() {
			return {
				imgUrl: getImgUrl(),
				tabs: [{
					name: '全部',
					status: -1
				}, {
					name: '待付款',
					status: 0
				}, {
					name: '已付款',
					status: 3
				}, {
					name: '已完成',
					status: 4
				}],
				tabIndex: 0, // 当前菜单下标
				isShowDia: false,
				qr_codes: [],
				codes: [],
				isShowReturnCashDia: false,
				isWexinShowDia: false
			}
		},
		computed: {
			...mapGetters(["profitInfo"]),
			mescrollHeight(){
				let viewPort = getViewPort();
				let mescrollHeight =  viewPort.windowHeight - viewPort.navHeight - uni.upx2px(84);
				if(this.profitInfo.total_num) mescrollHeight = mescrollHeight - uni.upx2px(108);
				return mescrollHeight + 'px';
			}
		},
		onLoad(options) {
			_onShowCount = 0
			let { activeTab } = options;
			if (activeTab) {
				wx.nextTick(() => this.tabIndex = Number(activeTab));
			}
		},
		onShow() {
			if (_onShowCount > 0) {
				let active_swiper_item = this.$refs.orderSwiperItem[this.tabIndex];
				const goodsLen = active_swiper_item.goods.length;
				if (active_swiper_item && !goodsLen) {
					active_swiper_item.downCallback();
				}
			}
			_onShowCount++;
		},
		methods: {
			confirmHandle() {
				this.isShowReturnCashDia = true;
			},
			getDrawHandle() {
				this.isShowReturnCashDia = false;
			},
			showTakeCodeHandle(item) {
				const { codes, qr_codes } = item;
				if(codes.length) {
					this.isShowDia = true;
					this.qr_codes = qr_codes;
					this.codes = codes;
				}
			},
			againPhoneHandle() {
				this.isWexinShowDia = true;
			},
			// 牛金豆不足的情况
			notEnoughCreditsHandle() {
				this.exchangeFailedShow = true;
			},
			// 轮播菜单
			swiperChange(e) {
				this.tabIndex = e.detail.current;
				let active_swiper_item = this.$refs.orderSwiperItem[this.tabIndex];
				if (active_swiper_item) {
					active_swiper_item.downCallback();
				}
			},
		}
	}
</script>
<style lang="scss">
page {
	background-color: #f7f7f7;
}
.box {
	box-sizing: border-box;
}
.tab-box {
	background-color: #fff;
}
.return_cash {
	margin: 16rpx 16rpx 0;
}
.cont_box {
  position: relative;
  z-index: 0;
  width: 100%;
}
</style>
