<template>
<view class="card card_nav" :style="{ '--padding': payBottomDomHeight + cardBuyBtnDom + 'px'}">
  <mescroll-body
    id="mescrollBody"
    :sticky="true"
    ref="mescrollRef"
    @init="mescrollInit"
    @down="downCallback"
    :down="downOption"
    :up="upOption"
    @up="upCallback"
    :height="mescrollHeight"
  >
    <xh-navbar
      navbarImageMode="widthFix"
      :overFlow="true"
      :fixedNum="9"
      titleAlign="titleCenter"
      :navberColor="showTitleBgColor"
    >
      <view slot="title" class="nav-custom">
        <image class="title_icon" mode="aspectFill" src="https://file.y1b.cn/store/1-0/24627/667d1b1b06071.png" ></image>
      </view>
    </xh-navbar>
    <image src="https://file.y1b.cn/store/1-0/24627/667d197c2ff9a.png" :style="{'--margin': navHeight + 'px' }"
    mode="widthFix" class="nav_bg"></image>
    <block v-if="!userInfo.is_vip">
      <view class="card_top">
        <image class="card_top-title" mode="aspectFill"
          src="https://file.y1b.cn/store/1-0/24627/667d1cf9e87ea.png"></image>
        <image class="card_top-icon" mode="aspectFill"
          src="https://file.y1b.cn/store/1-0/24627/667d1deb3f7c8.png"></image>
        <view class="card_price fl_bet">
          <view>年省<text class="card_price-num">1980</text>起</view>
          <view class="card_price-box box_fl_end">
            <view v-html="formatPrice(cardPrice)"></view>
            <view class="card_price-init">¥{{car_initPrice}}</view>
          </view>
        </view>
      </view>
      <!-- 开通省钱卡的权益 -->
      <cardContDom></cardContDom>
      <view style="margin-top: 8rpx;">
        <good-list
          :list="homeGoods"
          :isHome="true"
          :isShowProfit="true"
          :isShowProfitBtn="true"
          :showProfitBtnTxt= "3.3"
        ></good-list>
      </view>
    </block>
    <!-- 已开通 -->
    <block v-else>
      <view class="car_top-active" @click.stop="goPayDetailHandle">
          <view class="box_fl">
            <view @click.stop="goRecordHandle">
              <van-image class="avatar-icon"
                height="80rpx" width="80rpx" radius="50%"
                :src="userInfo.avatar_url || default_avatar"
                use-loading-slot
              ><van-loading slot="loading" type="spinner" size="20" vertical />
              </van-image>
            </view>
            <view class="nick_cont" @click.stop="goRecordHandle">
              <view class="nick_name">{{ userInfo.nick_name || "未登录" }}</view>
              <view class="nick_lab" v-if="vipObject.over_time">
                省钱{{['月', '季', '年'][vipObject.card_type || 0]}}卡：{{vipObject.over_time}}到期
              </view>
            </view>
          </view>
          <view class="car_top-cont box_fl">
            <view class="top_cont-left" v-if="vipObject.saving_money">
              已为您省了
              <text class="top_cont-num">{{vipObject.saving_money}}</text>元
              <van-icon custom-style="font-weight: 600;margin-left: 10rpx" size="28rpx" name="arrow"/>
            </view>
            <view class="car_open-lab" v-else-if="vipObject.money">
              预计可省
              <text class="top_cont-num" style="margin: 0 5rpx;">{{vipObject.money || 0}}</text>元+
            </view>
            <view class="car_open-lab" v-else>
              预计年省
              <text class="top_cont-num" style="margin: 0 5rpx;">1980</text>元+
            </view>
            <view class="top_cont-right" v-if="vipObject.need_xf" @click.stop="goPayHandle">续费</view>
          </view>
      </view>
      <view class="cont_bottom">
        <good-list
          :list="goods"
          :isShowProfit="true"
        ></good-list>
      </view>
    </block>
  </mescroll-body>
  <!-- 支付按钮 -->
  <cardBuyBtn
    v-if="!userInfo.is_vip"
    :tabHeightValue="tabHeightValue"
    :isNotCredits="isNotCredits"
    @changeNotCredits="changeNotCreditsHandle"
    :isAgreement="isAgreement"
    @change="changeHandle"
    @openNoCreditsDia="isShowNoCreditsDia = true"
    :isCreateLoading="isCreateLoading"
    @buyVip="buyVipHandle"
    @warpRectDom="warpRectDomHandle"
  ></cardBuyBtn>
  <noCreditsDia
    :isShow="isShowNoCreditsDia"
    @close="isShowNoCreditsDia = false"
  ></noCreditsDia>
  <confirmDia
    :isShow="isShowAgree"
    @close="isShowAgree = false"
    @confirm="confirmBuyVipHandle"
  ></confirmDia>
  <paySuccessDia
    :isShow="isOpenVip"
    :vipObject="vipObject"
    title="开通成功"
    @close="isOpenVip = false"
  ></paySuccessDia>
  <custom-tab-bar
    currentID="1"
    @domObjHeight="domObjHeightHandle"
    @recommend="recommendUpdate"
  />
