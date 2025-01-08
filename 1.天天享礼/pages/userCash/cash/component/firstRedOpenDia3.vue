<template>
  <van-popup
    :show="isShowStatus3"
    custom-style="background-color: transparent;overflow:visible;"
    :z-index="100"
    :catchtouchmove="true"
  >
    <view :class="['dia_cont', 'ani_active', isShowGetMoney ? 'profit_active' : '']">
      <!-- 单个红包open -->
      <view class="red_box" @click="getProfitHandle(true)">
        <view class="cont_title">本页任意下1单，立得现金红包</view>
        <image src="https://file.y1b.cn/store/1-0/24123/65af9c020b5ae.png" mode="widthFix" class="red_bg"></image>
        <view></view>
        <image src="https://test-file.y1b.cn/store/1-0/24126/65b31fb41f71f.png" mode="widthFix" class="red_img-top"></image>
        <image src="https://test-file.y1b.cn/store/1-0/24126/65b31ff081df0.png" mode="widthFix" class="red_img-bottom"></image>
        <view class="cash_right-num">{{ enterArr.max_profit }}</view>
      </view>
      <view class="get_cash">
        <view class="cont_title">恭喜获得{{ enterArr.profit_money || 0 }}元现金</view>
        <view class="get_cash-num"> {{ enterArr.profit_money || 0 }}</view>
      </view>
      <!-- 幸运翻倍 -->
      <view class="double_box">
        <image src="https://file.y1b.cn/store/1-0/24123/65afa244ad25b.png" mode="widthFix" class="cash_ban"></image>
      </view>
      <!-- 现金翻倍 -->
      <view class="get_cash-finish">
        <image @click="getProfitHandle(true)" class="finish_close" mode="aspectFit"
          src="https://file.y1b.cn/store/1-0/24124/65b0717ce9dcb.png">
        </image>
        <view class="finish_num-list">
          <view class="finish_num-left">{{ enterArr.profit_money || 0 }}</view>
          <view class="finish_num-right">{{ enterArr.max_profit_money || 0 }}</view>
        </view>
        <image src="https://file.y1b.cn/store/1-0/24124/65b06dc555131.png" mode="scaleToFill" class="finish_ban" @click="getProfitHandle(false)"></image>
        <view class="finish_lab" @click="getProfitMoneyHandle">放弃翻倍，领取{{enterArr.profit_money || 0}}元</view>
      </view>
      <!-- 交互的领取红包显示 -->
      <view class="get_money-box">
        <view class="cash_title"><text style="color: #feeaa1; margin-right: 10rpx;">{{ enterArr.finally_profit_money || 0}}元</text> 现金领取成功！</view>
        <view class="cash_lab fl_center">我的现金</view>
        <view class="cash_num">{{ enterArr.finally_profit_money || 0 }}</view>
        <view class="cash_txt">已存入【我的】-【零钱】</view>
        <view class="pop_btn" @click="goToWithdrawHandle">前往查看</view>
        <view class="cash_bottom">退单将扣除现金奖励！</view>
      </view>
  </view>
  </van-popup>
