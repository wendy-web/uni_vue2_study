<template>
<van-popup
  :show="isShow"
  round
  :z-index="100"
  :safe-area-inset-bottom="false"
  :catchtouchmove="true"
  @close="onClose"
  overlay-style="background: rgba(0, 0, 0, 0.8);"
>
	<view class="cont_box">
    <view class="cont_text">
      <view class="cont_title">{{content}}</view>
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
      content: {
        type: String,
        default: '太火爆了'
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

<style scoped lang="scss">
.cont_box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 622rpx;
  border-radius: 16rpx;
  text-align: center;
  .cont_text{
    color: #333;
	  margin: 70rpx auto 68rpx;
    .cont_title {
      font-size: 32rpx;
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