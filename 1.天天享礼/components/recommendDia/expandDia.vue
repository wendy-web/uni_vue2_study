<template>
<van-popup
  :show="isShow"
  custom-style="overflow: visible;background: transparent;"
  round
  :z-index="100"
  :safe-area-inset-bottom="false"
  :catchtouchmove="true"
>
	<view :class="['cont_box', isShowBack ? 'active' : '']">
    <!-- 膨胀前样式 -->
    <view :class="['front_box', !isShowBack ? 'active' : '']">
      <view class="front_box-title">膨胀优惠券</view>
      <view class="cont_text fl_center">
        <view class="cont_left">{{ couponPrice }}</view>
        <image class="cont_mid" mode="scaleToFill"
          src="https://file.y1b.cn/store/1-0/231211/65767f50712e7.png"
        ></image>
        <view class="cont_right">
          <image class="bg_img" mode="scaleToFill"
            src="https://file.y1b.cn/store/1-0/231211/65767766dd720.png"
          ></image>
          {{ showExpandNum }}
        </view>
      </view>
      <view class="front_btn" @click="expandHandle">立即膨胀</view>
      <image class="close_icon" mode="scaleToFill" v-if="!isShowBack"
        src="https://file.y1b.cn/store/1-0/23118/654b29f0188a0.png"
        @click="popupClose"
      ></image>
    </view>
    <view :class="['back_box', isShowBack ? 'active' : '']">
      <image class="back_title" mode="scaleToFill"
        src="https://file.y1b.cn/store/1-0/231211/657683f3d54de.png"
      ></image>
      <view class="back_cont" @click="goToUseHandle">
        <view class="back_lab">优惠券已膨胀至</view>
        <view class="back_expand">{{ expandFaceValue }}</view>
        <view class="back_dis">膨胀专享</view>
        <image class="back_btn heartBeat_btn" mode="scaleToFill"
          src="https://file.y1b.cn/store/1-0/231211/657685cd4c19d.png"
        ></image>
      </view>
      <image class="close_icon" mode="scaleToFill" v-if="isShowBack"
        src="https://file.y1b.cn/store/1-0/23118/654b29f0188a0.png"
        @click="popupClose"
      ></image>
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
	    couponPrice: {
        type: Number,
        default: 0
      },
      expandFaceValue: {
        type: Number,
        default: 0
      }
    },
	data() {
		return {
      showExpandNum: 0,
      isShowBack: false
		}
	},
  watch: {
    isShow(newValue) {
      if(!newValue) return;
      this.showExpandNum = 0;
      this.isShowBack = false;
      this.gradualAnimation(this.expandFaceValue, 100);
    }
  },
  mounted() {
  },
	methods: {
		popupClose() {
			this.$emit("close");
		},
    onConfirm() {
			this.$emit("confirm");
    },
    gradualAnimation(targetValue, duration) {
      let currentValue = 0;
      const totalSteps = targetValue;
      let step = targetValue / duration;
      // let intervalDuration = duration / totalSteps * 10;
      let intervalDuration =  10;
      // if(step < 1) intervalDuration = 10;
      const interval = setInterval(() => {
        currentValue = Math.ceil(currentValue + step);
        this.showExpandNum = currentValue;
        if (currentValue >= targetValue) {
          this.showExpandNum = targetValue;
          clearInterval(interval);
        }
      }, intervalDuration);
    },
    expandHandle() {
      this.isShowBack = true;
      this.$emit('expand')
    },
    goToUseHandle() {
      this.$emit('goToUse');
    }
	}
}
</script>

