<template>
  <view class="refund-info" v-if="config.refund_price > 0">
    <view class="refund-title">退款信息</view>
    <view class="refund-item">
      <view class="refund-item-label">商品总价：</view>
      <view class="refund-item-right">
        <text class="val-price">¥{{ config.price.split(".")[0] }}.</text>
        <text class="val-float">{{ config.price.split(".")[1] }}</text>
        <text class="val-jf" v-if="config.deduction_credits > 0">+100积分</text>
      </view>
    </view>
    <view class="refund-item" v-if="config.deduction_credits > 0">
      <view class="refund-item-label">积分抵扣：</view>
      <view class="refund-item-right">
        <text class="val-label">积分已退还</text>
        <text class="val-jf02">{{ config.deduction_credits }}积分</text>
      </view>
    </view>
    <view class="refund-item">
      <view class="refund-item-label">退款金额：</view>
      <view class="refund-item-right">
        <text class="val-label">金额原路退回</text>
        <text class="val-price val-red"
          >¥{{ config._refund_price.split(".")[0] }}.</text
        >
        <text class="val-float val-red">{{
          config._refund_price.split(".")[1]
        }}</text>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: ["config"],
};
</script>
<style lang="scss">
.refund-info {
  background-color: #ffffff;
  padding: 32rpx 24rpx;
  margin-top: 14rpx;
  .refund-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333333;
  }
  .refund-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .refund-item {
    margin-top: 24rpx;
  }
  .refund-item-label {
    font-size: 28rpx;
    color: #999999;
    width: 158rpx;
  }
  .val-price {
    font-size: 36rpx;
    font-weight: 500;
    color: #333333;
  }
  .val-float {
    font-size: 28rpx;
    color: #333333;
  }
  .val-jf {
    font-size: 26rpx;
    color: #333333;
  }
  .val-jf02 {
    font-size: 28rpx;
    color: #333333;
  }
  .val-label {
    font-size: 28rpx;
    color: #999999;
    margin-right: 16rpx;
  }
  .val-red {
    color: #ef2b20;
  }
}
</style>
