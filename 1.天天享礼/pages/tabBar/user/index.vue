<template>
<view :class="['user nav_cont', userInfo.is_vip ? 'active' : '' ]">
  <xh-navbar
    navbarImageMode="widthFix"
    :overFlow="true"
    :fixedNum="9"
    titleAlign="titleRight"
    :navberColor="showTitleBgColor"
  >
    <view slot="title" class="nav-custom">
      <view :class="['title_icon ani_head', (!isShowAvaTitle || !textList.length) ? 'ani_head-in' : 'ani_head-out']"></view>
      <swiperSearch
        :textList="textList"
        :isSwiperTxt="isShowAvaTitle"
        :class="['swiper_search', (isShowAvaTitle && textList.length) ? 'ani_flex-in' : 'ani_flex-out',]"
      ></swiperSearch>
    </view>
  </xh-navbar>
  <mescroll-body
    id="mescrollBody"
    :sticky="true"
    ref="mescrollRef"
    @init="mescrollInit"
    @down="downCallback"
    :down="downOption"
    :up="upOption"
    @up="upCallback"
  >
    <view class="user-info" @click="goPages('/pages/userInfo/personalInfo/index')">
      <view class="user-avatar">
        <!-- 头像 -->
        <van-image
          class="avatar-icon"
          height="112rpx"
          width="112rpx"
          radius="50%"
          :src="userInfo.avatar_url || default_avatar"
          use-loading-slot
        ><van-loading slot="loading" type="spinner" size="20" vertical />
        </van-image>
      </view>
      <view v-if="isAutoLogin" class="fl1">
        <view :class="['nick-name', userInfo.is_vip ? 'active' : '']">
          {{ userInfo.nick_name || "未登录" }}
        </view>
        <view class="user-id"> ID：{{ userInfo.id || 0 }} </view>
      </view>
      <view v-else class="not_login"> Hi~请登录<van-icon custom-style="font-weight: 600;" name="arrow"/></view>
      <!-- 领取返现的入口 -->
      <view class="use_right fl_col_cen" @click.stop="goToCashHandle" v-if="isAutoLogin">
        <view :class="['cash_icon fl_center', showCashRed ? 'active' : '']">
          免单返现<van-icon name="arrow" color="#666" size="12" style="margin-left: 8rpx;" />
        </view>
      </view>
    </view>
    <!-- 省钱卡会员 -->
    <view class="card_vip_box" v-if="userInfo.is_vip"
      @click="showToastVipHandle">
      <view class="card_title fl_start">
        <van-icon name="arrow" color="#B75A30" size="26rpx" custom-style="font-weight: 600;"/>
      </view>
      <view class="card_lab" v-if="vipObject.saving_money">
        已为您省了
        <text style="color: #f84842; margin: 0 5rpx">{{vipObject.saving_money || 0}}</text>元
      </view>
      <view class="car_open-lab" v-else-if="vipObject.money">
        预计可省
        <text class="top_cont-num">{{vipObject.money || 0}}</text>元+
      </view>
      <view class="card_open-lab" v-else>
        预计年省
        <text class="top_cont-num">1980</text>元+
      </view>
      <view class="card_bottom fl_bet">
        <view class="card_rem">{{ vipObject.over_time || todayTime }} 到期</view>
        <!-- 省钱卡标识 -->
        <image class="card_type" mode="aspectFill" :src="cardType[vipObject.card_type || 0]"></image>
      </view>
    </view>
    <!-- 省钱卡 - 未开通 -->
    <view class="card_box fl_bet" v-else @click="showToastVipHandle">
      <view class="fl_start">
        <view class="card_noVip_title fl_start"></view>
        <view class="card_lab">年省<text style="color: #f84842">1980</text>元起</view>
      </view>
    </view>
    <!-- 我的订单 -->
    <view class="user-order" id="userOrderId">
      <view class="order-list">
        <view class="order-item" @click="goPages(item.path)"
          v-for="item in orders" :key="item.id">
          <view class="order-item-top">
            <view :class="['oii-icon', item.iconClass]"></view>
            <!-- <image class="oii-icon" mode="aspectFill" :src="item.icon"></image> -->
            <view class="oit-num" v-show='shotOitNum(item)'>{{ userTotal[item.key] }}</view>
          </view>
          <view class="order-item-name">{{ item.name }}</view>
        </view>
      </view>
      <view class="return_cash fl_bet" v-if="profitInfo.total_num" @click="drawHandle">
        <view class="rc_left fl_center">你有 {{ profitInfo.total_num }} 笔订单返现待领取</view>
        <view class="rc_right">领返现</view>
      </view>
    </view>
    <view class="user-assets">
      <view class="user-assets-title"> 我的资产 </view>
      <view class="user_assets_list fl_center">
        <view class="uab_item" @click="goPages('/pages/userModule/myCowpea/index')">
          <view class="uab_item-cont">
            {{ userTotal.credits || 0 }}<text class="uab_item-lab">豆</text>
          </view>
          <view class="uab_item-lab">牛金豆</view>
        </view>
        <view class="uab_item" @click="goPages('/pages/userModule/myCoupon/index', true)">
          <view :class="['uab_item-cont', userTotal.coupon_read ? 'card-new-show' : '']">
            {{ userTotal.coupon || 0 }}<text class="uab_item-lab">张</text>
          </view>
          <view class="uab_item-lab">优惠券</view>
        </view>
        <view class="uab_item" @click="goWithdrawHandle">
          <view :class="['uab_item-cont', profitInfo.total_num ? 'card-new-show' : '']">
            <view v-html="formatPrice(showExpandNum)" class="uab_item-price"></view>
          </view>
          <view class="uab_item-lab">零钱</view>
        </view>
      </view>
    </view>
    <!-- 菜单 -->
    <view class="user-menus">
      <scroll-view class="bean_list-box"
        scroll-x="true"
        scroll-with-animation
        :scroll-animation-duration="300"
		    @scroll="banScrollHandle"
      >
        <view class="swiper-item box_fl">
          <block v-for="item in menus" :key="item.id">
            <view v-if="isAutoLogin && (item.path == 'share')" class="user-menus-item">
              <button open-type="share" class="menus-item-share-btn fl_col_cen">
                <image class="umi-icon" :src="item.icon" mode="aspectFill"></image>
                <view class="umi-name">{{ item.name }}</view>
              </button>
            </view>
            <view v-else class="user-menus-item fl_col_cen" @click="goToMenusHandle(item.path)">
              <view class="umi-icon">
                <view class="oit-num" v-if="item.path == 'code' && !isShowCodeNum">1</view>
                <view :class="['umi-icon-mixin', item.iconClass]" v-if="item.iconClass"></view>
                <image class="umi-icon-img" :src="item.icon" mode="aspectFill" v-else></image>
              </view>
              <view class="umi-name">{{ item.name }}</view>
            </view>
          </block>
        </view>
      </scroll-view>
      <view class="ban_index-box">
        <view class="ban_index-active" :style="{left: menusLeft + 'px'}"></view>
      </view>
    </view>
    <good-list
      v-if="goods.length"
      :list="goods"
      :isBolCredits="true"
      :isJdLink="true"
      :isShowProfit="true"
      @notEnoughCredits="notEnoughCreditsHandle"
      id="stickyListId"
    ></good-list>
  </mescroll-body>
  <custom-tab-bar
  currentID="3"
    @domObjHeight="domObjHeightHandle"
    @recommend="recommendUpdate"
  />
  <!-- 商品专题的半屏组件 -->
  <specialLisMiniPage
    ref="specialLisMiniPage"
    @notEnoughCredits="notEnoughCreditsHandle"
    @specialLisShare="specialLisShareHandle"
    @isBannerClick="goodListBannerHandle"
  ></specialLisMiniPage>
  <!-- 配置的弹窗管理 -->
  <configurationDia
    ref="configurationDia"
    :isShow="isShowConfig"
    @close="closeShowConfig"
    :config="config"
    @popoverRember="requestPopoverRember"
    :remainTime="remainTime"
  ></configurationDia>
  <!-- 牛金豆不足的情况 -->
  <exchangeFailed
    :isShow="exchangeFailedShow"
    @goTask="goTaskHandle"
    @close="exchangeFailedShow = false"
  ></exchangeFailed>
  <!-- 赚取牛金豆 -->
  <serviceCredits
    ref="serviceCredits"
    :isShow="serviceCreditsShow"
    @showAdPlay="showAdPlayHandle"
    @close="closeHandle"
  ></serviceCredits>
  <!-- 导航往头部的指引标 -->
  <view class="scroll_top fl_center"
    v-if="isStickyActiveScroll"
    @click="scrollUpHandle"
  ></view>
  <!-- 优惠推荐商品的弹窗 -->
  <recommendDia ref="recommendDia"></recommendDia>
  <returnCashDia
		:isShow="isShowReturnCashDia"
		@close="isShowReturnCashDia = false"
    @getDraw="getDrawHandle"
	></returnCashDia>
  <!-- 优惠雷达二维码弹窗 -->
  <codeDia
    :isShow="isShowCodeDia"
    @close="isShowCodeDia = false"
  ></codeDia>
