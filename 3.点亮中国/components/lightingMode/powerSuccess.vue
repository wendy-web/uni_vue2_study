<template>
	<view class="power-success">
		<van-popup :show="show" custom-style="background-color: transparent;" :close-on-click-overlay="false"  :z-index="10000">
			<view class="power-success-box">
				<!-- 背景 -->
               <van-image  width="604rpx" height="892rpx" src="https://file.y1b.cn/public/img/dlzg/zlcg_bg.png" fit="cover" use-loading-slot>
                	<van-loading slot="loading" type="spinner" size="20" vertical />
               </van-image>
			   <!-- title -->
			   <view class="title">
			   	本次助力点亮的城市是
			   </view>
			   <!-- icon -->
               <view class="power-success-icon">
               	   <van-image  width="518rpx" height="324rpx" src="https://file.y1b.cn/public/img/dlzg/zlcg_icon.png" fit="cover" use-loading-slot>
               	    	<van-loading slot="loading" type="spinner" size="20" vertical />
               	   </van-image>
				   <view class="city-name">{{cityName}}</view>
               </view>
			   <view class="tips-info">
			   	大家都在点亮这片土地
			   </view>
			   <!-- 我也要参加 -->
			   <view class="create-team-btn">
			     	<van-button round color="linear-gradient(180deg,#fda80c, #f5882e)" type="info" size="normal" block @click="popupClose">我也要参加</van-button>
			   </view>
			</view>
			<image class="close" src="/static/images/close.png" mode="aspectFill" @click="popupClose"></image>
		</van-popup>
		
	</view>
</template>

<script>

	export default {
		data(){
			return {
				show:false,
				cityName:''
			}
		}, 
		methods:{
			popupShow(data){
				this.cityName = data.city
				this.show = true
			},
			popupClose(){
				this.show = false
				//引导页
				this.$emit('showGuide')
			}
			// goScan(){
			// 	this.show = false
			// 	// this.$emit('goScan')
			// }
		}
	}
</script>

<style lang="scss">
	.power-success{
		
		.power-success-box{
			position: relative;
			width: 604rpx;
			height: 892rpx;
			font-size: 0;
		}
		
		.title{
			font-size: 32rpx;
			font-weight: 400;
			color: #000018;
			position: absolute;
			top: 234rpx;
			left: 0;
			right: 0;
			text-align: center;
		}
		
		.power-success-icon{
			position: absolute;
			width: 518rpx;
			height: 324rpx;
			top: 342rpx;
			left: 50%;
			transform: translateX(-50%);
		}
		
		.city-name{
			position: absolute;
			font-size: 48rpx;
			font-weight: 700;
			color: #ffffff;
			top: 54rpx;
			left: 0;
			right: 0;
			text-align: center;
		}
		
		.tips-info{
			font-size: 24rpx;
			font-weight: 400;
			color: #4e4d52;
			position: absolute;
			top: 690rpx;
			left: 0;
			right: 0;
			text-align: center;
		}
		
		

	
		
		.close{
			width: 56rpx;
			height: 56rpx;
			display: block;
			margin: 60rpx auto 0;
		}
		
		
		.create-team-btn{
			position: absolute;
			bottom: 50rpx;
			width: 296rpx;
			left: 50%;
			transform: translateX(-50%);
		}
		

	}


</style>