<template>
<view class="card_cont">
  <view class="card_cont-box">
    <view class="profit_title fl_start">
      <image class="profit_title-icon" mode="aspectFill"
        src="https://file.y1b.cn/store/1-0/24627/667d2e5fe3552.png"></image>
      <view>3单回本</view>
    </view>
        <view class="profit_cont fl_ard">
          <view class="profit_cont-left fl_col_cen">
            <image class="profit_cont-icon" mode="aspectFill"
              src="https://file.y1b.cn/store/1-0/24627/667d309e31408.png"></image>
            <view>任意3单返<text style="color: #F84842;margin: 0 8rpx;">9.9</text>元</view>
          </view>
          <image class="profit_cont-middle" mode="aspectFill"
            src="https://file.y1b.cn/store/1-0/24627/667d2f8e427a3.png"></image>
          <view class="profit_cont-right fl_col_cen">
            <image class="profit_cont-icon" mode="aspectFill"
              src="https://file.y1b.cn/store/1-0/24627/667d30ae78f63.png"></image>
            <view><text class="percent_lab">100</text>回本</view>
          </view>
        </view>
        <view class="profit_title fl_start" style="margin-top: 48rpx;">
          <image class="profit_title-icon" mode="aspectFill"
            src="https://file.y1b.cn/store/1-0/24627/667d36cc5485e.png"></image>
          <view>单单返现金</view>
        </view>
        <view class="profit_type fl_evenly">
          <view class="profit_item fl_col_cen">
            <view class="profit_item-title">京东</view>
            <view class="profit_item-lab">下单再返40%</view>
          </view>
          <view class="profit_item fl_col_cen">
            <view class="profit_item-title">拼多多</view>
            <view class="profit_item-lab">下单再返35%</view>
          </view>
          <view class="profit_item fl_col_cen">
            <view class="profit_item-title">其他</view>
            <view class="profit_item-lab">下单再返35%</view>
          </view>
        </view>
        <swiperListCom></swiperListCom>
  </view>
</view>
</template>
<script>

import swiperListCom from '@/components/cardOpen/swiperListCom.vue';
export default {
    components: {
        swiperListCom,
    },
    data() {
        return {
        };
    },
    mounted() {
    },
    methods: {
    },
};
</script>

<style scoped lang="scss">
.card_cont {
  position: relative;
  margin-top: -32rpx;
  z-index: 1;
  overflow: hidden;
  padding-top: 32rpx;
  &::after {
    content: '\3000';
    background: url("https://file.y1b.cn/store/1-0/24627/667d27ae9aed5.png") 0 0 / 100% 100%;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 200rpx;
    z-index: -1;
  }
  .card_cont-box {
    background: #fff;
    border-radius: 24rpx;
    margin: 0 24rpx;
    overflow: hidden;
    padding: 32rpx 0;
    .profit_title {
      font-size: 32rpx;
      color: #333;
      line-height: 44rpx;
      font-weight: bold;
      &-icon {
        width: 112rpx;
        height: 40rpx;
        margin-right: 18rpx;
      }
    }
    .profit_cont {
      background: rgba(255,130,58,0.06);
      border: 1rpx solid #ffeee5;
      border-radius: 20rpx;
      margin: 30rpx 24rpx 0;
      padding:  26rpx 0;
      font-weight: bold;
      font-size: 28rpx;
      &-middle {
        width: 96rpx;
        height: 70rpx;
      }
      &-left {
        .profit_cont-icon {
          width: 134rpx;
          height: 94rpx;
          margin-bottom: 20rpx;
        }
      }
      &-right {
        .profit_cont-icon{
          width: 72rpx;
          height: 94rpx;
        }
        .percent_lab {
          font-size: 40rpx;
          font-weight: bold;
          color: #ff4749;
          line-height: 56rpx;
          margin-right: 8rpx;
          &::after {
            content: '%';
            font-size: 24rpx;
          }
        }
      }
    }
  }
}
.profit_type {
  margin-top: 30rpx;
  .profit_item {
    width: 204rpx;
    padding: 20rpx 0 24rpx;
    position: relative;
    color: #61341D;
    z-index: 0;
    text-align: center;
    font-size: 32rpx;
    &::before {
      content: '\3000';
      background: url("https://file.y1b.cn/store/1-0/24627/667d37985c79b.png") 0 0 / 100% 100%;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
    &::after {
      content: '最高';
      position: absolute;
      top: 8rpx;
      right: 10rpx;
      opacity: 0.25;
      font-size: 20rpx;
      color: #61341d;
      line-height: 28rpx;


    }
    &-title {
      font-weight: bold;
      position: relative;
      font-size: 32rpx;
      z-index: 0;
      &::before {
        content: '\3000';
        position: absolute;
        width: 110%;
        height: 12rpx;
        background: #ffe5d8;
        border-radius: 6rpx;
        bottom: 0rpx;
        left: 50%;
        transform: translateX(-50%);
        z-index: -1;

      }
    }
    &-lab {
      opacity: 0.6;
      font-size: 26rpx;
      margin-top: 14rpx;
      font-weight: bold;
    }
  }
}
</style>
