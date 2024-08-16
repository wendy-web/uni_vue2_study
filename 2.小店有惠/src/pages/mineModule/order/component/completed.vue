<template>
  <view class="completed">
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
        <view class="item-label">{{ statusText }}</view>
      </view>
      <view class="item-right-bottom" v-if="config.goods_type === 0 || config.goods_type === 1">
        {{ config.goods_type === 0 ? "直充" : "卡券" }}
      </view>
    </view>
    <!-- 为应付，其它为实付 -->
    <view class="price">
      <text class="price-label">{{payLabel}}:</text>
      <text class="price-val">¥{{ meet.split(".")[0] }}.</text>
      <text class="price-float">{{ meet.split(".")[1] }}</text>
      <text class="point-deduc" v-if="config.deduction_credits > 0">
        +{{ config.deduction_credits }}积分
      </text>
    </view>
    <!-- 底部信息 -->
    <view class="content-bottom border-b" v-if="[2, 3].includes(config.status) && config.goods_type != 5">
      <view class="expire-time">
        <!-- v-if="[8].includes(config.status) 不展示过期时间 -->
        <view v-if="false">
          <text>过期时间：</text>
          <text>{{ config.pay_expire_date }}</text>
        </view>
      </view>
      <van-button size="small"
        custom-style="border-radius: 4px;width: 132rpx;color:#333333;white-space: nowrap;"
        @click="againHandle(config.goods_id)"
      >
        再来一单
      </van-button>
    </view>
  </view>
</template>
<script>
import { mapMutations } from 'vuex';
export default {
  props: ["config"],
  computed: {
    meet() {
      return Number(this.config.pay_price / 100).toFixed(2);
    },
    statusText() {
      switch (this.config.status) {
        case 0:
          return "待付款";
        case 1:
          return "已支付";
        case 2:
        case 3:
          return "已完成";
        case 4:
        case 5:
          return "已取消";
        case 8:
          return "已过期";
        case 7:
          return "待使用";
        default:
          return "已退款";
      }
    },
    //取消 为应付，其它为实付
    payLabel() {
      return [0, 4, 5,].includes(this.config.status)
        ? "应付"
        : "实付"; // 选择页面中显示的文本。例如，"应付"或"实付"或"取消
    },
  },
  methods: {
    ...mapMutations({
      setMiniProgram: "user/setMiniProgram",
    }),
    againHandle(id){
      this.$go(`/pages/homeModule/productDetails/index?id=${id}`);
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
    }
  },
};
</script>
<style lang="scss">
.completed {
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
    color: #333333;
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
    align-items: center;
    justify-content: space-between;
  }
  .expire-time {
    font-size: 26rpx;
    font-weight: 400;
    color: #999999;
  }
}
</style>
