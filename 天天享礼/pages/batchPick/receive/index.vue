<template>
	<view class="batch-pick-index">
		<xh-navbar title="礼品卡领取" titleColor="#ffffff" :leftImage="imgUrl+'/static/images/arrow_left.png'" @leftCallBack="leftCallBack"></xh-navbar>
		<!-- 顶部背景 -->
		<image class="shadow" src="../static/shadow.png" mode="aspectFill"></image>
		<!-- 顶部背景2 -->
		<image class="shadow-2" src="../static/shadow_2.png" mode="aspectFill"></image>
		<!-- 卡片相关 -->
		<view class="prize-card">
			<view class="pc-top">
				<image class="pc-top-hi" src="../static/hi.png" mode="aspectFill"></image>
				<view class="term-valid">
					礼品卡有效期至{{cardInfo.expire_time}}
				</view>
			</view>
			<view class="card-box">
				<!-- 背景 -->
				<image class="card-box-bg" src="../static/card.png" mode="aspectFill"></image>
	<!-- 			<view class="card-box-bg">
					<van-image
					  use-loading-slot
					  width="670rpx"
					  height="300rpx"
					  lazy-load
					  fit="fill"
					  :src="cardInfo.card_image">
					  <van-loading slot="loading" type="spinner" size="20" vertical />
					</van-image>
				</view> -->
				<!-- card名字 -->
				<view class="card-name">{{cardInfo.brand_name}}</view>
				<!-- 分割 -->
				<view class="split-line">/</view>
				<!-- 价值 -->
				<view class="face-value">¥{{cardInfo.face_value}}</view>
				<!-- id -->
				<view class="card-id">
					卡ID：{{cardInfo.card_no}}
				</view>
				<!-- logo -->
				<view class="card-logo" v-if="cardInfo.brand_logo">
					<van-image
					  use-loading-slot
					  width="342rpx"
					  height="260rpx"
					  lazy-load
					  fit="contain"
					  :src="cardInfo.brand_logo+'&bg.png'">
					  <van-loading slot="loading" type="spinner" size="20" vertical />
					</van-image>
				</view>
			</view>
			<!-- 阴影 -->
			<image class="card-shadow" src="../static/card_shadow.png" mode="aspectFill"></image>
		</view>
		<!-- 奖品台 -->
		<view class="prize-table">
			<!-- 背景 -->
			<image class="prize-table-bg" src="../static/box.png" mode="aspectFill"></image>
			<!-- logo -->
			<image class="prize-table-logo" src="../static/gift_voucher.png" mode="aspectFill"></image>
			<!-- 底座 -->
			<image class="pt-base" src="../static/card_base.png" mode="aspectFill"></image>
		</view>
		<!-- 奖品领取 -->
		<view class="receive">
			<!-- 背景 -->
			<image class="receive-bg" src="../static/button_base_plate.png" mode="aspectFill"></image>
			<!-- 领取按钮 -->
			<view class="receive-button">
				<!-- 价值 -->
				<image class="receive-value" src="../static/value_button.png" mode="aspectFill"></image>
				<view class="receive-value-text">价值{{cardInfo.face_value||'0.00'}}元</view>
				<!-- 操作 -->
				<image class="receive-tool" src="../static/get_button.png" mode="aspectFill"></image>
				<view class="receive-tool-text" @click="receive">立即领取</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {cardInfo,receiveCard} from '@/api/modules/batchPick.js';
	import {getImgUrl} from '@/utils/auth.js';
	export default {
		data(){
			return {
				imgUrl: getImgUrl(),
				cardInfo:{face_value:'0.00'}
			}
		},
		onLoad(option) {
		   let {q,code} = option
		   let scanResult = decodeURIComponent(q||code)
		   cardInfo({card_qr:scanResult}).then(res=>{
			   if(res.code == 1){
				   this.cardInfo = res.data
				   return
			   }
			   uni.showModal({
			   	title:'温馨提示',
				content:res.msg,
				showCancel: false,
				success:(res) => {
					if (res.confirm) {
						this.leftCallBack()
					}
				}
			   })
		   })
		},
		methods:{
			receive(){
				receiveCard({card_qr:this.cardInfo.card_qr}).then(res=>{
					if(res.code == 1){
						uni.reLaunch({
							url:'/pages/batchPick/details/index?id='+this.cardInfo.id
						})
						return
					}
					uni.showToast({
						icon:'none',
						title:res.msg
					})
				})
			},
			leftCallBack(){
				uni.navigateBack({
					fail() {
						uni.redirectTo({
							url:'/pages/batchPick/user/index'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #2F3135;
	}
	.shadow{
		position: fixed;
		top: 0;
		left: 0;
		width: 576rpx;
		height: 636rpx;
	}
	.shadow-2{
		position: fixed;
		top: 0;
		left: 0;
		width: 318rpx;
		height: 604rpx;
	}
	.receive{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 280rpx;
	}
	.receive-bg{
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 280rpx;
	}
	.receive-button{
		width: 702rpx;
		height: 122rpx;
		border: 2rpx solid #f6e5cd;
		border-radius: 31px;
		position: absolute;
		left: 50%;
		top: 68rpx;
		transform: translateX(-50%);
		padding: 10rpx;
		box-sizing: border-box;
	}
	.receive-value{
		position: absolute;
		left: 10rpx;
		top: 10rpx;
		width: 292rpx;
		height: 98rpx;
	}
	.receive-tool{
		position: absolute;
		right: 0;
		top: 0;
		width: 426rpx;
		height: 122rpx;
	}
	.receive-value-text{
		position: absolute;
		left: 10rpx;
		top: 10rpx;
		width: 292rpx;
		height: 98rpx;
		text-align: center;
		opacity: 0.8;
		font-size: 32rpx;
		font-weight: 400;
		color: #fff6e8;
		@include flex-vh-center;
	}
	.receive-tool-text{
		position: absolute;
		right: 0;
		top: 0;
		width: 426rpx;
		height: 122rpx;
		text-align: center;
		font-size: 40rpx;
		font-weight: 700;
		color: #632b11;
		@include flex-vh-center;
	}
	.prize-table{
		width: 100%;
		height: 1062rpx;
		position: relative;
		margin-top: -88rpx;
	}
	.prize-table-bg{
		position: absolute;
		left: 0;
		bottom: 0;
		height: 1062rpx;
		width: 100%;
	}
	.prize-table-logo{
		position: absolute;
		top: 238rpx;
		right: 48rpx;
		width: 218rpx;
		height: 100rpx;
	}
	.pt-base{
		position: absolute;
		width: 722rpx;
		height: 32rpx;
		top: 66rpx;
		left: 50%;
		transform: translateX(-50%);
	}
	.prize-card{
        padding: 80rpx 40rpx 0;
		position: relative;
		z-index: 1;
	}
	.pc-top{
		padding-left: 10rpx;
		display: flex;
		justify-content: space-between;
	}
	.pc-top-hi{
		width: 166rpx;
		height: 92rpx;
	}
	.term-valid{
		font-size: 24rpx;
		font-family: PingFangSC, PingFangSC-Regular;
		font-weight: 400;
		color: rgba(255,255,255,.3);
		padding-top: 38rpx;
	}
	.card-box{
		width: 670rpx;
		height: 300rpx;
		position: relative;
		box-sizing: border-box;
		padding: 40rpx;
		margin: 0 auto;
		overflow: hidden;
	}
	.card-box-bg{
		position: absolute;
		left: 0;
		top: 0;
		width: 670rpx;
		height: 300rpx;
	}
	.card-name{
		font-size: 36rpx;
		font-weight: 700;
		color: #333333;
		position: relative;
		z-index: 1;
	}
	.split-line{
		font-size: 32rpx;
		font-weight: 400;
		color: #999999;
		position: relative;
		z-index: 1;
	}
	.face-value{
		font-size: 26rpx;
		font-weight: 700;
		color: #666666;
		position: relative;
		z-index: 1;
	}
	.card-id{
		position: absolute;
		left: 40rpx;
		bottom: 50rpx;
		font-size: 20rpx;
		font-weight: 400;
		color: #777777;
	}
	.card-shadow{
		position: absolute;
		left: 0;
		bottom: -40rpx;
		width: 100%;
		height: 126rpx;
	}
	.card-logo{
		width: 342rpx;
		height: 260rpx;
		position: absolute;
		right: -28rpx;
		top: 38rpx;
	}
</style>