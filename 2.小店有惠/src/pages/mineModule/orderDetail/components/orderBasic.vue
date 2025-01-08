<template>
  <!-- 订单基本信息 -->
  <view class="order-info">
    <view class="order-item">
      <text class="order-item-label">订单编号：</text>
      <text class="order-item-value">{{ config.order_number }}</text>
      <view class="order-tool" @click="copyText(config.order_number)"
        >复制</view
      >
    </view>
    <view class="order-item">
      <text class="order-item-label">下单时间：</text>
      <text class="order-item-value">{{ config.create_time }}</text>
    </view>
    <!-- 仅直充 -->
    <view
      class="order-item"
      v-if="config.navTitle === '待付款' && config.goods_type === 0"
    >
      <text class="order-item-label">充值账号：</text>
      <block v-if="!isModify">
        <text class="order-item-value">{{ config.cz_number }}</text>
        <view class="order-tool" @click="editHandle(config.cz_number)">修改</view>
      </block>
      <block v-else>
        <view style="flex: 1">
          <van-field
            :value="cz_number"
            :border="false"
            :placeholder="placeholderText"
            :maxlength='config.cz_type == 1 ? 11 : -1'
            custom-style="font-size: 32rpx;color:#333333;font-weight: 500;padding:0;border-bottom:1px solid #E1E1E1;"
            placeholder-style="color:#aaaaaa;font-size: 32rpx;font-weight: 500;"
            type="number"
            focus="true"
            @change="fieldChange"
          />
        </view>
        <view class="order-tool-suer" @click="saveModify">确定</view>
      </block>
    </view>
    <view class="order-item" v-else-if="config.cz_number">
      <text class="order-item-label">充值账号：</text>
      <text class="order-item-value">{{ config.cz_number }}</text>
    </view>
    <view class="order-item" v-if="config.pay_date">
      <text class="order-item-label">支付方式：</text>
      <text class="order-item-value">微信支付</text>
    </view>
    <view class="order-item" v-if="config.pay_date">
      <text class="order-item-label">支付时间：</text>
      <text class="order-item-value">{{ config.pay_date }}</text>
    </view>
  </view>
</template>
<script>
import { changeNumber } from "@/api/modules/order.js";
export default {
  props: ["config"],
  data() {
    return {
      isModify: false,
      cz_number: "",
    };
  },
  computed: {
    placeholderText() {
      return this.config.cz_type_intro || '请输入账号';
    }
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
    fieldChange(event) {
      this.cz_number = event.detail;
    },
    editHandle(value) {
      this.cz_number = value;
      this.isModify = true;
    },
    // 验证手机号码的正则
    isPhoneReg(num){
      var num_reg = /^1\d{10}$/;
      if(!num_reg.test(num)){
        return false;
      }
      return true;
    },
    saveModify() {
      let { id, cz_type } = this.config;
      let cz_number = this.cz_number.replace(/\s/g, "");
      if (!cz_number) {
        return uni.showToast({ title: "充值账号不能为空", icon: "none" });
      }

      if (!/^[A-Za-z0-9]+$/.test(cz_number)) {
        return uni.showToast({ title: "充值账号不符合规范", icon: "none" });
      }
      if(cz_type == 1 && !this.isPhoneReg(cz_number)) {
        return uni.showToast({ title: "请输入正确的手机号码", icon: "none" });
      }

      changeNumber({
        id,
        cz_number,
      }).then((res) => {
        if (res.code == 1) {
          this.isModify = false;
          this.$emit("refresh");
        }
        uni.showToast({ title: res.msg, icon: "none" });
      });
    },
  },
};
</script>
<style lang="scss">
.order-info {
  background-color: #ffffff;
  padding: 32rpx 24rpx;
  margin-top: 14rpx;

  .order-item {
    position: relative;
    display: flex;
    align-items: center;
  }
  .order-item + .order-item {
    margin-top: 24rpx;
  }
  .order-item-label {
    font-size: 28rpx;
    color: #999999;
    min-width: 140rpx;
    white-space: nowrap;
  }
  .order-item-value {
    font-size: 28rpx;
    color: #333333;
  }
  .order-tool {
    border: var(--button-border-width, 1px) solid #ebedf0;
    position: absolute;
    right: 0;
    top: 0;
    font-size: 24rpx;
    color: #666666;
    padding: 4rpx 12rpx;
    border-radius: 4px;
  }

  .order-tool-suer {
    border: var(--button-border-width, 1px) solid #ef2b20;
    margin-left: 20rpx;
    font-size: 24rpx;
    color: #ffffff;
    padding: 4rpx 12rpx;
    border-radius: 4px;
    background-color: #ef2b20;
  }
}
</style>
