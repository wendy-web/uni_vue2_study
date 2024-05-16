<template>
<van-popup
  :show="isShowStatus5"
  custom-style="background-color: transparent;overflow:visible;"
  :z-index="100"
  :catchtouchmove="true"
  @close="closeHandle"
>
  <view :class="['dia_cont', 'ani_active', isShowGetMoney ? 'profit_active' : '']">
    <view class="get_cash ani_first">
      <view class="cont_title ani_first">下单成功，现金翻倍中…</view>
      <view class="get_cash-num">
        <view class="cash_num-value">
          <p-countup
            :num="parseFloat(profitMoney).toFixed(2)"
            width="20" height='30' dotWidth="10"
            color="#58bf6a"
            fontSize="30"
            fontWeight="600"
            :isSetTimeAutoNum="isSetTimeAutoNum"
            ></p-countup>
          </view>
        </view>
    </view>
    <view class="get_cash ani_second">
      <image @click="getProfitMoneyHandle" class="finish_close" mode="aspectFit"
        src="https://file.y1b.cn/store/1-0/24124/65b0717ce9dcb.png"
      ></image>
      <view class="cont_title">恭喜您，现金已翻倍至{{ enterArr.finally_profit_money || 0 }}元</view>
      <view class="get_cash-num">
        <view class="cash_num-value">
          <view class="get_cash-active"></view>
          <p-countup
            :num="parseFloat(enterArr.finally_profit_money).toFixed(2)"
            width="20" height='30' dotWidth="10"
            color="#58bf6a"
            fontSize="30"
            fontWeight="600"
            ></p-countup>
          </view>
        </view>
        <image src="https://test-file.y1b.cn/store/1-0/24126/65b35aa931cd1.png"
          mode="scaleToFill" class="finish_ban"
          @click="getProfitMoneyHandle"
        ></image>
    </view>
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
import pCountup from './countUp.vue';
export default {
  mixins: [cashMixin], // 使用mixin
  components: {
    pCountup
  },
  data() {
    return {
      profitMoney: 0,
      isSetTimeAutoNum: 2000
    };
  },
  watch: {
    isShowStatus5(newVal) {
      if(!newVal) return;
      this.profitMoney = 0;
      setTimeout(() => {
        this.profitMoney = this.enterArr.finally_profit_money;
      }, 500);
    }
  },
  mounted() {
  },
  methods: {
  },
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
.cont_title{
  font-size: 40rpx;
  text-align: center;
  color: #fff8e1;
  line-height: 56rpx;
  text-shadow: 2rpx 2rpx 8rpx #fff;
  text-align: center;
  font-weight: 600;
  box-sizing: border-box;
  position: absolute;
  width: 750rpx;
  left: 50%;
  transform: translateX(-50%);
  padding: 0 72rpx;
  top: -140rpx;
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
    &::after {
      content: '”';
      position: absolute;
      top: 0;
      right: -20rpx;
    }
  }
}
.finish_close{
  width: 72rpx;
  height: 72rpx;
  position: absolute;
  right: 32rpx;
  top: -246rpx;
  z-index: 1;
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
  padding-top: 60rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
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
  &::after {
    content: '\3000';
    width: 100%;
    height: 100%;
    background: url("https://file.y1b.cn/store/1-0/24124/65b0663a3acaa.png") 0 0 / 100% 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: -1;
  }
  .cash_num-value{
    display: flex;
    &::after {
      content: '元';
      font-size: 32rpx;
      line-height: 2.6;
    }
  }
}
.get_cash {
  width: 750rpx;
  position: absolute;
  z-index: 0;
}
.finish_ban {
  width: 402rpx;
  height: 122rpx;
  display: block;
  position: absolute;
  left: 50%;
  bottom: -180rpx;
  transform: translateX(-50%);
}
.get_cash-active {
  &::before {
    content: '\3000';
    width: 366rpx;
    height: 148rpx;
    background: url("https://file.y1b.cn/store/1-0/24124/65b0a4ff8c854.png") 0 0 / 100% 100%;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 0;
  }
  &::after {
    content: '\3000';
    width: 106rpx;
    height: 46rpx;
    background: url("https://file.y1b.cn/store/1-0/24124/65b0a5693faf2.png") 0 0 / 100% 100%;
    position: absolute;
    top: -26rpx;
    right: -33rpx;
    z-index: 0;
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
.ani_active {
  .ani_first {
    animation: cashNmuTrans 3s linear 1s forwards;
    .cont_title {
      animation: opacityAni .2s linear 1s forwards;
    }
  }
  .ani_second {
    opacity: 0;
    animation: OpenOpacityAni .2s linear 3.8s forwards;
  }
  // .ani_second,
  // .get_cash-active,
  // .finish_ban,
  // .finish_close {
  //   opacity: 0;
  //   animation: OpenOpacityAni .2s linear 1.2s forwards;
  // }
  .get_money-box{
    opacity: 0;
  }
}
.profit_active {
  .finish_close {
    opacity: 0;
  }
  .get_cash {
    animation: opacityCloseAni .2s linear forwards;
  }
  .get_money-box {
    animation: opacityOpenAni .4s linear .2s forwards;
  }
}
</style>
