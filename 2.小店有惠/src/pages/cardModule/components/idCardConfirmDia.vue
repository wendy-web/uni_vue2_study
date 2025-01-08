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
      <image class="dia_bg" src="../static/bg.png" mode="widthFix" @click="close"></image>
      <image class="dia_close" src="https://file.y1b.cn/store/1-0/24131/65ba395cf1ec7.png" mode="aspectFit" @click="close"></image>
      <view class="cont_title">实名认证</view>
      <view class="cont_text">
        应国家法律法规对个人资金安全的需求，提现需要完善实名信息。您的个人信息将被严格保密，请放心。
      </view>
      <view class="cont_list">
        <view class="list_item">
          <view class="list_item-lab">姓名</view>
          <van-field
            :value="input_name"
            placeholder="请输入真实姓名"
            placeholder-style="font-size:28rpx;color:#ccc;"
            custom-style="font-size:28rpx;--field-input-text-color:#333333;"
            :border="false"
            :focus="nameFocus"
            auto-focus="true"
            clearable
            @change="changeValueHandle($event, 'input_name')"
          />
        </view>
        <!-- <view class="list_item">
          <view class="list_item-lab">证件类型</view>
          <van-field
            value="居民身份证"
            placeholder=""
            placeholder-style="font-size:28rpx;color:#ccc;"
            :border="false"
            disabled
          ></van-field>
        </view> -->
        <view class="list_item">
          <view class="list_item-lab">身份证号</view>
          <van-field
            :value="idcard_number"
            placeholder="请输入身份证号码"
            placeholder-style="font-size:28rpx;color:#ccc;font-"
            custom-style="font-size:28rpx;--field-input-text-color:#333333;"
            :border="false"
            clearable
            maxlength="18"
            @change="changeValueHandle($event, 'idcard_number')"
          />
        </view>
      </view>
      <view class="agree_text fl_center">
        <van-checkbox checked-color="#F04037" icon-size="15px" style="--checkbox-label-margin:5px;"
          :value="isAgreement" @change="changeHandle">
          我已阅读并同意
        </van-checkbox>
        <text style="color:#FF4F3E" @click="$agreementLookHandle('/agreement/team-agreement.html')">
        《团长服务协议》</text>
      </view>
      <view :class="['cont_btn', isConfirm ? 'active' : '' ]" @click="submitHandle">提交</view>
    </view>
  </van-popup>
</template>
<script>
import { idcardVerify } from "@/api/modules/card.js";
import { mapActions } from "vuex";
// 包括新疆身份证姓名含·并且英文支持空格
const regIdName = /^(([a-zA-Z+\.?\·?a-zA-Z+\s]{2,30}$)|([\u4e00-\u9fa5+\·?\u4e00-\u9fa5+]{2,30}$))/;
const regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
export default {
  name: "confirmAccount",
  props:{
    isShow: {
			type: Boolean,
			default: false
		},
  },
  data() {
    return {
      input_name: '',
      idcard_number: '',
      isAgreement: false,
      nameFocus: true
    };
  },
  computed: {
    isConfirm() {
      return this.input_name && this.idcard_number && this.isAgreement;
    }
  },
  watch: {
    isShow(newValue) {
      if(newValue) this.nameFocus = true;
      console.log('this.nameFocus', this.nameFocus)
    }
  },
  methods: {
    ...mapActions({
      getUserInfo: 'user/getUserInfo',
    }),
    changeValueHandle({ detail }, keyValue) {
      this[keyValue] = detail;
    },
    changeHandle(event) {
      this.isAgreement = event.detail.value;
    },
    validateForm() {
      if(!regIdName.test(this.input_name)){
        this.$toast('请输入正确的姓名');
        return false;
      }
      if(!regIdNo.test(this.idcard_number)){
        this.$toast('身份证号填写错误');
        return false;
      }
      if(!this.isAgreement){
        this.$toast('请勾选团长服务协议');
        return;
      }
      return true;
    },
    async submitHandle() {
      if(!this.isConfirm) return;
      const validateResult = this.validateForm();
      if(!validateResult) return;
      const params = {
        idcard_number: this.idcard_number,
        name: this.input_name
      }
      const result = await idcardVerify(params);
      console.log('result', result);
      if(result.code != 1) {
        this.$showModal({
          content: result.msg
        });
        return;
      }
      this.getUserInfo();
      this.$emit('submitId');
    },
    close() {
      this.$emit("close");
    }
  },
};
</script>
<style lang="scss">
.confirm_cont {
  background-color: #fff;
  font-size: 32rpx;
  line-height: 44rpx;
  width: 638rpx;
  border-radius: 26rpx;
  padding-top: 40rpx;
  padding-bottom: 64rpx;
  position: relative;
  z-index: 0;
  color: #333;
  .dia_bg {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    z-index: -1;
  }
  .dia_close {
    position: absolute;
    right: -28rpx;
    top: -80rpx;
    width: 56rpx;
    height: 56rpx;
  }
  .cont_title {
    font-weight: 600;
    font-size: 36rpx;
    font-weight: bold;
    text-align: center;
    line-height: 50rpx;
    text-align: center;
  }
  .cont_text {
    font-size: 28rpx;
    line-height: 40rpx;
    margin: 40rpx 38rpx 0;
  }
}
.cont_list {
  margin: 40rpx 32rpx 0;
  .list_item {
    display: flex;
    align-items: center;
    background: #f7f8fa;
    border: 1rpx solid #e1e1e1;
    border-radius: 16rpx;
    padding: 12rpx 0 12rpx 24rpx;
    &:not(:first-child) {
      margin-top: 32rpx;
    }
    &-lab {
      color: #777;
      font-size: 28rpx;
      min-width: 142rpx;
      font-weight: bold;
    }
  }
}
.agree_text {
  font-size: 24rpx;
  font-weight: 400;
  text-align: center;
  color: rgba(102,102,102,0.85);
  line-height: 34rpx;
  margin-top: 32rpx;
}
.cont_btn {
  width: 430rpx;
  height: 84rpx;
  background: #f3f5f7;
  border-radius: 16rpx;
  line-height: 84rpx;
  color: #bbbbbb;
  margin: 64rpx auto 0;
  text-align: center;
  &.active {
    background: #ef2b20;
    color: #fff;
  }
}
</style>
