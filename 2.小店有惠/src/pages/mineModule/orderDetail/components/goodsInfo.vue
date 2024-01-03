<template>
  <view class="goods-info" :style="{ marginTop: isUnShipped ? '0' : '14rpx' }">
    <view class="goods-info-top">
      <van-image
        class="goods-icon"
        height="112rpx"
        width="112rpx"
        radius="8px"
        :src="config.picList[0]"
        use-loading-slot
      >
        <van-loading slot="loading" type="spinner" size="20" vertical />
      </van-image>
      <view class="goods">
        <view class="goods-name">{{ config.goods_name }}</view>
        <view class="goods-price">
          <text>¥{{ config.price.split(".")[0] }}.</text>
          <text class="price-float">{{ config.price.split(".")[1] }}</text>
          <view class="price-label">[官方价]</view>
        </view>
      </view>
    </view>
    <!-- 积分抵扣  -->
    <block v-if="(isDown || isNoCard) && !isRefunded">
      <view class="deduc-info" v-if="pointDeduc">
        <view class="deduc-info-right">
          <view class="deduc-icon">抵</view>
          <view>积分抵扣({{ config.deduction_credits }}积分)</view>
        </view>
        <view class="deduc-info-price">
          <text>-¥{{ config._deduction_price }}</text>
        </view>
      </view>
      <!-- 实付|应付 -->
      <view class="actual-payment">
        <text class="ap-label">{{ payLabel }}：</text>
        <text class="ap-unit">¥</text>
        <text class="ap-val">{{ config.pay_price.split(".")[0] }}.</text>
        <text class="ap-float">{{ config.pay_price.split(".")[1] }}</text>
      </view>
    </block>
    <!-- 退款成功 -->
    <view class="refund-mark-box" v-if="config.navTitle === '已退款'">
      <view class="refund-mark">退款成功</view>
    </view>
    <!-- 下拉展开 -->
    <van-icon
      v-if="!isNoCard"
      class="arrow-down"
      :name="isDown ? 'arrow-up' : 'arrow-down'"
      @click="isDown = !isDown"
    />
  </view>
</template>
<script>
export default {
  props: ["config"],
  data() {
    return {
      isDown: false,
    };
  },
  computed: {
    //没有卡券信息
    isUnShipped() {
      let { card, navTitle } = this.config; // 卡 type 选择器中的值或名称。例如，"un"或"未知
      return (card instanceof Array || !card) && navTitle === "待使用";
    },
    //没有卡券信息
    isNoCard() {
      let card = this.config.card; // 卡 type 选择器中的值或名称。例如，"un"或"未知
      return card instanceof Array || !card;
    },
    //取消 为应付，其它为实付
    payLabel() {
      return ["已取消", "待付款"].includes(this.config.navTitle)
        ? "应付"
        : "实付"; // 选择页面中显示的文本。例如，"应付"或"实付"或"取消
    },
    //是否为已退款状态
    isRefunded() {
      return this.config.navTitle === "已退款";
    },
    //显示积分抵扣明细
    pointDeduc() {
      return (
        this.config.deduction_price > 0 && this.config.deduction_credits > 0
      );
    },
  },
};
</script>
<style lang="scss">
.goods-info {
  margin-top: 14rpx;
  background-color: #ffffff;
  padding: 32rpx 24rpx;
  position: relative;
  .goods-info-top {
    position: relative;
    height: 112rpx;
    padding-left: 136rpx;
  }
  .goods-icon {
    position: absolute;
    left: 0;
    top: 0;
  }
  .goods {
    display: flex;
    justify-content: space-between;
  }
  .goods-name {
    font-size: 32rpx;
    font-weight: 400;
    color: #333333;
    display: -webkit-box;
    /* 将对象作为弹性伸缩盒子模型显示 */
    -webkit-box-orient: vertical;
    /* 设置或检索伸缩盒对象的子元素的排列方式 */
    -webkit-line-clamp: 2;
    /* 2行，只有 webkit内核支持 */
    word-break: break-all;
    /* 纯英文换行 */
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .goods-price {
    font-size: 32rpx;
    font-weight: 500;
    color: #333333;
    margin-left: 20rpx;
  }
  .price-float {
    font-size: 24rpx;
  }
  .price-label {
    font-size: 20rpx;
    font-weight: 400;
    color: #aaaaaa;
    text-align: center;
    padding-top: 4rpx;
  }
  .deduc-info {
    display: flex;
    justify-content: space-between;
    background-color: #f7f8fa;
    border-radius: 4px;
    padding: 16rpx 24rpx;
    margin-top: 24rpx;
  }
  .deduc-info-right {
    display: flex;
    align-items: center;
    font-size: 24rpx;
    color: #666666;
  }
  .deduc-icon {
    width: 30rpx;
    height: 30rpx;
    font-size: 18rpx;
    color: #ef2b20;
    border: 1rpx solid #ef2b20;
    box-sizing: border-box;
    text-align: center;
    line-height: 28rpx;
    border-radius: 8rpx;
    margin-right: 8rpx;
  }
  .deduc-info-price {
    font-size: 26rpx;
    color: #ef2b20;
  }
  .actual-payment {
    margin-top: 24rpx;
    text-align: right;
  }
  .ap-label {
    font-size: 26rpx;
    color: #666666;
  }
  .ap-unit,
  .ap-float {
    font-size: 26rpx;
    color: #ef2b20;
  }
  .ap-val {
    font-size: 40rpx;
    color: #ef2b20;
  }
  .arrow-down {
    position: absolute;
    bottom: 32rpx;
    left: 50%;
    transform: translateX(-50%);
  }
  .refund-mark-box {
    display: flex;
    justify-content: flex-end;
  }
  .refund-mark {
    width: 152rpx;
    height: 52rpx;
    border: var(--button-border-width, 1px) solid #cccccc;
    border-radius: 4px;
    font-size: 28rpx;
    color: #333333;
    text-align: center;
    line-height: 52rpx;
  }
}
</style>
