<template>
	<van-popup
    :show="isShow"
    custom-style="overflow: visible;background: transparent;"
    position="bottom"
    round
	:safe-area-inset-bottom="false"
  >
	<view class="cont_box">
      <view class="cont_text">
        <view class="cont_title"> 特价商品须在 <text style="color:#EF2B20">24小时</text>内使用</view>
        <view class="cont_remind">不支持退换服务</view>
      </view>
      <view class="btns_box">
        <view class="pop_btn" @click="onClose">{{cancelText}}</view>
        <view class="pop_btn pop_btn-confirm" @click="onConfirm">{{confirmText}}</view>
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
      cancelText: {
        type: String,
        default: '我再想想'
      },
      confirmText: {
        type: String,
        default: '继续支付'
      }
    },
	data() {
		return { }
	},
	methods: {
		onConfirm() {
			this.$emit("confirm");
		},
		onClose() {
			this.$emit("close");
		},
	}
}
</script>

<style lang="scss" scoped>
.cont_box {
  background: #ffffff;
  padding: 106rpx 0 40rpx;
  font-size: 28rpx;
  text-align: center;
  width: 702rpx;
  border-radius: 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto constant(safe-area-inset-bottom);
  margin: 0 auto  env(safe-area-inset-bottom);

}
.cont_title {
	height: 50rpx;
	font-size: 36rpx;
	font-family: PingFang SC, PingFang SC-Medium;
	text-align: center;
	color: #333333;
	line-height: 50rpx;
	font-weight: 600;
}
.cont_remind {
	font-size: 26rpx;
	font-family: PingFang SC, PingFang SC-Regular;
	font-weight: 400;
	color: #666666;
	line-height: 36rpx;
	margin: 24rpx auto 106rpx;
}
.image_list {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 56rpx;
	.image_item {
		width: 56rpx;
		height: 56rpx;
		background: #d8d8d8;
		border: 2rpx solid #ffffff;
		border-radius: 50%;
		margin-left: -10rpx;
	}
}
.btns_box {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-around;
}
.pop_btn {
  width: 288rpx;
  height: 88rpx;
  box-sizing: border-box;
  line-height: 88rpx;
  text-align: center;
  border-radius: 16rpx;
  font-weight: 500;
  color: #333;
  border: none;
  background: #f8f8f8;
}

.pop_btn-confirm {
  color: #fff;
  background: linear-gradient(135deg,#f2554d, #f04037);
}
.confirm_text {
  font-size: 28rpx;
  color: #999;
  line-height: 40rpx;
  margin-top: 30rpx;
}
.confirm_num {
  font-size: 50rpx;
  font-weight: 500;
  text-align: center;
  color: #333333;
  line-height: 72rpx;
  margin: 24rpx 0 80rpx;
}

</style>
