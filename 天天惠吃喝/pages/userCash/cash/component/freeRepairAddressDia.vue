<template>
<view>
<van-popup
  :show="isShow"
  custom-style="background-color: transparent;overflow:visible;"
  :z-index="100"
  :catchtouchmove="true"
>
  <view class="dia_cont">
    <view class="order_title">{{addTitle}}</view>
    <view class="order_list">
      <view class="list_item fl_center">
        <view class="item_left">收货人</view>
        <view class="item_right">
          <input class="input_box"
            placeholder="填写收货人姓名"
            v-model="nickName"
          />
        </view>
      </view>
      <view class="list_item fl_center">
        <view class="item_left">手机号</view>
        <view class="item_right">
          <input class="input_box"
            type="tel" maxlength='11'
            placeholder="填写手机号"
            v-model="mobileValue"
          />
        </view>
      </view>
      <view class="list_item fl_center">
        <view class="item_left">地区</view>
        <view class="item_right fl_bet" @click="selAddHandle">
          <input class="input_box"
            type="text"
            placeholder="请选择地区"
            v-model="areaValue"
            :disabled="true"
          />
          <van-icon name="arrow" color="#bbb" />
        </view>
      </view>
      <view class="list_item fl_center">
        <view class="item_left">详细地址</view>
        <view class="item_right">
          <textarea class="text_box"
            :auto-height="true"
            placeholder="请输入地址"
            v-model="addressText"
          />
        </view>
      </view>
    </view>
    <view :class="['order_submit', isActive ? 'active' : '' ]" @click="submitHandle">{{submitBtn}}</view>
  </view>
  <image  class="finish_close" mode="aspectFit"
    src="https://file.y1b.cn/store/1-0/24124/65b0717ce9dcb.png"
    @click="closeHandle"
  ></image>
</van-popup>
<freeSelAddressDia
 :isShow="isShowSelAddDia"
 :areaCode="area_code"
 @close="isShowSelAddDia = false"
 @confirm="confirmSelAddHandle"
></freeSelAddressDia>
</view>
</template>
<script>
import { addressSubmit } from '@/api/modules/cash.js';
import { checkName, isPhoneReg } from '@/utils/index.js';
import freeSelAddressDia from './freeSelAddressDia.vue';
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    selItem: {
      type: Object,
      default: {}
    },
    addTitle: {
      type: String,
      default: '修改收货信息'
    },
    submitBtn: {
      type: String,
      default: '保存'
    }
  },
  components: {
    freeSelAddressDia
  },
  computed: {
    isActive() {
      // return this.nickName;
      return this.nickName && this.mobileValue && this.addressText&& this.areaValue;
    }
  },
  data() {
    return {
      profitMoney: 0,
      isShowSelAddDia: false,
      active_id: 0,
      nickName: '',
      mobileValue: '',
      addressText: '',
      areaValue: '',
      codeAddValue: [],
      area_code: 0
    };
  },
  watch: {
    codeAddValue: {
      handler (newValue, oldValue) {
        if(!newValue.length) return '';
        let addressVal = '';
        newValue.forEach(res=> {
          if(!res) return;
          addressVal += `${res.name} `;
          this.area_code = res.code;
        });
        this.areaValue = addressVal;
      },
			immediate: true,
			deep: true
    },
    selItem: {
      handler(newValue) {
        if(!newValue) return;
        const { id, username, mobile, area, address, area_code } = newValue;
        this.active_id = id;
        this.nickName = username;
        this.mobileValue = mobile;
        this.addressText = address;
        this.areaValue = area;
        this.area_code = area_code;
      },
      immediate: true,
			deep: true
    }
  },
  methods: {
    selAddHandle() {
      this.isShowSelAddDia = true;
    },
    confirmSelAddHandle(codeValue) {
      this.isShowSelAddDia = false;
      this.codeAddValue = codeValue;
    },
    closeHandle() {
      this.$emit('close');
    },
    async submitHandle() {
      const params = this.validateInfo();
      if(!params) return;
      const res = await addressSubmit(params);
      this.$toast(res.msg);
      this.$emit('submit')
    },
    validateInfo() {
      if(!this.nickName.trim()) {
        this.$toast('请填写收货人姓名');
        return false;
      }
      if (!checkName(this.nickName.trim())) {
        this.$toast('姓名格式不正确');
        return false;
      }
      if(!this.mobileValue.trim()) {
        this.$toast('请填写手机号');
        return false;
      }
      if(!isPhoneReg(this.mobileValue.trim())) {
        this.$toast('手机号码格式有误！');
        return false;
      }
      if(!this.areaValue.trim()) {
        this.$toast('请选择地区');
        return false;
      }
      if(!this.addressText.trim()) {
        this.$toast('请输入详细地址');
        return false;
      }
      return {
        active_id: this.active_id,
        username: this.nickName,
        mobile: this.mobileValue,
        area: this.areaValue,
        address: this.addressText,
        area_code: this.area_code
      }
    }
  },
};
</script>

<style lang="scss" scoped>
@import '../static/animation.scss';
.dia_cont {
  position: relative;
  z-index: 0;
  width: 646rpx;
  background: #f1f2f4;
  border-radius: 40rpx;
  color: #333;
  padding: 0 12rpx 28rpx;
  box-sizing: border-box;
  margin-top: -140rpx;
}
.finish_close{
  width: 72rpx;
  height: 72rpx;
  // position: absolute;
  display: block;
  margin: 60rpx auto 0;
  // right: -20rpx;
  // top: -102rpx;
  z-index: 1;
}
.order_title {
  font-size: 36rpx;
  text-align: center;
  line-height: 100rpx;
  font-weight: bold;
}
.award_img-box {
  width: 600rpx;
  height: 600rpx;
  margin: 0 auto;
}
.order_list {
  background: #fff;
  border-radius: 36rpx;
  overflow: hidden;
}
.list_item {
  width: 100%;
  padding: 0 32rpx;
  box-sizing: border-box;
  margin: 40rpx 0 60rpx;
  .item_left {
    width: 124rpx;
    border-radius: 12rpx;
    margin-right: 24rpx;
    font-size: 28rpx;
    flex: 0 0 124rpx;
    position: relative;
    overflow: hidden;
  }
  .item_right {
    flex: 1;
    width: 0;
    align-self: stretch;
    position: relative;
    &::before {
      content: '\3000';
      position: absolute;
      width: 100%;
      height: 2rpx;
      background: #E9E9E9;
      left: 0;
      bottom: -20rpx;
      z-index: 1;
    }
    .input_box {
      font-size: 28rpx;
      flex: 1;
      line-height: 40rpx;
    }
    .text_box {
      width: 100%;
      line-height: 40rpx;
      height: 40rpx;
      font-size: 28rpx;
    }
  }
}
.order_submit {
  width: 472rpx;
  line-height: 80rpx;
  background: #D9D9D9;
  border-radius: 20rpx;
  font-size: 28rpx;
  text-align: center;
  color: #fff;
  margin: 28rpx auto 0;
  &.active {
    background: #f84842;
  }
}
</style>
