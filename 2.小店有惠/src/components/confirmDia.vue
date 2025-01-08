<template>
  <van-popup
    :show="isShow"
    round
    custom-style="background: transparent;overflow:visible;"
    @close="close"
    :root-portal="true"
    z-index="100"
  >
    <view class="confirm_cont">
      <image class="dia_close" src="https://file.y1b.cn/store/1-0/24131/65ba395cf1ec7.png" mode="aspectFit" @click="close"></image>
      <view class="cont_title">积分不足</view>
      <van-button
        color="#F8F8F8"
        custom-style="border-radius: 4px;width: 454rpx;height: 72rpx;color:#FFFFFF;background: #f04037;"
        @click="confirm"
      >赚积分</van-button >
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
  width: 582rpx;
  border-radius: 16rpx;
  padding-bottom: 56rpx;
  position: relative;
  z-index: 0;
  .dia_close {
    position: absolute;
    right: -28rpx;
    top: -80rpx;
    width: 56rpx;
    height: 56rpx;
  }
  .cont_title {
    font-weight: 600;
    padding: 108rpx 0;

  }
}
</style>
