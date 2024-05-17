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
        <view class="cont_remind">
            请阅读
            <text style="color: #FFC161;" @click="agreementLookHandle('/agreement/privacy-agreement.html')">《个人信息保护政策》</text>
            <text style="color: #FFC161;" @click="agreementLookHandle('/agreement/service-agreement.html')">《平台服务协议》</text>
            的全部条款，接受后可以开始使用我们的服务
        </view>
      </view>
      <view class="btns_box fl_bet">
        <view class="pop_btn pop_btn-cancel"  @click="onClose">不同意</view>
        <view class="pop_btn pop_btn-confirm" @click="onConfirm">同意</view>
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
        },
        agreementLookHandle(link){
			this.$emit("diaLook", link);
        }
	}
}
</script>
<style lang="scss">
.cont_box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 650rpx;
  background: #fff;
  border-radius: 24rpx;
}
.cont_remind {
	margin: 94rpx 30rpx 86rpx;
    font-size: 28rpx;
    color: #666;
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
  border-radius: 40rpx;
  font-size: 28rpx;
  font-weight: 600;
  text-align: center;
  color: #666;
  padding: 0 50rpx;
  box-sizing: border-box;
  background: #F1F1F1;
}

.pop_btn-confirm {
  color: #333;
  background: #FFC161;
}
</style>
