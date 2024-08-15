<template>
<van-popup
    :show="isShow"
    custom-style="overflow: visible;background: transparent;"
    round
    :z-index="100"
    :safe-area-inset-bottom="false"
    :catchtouchmove="true"
    @close="popupClose"
>
	<view class="cont_box">
    <view class="cont_title">确认开通</view>
    <view class="cont_text">
      我已阅读并同意<text style="color: #FF4749;" @click="toAgreeLook('/agreement/savings-server.html')">《会员服务协议》</text>
    </view>
    <view class="btn_confirm" @click="onConfirm">继续开通</view>
    <image class="close_icon" mode="scaleToFill"
      src="https://file.y1b.cn/store/1-0/23118/654b29f0188a0.png"
      @click="popupClose"
    ></image>
	</view>
</van-popup>
</template>

<script>
import { toAgreeLook } from '@/utils/auth.js';
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
  },
	data() {
		return { }
	},
	methods: {
    toAgreeLook,
		popupClose() {
			this.$emit("close");
		},
    onConfirm() {
			this.$emit("confirm");
    },
	}
}
</script>
<style lang="scss">
.cont_box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 620rpx;
  background: #fff;
  border-radius: 24rpx;
  color: #333;
  .cont_title {
    font-size: 32rpx;
    font-weight: bold;
    line-height: 96rpx;
  }
  .cont_text {
    font-size: 28rpx;
    color: #666;
    text-align: center;
    margin-top: 32rpx;
  }
}
.btn_confirm {
  width: 520rpx;
  margin: 46rpx 32rpx 42rpx;
  height: 78rpx;
  line-height: 78rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  font-weight: 600;
  text-align: center;
  padding: 0 50rpx;
  box-sizing: border-box;
  color: #fff;
  background: #F1443B;
}
.close_icon {
  width: 60rpx;
  height: 60rpx;
  position: absolute;
  bottom: -120rpx;
  left: 50%;
  transform: translateX(-50%);
}
</style>
