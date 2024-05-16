<template>
<van-popup
    :show="isShow"
    custom-style="overflow: visible;background: transparent;"
    round
		:safe-area-inset-bottom="false"
>
  <view class="cont_box">
    <image class="cont_top_icon" src="https://file.y1b.cn/store/1-0/23713/64afe59a93497.png" mode="aspectFit"></image>
    <view class="cont_txt">提现申请提交成功</view>
    <view class="cont_lab">请留意微信支付的通知</view>
    <view class="pop_btn" @click="onClose">我知道了</view>
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
    },
		data() {
			return {
			}
		},
		methods: {
			onClose() {
        this.$emit("close");
			}
		}

	}
</script>

<style lang="scss">
.cont_box {
  text-align: center;
  box-sizing: border-box;
  position: relative;
  width: 582rpx;
  background: #ffffff;
  border-radius: 40rpx;
  text-align: center;
  padding-bottom: 40rpx;
  .cont_top_icon {
    width: 134rpx;
    height: 114rpx;
    margin: -54rpx auto 34rpx;
  }
  .cont_txt {
    font-size: 40rpx;
    color: #333;
    font-weight: 600;
  }
  .cont_lab {
    font-size: 26rpx;
    color: #aaa;
    margin-top: 12rpx;
  }
}
.pop_btn {
  width: 454rpx;
  line-height: 72rpx;
  background: #f84842;
  border-radius: 20rpx;
  font-size: 28rpx;
  text-align: center;
  color: #ffffff;
  margin: 64rpx auto 0;
}

</style>
