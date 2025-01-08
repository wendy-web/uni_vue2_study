<template>
<van-popup
  :show="isShow"
  round
  custom-style="background: transparent;overflow:visible;"
  @close="closeHandle"
  :root-portal="true"
  z-index="100"
>
  <view class="confirm_cont">
    <view class="cont_title">温馨说明</view>
    <view class="cont_item">
      <view class="cont_lab">1、可提现金额</view>
      <view class="cont_txt">收益次月30天后才可以提现。如果订单发生退款相应的收益将从预估收益中扣除。</view>
    </view>
    <view class="cont_item">
      <view class="cont_lab">2、关于提现</view>
      <view class="cont_txt">单次提现金额范围：0.1元-500元，无需手续费，提现后1~3个工作日到账。</view>
    </view>
    <van-button
      color="#F8F8F8"
      class="confirm_btn"
      custom-style="border-radius: 20rpx;width: 472rpx;height: 80rpx;color:#FFF;background: #f84842;"
      @click="closeHandle"
    >我知道了</van-button >
  </view>
</van-popup>
</template>
<script>
export default {
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
    closeHandle() {
      this.$emit("close");
    }
  },
};
</script>
<style lang="scss">
.confirm_cont {
  background-color: #fff;
  color: #333;
  font-size: 32rpx;
  width: 622rpx;
  border-radius: 40rpx;
  padding: 0 40rpx;
  box-sizing: border-box;
  overflow: hidden;
  .cont_title {
    font-weight: 600;
    padding-top: 40rpx;
    font-size: 36rpx;
    text-align: center;
    margin-bottom: 40rpx;
  }
  .cont_item{
    margin-bottom: 48rpx;
    .cont_lab{
      font-size: 28rpx;
      line-height: 40rpx;
      margin-bottom: 12rpx;
      font-weight: bold;
    }
    .cont_txt{
      font-size: 26rpx;
      color: #666;
      line-height: 36rpx;
    }
  }
  .confirm_btn{
    text-align: center;
    margin: 0 auto 56rpx;
    display: block;
  }
}
</style>
