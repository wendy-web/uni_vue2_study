<template>
<view class="cash_top">
  <view class="cash_title">
    页面内下1单，
    <block v-if="[1, 2, 3].includes(enterPageStatus)">
      最高开出<text style="color: #F84842;">{{ enterArr.max_profit }}</text>元红包
    </block>
    <block v-else>
      现金最高<text style="color: #F84842;">翻10倍</text>
    </block>
  </view>
  <view class="cash_time-txt">下单后约2分钟开出红包</view>
</view>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return { };
  },
  computed: {
    ...mapGetters(['enterArr', 'enterPageStatus']),
  },
  mounted() {
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.cash_top{
  background: rgba(255,255,255,0.65);
  border-radius: 32rpx;
  backdrop-filter: blur(12rpx);
  margin: 32rpx 16rpx;
  padding: 32rpx;
  box-sizing: border-box;
  text-align: center;
  transform: all 1s;
  transition-duration: .1s;
  overflow: hidden;
  border: 3rpx solid #fff;
  .cash_title {
    font-size: 34rpx;
    color: #9d4218;
    line-height: 72rpx;
    text-align: center;
  }
}
@keyframes heightAni {
  0% {
    height: 0;
  }
  100% {
    height: auto;
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
</style>
