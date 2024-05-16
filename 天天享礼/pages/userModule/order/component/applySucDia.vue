<template>
<van-popup
  :show="isShow"
  custom-style="overflow: visible;background: transparent;"
  round
  :z-index="100"
  :safe-area-inset-bottom="false"
  :catchtouchmove="true"
  @close="onClose"
>
	<view class="cont_box">
    <view class="cont_text">
      <view class="cont_title">提交成功</view>
      <view class="cont_remind">您的退款申请已提交<br>预计1个工作日内退回至您的原支付账户
      </view>
    </view>
    <view class="btn_box" @click="onClose">完成</view>
	</view>
</van-popup>
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
		}
	},
	methods: {
		onClose() {
			this.$emit("close");
		}
	}
}
</script>

<style scoped lang="scss">
.cont_box {
  width: 582rpx;
  background: #fff;
  border-radius: 32rpx;
  text-align: center;
  padding: 0 48rpx;
  box-sizing: border-box;
  overflow: hidden;
  .cont_text{
    color: #333;
	  margin: 40rpx auto 0;
    .cont_title {
      font-size: 36rpx;
      font-weight: 600;
      margin: 32rpx 12rpx 0;
    }
    .cont_remind {
      font-size: 28rpx;
      margin-top: 12rpx;
      color: #666;
      white-space: nowrap;
    }
  }
}

.btn_box {
  width: 100%;
  margin: 48rpx auto 40rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  text-align: center;
  color: #FFF;
  background: #F84842;
}
</style>
