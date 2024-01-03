<template>
  <!-- 卡券信息 -->
  <view class="card-info" v-if="!isNoCard">
    <view class="card-title">卡券信息</view>
    <view class="card-item" v-if="config.card.card_number">
      <text class="card-item-label">卡号：</text>
      <text class="card-item-value">{{ config.card.card_number }}</text>
      <view class="card-tool" @click="copyText(config.card.card_number)"
        >复制</view>
    </view>
    <view class="card-item" v-if="config.card.card_pwd">
      <text class="card-item-label">券码(卡券)：</text>
      <text class="card-item-value">{{ config.card.card_pwd }}</text>
      <view class="card-tool" @click="copyText(config.card.card_pwd)"
        >复制</view
      >
    </view>
    <view class="card-item">
      <text class="card-item-label">过期时间：</text>
      <text class="card-item-value">{{ config.card.card_deadline }}</text>
    </view>
    <!-- 使用状态标记 -->
    <view class="on-state" v-if="config.navTitle === '待使用'">
      <view class="on-state-title">使用状态</view>
      <view class="on-state-small">用完标记一下</view>
      <van-switch
        class="on-state-tool"
        :checked="onState"
        size="20px"
        active-color="#EF2B20"
        @change="stateChange"
      />
    </view>
  </view>
</template>
<script>
export default {
  props: ["config"],
  computed: {
    isNoCard() {
      let card = this.config.card; // 卡 type 选择器中的值或名称。例如，"un"或"未知
      return !card;
    },
  },
  data() {
    return {
      onState: false,
    };
  },
  methods: {
    copyText(text) {
      wx.setClipboardData({
        data: text,
        success() {
          uni.showToast({
            title: "复制成功",
            icon: "none",
            mask: true,
          });
        },
      });
    },
    stateChange() {
      this.$emit("stateChange");
    },
  },
};
</script>
<style lang="scss">
/**卡券信息 */
.card-info {
  background-color: #ffffff;
  padding: 32rpx 24rpx;
  margin-top: 14rpx;
  .card-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333333;
    display: flex;
    align-items: center;
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
  .card-item {
    position: relative;
    display: flex;
    align-items: center;
  }
  .card-item {
    margin-top: 24rpx;
  }
  .card-item-label {
    font-size: 28rpx;
    color: #999999;
    min-width: 160rpx;
  }
  .card-item-value {
    font-size: 28rpx;
    color: #333333;
  }
  .card-tool {
    border: var(--button-border-width, 1px) solid
      var(--button-default-border-color, #ebedf0);
    position: absolute;
    right: 0;
    top: 0;
    font-size: 24rpx;
    color: #666666;
    padding: 4rpx 12rpx;
    border-radius: 4px;
  }
  .on-state {
    position: relative;
    padding-top: 23rpx;
    border-top: 2rpx solid #d8d8d8;
    margin-top: 24rpx;
  }
  .on-state-title {
    font-size: 26rpx;
    color: #333333;
    margin-bottom: 12rpx;
  }
  .on-state-small {
    font-size: 24rpx;
    color: #999999;
  }
  .on-state-tool {
    position: absolute;
    right: 24rpx;
    top: 40rpx;
  }
}
</style>
