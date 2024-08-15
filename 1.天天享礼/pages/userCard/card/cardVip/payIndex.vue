<template>
<view class="card" :style="{ '--padding': payBottomDomHeight + 'px'}">
<xh-navbar
  :leftImage="imgUrl+'/static/images/left_back.png'"
  @leftCallBack="$leftBack"
  :fixed="true"
  title="会员续费"
  titleColor="#333"
  :navberColor="isShowNavBerColor ? '#FADF95': ''"
></xh-navbar>
<image :src="cardVip_bgImg" :style="{'--margin': navHeight + 'px' }" mode="widthFix" class="nav_bg"></image>
<view class="card_top">
  <image class="card_top-title" mode="aspectFill"
    src="https://file.y1b.cn/store/1-0/24627/667d1cf9e87ea.png"></image>
  <image class="card_top-icon" mode="aspectFill"
    src="https://file.y1b.cn/store/1-0/24627/667d1deb3f7c8.png"></image>
  <view class="card_price fl_bet">
    <view>年省<text class="card_price-num">1980</text>起</view>
    <view class="card_price-box box_fl_end">
      <view v-html="formatPrice(cardPrice, 1)"></view>
      <view class="card_price-init">¥{{ car_initPrice }}</view>
    </view>
  </view>
</view>
<!-- 开通省钱卡的权益 -->
<cardContDom></cardContDom>
<!-- 支付按钮 -->
<cardBuyBtn
  :isNotCredits="isNotCredits"
  :tabHeightValue="20"
  :isOpenVip="false"
  @changeNotCredits="changeNotCreditsHandle"
  :isAgreement="isAgreement"
  @change="changeHandle"
  @openNoCreditsDia="isShowNoCreditsDia = true"
  :isCreateLoading="isCreateLoading"
  @buyVip="buyVipHandle"
  @warpRectDom="warpRectDomHandle"
></cardBuyBtn>
<!-- 免豆特权的弹窗 -->
<noCreditsDia
  :isShow="isShowNoCreditsDia"
  @close="isShowNoCreditsDia = false"
></noCreditsDia>
<!-- 帮助勾选协议 -->
<confirmDia
  :isShow="isShowAgree"
  @close="isShowAgree = false"
  @confirm="confirmBuyVipHandle"
></confirmDia>
<paySuccessDia
  :isShow="isPaySuccessShow"
  :config="payConfig"
  @close="confirmHandle"
  @confirm="confirmHandle"
></paySuccessDia>
</view>
</template>
<script>
import { buy, orderPay } from "@/api/modules/packet.js";
import cardBuyBtn from '@/components/cardOpen/cardBuyBtn.vue';
import cardContDom from '@/components/cardOpen/cardContDom.vue';
import confirmDia from '@/components/cardOpen/confirmDia.vue';
import noCreditsDia from '@/components/cardOpen/noCreditsDia.vue';
import swiperListCom from '@/components/cardOpen/swiperListCom.vue';
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { formatPrice, getImgUrl } from '@/utils/auth.js';
import getViewPort from '@/utils/getViewPort.js';
import { mapActions, mapGetters } from "vuex";
import openRedPackList from '../component/openRedPackList.vue';
import paySuccessDia from '../component/paySuccessDia.vue';
import prerogativeList from '../component/prerogativeList.vue';
import selCardList from '../component/selCardList.vue';

