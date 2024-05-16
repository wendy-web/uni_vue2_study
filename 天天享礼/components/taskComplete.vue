<template>
<van-popup
	:show="isShow"
	custom-style="background-color: transparent;"
	:close-on-click-overlay="false"
	:z-index="10000"
	@close="popupClose"
>
	<view class="ani_active">
		<view class="task-complete-title"> 恭喜你 </view>
		<view class="task-reward">本次获得{{config.reward}}牛金豆</view>
		<view class="task-complete-cowpea"></view>
		<view class="task-complete-btn" @click="close(false)">开心收下<text v-if="countDownNum>=0">({{ countDownNum || 0 }})</text></view>
	</view>
</van-popup>
</template>

<script>
export default {
	props: {
		countDownNum: {
			type: Number,
			default: -1
		}
	},
	data(){
		return {
			isShow: false,
			config: {
				reward: 0,
				isUpdate: false
			},
		}
	},
	methods:{
		show(data) {
			this.config = data;
			this.isShow = true;
		},
		close() {
			this.isShow = false;
			this.$emit('startAnim', this.config.isUpdate);
		}
	}
}
</script>
<style lang="scss">
.task-complete-title{
	font-size: 48rpx;
	font-family: PingFang SC, PingFang SC-Medium;
	font-weight: 500;
	text-align: center;
	color: #ffeed0;
	margin-bottom: 20rpx;
}
.task-reward{
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
	z-index: 0;
	&::before {
		content: '\3000';
		background: url("https://file.y1b.cn/public/img/ttxl//static/popup/tips_icon.png") 0 0 / 100% 100%;
		position: absolute;
		left: 0;
		top: 0;
		width: 338rpx;
		height: 60rpx;
		z-index: -1;
	}
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
	position: relative;
	&::before {
		content: '\3000';
		background: url("https://file.y1b.cn/store/1-0/23714/64b0a0014b7df.png") 0 0 / 100% 100%;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}
}
.tcc-icon{
	width: 472rpx;
	height: 480rpx;
}
</style>
