<template>
<view>
  <van-popup
    :show="isShow"
    position="bottom"
    custom-style="overflow: inherit;background: #fff;"
    safe-area-inset-bottom
    :overlay="false"
  >
  <view class="buy_box fl_center" @click.stop="openCartHandle">
    <view class="buy_num">
      <image class="bg_img" src="https://file.y1b.cn/store/1-0/23713/64afe17b7a0c8.png" mode="aspectFill"></image>
      <view class="num_add">{{ cartNum }}</view>
    </view>
    <view class="buy_cont fl1">
      <view class="buy_cont-txt box_fl">
        预计到手
        <view class="price_num"><text style="font-size: 24rpx">¥</text>{{ total_price }}</view>
      </view>
      <view class="buy_cont-lab" v-if="cartNum">已享受最大优惠¥{{ total_coupon_price }}</view>
    </view>
    <view :class="['buy_btn', cartNum ? 'active' : '']" @click.stop="toBuyHandle">去结算</view>
  </view>
  </van-popup>
</view>
</template>

<script>
import { mapGetters } from 'vuex';
import {debounce} from '@/utils/index.js';
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(['cartNum', 'total_price', 'total_coupon_price'])
  },
  methods: {
    openCartHandle() {
      this.$emit('openCart');
    },
    toBuyHandle: debounce(function () {
      if(!this.cartNum) return;
      this.$emit('toBuy');
    }),
  },
  watch: {},
  mounted() {
  },
}
</script>

<style scoped lang="scss">
@import '@/static/css/mixin.scss';
.buy_box {
  height: 120rpx;
  box-shadow: 0rpx -6rpx 16rpx 0rpx rgba(0,0,0,0.06);
  .buy_num{
    width: 78rpx;
    height: 84rpx;
    position: relative;
    z-index: 0;
    margin: 0 20rpx 0 32rpx;
    .num_add{
      height: 28rpx;
      min-width: 28rpx;
      padding: 0 5rpx;
      font-weight: 600;
      text-align: center;
      color: #fff;
      line-height: 1;
      background: #c2a379;
      border: 2rpx solid #ffffff;
      border-radius: 50%;
      font-size: 24rpx;
      position: absolute;
      top: 0;
      right: 0;
      box-sizing: border-box;
    }
  }
  .buy_btn{
    width: 196rpx;
    height: 100%;
    line-height: 120rpx;
    font-size: 28rpx;
    font-weight: 600;
    text-align: center;
    color: #ffffff;
    background: rgba($luckyColor,0.50);
    &.active {
      background: $luckyColor;
    }
  }
}
.buy_cont-txt{
  font-size: 32rpx;
  font-weight: 600;
  color: #373737;
  line-height: 44rpx;
  .price_num{
    font-size: 36rpx;
    color: #f95731;
    line-height: 34rpx;
    margin-left: 8rpx;
  }
}
.buy_cont-lab{
  font-size: 26rpx;
  color: #aaaaaa;
  line-height: 36rpx;
}
</style>