<template>
	<!-- 订单信息：编号、下单时间、充值账号 -->
	<view class="order-info-box">
		<view class="table-row">
			<view class="title">订单编号：</view>
			<view class="content">{{orderInfo.third_order_id}}</view>
			<view class="operate" @click="copy(orderInfo.third_order_id)">复制</view>
		</view>
		<view class="table-row">
			<view class="title">下单时间：</view>
			<view class="content">{{orderInfo.create_time}}</view>
		</view>
		<!-- 已支付 -->
		<view class="table-row" v-if="orderInfo.pay_time">
			<view class="title">支付方式：</view>
			<view class="content">{{orderInfo.payType}}</view>
		</view>
		<view class="table-row" v-if="orderInfo.pay_time">
			<view class="title">支付时间：</view>
			<view class="content">{{orderInfo.pay_time}}</view>
		</view>
		<!-- 未支付：充值账号可修改 -->
		<view class="unpaid" v-if="!orderInfo.pay_time&&orderInfo.goods_type== 0">
			<view class="table-row">
				<view class="title">充值帐号：</view>
				<view class="content">{{orderInfo.charge_account}}</view>
				<view class="operate" @click="showInput" v-if="!inputBoxShow&&orderInfo.status== 0">修改</view>
			</view>
			<view class="input-box" :class="{'input-box-show':inputBoxShow}">
				<view class="input-item">
					<input
						type="number"
						class="input-account"
						v-model="newAccount"
						placeholder="请输入新的充值账号"
						placeholder-class="holder-class"
					>
					<view class="btn-confirm" @click="confirmHandle" :class="{'btn-active':newAccount}">
						确定
					</view>
				</view>
				<view class="btn-cancel" @click="cancel">取消</view>
			</view>
		</view>
		<!-- 已支付：且是直充类型 -->
		<view class="unpaid" v-if="orderInfo.pay_time&&orderInfo.goods_type== 0">
			<view class="table-row">
				<view class="title">充值帐号：</view>
				<view class="content">{{orderInfo.charge_account}}</view>
			</view>
		</view>
		<!-- 客服入口 -->
		<view class="service_box" @click="goServerHandle">
			<image class="service_icon" src="https://file.y1b.cn/store/1-0/23118/654b2d38d49a5.png" mode="aspectFit"></image>
			联系客服
		</view>
    <privacyOpen ref="privacyOpen"></privacyOpen>
	</view>
</template>

<script>
	let _request = false;
	let payType = {
		"WXZF":'微信支付',
		"ZFBZF":'支付宝支付',
		// 3:'银行卡支付',
	}
	import { modifyChargeAccount } from '@/api/modules/order.js';
	export default {
		data() {
			return {
				inputBoxShow:false,
				newAccount:'',
				orderId:'',
				orderInfo:{}
			}
		},
		mounted() {
		},
		methods: {
			init(data){
				this.orderInfo = data
				this.orderId = data.id;
				this.orderInfo.payType = payType[data.pay_way] || '微信支付';
			},
			copy(str){
				uni.setClipboardData({
					data:str,
					success: () => this.$toast('复制成功')
				})
			},
			// 显示输入框
			showInput(){
				this.inputBoxShow = true;
				this.newAccount = this.orderInfo.charge_account;
			},
			confirmHandle(){
				if(_request) return _request = true;
				let params = {
					id: this.orderId,
					charge_account: this.newAccount
				}
				modifyChargeAccount(params).then(res=>{
					let { code, msg} = res;
					if(code == 1){
						this.inputBoxShow = false;
						this.$emit('updateOrderInfo')
						return
					}
					uni.showToast({
						icon:'none',
						title:msg
					})
				}).catch(err=>_request = false);
			},
			cancel(){
				this.inputBoxShow = false;
			},
			goServerHandle() {
				this.$go('/pages/tabAbout/service/service');
			}
		}
	}
</script>

<style lang="scss">
	button {
		background-color: #fff;
	}
	button::after {
		border: unset;
	}
	.order-info-box {
		box-sizing: border-box;
		padding: 32rpx 24rpx 0;
		width: 702rpx;
		background: #ffffff;
		border-radius: 24rpx;
		margin-top: 16rpx;
		.table-row {
			display: flex;
			align-items: center;
			position: relative;
			&:not(:first-child) {
				margin-top: 24rpx;
			}
			.title{
				flex-shrink: 0;
				width: 148rpx;
				height: 36rpx;
				font-size: 26rpx;
				font-weight: 400;
				color: #999999;
				line-height: 36rpx;
			}
			.content{
				margin-left: 8rpx;
				font-size: 26rpx;
				font-weight: 400;
				color: #333333;
				line-height: 36rpx;
				flex: 1;
			}
		}
		.unpaid {
			margin-top: 24rpx;
		}
		.operate{
			width: 72rpx;
			line-height: 44rpx;
			border: 2rpx solid #e1e1e1;
			border-radius: 8rpx;
			font-size: 24rpx;
			color: #666666;
			text-align: center;
			overflow: hidden;
		}
		.input-box{
			box-sizing: border-box;
			display: flex;
			align-items: flex-end;
			justify-content: space-between;
			transition: all .3s;
			height: 0;
			overflow: hidden;
			&.input-box-show {
				height: 80rpx;
			}
		}
		.input-item{
			flex-shrink: 0;
			width: 562rpx;
			height: 52rpx;
			border: 2rpx solid #e1e1e1;
			border-radius: 8rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 3rpx;
			box-sizing: border-box;
			font-size: 26rpx;
		}
		.btn-cancel{
			width: 72rpx;
			height: 44rpx;
			font-size: 24rpx;
			font-weight: 400;
			text-align: center;
			color: #666666;
			padding: 0;
			background-color: #fff;
		}
		.btn-confirm{
			width: 96rpx;
			height: 44rpx;
			line-height: 44rpx;
			text-align: center;
			box-sizing: border-box;
			background: #e1e1e1;
			border-radius: 8rpx;
			font-size: 24rpx;
			font-weight: 400;
			color: #ffffff;
		}
		.input-account{
			width: 100%;
			padding: 0 13rpx;
		}
		.holder-class{
			font-size: 26rpx;
			font-weight: 400;
			color: #999999;
			line-height: 36rpx;
			padding: 0 13rpx;
		}
		.btn-active{
			background: linear-gradient(135deg,#f96a02, #f04037);
		}
	}
	.service_box {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 36rpx;
		font-size: 26rpx;
		text-align: center;
		color: #333333;
		line-height: 36rpx;
		padding: 20rpx 0;
		margin-top: 32rpx;
		border-top: 2rpx solid  #e8e8e8;
		.service_icon{
			width: 32rpx;
			height: 30rpx;
			margin-right: 14rpx;
		}
	}
</style>
