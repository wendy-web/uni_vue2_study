<template>
  <van-popup :show="isShow" @close="hide">
    <view class="cancel-confirm">
      <view class="cancel-confirm-title">确定要取消订单吗？</view>
      <view class="tools">
        <van-button
          type="danger"
          custom-style="border-radius: 4px;width: 200rpx;"
          @click="hide"
          >我再想想</van-button
        >
        <van-button
          type="danger"
          custom-style="border-radius: 4px;width: 200rpx;"
          plain
          @click="cancelOrder"
          >确认</van-button
        >
      </view>
    </view>
  </van-popup>
</template>
<script>
import { cancelOrder } from "@/api/modules/order.js";
export default {
  data() {
    return {
      isShow: false,
      params: null,
    };
  },
  methods: {
    show(params) {
      this.params = params;
      this.isShow = true;
    },
    hide() {
      this.isShow = false;
    },
    cancelOrder() {
      cancelOrder(this.params).then((res) => {
        if (res.code == 1) {
          this.$emit("cancelSuccess");
          this.hide();
        }
        uni.showToast({ title: res.msg, icon: "none" });
      });
    },
  },
};
</script>
<style lang="scss">
.cancel-confirm {
  width: 582rpx;
  height: 408rpx;
  text-align: center;
  box-sizing: border-box;
  padding: 128rpx 72rpx 56rpx;
  border-radius: 4px;
  .cancel-confirm-title {
    font-size: 32rpx;
    color: #333333;
    margin-bottom: 108rpx;
  }
  .tools {
    display: flex;
    justify-content: space-between;
  }
}
</style>