export default {
  mixins: [MescrollMixin], // 使用mixin
  components: {
    paySuccessDia,
    swiperListCom,
    openRedPackList,
    prerogativeList,
    selCardList,
    cardContDom,
    cardBuyBtn,
    noCreditsDia,
    confirmDia
  },
  data() {
    return {
      imgUrl: getImgUrl(),
      cardImgUrl:`${getImgUrl()}static/card/`,
      default_avatar: `${getImgUrl()}/static/images/default_avatar_grey.png`,
      isShowNavBerColor: false,
      isPaySuccessShow: false,
      upOption: {
        textNoMore: '',
        empty: {
          use: false
        }
      },
      downOption: {
      },
      over_time: 0,
      have_day: 0,
      isSelectVipIndex: 1,
      paymentParams: null,
      payConfig: null,
      isSpread: true,
      payBottomDomHeight: 0,
      isAgreement: false,
      isNotCredits: false,
      isShowNoCreditsDia: false,
      isCreateLoading: false,
      isShowAgree: false,
      reduce: 0,
    }
  },
  computed: {
    ...mapGetters(["userInfo", "cardPrice", "not_creditsPrice", "car_initPrice"]),
    navHeight() {
      let viewPort = getViewPort();
      return viewPort.navHeight;
    },
    buyPrice() {
      if(this.isNotCredits) return Number(this.cardPrice) + Number(this.not_creditsPrice);
      return this.cardPrice;
    },
    carInitPrice() {
      if(this.isNotCredits) return Number(this.car_initPrice) + Number(this.not_creditsPrice);
      return this.car_initPrice;
    },
    cardVip_bgImg() {
      let url = 'https://file.y1b.cn/store/1-0/24627/667d197c2ff9a.png';
      return `${url}`
    }
  },
  // 页面周期函数--监听页面加载
  async onLoad(option) {
    if(option.goods_id) {
      this.over_time = option.over_time;
      this.have_day = option.have_day;
    }
  },
  methods: {
    ...mapActions({
      getUserInfo: 'user/getUserInfo',
    }),
    formatPrice,
    warpRectDomHandle({domBoxHeight}) {
      this.payBottomDomHeight = domBoxHeight;
    },
    changeHandle(changeDetail) {
      this.isAgreement = changeDetail;
    },
    changeNotCreditsHandle(changeDetail) {
      this.isNotCredits = changeDetail;
    },
    confirmBuyVipHandle() {
      this.isAgreement = true;
      this.isShowAgree = false;
      this.buyVipHandle();
    },
    onPageScroll(event) {
      const scrollTop = Math.ceil(event.scrollTop);
      if(scrollTop >= this.navHeight) {
          this.isShowNavBerColor = true;
          return;
      }
      this.isShowNavBerColor = false;
    },
    selectVipHandle(index) {
      this.isSelectVipIndex = index;
      this.paymentParams = null;
    },
    async buyVipHandle() {
      if(!this.isAgreement) return this.isShowAgree = true;
      if(this.isCreateLoading) return;
      this.isCreateLoading = true;
      if(this.paymentParams && (this.reduce == Number(this.isNotCredits))) return this.createPayment();
      this.reduce = Number(this.isNotCredits);
      const res = await buy({ reduce: this.reduce });
      if(res.code != 1 || !res.data) return this.isCreateLoading = false;
      const { oid } = res.data;
      this.orderPayFun(oid);
    },
    async orderPayFun(oid){
      const res = await orderPay({oid});
      if(res.code != 1 || !res.data) return this.isCreateLoading = false;
      this.paymentParams = res.data;
      const { day, start_time, over_time} = this.paymentParams;
      this.payConfig = {
          day,
          start_time,
          over_time
      }
      this.createPayment();
    },
    createPayment() {
      const obj = this.paymentParams;
      uni.requestPayment({
        'nonceStr': obj.nonceStr,
        'package': obj.package,
        'paySign': obj.paySign,
        'signType': obj.signType,
        'timeStamp': obj.timeStamp,
        success: (res) => {
          this.getUserInfo();
          this.isPaySuccessShow = true;
        },
        fail: (err) => {
          this.paymentParams = null;
        },
        complete:(complete)=>{
          this.isCreateLoading = false;
          console.log('requestPayment:complete', complete)
        },
      });
    },
    confirmHandle() {
      this.isPaySuccessShow = false;
      this.$leftBack();
    }
  }
}
</script>

<style lang="scss">
.card{
  position: relative;
  z-index: 0;
  box-sizing: border-box;
  // padding-bottom: calc(var(--padding) + constant(safe-area-inset-bottom));
  // /* 兼容 IOS<11.2 */
  // padding-bottom: calc(var(--padding) + env(safe-area-inset-bottom));
  padding-bottom: var(--padding);
  background: linear-gradient(180deg,#ffffff, #f5f6fa 21%);
  .nav_bg {
    width: 100%;
    position: absolute;
    z-index: -1;
    margin-top: calc(0px - var(--margin));
  }
}


.card_top {
  margin: 14rpx 30rpx 0 32rpx;
  position: relative;
  padding: 48rpx 78rpx 48rpx 80rpx;
  z-index: 0;
  &::after {
    content: '\3000';
    background: url("https://file.y1b.cn/store/1-0/24627/667d1bc5b6d9b.png") 0 0 / 100% 100%;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  &::before {
    content: '\3000';
    width: 750rpx;
    height: 194rpx;
    background: rgba(245,246,250,0.36);
    border-radius: 40rpx 40rpx 0rpx 0;
    position: absolute;
    left: 50%;
    top: 136rpx;
    transform: translateX(-50%);
    z-index: -1;
  }
  &-title {
    width: 190rpx;
    height: 46rpx;
  }
  &-icon {
    width: 174rpx;
    height: 140rpx;
    position: absolute;
    right: 26rpx;
    top: -14rpx;
  }
  .card_price {
    margin-top: 24rpx;
    font-size: 26rpx;
    color: #a98366;
    line-height: 36rpx;
    &-num {
      color: #F84842;
      font-size: 40rpx;
      font-weight: bold;
      margin: 0 8rpx;
      &::after {
        content: '元';
        font-size: 26rpx;
      }
    }
    &-box {
      color: #F84842;
    }
    &-init {
      text-decoration:  line-through;
      margin-left: 8rpx;
      color: #B79069;
    }
  }
}

.profit_type {
  margin-top: 30rpx;
  .profit_item {
    width: 204rpx;
    padding: 20rpx 0 24rpx;
    position: relative;
    color: #61341D;
    z-index: 0;
    text-align: center;
    font-size: 32rpx;
    &::before {
      content: '\3000';
      background: url("https://file.y1b.cn/store/1-0/24627/667d37985c79b.png") 0 0 / 100% 100%;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
    &-title {
      font-weight: bold;
      position: relative;
      font-size: 32rpx;
      z-index: 0;
      &::before {
        content: '\3000';
        position: absolute;
        width: 110%;
        height: 12rpx;
        background: #ffe5d8;
        border-radius: 6rpx;
        bottom: 0rpx;
        left: 50%;
        transform: translateX(-50%);
        z-index: -1;

      }
    }
    &-lab {
      opacity: 0.6;
      font-size: 28rpx;
      margin-top: 14rpx;
    }
  }
}
</style>
