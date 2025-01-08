<template>
<van-popup
	:show="isShow"
	position="center"
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
		<image class="failed-icon" src="https://file.y1b.cn/store/1-0/2369/6482d21a3091c.png" mode="aspectFill"></image>
		<view class="efi-tips">牛金豆不足</view>
		<view class="efi-surplus">剩余：{{userInfo.credits}}</view>
		<view class="earn-cowpeas" @click="goTask">
			<view class="gesture_icon-box">
				<image src="https://file.y1b.cn/store/1-0/24124/65b0b0bca7769.png"
				mode="widthFix" class="gesture_icon"
				></image>
			</view>
		</view>
		<image class="close_icon" :src="imgUrl+'static/component/close_back.png'" mode="aspectFill" @click="popupClose"></image>
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
			goHome() {
				this.$reLaunch('/pages/tabBar/shopMall/index');
			},
			goTask() {
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
	width: 670rpx;
	background: #fff;
	margin: 16rpx;
	border-radius: 40rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	.close_icon {
		position: absolute;
		width: 48rpx;
		height: 48rpx;
		bottom: -58rpx;
	}
	.failed-icon {
		width: 334rpx;
		height: 346rpx;
		margin-top: 28rpx;
		margin: 28rpx 140rpx 0 auto;
		display: block;
	}
	.efi-tips {
		font-size: 36rpx;
		font-weight: bold;
		text-align: center;
		color: #333;
		line-height: 50rpx;
	}
	.efi-surplus {
		font-size: 26rpx;
		line-height: 56rpx;
		font-size: 26rpx;
		line-height: 56rpx;
		padding: 0 24rpx;
		margin-top: 12rpx;
		background: rgba(255,143,42,0.10);
		border: 2rpx solid rgba(255,143,42,0.30);
		border-radius: 8rpx;
		color: #61341d;
		font-weight: bold;
	}
	.earn-cowpeas {
		width: 606rpx;
		line-height: 88rpx;
		height: 104rpx;
		background: linear-gradient(135deg,#f2554d, #f04037);
		border-radius: 16rpx;
		margin: 52rpx 32rpx 32rpx;
		position: relative;
		background: url("https://file.y1b.cn/store/1-0/24713/669224f38cc47.png") 0 0 / 100% 100%;
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
