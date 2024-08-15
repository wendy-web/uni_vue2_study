<template>
<view class="cash_top" id="cashFinishDom45">
  <view class="cash_title">本页下1单，现金最高<text style="color: #F84842;">翻10倍</text></view>
  <view class="finish_num">
    <view class="finish_num-list">
      <view class="finish_num-left">{{ enterArr.profit_money || 0 }}</view>
      <view class="finish_num-right">{{ enterArr.max_profit_money || 0 }}</view>
    </view>
    <image src="https://file.y1b.cn/store/1-0/24124/65b079a01874f.png"
    mode="widthFix" class="finish_num-btn" @click="goToBuyHandle"></image>
  </view>
  <van-count-down
    @finish="countFinished"
    :time="remainTime"
    millisecond
    use-slot
    format="mm:ss"
    @change="onChangeHandle"
    style="--count-down-text-color:#333;--count-down-font-size:26rpx;"
    class="cash_time"
  >
  <view class="fl_center">
    <text class="item_lab">距结束</text>
    <text class="item">{{ timeData.hours }}</text>:
    <text class="item">{{ timeData.minutes }}</text>:
    <text class="item">{{ timeData.seconds }}</text>
  </view>
  </van-count-down>
  <view class="anNoticeBar_ref">
    <anNoticeBar/>
  </view>
</view>
</template>

<script>
import { warpRectDom } from '@/utils/auth.js';
import cashMixin from '../static/cashMixin.js'; // 混入分享的混合方法
import anNoticeBar from './an-notice-bar.vue';
export default {
  mixins: [cashMixin], // 使用mixin
  components: {
    anNoticeBar
  },
  data() {
    return {
    };
  },
  mounted() {
    this.$nextTick(()=> setTimeout(() => this.domFun(), 1000));
  },
  methods: {
    warpRectDom,
    goToBuyHandle() {
      this.$emit('goToBuy');
    },
    domFun(){
      this.warpRectDom('cashFinishDom45').then(res=> {
        this.$emit('cashFinishDom45Ref', res);
      });
    }
  },
};
</script>
<style lang="scss" scoped>
.cash_top{
  background: rgba(255,255,255,0.65);
  border: 3rpx solid #ffffff;
  border-radius: 32rpx;
  backdrop-filter: blur(12rpx);
  margin: 32rpx 16rpx;
  padding: 32rpx;
  box-sizing: border-box;
  .cash_title {
    font-size: 34rpx;
    color: #9d4218;
    line-height: 72rpx;
    text-align: center;
  }
  .cash_left-btn {
    width: 366rpx;
    height: 100rpx;
    display: block;
    margin: 12rpx auto 0;
  }
  .cash_right {
    flex: 0 0 166rpx;
    width: 166rpx;
    height: 208rpx;
    position: relative;
    z-index: 0;
    &::before {
      content: '\3000';
      background: url("https://file.y1b.cn/store/1-0/24123/65af17e56e4d0.png") 0 0 / 100% 100%;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
  }
}
.cash_time {
  display: block;
  margin: 0 auto;
  .item {
    width: 40rpx;
    height: 40rpx;
    background: #333;
    border-radius: 4rpx;
    text-align: center;
    line-height: 40rpx;
    color: #fff;
    margin: 0 8rpx;
    display: inline-block;
    font-size: 24rpx;
  }
  .item_lab {
    margin-right: 14rpx;
    color: #333;
    font-size: 26rpx;
  }
}
.anNoticeBar_ref {
  margin-top: 50rpx;
}
.finish_num {
  position: relative;
  z-index: 0;
  &::before {
    content: '\3000';
    width: 572rpx;
    height: 360rpx;
    background: url("https://file.y1b.cn/store/1-0/24124/65b079ba09db8.png") 0 0 / 100% 100%;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: -1;
  }
  .finish_num-list {
    color: #58bf6a;
    font-weight: 600;
    padding-top: 60rpx;
    text-align: center;
    display: flex;
    justify-content: center;
    .finish_num-left {
      font-size: 48rpx;
      margin-top: 48rpx;
      min-width: 40%;
      &::after {
        content: '元';
        font-size: 24rpx;
      }
    }
    .finish_num-right{
      font-size: 70rpx;
      color: #58bf6a;
      min-width: 47%;
      &::after {
        content: '元';
        font-size: 32rpx;
      }
    }
  }
  .finish_ban {
    width: 402rpx;
    height: 120rpx;
    display: block;
    margin: 146rpx auto 0;
  }
  .finish_lab{
    font-size: 28rpx;
    text-decoration: underline;
    text-align: center;
    color: rgba(255,255,255,0.80);
    line-height: 40rpx;
    margin-top: 36rpx;
  }
  .finish_close{
    width: 72rpx;
    height: 72rpx;
    position: absolute;
    right: 32rpx;
    top: -96rpx;
  }
}
.finish_num-btn{
  width: 402rpx;
  height: 122rpx;
  display: block;
  margin: 114rpx auto 0;
}
</style>
