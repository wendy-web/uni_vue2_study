<template>
<van-popup
  :show="isShow"
  custom-style="background-color: transparent;overflow:visible;"
  :z-index="100"
  :catchtouchmove="true"
  @close="closeHandle"
>
  <view class="dia_cont">
    <!-- 单个红包open -->
    <view class="red_box ani_active">
      <image @click="closeHandle" class="finish_close" mode="aspectFit"
        src="https://file.y1b.cn/store/1-0/24124/65b0717ce9dcb.png"></image>
      <view class="cont_title">坚持一下，马上获得红包啦</view>
      <image src="https://file.y1b.cn/store/1-0/24123/65af9c020b5ae.png" mode="widthFix" class="red_bg" @click="closeHandle"></image>
      <view></view>
      <image src="https://test-file.y1b.cn/store/1-0/24126/65b31fb41f71f.png" mode="widthFix" class="red_img-top"></image>
      <image src="https://test-file.y1b.cn/store/1-0/24126/65b31ff081df0.png" mode="widthFix" class="red_img-bottom"></image>
      <view class="cash_right-num">{{ enterArr.max_profit }}</view>
      <image src="https://test-file.y1b.cn/store/1-0/2425/65c0a8c81c61e.png" mode="scaleToFill" class="finish_ban" @click.stop="buyOpenHandle"></image>
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
    return { };
  },
  mounted() {
  },
  methods: {
    closeHandle() {
      uni.navigateBack({
        fail() {
          uni.switchTab({
              url: '/pages/tabBar/shopMall/index'
          });
        }
      });
    },
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
  top: -98rpx;
  transform: translateX(-50%);
  padding: 0 72rpx;
}
.red_box {
  width: 512rpx;
  height: 640rpx;
  position: absolute;
  z-index: 0;
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
.finish_ban {
  width: 402rpx;
  height: 122rpx;
  position: absolute;
  bottom: -174rpx;
  left: 50%;
  transform: translateX(-50%);
}
.finish_close{
  width: 72rpx;
  height: 72rpx;
  position: absolute;
  right: -32rpx;
  top: -210rpx;
}
.ani_active {
  opacity: 0;
  transform: scale(0);
  animation: cashFinishAni .3s linear .3s forwards;
}
</style>
