<template>
<view>
  <xhNavbar
    navbarColor="#fff"
    title="提现"
    titleColor="#333"
    leftImage="/static/images/back_02.png"
    @leftCallBack="$back"
    titleAlign="titleLeft"
  ></xhNavbar>
    <!-- 可提现 -->
    <view class="withdraw_top fl_bet">
      <view class="with_left">提现到</view>
      <view class="with_right box_fl">
        <image class="with_right-icon" src="/static/images/mine/icon_wechat_pay.png" mode="aspectFit"></image>
        微信零钱
      </view>
    </view>
    <view class="withdraw_cont">
      <view class="cont_lab">提现金额</view>
      <view class="input_field">
        <van-field
          :value="price_num"
          type="digit"
          placeholder-style="font-size:40rpx;color:#999999;"
          custom-style="font-size:40rpx;--field-input-text-color:#333333;padding:0;"
          :focus="true"
          :border="false"
          @change="changeHandle"
          @clickIcon="price_num = 0"
        ></van-field>
      </view>
      <view class="cont_total box_fl">
        可提现金额 ¥{{vipObject.balance || 0}}
        <view class="total_all" @click="price_num = vipObject.balance" v-if="Number(vipObject.balance)">全部</view>
      </view>
      <!-- <view class="service_price fl_bet">
        <view>手续费</view>
        <view>¥{{vipObject.first_withdraw == 1 ? 0 : vipObject.lv}}</view>
      </view>
      <view class="cont_rem">
        <view class="cont_rem-item">
          <van-icon name="question-o" color="#ccc"/>
          <text style="margin-left: 12rpx">提现须知</text>
        </view>
        <view class="cont_rem-item">1. 单笔提现额度{{vipObject.withdraw_min}}元起提（首次提现不限额）；</view>
        <view class="cont_rem-item">2. 每次提现收取{{vipObject.lv}}元手续费（首次提现免手续费）。</view>
      </view> -->
    </view>
    <view class="confirm_btn" @click="confirmHandle">确认提现</view>
</view>
</template>
<script>
import { getNavbarData } from "@/components/xhNavbar/xhNavbar";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { mapGetters } from "vuex";
import { withdraw, msgTemplate } from "@/api/modules/card.js";
export default {
  name: "withdrawalIndex",
  mixins: [MescrollMixin],
  components: {
  },
  data() {
    return {
      topHeight: "", //自定义导航栏高度
      price_num: '',
    };
  },
  computed: {
    ...mapGetters(['vipObject']),
  },
  methods: {
    changeHandle({ detail }) {
      this.price_num = Number(detail);
    },
    // blurHandle({ detail }) {
    //   const value = Number(detail.value);
    //   if(value >= Number(this.vipObject.balance)) this.price_num = Number(this.vipObject.balance);
    //   if(value <= 0) this.price_num = '';
    // },
    goPage(url){
      this.$go(url);
    },
    async confirmHandle() {
      const minValue = (this.vipObject.first_withdraw == 1) ? 0.1 : Number(this.vipObject.withdraw_min);
      // console.log('minValue', minValue)
      if(Number(this.price_num) < minValue || Number(this.price_num) > 500) return this.$toast(`单笔提现金额范围${minValue}-500元`);
      this.requestWithdraw();
      return;
      // 关闭订阅消息
      const res = await msgTemplate();
      if(res.code != 1) return this.$toast(res.msg);
      const { apply, remit } = res.data;
      const tmplIds = [apply, remit];
      // const tmplIds = ['o5hZJCGunOMC4wO2Ju2aAbuP-D4ZlzsWLGdhpjNcNxw','vQGNuOi7yQPA0JQMJGK7pIeDRoADP9UpPUGcbu0BMSs'];
      // 订阅消息模板
      this.$subscribeMessageHandle(tmplIds).then(res => {
        this.requestWithdraw();
      });
    },
    async requestWithdraw() {
      const params = { money: this.price_num };
      const res = await withdraw(params);
      if(res.code !=1) return this.$toast(res.msg);
      this.goPage(`/pages/cardModule/withdrawal/detail`);
    }
  },
  onLoad() {
    getNavbarData().then((res) => {
      let { navBarHeight, statusBarHeight } = res;
      this.topHeight = navBarHeight + statusBarHeight;
    });
  }
}
</script>
<style lang="scss">
page {
  background: #f4f5f9;
}
.withdraw_top {
  font-size: 32rpx;
  color: #333;
  line-height: 44rpx;
  padding: 44rpx 32rpx;
  margin: 14rpx 0;
  background: #fff;
  .with_right-icon {
    width: 44rpx;
    height: 38rpx;
    margin-right: 12rpx;
  }
}
.withdraw_cont{
  color: #333;
  background: #fff;
  .cont_lab{
    font-size: 32rpx;
    line-height: 44rpx;
    padding: 32rpx 32rpx 16rpx 32rpx;
  }
  .input_field{
    margin: 0 32rpx;
    padding-left: 52rpx;
    position: relative;
    border-bottom: 2rpx solid #e1e1e1;
    padding-top: 23rpx;
    padding-bottom: 8rpx;
    &::before {
      content: '￥';
      position: absolute;
      left: 0rpx;
      top: 0;
      font-size: 56rpx;
      color: #333;
      line-height: 80rpx;
    }
  }
}
.cont_total{
  padding: 24rpx 32rpx 32rpx;
  // border-bottom: 2rpx solid #f2f2f2;
  font-size: 28rpx;
  color: #666;
  line-height: 40rpx;
  .total_all {
    color: #3376FF;
    margin-left: 16rpx;
  }
}
.service_price{
  font-size: 28rpx;
  line-height: 40rpx;
  margin: 0 32rpx;
  padding: 32rpx 0 24rpx;
  border-bottom: 2rpx solid #F2F2F2;
}
.cont_rem{
  padding: 23rpx 32rpx 32rpx;
  font-size: 28rpx;
  color: #cccccc;
  line-height: 40rpx;
  .cont_rem-item{
    &:not(:last-child){
      margin-bottom: 16rpx;
    }
  }
}
.confirm_btn{
  width: 432rpx;
  height: 84rpx;
  line-height: 84rpx;
  background: #ef2b20;
  border-radius: 8rpx;
  margin: 40rpx auto 0;
  font-size: 32rpx;
  text-align: center;
  color: #fff;
}
</style>
