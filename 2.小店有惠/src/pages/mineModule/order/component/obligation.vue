<template>
  <view class="obligation">
    <!-- 上部分信息 -->
    <view class="content-top" @click="goOrderDetail">
      <van-image
        class="item-icon"
        height="144rpx"
        width="144rpx"
        radius="8px"
        :src="config.picList[0] || config.goods_imgs"
        use-loading-slot
      >
        <van-loading slot="loading" type="spinner" size="20" vertical />
      </van-image>
      <view class="item-right-top">
        <view class="item-title">{{ config.goods_name || config.goods_sku_name }}</view>
        <view class="item-label">待付款</view>
      </view>
      <view class="item-right-bottom" v-if="config.goods_type === 0 || config.goods_type === 1">
        {{ config.goods_type === 0 ? "直充" : "卡券" }}
      </view>
    </view>
    <!-- 应付 -->
    <view class="price">
      <text class="price-label">应付:</text>
      <text class="price-val">¥{{ meet.split(".")[0] }}.</text>
      <text class="price-float">{{ meet.split(".")[1] }}</text>
      <text class="point-deduc" v-if="config.deduction_credits > 0">
        +{{ config.deduction_credits }}积分
      </text>
    </view>
    <!-- 底部信息 -->
    <view class="content-bottom border-b" v-if="config.downTime && config.goods_type !=5" >
      <view class="pay-time">
        <text>支付剩余时间：</text>
        <text class="pay-time-num">{{ config.downTime }}</text>
      </view>
      <van-button
        size="small"
        color="#EF2B20"
        custom-style="border-radius: 4px;width: 132rpx;color:#FFFFFF;height:52rpx;font-size:28rpx;"
        @click="goPay">
        去支付
      </van-button>
    </view>
  </view>
</template>
<script>
import { orderPay } from "@/api/modules/order.js";
import { payHooks } from "@/hooks/pay.js";
import { mapMutations } from 'vuex';
export default {
  props: ["config"],
  computed: {
    meet() {
      return Number(this.config.pay_price / 100).toFixed(2);
    },
  },
  methods: {
    ...mapMutations({
      setMiniProgram: "user/setMiniProgram",
    }),
    goPay() {
      payHooks(orderPay, { id: this.config.id });
    },
    goOrderDetail() {
      const {
        goods_type,
        jdShareLink,
        type_id
      } = this.config;
      // 京东的订单
      if(goods_type === 5) {
        this.setMiniProgram(goods_type);
        this.$openEmbeddedMiniProgram({
          appId: type_id,
          path: jdShareLink
        });
        return;
      }
      this.$go(`/pages/mineModule/orderDetail/index?id=${this.config.id}`);
    },
  },
};
</script>
<style lang="scss">
.obligation {
  padding: 32rpx 24rpx 20rpx;
  background-color: #ffffff;
  margin-top: 14rpx;
  .content-top {
    position: relative;
    height: 144rpx;
    padding-left: 168rpx;
  }
  .item-icon {
    position: absolute;
    left: 0;
    top: 0;
  }
  .item-right-top {
    display: flex;
    justify-content: space-between;
  }
  .item-title {
    font-size: 32rpx;
    color: #333333;
    @include line-clamp(2);
  }
  .item-label {
    color: #ef2b20;
    width: 120rpx;
    flex-shrink: 0;
    font-size: 28rpx;
    text-align: right;
  }
  .item-right-bottom {
    font-size: 26rpx;
    color: #aaaaaa;
    position: absolute;
    left: 168rpx;
    bottom: 10rpx;
  }
  .price {
    text-align: right;
    padding-bottom: 16rpx;
    font-weight: 500;
  }
  .price-label {
    font-size: 26rpx;
    color: #666666;
    margin-right: 2rpx;
  }
  .point-deduc,
  .price-float {
    font-size: 26rpx;
    color: #333333;
  }
  .point-deduc {
    margin-left: 4px;
  }
  .price-val {
    font-size: 36rpx;
    color: #333333;
  }
  .content-bottom {
    padding-top: 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .pay-time {
    font-size: 26rpx;
    font-weight: 400;
    color: #333333;
  }
  .pay-time-num {
    color: #ef2b20;
  }
}
</style>
