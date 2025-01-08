<template>
  <view class="uparse-item" v-if="explainInfo">
    <view class="uparse-item-title">使用说明</view>
    <u-parse
      :content="explainInfo"
      @preview="preview"
      @navigate="navigate"
    ></u-parse>
  </view>
</template>
<script>
export default {
  props: ["config"],
  computed: {
    isNoCard() {
      let card = this.config.card; // 卡 type 选择器中的值或名称。例如，"un"或"未知
      return card instanceof Array || !card;
    },
    explainInfo() {
      let navTitle = this.config.navTitle;
      if(navTitle == '已退款') return null;
      if(navTitle == '待付款' || navTitle == '已取消') {
        return this.config.goods_explain
      }
      return this.config.order_explain
    }
  },
  methods: {
    preview() {},
    navigate() {},
  },
};
</script>
<style lang="scss">
.uparse-item {
  margin-top: 14rpx;
  padding: 32rpx 24rpx;
  background-color: #ffffff;
}
.uparse-item-title {
  font-size: 32rpx;
  color: #333333;
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
  &::before {
    content: "";
    display: block;
    width: 4rpx;
    height: 26rpx;
    background-color: #ef2b20;
    border-radius: 2px;
    margin-right: 10rpx;
  }
}
</style>
