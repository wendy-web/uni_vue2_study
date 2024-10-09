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
        <view class="cont_title">
			本单优惠
            <text style="color:#EF2B20">¥{{config.coupon_amount}}</text>
			，
			确定要离开吗?
		</view>
		<view class="image_list">
			<image
				class="image_item"
				v-for="(item, index) in config.imgArr"
				:key="index"
				:src="item"
			></image>
		</view>
        <view class="cont_remind">{{config.text}}</view>
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
	  config: {
		type: Object,
		defaultL: ''
	  },
      cancelText: {
        type: String,
        default: '离开'
      },
      confirmText: {
        type: String,
        default: '放心付'
      },
    },
	data() {
		return {
		}
	},
	methods: {
		onConfirm() {
			this.$emit("confirm");
		},
		onClose() {
			this.$emit("close", this.config.oid);
		}
	}
}
</script>

<style scoped lang="scss">
@import '@/static/css/mixin.scss';
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
.cont_title {
	height: 50rpx;
	font-size: 36rpx;
	font-family: PingFang SC, PingFang SC-Medium;
	font-weight: 500;
	text-align: center;
	color: #333333;
	line-height: 50rpx;
}
.cont_remind {
	font-size: 26rpx;
	font-family: PingFang SC, PingFang SC-Regular;
	font-weight: 400;
	color: #666666;
	line-height: 36rpx;
	margin: 24rpx auto 56rpx;
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
  font-size: 28rpx;
  color: #666666;
  font-weight: 600;
  border: none;
  background: #f1f1f1;
}

.pop_btn-confirm {
	color: #333;
	background: $mcDonaldColor;
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
