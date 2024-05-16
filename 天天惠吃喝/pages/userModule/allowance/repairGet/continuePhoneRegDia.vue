<template>
	<van-popup
    :show="isShow"
    custom-style="overflow: visible; background: transparent;"
    position="bottom"
    round
		:safe-area-inset-bottom="false"
    :catchtouchmove="true"
  >
		<view class="cont_box">
      <view class="cont_text">
        <view class="confirm_text">确定充值账号是否正确</view>
        <view class="confirm_num">{{ formatterFun(accountNum) }}</view>
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
      accountNum: {
        type: Number,
        default: 0
      },
      cancelText: {
        type: String,
        default: '取消'
      },
      confirmText: {
        type: String,
        default: '确定'
      }
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
        this.$emit("close");
			},
      formatterFun(value) {
        let showValue = String(value);
        showValue = showValue.slice(0,3) + " "+ showValue.slice(3,7) + " " + showValue.slice(7);
        return showValue
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
.cont_title {
  font-size: 32rpx;
  font-weight: 500;
  text-align: center;
  color: #333333;
  line-height: 44rpx;
}
.cont_remind {
  height: 48rpx;
  border: 1rpx solid #666666;
  border-radius: 25rpx;
  font-size: 26rpx;
  text-align: center;
  color: #666666;
  line-height: 48rpx;
  display: inline-block;
  padding: 0 26rpx;
  margin: 36rpx auto 30rpx;
}
.cont_txt {
  font-size: 30rpx;
  font-weight: 500;
  text-align: center;
  color: #333333;
  line-height: 42rpx;
  margin-bottom: 80rpx;
}
</style>