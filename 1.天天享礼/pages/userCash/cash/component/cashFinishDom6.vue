<template>
<view class="cash_top" id="cashFinishDom6Ref">
  <view class="cash_title">已领取<text style="color: #F84842;">{{ enterArr.profit_money || 0 }}</text>元</view>
  <view class="get_cash-num">
    <view class="get_cash-active"></view>
    {{ enterArr.profit_money || 0 }}
  </view>
  <view class="cash_txt">已存入【我的】-【零钱】</view>
</view>
</template>

<script>
import cashMixin from '../static/cashMixin.js'; // 混入分享的混合方法
export default {
  mixins: [cashMixin], // 使用mixin
  props: {
  },
  data() {
    return { };
  },
  mounted() {
    this.$nextTick(()=> setTimeout(() => this.domFun(), 1000));
  },
  methods: {
    domFun(){
      this.initWarpRect('cashFinishDom6Ref').then(res=> {
        this.$emit('cashFinishDom6Ref', res);
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
.cash_top{
  background: rgba(255,255,255,0.65);
  border: 3rpx solid #ffffff;
  border-radius: 32rpx;
  backdrop-filter: blur(12rpx);
  margin: 32rpx 16rpx;
  padding: 32rpx;
  box-sizing: border-box;
  text-align: center;
  .cash_title {
    font-size: 34rpx;
    color: #9d4218;
    line-height: 72rpx;
    text-align: center;
  }
}
.get_cash-num{
  width: 272rpx;
  height: 310rpx;
  font-size: 88rpx;
  color: #58bf6a;
  position: relative;
  z-index: 0;
  margin: 20rpx auto 0;
  line-height: 220rpx;
  &::before {
    content: '\3000';
    width: 100%;
    height: 100%;
    background: url("https://file.y1b.cn/store/1-0/24124/65b0663a3acaa.png") 0 0 / 100% 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: -1;
  }
  &::after {
    content: '元';
    font-size: 36rpx;
  }
  .get_cash-active{
    &::after {
      content: '\3000';
      width: 106rpx;
      height: 46rpx;
      background: url("https://test-file.y1b.cn/store/1-0/2426/65c1f9b2c8177.png") 0 0 / 100% 100%;
      position: absolute;
      top: -26rpx;
      right: -33rpx;
      z-index: -1;
    }
  }
}
.cash_txt {
  font-size: 28rpx;
  color: rgba(102,102,102,0.50);
  line-height: 40rpx;
  margin-top: 40rpx;
}
</style>
