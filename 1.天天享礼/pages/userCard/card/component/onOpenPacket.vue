<template>
  <view class="card_top">
    <view class="card_top-title">
      {{ isShowFeature ? cardTypeText : '使用加量包'}}
      ，本单立省 <text class="txf84842">{{ saving_money }}</text>元
    </view>
    <view class="card_remind fl_bet">
        <view class="card_remind-left">
          无门槛红包<text style="color: #f84842; margin-left: 10rpx">5元*{{packNum}}张</text>
        </view>
        <view class="card_remind-right box_fl">
            <view class="card_remind-dia" v-if="isShowFeature">
              <image :src="cardImgUrl + 'redPayIndex_dia.png'" mode="scaleToFill" class="bg_img"></image>
              立减￥{{ isShowFeature ? 11.10 : priceNum }}
            </view>
            <view class="price_line">￥{{ isShowFeature ? 15.00 : priceNum }}</view>
            <view v-html="formatPrice(isShowFeature ? 3.9 : 0, 2)" class="detail_price" v-if="isShowFeature"></view>
            <view class="detail_price" v-else-if="Number(packCreditsNum)">{{ packCreditsNum }}牛金豆</view>
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
    <redPackList :packNum="packNum" :selVipIndex="cardType"></redPackList>
    <view class="pay_lab box_fl">
      <image
        :src="cardImgUrl + 'pay_safe.png'"
        mode="scaleToFill"
        class="pay_safe"
      ></image>
      <text>安心保障 · 不自动续费</text>
    </view>
  </view>
</template>
<script>
import { formatPrice, getImgUrl } from "@/utils/auth.js";
import redPackList from './redPackList.vue';
export default {
  components: {
    redPackList
  },
  props: {
    saving_money: {
      type: Number,
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
    isShowFeature: {
      type:Boolean,
      default: true
    },
    packCreditsNum: {
      type: Number,
      default: 0
    },
    cardType: {
      type: Number,
      default: 0
    }
  },
  computed: {
    priceNum() {
      return (this.packNum*5).toFixed(2);
    },
    cardTypeText() {
      let txt = '月';
      switch(this.cardType){
        case 0:
          txt = '月';
          break;
        case 1:
          txt = '季';
          break;
        case 2:
          txt = '年';
          break;
      }
      return `开通${txt}卡`;
    }
  },
  data() {
    return {
      mgUrl: getImgUrl(),
      cardImgUrl:`${getImgUrl()}static/card/`,
    };
  },
  methods: {
    formatPrice,
    changeSelHandle(event) {
        this.$emit("change", event.detail);
    }
  },
};
</script>

<style scoped lang="scss">
@import "@/static/css/mixin.scss";
.card_top {
  margin: 32rpx 24rpx 0;
  position: relative;
  z-index: 0;
  padding: 40rpx 0;
  background: #fdf7e8;
  border-radius: 24rpx;
  font-size: 28rpx;
  color: #333;
  .card_top-title {
    font-size: 40rpx;
    font-weight: 900;
    text-align: left;
    line-height: 52rpx;
    padding: 0 24rpx;
  }
  .card_remind {
    position: relative;
    margin: 54rpx 0 24rpx;
    padding: 0 24rpx;
    .card_remind-right {
      line-height: 40rpx;
    }
  }
}
.pay_lab{
    padding: 0 24rpx;
}
.card_remind-left{
    font-weight: 600;
}
.card_remind-dia {
    position: absolute;
    right: 24rpx;
    top: -38rpx;
    height: 38rpx;
    line-height: 32rpx;
    padding: 0 10rpx;
    font-size: 24rpx;
    color: #fff;
}
.detail_price {
  color: #f84842;
  margin: 0 20rpx 0 15rpx;
}
</style>
