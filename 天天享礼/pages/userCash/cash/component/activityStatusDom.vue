<template>
<view id="activityStatusDomRef" class="act_box" :style="{ height: actHeight + 'px' }">
  <view class="cash_top">
    <block v-if="!subIndex && ![4].includes(freeEnterPageStatus)">
      <view class="cash_title">
        页面内凑{{ orderNum }}单，<text style="color: #F84842;">必得</text>奖品
      </view>
      <view class="cash_time-txt">下单约2分钟后查看结果</view>
    </block>
    <block v-else-if="[1, 2, 3].includes(enterPageStatus)">
      <view class="cash_title">
        页面内下1单，最高开出<text style="color: #F84842;">{{ enterArr.max_profit }}</text>元红包
      </view>
      <view class="cash_time-txt">下单后约2分钟开出红包</view>
    </block>
    <block v-else>
      <view class="cash_title">
        页面内下1单，现金最高<text style="color: #F84842;">翻10倍</text>
      </view>
      <view class="cash_time-txt">下单后约2分钟可翻倍</view>
    </block>
  </view>
</view>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: {
    subIndex: {
      type: Number,
      default: 0
    },
    orderNum: {
      type: Number,
      default: 0
    },
    actHeight: {
      type: Number,
      default: 120
    }
  },
  data() {
    return { };
  },
  computed: {
    ...mapGetters(['enterArr', 'enterPageStatus', 'freeEnterPageStatus']),
  },
  mounted() {
    // this.$nextTick(()=> setTimeout(() => this.domFun(), 1000));
  },
  methods: {
    domFun(){
      this.initWarpRect('activityStatusDomRef').then(res=> {
        this.$emit('activityStatusDomRef', res);
      });
    },
    initWarpRect(id) {
      return new Promise(resolve => {
        setTimeout(() => { // 延时确保dom已渲染, 不使用$nextclick
          let query = uni.createSelectorQuery();
          // #ifndef MP-ALIPAY
          query = query.in(this) // 支付宝小程序不支持in(this),而字节跳动小程序必须写in(this), 否则都取不到值
          // #endif
          query.select('#' + (id || this.viewId)).boundingClientRect(data => {
            resolve(data)
          }).exec();
        }, 20)
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.act_box{
  overflow: hidden;
}
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
