<template>
  <van-popup
    :show="isShow"
    custom-style="background-color: transparent;overflow:visible;"
    :z-index="100"
    :catchtouchmove="true"
    @close="$leftBack"
  >
    <view class="dia_cont ani_active">
      <!-- 现金翻倍 -->
      <view class="get_cash-finish">
        <image @click="closeHandle" class="finish_close" mode="aspectFit"
          src="https://file.y1b.cn/store/1-0/24124/65b0717ce9dcb.png">
        </image>
        <view class="finish_num-list">
          <view class="finish_num-left">{{ enterArr.profit_money || 0 }}</view>
          <view class="finish_num-right">{{ enterArr.max_profit_money || 0 }}</view>
        </view>
        <image src="https://test-file.y1b.cn/store/1-0/2426/65c18ec064f1a.png" mode="scaleToFill"
          class="finish_ban" @click="buyOpenHandle"></image>
      </view>
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
    enterArr: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
    };
  },
  mounted() { },
  methods: {
    buyOpenHandle() {
      this.$emit('buyOpen');
    }
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
.get_cash-finish {
  width: 750rpx;
  height: 908rpx;
  position: relative;
  z-index: 0;
  &::before {
    content: '\3000';
    width: 750rpx;
    height: 908rpx;
    background: url("https://test-file.y1b.cn/store/1-0/2426/65c18ea377b2b.png") 0 0 / 100% 100%;
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
    margin: 166rpx auto 0;
  }
  .finish_close{
    width: 72rpx;
    height: 72rpx;
    position: absolute;
    right: 32rpx;
    top: -96rpx;
  }
}
.ani_active {
  .get_cash-finish{
    opacity: 0;
    transform: scale(0);
    animation: cashFinishAni .3s linear .3s forwards;
  }
  // 1后红包向上下打开的动画
  // .red_img-top {
  //   animation: openRedTopAni .5s linear 1s forwards ;
  // }
  // .red_img-bottom {
  //   animation: openRedBottomAni .5s linear 1s forwards;
  // }
  // .cash_right-num,
  // .red_bg {
  //   animation: opacityAni .2s linear 1s forwards;
  // }
  // .get_cash-finish{
  //   opacity: 0;
  //   animation: cashFinishAni .4s linear 4s forwards;
  //   .finish_close,
  //   .finish_ban{
  //     opacity: 0;
  //     animation: OpenOpacityAni .2s linear 4.6s forwards;
  //   }
  // }
}
</style>
