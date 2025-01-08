<template>
	<view class="cowpea-double">
		<van-popup :show="show"  @close="popupClose" custom-style="background-color: transparent;overflow:visible;" :close-on-click-overlay="false"  :z-index="10000">
			<view class="cowpea-double-box">
				<image class="cdb-bg" src="https://file.y1b.cn/store/1-0/23714/64b09faf5e369.png" mode="aspectFill"></image>
				<!-- head -->
				<image class="cdb-head" :src="imgUrl +'static/popup/double_head.png'" mode="aspectFill"></image>
				<!-- title -->
				<view class="cdb-title">
					{{config.title}}
				</view>
				<!-- 关闭按钮 -->
				<!--<view class="cdb-close" @click="popupClose">
					<image class="cdb-close-icon" :src="imgUrl + 'static/popup/close2.png'"/>
				</view>
				-->
				<!-- 操作按钮 -->
				<view class="cdb-btn" @click="popupConfirm">
					{{config.btnText}}
				</view>
				<!-- 副标题 -->
				<view class="cdb-tips" v-if="config.tips">
					{{config.tips}}
				</view>
				<!-- 中牛金豆 -->
				<view class="win-cowpea-box" v-if="config.type == 1">
					<image class="win-cowpea-icon" :src="imgUrl + 'static/popup/cowpea_win.png'" mode="aspectFill"></image>
					<view class="win-cowpea-num">
						<text class="cowpea_num">{{config.reward}}</text>
						牛金豆
					</view>
				</view>
				<view class="win-card-box" v-else-if="config.type == 2">
					<image class="win-card-icon" :src="imgUrl + 'static/popup/turntable_card.png'" mode="aspectFill"></image>
					<view class="win-card-text">
						{{config.coupon_title}}
					</view>
				</view>
				<!-- 未中奖 -->
				<view class="fail-cowpea-box" v-else-if="config.type == 3">
					<image class="fail-cowpea-icon" :src="imgUrl + 'static/popup/no_win.png'" mode="aspectFill"></image>
					<view class="fail-cowpea-msg">
						{{config.failMsg}}
					</view>
				</view>
			</view>
		</van-popup>
	</view>
</template>

<script>
	import { getImgUrl } from '@/utils/auth.js';
	export default {
		data(){
			return {
				show:false,
				config:{
					title: '恭喜中奖了',
					tips: '剩余抽奖次数：3',
					reward: 0,
					btnText: '继续抽奖',
					failMsg: '哎呀，就差那么一点点~',
					type: 2, // 1牛金豆 2.卡券 3.未中奖
				},
				imgUrl: getImgUrl(),
			}
		},
		methods:{
			popupShow(config){
				this.config = config
				this.show = true;
			},
			popupClose(){
				this.show = false
				if(this.config.type == 1) {
					this.$emit('startAnim')
				}
			},
			popupConfirm(){
				this.popupClose()
			}
		}
	}
</script>

<style lang="scss">
	.cowpea-double-box{
		width: 578rpx;
		height: 862rpx;
		position: relative;
	}
	.cdb-bg{
		position: absolute;
		width: 578rpx;
		height: 862rpx;
		left: 0;
		top: 0;
		z-index: -1;
	}
	.cdb-head{
		width: 604rpx;
		height: 254rpx;
		position: absolute;
		top:78rpx;
		left: -18rpx;
		z-index: -1;
	}
	.cdb-title{
		font-size: 28rpx;
		font-family: PingFang SC, PingFang SC-Medium;
		font-weight: 500;
		text-align: center;
		color: #ffffff;
		position: absolute;
		top: 220rpx;
		left: 50%;
		transform: translateX(-50%);
	}
	.cdb-close{
		font-size: 0;
		padding: 28rpx;
		position: absolute;
		right: 0;
		top: 265rpx;
	}
	.cdb-close-icon{
		width: 28rpx;
		height: 28rpx;
	}
	.cdb-btn{
		position: absolute;
		left: 50%;
		bottom: 88rpx;
		transform: translateX(-50%);
		width: 386rpx;
		height: 90rpx;
		background: linear-gradient(135deg,#f97f02, #ef2b20);
		// border-image: linear-gradient(180deg, rgba(255,255,255,0.30), rgba(255,255,255,0.00)) 1 1;
		border-radius: 12px;
		box-shadow: 0px 4rpx 12rpx 2rpx rgba(238,81,73,0.50); 
		font-size: 36rpx;
		font-family: PingFang SC, PingFang SC-Medium;
		font-weight: 500;
		text-align: center;
		color: #ffffff;
		line-height: 90rpx;
	}
	.cdb-tips{
		font-size: 28rpx;
		font-family: PingFang SC, PingFang SC-Regular;
		font-weight: 400;
		color: #c05c08;
		position: absolute;
		left:50%;
		transform: translateX(-50%);
		bottom: 24rpx;
	}
	.win-cowpea-box{
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		top: 400rpx;
		text-align: center;
	}
	.win-cowpea-icon{
		width: 124rpx;
		height: 152rpx;
	}
	.win-cowpea-num{
		font-size: 30rpx;
		font-family: PingFang SC, PingFang SC-Regular;
		font-weight: 400;
		color: #C05C08;
	}
	.fail-cowpea-box{
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		top: 380rpx;
		text-align: center;
	}
	.fail-cowpea-icon{
		width: 200rpx;
		height: 186rpx;
	}
	.fail-cowpea-msg{
		font-size: 28rpx;
		font-family: PingFang SC, PingFang SC-Regular;
		font-weight: 400;
		color: #c05c08;
		white-space: nowrap;
	}
	.win-card-box {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	top: 415rpx;
	text-align: center;
	}
	.win-card-icon {
	width: 116rpx;
	height: 144rpx;
	}
	.win-card-text {
	font-size: 30rpx;
	font-family: PingFang SC, PingFang SC-Regular;
	font-weight: 400;
	color: #c05c08;
	}
	.cowpea_num {
		font-size: 40rpx;
		margin-right: 10rpx;
	}
</style>
