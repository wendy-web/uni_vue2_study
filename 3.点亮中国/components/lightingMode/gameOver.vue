<template>
	<view class="game-over">
		<van-popup :show="show" custom-style="background-color: transparent;"  @close="popupClose"  :close-on-click-overlay="false"  :z-index="10000">
			<view class="game-over-box">
               <view class="tips-title">恭喜你已点亮所有城市</view>
			   <view class="tips-info">更多精彩，敬请期待!</view>
			   <view class="game-over-btn">
			     	<van-button round color="linear-gradient(180deg,#fda80c, #f5882e)" type="info" size="normal" block @click="popupClose">我知道了</van-button>
			   </view>
			</view>
		</van-popup>
	</view>
</template>

<script>

	export default {
		data(){
			return {
				show:false
			}
		},
		methods:{
			popupShow(){
				this.show = true
			},
			popupClose(){
				this.show = false
			}
		}
	}
</script>

<style lang="scss">
	.game-over{
		.game-over-box{
			width: 604rpx;
			height: 484rpx;
			background-color: #ffffff;
			border-radius: 10px;
		}
		.tips-title{
			font-size: 36rpx;
			font-weight: 700;
			color: #000018;
			text-align: center;
			padding-top: 78rpx;
			padding-bottom: 28rpx;
		}
		.tips-info{
			font-size: 32rpx;
			font-weight: 400;
			color: #000018;
			text-align: center;
		}
		.game-over-btn{
			position: absolute;
			bottom: 50rpx;
			width: 296rpx;
			left: 50%;
			transform: translateX(-50%);
		}
	}
</style>