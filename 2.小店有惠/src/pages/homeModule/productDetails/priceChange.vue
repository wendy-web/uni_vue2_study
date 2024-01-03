<template>
  <van-popup
    :show="isShow"
    round
    position="bottom"
    custom-style="height:380rpx"
    @close="hide"
  >
    <view class="price-stop">
      <view class="confirm-account-title"
        >商品信息发生变更，确定还要继续购买吗？</view
      >
      <view class="confirm-account-tools">
        <van-button
          color="#F8F8F8"
          custom-style="border-radius: 4px;width: 328rpx;color:#333333"
          @click="hide"
          >取消</van-button
        >
        <van-button
          color="#EF2B20"
          custom-style="border-radius: 4px;width: 328rpx;color:#FFFFFF"
          @click="confirm"
          >确定</van-button
        >
      </view>
    </view>
  </van-popup>
</template>
<script>
export default {
  name: "confirmAccount",
  data() {
    return {
      isShow: false,
    };
  },
  methods: {
    show() {
      this.isShow = true;
    },
    hide() {
      this.isShow = false;
    },
    confirm() {
      this.hide();
    },
  },
};
</script>
<style lang="scss">
.price-stop {
  .confirm-account-title {
    font-size: 28rpx;
    text-align: center;
    color: #999999;
    padding-top: 80rpx;
    padding-bottom: 100rpx;
  }
  .confirm-account-tools {
    display: flex;
    padding: 0 32rpx;
    justify-content: space-between;
  }
}
</style>
