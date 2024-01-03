<template>
  <!-- 核销码相关 -->
  <view class="hx-info" v-if="!isNoCard">
    <view class="hx-info-title">到店出示核销二维码给工作人员</view>
    <!-- 核销二维码 -->
    <view class="qr-box">
      <image
        class="bg-qr-code"
        src="/pages/mineModule/static/order/bg_qr_code.png"
        mode="aspectFit"
      ></image>
      <image
        class="qr-code"
        mode="aspectFit"
        :src="config.card.card_qr_link"
      ></image>
    </view>
    <!-- 核销条形码 -->
    <view class="bar-box">
      <image
        class="bg-bar-code"
        src="/pages/mineModule/static/order/bg_bar_code.png"
        mode="aspectFit"
      ></image>
      <image
        class="bar-code"
        mode="aspectFit"
        :src="config.card.code_link"
      ></image>
    </view>
  </view>
</template>
<script>
export default {
  props: ["config"],
  computed: {
    isNoCard() {
      let card = this.config.card; // 卡 type 选择器中的值或名称。例如，"un"或"未知
      return !card || !card.card_qr_link || !card.code_link;
    },
  },
};
</script>
<style lang="scss">
/**核销信息 */
.hx-info {
  padding: 32rpx 24rpx;
  background-color: #ffffff;
  border-top: 2rpx solid #e1e1e1;
  .hx-info-title {
    font-size: 30rpx;
    font-weight: 500;
    text-align: center;
    color: #333333;
    margin-bottom: 27rpx;
  }
  .qr-box {
    width: 316rpx;
    height: 316rpx;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 39rpx;

    .bg-qr-code {
      width: 316rpx;
      height: 316rpx;
      position: absolute;
      top: 0;
      left: 0;
    }

    .qr-code {
      width: 248rpx;
      height: 248rpx;
      position: relative;
      z-index: 1;
    }
  }
  .bar-box {
    width: 632rpx;
    height: 176rpx;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;

    .bg-bar-code {
      width: 632rpx;
      height: 176rpx;
      position: absolute;
      top: 0;
      left: 0;
    }

    .bar-code {
      width: 584rpx;
      height: 130rpx;
      position: relative;
      z-index: 1;
    }
  }
}
</style>
