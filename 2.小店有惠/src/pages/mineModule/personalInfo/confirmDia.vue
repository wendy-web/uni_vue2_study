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
        <view class="cont_remind">{{remindText}}</view>
      </view>
      <view class="btns_box fl_bet">
        <view
            class="pop_btn pop_btn-cancel"
            @click="onClose" v-if="!isInform"
        >{{cancelText}}</view>
        <view
          class="pop_btn pop_btn-confirm"
          :class="{ 'fl1': isInform}"
          @click="onConfirm"
        >
          {{confirmText}}
        </view>
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
        default: '确认继续执行吗？'
      },
      cancelText: {
        type: String,
        default: '取消'
      },
      confirmText: {
        type: String,
        default: '确定'
      },
      isInform: {
        type: Boolean,
        default: false
      }
    },
	data() {
		return { }
	},
	methods: {
		onClose() {
			this.$emit("close");
		},
        onConfirm() {
			this.$emit("confirm");
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
  background: #fff;
  border-radius: 24rpx;
}
.cont_remind {
	margin: 110rpx auto;
  font-weight: 600;
  text-align: center;
  color: #333;
  line-height: 40rpx;
}
.btns_box {
	width: 100%;
  margin-bottom: 40rpx;
  padding: 0 76rpx;
  box-sizing: border-box;
}
.pop_btn {
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

.pop_btn-confirm {
  color: #F84842;
  border-color: #F84842;
  background: transparent;
}
</style>