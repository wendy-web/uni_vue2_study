<template>
  <van-popup
    :show="isShowStatus1"
    :overlay="isShowStatusAni"
    @close="closeHandle"
    custom-style="background-color: transparent;overflow:visible;"
    :z-index="100"
    :catchtouchmove="true"
  >
    <view class="ani_active">
      <view class="cont_box" @click="closeHandle">
        <!-- 新人获取 / 新人商品 -->
        <view class="cont_title">
          <image :src="enterArr.image" mode="widthFix" class="cont_img" v-if="enterArr.image"></image>
          <!-- 恭喜你成为今日幸运用户 -->
          <view class="txt_ov_ell1">
            {{ enterArr.title ? `${enterArr.title}` : '恭喜你成为今日幸运用户' }}
          </view>
        </view>
        <image src="https://file.y1b.cn/store/1-0/24123/65af8de6995bb.png" mode="aspectFill" class="cash_bg"></image>
      </view>
      <!-- 红包 -->
      <view class="red_box" @click="closeHandle">
        <view class="cont_title">本页任意下1单，立得现金红包</view>
        <image src="https://file.y1b.cn/store/1-0/24123/65af9c020b5ae.png" mode="widthFix" class="red_bg"></image>
        <image src="https://file.y1b.cn/store/1-0/24123/65af9b5be9418.png" mode="widthFix" class="red_img"></image>
        <view class="cash_right-num">{{ enterArr.max_profit }}</view>
      </view>
    </view>
  </van-popup>
</template>
<script>
import cashMixin from '../static/cashMixin.js'; // 混入分享的混合方法
export default {
  mixins: [cashMixin],
  data() {
    return { };
  },
  mounted() {
  },
  methods: {
  },
};
</script>

<style lang="scss">
@import '../static/animation.scss';
.cont_box {
  width: 100%;
  position: relative;
  z-index: 0;
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
  &::after {
    content: '\3000';
    background: url("https://file.y1b.cn/store/1-0/24123/65af90d5ebfa9.png") 0 0 / cover;
    position: absolute;
    top: 50%;
    left: 0;
    width: 726rpx;
    height: 506rpx;
    transform: translateY(-50%);
  }
  .cont_title {
    top: -20rpx;
  }
}
.cash_bg {
  width: 100%;
  height: 538rpx;
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
.ani_active {
  width: 750rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  // 第一个红包背景
  .cash_bg {
    transform: scale(1, 0);
    animation: cashBgWidth .1s linear;
    animation-delay: .8s;
		animation-fill-mode: forwards;
  }
  .cont_box {
    // 关闭红包的icon的动画
    animation: cashCont .1s linear;
    animation-delay: 2.5s;
    animation-fill-mode: forwards;
    // 红包icon的图标从下到上的偏移
    &::after {
      opacity: 0;
      animation: cashIconTrans .2s linear;
      animation-delay: .9s;
		  animation-fill-mode: forwards;
    }
    .cont_title {
      // opacity: 0;
      transform: translate(-50%, -50%) scale(0);
      animation: titleScale .5s linear;
      animation-delay: .3s;
      animation-fill-mode: forwards;
    }
  }
  // 红包open动画
  .red_box {
    transform: scale(0);
    animation: cashContTrans 2s linear;
    animation-delay: 2.5s;
    animation-fill-mode: forwards;
    .cont_title {
      animation: opacityAni .2s linear 3.5s forwards;
    }
    .red_bg {
      animation: opacityAni .2s linear 3.5s forwards;
    }
  }
}

</style>
