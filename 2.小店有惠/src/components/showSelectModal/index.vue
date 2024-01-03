<template>
<van-popup
  :show="isShow"
  round
  custom-style="background: transparent;overflow:visible;"
  @close="close"
  :root-portal="true"
  z-index="100"
>
  <view class="dia_cont">
    <view class="dia_text">省钱卡项目仅店主可报名参加， 你可以</view>
    <view class="dia_btn">
      <button class="btn_cancel" @click="close">取消</button>
      <button class="btn_active" @click="submitHandle">联系店主</button>
    </view>
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
  methods: {
    close() {
      this.$emit("close");
    },
    submitHandle() {
      this.$emit("submit");
    }
  },
}
</script>
<style scoped lang="scss">
$btnColor: #f04037;
.dia_cont {
  width: 582rpx;
  border-radius: 4rpx;
  padding: 56rpx;
  .dia_text {
    font-size: 32rpx;
    font-weight: 400;
    text-align: center;
    color: #333333;
    line-height: 44rpx;
    padding: 50rpx 0 86rpx;
  }
  .dia_btn{
    display: flex;
    justify-content: space-around;
    align-items: center;
    >button {
      width: 200rpx;
      height: 72rpx;
      line-height: 72rpx;
      border-radius: 8rpx;
      background: transparent;
    }
    .btn_cancel{
      border: 2rpx solid $btnColor;
      color: $btnColor;
    }
    .btn_active {
      background: $btnColor;
      color: #fff;
    }
  }
}
</style>