<template>
<view class="pay-success">
	<mescroll-body
		ref="mescrollRef"
		height="100"
		@init="mescrollInit"
		@down="downCallback"
		@up="upCallback"
		:up="upOption"
		:down="downOption"
	>
		<!-- 支付金额 -->
		<view class="order-price">
			<text class="op-unit">￥</text>
			<text class="op-num">{{payment}}</text>
		</view>
		<!-- 支付状态 -->
		<view class="pay-status">
			<van-icon name="checked" color="#EF2B20" />
			<text class="ps-label">支付成功</text>
		</view>
		<!-- tools -->
		<view class="tools">
			<view class="tools-btn left" @click="goTomyOrder">查看订单</view>
			<view class="tools-btn right" @click="goHome">去逛逛</view>
		</view>
		<!-- 猜你喜欢的优惠券列表 -->
		<view class="you_like-title" v-if="goods.length">
			<image class="left-icon" src="https://file.y1b.cn/store/1-0/24718/6698cd1ab8927.png" mode="aspectFill"></image>
			猜你喜欢
			<image class="right-icon" :src="imgUrl + 'static/shopMall/love_right_icon.png'" mode="aspectFill"></image>
		</view>
		<good-list
			v-if="goods.length"
			:list="goods"
			:isJdModel="true"
			:isBolCredits="true"
			:isJdLink="true"
			@notEnoughCredits="notEnoughCreditsHandle"
		></good-list>
	</mescroll-body>
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

	<!-- 配置的弹窗管理 -->
	<configurationDia
		ref="configurationDia"
		:isShow="isShowConfig"
		@close="closeShowConfig"
		:config="config"
		@popoverRember="requestPopoverRember"
		:remainTime="remainTime"
	></configurationDia>
    <!-- 优惠推荐商品的弹窗 -->
    <recommendDia ref="recommendDia"></recommendDia>
</view>
</template>

<script>
	import configurationFun from '@/components/configurationDia/configurationFun.js';
import configurationDia from '@/components/configurationDia/index.vue';
import goodList from '@/components/goodList.vue';
import exchangeFailed from '@/components/serviceCredits/exchangeFailed.vue';
import serviceCredits from '@/components/serviceCredits/index.vue';
import serviceCreditsFun from '@/components/serviceCredits/serviceCreditsFun.js';
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
import { getImgUrl } from '@/utils/auth.js';
import groupRecommendMixin from '@/utils/mixin/groupRecommendMixin.js'; // 混入推荐商品列表的方法
	export default {
		mixins: [MescrollMixin, configurationFun, serviceCreditsFun, groupRecommendMixin], // 使用mixin
		components:{
			configurationDia,
			goodList,
			exchangeFailed,
			serviceCredits
		},
		data(){
			return {
				imgUrl: getImgUrl(),
				upOption: {
					auto: true,
					// textNoMore: '',
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 2 // 每页数据的数量
					},
					empty: {
						use: false,
					},
				},
				downOption: {
					use: false,
					auto: false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				payment:'',
			}
		},
		onLoad(options){
			uni.setNavigationBarTitle({ title: ''});
			if(options.payment){
				this.payment = options.payment;
			}
		},
		mounted() {
			/*优惠券推荐*/
		},
		methods:{
			// 牛金豆不足的情况
			notEnoughCreditsHandle() {
				this.exchangeFailedShow = true;
			},
			upCallback(page) {
				this.requestRem(page);
			},
			goTomyOrder(){
				this.$redirectTo('/pages/userModule/order/index');
			},
			goHome(){
				this.switchTab('/pages/tabBar/shopMall/index');
			},
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #f7f7f7;
		font-family: PingFang TC, PingFang TC-6;
	}
	.order-price{
		text-align: center;
		padding-top: 32rpx;
	}
	.op-unit{
		font-size: 40rpx;
		font-weight: 500;
		color: #333333;
		position: relative;
		top:-14rpx;
	}
	.op-num{
		font-size: 64rpx;
		font-family: Barlow, Barlow-6;
		font-weight: 500;
		text-align: center;
		color: #333333;
	}
	.pay-status{
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
		font-family: PingFang SC, PingFang SC-6;
		font-weight: 500;
		color: #333333;
		padding-top: 24rpx;
	}
	.ps-label{
		margin-left: 16rpx;
	}
	.tools{
		margin: 24rpx 175rpx 72rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.tools-btn{
		width: 176rpx;
		height: 64rpx;
		border: 2rpx solid;
		border-radius: 20px;
		box-sizing: border-box;
		font-size: 28rpx;
		text-align: center;
		line-height: 62rpx;
	}
	.left{
		font-weight: 400;
		color: #666666;
		border-color: #E1E1E1;
	}
	.right{
		font-weight: 400;
		color: #EF2B20;
		border-color: #EF2B20;
	}
</style>