</view>
</template>
<script>
import { keywordList } from "@/api/modules/jsShop.js";
import { savingInfo } from "@/api/modules/packet.js";
import { msgTemplate, profitMes } from '@/api/modules/user.js';
import configurationFun from "@/components/configurationDia/configurationFun.js";
import configurationDia from "@/components/configurationDia/index.vue";
import customTabBar from "@/components/customTabBar/index.vue";
import goodList from "@/components/goodList.vue";
import returnCashDia from '@/components/returnCashDia.vue';
import exchangeFailed from "@/components/serviceCredits/exchangeFailed.vue";
import serviceCredits from "@/components/serviceCredits/index.vue";
import serviceCreditsFun from "@/components/serviceCredits/serviceCreditsFun.js";
import specialLisMiniPage from "@/components/specialLisMiniPage.vue";
import swiperSearch from '@/components/swiperSearch.vue';
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { getBaseUrl, getDrawShowDiaStorage, getImgUrl, getShowCodeNum, getStorage, setShowCodeNum, setStorage, warpRectDom } from "@/utils/auth.js";
import getViewPort from "@/utils/getViewPort.js";
import { parseTime } from '@/utils/index.js';
import groupRecommendMixin from '@/utils/mixin/groupRecommendMixin.js'; // 混入推荐商品列表的方法
import shareMixin from '@/utils/mixin/shareMixin.js'; // 混入分享的方法
import { mapActions, mapGetters, mapMutations } from "vuex";
import codeDia from './codeDia.vue';
import config from "./config.js";
export default {
  mixins: [MescrollMixin, configurationFun, serviceCreditsFun, shareMixin, groupRecommendMixin], // 使用mixin
  components: {
    customTabBar,
    configurationDia,
    serviceCredits,
    exchangeFailed,
    goodList,
    returnCashDia,
    swiperSearch,
    specialLisMiniPage,
    codeDia
  },
  data() {
    return {
      downOption: {
        auto: false,
        use: false,
        bgColor: "#ffffff",
      },
      upOption: {
        auto: true, // 不自动加载
        use: true,
        page: {
          num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
          size: 1, // 每页数据的数量
        },
        noMoreSize: 4,
        empty: {
          use: false,
        	tip: '~ 空空如也 ~', // 提示
        	btnText: '去看看'
        }
      },
      /*订单*/
      orders: config.orders,
      /*菜单*/
      menus: config.menus,
      default_avatar: `${getImgUrl()}/static/images/default_avatar_grey.png`,
      cardImgUrl:`${getImgUrl()}static/card/`,
      imgUrl: getImgUrl(),
      showTitleBg: false,
      scrollTopNum: 0,
      showCowpeaNavTop: 0,
      tabHeightValue: 0,
      stickyTitleTop: 0,
      isRecommendRequest: false,
      isStickyActiveScroll: false,
      interstitialAd: null,
      vipObject: null,
      todayTime: parseTime(Date.now(), '{y}-{m}-{d}'),
      isShowReturnCashDia: false, // 领取提现
      menusLeft: 0,
      showExpandNum: 0,
      textList: [],
      cardType: [
        'https://file.y1b.cn/store/1-0/24116/65a5e5c3a9370.png',
        'https://file.y1b.cn/store/1-0/24116/65a5e6a9acfe5.png',
        'https://file.y1b.cn/store/1-0/24116/65a5e6bf21e01.png'
      ],
      cashStorageKey: `${getBaseUrl()}_useRedDot_cashDay`,
      isShowRed: true,
      isShowCodeDia: false,
      isShowCodeNum: getShowCodeNum() || 0,
      vipNumberUserCurrent: -1
    };
  },
  watch: {
    // 监听标题头到顶部的距离
    stickyTitleTop() {
      if (this.scrollTopNum >= this.stickyTitleTop) {
        this.isStickyActiveScroll = true;
        return;
      }
      this.isStickyActiveScroll = false;
    },
    'userInfo.vip_number': {
			handler:async function (newValue, oldValue) {
        if(newValue != this.vipNumberUserCurrent && [0, 3].includes(newValue)) {
          this.mescroll.resetUpScroll();
        }
      },
			deep: true,
      // immediate: true
    },
    'profitInfo.packet_amount': {
      handler:async function (newValue, oldValue) {
        this.gradualAnimation(newValue);
			},
			deep: true
    }
  },
  computed: {
    ...mapGetters([
      "userInfo",
      "userTotal",
      "isCardNewShow",
      "isAutoLogin",
      "profitInfo"
    ]),
    mescrollHeight() {
      let viewPort = getViewPort();
      let mescrollHeight =
        viewPort.windowHeight -
        viewPort.navHeight -
        uni.upx2px(84) -
        this.tabHeightValue;
      return mescrollHeight + "px";
    },
    isShowAvaTitle() {
      if (this.scrollTopNum > this.showCowpeaNavTop) return true;
      return false;
    },
    // 吸顶的的top值
    stickyTop() {
      let viewPort = getViewPort();
      return viewPort.navHeight;
    },
    showTitleBgColor() {
      let color = ''
      if(this.showTitleBg) {
        color = this.userInfo.is_vip ? '#FCEECE' : '#F8EDE3';
      }
      return color;
    },
    showCashRed() {
      const currentDate = new Date();
      let cur_date = parseTime(currentDate, "{y}/{m}/{d}");
      const showProfitStatusDay = getStorage(this.cashStorageKey);
      if(showProfitStatusDay || showProfitStatusDay == cur_date) return false;
      return this.isShowRed || this.userTotal.profit_status;
    }
  },
  onLoad() {
    this.init();
    this.initAd();
    this.initTextList();
    this.showExpandNum = this.profitInfo.packet_amount || 0;
  },
  onShow() {
    this.downCallback();
    this.profitInfoRequest();
    this.getUserInfo();
  },
  methods: {
    ...mapActions({
      getUserTotal: "user/getUserTotal",
      profitInfoRequest: 'user/profitInfoRequest',
      getUserInfo: "user/getUserInfo",
    }),
    ...mapMutations({
      setCardNewShow: "user/setCardNewShow",
    }),
    warpRectDom,
    async initVipObject() {
      const res = await savingInfo();
      if(res.code != 1 || !res.data) return;
      this.vipObject = res.data;
    },
    showToastVipHandle() {
      if (!this.isAutoLogin) return this.$go("/pages/tabAbout/login/index");
      this.$switchTab('/pages/tabBar/card/index');
    },
    async initTextList () {
      const res = await keywordList();
      if (res.code == 1 && res.data) {
        this.textList = res.data;
      }
    },
    // 列表广告位 - 跳转至半屏推券
    goodListBannerHandle(item) {
      this.$refs.recommendDia.initGtData({
        ...item,
        interval_time: item.type_sid
      });
    },
    shotOitNum(item) {
      const { id, key } = item;
      return (id < 3) && (this.userTotal[key] > 0);
    },
    gradualAnimation(targetValue, duration = 10) {
        let currentValue = this.showExpandNum;
        let step = (targetValue - this.showExpandNum) / duration;
        let intervalDuration =  100;
        const interval = setInterval(() => {
            currentValue = Number(currentValue) + Number(step);
            this.showExpandNum = parseFloat(currentValue).toFixed(2);
            if (currentValue >= targetValue) {
              this.showExpandNum = targetValue;
              clearInterval(interval);
            }
        }, intervalDuration);
    },
    init() {
      this.$nextTick(() => {
        setTimeout(async () => {
          const domBoxRes = await this.warpRectDom("userOrderId");
          if (domBoxRes) {
            this.showCowpeaNavTop = domBoxRes.top;
          }
        }, 1000);
        setTimeout(async () => {
          const domRes = await this.warpRectDom("stickyListId");
          if (domRes) {
            this.stickyTitleTop = domRes.top - this.stickyTop;
          }
        }, 1000);
      });
    },
    initAd() {
      if (wx.createInterstitialAd) {
        this.interstitialAd = wx.createInterstitialAd({
          adUnitId: "adunit-911e15ad6e4963e7",
        });
        this.interstitialAd.onLoad(() => {});
        this.interstitialAd.onError((err) => {});
        this.interstitialAd.onClose(() => {
          this.closeShowConfig();
        });
      }
    },
    formatPrice(price) {
      price = Number(price).toFixed(2);
      if (!price) return;
      let splitPrice = price.split(".");
      return `
        <span style="font-weight:600;font-size: 20px">
          ${splitPrice[0]}.<span style="font-size: 13px;">${splitPrice[1]}</span>
        </span>`;
    },
    getHandle() {
      this.getUserTotal();
      this.showDia(); // 混合模式展示弹窗
    },
    async goWithdrawHandle() {
      // 授权通知
      const res = await msgTemplate();
      if(res.code != 1) this.goPages('/pages/userCard/withdraw/index');
      const { Rewards } = res.data;
      const tmplIds = [Rewards];
      this.$subscribeMessageHandle(tmplIds).then(res => {
          const resultState = res[Rewards];
          const params = { isRewards: 0 };
          if (resultState == "accept") params.isRewards = 1;
          profitMes(params);
          this.goPages('/pages/userCard/withdraw/index');
      });
    },
    goPages(path, isCean) {
      if (!this.isAutoLogin) return this.$go("/pages/tabAbout/login/index");
      if (path === "share") return;
      if (isCean) this.setCardNewShow(false);
      this.$go(path);
    },
    goToMenusHandle(path) {
      if (!this.isAutoLogin) return this.$go("/pages/tabAbout/login/index");
      if (path === "share") return;
      if (path === 'code') {
        if(!this.isShowCodeNum) {
          setShowCodeNum(1);
          this.isShowCodeNum = 1;
        }
        return this.isShowCodeDia = true;
      };
      this.$go(path);
    },
    showToastVipHandel() {
      this.$toast('会员权益升级中，敬请期待');
    },
    goToCashHandle() {
      if(this.showCashRed) {
        let cur_date = parseTime(new Date(), "{y}/{m}/{d}");
        setStorage(this.cashStorageKey, cur_date);
      }
      this.isShowRed = false;
      this.$go(`/pages/userCash/cash/index?is_close=1`);
    },
    /*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
    downCallback() {
      // 从续费的页面返回时 - 更新用户信息
      if(this.userInfo.is_vip) this.initVipObject();
      /*刷新统计*/
      this.getUserTotal();
      /*延时回调*/
      setTimeout(() => {
        this.mescroll.endSuccess();
      }, 300);
    },
    async upCallback(page) {
      this.vipNumberUserCurrent = this.userInfo.vip_number;
      this.requestGoodList(page); // 调用推荐的猜你喜欢的
    },
    // 页面的滚动事件
    onPageScroll(e) {
      const scrollTop = Math.ceil(e.scrollTop);
      if (scrollTop > 0) {
        this.showTitleBg = true;
      } else {
        this.showTitleBg = false;
      }
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
    // 牛金豆不足的情况
    notEnoughCreditsHandle() {
      this.exchangeFailedShow = true;
    },
    // 分享的文案获取
    specialLisShareHandle({ share_word, share_img }) {
      this.currentSharePageObj.btnShareObj = {
        share_title: share_word,
        share_img
      }
    },
    scrollUpHandle() {
      this.mescroll.scrollTo(0);
    },
    drawHandle() {
      this.profitInfoRequest().then((result) => {
        const drawShowDiaStorage = getDrawShowDiaStorage();
        if(result.total_num) {
          if(drawShowDiaStorage) return this.$go('/pages/userCard/withdraw/index');
          return this.isShowReturnCashDia = true;
        }
        return this.$toast('暂无待领取订单');
      });
    },
    getDrawHandle() {
      this.isShowReturnCashDia = false;
    },
    // menusLeft的左右滑动
    banScrollHandle(event) {
      const { scrollLeft } = event.detail;
      let menusLeft = scrollLeft * (16 / 87);
      menusLeft = menusLeft <= 0 ? 0 : menusLeft;
      menusLeft = menusLeft >= 16 ? 16 : menusLeft;
      this.menusLeft = menusLeft;
    },
  }
};
</script>

