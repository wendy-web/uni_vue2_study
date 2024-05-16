<template>
<view class="use_red-box">
    <view class="use_red-item fl_bet"
        :class="[((itemHas.len > 1) && !isScroll) ? 'active' : '']"
    >
        <image src="https://file.y1b.cn/store/1-0/23113/6544a80455e4f.png" mode="scaleToFill" class="bg_img" v-if="Number(itemHas.money)>=5"></image>
        <image src="https://file.y1b.cn/store/1-0/23112/65437f678ea99.png" mode="scaleToFill" class="bg_img" v-else></image>
        <view class="use_lab" v-if="Number(itemHas.money)>=5">5元红包×{{itemHas.len}}张</view>
        <view class="item-left-price">
            <view>￥<text style="font-size: 48rpx">{{itemHas.money}}</text></view>
            <view>无门槛</view>
            <view class="sub_cont" v-if="itemHas.use_money">
                <image src="https://file.y1b.cn/store/1-0/23112/65434f4054263.png" mode="scaleToFill" class="bg_img" ></image>
                用￥{{ itemHas.use_money || 0 }}
            </view>
        </view>
        <view class="use_item-right">
            <view class="fl_bet">
            <view class="item-left-cont">
                <view>{{itemHas.title}}</view>
                    <view class="item-left-lab">有效期至{{ itemHas.time }}</view>
                    <view class="item-left-num box_fl" @click="isScroll = !isScroll" v-if="!itemHas.use_money">
                        本单已用<text style="color: #fe423d">{{itemHas.len}}</text>张
                        <view :class="['van_icon', isScroll ? 'active' : '']" v-if="itemHas.list.length">
                            <van-icon name="arrow-up" color="#666"/>
                        </view>
                    </view>
                </view>
                <van-checkbox
                    checked-color="#FE9433"
                    icon-size="18px"
                    style="--checkbox-label-margin: 5px"
                    :value="isSelectRedPacket"
                    :disabled="isDisCheckbox"
                    @change="changeSelHandle"
                    class="check_box"
                ></van-checkbox>
            </view>
            <view class="sub_lab" v-if="itemHas.use_money">
                本单使用¥{{itemHas.use_money || 0}}，剩¥{{itemHas.hav_money || 0}}下次可用
            </view>
        </view>
    </view>
    <view :class="['itemHas_box', isScroll ? 'active' : '']">
        <view class="use_red-item red-items fl_bet"
            v-for="(itemList, idx) in itemHas.list"
            :key="idx"
        >
            <view class="item-left-price">
                <view class="opacity7">￥ <text style="font-size: 48rpx">{{itemList.money}}</text> </view>
                <view class="opacity7">无门槛</view>
                <view class="sub_cont " v-if="itemList.use_money">
                    <image src="https://file.y1b.cn/store/1-0/23112/65434f4054263.png" mode="scaleToFill" class="bg_img" ></image>
                    用￥{{ itemList.use_money || 0 }}
                </view>
            </view>
            <view class="use_item-right">
                <view class="fl_bet opacity7">
                    <view class="item-left-cont">
                    <view>{{itemList.title}}</view>
                        <view class="item-left-lab">有效期至{{itemList.time}}</view>
                    </view>
                    <van-checkbox
                        checked-color="#FE9433"
                        icon-size="18px"
                        style="--checkbox-label-margin: 5px"
                        :value="isSelectRedPacket"
                        :disabled="isDisCheckbox"
                    ></van-checkbox>
                </view>
                <view class="sub_lab" v-if="itemList.use_money">
                    本单使用¥{{itemList.use_money || 0}}，剩¥{{itemList.hav_money || 0}}下次可用
                </view>
            </view>
        </view>
    </view>
</view>
</template>

<script>
import { getImgUrl } from "@/utils/auth.js";
export default {
    props: {
        itemHas: {
            type: Object,
            default: {}
        },
        isSelectRedPacket: {
            type: Boolean,
            default: false
        },
        isDisCheckbox: {
            type:Boolean,
            default: false
        },
    },
    data() {
        return {
            mgUrl: getImgUrl(),
            cardImgUrl:`${getImgUrl()}static/card/`,
            isScroll: true
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
.itemHas_box {
    height: 0;
    transition: all 2s;
    &.active {
        height: auto;
    }
}
.van_icon {
    transition: all 0.3s;
    transform: rotate(180deg);
    &.active {
        transform: rotate(0);
    }
}
.opacity7 {
    opacity: .7;
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
    // opacity: .7;
    .sub_lab{
        // color: #f89894;
        margin-top: 20rpx;
    }
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
    .sub_lab{
        font-size: 24rpx;
        color: #fe423d;
        line-height: 34rpx;
        padding-top: 20rpx;
        border-top: 1rpx solid #e9e9e9;
        margin-top: 56rpx;
    }

}
.use_lab {
  position: absolute;
  font-size: 24rpx;
  font-weight: 500;
  text-align: center;
  color: #652a08;
  line-height: 38rpx;
  right: 33rpx;
  top: 8rpx;
}
.use_item-left {
  padding: 28rpx 0;
}
  .item-left-price {
    margin: 0 48rpx 0 36rpx;
    font-size: 26rpx;
    text-align: center;
    color: #fe423d;
    line-height: 36rpx;
    .sub_cont {
        height: 38rpx;
        font-size: 24rpx;
        color: #fff;
        line-height: 42rpx;
        padding: 0 16rpx;
        position: relative;
        z-index: 0;
        margin-top: 20rpx;
        opacity: 1;
    }
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
  .use_item-right{
    flex: 1;
    padding: 28rpx 0;
}
</style>