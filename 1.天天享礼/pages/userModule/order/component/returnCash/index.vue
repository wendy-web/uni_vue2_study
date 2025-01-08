<template>
  <view class="return_cash fl_bet" v-if="profitInfo.total_num" @click="onConfirm">
    <view class="rc_left fl_center">你有 {{ profitInfo.total_num }}  笔订单返现待领取</view>
    <view class="rc_right">领返现</view>
  </view>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  props: {
    isGoToWithdraw: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    ...mapGetters(["profitInfo"]),
  },
  data() {
    return {
    }
  },
  methods: {
    ...mapActions({
      profitInfoRequest: 'user/profitInfoRequest'
    }),
    onConfirm() {
      if(this.isGoToWithdraw) return this.$go('/pages/userCard/withdraw/index');
      this.profitInfoRequest().then((result) => {
        if(result.total_num) return this.$emit("confirm");
        return this.$toast('暂无待领取订单');
      });
    }
  }
}
</script>
<style lang="scss">
  .return_cash {
    font-size: 28rpx;
    color: #333333;
    line-height: 40rpx;
    height: 92rpx;
    background: #ffffff;
    border-radius: 16rpx;
    padding: 26rpx 20rpx;
    margin-top: 16rpx;
    box-sizing: border-box;
    .rc_left {
      &::before {
        content: '\3000';
        background: url("https://file.y1b.cn/store/1-0/2463/665d2bd5c3134.png") 0 0 / cover;
        display: block;
        width: 38rpx;
        height: 36rpx;
        z-index: 0;
        margin-right: 12rpx;
      }
    }
    .rc_right{
      width: 120rpx;
      height: 56rpx;
      background:#58BF6A url("https://file.y1b.cn/store/1-0/2463/665d2e531c989.png")  0 0 / cover;
      border-radius: 16rpx;
      font-size: 26rpx;
      color: #fff;
      line-height: 56rpx;
      text-align: center;
    }
  }
</style>
