<template>
  <view>
    <view
      class="buy-box van-submit-bar-safe"
      v-if="config.navTitle === '待付款'"
    >
      <view class="buy-content van-submit-bar-safe">
        <view class="buy-content-left">
          <text class="buy-label" v-if="config.deduction_price > 0"
            >优惠¥{{ config._deduction_price }}，</text
          >
          <text class="buy-label">应付：</text>
          <text class="buy-prefix">¥</text>
          <text class="buy-val">{{ config.pay_price.split(".")[0] }}</text>
          <text class="buy-float">.{{ config.pay_price.split(".")[1] }}</text>
        </view>
        <van-button
          type="danger"
          custom-style="width: 212rpx;color:#FFFFFF;height:88rpx;font-size:28rpx;"
          @click="buyConfirm"
          >去支付</van-button
        >
      </view>
    </view>
    <view
      class="buy-box van-submit-bar-safe"
      v-if="config.navTitle === '已完成'"
    >
      <view class="buy-content van-submit-bar-safe">
        <view class="buy-content-left"> </view>
        <van-button type="danger" @click="goHome">再来一单</van-button>
      </view>
    </view>
  </view>
</template>
<script>
import { orderPay } from "@/api/modules/order.js";
import { payHooks } from "@/hooks/pay.js";
export default {
  props: ["config"],
  methods: {
    goHome() {
      this.$reLaunch("/pages/home/index");
    },
    buyConfirm() {
      payHooks(orderPay, { id: this.config.id });
    },
  },
};
</script>
<style lang="scss">
.buy-box {
  width: 100%;
  height: 88rpx;
  margin-top: 14rpx;
  .buy-content {
    position: fixed;
    bottom: 0;
    height: 88rpx;
    left: 0;
    right: 0;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 24rpx;
    font-size: 30rpx;
  }
  .buy-content-left {
    font-weight: 500;
  }
  .buy-label {
    color: #333333;
  }
  .buy-prefix,
  .buy-float,
  .buy-val {
    color: #ef2b20;
  }
  .buy-val {
    font-size: 48rpx;
  }
}
</style>
