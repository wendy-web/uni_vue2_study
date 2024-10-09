<template>
<view class="pay_bottom" id="payBottomDom" :style="{ '--padding': tabHeightValue + 'px' }">
  <view class="no_credits">
    <view class="no_credits-checkbox fl_bet">
      <view class="no_credits-left box_fl" @click="openNoCreditsHandle">
        <image src="https://file.y1b.cn/store/1-0/24628/667e152c9f0f0.png" mode="scaleToFill" class="no_credits-img" ></image>
        <van-icon name="question-o" color="#A5512B" size="26rpx" custom-style="font-weight: 600;"/>
      </view>
      <van-checkbox
        checked-color="#FF4749" icon-size="18px" style="--checkbox-label-margin:5px;"
        :value="isNotCredits" @change="changeNotCreditsHandle" label-position="left"
      >
        <view style="color: #F84842;" v-html="formatPrice(not_creditsPrice)" ></view>
      </van-checkbox>
    </view>
  </view>
  <view class="pay_open">
    <view class="pay_btn fl_center" @click="buyVipHandle">
      <image src="https://file.y1b.cn/store/1-0/24628/667e0f3ae2005.png" mode="scaleToFill" class="pay_lab-img" ></image>
      <view style="margin-right: 8rpx;">{{ isOpenVip ? '立即开通' : '立即续费' }}</view>
      <view class="gesture_icon-box">
        <image src="https://file.y1b.cn/store/1-0/24124/65b0b0bca7769.png"
          mode="widthFix" class="gesture_icon"
        ></image>
      </view>
      <view v-html="formatPrice(buyPrice)"></view>
      <text class="pay_btn-lab">(原价<text style="text-decoration: line-through;">{{carInitPrice}}</text>)</text>
    </view>
    <view class="pay_txt fl_bet">
      <view class="pay_agree">
        <van-checkbox checked-color="#FF4749" icon-size="16px" style="--checkbox-label-margin:5px;"
          :value="isAgreement" @change="changeHandle">
          <text style="color: #999;">同意</text>
        </van-checkbox>
        <text style="color: #FF4749;margin-left: 8rpx;" @click="toAgreeLook('/agreement/savings-server.html')">省钱卡会员服务协议</text>
      </view>
      <view class="pay_lab fl_center">安心保障 · 不自动续费</view>
    </view>
  </view>
</view>
</template>
<script>
import { toAgreeLook, warpRectDom } from '@/utils/auth.js';
import { mapGetters } from "vuex";
export default {
  props: {
    tabHeightValue: {
      type: Number,
      default: 0
    },
    isNotCredits: {
      type: Boolean,
      default: false
    },
    isAgreement: {
      type: Boolean,
      default: false
    },
    isCreateLoading:{
      type: Boolean,
      default: false
    },
    isOpenVip: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters([
      "cardPrice",
      "not_creditsPrice",
      "car_initPrice"
    ]),
    buyPrice() {
      if(this.isNotCredits) return Number(this.cardPrice) + Number(this.not_creditsPrice);
      return this.cardPrice;
    },
    carInitPrice() {
      if(this.isNotCredits) return Number(this.car_initPrice) + Number(this.not_creditsPrice);
      return this.car_initPrice;
    },
    showTitleBgColor() {
      return this.showTitleBg ? '#FFC478' : '';
    },
  },
  data() {
    return { };
  },
  mounted() {
    setTimeout(async () => {
      const domBoxRes = await this.warpRectDom('payBottomDom');
      if(!domBoxRes) return;
      const domBoxHeight = domBoxRes.height;
      let system = uni.getSystemInfoSync();
      const contHeight = system.windowHeight - domBoxHeight;
      this.$emit('warpRectDom',{ contHeight, domBoxHeight});
    }, 2000);
  },
  methods: {
    toAgreeLook,
    warpRectDom,
    buyVipHandle() {
      this.$emit('buyVip');
    },
    changeNotCreditsHandle(event) {
      this.$emit('changeNotCredits', event.detail);
    },
    changeHandle(event) {
      this.$emit('change', event.detail);
    },
    openNoCreditsHandle() {
      this.$emit('openNoCreditsDia');
    },
    formatPrice(price) {
      price = Number(price).toString();
      if (!price) return;
      let splitPrice = price.split(".");
      return `
        <span style="font-weight:600;font-size: 24px">
          <span style="font-size: 13px;margin-right: -3px">¥</span>
          ${splitPrice[0]}.<span style="font-size: 14px;">${splitPrice[1]}</span>
        </span>`;
    }
  },
};
</script>

<style scoped lang="scss">
.pay_bottom {
    position: fixed;
    z-index: 9;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    bottom: var(--padding);
    .pay_open {
      background: #fff;
      border-radius: 40rpx 40rpx 0 0;
      overflow: hidden;
      padding-bottom: 20rpx;
      position: relative;
    }
    .pay_btn {
      height: 88rpx;
      margin: 36rpx 24rpx 16rpx;
      position: relative;
      z-index: 0;
      font-weight: 500;
      color: #fff;
      border-radius: 40rpx 40rpx 0 0;
      background: linear-gradient(to right, #FE433B 50%, #FF6102 100%);
      border-radius: 44rpx;
      line-height: 88rpx;
      transition: all .3s;
      // &::before {
      //   content: '立即开通';
      //   margin-right: 8rpx;
      // }
      .pay_lab-img{
        position: absolute;
        width: 272rpx;
        height: 46rpx;
        top: -22rpx;
        left: 4rpx;
      }
      &-lab {
        font-size: 24rpx;
        margin: 4rpx 0 0 8rpx;
        opacity: .8;
      }
    }
    .pay_txt {
      margin: 0 24rpx;
    }
    .pay_lab{
      font-size: 26rpx;
      color: #333;
      line-height: 36rpx;
      &::before {
        content: '\3000';
        background: url("https://file.y1b.cn/store/1-0/24627/667d41328ab21.png") 0 0 / 100% 100%;
        width: 22rpx;
        height: 26rpx;
        margin-right: 10rpx;
        display: block;
      }
      .pay_safe{
        width: 20rpx;
        height: 26rpx;
        margin-right: 10rpx;
      }
    }
    .pay_agree {
      font-size: 26rpx;
      text-align: center;
      color: #aaaaaa;
      line-height: 36rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
      white-space: nowrap;
    }
}
.no_credits {
  position: relative;
  z-index: 0;
  &::before {
    content: '\3000';
    background: url("https://file.y1b.cn/store/1-0/24628/667e1a27ad1aa.png") 0 0 / 100% 100%;
    width: 100%;
    height: 246rpx;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
  &-checkbox {
    width: 100%;
    padding: 16rpx 40rpx;
    box-sizing: border-box;
  }
  &-img {
    width: 204rpx;
    height: 38rpx;
    margin-right: 16rpx;
  }
}
.gesture_icon-box{
  position: absolute;
  z-index: 0;
  right: -16rpx;
  bottom: -36rpx;
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
    width: 70rpx;
    height: 70rpx;
    position: relative;
    transform: translate(16rpx, 16rpx);
    animation: gestureAnimation 1s linear infinite;
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