<style lang="scss">
page {
  background-color: #f7f7f7;
}
@mixin spritesMixin {
  background: url('https://file.y1b.cn/store/1-0/24722/669e1335b40d8.png') 0 0 / 2521rpx 1522rpx;
}
.swiper_search{
  flex: 1;
  transition: all .5s;
  &.ani_flex-in {
    flex: 1;
  }
  &.ani_flex-out {
    flex: 0;
  }
}
.user {
  position: relative;
  z-index: 0;
  &::before {
    content: '\3000';
    background: url("https://file.y1b.cn/store/1-0/231213/657927fa4f20f.png") 0 0 / cover;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 492rpx;
    z-index: -1;
  }
  &.active::before {
    background-image: url("https://file.y1b.cn/store/1-0/231114/65534aca37eff.png");
  }
}
.sticky_box {
  margin-top: 56rpx;
}
.user {
  position: relative;
  z-index: 0;
}
button::after {
  border: none;
  padding: unset;
}

.nav-custom {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .title_icon {
    width: 84rpx;
    height: 46rpx;
    margin-right: 20rpx;
    position: absolute;
    left: 20rpx;
    @include spritesMixin;
    background-position: -2151rpx -728rpx;
  }
}
.my_user {
  display: flex;
  align-items: center;
  position: absolute;
  left: 28rpx;
  top: 50%;
  transform: translateY(-50%);
  .my_user-avatar {
    width: 48rpx;
    height: 48rpx;
    background: #d8d8d8;
    border: 3rpx solid #ffffff;
    box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(51, 51, 51, 0.1);
    margin-right: 20rpx;
    border-radius: 50%;
  }
  .my_user-nickName {
    font-size: 30rpx;
    font-weight: 600;
    text-align: left;
    color: #333;
    line-height: 1;
    &.active::after {
      content: '\3000';
      // background: url("https://file.y1b.cn/public/img/ttxl/static/card/card_icon.png") 0 0 / 100% 100%;
      width: 28rpx;
      height: 26rpx;
      margin-left: 10rpx;
      display: inline-block;
      @include spritesMixin;
      background-position: -2377rpx -617rpx;
    }
  }
}
.ani_head {
  opacity: 0;
  transition: opacity 0.5s;
}
.ani_head-in {
  opacity: 1;
}
.ani_head-out {
  opacity: 0;
}

