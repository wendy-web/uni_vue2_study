<template>
	<!-- 底部支付组件：取消订单，去支付 -->
	<view class="payment-box">
		<view class="btn-box">
			<button class="btn-cancel" @click="openPop" type="default" plain="true">取消订单</button>
			<button class="btn-pay" @click="toPay" type="default" plain="true">放心付</button>
		</view>
		<van-popup :show="show" @close="onClose" position="bottom" round :safe-area-inset-bottom="false"
			custom-style="background-color:unset;">
			<view class="btn-close">
				<image @click="onClose" class="icon-pop-close" mode="aspectFit"
					:src="imgUrl+'/202303/icon_pop_close.png'"></image>
			</view>
			<view class="pop-box">
				<view class="pop-title">
					<text>你的专享券打败</text>
					<text class="color-red">{{randomPercent}}%</text>
					<text>的用户，确定放弃吗 ？</text>
				</view>
				<view class="pop-btn-box">
					<view class="pop-btn-cancel" @click="cancelOrder">忍痛放弃</view>
					<view class="pop-btn-confirm" @click="toPay">果断付款</view>
					<!-- <button class="pop-btn-cancel" @click="onClose" type="default" :disabled="isDisabled"  plain="true">忍痛放弃</button>
					<button class="pop-btn-confirm" @click="pay" :disabled="isDisabled" type="default" plain="true">果断付款</button> -->
				</view>
			</view>
		</van-popup>
	</view>
</template>
<script>
	import {
		cancelOrder,
		pay,
		query
	} from '@/api/modules/order.js';
	import Toast from '@/wxcomponents/vant_update/toast/toast.js';
	import {
		getImgUrl
	} from '@/utils/auth.js'
	export default {
		props: {
			orderInfo: {
				type: Object
			}
		},
		components: {
		},
		data() {
			return {
				isDisabled: false,
				show: false,
				paymentParams: null, //支付参数
				pay_order_id: null, //支付订单id
				randomPercent: '', //随机百分比
				imgUrl: getImgUrl(),
			}
		},
		mounted() {
			console.log("mounted");
			let randomPercent = Math.random() * 14 + 85;
			randomPercent = Number(randomPercent).toFixed(2);
			this.randomPercent = randomPercent;
		},
		beforeDestroy() {
			console.log("beforeDestroy");
			this.isDisabled = false;
		},
		methods: {
			openPop() {
				this.isDisabled = true;
				this.show = true;
			},
			cancelOrder() {
				this.isDisabled = true;
				let params = {
					id: this.orderInfo.id
				}
				cancelOrder(params).then(res => {
					let {
						code,
						data,
						msg
					} = res;
					this.isDisabled = false;
					if (code == 1) {
						this.show = false;
						this.$emit('updateOrderInfo');
						return
					}
					uni.showToast({
						icon: 'none',
						title: msg
					})
				})
				console.log("cancel");

			},
			toPay() {
				console.log("pay");
				this.isDisabled = true;
				let params = {
					id: this.orderInfo.id
				}
				if (!this.paymentParams) {
					pay(params).then(res => {
						let {
							code,
							data,
							msg
						} = res;
						if (code == 1) {
							this.paymentParams = JSON.parse(data.jspay_info);
							this.pay_order_id = data.order_id;
							this.createPayment(this.paymentParams)
							return
						}
						this.isDisabled = false
						uni.showToast({
							icon: 'none',
							title: msg
						});
					});
				} else {
					this.createPayment(this.paymentParams)
				}

			},
			onClose() {
				this.show = false;
				this.isDisabled = false
			},
			//发起支付
			createPayment(obj) {
				this.show = false;
				uni.requestPayment({
					'nonceStr': obj.nonceStr,
					'package': obj.package,
					'paySign': obj.paySign,
					'signType': obj.signType,
					'timeStamp': obj.timeStamp,
					success: (res) => {
						this.isDisabled = false
						// 支付成功，用order_id 查询结果
						let params = {
							id: this.pay_order_id
						}
						query(params).then(res => {
							let {
								code,
								data,
								msg
							} = res;
							if (code == 1) {
								// 支付成功刷新订单信息
								this.$emit('updateOrderInfo');
								let {
									pay_amount,
									status
								} = data;
								pay_amount = (pay_amount / 100).toFixed(2);
								uni.redirectTo({
									url: `/pages/tabAbout/paySuccess/index?payment=${pay_amount}&status=${status}`
								})
								return
							}
							uni.showModal({
								title: '温馨提示',
								content: msg,
								showCancel: false
							})
						})


					},
					fail: (err) => {
						this.isDisabled = false
						if (err.errMsg == 'requestPayment:fail cancel') {

							this.cancelPay()

							return
							// return Toast({
							// 	message:"您已取消支付操作",
							// 	position:'bottom'
							// })

						}
						Toast({
							message: err.errMsg,
							position: 'bottom'
						})

					}
				});
			},
			cancelPay() {
				this.$emit('cancelPlay', () => {
					this.toPay();
				})
			}
		}
	}
