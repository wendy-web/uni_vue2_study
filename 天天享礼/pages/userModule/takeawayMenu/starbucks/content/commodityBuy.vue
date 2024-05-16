<template>
<view>
  <van-popup
    :show="isShow"
    position="bottom"
    custom-style="overflow: inherit;"
    safe-area-inset-bottom
    :overlay="false"
  >
  <view class="buy_box box_fl" @click.stop="openCartHandle">
    <view class="buy_num">
      <image class="bg_img" :src="takeImgUrl + '/starbucks_car.png'" mode="widthFix"></image>
      <view class="num_add">{{ cartNum }}</view>
    </view>
    <view class="buy_cont fl1 fl_col_sp_ar">
      <view class="buy_cont-txt box_fl">
        预计到手
        <view class="price_num"><text style="font-size: 24rpx">¥</text>{{ total_price }}</view>
      </view>
      <view class="buy_cont-lab" v-if="cartNum">已享受最大优惠¥{{ total_coupon_price }}</view>
    </view>
    <view class="buy_btn" @click.stop="toBuyHandle">去结算</view>
  </view>
  </van-popup>
</view>
</template>

<script>
import { mapGetters } from 'vuex';
import {debounce} from '@/utils/index.js';
import { getImgUrl } from '@/utils/auth.js';
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      takeImgUrl: getImgUrl() + 'static/subPackages/userModule/takeawayMenu',
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
}
</script>

<style scoped lang="scss">
@import '@/static/css/mixin.scss';
.buy_box {
  position: relative;
  padding: 18rpx 24rpx 18rpx 34rpx;
  z-index: 0;
  box-shadow: 0rpx -6rpx 16rpx 0rpx rgba(0,0,0,0.06);
  color: #333;
  .buy_num{
    width: 76rpx;
    height: 84rpx;
    position: relative;
    z-index: 0;
    .num_add{
      height: 32rpx;
      min-width: 32rpx;
      padding: 0 5rpx;
      font-weight: 600;
      text-align: center;
      line-height: 30rpx;
      background: $starbucksColor;
      border: 2rpx solid #ffffff;
      border-radius: 50%;
      font-size: 24rpx;
      position: absolute;
      top: 0;
      right: 0;
      box-sizing: border-box;
      color: #fff;
    }
  }
  .buy_btn {
    line-height: 88rpx;
    font-size: 32rpx;
    font-weight: 600;
    text-align: center;
    width: 196rpx;
    height: 88rpx;
    background: $starbucksColor;
    border-radius: 44rpx;
    font-size: 28rpx;
    font-weight: 600;
    color: #fff;
  }
}
.buy_cont{
  height: 100%;
  margin-left: 20rpx;
}
.buy_cont-txt{
  font-size: 32rpx;
  font-weight: 600;
  line-height: 44rpx;
  margin-top: 8rpx;
  .price_num{
    font-size: 36rpx;
    line-height: 34rpx;
    margin-left: 8rpx;
  }
}
.buy_cont-lab{
  font-size: 26rpx;
  color: #aaa;
  line-height: 36rpx;
}
</style>