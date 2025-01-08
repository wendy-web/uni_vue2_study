<template>
<view class="task-complete">
	<van-popup :show="isShow"   @close="popupClose" custom-style="background-color: transparent;" :close-on-click-overlay="false"  :z-index="10000">
		<view class="task-complete-title">
			恭喜您
		</view>
		<view class="task-reward">
			<text>本次获得{{config.reward}}牛金豆</text>
			<!-- 背景 -->
			<image class="task-reward-bg" :src="imgUrl + '/static/popup/tips_icon.png'" mode="aspectFill"></image>
		</view>
		<view class="task-complete-cowpea">
			<image class="tcc-icon" src="https://file.y1b.cn/store/1-0/23714/64b0a0014b7df.png" mode="aspectFill"></image>
		</view>
		<!-- 开心收下 -->
		<view class="task-complete-btn" @click="close">
			开心收下
		</view>
	</van-popup>
</view>
</template>

<script>
import { getImgUrl } from '@/utils/auth.js';
export default {
	data(){
		return {
			isShow: false,
			config:{
				title:'恭喜您',
				reward:0
			},
			imgUrl: getImgUrl(),
		}
	},
	methods:{
		show(data) {
			this.config = data;
			this.isShow = true;
		},
		close() {
			this.isShow = false;
			this.$emit('startAnim')
		}
	}
}
</script>

<style lang="scss">
.task-complete-title {
	font-size: 48rpx;
	font-family: PingFang SC, PingFang SC-Medium;
	font-weight: 500;
	text-align: center;
	color: #ffeed0;
	margin-bottom: 20rpx;
}
.task-reward {
	width: 338rpx;
	height: 60rpx;
	margin: 0 auto;
	position: relative;
	font-size: 28rpx;
	font-family: PingFang SC, PingFang SC-Regular;
	font-weight: 400;
	text-align: center;
	color: #821200;
	line-height: 45rpx;
}
.task-reward-bg{
	position: absolute;
	width: 338rpx;
	height: 60rpx;
	left: 0;
	top: 0;
	z-index: -1;
}
.task-complete-btn{
	width: 256rpx;
	height: 74rpx;
	margin: -88rpx auto 0;
	position: relative;
	z-index: 1;
	background: linear-gradient(135deg,#f97f02, #ef2b20);
	// border-image: linear-gradient(180deg, rgba(255,255,255,0.30), rgba(255,255,255,0.00)) 1 1;
	border-radius: 12px;
	box-shadow: 0px 4rpx 12rpx 2rpx rgba(238,81,73,0.50);
	font-size: 36rpx;
	font-family: PingFang SC, PingFang SC-Medium;
	font-weight: 500;
	text-align: center;
	color: #ffffff;
	line-height: 74rpx;
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
</style>
