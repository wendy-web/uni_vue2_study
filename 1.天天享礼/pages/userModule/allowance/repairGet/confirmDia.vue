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
      <view class="cont_title">本轮捡漏已结束</view>
      <view class="cont_remind">捡漏时间：{{startTime}} ~ {{overTime}}</view>
    </view>
    <view class="btn_box" @click="onClose">我知道了</view>
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
      startTime: {
        type: String,
        default: '08:00'
      },
      overTime: {
        type: String,
        default: '20:00'
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 622rpx;
  background: #ffffff;
  border-radius: 16rpx;
  text-align: center;
  .cont_text{
    color: #333333;
	  margin: 70rpx auto 68rpx;
    .cont_title {
      font-size: 40rpx;
      font-weight: 600;
      line-height: 56rpx;
    }
    .cont_remind {
      font-size: 26rpx;
      margin-top: 12rpx;
    }
  }
}

.btn_box {
  width: 454rpx;
  margin-bottom: 40rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  text-align: center;
  color: #FFF;
  background: #F84842;
}
</style>
