<template>
<van-popup
  :show="isShow"
  custom-style="background-color: transparent;overflow:visible;"
  overlay-style="background-color: rgba(0,0,0,0.9);"
  :z-index="100"
  :catchtouchmove="true"
  @close="closeHandle"
>
  <view class="dia_cont">
    <image  class="finish_close" mode="aspectFit"
      src="https://file.y1b.cn/store/1-0/24124/65b0717ce9dcb.png"
      @click="closeHandle"
    ></image>
    <view class="award_img-box">
      <van-image
        width="600rpx" height="600rpx"
        :src="freeEnterArr.gift_img"
        use-loading-slot radius="40rpx"
      ><van-loading slot="loading" type="spinner" size="20" vertical />
      </van-image>
    </view>
    <view class="cash_lab txt_ov_ell2">{{ freeEnterArr.gift_name }}</view>
    <view class="tips_box">
      <view class="tips_title">温馨提示</view>
      <view class="tips_list">1. 订单全部确认收货且无退换货后，才可领取奖品。</view>
      <view class="tips_list">2. 领取奖品后，次月月底陆续安排发货。奖品领取后 可在【活动记录】中查看发货情况和物流信息。</view>
      <view class="tips_list">3. 参与本活动的订单若发生退款，则该订单不计入任务进度，系统会重新计算任务完成情况。</view>
    </view>
  </view>
</van-popup>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['freeEnterArr']),
  },
  data() {
    return {
    };
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    closeHandle() {
      this.$emit('close');
    }
  },
};
</script>

<style lang="scss" scoped>
@import '../static/animation.scss';
.dia_cont {
  width: 750rpx;
  position: relative;
  z-index: 0;
}
.finish_close{
  width: 72rpx;
  height: 72rpx;
  position: absolute;
  right: 32rpx;
  top: -102rpx;
  z-index: 1;
}
.award_img-box {
  width: 600rpx;
  height: 600rpx;
  margin: 0 auto;
}
.cash_lab {
  font-size: 32rpx;
  text-align: center;
  color: #fff8e1;
  line-height: 44rpx;
  width: 568rpx;
  margin: 28rpx auto 0;
}
.tips_box {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 640rpx;
  border: 2rpx solid rgba(255,255,255,0.50);
  font-size: 24rpx;
  color: rgba(#fff, 0.6);
  margin: 58rpx auto 0;
  display: inline-block;
  padding: 22rpx 24rpx;
  border-radius: 40rpx;
  border-top-width: 0;
  .tips_list{
    &:not(:last-child) {
      margin-bottom: 10rpx;
    }
  }
  .tips_title {
    font-size: 26rpx;
    position: absolute;
    top: -18rpx;
    left: 68rpx;
    right: 0;
    &::before {
      content: '\3000';
      position: absolute;
      width: 60rpx;
      height: 60rpx;
      background: transparent;
      border: 2rpx solid rgba(255,255,255,0.50);
      top: 50%;
      left: -70rpx;
      border-right-width: 0;
      border-bottom-width: 0;
      border-radius: 40rpx 0 0 0;
    }
    &::after {
      content: '\3000';
      position: absolute;
      width: 510rpx;
      height: 60rpx;
      background: transparent;
      border: 2rpx solid rgba(255,255,255,0.50);
      top: 50%;
      right: -2rpx;
      border-left-width: 0;
      border-bottom-width: 0;
      border-radius: 0 40rpx 0 0;
    }
  }
}
</style>
