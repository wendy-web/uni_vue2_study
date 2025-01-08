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
      <view class="cont_title">积分不足</view>
      <view class="cont_tex">当前积分：{{ credits }}</view>
      <view class="cont_btn">
        <van-button
          color="#F8F8F8"
          custom-style="border-radius: 4px;width: 200rpx;height: 72rpx;color:#F04037;background: #fff;border: 2rpx solid #f04037;"
          @click="close"
        >看看其他</van-button >
        <van-button
          color="#F8F8F8"
          custom-style="border-radius: 4px;width: 200rpx;height: 72rpx;color:#fff;background: #f04037;"
          @click="confirm"
        >赚积分</van-button >
      </view>
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
    credits: {
      type: Number,
      default: 0
    }
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
  border-radius: 4rpx;
  padding-bottom: 56rpx;
  position: relative;
  z-index: 0;
  .cont_title {
    font-weight: 600;
    padding: 56rpx 0 68rpx;
  }
  .cont_btn{
    padding: 0 64rpx;
    margin-top: 68rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

  }
}
</style>
