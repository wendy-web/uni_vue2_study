<template>
  <van-popup
    :show="isShow"
    round
    position="bottom"
    custom-style="height:480rpx"
    @close="hide"
  >
    <view class="confirm-account">
      <view class="confirm-account-title">确定充值账号是否正确</view>
      <view class="confirm-account-num">{{ formatterFun(account) }}</view>
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
      account: "",
    };
  },
  methods: {
    show(account) {
      this.account = account;
      this.isShow = true;
    },
    hide() {
      this.isShow = false;
    },
    confirm() {
      this.$emit("confirm");
      this.hide();
    },
    formatterFun(value) {
      let showValue = String(value);
      showValue = showValue.slice(0,3) + " "+ showValue.slice(3,7) + " " + showValue.slice(7);
      return showValue
    }
  },
};
</script>
<style lang="scss">
.confirm-account {
  .confirm-account-title {
    font-size: 28rpx;
    text-align: center;
    color: #999999;
    padding-top: 80rpx;
    padding-bottom: 24rpx;
  }
  .confirm-account-num {
    font-size: 50rpx;
    font-weight: 500;
    text-align: center;
    color: #333333;
    margin-bottom: 80rpx;
  }
  .confirm-account-tools {
    display: flex;
    padding: 0 32rpx;
    justify-content: space-between;
  }
}
</style>
