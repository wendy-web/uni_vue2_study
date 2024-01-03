<template>
<view class="dia" v-if="isShow">
  <view class="dia_cont">
      <view class="dia_text">省钱卡项目仅店主可报名参加， 你可以</view>
      <view class="dia_btn">
        <button class="btn_cancel" @click="closeDiaHandle">取消</button>
        <button class="btn_active" @click="submitHandle">联系店主</button>
      </view>
  </view>
</view>
</template>
<script>
export default {
  name: "reportSuccess",
  props: {
    isShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
    }
  },
  computed: {},
  methods: {
    closeDiaHandle(){
      this.$emit('close');
    },
    submitHandle(){
      this.$emit('submit');
    }
  },
  watch: {},
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