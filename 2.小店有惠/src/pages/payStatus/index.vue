<template>
  <view class="pay-status">
    <view class="pay-price">
      <text class="price-prefix">¥</text>
      <text class="price-val">{{ pay_amount }}</text>
    </view>
    <view class="pay-status-info">
      <van-icon
        v-if="status === 1"
        name="checked"
        color="#EF2B20"
        size="32rpx"
      />
      <van-icon v-else name="clear" color="#EF2B20" size="32rpx" />
      <text class="pay-status-text">{{ statusText }}</text>
    </view>
    <view class="pay-status-tools">
      <van-button
        color="#F7F7F7"
        custom-style="width: 176rpx;color:#666666;border-color:#D1D1D1"
        round
        size="small"
        @click="goOrderdetails"
        >查看订单</van-button
      >
      <van-button
        color="#F7F7F7"
        custom-style="width: 176rpx;color:#EF2B20;border-color:#EF2B20;margin-left:48rpx"
        round
        size="small"
        @click="goHome"
        >去逛逛</van-button
      >
    </view>
  </view>
</template>
<script>
import { query } from "@/api/modules/order.js";
export default {
  onLoad(options) {
    this.order_id = options.order_id;
    this.getOrderInfo();
  },
  data() {
    return {
      status: 1,
      pay_amount: "0.00",
      order_id: "",
    };
  },
  computed: {
    statusText() {
      if (this.status === 1) {
        return "支付成功";
      }
      if (this.status === 0) {
        return "未支付";
      }
      return "支付失败";
    },
  },
  methods: {
    getOrderInfo() {
      query({ id: this.order_id }).then((res) => {
        let { status, pay_amount } = res.data;
        this.status = status;
        this.pay_amount = Number(pay_amount / 100).toFixed(2);
      });
    },
    goOrderdetails() {
      this.$redirectTo(`/pages/mineModule/orderDetail/index?id=${this.order_id}`);
    },
    goHome() {
      this.$switchTab("/pages/home/index");
    },
  },
};
</script>
<style>
page {
  background-color: #f7f7f7;
}
.pay-price {
  text-align: center;
}
.price-prefix {
  font-size: 40rpx;
  font-weight: 500;
  color: #333333;
}
.price-val {
  font-size: 64rpx;
  font-weight: 600;
  color: #333333;
}
.pay-status-info {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24rpx;
  margin-bottom: 24rpx;
}
.pay-status-text {
  margin-left: 10rpx;
}
.pay-status-tools {
  text-align: center;
}
</style>
