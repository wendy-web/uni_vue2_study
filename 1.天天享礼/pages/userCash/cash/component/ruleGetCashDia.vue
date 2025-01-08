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
    <scroll-view
      class="rule_cont" scroll-y="true"
    >
    <!-- <view class="rule_cont"> -->
      <view class="rule_item">活动随机开放，具体以页面展示为准。</view>
      <block v-if="subIndex">
        <view class="rule_item">用户在活动页面下单，可得现金奖励。奖励领取到【我的】-【零钱】，可在次月30天后提现到微信零钱。</view>
        <view class="rule_item">用户用于获得现金奖励的订单若发生退款，平台将会对已发放到零钱的现金奖励进行回收。</view>
      </block>
      <block v-else>
        <view class="rule_item">用户在本活动页面规定的时间内完成指定下单任务，即可获得相应奖品。</view>
        <view class="rule_item">参与本活动的订单若发生退款，则该单不计入任务进度，系统会重新计算任务完成情况。若任务订单发生退款导致不满足发奖条件，将不予发放奖品。</view>
        <view class="rule_item">活动奖品会在完成下单任务后的次月月底陆续发放。请在活动目标达成后尽快填写收货信息，若在活动结束后10天内仍未填写收货信息，视为自动放弃该奖品，平台将不再发放。收货信息发生变更的，可在【活动记录】中修改，发货后不可再修改发货信息。</view>
      </block>


      <view class="rule_item">该活动的商品不参与其他优惠促销活动。</view>
      <block v-if="subIndex">
        <view class="rule_item">如出现不可抗力或情势变更的情况（包括但不限于重大灾害事件、活动受政府机关指令需要停止举办或调整的、活动遭受严重网络攻击或因系统故障需要暂停举办的），则主办方可依据相关法律法规的规定主张免责。</view>
      </block>
      <block v-else>
        <view class="rule_item">用户只可在达到规定的条件后，才能向活动方申请发放奖品。若中途因任何原因停止继续参与活动或存在违规行为的，将无法获得对应奖品。</view>
        <view class="rule_item">用户若对活动规则中的任何条款或活动过程中的相关页面信息有任何疑问的，可咨询客服。若不同意活动规则中的任何条款或对活动过程中的页面信息有异议的，请用户立即终止参与活动。</view>
      </block>
    <!-- </view> -->
      </scroll-view>
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
    },
    subIndex: {
      type: Number,
      default: 0
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
    color: #333;
  }
  .rule_cont {
    font-size: 26rpx;
    color: #666;
    line-height: 36rpx;
    margin-top: 40rpx;
    counter-reset: itemNum 0;
    max-height: 600rpx;
    position: relative;
    &::after {
      content: '\3000';
      position: absolute;
      width: 100%;
      height: 26rpx;
      left: 0;
      bottom: -2rpx;
      // background: transparent;
      background: linear-gradient(to bottom, rgba(#fff, .5), #fff 90%);
    }
    .rule_item {
      margin-bottom: 16rpx;
      &:last-child{
        margin-bottom: 26rpx;
      }
      &::before{
        content: counter(itemNum) '. ';
        counter-increment: itemNum;
      }
    }
  }
}
.pop_btn {
  line-height: 86rpx;
  width: 472rpx;
  font-size: 32rpx;
  text-align: center;
  color: #ffffff;
  margin: 36rpx auto 0;
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
