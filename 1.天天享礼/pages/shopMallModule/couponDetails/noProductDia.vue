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
        <view class="cont_remind">{{remindText}}</view>
      </view>
      <view class="btns_box">
        <view class="pop_btn pop_btn-confirm" @click="onClose">看看其他</view>
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
	  remindText: {
        type: String,
        default: '手太慢，商品被抢光咯'
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

<style lang="scss">
.cont_box {
  background: #ffffff;
  padding: 48rpx 0 40rpx;
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
.cont_remind {
	margin: 0rpx auto 56rpx;
	font-size: 32rpx;
	font-family: PingFang SC, PingFang SC-Medium;
	font-weight: 500;
	text-align: center;
	color: #333333;
	line-height: 44rpx;
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
</style>