</script>

<style lang="scss">
	button::after {
		border: none;
		padding: unset;
	}

	.payment-box {
		box-sizing: border-box;
		position: fixed;
		width: 100%;
		bottom: 0;
		background-color: #ffffff;
		display: flex;
		justify-content: flex-end;
		padding: 32rpx;
		z-index: 10;
		padding-bottom: constant(safe-area-inset-bottom); /* 兼容 IOS<11.2 */
  		padding-bottom: env(safe-area-inset-bottom); /* 兼容 IOS>11.2 */
		.btn-box {
			display: flex;

			.btn-cancel {
				width: 192rpx;
				height: 88rpx;
				line-height: 88rpx;
				box-sizing: border-box;
				text-align: center;
				border: 1rpx solid #333333;
				border-radius: 16rpx;

				font-size: 28rpx;
				color: #333333;
			}

			.btn-pay {
				width: 192rpx;
				height: 88rpx;
				line-height: 88rpx;
				box-sizing: border-box;
				text-align: center;
				background: linear-gradient(135deg, #f96a02, #f04037);
				border-radius: 16rpx;
				font-size: 28rpx;
				color: #FFFFFF;
				margin-left: 40rpx;
				border: none;
			}
		}

		.btn-close {
			text-align: right;
			padding: 10rpx 22rpx;

			.icon-pop-close {
				width: 48rpx;
				height: 48rpx;
			}
		}

		.pop-box {
			box-sizing: border-box;
			height: 324rpx;
			background: #ffffff;
			border-radius: 24rpx 24rpx 0px 0px;
			padding: 40rpx 32rpx;

			.pop-title {
				font-size: 30rpx;
				font-weight: 500;
				text-align: center;
				color: #333333;
				line-height: 42rpx;

				.color-red {
					color: #EF2B20;
				}
			}

			.pop-btn-box {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 56rpx;
			}

			.pop-btn-cancel {
				width: 328rpx;
				height: 88rpx;
				box-sizing: border-box;
				line-height: 88rpx;
				text-align: center;
				line-height: 88rpx;
				text-align: center;
				background: #f8f8f8;
				border-radius: 16rpx;
				font-size: 28rpx;
				color: #333333 !important;
				font-weight: 400;
				border: none;
			}

			.pop-btn-confirm {
				width: 328rpx;
				height: 88rpx;
				box-sizing: border-box;
				line-height: 88rpx;
				text-align: center;
				background: linear-gradient(135deg, #f96a02, #ef2b20);
				border-radius: 16rpx;
				box-shadow: 0px 4rpx 16rpx 2rpx rgba(238, 81, 73, 0.45);
				font-size: 28rpx;
				font-weight: 500;
				color: #FFFFFF !important;
				border: none;
			}
		}
	}
</style>
