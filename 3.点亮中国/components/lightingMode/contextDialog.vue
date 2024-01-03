<template>
	<view class="cont-over">
		<van-popup :show="show" custom-style="background-color: transparent;"  @close="popupClose"  :close-on-click-overlay="false"  :z-index="10000">
			<view class="cont-over-box">
               <view class="tips-title">{{content}}</view>
			   <view class="tips-info">赶紧去点亮城市攒能量吧~</view>
			   <view class="cont-over-btn">
					<view class="cont_btn" @click="popupClose">知道了</view>
					<view class="cont_btn active" @click="goToLight">去点亮</view>
			   </view>
			</view>
		</van-popup>
	</view>
</template>

<script>

	export default {
		data(){
			return {
				show:false,
				content: '能量不足'
			}
		},
		methods:{
			popupShow(text){
				this.show = true;
				if(text) return this.content = text;
			},
			popupClose(){
				this.show = false;
			},
			goToLight() {
				this.popupClose();
				this.$emit('goToLight');
			}
		}
	}
</script>

<style lang="scss">
	.cont-over{
		.cont-over-box{
			width: 604rpx;
			padding: 72rpx 0 64rpx;
			background-color: #ffffff;
			border-radius: 10px;
		}
		.tips-title{
			text-align: center;
			padding-bottom: 28rpx;
			font-size: 30rpx;
			font-weight: 400;
			color: #333333;
		}
		.tips-info{
			text-align: center;
			font-size: 34rpx;
			font-weight: 500;
			text-align: center;
			color: #333333;
			padding-bottom: 46rpx;
		}
		.cont-over-btn{
			display: flex;
			justify-content: space-around;
			align-items: center;
			.cont_btn {
				width: 240rpx;
				box-sizing: border-box;
				line-height: 72rpx;
				text-align: center;
				border: 2rpx solid #b94200;
				border-radius: 38rpx;
				color: #b94200;
				font-size: 28rpx;
				&.active {
					background: linear-gradient(180deg,#ffad08, #f58631);
					border: 4rpx solid #fedbce;
					color: #fff;
				}
			}
		}
	}
</style>