</template>
<script>
import cashMixin from '../static/cashMixin.js'; // 混入分享的混合方法
export default {
  mixins: [cashMixin], // 使用mixin
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
  }
};
</script>
<style lang="scss" scoped>
@import '../static/animation.scss';
.dia_cont {
  width: 750rpx;
  position: relative;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.double_box {
  width: 100%;
  z-index: 0;
  position: absolute;
  &::before {
    content: '\3000';
    background: url("https://file.y1b.cn/store/1-0/24123/65af90425e5c4.png") 0 0 / cover;
    position: absolute;
    top: 50%;
    left: 0;
    width: 750rpx;
    height: 758rpx;
    transform: translateY(-50%);
  }
  .cash_ban{
    width: 750rpx;
    height: 538rpx;
  }
}
.get_money-box{
  box-sizing: border-box;
  width: 576rpx;
  background: #fff;
  border-radius: 24rpx;
  text-align: center;
  color: #333;
  padding: 56rpx 0 40rpx;
  position: absolute;
}
.cash_title {
  position: absolute;
  left: 55%;
  white-space: nowrap;
  transform: translateX(-50%);
  top: -104rpx;
  font-size: 48rpx;
  color: #FFF8E1;
}
.cash_bottom {
  position: absolute;
  left: 55%;
  white-space: nowrap;
  transform: translateX(-50%);
  bottom: -88rpx;
  font-size: 32rpx;
  color: #fff;
}
.cash_lab {
  font-size: 32rpx;
  text-align: center;
  font-weight: 600;
  &::before {
    content: '\3000';
    width: 46rpx;
    height: 40rpx;
    display: block;
    background: url("https://file.y1b.cn/store/1-0/24124/65b08393b5122.png") 0 0 / cover;
    margin-right: 10rpx;
  }
}
  .cash_num {
  font-size: 80rpx;
  margin-top: 34rpx;
  &::after {
    content: '元';
    font-size: 32rpx;
  }
}
.cash_txt{
  font-size: 28rpx;
  color: rgba(102,102,102,0.50);
  margin-top: 12rpx;
}
.pop_btn {
  line-height: 86rpx;
  width: 496rpx;
  background: #58bf6a;
  border-radius: 16rpx;
  font-size: 32rpx;
  text-align: center;
  color: #ffffff;
  margin: 60rpx auto 0;
}
.cont_title{
  font-size: 40rpx;
  text-align: center;
  color: #fff8e1;
  line-height: 56rpx;
  text-shadow: 2rpx 2rpx 8rpx #fff;
  text-align: center;
  font-weight: 600;
  width: 750rpx;
  box-sizing: border-box;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding: 0 72rpx;
  .cont_img {
    position: absolute;
    width: 112rpx;
    height: 112rpx;
    top: -120rpx;
    left: 50%;
    transform: translateX(-50%);
  }
  .txt_ov_ell1 {
    position: relative;
    &.active::after {
      content: '”';
      position: absolute;
      top: 0;
      right: -20rpx;
    }
  }
}
.get_cash {
  position: absolute;
  z-index: 0;
  .cont_title{
    top: -98rpx;
  }
  &::before {
    content: '\3000';
    width: 750rpx;
    height: 764rpx;
    background: url("https://file.y1b.cn/store/1-0/24124/65b0684d00ceb.png") 0 0 / 100% 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
  }
  .get_cash-num{
    width: 232rpx;
    height: 250rpx;
    font-size: 60rpx;
    color: #58bf6a;
    line-height: 180rpx;
    position: relative;
    z-index: 0;
    margin: 0 auto;
    text-align: center;
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
      font-size: 32rpx;
    }
  }
}
.get_cash-finish {
  width: 750rpx;
  height: 908rpx;
  position: relative;
  z-index: 0;
  &::before {
    content: '\3000';
    width: 750rpx;
    height: 908rpx;
    background: url("https://file.y1b.cn/store/1-0/24124/65b06a4678792.png") 0 0 / 100% 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
  }
  .finish_num-list {
    color: #58bf6a;
    font-weight: 600;
    padding-top: 362rpx;
    text-align: center;
    display: flex;
    justify-content: center;
    .finish_num-left {
      font-size: 60rpx;
      line-height: 84rpx;
      margin-top: 58rpx;
      min-width: 40%;
      &::after {
        content: '元';
        font-size: 32rpx;
      }
    }
    .finish_num-right{
      font-size: 88rpx;
      color: #58bf6a;
      min-width: 48%;
      &::after {
        content: '元';
        font-size: 36rpx;
      }
    }
  }
  .finish_ban {
    width: 402rpx;
    height: 120rpx;
    display: block;
    margin: 146rpx auto 0;
  }
  .finish_lab{
    font-size: 28rpx;
    text-decoration: underline;
    text-align: center;
    color: rgba(255,255,255,0.80);
    line-height: 40rpx;
    margin-top: 36rpx;
  }
  .finish_close{
    width: 72rpx;
    height: 72rpx;
    position: absolute;
    right: 32rpx;
    top: -96rpx;
  }
}
.red_box {
  width: 512rpx;
  height: 640rpx;
  position: absolute;
  z-index: 0;
  .cont_title {
    top: -98rpx;
  }
  .red_bg {
    width: 750rpx;
    height: 1376rpx;
    position: absolute;
    z-index: -1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .red_img-top{
    width: 100%;
    height: 535rpx;
    position: absolute;
    top: 0;
  }
  .red_img-bottom{
    width: 100%;
    height: 538rpx;
    position: absolute;
    bottom: 0;
  }
  .red_img {
    width: 100%;
    height: 100%;
  }
  &::before {
    content: '\3000';
    width: 276rpx;
    height: 26rpx;
    background: url("https://file.y1b.cn/store/1-0/24123/65af9c4c5ca7e.png") 0 0 / 100% 100%;
    position: absolute;
    top: -10rpx;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
  }
  &::after {
    content: '\3000';
    width: 276rpx;
    height: 26rpx;
    background: url("https://file.y1b.cn/store/1-0/24123/65af9c4c5ca7e.png") 0 0 / 100% 100%;
    position: absolute;
    bottom: -10rpx;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
  }
  .cash_right-num {
    color: #FEF6C8;
    font-size: 160rpx;
    font-weight: 600;
    position: absolute;
    left: 50%;
    top: 34rpx;
    transform: translateX(-50%);
    &::before {
      content: '最高';
      position: absolute;
      right: -64rpx;
      top: 45rpx;
      font-size: 24rpx;
      font-weight: 400;
      opacity: .5;
    }
    &::after {
      content: '元';
      position: absolute;
      right: -50rpx;
      bottom: 30rpx;
      font-size: 40rpx;
      font-weight: 400;
    }
  }
}
// 1, 1s 后红包向上下打开的动画
// 2, scaleIconAni
.ani_active {
  // animation: openRedAni 1s linear;
  // animation-delay: 1s;
  // animation-fill-mode: forwards;
  // 1后红包向上下打开的动画
  .red_img-top {
    animation: openRedTopAni .5s linear 1s forwards ;
  }
  .red_img-bottom {
    animation: openRedBottomAni .5s linear 1s forwards;
  }
  // 红包打开前 - 背景的装饰消失
  .red_box::before,
  .red_box::after,
  .cash_right-num,
  .cont_title,
  .red_bg {
    animation: opacityAni .2s linear 1s forwards;
  }
  // 现金打款的icon的显示
  .get_cash {
    transform: scale(0);
    animation: scaleIconAni 1.8s linear 1.2s forwards;
  }
  // 幸运翻倍的展示
  .double_box {
    opacity: 0;
    animation: contScaleAni 1s linear 2.9s forwards;
  }
  .get_cash-finish{
    opacity: 0;
    animation: cashFinishAni .4s linear 4s forwards;
    .finish_close,
    .finish_ban,
    .finish_lab {
      opacity: 0;
      animation: OpenOpacityAni .2s linear 4.6s forwards;
    }
  }
  .get_money-box{
    opacity: 0;
  }
}
.profit_active {
  .finish_close {
    opacity: 0;
  }
  .get_cash-finish {
    animation: opacityCloseAni .2s linear forwards;
  }
  .get_money-box {
    animation: opacityOpenAni .4s linear .2s forwards;
  }
}
</style>
