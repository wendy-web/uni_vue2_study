<template>
	<view class="soon-lcity-popup">
		<van-popup :show="show" @close="popupClose" custom-style="background-color: transparent;" :close-on-click-overlay="false" :z-index="10000">
			<view class="soon-lcity-popup-box">
	               <view class="slcp-b-title">
	               	 即将点亮
	               </view>
				   <view class="soon-lcity-icon">
						<van-image  width="550rpx" height="344rpx" src="/static/scan/home_scan_soon.png" fit="cover"  use-loading-slot>
							<van-loading slot="loading" type="spinner" size="20" vertical />
						</van-image>
						<view class="city-name">
							{{config.city}}
						</view>
				   </view>
				   <view class="slcp-progress-box">
						<view class="slcp-progress" :style="{width:progress}">{{progress}}</view>
				   </view>
				   <view class="slcp-tips">
				   	再扫<text class="slcp-tips-num">{{needNum}}</text>次罐底码点亮
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
				isAuthorization:false,
				config:{
					city:'',
					need_scan_num:0,
					scan_num:0
				}
			}
		},
		computed:{
			progress(){
				let {scan_num,need_scan_num} = this.config
				return (scan_num/need_scan_num*100).toFixed(0) + '%'
			},
			needNum(){
				let {scan_num,need_scan_num} = this.config
				return need_scan_num - scan_num
			}
		},
		methods:{
			popupShow(data,isAuthorization){
				this.config = data
				this.show = true
				this.isAuthorization = isAuthorization
			},
			popupClose() {
				this.show = false
			},
			proceed() {
				this.show = false
				this.$emit('scan')
			}
		}
	}
</script>

<style lang="scss">
	.soon-lcity-popup{
		.soon-lcity-popup-box{
			position: relative;
			width: 604rpx;
			height: 692rpx;
			background-color: #ffffff;
			border-radius: 10px;
		}
		.slcp-b-title{
			font-size: 48rpx;
			font-weight: 700;
			text-align: center;
			color: #000018;
			padding-top: 74rpx;
			padding-bottom: 54rpx;
		}
		.soon-lcity-icon{
			font-size: 0;
			text-align: center;
			position: relative;
		}
		.city-name{
			font-size: 48rpx;
			font-weight: 700;
			color: #ffffff;
			position: absolute;
			left: 50%;
			top: 58rpx;
			transform: translateX(-50%);
			z-index: 1;
		}
		.slcp-progress-box{
			width: 550rpx;
			height: 26rpx;
			background-color: #dadada;
			border-radius: 7px;
			position: relative;
			overflow: hidden;
			margin: 38rpx auto 4rpx;
		}
		.slcp-progress{
			position: absolute;
			left:0;
			top: 50%;
			height: 26rpx;
			line-height: 26rpx;
			box-sizing: border-box;
			padding-right: 10rpx;
			transform: translateY(-50%);
			text-align: right;
			background-color: rgba(255,134,67,1);
			font-size: 24rpx;
			font-weight: 700;
			color: #ffffff;
		}
		.slcp-tips{
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28rpx;
			font-weight: 400;
			color: #000018;
		}
		.slcp-tips-num{
			color: rgba(255,134,67,1);
			font-size: 40rpx;
			font-weight: bold;
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