.user-info {
  padding-left: 18rpx;
  padding-top: 30rpx;
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 136rpx;
  height: 136rpx;
  position: relative;
  margin-right: 20rpx;
  z-index: 0;
  &::before {
    content: '\3000';
    // background: url("https://file.y1b.cn/public/img/ttxl//static/user/user_border.png") 0 0 / 100% 100%;
    position: absolute;
    left: 0;
    top: 0;
    width: 136rpx;
    height: 136rpx;
    z-index: -1;
    @include spritesMixin;
    background-position: -1767rpx -728rpx;
  }
}
.not_login {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  line-height: 42rpx;
}

.nick-name {
  font-size: 30rpx;
  font-weight: 500;
  color: #333333;
  margin-bottom: 20rpx;
  line-height: 1;
  &.active {
    color: #b75a30;
    &::after{
      content: '\3000';
      width: 28rpx;
      height: 26rpx;
      margin-left: 10rpx;
      display: inline-block;
      @include spritesMixin;
      background-position: -2377rpx -617rpx;
    }
  }
}

.avatar-icon {
  position: absolute;
  top: 8rpx;
  left: 50%;
  transform: translateX(-50%);
}

.user-id {
  height: 42rpx;
  box-sizing: border-box;
  padding: 0 16rpx;
  background: linear-gradient(135deg, #fbfbfb, #f5f5f5);
  border: 2rpx solid #fff;
  border-radius: 22rpx;
  font-size: 24rpx;
  font-weight: 400;
  color: #666;
  display: inline-block;
}

.user-assets {
  background: #ffffff;
  border-radius: 24rpx;
  margin: 24rpx 24rpx 0;
  padding: 24rpx 0;
  overflow: hidden;
  color: #333;
  .user-assets-title {
    font-size: 32rpx;
    font-weight: 600;
    margin: 0 24rpx 16rpx;
  }
  .user_assets_list {
    text-align: center;
    .uab_item{
      width: 33.3%;
      position: relative;
      &:not(:last-child) {
        &::before {
          content: "";
          position: absolute;
          width: 2rpx;
          height:42rpx;
          background-color: #F7F7F7;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
        }
      }
      .uab_item-cont {
        font-size: 40rpx;
        margin-bottom: 4rpx;
        display: inline-block;
        position: relative;
        font-weight: 600;
        .uab_item-lab {
          margin-left: 4rpx;
        }
        .uab_item-price{
          display: flex;
          align-items: baseline;
          &::before {
            content: '￥';
            font-size: 24rpx;
            font-weight: 400;
          }
        }
      }
      .uab_item-lab {
        font-size: 24rpx;
        font-weight: 400;
      }
    }
  }
}

.card-new-show::after {
  content: "";
  position: absolute;
  width: 12rpx;
  height: 12rpx;
  background-color: #EF2B20;
  border-radius: 50%;
  right: -10rpx;
  top: 0;
}

.uab-item-arrow {
  position: absolute;
  right: 22rpx;
  top: 50%;
  transform: translateY(-50%);
}

.cowpea-upgrade {
  margin: 0 22rpx;
  padding-left: 34rpx;
  padding-right: 22rpx;
  height: 75.6rpx;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cowpea-upgrade-bg {
  width: 100%;
  height: 112rpx;
  position: absolute;
  left: 0;
  top: 0;
}

.cowpea-upgrade-title {
  font-size: 24rpx;
  font-weight: 500;
  color: #a95824;
  position: relative;
  z-index: 1;
}
.user-order {
  margin: 24rpx 24rpx 0;
  border-radius: 24rpx;
  background: #fff;
  overflow: hidden;
  padding: 32rpx 0;
  color: #333;
  position: relative;
  .order-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .order-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .order-item-top {
      width: 48rpx;
      height: 48rpx;
      font-size: 0;
      margin: 0 auto 8rpx;
      position: relative;
    }
    .oii-icon {
      width: 48rpx;
      height: 48rpx;
      @include spritesMixin;
      &.icon1 {
        background-position: -1911rpx -808rpx;
      }
      &.icon2 {
        background-position: -1967rpx -808rpx;
      }
      &.icon3 {
        background-position: -2079rpx -808rpx;
      }
      &.icon4 {
        background-position: -2023rpx -808rpx;
      }
    }

    .order-item-name {
      font-size: 26rpx;
      font-weight: 400;
    }
  }
  .return_cash {
    font-size: 28rpx;
    line-height: 40rpx;
    height: 92rpx;
    background: #F9F9F9;
    border-radius: 16rpx;
    padding: 26rpx 20rpx;
    margin: 24rpx 24rpx 0;
    box-sizing: border-box;
    .rc_left {
      color: #666;
      &::before {
        content: '\3000';
        display: block;
        width: 38rpx;
        height: 36rpx;
        z-index: 0;
        margin-right: 12rpx;
        @include spritesMixin;
        background-position: -2243rpx -728rpx;
      }
    }
    .rc_right {
      width: 120rpx;
      height: 56rpx;
      border-radius: 16rpx;
      font-size: 26rpx;
      color: #fff;
      line-height: 56rpx;
      text-align: center;
      @include spritesMixin;
      background-position: -1991rpx -660rpx;
    }
  }
}

.oit-num {
  height: 28rpx;
  background-color: #ef2b20;
  border: 2rpx solid #ffffff;
  border-radius: .625rem;
  padding: 0 9rpx;
  font-size: 20rpx;
  font-weight: 500;
  color: #ffffff;
  line-height: 28rpx;
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
}

.user-menus {
  background-color: #ffffff;
  border-radius: 16rpx;
  margin: 24rpx 24rpx 8rpx;
  padding: 28rpx 0;
  box-sizing: border-box;
  .user-menus-item {
    position: relative;
    width: 25%;
    flex: 0 0 25%;
  }
  .ban_index-box {
    width: 48rpx;
    height: 6rpx;
    background: #e1e1e1;
    border-radius: 6rpx;
    margin: 20rpx auto 0;
    .ban_index-active {
      width: 32rpx;
      height: 100%;
      background: #F84842;
      border-radius: 6rpx;
      position: relative;
    }
}
}
.menus-item-share-btn {
  position: relative;
  background-color: #ffffff;
  padding: 0;
}
.umi-icon-mixin {
  width: 72rpx;
  height: 72rpx;
  position: relative;
  @include spritesMixin;
  &.icon1 {
    background-position: -2425rpx -504rpx;
  }
  &.icon2 {
    background-position: -1911rpx -728rpx;
  }
  &.icon4 {
    background-position: -2071rpx -728rpx;
  }
}
.umi-icon {
  width: 72rpx;
  height: 72rpx;
  position: relative;
  .oit-num {
    right: 6rpx;
    top: 16rpx;
    width: 28rpx;
    height: 28rpx;
    padding: 0;
    text-align: center;
  }
  &-img {
    width: 100%;
    height: 100%;
  }
}

.umi-name {
  line-height: 1;
  margin-top: 8rpx;
  font-size: 26rpx;
  color: #333;
  line-height: 36rpx;
}
.scroll_top {
  width: 72rpx;
  height: 72rpx;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0rpx 2rpx 10rpx 0rpx rgba(51, 51, 51, 0.12);
  position: fixed;
  bottom: 226rpx;
  right: 24rpx;
  &::before{
    content: '\3000';
    width: 28rpx;
    height: 16rpx;
    display: block;
    @include spritesMixin;
    background-position: -2425rpx -584rpx;
  }
  .scroll_top-icon {
    width: 28rpx;
    height: 16rpx;
  }
}
.card_vip_box{
  box-sizing: border-box;
  margin: 20rpx 28rpx 0;
  position: relative;
  z-index: 0;
  padding: 32rpx 32rpx 16rpx;
  &::before {
    content: '\3000';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    @include spritesMixin;
    background-size: 1000rpx 609rpx;
    background-position: -4rpx -4rpx;
  }
  &::after{
    content: '\3000';
    width: 194rpx;
    height: 148rpx;
    position: absolute;
    right: 24rpx;
    top: -20rpx;
    @include spritesMixin;
    background-position: -1991rpx -504rpx;
  }
  .card_open-lab {
    font-size: 26rpx;
    color: #333;
    margin: 6rpx 0 22rpx;
    position: relative;
    z-index: 0;
    display: inline-block;
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
  .card_bottom {
    font-size: 0;
  }
  .card_rem {
    font-size: 26rpx;
    line-height: 36rpx;
    color: #b75a30;
  }
  .card_type{
    width: 110rpx;
    height: 26rpx
  }
  .card_title {
    &::before {
      content: '\3000';
      width: 176rpx;
      height: 34rpx;
      display: inline-block;
      margin-right: 10rpx;
      @include spritesMixin;
      background-position:  -2193rpx -617rpx;
    }
  }
}
.card_lab {
  font-size: 28rpx;
  text-align: left;
  color: #666;
  line-height: 40rpx;
  margin: 16rpx 0 32rpx;
}
.card_box {
  box-sizing: border-box;
  margin: 40rpx 24rpx -50rpx;
  position: relative;
  z-index: 0;
  padding: 18rpx 32rpx 44rpx;
  &::before {
    content: '\3000';
    background: url("https://file.y1b.cn/store/1-0/23117/6549a0dc11598.png") 0 0 / 100% 100%;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  &.fl_bet::after {
    content: '\3000';
      background: url("https://file.y1b.cn/store/1-0/23113/6544914bed942.png") 0 0 / 100% 100%;
      width: 128rpx;
      height: 60rpx;
      display: inline-block;
  }
  .card_lab {
    margin: 0;
  }
  .card_noVip_title {
    margin-right: 16rpx;
    &::before {
      content: '\3000';
      width: 28rpx;
      height: 26rpx;
      margin-right: 10rpx;
      display: inline-block;
      @include spritesMixin;
      background-position: -2377rpx -617rpx;
    }
    &::after {
      content: '\3000';
      width: 174rpx;
      height: 32rpx;
      display: inline-block;
      @include spritesMixin;
      background-position:  -2119rpx -660rpx;
    }
  }
}
.card_icon {
  width: 28rpx;
  height: 26rpx;
  margin-right: 10rpx;
  margin-left: 10rpx;
}
.card_open {
  width: 288rpx;
  height: 216rpx;
  position: absolute;
  right: -24rpx;
  top: -87rpx;
}
.use_right {
  align-self: stretch;
  z-index: 1;
  position: relative;
}
.cash_icon{
  text-align: center;
  font-weight: 600;
  font-size: 28rpx;
  color: #666;
  line-height: 40rpx;
  background: rgba($color: #fff, $alpha: .6);
  border-radius: 28rpx 0 0 28rpx;
  padding: 8rpx 16rpx 8rpx 24rpx;
  position: relative;
  &::before {
    content: '\3000';
    width: 26rpx;
    height: 24rpx;
    display: block;
    background: url("https://test-file.y1b.cn/store/1-0/24219/65d2f0de2989c.png") 0 0 / cover;
    margin-right: 6rpx;
  }
  &.active::after {
    content: '\3000';
    width: 15rpx;
    height: 15rpx;
    background: #f84842;
    border-radius: 50%;
    position: absolute;
    top: 6rpx;
    right: 35rpx;
  }
}
.top_cont-num {
  font-size: 48rpx;
  font-weight: 600;
  color: #F84842;
  margin: 0 5rpx;
}
</style>
