<template>
<view class="cash_top" id="openFirstRed">
  <view class="fl_bet">
    <view class="cash_left">
      <view class="cash_title">本页下1单，立即开<text style="color: #F84842;">现金红包</text></view>
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
      <view class="cash_left-btn" @click="goToBuyHandle">
        <image src="https://file.y1b.cn/store/1-0/24123/65af164ddcf81.png"
          mode="widthFix" class="cash_btn-img"></image>
        <view class="gesture_icon-box">
          <image src="https://file.y1b.cn/store/1-0/24124/65b0b0bca7769.png"
            mode="widthFix" class="gesture_icon"
            @click="goToBuyHandle"
          ></image>
        </view>
      </view>
    </view>
    <view class="cash_right" v-if="isShowRed">
      <view class="cash_right-num">{{ enterArr.max_profit || 0}}</view>
    </view>
  </view>
  <anNoticeBar class="anNoticeBar_ref" />
</view>
</template>
<script>
import { warpRectDom } from '@/utils/auth.js';
import cashMixin from '../static/cashMixin.js'; // 混入分享的混合方法
import anNoticeBar from './an-notice-bar.vue';
export default {
  mixins: [cashMixin], // 使用mixin
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    isShowRed: {
      type: Boolean,
      default: false
    }
  },
  components: {
    anNoticeBar
  },
  computed: {
  },
  data() {
    return {
    };
  },
  watch: {
  },
  mounted() {
    this.$nextTick(()=>{
      setTimeout(() => this.domFun(), 1000);
    });
  },
  methods: {
    warpRectDom,
    goToBuyHandle() {
      this.$emit('goToBuy');
    },
    domFun(){
      this.warpRectDom('openFirstRed').then(res=> {
        this.$emit('openFirstRef', res);
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
  .cash_title{
    font-size: 34rpx;
    color: #9d4218;
    line-height: 72rpx;
    text-align: center;
    font-weight: bold;
  }
  .cash_left-btn {
    width: 366rpx;
    height: 100rpx;
    margin: 12rpx auto 0;
    font-size: 0;
    position: relative;
    .cash_btn-img{
      width: 100%;
      height: 100%;
    }
    .gesture_icon-box{
      position: absolute;
      z-index: 0;
      right: -40rpx;
      bottom: -30rpx;
      width: 102rpx;
      height: 100rpx;
      &::before {
        content: "\3000";
        position: absolute;
        z-index: -1;
        width: 40rpx;
        height: 40rpx;
        top: 0;
        left: 0;
        border-radius: 50%;
        opacity: 0;
        animation: rippleAnimation 1s linear infinite;
        box-shadow: 0 0 8px rgba(255, 255, 255, 1) inset;
      }
      &::after {
        content: "\3000";
        position: absolute;
        z-index: -1;
        width: 30rpx;
        height: 30rpx;
        top: 5rpx;
        left: 5rpx;
        border-radius: 50%;
        opacity: 0;
        animation: rippleCenterAnimation 1s linear infinite;
        box-shadow: 0 0 8px rgba(255, 255, 255, 1) inset;
      }
      .gesture_icon {
        width: 58rpx;
        height: 66rpx;
        position: relative;
        transform: translate(16rpx, 16rpx);
        animation: gestureAnimation 1s linear infinite;
      }
    }
  }
  .cash_right {
    flex: 0 0 166rpx;
    width: 166rpx;
    height: 208rpx;
    position: relative;
    z-index: 0;
    opacity: 0;
    transform: scale(0);
    animation: redHeightAin .1s linear forwards;
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
    .cash_right-num{
      color: #FEF6C8;
      font-size: 56rpx;
      font-weight: 600;
      position: absolute;
      left: 50%;
      top: 20rpx;
      transform: translateX(-50%);
      &::before {
        content: '最高';
        position: absolute;
        right: -30rpx;
        top: 5rpx;
        font-size: 10rpx;
        font-weight: 400;
        opacity: .5;
      }
      &::after {
        content: '元';
        position: absolute;
        right: -20rpx;
        bottom: 10rpx;
        font-size:16rpx;
        font-weight: 400;
      }
    }
  }
}
@keyframes redHeightAin {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
.cash_time {
  display: block;
  margin: 14rpx auto 0;
  .van-count-down{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .item {
    width: 40rpx;
    height: 40rpx;
    background: #333;
    border-radius: 8rpx;
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
.cash_time-txt {
  font-size: 26rpx;
  text-align: center;
  color: rgba(157,66,24,0.60);
  line-height: 36rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  &::before {
    content: '\3000';
    display: block;
    width: 72rpx;
    height: 2rpx;
    background: linear-gradient(90deg,rgba(227,190,170,0.00), #c28971 100%);
    border-radius: 2rpx;
    margin-right: 8rpx;
  }
  &::after {
    content: '\3000';
    display: block;
    width: 72rpx;
    height: 2rpx;
    background: linear-gradient(-90deg,rgba(227,190,170,0.00), #c28971 100%);
    border-radius: 2rpx;
    margin-left: 8rpx;
  }
}
@keyframes rippleAnimation {
  0% {
		transform: scale(1);
		opacity: 0;
	}
  30% {
		transform: scale(1);
		opacity: 0;
	}
	35% {
		transform: scale(1);
		opacity: 1;
	}
	60% {
		transform: scale(2);
		opacity: 0.5;
	}
  80% {
		transform: scale(2);
		opacity: 0;
	}
  100% {
		transform: scale(2);
		opacity: 0;
	}
}
@keyframes rippleCenterAnimation {
  0% {
		transform: scale(0);
		opacity: 0;
	}
  30% {
		transform: scale(0);
		opacity: 0;
	}
	35% {
		transform: scale();
		opacity: 1;
	}
	60% {
		transform: scale(1);
		opacity: 1;
	}
  80% {
		transform: scale(1);
		opacity: 0;
	}
  100% {
		transform: scale(1);
		opacity: 0;
	}
}
@keyframes gestureAnimation {
	0% {
    transform: translate(40rpx, 30rpx);
	}
	30% {
    transform: translate(16rpx, 16rpx);
	}
  80% {
    transform: translate(16rpx, 16rpx);
	}
	100% {
    transform: translate(40rpx, 30rpx);
	}
}
</style>
