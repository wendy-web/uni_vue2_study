<template>
  <van-popup :show="isShow" @close="hide">
    <view class="cancel-confirm">
      <view class="cancel-confirm-title">确定标记为已使用？</view>
      <view class="tools">
        <van-button
          color="#F8F8F8"
          custom-style="border-radius: 4px;width: 200rpx;color:#333333;"
          @click="hide"
          >取消</van-button
        >
        <van-button
          type="danger"
          custom-style="border-radius: 4px;width: 200rpx;"
          @click="cancelOrder"
          >确定</van-button
        >
      </view>
    </view>
  </van-popup>
</template>
<script>
import { verifyOrder } from "@/api/modules/order.js";
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
      verifyOrder(this.params).then((res) => {
        if (res.code == 1) {
          this.$emit("confirm");
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