<style scoped lang="scss">
@import '@/static/css/mixin.scss';
.cont_box {
  display: flex;
  justify-content: center;
  width: 622rpx;
  color: #333;
  min-height: 574rpx;
  position: relative;
  perspective: 1000rpx; /* 定义观察点的距离 */
  &.active {
    .front_box {
      transform: rotateY(-180deg);
    }
    .back_box {
      transform: rotateY(0deg);
    }
  }
  .front_box,.back_box {
    box-sizing: border-box;
    position: absolute;
    backface-visibility: hidden; /* 隐藏背面 */
    border-radius: 24rpx;
  }
  .front_box {
    width: 100%;
    background: #FFFAE9;
    z-index: 2;
    transform: rotateY(0deg);
    transition: transform 0.3s;
    padding: 40rpx 0;
    opacity: 0;
    &.active {
      opacity: 1;
    }
    .front_box-title {
      font-size: 40rpx;
      text-align: center;
      color: #333;
      line-height: 56rpx;
      position: relative;
      z-index: 0;
      margin-top: 8rpx;
      &::before {
        content: '\3000';
        background: url("https://file.y1b.cn/store/1-0/231211/65766e1ed0f5c.png") 0 0 / cover;
        width: 248rpx;
        height: 26rpx;
        position: absolute;
        bottom: -4rpx;
        left: 50%;
        transform: translateX(-50%);
        z-index: -1;
      }
    }
  }
  .back_box {
    transform: rotateY(180deg);
    transition: transform 0.3s;
    opacity: 0;
    &.active {
      opacity: 1;
      .back_cont::after {
        transform: translateX(-50%) scale(1);
      }
    }
  }
}
.back_title{
  width: 236rpx;
  height: 74rpx;
  display: block;
  margin: 0 auto 40rpx;
}
.back_cont {
  width: 546rpx;
  height: 600rpx;
  position: relative;
  z-index: 0;
  box-sizing: border-box;
  text-align: center;
  &::before {
    content: '\3000';
    background: url("https://file.y1b.cn/store/1-0/231211/657684269e242.png") 0 0 / cover;
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: -1;
  }
  &::after {
    content: '\3000';
    background: url("https://file.y1b.cn/store/1-0/231211/6576a2eaaeaae.png") 0 0 / cover;
    width: 658rpx;
    height: 432rpx;
    position: absolute;
    top: 55rpx;
    left: 50%;
    transition: all .4s;
    transform: translateX(-50%) scale(0);
    z-index: 0;
  }
  .back_lab {
    font-size: 32rpx;
    text-align: center;
    color: rgba(246,71,32,0.60);
    line-height: 44rpx;
    padding-top: 68rpx;
  }
  .back_expand{
    font-size: 120rpx;
    text-align: center;
    color: #f64720;
    &::before {
      content: '￥';
      font-size: 60rpx;
    }
  }
  .back_dis{
    font-size: 32rpx;
    color: #f64720;
  }
  .back_btn{
    width: 394rpx;
    height: 124rpx;
    display: block;
    margin: 122rpx auto 0;
  }
}
.close_icon {
  width: 60rpx;
  height: 60rpx;
  position: absolute;
  bottom: -120rpx;
  left: 50%;
  transform: translateX(-50%);
}
.cont_text{
  margin: 46rpx auto 62rpx;
  color: #f64720;
  text-align: center;
  .cont_left{
    width: 180rpx;
    height: 188rpx;
    flex: 0 0 180rpx;
    box-sizing: border-box;
    position: relative;
    z-index: 0;
    font-size: 48rpx;
    padding-top: 26rpx;
    margin-top: 34rpx;
    &::before {
      content: '￥';
      font-size: 26rpx;
    }
    &::after {
      content: '\3000';
      background: url("https://file.y1b.cn/store/1-0/231211/65766fb98d3e4.png") 0 0 / cover;
      width: 100%;
      height: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: -1;
    }
  }
  .cont_mid{
    width: 72rpx;
    height: 44rpx;
    flex: 0 0 72rpx;
    margin-left: 8rpx;
    margin-top: -8rpx;
  }
  .cont_right {
    min-width: 200rpx;
    height: 234rpx;
    position: relative;
    z-index: 0;
    font-size: 60rpx;
    padding: 26rpx 70rpx 0;
    margin-left: -12rpx;
    .bg_img {
      margin-left: 17rpx;
    }
    &::before {
      content: '￥';
      font-size: 30rpx;
    }
    &::after {
      content: '\3000';
      background: url("https://file.y1b.cn/store/1-0/231211/65767fc3dbf88.png") 0 0 / cover;
      width: 82rpx;
      height: 38rpx;
      position: absolute;
      top: -12rpx;
      right: 28rpx;
      z-index: -1;
    }
  }
}
.front_btn {
  height: 88rpx;
  position: relative;
  z-index: 0;
  font-size: 36rpx;
  font-family: Alimama FangYuanTi VF, Alimama FangYuanTi VF-Bold;
  font-weight: Bold;
  text-align: center;
  color: #fff;
  line-height: 88rpx;
  margin: 0 40rpx;
  &::before {
    content: '\3000';
    background: url("https://file.y1b.cn/store/1-0/231211/657679069bd90.png") 0 0 / 100% 100%;
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: -1;
  }
}

.btn {
  min-width: 212rpx;
  height: 80rpx;
  line-height: 80rpx;
  background: #F84842;
  border-radius: 40rpx;
  font-size: 28rpx;
  font-weight: 600;
  text-align: center;
  color: #fff;
  padding: 0 50rpx;
  box-sizing: border-box;
  border: 2rpx solid transparent;
}

</style>
