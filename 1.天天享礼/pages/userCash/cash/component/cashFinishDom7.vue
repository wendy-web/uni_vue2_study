<template>
<view class="activity" id="cashFinishDom7Ref">
  <image src="https://file.y1b.cn/store/1-0/24124/65b0af9adab79.png" mode="scaleToFill" class="act_img"></image>
  <view class="act_btn">
    下次活动通知我
    <image src="https://file.y1b.cn/store/1-0/24124/65b0b0bca7769.png"
        mode="widthFix" class="gesture_icon"
      ></image>
  </view>
</view>
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
    this.$nextTick(()=> setTimeout(() => this.domFun(), 1000));
  },
  methods: {
    domFun(){
      this.initWarpRect('cashFinishDom7Ref').then(res=> {
        this.$emit('cashFinishDom7Ref', res);
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
.activity {
  overflow: hidden;
  .act_img {
    width: 324rpx;
    height: 48rpx;
    display: block;
    margin: 68rpx auto 0;
  }
  .act_btn {
    width: 244rpx;
    height: 64rpx;
    border: 1rpx solid rgba(248,72,66,0.50);
    border-radius: 16rpx;
    font-size: 28rpx;
    text-align: center;
    color: #f84842;
    line-height: 64rpx;
    position: relative;
    margin: 32rpx auto 48rpx;
    position: relative;
    .gesture_icon {
      width: 58rpx;
      height: 66rpx;
      position: absolute;
      bottom: -33rpx;
      transform: translate(16rpx, 16rpx);
      animation: gestureAnimation 1s linear infinite;
    }
  }
}

@keyframes gestureAnimation {
	0% {
    transform: translate(16rpx, 16rpx);
	}
	50% {
    transform: translate(0,0);
	}
	100% {
    transform: translate(16rpx, 16rpx);
	}
}
</style>
