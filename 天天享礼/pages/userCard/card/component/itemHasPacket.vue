<template>
<view>
    <view class="use_red-item fl_bet"
        :class="[item.len > 1 ? 'active' : '']"
        v-for="(item, index) in havArr"
        :key="index"
    >
        <image src="https://file.y1b.cn/store/1-0/23113/6544a80455e4f.png" mode="scaleToFill" class="bg_img" v-if="Number(item.money) >= 5"></image>
        <image src="https://file.y1b.cn/store/1-0/23112/65437f678ea99.png" mode="scaleToFill" class="bg_img" v-else></image>
        <view class="use_lab" v-if="Number(item.money) >= 5">5元红包×{{ item.len }}张</view>
        <view class="use_item-left box_fl">
            <view class="item-left-price">
                <view>￥<text style="font-size: 48rpx">{{item.money}}</text></view>
                <view>无门槛</view>
            </view>
            <view class="item-left-cont">
                <view>{{item.title}}</view>
                <view class="item-left-lab">有效期至{{ item.time }}</view>
                <view class="item-left-num"> 还剩<text style="color: #fe423d">{{ item.len }}</text>张</view>
            </view>
        </view>
    </view>
</view>
</template>

<script>
import { getImgUrl } from "@/utils/auth.js";
export default {
    props: {
        havArr: {
            type: Array,
            default: []
        },
    },
    data() {
        return {
            mgUrl: getImgUrl(),
            cardImgUrl:`${getImgUrl()}static/card/`,
        };
    },
    methods: {
    },
};
</script>

<style scoped lang="scss">
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
</style>