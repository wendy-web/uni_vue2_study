<template>
<van-popup
    :show="isShow"
    custom-style="overflow: visible;background: transparent;"
    round
		:safe-area-inset-bottom="false"
>
  <view class="cont_box">
    <image class="cont_top_icon" src="../../static/order/paySuc_icon.png" mode="aspectFit"></image>
    <view class="cont_txt">支付成功</view>
    <view class="cont_pay">¥{{payment}}</view>
    <view class="pop_btn" @click="onClose">完成</view>
  </view>
</van-popup>
</template>

<script>
	export default {
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      payment: {
        type: Number,
        default: 0.00
      },
    },
		data() {
			return {
			}
		},
		methods: {
			onClose() {
        this.$emit("close");
			}
		}

	}
</script>

<style lang="scss" scoped>
.cont_box {
  text-align: center;
  box-sizing: border-box;
  position: relative;
  width: 582rpx;
  background: #ffffff;
  border-radius: 16rpx;
  font-size: 26rpx;
  text-align: center;
  color: #333333;
  line-height: 36rpx;
  padding-bottom: 40rpx;
  .cont_top_icon {
    width: 72rpx;
    height: 72rpx;
    margin: 50rpx auto 16rpx;
  }
}
.cont_pay{
  font-size: 48rpx;
  font-weight: 600;
  text-align: center;
  color: #333333;
  line-height: 66rpx;
  margin: 8rpx auto 48rpx;
}
.btns_box {
  width: 100%;
  margin-top: 64rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.pop_btn {
  width: 454rpx;
  line-height: 72rpx;
  background: #f84842;
  border-radius: 8rpx;
  font-size: 28rpx;
  text-align: center;
  color: #ffffff;
  margin: 0 auto;
}

</style>