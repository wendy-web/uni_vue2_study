<template>
<van-popup
  :show="isShow"
  custom-style="background-color: transparent;overflow:visible;"
  :z-index="100"
  @close="closeHandle"
  :catchtouchmove="true"
>
  <view class="cont_box">
    <image @click="closeHandle" class="close_icon" mode="aspectFit"
    src="https://file.y1b.cn/store/1-0/24124/65b0717ce9dcb.png"></image>
    <view class="rule_title">活动规则</view>
    <view class="rule_cont">
      <view class="rule_item">1. 活动随机开放，具体以页面展示为准。</view>
      <view class="rule_item">2. 用户在活动页面下单，可得现金奖励。奖励领取到【我的】-【零钱】，可在次月30天后提现到微信零钱。</view>
      <view class="rule_item">3. 用户用于获得现金奖励的订单若发生退款，平台将会对已发放到零钱的现金奖励进行回收。</view>
      <view class="rule_item">4. 该活动的商品不参与其他优惠促销活动。</view>
      <view class="rule_item">5. 如出现不可抗力或情势变更的情况（包括但不限于重大灾害事件、活动受政府机关指令需要停止举办或调整的、活动遭受严重网络攻击或因系统故障需要暂停举办的），则主办方可依据相关法律法规的规定主张免责。</view>
    </view>
    <view class="pop_btn" @click="closeHandle">知道了</view>
  </view>
</van-popup>
</template>
<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    };
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
.cont_box {
  box-sizing: border-box;
  position: relative;
  width: 622rpx;
  border-radius: 40rpx;
  background: #fff;
  color: #333;
  padding: 40rpx;
  .rule_title {
    font-weight: 600;
    font-size: 36rpx;
    text-align: center;
    color: #333333;
  }
  .rule_cont {
    font-size: 26rpx;
    color: #666666;
    line-height: 36rpx;
    margin-top: 40rpx;
    .rule_item {
      margin-bottom: 16rpx;
    }
  }
}
.pop_btn {
  line-height: 86rpx;
  width: 472rpx;
  font-size: 32rpx;
  text-align: center;
  color: #ffffff;
  margin: 56rpx auto 0;
  background: #f84842;
  border-radius: 20rpx;
}
.close_icon {
  width: 72rpx;
  height: 72rpx;
  position: absolute;
  right: -32rpx;
  top: -96rpx;
}
</style>
