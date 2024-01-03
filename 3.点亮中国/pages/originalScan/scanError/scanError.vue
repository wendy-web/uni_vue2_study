
<template>
	<view class="scan-error">
       <!-- logo -->
	   <image class="hn-icon" src="../../static/images/err_logo.png"></image>
	   <!-- 背景色 -->
	   <view class="bg-color"></view>
	   <!-- bg -->
	   <image class="bg-icon" src="../../static/images/err_bg.png"></image>
	   <!-- 主要显示内容 -->
	   <view class="info">
		   <image class="info-bg" src="../../static/images/err_qr.png"></image>
		   <view class="info-text">
		   	   {{msg}}
		   </view>
	   </view>
	</view>
</template>

<script>

	export default {
		data() {
			return {
                 msg:''
			};
		},
		onLoad(o) {
           this.msg = o.msg
		}
	};
</script>

<style lang="scss">

	.scan-error {
		
		.hn-icon{
			display: block;
			width: 366rpx;
			height: 72rpx;
			margin: 48rpx auto 0;
		}
		
		.bg-color{
			position: fixed;
			left: 0;
			top: 0;
			bottom: 0;
			width: 100%;
			background-color: #C41220;
			z-index: -1;
		}
		
        .bg-icon{
			position: fixed;
			z-index: -1;
			width: 750rpx;
			height: 991.3rpx;
			top: 180rpx;
			left: 50%;
			transform: translateX(-50%);
		}
		
		.info{
			position: relative;
			height: 281.62rpx;
			line-height:281.62rpx;
			text-align: center;
			margin-top: 70rpx;
		}
		
		.info-bg{
			width: 298rpx;
			height: 281.62rpx;
			position: absolute;
			top: 0;
			left: 50%;
			transform: translateX(-50%);
		}
		
		.info-text{
			color: #FFFFFF;
			font-size: 55rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
		}
        
	}
</style>
