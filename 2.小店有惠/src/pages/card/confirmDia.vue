<template>
  <van-popup
    :show="isShow"
    round
    custom-style="background: transparent;overflow:visible;"
    @close="confirm"
    :root-portal="true"
    z-index="100"
  >
    <view class="confirm_cont">
      <image class="dia_close" src="/static/images/close.png" mode="aspectFit" @click="confirm"></image>
      <view class="cont_title">审核成功</view>
      <view class="cont_lab">恭喜您成为团长</view>
      <van-button
        color="#F8F8F8"
        custom-style="border-radius: 4px;width: 280rpx;height: 72rpx;color:#FFFFFF;background: #f04037;"
        @click="confirm"
      >马上邀请赚钱</van-button >
    </view>
  </van-popup>
</template>
<script>
export default {
  name: "confirmAccount",
  props:{
    isShow: {
			type: Boolean,
			default: false
		},
  },
  data() {
    return {
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    confirm() {
      this.$emit("confirm");
    }
  },
};
</script>
<style lang="scss">
.confirm_cont {
  background-color: #fff;
  color: #333333;
  font-size: 32rpx;
  text-align: center;
  line-height: 44rpx;
  width: 622rpx;
  border-radius: 24rpx;
  padding-bottom: 56rpx;
  position: relative;
  z-index: 0;
  .dia_close {
    position: absolute;
    right: 20rpx;
    top: -80rpx;
    width: 56rpx;
    height: 56rpx;
  }
  .cont_title {
    font-weight: 600;
    padding-top: 86rpx;
  }
  .cont_lab{
    margin: 24rpx auto 86rpx;
  }
}
</style>
