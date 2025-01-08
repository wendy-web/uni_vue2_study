<template>
	<view class="task-complete">
		<van-popup :show="isShow"   @close="popupClose" custom-style="background-color: transparent;" :close-on-click-overlay="false"  :z-index="10000">
			<view class="task-complete-title">
				升级成功啦
			</view>
			<view class="task-reward">
				<text>成功将积分升级为牛金豆</text>
			</view>
			<view class="task-complete-cowpea">
				<image class="tcc-icon" src="https://file.y1b.cn/store/1-0/23714/64b0a0014b7df.png" mode="aspectFill"></image>
			</view>
			<!-- 自动关闭 -->
			<view class="task-complete-tips" @click="close">
				将在3s后自动关闭
			</view>
		</van-popup>
	</view>
</template>

<script>

	export default {
		data(){
			return {
				isShow: false,
			}
		}, 
		methods:{
			show() {
				this.isShow = true;
				var timeout = setTimeout(()=>{
					clearTimeout(timeout)
					this.close()
				},3000)
			},
			close() {
				this.isShow = false;
				this.$emit('startAnim')
			}
		}
	}
</script>

<style lang="scss">
	.task-complete{
		
		.task-complete-title{
			font-size: 48rpx;
			font-family: PingFang SC, PingFang SC-Medium;
			font-weight: 500;
			text-align: center;
			color: #ffeed0;
			margin-bottom: 20rpx;
		}
		
		.task-reward{
			font-size: 28rpx;
			font-weight: 500;
			text-align: center;
			color: #ffffff;
			line-height: 40rpx;
		}
		
	
		
		.task-complete-tips{
			font-size: 28rpx;
			font-weight: 400;
			text-align: center;
			color: rgba(255,255,255,0.80);
		}
		
		.task-complete-cowpea{
			width: 472rpx;
			height: 480rpx;
			margin: -44rpx auto 0;
			font-size: 0;
		}
		.tcc-icon{
			width: 472rpx;
			height: 480rpx;
		}
		
	}


</style>