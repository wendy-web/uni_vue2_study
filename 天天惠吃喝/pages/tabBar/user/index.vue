<template>
<view class="user nav_cont" :class="{'active' : userInfo.is_vip}">
  <xh-navbar
    navbarImageMode="widthFix"
    :overFlow="true"
    :fixedNum="9"
    titleAlign="titleRight"
    :navberColor="showTitleBgColor"
  >
    <view slot="title" class="nav-custom
    ">
      <image
        :class="['title_icon ani_head', (!isShowAvaTitle || !textList.length) ? 'ani_head-in' : 'ani_head-out']"
        src="https://file.y1b.cn/store/1-0/2368/648173c3f15cf.png"
        mode="aspectFill"
      ></image>
      <!-- v-if="!isShowAvaTitle || !textList.length -->
      <!-- 关闭用户信息的展示 -->
      <!-- <view :class="['my_user ani_head', isShowAvaTitle ? 'ani_head-in' : 'ani_head-out']">
        <image class="my_user-avatar" mode="aspectFill"
        :src="userInfo.avatar_url"></image>
        <view :class="['my_user-nickName', userInfo.is_vip ? 'active' : '']"> {{ userInfo.nick_name }}</view>
      </view> -->
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
      <view class="use_right fl_col_cen" @click.stop="goToCashHandle" v-if="isAutoLogin && userTotal.have_profit">
        <view :class="['cash_icon fl_center', showCashRed ? 'active' : '']">
          免单返现<van-icon name="arrow" color="#666" size="12" style="margin-left: 8rpx;" />
        </view>
      </view>
    </view>
    <!-- 省钱卡会员 -->
    <view class="card_vip_box" v-if="userInfo.is_vip"
      @click="goPages('/pages/userCard/card/cardVip/index')">
      <view class="card_title fl_start">
        <van-icon name="arrow" color="#B75A30" size="28rpx" custom-style="font-weight: 600;"/>
      </view>
      <view class="card_lab" v-if="vipObject.saving_money">
        已为您省下<text style="color: #f84842; margin: 0 5rpx">{{vipObject.saving_money || 0}}</text>元
      </view>
      <view class="card_open-lab" v-else>
        预计月省<text style="font-weight: 600; font-size: 48rpx; margin: 0 5rpx">{{vipObject.money || 0}}</text>元+
      </view>
      <view class="card_bottom fl_bet">
        <view class="card_rem">{{ vipObject.over_time || todayTime }} 到期</view>
        <!-- 省钱卡标识 -->
        <image class="card_type" mode="aspectFill" :src="cardType[vipObject.card_type || 0]"></image>
      </view>
    </view>
    <!-- 省钱卡 - 未开通 -->
    <view class="card_box fl_bet" v-else
      @click="goPages('/pages/userCard/card/cardVip/openIndex')">
      <view class="fl_start">
        <view class="card_noVip_title fl_start"></view>
        <view class="card_lab">月省<text style="color: #f84842">30</text>元起</view>
      </view>
    </view>
    <!-- 我的订单 -->
    <view class="user-order" id="userOrderId">
      <view class="order-list">
        <view class="order-item" @click="goPages(item.path)"
          v-for="item in orders" :key="item.id">
          <view class="order-item-top">
            <image class="oii-icon" mode="aspectFill" :src="item.icon"></image>
            <view class="oit-num" v-show='shotOitNum(item)'>{{ userTotal[item.key] }}</view>
          </view>
          <view class="order-item-name">{{ item.name }}</view>
        </view>
      </view>
      <view class="return_cash fl_bet" v-if="profitInfo.total_num" @click="drawHandle">
        <view class="rc_left fl_center">你有 {{ profitInfo.total_num }} 笔订单返现待领取</view>
        <view class="rc_right">领取</view>
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
          <view class="uab_item-cont" :class="{'card-new-show': userTotal.coupon_read > 0}">
            {{ userTotal.coupon || 0 }}<text class="uab_item-lab">张</text>
          </view>
          <view class="uab_item-lab">卡券</view>
        </view>
        <view class="uab_item" @click="goWithdrawHandle">
          <view class="uab_item-cont" :class="{'card-new-show': profitInfo.total_num > 0}">
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
            <view v-if="item.path != 'share'"
              class="user-menus-item fl_col_cen" @click="goPages(item.path)">
              <image class="umi-icon" :src="item.icon" mode="aspectFill"></image>
              <view class="umi-name">{{ item.name }}</view>
            </view>
            <view v-else-if="!isAutoLogin" class="user-menus-item" @click="goPages(item.path)">
              <view class="menus-item-share-btn fl_col_cen">
                <image class="umi-icon" :src="item.icon" mode="aspectFill"></image>
                <view class="umi-name">{{ item.name }}</view>
              </view>
            </view>
            <view v-else class="user-menus-item">
              <button open-type="share" class="menus-item-share-btn fl_col_cen">
                <image class="umi-icon" :src="item.icon" mode="aspectFill"></image>
                <view class="umi-name">{{ item.name }}</view>
              </button>
            </view>
          </block>
        </view>
      </scroll-view>
      <view class="ban_index-box">
        <view class="ban_index-active" :style="{left: menusLeft + 'px'}"></view>
      </view>
    </view>
    <good-list
      :list="goods"
      :isBolCredits="true"
      :isJdLink="true"
      @notEnoughCredits="notEnoughCreditsHandle"
      id="stickyListId"
    ></good-list>
  </mescroll-body>
  <custom-tab-bar
    currentIndex="2"
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
</view>
</template>
<script>
import { groupRecommend } from "@/api/modules/index.js";
import { goodsQuery, jingfen, keywordList, material } from "@/api/modules/jsShop.js";
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
import { getBaseUrl, getImgUrl, getStorage, setStorage } from "@/utils/auth.js";
import getViewPort from "@/utils/getViewPort.js";
import { parseTime } from '@/utils/index.js';
import shareMixin from '@/utils/mixin/shareMixin.js'; // 混入分享的混合方法
import { mapActions, mapGetters, mapMutations } from "vuex";
import config from "./config.js";

