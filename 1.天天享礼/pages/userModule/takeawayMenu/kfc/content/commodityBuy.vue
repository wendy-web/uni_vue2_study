<template>
<view>
  <van-popup
    :show="isShow"
    position="bottom"
    custom-style="overflow: inherit;background: transparent;"
    safe-area-inset-bottom
    :overlay="false"
  >
  <view class="buy_box box_fl" :class="{active: cartNum }" @click.stop="openCartHandle">
    <view class="buy_num">
      <image class="bg_img" :src="takeImgUrl + '/kfc_car.png'" mode="widthFix"></image>
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
  watch: {},
  mounted() {
  },
}
</script>

<style scoped lang="scss">
@import '@/static/css/mixin.scss';
.buy_box {
  height: 96rpx;
  margin: 0 34rpx 10rpx;
  background: rgba($kfcColor,0.50);
  border-radius: 20rpx;
  box-shadow: 0rpx -6rpx 16rpx 0rpx rgba(0,0,0,0.06);
  font-size: 0;
  position: relative;
  z-index: 0;
  &.active {
    background: $kfcColor;
  }
  &::after {
    content: '\3000';
    position: absolute;
    top: 96rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 100vw;
    height: 128rpx;
    background: linear-gradient(180deg,rgba(255,255,255,0.10) 0%, #ffffff 76%);
    z-index: -1;
  }
  &::before {
    content: '\3000';
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - 184rpx);
    height: 100%;
    background: #231E1F;
    border-radius: 20rpx;
    z-index: -1;
  }
  .buy_num{
    width: 84rpx;
    height: 80rpx;
    position: relative;
    z-index: 0;
    margin-left: 24rpx;
    .num_add{
      height: 32rpx;
      min-width: 32rpx;
      padding: 0 5rpx;
      font-weight: 600;
      text-align: center;
      color: #fff;
      line-height: 30rpx;
      background: #DB0007;
      border: 2rpx solid #ffffff;
      border-radius: 50%;
      font-size: 24rpx;
      position: absolute;
      top: -16rpx;
      right: 0;
      box-sizing: border-box;
    }
  }
  .buy_btn{
    width: 184rpx;
    height: 100%;
    line-height: 96rpx;
    font-size: 32rpx;
    font-weight: 600;
    text-align: center;
    color: #fff;
  }
}
.buy_cont{
  height: 100%;
  margin-left: 21rpx;
}
.buy_cont-txt{
  font-size: 32rpx;
  font-weight: 600;
  color: #fff;
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
  color: rgba(255,255,255,0.70);
  line-height: 36rpx;
}
</style>