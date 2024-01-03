<template>
	<view class="scanned-popup">
		<van-popup :show="show"   @close="popupClose" custom-style="background-color: transparent;" :close-on-click-overlay="false" :z-index="10000">
			<view class="scanned-popup-box">
	               <view class="scanned-title">
	               	 该罐底码已被扫过
	               </view>
				   <view class="scanned-tips">
				   	 建议扫全新的罐底码
				   </view>
				   <view class="scanned-icon">
						<van-image  width="502rpx" height="338rpx" src="/static/scan/home_scan_repeat.png" fit="cover"  use-loading-slot>
							<van-loading slot="loading" type="spinner" size="20" vertical />
						</van-image>
				   </view>
			</view>
			<!-- tools -->
			<view class="tools-box">
				<view class="tools-btn" @click="proceed">
					继续扫码
				</view>
			</view>
			<image class="close" src="/static/images/close.png" mode="aspectFill" @click="show = false"></image>
		</van-popup>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				show:false,
				isAuthorization:false
			}
		},
		methods:{
			popupShow(isAuthorization){
				this.show = true
				this.isAuthorization = isAuthorization
			},
			popupClose(){
				this.show = false
			},
			proceed(){
				this.show = false
				this.$emit('scan')
			}
		}
	}
</script>

<style lang="scss">
	.scanned-popup{
		.scanned-popup-box{
			position: relative;
			width: 604rpx;
			height: 652rpx;
			background-color: #ffffff;
			border-radius: 10px;
		}
		.scanned-title{
			font-size: 40rpx;
			font-weight: 700;
			text-align: center;
			color: #ff001e;
			padding-top: 60rpx;
			padding-bottom: 16rpx;
		}
		.scanned-tips{
			font-size: 32rpx;
			font-weight: 400;
			text-align: center;
			color: #8b8b8b;
			margin-bottom: 82rpx;
		}
		.scanned-icon{
			font-size: 0;
			text-align: center;
			position: relative;
		}
		.tools-box{
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 40rpx;
			margin-bottom: 50rpx;
		}
		.tools-btn{
			width: 280rpx;
			height: 80rpx;
			border-radius: 22px;
			text-align: center;
			line-height: 80rpx;
			font-size: 32rpx;
			font-weight: 700;
			color: #ffffff;
		}
		.tools-btn:first-child{
			background-color: #3891f1;
			border: 4rpx solid #a1ceff;
		}
		.close{
			width: 56rpx;
			height: 56rpx;
			display: block;
			margin: 50rpx auto;
		}
	}

</style>