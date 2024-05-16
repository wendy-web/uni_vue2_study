<template>
<van-popup
  :show="isShow"
  round
  custom-style="background: transparent;overflow:visible;"
  @close="closeHandle"
  :root-portal="true"
  z-index="100"
>
  <view class="confirm_cont">
    <view class="cont_title">温馨说明</view>
    <view class="cont_item">
      <view class="cont_lab">1. 可提现金额</view>
      <view class="cont_txt">零钱次月30天后才可以提现。如果订单发生退款，相应的返现金额从零钱扣掉。</view>
    </view>
    <view class="cont_item">
      <view class="cont_lab">2. 关于提现</view>
      <view class="cont_txt"> 提现金额1元起（首次0.1元起），不需手续费，立即到账。</view>
    </view>
    <view class="cont_item">
      <view class="cont_lab">3. 订单返现</view>
      <view class="cont_txt">订单支付完成后可领取到“我的零钱”，60天后不领则自动失效。</view>
    </view>
    <view class="confirm_btn" @click="closeHandle">我知道了</view>
  </view>
</van-popup>
</template>
<script>
export default {
  props:{
    isShow: {
			type: Boolean,
			default: false
		},
  },
  data() {
    return {
    };
  },
  methods: {
    closeHandle() {
      this.$emit("close");
    }
  },
};
</script>
<style lang="scss">
.confirm_cont {
  background-color: #fff;
  color: #333;
  font-size: 32rpx;
  width: 622rpx;
  border-radius: 40rpx;
  padding: 0 40rpx;
  box-sizing: border-box;
  overflow: hidden;
  .cont_title {
    font-weight: 600;
    padding-top: 40rpx;
    font-size: 36rpx;
    text-align: center;
    margin-bottom: 40rpx;
  }
  .cont_item{
    margin-bottom: 48rpx;
    .cont_lab{
      font-size: 28rpx;
      line-height: 40rpx;
      margin-bottom: 12rpx;
      font-weight: bold;
    }
    .cont_txt{
      font-size: 26rpx;
      color: #666;
      line-height: 36rpx;
    }
  }
  .confirm_btn {
    text-align: center;
    margin: 0 36rpx 56rpx;
    height: 80rpx;
    background: #f84842;
    border-radius: 20rpx;
    font-size: 28rpx;
    text-align: center;
    color: #fff;
    line-height: 80rpx;
  }
}
</style>
