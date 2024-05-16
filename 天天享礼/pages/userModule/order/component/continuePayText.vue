<template>
	<van-popup
    :show="isShow"
    custom-style="overflow: visible;background: transparent;"
    position="bottom"
    round
	:safe-area-inset-bottom="false"
  >
	<view class="cont_box">
      <view class="cont_text">
        <view class="cont_title">
			本单优惠
            <text style="color:#EF2B20">¥{{payValue}}</text>
			，
			确定要离开吗?
		</view>
		<view class="image_list">
			<image
				class="image_item"
				v-for="(item, index) in imgArr"
				:key="index"
				:src="item"
			></image>
		</view>
        <view class="cont_remind">{{remindText}}</view>
      </view>
      <view class="btns_box">
        <view class="pop_btn" @click="onClose">{{cancelText}}</view>
        <view class="pop_btn pop_btn-confirm" @click="onConfirm">{{confirmText}}</view>
      </view>
	</view>
</van-popup>
</template>

<script>
import {
pay,
query
} from '@/api/modules/order.js';
import Toast from '@/wxcomponents/vant_update/toast/toast.js';
	export default {
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      payValue: {
        type: Number,
        default: 0
      },
      remindText: {
        type: String,
        default: ''
      },
	  imgArr: {
		type: Array,
        default: ''
	  },
      cancelText: {
        type: String,
        default: '离开'
      },
      confirmText: {
        type: String,
        default: '放心支付'
      },
	  orderId: {
		type: Number,
        default: 0
	  }
    },
	data() {
		return {
			paymentParams: null, //支付参数
			pay_order_id: null, //支付订单id
		}
	},
	methods: {
		onConfirm() {
			this.$emit("confirm");
		},
		onClose() {
			this.$emit("close");
		},
		toPay() {
			let params = { id: this.orderId };
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
						this.createPayment(this.paymentParams);
						return;
					}
					uni.showToast({
						icon: 'none',
						title: msg
					});
				});
			} else {
				this.createPayment(this.paymentParams);
			}

		},
		// 发起支付
		createPayment(obj) {
			this.show = false;
			uni.requestPayment({
				'nonceStr': obj.nonceStr,
				'package': obj.package,
				'paySign': obj.paySign,
				'signType': obj.signType,
				'timeStamp': obj.timeStamp,
				success: (res) => {
					// 支付成功，用order_id 查询结果
					let params = { id: this.pay_order_id };
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
						// this.cancelPay();
						this.$emit("againCancel");
						return;
					}
					Toast({
						message: err.errMsg,
						position: 'bottom'
					})

				}
			});
		}
	}
}
</script>

<style lang="scss">
.cont_box {
  background: #ffffff;
  padding: 48rpx 0 40rpx;
  font-size: 28rpx;
  text-align: center;
  width: 702rpx;
  border-radius: 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto constant(safe-area-inset-bottom);
  margin: 0 auto  env(safe-area-inset-bottom);

}
.cont_title {
	height: 50rpx;
	font-size: 36rpx;
	font-family: PingFang SC, PingFang SC-Medium;
	font-weight: 500;
	text-align: center;
	color: #333333;
	line-height: 50rpx;
}
.cont_remind {
	font-size: 26rpx;
	font-family: PingFang SC, PingFang SC-Regular;
	font-weight: 400;
	color: #666666;
	line-height: 36rpx;
	margin: 24rpx auto 56rpx;
}
.image_list {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 56rpx;
	.image_item {
		width: 56rpx;
		height: 56rpx;
		background: #d8d8d8;
		border: 2rpx solid #ffffff;
		border-radius: 50%;
		margin-left: -10rpx;
	}
}
.btns_box {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-around;
}
.pop_btn {
  width: 288rpx;
  height: 88rpx;
  box-sizing: border-box;
  line-height: 88rpx;
  text-align: center;
  border-radius: 16rpx;
  font-weight: 500;
  color: #333;
  border: none;
  background: #f8f8f8;
}

.pop_btn-confirm {
  color: #fff;
  background: linear-gradient(135deg,#f2554d, #f04037);
}
.confirm_text {
  font-size: 28rpx;
  color: #999;
  line-height: 40rpx;
  margin-top: 30rpx;
}
.confirm_num {
  font-size: 50rpx;
  font-weight: 500;
  text-align: center;
  color: #333333;
  line-height: 72rpx;
  margin: 24rpx 0 80rpx;
}

</style>