</view>
</template>
<script>
import { buy, orderPay, savingInfo } from "@/api/modules/packet.js";
import { couponGroup, couponList } from "@/api/modules/shopMall.js";
import cardBuyBtn from '@/components/cardOpen/cardBuyBtn.vue';
import cardContDom from '@/components/cardOpen/cardContDom.vue';
import confirmDia from '@/components/cardOpen/confirmDia.vue';
import noCreditsDia from '@/components/cardOpen/noCreditsDia.vue';
import swiperListCom from '@/components/cardOpen/swiperListCom.vue';
import customTabBar from "@/components/customTabBar/index.vue";
import goodList from "@/components/goodList.vue";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import getViewPort from '@/utils/getViewPort.js';
import groupRecommendMixin from '@/utils/mixin/groupRecommendMixin.js'; // 混入推荐商品列表的方法
import { mapActions, mapGetters, mapMutations } from "vuex";
import paySuccessDia from './paySuccessDia.vue';
export default {
  mixins: [MescrollMixin, groupRecommendMixin], // 使用mixin
  components: {
    customTabBar,
    swiperListCom,
    goodList,
    noCreditsDia,
    confirmDia,
    cardContDom,
    cardBuyBtn,
    paySuccessDia
  },
  data() {
    return {
      downOption: {
        auto: true,
        use: true,
        bgColor: "#ffffff",
      },
      upOption: {
        auto: false, // 不自动加载
        use: true,
        page: {
          num: 0,
          size: 1,
          time: null,
        },
      },
      showTitleBg: false,
      scrollTopNum: 0,
      tabHeightValue: 0,
      stickyTitleTop: 0,
      isRecommendRequest: false,
      isStickyActiveScroll: false,
      interstitialAd: null,
      vipObject: null,
      isAgreement: false,
      isNotCredits: false,
      payBottomDomHeight: 0,
      mescrollHeight: '100%',
      cardBuyBtnDom: '',
      isShowNoCreditsDia: false,
      reduce: 0,
      isShowAgree: false,
      isCreateLoading: false,
      isPayRequest: false,
      vipNumberCardCurrent: -1,
      isOpenVip: false,
      tabsList: [],
      tabIndex: 0,
      currentTime: new Date().getTime(),

    };
  },
  computed: {
    ...mapGetters([
      "userInfo",
      "isAutoLogin",
      "cardPrice",
      "car_initPrice"
    ]),
    navHeight() {
      let viewPort = getViewPort();
      return viewPort.navHeight;
    },
    showTitleBgColor() {
      return this.showTitleBg ? '#FFC478' : '';
    },
    // 列表数据
    homeGoods() {
      if (!this.tabsList.length) return [];
      let homeGoodsList = [];
      this.tabsList.forEach((item, index) => {
        if(!item.goods) return;
        let list = this.resetList(item.goods);
        homeGoodsList = homeGoodsList.concat(list); //追加新数据
      });
      return homeGoodsList;
    }
  },
  watch: {
    'userInfo.vip_number': {
			handler:async function (newValue, oldValue) {
        if(newValue != this.vipNumberCardCurrent && [0, 3].includes(newValue)) {
          this.mescroll.resetUpScroll();
        }
      },
			deep: true
    }
  },
  onLoad() {},
  onShow() {
    this.getUserInfo();
    // 从续费的页面返回时 - 更新用户信息
    if(this.userInfo.is_vip) {
      this.initVipObject();
    }
    this.mescroll.scrollTo(0)
  },
  methods: {
    ...mapActions({
      getUserInfo: 'user/getUserInfo',
    }),
    ...mapMutations({
      setCardNewShow: "user/setCardNewShow",
    }),
    resetList(goods) {
      let list = goods;
      let isType9 = 0;
      // 列表对单列呈现进行后排数组的操作
      list.length && list.forEach((nowItem, index) => {
        if(nowItem.hide_time) {
          const hideTime = new Date(nowItem.hide_time).getTime();
          let diffTime = hideTime - this.currentTime;
          // const oneTime = 60 * 60 * 1000;
          // diffTime = (diffTime > oneTime) ? nextHourTime : diffTime;
          nowItem.diffTime = diffTime;
          nowItem.timeData = {
            hours: 0,
            minutes: 0,
            seconds: 0,
            milliseconds: 0,
            days: 0
          };
          nowItem.isFinishDiffTime = false;
        }
        if(nowItem.type != 9 ) return;
        if(index%2 && (isType9%2) == 0) {
          list[index] = goods[index-1];
          list[index - 1] = nowItem;
        }
        if((index%2) == 0 && isType9%2) {
          list[index] = goods[index-1];
          list[index - 1] = nowItem;
        }
        isType9 += 1;
      });
      return list;
    },
    async initVipObject() {
      const res = await savingInfo();
      if(res.code != 1 || !res.data) return;
      this.vipObject = res.data;
      if(this.isPayRequest && !this.userInfo.is_vip) {
        this.getUserInfo();
        this.isOpenVip = true;
      };
    },
    confirmBuyVipHandle() {
      this.isAgreement = true;
      this.isShowAgree = false;
      this.buyVipHandle();
    },
    async buyVipHandle() {
      if(!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
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
      this.createPayment();
    },
    createPayment() {
      const regex = /^requestPayment:fail cancel$/;
      const obj = this.paymentParams;
      uni.requestPayment({
        'nonceStr': obj.nonceStr,
        'package': obj.package,
        'paySign': obj.paySign,
        'signType': obj.signType,
        'timeStamp': obj.timeStamp,
        success: (res) => {
          this.isPayRequest = true;
          this.initVipObject();
          this.mescroll.triggerDownScroll();
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
    changeHandle(changeDetail) {
      this.isAgreement = changeDetail;
    },
    changeNotCreditsHandle(changeDetail) {
      this.isNotCredits = changeDetail;
    },
    formatPrice(price) {
      price = Number(price).toString();
      if (!price) return;
      let splitPrice = price.split(".");
      return `
        <span style="font-family: PingFang SC, PingFang SC-Regular;font-weight:600;font-size: 24px">
          <span style="font-size: 13px;margin-right: -3px">¥</span>
          ${splitPrice[0]}.<span style="font-size: 14px;">${splitPrice[1]}</span>
        </span>`;
    },
    goRecordHandle() {
      if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
      this.$go('/pages/userCard/card/cardVip/recordCard');
    },
    goPayDetailHandle() {
      if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
      if(this.vipObject.saving_money) {
        this.$go(`/pages/userCard/card/cardVip/payDetail`);
      }
    },
    goPayHandle() {
      if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
      const { id, over_time, have_day } = this.vipObject;
      this.$go(`/pages/userCard/card/cardVip/payIndex?goods_id=${id}&over_time=${over_time}&have_day=${have_day}`);
    },
    warpRectDomHandle({contHeight, domBoxHeight}) {
      // this.mescrollHeight = contHeight;
      console.log('this.mescrollHeight', this.mescrollHeight, domBoxHeight);
      this.cardBuyBtnDom = domBoxHeight;
    },
    /* 上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
    downCallback(page) {
      this.isInitHomeList = true;
      this.isRequestGuessList = false;
      this.pageNum = 1;
      this.groupRecommendData = null;
      if(this.userInfo.is_vip && !this.isPayRequest) {
        this.initVipObject();
        this.mescrollHeight = '100%';
        this.mescroll.resetUpScroll();
        return;
      };
      // this.homeTabList(page);
      this.mescroll.resetUpScroll();
      // this.mescroll.endSuccess();
    },
    async upCallback(page) {
      this.vipNumberCardCurrent = this.userInfo.vip_number;
      // 非省钱卡
      if(!this.userInfo.is_vip && !this.isPayRequest) {
        // this.mescroll.endSuccess(0);
        // this.mescroll.removeEmpty();
        this.homeTabList(page);
        return;
      }
      if(this.isInitHomeList) {
        this.requestGoodsList(page);
        return;
      }
      if(this.isRequestGuessList) {
        this.guessListFun(page);
        return;
      }
      this.requestRem(page);
    },
    async homeTabList(page) {
      // if(page.num == 1) this.tabsList = [];
      if (!this.tabsList.length) {
        let res = await couponGroup();
        let _tab = res.data.map((item) => {
          return {
            group_id: item.id,
            goods: null,
            itemPageNum: 1
          };
        });
        this.tabsList = _tab;
      }
      if (!this.tabsList[this.tabIndex]) return this.mescroll.endSuccess(0);
      // console.log('this.tabsList', this.tabsList)
      const currentItem = this.tabsList[this.tabIndex];
      const { itemPageNum, group_id } = currentItem;
      const params = {
        page: itemPageNum,
        size: 10,
        group_id,
        not_home: 1
      };
      const res = await couponList(params).catch(() => this.mescroll.endErr());
      if(!res.code || !res.data) return this.mescroll.endSuccess(0);
      const { current_page, last_page, total, data: list } = res.data;
      // 设置列表数据
      if (!currentItem.goods) currentItem.goods = [];
      currentItem.goods = currentItem.goods.concat(list); //追加新数据
      currentItem.itemPageNum += 1;
      this.tabsList[this.tabIndex] = currentItem;
      if (this.tabIndex < this.tabsList.length) {
        this.mescroll.endSuccess(10, true); // 永远可翻页
      } else {
        this.mescroll.endBySize(list.length, total);
      }
      // 最后一项进行下一个tab的切换 _已切换的
      if (current_page >= last_page) {
        this.tabIndex += 1;
        this.mescroll.triggerUpScroll();
      }
    },
    // 页面的滚动事件
    onPageScroll(e) {
      const scrollTop = Math.ceil(e.scrollTop);
      this.showTitleBg = (scrollTop > 0);
      this.scrollTopNum = scrollTop;
      // 滚动到吸顶的active的行为
      if (scrollTop >= this.stickyTitleTop) {
        this.isStickyActiveScroll = true;
        return;
      }
      this.isStickyActiveScroll = false;
    },
    domObjHeightHandle(height) {
      this.tabHeightValue = height;
    },
  }
};
</script>

<style lang="scss">
page {
  background-color: #f7f7f7;
}
.card_nav {
  position: relative;
  padding-bottom: 110rpx;
  overflow: hidden;
  padding-bottom: calc(110rpx + var(--padding) + constant(safe-area-inset-bottom));
  /* 兼容 IOS<11.2 */
  padding-bottom: calc(110rpx + var(--padding) + env(safe-area-inset-bottom));
  /* 兼容 IOS>11.2 */
}
.card {
  position: relative;
  z-index: 0;
  .nav_bg {
    width: 100%;
    position: absolute;
    z-index: -1;
    margin-top: calc(0px - var(--margin));
  }
}

.nav-custom {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  .title_icon {
    width: 226rpx;
    height: 36rpx;
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
      font-size: 48rpx;
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

.car_top-active {
  margin: 34rpx 4rpx 0;
  position: relative;
  z-index: 0;
  font-size: 0;
  padding: 52rpx 60rpx 48rpx 60rpx;
  &::before {
    content: '\3000';
    background: url("https://file.y1b.cn/store/1-0/24628/667e323da9ce8.png") 0 0 / 100% 100%;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  &::after {
    content: '\3000';
    background: url("https://file.y1b.cn/store/1-0/24628/667e32e047a4c.png") 0 0 / 100% 100%;
    position: absolute;
    width: 210rpx;
    height: 190rpx;
    right: 36rpx;
    top: -16rpx;
    z-index: -1;
  }
  .car_top-cont {
    margin-top: 20rpx;
    .top_cont-left{
      line-height: 36rpx;
      font-size: 26rpx;
      color: #333;
    }
    .top_cont-right{
      width: 104rpx;
      height: 52rpx;
      border: 2rpx solid rgba(252,241,215,0.80);
      border-radius: 35rpx;
      line-height: 52rpx;
      text-align: center;
      font-size: 28rpx;
      color: #9a4119;
      position: relative;
      margin-left: 32rpx;
      &::before {
        content: '\3000';
        position: absolute;
        z-index: -1;
        top: 4rpx;
        left: 4rpx;
        width: 96rpx;
        height: 44rpx;
        background: rgba(254,250,241,0.68);
        border-radius: 30rpx;
      }
    }
  }
}
.nick_cont{
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  line-height: 40rpx;
  margin-left: 20rpx;
  .nick_name {
    color: #B75A30;
    line-height: 1;
    &::before {
      content: '\3000';
      background: url("https://file.y1b.cn/public/img/ttxl/static/card/card_icon.png") 0 0 / 100% 100%;
      width: 28rpx;
      height: 26rpx;
      margin-right: 4rpx;
      display: inline-block;
    }
  }
  .nick_lab{
    font-size: 24rpx;
    font-weight: 400;
    color: #666;
    line-height: 34rpx;
    margin-top: 6rpx;
  }
}
.cont_bottom {
  position: relative;
  z-index: 0;
  padding-top: 16rpx;
  margin-top: -32rpx;
  &::before {
    content: '\3000';
    background: url("https://file.y1b.cn/store/1-0/24627/667d27ae9aed5.png") 0 0 / 100% 100%;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 200rpx;
    z-index: -1;
  }
}

.car_open-lab {
  font-size: 26rpx;
  color: #333;
  position: relative;
  z-index: 0;
  &::before {
    content: "\3000";
    position: absolute;
    width: 100%;
    height: 16rpx;
    background: rgba(255, 255, 255, 0.4);
    bottom: 0;
    z-index: -1;
    left: 50%;
    transform: translateX(-50%);
  }
}
.top_cont-num {
  font-size: 48rpx;
  font-weight: 600;
  color: #F84842;
}
</style>
