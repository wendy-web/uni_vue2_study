<template>
	<view class="golden-beans">
		<!-- 大背景图 -->
		<van-image class="bg" use-loading-slot lazy-load width="100%" height="390rpx"  :src="imgUrl+'/task/bg_golden_beans.png'">
		  <van-loading slot="loading" type="spinner" size="20" vertical />
		</van-image>
		<!-- 我的金豆 -->
		<view class="bean-box">
			<view class="today-bean" id="todayBean">今日收益：
			<!-- {{userInfo.credits>99999?'99999+':userInfo.credits}} -->
				<p-countup :num="totalToady"  width="8" height='13' color="#999999" fontSize="12"></p-countup>
			</view>
			<view class="total-bean-box">
				<view class="bean-title">
					<image class="icon_beans" :src="imgUrl+'/task/icon_beans.png'" mode="aspectFit" lazy-load></image>
					<view>牛金豆</view>
					<image class="icon-colon-tr" :src="imgUrl+'/task/icon_colon_top.png'" mode="aspectFit" lazy-load></image>
				</view>
				<view class="total-bean">
					<image class="icon-colon-bl" :src="imgUrl+'/task/icon_colon_bottom.png'" mode="aspectFit" lazy-load></image>
					<view>
						<!-- {{userInfo.credits>9999?'9999+':userInfo.credits}} -->
						<p-countup :num="userInfo.credits"  width="20" height='36' color="#666666" fontSize="36"></p-countup>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import pCountup from '@/components/p-countUp/countUp.vue';
	import {getImgUrl} from '@/utils/auth.js';
	export default {
		components:{pCountup},
		props:{
			userInfo:Object,
			totalToady:Number
		},
		data() {
			return {
				todayBeans:'0',
				totalBeans:'99999',
				imgUrl:getImgUrl()
			}
		},
		mounted() {
			// setTimeout(()=>{
			// 	this.todayBeans = '102'
			// },3000)
		},
		methods: {

		}
	}
</script>

<style lang="scss">
	.golden-beans {
		position: relative;
		height: 370rpx;
		padding: 90rpx 60rpx 0rpx 80rpx;
		box-sizing: border-box;
		background-color: #f8f7f7;
		
		.bg {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			z-index: 0;
			width: 100%;
			height: 390rpx;
		}


		.bean-box {
			position: relative;
			display: flex;
			align-items: flex-end;
			justify-content: space-between;
		}
			
		.today-bean{
			font-size: 24rpx;
			color: #999999;
			display: flex;
			align-items: center;
		}

		.total-bean-box{
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;
		}
		.bean-title{
			font-size: 26rpx;
			color: #9fa8b0;
			position: relative;
			display: flex;
			align-items: flex-end;
			justify-content: flex-start;
			box-sizing: border-box;
			width: 160rpx;
			height: 50rpx;
		}
		.icon_beans{
			width: 30rpx;
			height: 27rpx;
			margin-right: 10rpx;
			transform: rotateY(180deg);
		}
		.total-bean {
			font-size: 72rpx;
			font-weight: 500;
			color: #666666;
			text-align: left;
			width: 290rpx;
			height: 80rpx;
			line-height: 80rpx;
			box-sizing: border-box;
			flex-shrink: 0;
			display: flex;
			align-items: flex-end;
			justify-content: flex-start;
		}
		.icon-colon-tr{
			width: 40rpx;
			height: 24rpx;
			position: absolute;
			top: 0;
			right: 0;
		}
		.icon-colon-bl{
			width: 40rpx;
			height: 24rpx;
			padding-right: 20rpx;
			// padding-bottom: 14rpx;
		}
	}
</style>
