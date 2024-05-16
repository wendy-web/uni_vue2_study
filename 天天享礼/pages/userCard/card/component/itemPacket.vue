<template>
<view>
    <view class="use_title">
      <image class="card_icon" :src="cardImgUrl + 'card_icon1.png'"  mode="aspectFill" ></image>
      会员专享加量包
    </view>
    <view class="use_red-item fl_bet">
        <image src="https://file.y1b.cn/store/1-0/23113/6544a80455e4f.png" mode="scaleToFill" class="bg_img"></image>
        <view class="use_lab">5元红包×{{packNum}}张</view>
        <view class="use_item-left box_fl">
            <view class="item-left-price">
                <view>￥<text style="font-size: 48rpx">5</text></view>
                <view>无门槛</view>
            </view>
            <view class="item-left-cont">
                <view>省钱卡会员红包</view>
                <view class="item-left-lab">有效期至{{packTime}}</view>
                <view class="item-left-num">本单需叠加加量包使用</view>
            </view>
        </view>
        <view class="use_item-right box_fl">
            <!-- <view class="card_remind-dia">
                <image :src="cardImgUrl + 'redPayIndex_dia.png'" mode="scaleToFill" class="bg_img"></image>
                立减￥2.5
            </view> -->
            <!-- <view class="price_line">¥2.50</view> -->
            <view class="detail_price">
              <view> {{packCreditsNum}} 牛金豆</view>
              <view class="price_line-num">¥{{ 5 * packNum}}</view>
            </view>
            <van-checkbox
                checked-color="#FE9433"
                icon-size="18px"
                style="--checkbox-label-margin: 5px"
                :value="isSelectRedPacket"
                :disabled="isDisCheckbox"
                @change="changeSelHandle"
            ></van-checkbox>
        </view>
    </view>
</view>
</template>

<script>
import { getImgUrl } from "@/utils/auth.js";
export default {
  props: {
    packTime: {
      type: String,
      default: 0,
    },
    packNum: {
      type: Number,
      default: 6
    },
    isDisCheckbox: {
      type:Boolean,
      default: false
    },
    isSelectRedPacket: {
      type: Boolean,
      default: true
    },
    packCreditsNum: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      mgUrl: getImgUrl(),
      cardImgUrl:`${getImgUrl()}static/card/`,
    };
  },
  methods: {
    changeSelHandle(event) {
      this.$emit("change", event.detail);
    },
  },
};
</script>

<style scoped lang="scss">
.card_icon {
  width: 32rpx;
  height: 30rpx;
  margin-right: 4rpx;
}
.use_lab {
  position: absolute;
  font-size: 24rpx;
  font-weight: 500;
  text-align: center;
  color: #652a08;
  line-height: 34rpx;
  right: 33rpx;
  top: 8rpx;
}
.card_remind-dia {
  position: absolute;
  right: 0;
  top: -38rpx;
  height: 38rpx;
  line-height: 32rpx;
  padding: 0 10rpx;
  font-size: 24rpx;
  color: #fff;
}
.use_title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
  line-height: 44rpx;
  margin-bottom: 24rpx;
}
.use_red-item {
  position: relative;
  z-index: 0;
  margin-bottom: 24rpx;
  padding-right: 32rpx;
  &.red-items {
    background: #f4f0ec;
    border-radius: 24rpx;
    margin: 0 16rpx 16rpx;
  }
  &.active {
    margin-bottom: 50rpx;
    &::before {
      content: "\3000";
      width: 678rpx;
      height: 58rpx;
      background: #f8f1e8;
      border-radius: 24rpx;
      position: absolute;
      z-index: -1;
      left: 50%;
      bottom: -29rpx;
      transform: translateX(-50%);
    }
  }
}
.use_item-left {
  padding: 28rpx 0;
  .item-left-price {
    margin: 0 48rpx 0 36rpx;
    font-size: 26rpx;
    text-align: center;
    color: #fe423d;
    line-height: 36rpx;
  }
  .item-left-cont {
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
    line-height: 42rpx;
  }
  .item-left-lab {
    font-size: 26rpx;
    color: #999;
    margin-top: 8rpx;
  }
  .item-left-num {
    font-size: 24rpx;
    color: #666;
    margin-top: 56rpx;
  }
}
.use_item-right {
  position: relative;
  line-height: 42rpx;
}
.detail_price {
  margin: 0 15rpx 0 4rpx;
  font-size: 24rpx;
  color: #fe423d;
  position: relative;
}
.price_line-num {
  position: absolute;
  width: 100%;
  text-align: right;
  font-size: 26rpx;
  text-decoration:  line-through;;
  color: #999;
  line-height: 36rpx;
}
</style>
