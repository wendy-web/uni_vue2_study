<template>
<van-popup
	:show="isShow"
	position="bottom"
	custom-style="background: transparent;overflow: inherit;"
	round
	z-index="100"
	safe-area-inset-bottom
	@close="popupClose"
	:catchtouchmove="true"
>
<!-- :catchtouchmove="true" // 可解决背景的滚动事件  -->
<!-- @close="popupClose" -->
	<view class="exchange-failed">
		<image class="close_icon" :src="imgUrl+'static/component/close_back.png'" mode="aspectFill" @click="popupClose"></image>
		<image class="failed-icon" src="https://file.y1b.cn/store/1-0/2369/6482d21a3091c.png" mode="aspectFill"></image>
		<view class="efi-tips">牛金豆不足</view>
		<view class="efi-surplus">
			剩余：<text class="efi-num">{{userInfo.credits}}</text>
		</view>
		<view class="earn-cowpeas" @click="goTask">
			赚牛金豆
		</view>
		<!-- <view class="look-others" @click="goHome" style="opacity: 0"> -->
		<view class="look-others" style="opacity: 0">
			看看其他 <van-icon name="arrow" color="#999999" size="12" />
		</view>
	</view>
</van-popup>
</template>

<script>
	import { getImgUrl } from '@/utils/auth.js';
import { mapGetters } from 'vuex';
	export default {
		props: {
			isShow: {
				type: Boolean,
				default: false
			},
			myCredits: {
				type: Number,
				default: 0
			}
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		data(){
			return {
				imgUrl: getImgUrl(),
				show: false,
				credits:0
			}
		},
		methods:{
			goHome(){
				uni.reLaunch({
					url:'/pages/tabBar/shopMall/index'
				})
			},
			goTask(){
				this.$emit('goTask');
			},
			popupClose() {
				this.$emit('close');
			}
		}
	}
</script>

<style lang="scss">
.exchange-failed{
	background: #fff;
	margin: 16rpx;
	border-radius: 48rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	.close_icon {
		position: absolute;
		width: 48rpx;
		height: 48rpx;
		top: -48rpx;
		right: 20rpx;
	}
	.failed-icon {
		width: 334rpx;
		height: 346rpx;
		margin-top: 24rpx;
		margin-left: 58rpx;;
	}
	.efi-tips {
		font-size: 36rpx;
		font-family: PingFang SC, PingFang SC-Semibold;
		font-weight: 600;
		text-align: center;
		color: #333333;
		line-height: 50rpx;
	}
	.efi-surplus{
		font-size: 26rpx;
		font-weight: 400;
		height: 52rpx;
		background: #f7f8f9;
		border: 2rpx solid #eaecf0;
		border-radius: 8rpx;
		font-size: 26rpx;
		font-family: PingFang SC, PingFang SC-Regular;
		color: #9295a0;
		line-height: 52rpx;
		padding: 0 24rpx;
		margin-top: 12rpx;
		.efi-num{
			color: #666666;
	   	}
	}
	.earn-cowpeas{
		width: 328rpx;
		text-align: center;
		line-height: 88rpx;
		color: #ffffff;
		width: 670rpx;
		height: 88rpx;
		background: linear-gradient(135deg,#f2554d, #f04037);
		border-radius: 16rpx;
		font-size: 28rpx;
		font-weight: 600;
		margin-top: 64rpx;
	}
	  .exchange-failed-title{
		  font-size: 30rpx;
		  font-weight: 600;
		  color: #333333;
		  padding: 40rpx 32rpx 24rpx;
		  position: relative;
		  &::after{
			  content: '';
			  position: absolute;
			  bottom: 0;
			  left: 24rpx;
			  right: 24rpx;
			  height: 2rpx;
			  background-color: #f1f1f1;
		}
	}
	.look-others{
		height: 40rpx;
		font-size: 28rpx;
		font-family: PingFang SC, PingFang SC-Regular;
		font-weight: 400;
		color: #999999;
		line-height: 40rpx;
		margin: 24rpx 0 40rpx;
	}
  }
</style>
