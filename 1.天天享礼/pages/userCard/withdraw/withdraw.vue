<template>
<view>
  <xh-navbar
    title="提现"
    titleColor="#333"
    :leftImage="imgUrl+'/static/images/left_back.png'"
    @leftCallBack="$topCallBack"
  ></xh-navbar>
    <!-- 可提现 -->
    <view class="withdraw_top fl_bet">
      <view class="with_left">提现到</view>
      <view class="with_right box_fl">微信零钱</view>
    </view>
    <view class="withdraw_cont">
      <view class="cont_lab">提现金额</view>
      <view class="input_field">
        <van-field
          :value="price_num"
          type="digit"
          placeholder-style="font-size:40rpx;color:#999999;"
          custom-style="font-size:40rpx;--field-input-text-color:#333333;padding:0;"
          :focus="isFocus"
          :border="false"
          @change="changeHandle"
          @clickIcon="price_num = 0"
        ></van-field>
      </view>
      <view class="cont_total box_fl">
        可提现金额 ¥{{profitInfo && profitInfo.balance || 0}}
        <view class="total_all" @click="price_num = profitInfo.balance " v-if="Number(profitInfo &&profitInfo.balance )">全部</view>
      </view>
      <view class="cont_rem">
        <view class="cont_rem-item">
          <van-icon name="question-o" color="#ccc"/>
          <text style="margin-left: 12rpx">提现须知</text>
        </view>
        <view class="cont_rem-item">1、单笔提现额度1元起提，提现免手续费；</view>
        <view class="cont_rem-item">2、1个工作日到账。</view>
      </view>
    </view>
    <view class="confirm_btn" @click="confirmHandle">确认提现</view>
    <view class="record_history" @click="goToHistoryList">提现记录</view>
		<withdrawSuccessDia
      :isShow="isShowWithdrawDia"
      @close="closeHandleDia"
    ></withdrawSuccessDia>
</view>
</template>
<script>
import { withdraw } from '@/api/modules/user.js';
import { getImgUrl } from '@/utils/auth.js';
import { mapActions, mapGetters } from "vuex";
import withdrawSuccessDia from './withdrawSuccessDia.vue';
export default {
  components: {
    withdrawSuccessDia
  },
  data() {
    return {
      imgUrl: getImgUrl(),
      price_num: '',
      isShowWithdrawDia: false,
      isFocus: false
    };
  },
  computed: {
    ...mapGetters(['profitInfo', 'isAutoLogin']),
  },
  methods: {
    ...mapActions({
        profitInfoRequest: 'user/profitInfoRequest'
    }),
    goToHistoryList() {
      if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
      this.$go('/pages/userCard/withdraw/historyList');
    },
    changeHandle({ detail }) {
      this.price_num = Number(detail);
    },
    closeHandleDia() {
      this.price_num = '';
      this.profitInfoRequest();
      this.isFocus = true;
      this.isShowWithdrawDia = false;
      this.$topCallBack();
    },
    async confirmHandle() {
      this.isFocus = false;
      const minValue = Number(this.profitInfo.withdraw_min);
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
      if(res.code != 1) return this.$toast(res.msg);
      this.isShowWithdrawDia = true;
    }
  },
  onLoad() {
  },
  onShow() {
    this.isFocus = true;
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
  padding: 44rpx 32rpx;
  margin: 48rpx 24rpx 24rpx;
  background: #fff;
  border-radius: 24rpx;
  .with_right {
    &::before {
      content: '\3000';
      background: url("https://file.y1b.cn/store/1-0/231213/6579521118e8e.png") 0 0 / cover;
      display: block;
      width: 44rpx;
      height: 38rpx;
      margin-right: 12rpx;
    }
  }
}
.withdraw_cont{
  color: #333;
  background: #fff;
  border-radius: 24rpx;
  margin: 0 24rpx;
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
  border-bottom: 2rpx solid #f2f2f2;
  font-size: 28rpx;
  color: #666;
  line-height: 40rpx;
  .total_all {
    color: #3376FF;
    margin-left: 16rpx;
  }
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
  border-radius: 24rpx;
  margin: 40rpx auto 0;
  font-size: 32rpx;
  text-align: center;
  color: #fff;
}
.record_history{
  position: absolute;
  width: 100%;
  text-align: center;
  left: 0;
  bottom: 144rpx;
  font-size: 26rpx;
  color: #666;
}
</style>