export default {
  mixins: [MescrollMixin, configurationFun, serviceCreditsFun, shareMixin], // 使用mixin
  components: {
    customTabBar,
    configurationDia,
    serviceCredits,
    exchangeFailed,
    goodList,
    returnCashDia,
    swiperSearch,
    specialLisMiniPage
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
        noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
        // empty:{
        // 	tip: '~ 空空如也 ~', // 提示
        // 	btnText: '去看看'
        // }
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
      goods: [],
      pageNum: 1,
      groupId_index: 0,
      interstitialAd: null,
      lastOddItem: null,
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
      isShowRed: true
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
    goods(newValue) {
      if (newValue.length <= 4) {
        this.mescroll.triggerUpScroll();
      }
    },
    'userInfo.is_vip': {
			handler:async function (newValue, oldValue) {
				if(!newValue) return;
				const res = await savingInfo();
				if(res.code != 1 || !res.data) return;
				this.vipObject = res.data;
			},
			deep: true
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
  },
  methods: {
    ...mapActions({
      getUserTotal: "user/getUserTotal",
      profitInfoRequest: 'user/profitInfoRequest'
    }),
    ...mapMutations({
      setCardNewShow: "user/setCardNewShow",
    }),
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
    warpRectDom(idName) {
      return new Promise((resolve) => {
        setTimeout(() => {
          // 延时确保dom已渲染, 不使用$nextclick
          let query = uni.createSelectorQuery();
          // #ifndef MP-ALIPAY
          query = query.in(this); // 支付宝小程序不支持in(this),而字节跳动小程序必须写in(this), 否则都取不到值
          // #endif
          query.select("#" + idName).boundingClientRect((data) => {
            resolve(data);
          }).exec();
        }, 20);
      });
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
      /*刷新统计*/
      this.getUserTotal();
      /*延时回调*/
      setTimeout(() => {
        this.mescroll.endSuccess();
      }, 300);
    },
    async upCallback(page) {
      this.requestRem(page);
    },
    async requestRem(page) {
      if (!this.groupRecommendData) {
        const recRes = await groupRecommend({ page: 2 });
        if (recRes.code != 1 || !recRes.data)
          return this.mescroll.endSuccess(0);
        this.groupRecommendData = recRes.data;
      }
      const { id, cid, cid2, cid3, eliteId, groupId, type } =
        this.groupRecommendData;
      let pageNum = this.pageNum;
      let params = {
        id,
        page: pageNum,
        size: 10,
      };
      let queryApi = goodsQuery;
      // type 1-猜你喜欢 2-京东精选 3-关键词查询, 4 选品库组合
      switch (type) {
        case 1:
          queryApi = material;
          params.eliteId = eliteId;
          params.groupId = groupId;
          params.size = 10;
          break;
        case 2:
          queryApi = jingfen;
          params.eliteId = eliteId;
          params.groupId = groupId;
          params.size = 20;
          break;
        case 3:
          queryApi = goodsQuery;
          params.cid1 = cid;
          params.cid2 = cid2;
          params.cid3 = cid3;
          break;
        case 4:
          queryApi = jingfen;
          const groupId_index = this.groupId_index;
          params.eliteId = eliteId;
          params.groupId = groupId[groupId_index];
          params.size = 20;
          break;
      }
      queryApi(params).then((res) => {
        const { list, total_count } = res.data;
        // 设置列表数据
        if (page.num == 1) {
          this.goods = [];
          this.pageNum = 1;
          this.lastOddItem = null;
        } //如果是第一页需手动制空列表
        // 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
        let isNextPage = pageNum * params.size < total_count;
        if (
          !isNextPage &&
          type == 4 &&
          this.groupId_index < groupId.length - 1
        ) {
          // 无下一页
          this.groupId_index += 1;
          this.mescroll.endSuccess(total_count, true);
          this.pageNum = 0;
        } else {
          this.mescroll.endSuccess(list.length || total_count, isNextPage);
        }
        if (this.lastOddItem) {
          this.goods.push(this.lastOddItem);
          this.lastOddItem = null;
        }
        this.pageNum += 1;
        this.goods = this.goods.concat(list); // 追加新数据
        const goodLength = this.goods.length;
        if (goodLength % 2 && goodLength > 6) {
          this.lastOddItem = this.goods.pop();
        }
        if (list.length <= 0 && pageNum * params.size < total_count) {
          this.mescroll.triggerUpScroll();
        }
      }).catch(() =>  this.mescroll.endErr());
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
        if(result.total_num) return this.isShowReturnCashDia = true;
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
      background: url("https://file.y1b.cn/public/img/ttxl/static/card/card_icon.png") 0 0 / 100% 100%;
      width: 28rpx;
      height: 26rpx;
      margin-left: 10rpx;
      display: inline-block;
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
    background: url("https://file.y1b.cn/public/img/ttxl//static/user/user_border.png") 0 0 / 100% 100%;
    position: absolute;
    left: 0;
    top: 0;
    width: 136rpx;
    height: 136rpx;
    z-index: -1;
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
      background: url("https://file.y1b.cn/public/img/ttxl/static/card/card_icon.png") 0 0 / 100% 100%;
      width: 28rpx;
      height: 26rpx;
      margin-left: 10rpx;
      display: inline-block;
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
  border: 1rpx solid #fff;
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
        background: url("https://file.y1b.cn/store/1-0/231212/6578168403ed1.png") 0 0 / cover;
        display: block;
        width: 32rpx;
        height: 38rpx;
        z-index: 0;
        margin-right: 12rpx;
      }
    }
    .rc_right{
      width: 136rpx;
      height: 56rpx;
      background: #f84842;
      border-radius: 16rpx;
      font-size: 26rpx;
      color: #fff;
      line-height: 56rpx;
      text-align: center;
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

.umi-icon {
  width: 72rpx;
  height: 72rpx;
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
    background: url("https://file.y1b.cn/store/1-0/23118/654b57a2ba1a8.png") 0 0 / 100% 100%;
    width: 28rpx;
    height: 16rpx;
    display: block;
  }
  .scroll_top-icon {
    width: 28rpx;
    height: 16rpx;
  }
}
.card_vip_box{
  box-sizing: border-box;
  margin: 20rpx 24rpx 0;
  position: relative;
  z-index: 0;
  padding: 25rpx 32rpx 8rpx;
  &::before {
    content: '\3000';
    background: url("https://file.y1b.cn/store/1-0/24116/65a5e868ae121.png") 0 0 / 100% 100%;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  &::after{
    content: '\3000';
    background: url("https://file.y1b.cn/store/1-0/23113/6544a769f2b89.png") 0 0 / 100% 100%;
    width: 288rpx;
    height: 216rpx;
    position: absolute;
    right: -24rpx;
    top: -87rpx;
  }
  .card_open-lab {
    font-size: 26rpx;
    color: #333;
    margin-top: 6rpx;
    position: relative;
    z-index: 0;
    display: inline-block;
    &::before {
      content: "\3000";
      position: absolute;
      width: 228rpx;
      height: 16rpx;
      background: rgba(255, 255, 255, 0.4);
      bottom: 0;
      z-index: -1;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .card_bottom {
    margin-top: 21rpx;
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
      background: url("https://file.y1b.cn/store/1-0/23113/6544a6d73e3d0.png") 0 0 / 100% 100%;
      width: 174rpx;
      height: 32rpx;
      display: inline-block;
    }
  }
}
.card_lab {
  font-size: 28rpx;
  text-align: left;
  color: #666;
  line-height: 40rpx;
  margin-top: 16rpx;
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
  .card_lab{
    margin: 0;
  }
  .card_noVip_title {
    margin-right: 16rpx;
    &::before {
      content: '\3000';
      background: url("https://file.y1b.cn/public/img/ttxl/static/card/card_icon.png") 0 0 / 100% 100%;
      width: 28rpx;
      height: 26rpx;
      margin-right: 10rpx;
      display: inline-block;
    }
    &::after {
      content: '\3000';
      background: url("https://file.y1b.cn/public/img/ttxl/static/card/card_title.png") 0 0 / 100% 100%;
      width: 174rpx;
      height: 32rpx;
      display: inline-block;
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
</style>
