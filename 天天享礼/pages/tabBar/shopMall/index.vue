<template>
<view class="home nav_cont">
  <!-- <view class="video_cont" v-if="isShowAddel">
    <view class="video_btn"
      v-if="isShowAd" @click="isShowAddel = false"
      :style="{
        top: navHeightTop + 'px'
      }"
    >({{ isShowAdNum }}秒) | 跳过</view>
    <coral-adv
      :appid="appid"
      :type="type"
      :target="target"
      :isshow="isShowAd"
      @errorCb="errorCbHandle"
      @loadCb="loadCbHandle"
      @finishedCb="finishedCb"
      @quitCb="quitCb"
      @showAdv="showAdv"
    >
    </coral-adv>
    <ad adpid="121294" type="1"  isshow  bind:finishedCb="finishedCb" bind:quitCb="quitCb"></ad>
  </view> -->
  <xh-navbar
    :navbarImage="isShowCowpeaNav ? '' : 'https://file.y1b.cn/store/1-0/24515/664462046066a.png'"
    :navberColor="isShowCowpeaNav ? '#fff' : ''"
    navbarImageMode="widthFix"
    :paddingBottomHeight="paddingBottomHeight"
    :overFlow="true"
    :fixedNum="9"
    titleAlign="titleRight"
  >
    <view slot="title" class="nav_cont_box fl_bet">
      <!-- 展示牛金豆/天天享礼的标识-->
      <myBeans :isShowCowpeaNav="isShowCowpeaNav" @goTask="goTaskHandle"></myBeans>
      <!-- 搜索的swiper的文本 -->
      <!-- <swiperSearch
        :textList="textList"
        source="home"
        :class="['swiper_search', textList.length ? 'ani_flex-in' : 'ani_flex-out',]"
      ></swiperSearch> -->
    </view>
    <view class="search_box"
      slot="title_cont"
      id="titleContBox"
      :style="{
        top: searchTop +'px',
        width: searchWidth + 'px',
        left: searchLeft + 'px'
      }"
    >
      <image class="search_icon" src="https://file.y1b.cn/store/1-0/24514/6642bf0c83c51.png" mode="aspectFill"></image>
      <view class="line"></view>
      <view class="swiper_box" @click="toSearchHandle">
        <!-- 无搜索的推荐文本轮播 -->
        <swiper v-if="textList.length"
          class="swiper"
          style="height: 100%;"
          :autoplay="true"
          interval="3000"
          :duration="300"
          :circular="true"
          :vertical="true"
          :current="currentIndex"
          @animationfinish="animationfinishHandle"
        >
          <swiper-item
            v-for="(item, index) in textList" :key="index"
            class="swiper_item" catchtouchmove='onTouchMove'
          >
            {{ item }}
          </swiper-item>
        </swiper>
        <view v-else>请搜索喜欢的商品</view>
        </view>
      <view class="search_btn" v-if="!searchValue" @click="searchRequireHandle">搜索</view>
    </view>
  </xh-navbar>
  <mescroll-body
    :sticky="true"
    ref="mescrollRef"
    @init="mescrollInit"
    @down="downCallback"
    :up="upOption"
    @up="upCallback"
  >
  <!-- 图文的配置 -->
    <view :class="['golden_bean-box', (iconFindLightIndex >= 0) ? 'light_bg' : '']"
      :style="{ '--top': paddingBottomHeight + 'px'}"
      @click="setIconFindHandle">
      <golden-bean
        id="goldenBean"
        :num="userInfo.credits"
        ref="goldenBean"
        @heightUpdate="goldenBeanHeightFun"
        @goTask="goTaskHandle"
        @openSpecialListMini="openSpecialListMiniHandle"
        @openRepairGetMini="openRepairGetMiniHandle"
      />
    </view>
      <!-- sticky吸顶悬浮的菜单, 父元素必须是 mescroll -->
      <view id="tabInList"
        :class="['sticky-tabs', isFirstHidden ? 'tabs_active' : '']"
        :style="{ top: stickyTop + 'px', height: tabHeight + 'rpx' }"
        v-if="isShowStatus"
      >
        <!-- 当设置tab-width,指定每个tab宽度时,则不使用flex布局,改用水平滑动 -->
        <me-tabs
          v-model="tabIndex"
          :tabs="tabs"
          :height="tabHeight"
          v-if="isShowStatus"
          @change="changeTabIndexHandle"
        ></me-tabs>
      </view>
      <!-- 悬浮图片的添加 -->
      <view class="notion_Img" :style="{ '--padding': tabHeightValue + 'px' }">
        <anNoticeImgShow ref="anNoticeImgShow" @draw="drawHandle"/>
      </view>
      <!-- 兑换滚动 -->
      <view class="notion_bar" :style="{ top: notionBar_top + 'px' }">
        <anNoticeBarShow ref="anNoticeBarShow" />
      </view>
      <!-- 数据列表 -->
      <view id="goodListDom"
        :style="{ minHeight: swiperHeight }"
        :class="[
          'goodList_item', !isShowStatus ? 'active' : '',
          skuId && !isAlreadyShowLight ? 'zindex_99' : ''
        ]"
        @click='setShowLightHandle'
      >
        <good-list
          :list="goods"
          :categoryIndex="tabIndex"
          :isBolCredits="true"
          :isShowBanner="true"
          :isHome="true"
          :isSwiper="true"
          @notEnoughCredits="notEnoughCreditsHandle"
          @deleteBysubunionid="deleteBysubunionidHandle"
          @openSpecialListMini="openSpecialListMiniHandle"
          @openRepairGetMini="openRepairGetMiniHandle"
          @setShowLight="setShowLightHandle"
          @isBannerClick="goodListBannerHandle"
        ></good-list>
      </view>
    </mescroll-body>
    <!-- 未登录模块引导 -->
    <view class="login_box fl_bet" :style="{ '--padding': tabHeightValue + 'px' }"
      v-if="!isAutoLogin">
      <view class="lg_left box_fl">登录享更多精彩内容</view>
      <view class="lg_btn" @click="toLoginHandle">登录</view>
    </view>
    <!-- 指引使用 -->
    <boot-module />
    <!-- 动画 -->
    <cowpea-anim ref="cowpeaAnim" @animEnd="updateData" />
    <!-- 导航栏 -->
    <custom-tab-bar
      currentIndex="0"
      :isScrollTop="isShowSticky"
      @domObjHeight="domObjHeightHandle"
      @currentPage="currentPageHandle"
    />
    <!-- 商品专题的半屏组件 -->
    <specialLisMiniPage
      ref="specialLisMiniPage"
      @notEnoughCredits="notEnoughCreditsHandle"
      @specialLisShare="specialLisShareHandle"
      @isBannerClick="goodListBannerHandle"
    ></specialLisMiniPage>
    <!-- 优惠推荐商品的弹窗 -->
    <recommendDia ref="recommendDia" @close="closeOptionsHandle"></recommendDia>
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
    <!-- 配置的弹窗管理 -->
    <configurationDia
      ref="configurationDia"
      :isShow="isShowConfig"
      @close="closeShowConfig"
      :config="config"
      @popoverRember="requestPopoverRember"
      :remainTime="remainTime"
    ></configurationDia>
    <!-- 配置的弹窗管理 -->
    <awardDia
      ref="awardDia"
      :isShow="isShowAwardDia"
      @close="closeOptionsHandle"
      @award="awardHandle"
      :config="awardConfig"
      @notOpenMini="notOpenMiniHandle"
    ></awardDia>
    <!-- 捡漏的半屏组件 -->
    <repairGetMiniPage ref="repairGetMiniPage"></repairGetMiniPage>
    <!-- 领取返回的弹窗 -->
    <returnCashDia
      :isShow="isShowReturnCashDia"
      @close="isShowReturnCashDia = false"
      @getDraw="getDrawHandle"
    ></returnCashDia>
    <!-- 红包返现 -->
    <cashBackDia ref="cashBackDiaRef" @close="closeCashBackDiaHandle"></cashBackDia>
    <!-- 赠送牛金豆 -->
		<task-complete ref="taskComplete" :countDownNum="countDownNum" @startAnim="showCowpeaAnim" />

    <!-- 动画抽奖的弹窗-->
    <van-popup
      :show="isShowDrawPopoverDia"
      custom-style="background-color: transparent;overflow:visible;"
      :z-index="100"
      :catchtouchmove="true"
      @close="drawPopoverCloseHandle"
    >
      <view class="draw_cont dia_cont ani_active">
        <image class="draw_close" mode="scaleToFill"
          src="https://test-file.y1b.cn/store/1-0/24314/65f2ac09a0204.png"
          @click="drawPopoverCloseHandle"
        ></image>
        <van-image
          width="262rpx" height="304rpx"
          fit="widthFix" use-loading-slot class="draw_image"
          :src="drawPopoverData.image"
        ><van-loading slot="loading" type="spinner" size="20" vertical />
        </van-image>
        <view class="draw_title">{{ drawPopoverData.name }}</view>
        <view class="draw_btn" @click="getDrawPopoverHandle"></view>
      </view>
    </van-popup>

</view>
</template>
<script>
import {
goodsQuery,
jingfen,
keywordList,
material,
overDo
} from "@/api/modules/jsShop.js";
import { advertisementConfig, bfxlPopup, couponGroup, couponList, drawPopover, giftCreate } from "@/api/modules/shopMall.js";
import awardDia from "@/components/configurationDia/awardDia.vue";
import configurationFun from "@/components/configurationDia/configurationFun.js";
import configurationDia from "@/components/configurationDia/index.vue";
import cowpeaAnim from "@/components/cowpeaAnim.vue";
import customTabBar from "@/components/customTabBar/index.vue";
import goodList from "@/components/goodList.vue";
import exchangeFailed from "@/components/serviceCredits/exchangeFailed.vue";
import serviceCredits from "@/components/serviceCredits/index.vue";
import specialLisMiniPage from "@/components/specialLisMiniPage.vue";
import swiperSearch from "@/components/swiperSearch.vue";
import taskComplete from '@/components/taskComplete.vue';
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import getViewPort from "@/utils/getViewPort.js";
import anNoticeBarShow from "./content/anNoticeBarShow.vue";
import anNoticeImgShow from "./content/anNoticeImgShow.vue";
import bootModule from "./content/bootModule.vue";
import cashBackDia from './content/cashBackDia.vue';
import goldenBean from "./content/goldenBean.vue";
import meTabs from "./content/me-tabs.vue";
import myBeans from "./content/myBeans.vue";
import repairGetMiniPage from "./content/repairGetMiniPage.vue";
// 拼多多的列表
import { groupRecommend } from "@/api/modules/index.js";
import {
goodsRecommend,
goodsSearch,
} from '@/api/modules/pddShop.js';
import { taskNum } from "@/api/modules/task.js";
import returnCashDia from '@/components/returnCashDia.vue';
import { getDiaType, getImgUrl, getPlatform, getUrlKey, setDiaType, setStorage } from "@/utils/auth.js";
import createRewardVideoAd from "@/utils/createRewardVideoAd.js";
import shareMixin from '@/utils/mixin/shareMixin.js'; // 混入分享的混合方法
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  mixins: [MescrollMixin, configurationFun, shareMixin], // 使用mixin
  components: {
    anNoticeBarShow,
    anNoticeImgShow,
    meTabs,
    goodList,
    bootModule,
    goldenBean,
    customTabBar,
    cowpeaAnim,
    exchangeFailed,
    serviceCredits,
    configurationDia,
    awardDia,
    specialLisMiniPage,
    repairGetMiniPage,
    swiperSearch,
    myBeans,
    returnCashDia,
    cashBackDia,
    taskComplete,
  },
  data() {
    return {
      upOption: {
        page: {
          num: 0,
          size: 1,
          time: null,
        },
      },
      optionsTabIndex: null,
      tabs: [],
      tabIndex: 0, // 当前菜单下标
      isShowSticky: false,
      isShowCowpeaNav: false,
      pageNem: 1,
      _index: 0,
      tabHeightValue: 0,
      fixationValue: uni.upx2px(96),
      paddingBottomHeight: uni.upx2px(96),
      exchangeFailedShow: false, // 牛金豆不足的弹窗
      serviceCreditsShow: false, // 赚取牛金豆的弹窗
      _RewardedVideoAd: null, // 激励视频
      adunit: "adunit-bc00b5948e4bbd52",
      showTitleBg: false,
      // 组件渲染占据的高度
      goldenBeanComHeight: 0,
      anNoticeBarComHeight: 0,
      imgUrl: getImgUrl(),
      isShowAwardDia: false, // 展示抽奖的弹窗
      platform: getPlatform(),
      awardConfig: null,
      textList: [], // 搜索的提示文字
      currentIndex: 0,
      codeErrorId: 0,
      tradeIn: 0,
      isShowStatus: true, // 是否展示tab的导航栏
      isFirstHidden: false,
      groupRecommendData: null,
      pageNum: 1,
      groupId_index: 0,
      isScrollTo : true,
      skuId: '',
      isShowReturnCashDia: false,
      is_lx_type: 1,
      psite: 0,
      lsite: 0,
      giftRewardId: 0,
      countDownNum: -1,
      giftRewardInter: null,
      taskCompleteData: null,
      gameAnimationId: 0,
      drawPopoverData: null, // 中奖
      isShowDrawPopoverDia: false,
      appid: 121294,
      type: 9,
      target: 4,
      videoRet: null,
      isShowAd: false,
      isShowAdNum: 5,
      isShowAddel: false,
      scroll_top: 0,
      currentIndex: 0
    };
  },
  watch: {
    userTotal(n, o) {
      if (o && o.coupon < n.coupon) this.showDotal();
    },
    tabIndex(index) {
      this._index = index || 0;
      this.tabs[this._index] && (this.tabs[this._index].goods = []);
      this.pageNem = 1;
      this.groupId_index = 0;
      this.mescroll.resetUpScroll();
      setTimeout(() => {
        this.isScrollTo && this.mescroll.scrollTo(this.navTopHeight); // 滚动到tab的吸顶的效果
        this.isScrollTo = true;
      }, 100);
    },
    // 监听弹窗的列表
    diaList(newValue, oldValue) {
      if (newValue.length && newValue[0] == "award") {
        this.isShowAwardDia = true;
      }
      if (newValue.length && newValue[0] == "giftReward") {
        this.showTaskComplete();
      }
      if (newValue.length && newValue[0] == "drawPopover") {
        this.isShowDrawPopoverDia = true;
      }
    },
    isShowSticky(newVal, oldValue) {
      if (newVal) return this.$refs.anNoticeBarShow.init();
      this.$refs.anNoticeBarShow.close();
    }
  },
  computed: {
    ...mapGetters(["userInfo", "gift", "diaList", 'isAutoLogin', 'isAlreadyShowLight', 'iconFindLightIndex']),
    // 列表数据
    goods() {
      if (this.tabs.length > 0 ) {
        let item = this.tabs[this.tabIndex];
        if (item.goods) {
          let list = item.goods;
          let isType9 = 0;
          // 列表对单列呈现进行后排数组的操作
          list.length && list.forEach((nowItem, index) => {
            if(nowItem.type != 9 ) return;
            if(index%2 && (isType9%2) == 0) {
              list[index] = item.goods[index-1];
              list[index - 1] = nowItem;
            }
            if((index%2) == 0 && isType9%2) {
              list[index] = item.goods[index-1];
              list[index - 1] = nowItem;
            }
            isType9 += 1;
          });
          return list;
        }
        return [];
      }
      return [];
    },
    // 吸顶的的top值
    stickyTop() {
      let viewPort = getViewPort();
      return viewPort.navHeight;
    },
    // 吸顶的的top值
    navHeightTop() {
      let viewPort = getViewPort();
      return viewPort.customTop;
    },
    statusBarHeight() {
      let viewPort = getViewPort();
      return viewPort.statusBarHeight;
    },
    // goodList的内容高度
    swiperHeight() {
      let viewPort = getViewPort();
      let swiperHeight =
        viewPort.windowHeight -
        this.tabHeightValue -
        viewPort.navHeight;
      swiperHeight = swiperHeight - uni.upx2px(this.tabHeight);
      return swiperHeight + "px";
    },
    // 头部标题后超出的内容的展示
    // paddingBottomHeight() {
    //   if (this.isShowSticky) return this.navbarBottom + uni.upx2px(this.tabHeight);
    //   return this.navbarBottom;
    // },
    tabHeight() {
      let tab_height = this.isShowStatus ? 112 : 0;
      return tab_height;
    },
    notionImg_top() {
      let notion_top = this.stickyTop + uni.upx2px(this.tabHeight);
      return notion_top;
    },
    notionBar_top() {
      let notion_top = this.stickyTop + uni.upx2px(this.tabHeight) + uni.upx2px(28);
      return notion_top;
    },
    // tab-bar以上的高度
    navTopHeight() {
      let topHeight = this.goldenBeanComHeight + this.anNoticeBarComHeight;
      // 导航栏自定开关 - 重新计算高度
      if(this.isFirstHidden) {
        topHeight = topHeight - uni.upx2px(112);
      }
      return topHeight;
    },
    searchTop() {
      let initSearchTop = uni.upx2px(92);
      let differentValue = uni.upx2px(92) - uni.upx2px(6);
      let scrollValue = (differentValue / this.fixationValue) * this.scroll_top;
      const searchTopValue = uni.upx2px(92) - scrollValue;
      if(searchTopValue < 0) {
          initSearchTop = uni.upx2px(6);
      } else if(searchTopValue > uni.upx2px(92)) {
          initSearchTop = uni.upx2px(92);
      } else {
          initSearchTop = searchTopValue
      }
      return initSearchTop;
    },
    searchWidth() {
      const titleBoxWidth = uni.upx2px(502);
      let differentValue = uni.upx2px(702) - uni.upx2px(502);
      let scrollValue = (differentValue / this.fixationValue) * this.scroll_top;
      const searchWidthValue = uni.upx2px(702) - scrollValue;
      let value = 0;
      if(searchWidthValue < titleBoxWidth) {
          value = titleBoxWidth
      } else if(searchWidthValue > uni.upx2px(702)) {
          value = uni.upx2px(702)
      } else {
          value = searchWidthValue
      }
      return value;
    },
    searchLeft() {
      const titleBoxLeft = uni.upx2px(24);
      let differentValue = uni.upx2px(24  ) - uni.upx2px(24);
      let scrollValue = (differentValue / this.fixationValue) * this.scroll_top;
      const searchLeftValue =  uni.upx2px(24) + scrollValue;
      let value = 0;
      if(searchLeftValue > titleBoxLeft) {
          value = titleBoxLeft;
      } else if(searchLeftValue < uni.upx2px(24)) {
          value = uni.upx2px(24);
      } else {
          value = searchLeftValue;
      }
      return value;
    }
  },
  async onLoad(options) {
    // 初始化话窗口参数
    this.handleOptions(options);
    // wx.nextTick(() => {
      // this.initAdvertisementConfig();
    // });
    /* 初始化激励视频 */
    this.initRewardedVideoAd();
    const res = await keywordList();
    if (res.code == 1 && res.data) {
      this.textList = res.data;
    }
  },
  onShow() {
    // 是否更新
    let couponDetails_update = uni.getStorageSync("couponDetails_update") || "";
    if (couponDetails_update) {
      this.refreshGoods(JSON.parse(couponDetails_update));
      uni.removeStorageSync("couponDetails_update");
    }
    const type = getDiaType();
    if (type == "awardEnd") {
      setDiaType("");
      this.awardId = null;
      this.$refs.pointUpgradeDia.upgrade(); // 新人接口访问
      this.configurationInit(); // 弹窗配置
    }
    if (this.$refs.anNoticeImgShow) this.$refs.anNoticeImgShow.init() // 渲染的初始化
  },
  onHide() {
    this.setShowLightHandle();
    this.$refs.anNoticeBarShow.clearNoticeTime();
    const type = getDiaType();
    if (type == "award") {
      setDiaType("awardEnd");
    }
  },
  methods: {
    animationfinishHandle(event){
      this.currentIndex = event.detail.current;
    },
    toSearchHandle() {
      if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
      let placeholderValue = "";
      if (this.textList.length) {
        placeholderValue = this.textList[this.currentIndex];
        placeholderValue = encodeURIComponent(placeholderValue);
      }
      // 去领券中心的搜索页
      this.$go(`/pages/userModule/productList/search?placeholderValue=${placeholderValue}&source=home`);
    },
    searchRequireHandle() {
      if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
      const recommendTxt = this.textList.length ? this.textList[this.currentIndex] : '';
      if(!recommendTxt) return this.$go('/pages/userModule/productList/search');
      this.$go(`/pages/userModule/productList/index?searchValue=${encodeURIComponent(recommendTxt)}&is_search=1`);
    },
    async initAdvertisementConfig() {
      const res = await advertisementConfig();
      console.log('res', res);
      if(res.code != 1 || !res.data) return;
      this.isShowAddel = res.data.status;
      if(!this.isShowAddel) return this.delCurrentDiaList();
      this.clearInterLoadCb();
      this.adInterVal = setInterval(() => {
        this.isShowAdNum--;
        if(!this.isShowAdNum) {
          this.clearInterLoadCb();
          this.isShowAddel = false;
          this.delCurrentDiaList();
        }
      }, 1000)

    },
    showAdv(res) {
      console.log('showAdv', res)
      this.isShowAd = true;
    },
    finishedCb(e) {
      console.log('finishedCb', e)
      this.isShowAd= false
    },
    quitCb (e) {
      console.log('quitCb', e)
      this.isShowAd = false;
    },
    errorCbHandle(error) {
      console.log('error: errorCbHandle', error)
      this.isShowAddel = false;
    },
    loadCbHandle(res) {
      this.isShowAd = true;
      this.clearInterLoadCb();
      console.log('res: loadCbHandle', res);
      this.adInterVal = setInterval(() => {
        this.isShowAdNum--;
        if(!this.isShowAdNum) {
          this.clearInterLoadCb();
          this.isShowAddel = false;
          this.delCurrentDiaList();
        }
      }, 1000);
    },
    clearInterLoadCb() {
      clearInterval(this.adInterVal);
      this.adInterVal = null;
      this.isShowAdNum = 5;
    },
    ...mapActions({
      getUserInfo: "user/getUserInfo",
      profitInfoRequest: 'user/profitInfoRequest'
    }),
    ...mapMutations({
      setDiaList: "user/setDiaList",
      delCurrentDiaList: "user/delCurrentDiaList",
      setAlreadyShowLight: "user/setAlreadyShowLight",
			setIconFindLightIndex: "user/setIconFindLightIndex",
      setLightArr: "user/setLightArr"

    }),
    drawHandle() {
      this.profitInfoRequest().then((result) => {
        if(result.total_num) return this.isShowReturnCashDia = true;
        this.$toast('暂无待领取订单');
        this.$refs.anNoticeImgShow.popupClose();
      });
    },
    getDrawHandle() {
      this.isShowReturnCashDia = false;
    },
    toLoginHandle() {
      this.$go('/pages/tabAbout/login/index');
    },
    setShowLightHandle() {
      // 设置展示高亮的存储
      if(this.skuId) {
        this.skuId = null;
        this.setAlreadyShowLight();
      }
    },
    // 关闭icon的高亮区域
    setIconFindHandle() {
      // 关闭天天过来时高亮展示的样式
      if(this.iconFindLightIndex >= 0) {
				this.setIconFindLightIndex(-1);
				this.delCurrentDiaList();
        this.setLightArr(null);
			};
    },
    deleteBysubunionidHandle({ listIndex, index }) {
      this.goods.splice(listIndex, 1);
    },
    // 组件的高度更新值
    goldenBeanHeightFun(value) {
      this.goldenBeanComHeight = value;
    },
    anNoticeBarHeightFun(value) {
      this.anNoticeBarComHeight = value;
    },
    // 点击当前的页面的底部导航 - 滚动到顶部
    currentPageHandle() {
      this.mescroll.scrollTo(0);
    },
    // 牛金豆不足，打开弹窗
    notEnoughCreditsHandle() {
      this.exchangeFailedShow = true;
    },
    // 打开专题页面的半屏
    openSpecialListMiniHandle(pageUrl) {
      const id = getUrlKey(pageUrl, "id");
      const coupon_id = getUrlKey(pageUrl, "coupon_id");
      if(!id) return this.$toast('不存在id');
      this.$refs.specialLisMiniPage.initShow(id, coupon_id);
    },
    specialLisShareHandle({ share_word, share_img }) {
      this.currentSharePageObj.btnShareObj = {
        share_title: share_word,
        share_img
      }
    },
    // 打开限时捡漏的
    openRepairGetMiniHandle() {
      this.$refs.repairGetMiniPage.init();
    },
    // 去赚取牛金豆
    async goTaskHandle() {
      const res = await taskNum();
      this.exchangeFailedShow = false;
      if (res.code == 1 && res.data) {
        const { total_times, video_times } = res.data;
        if (total_times > 0) {
          this.serviceCreditsShow = true;
          // 次数大于0； 打开赚取牛金豆的弹窗
          if (video_times == 0) this.$refs.serviceCredits.setSwiperNum(1);
          return;
        }
      }
      this.$switchTab('/pages/tabBar/task/index'); // 跳转到福利中心
    },
    // 关闭赚取牛金豆 并更新用户信息
    closeHandle() {
      this.getUserInfo();
      this.serviceCreditsShow = false;
    },
    //播放视频拿奖励
    initRewardedVideoAd() {
      this._RewardedVideoAd = createRewardVideoAd(this.adunit, (status) => {
        this.$refs.serviceCredits.finishAdPlay();
      });
      this._RewardedVideoAd.videoAdCreate();
    },
    showAdPlayHandle() {
      this._RewardedVideoAd.videoPlay(); // 视频的播放
    },
    domObjHeightHandle(height) {
      this.tabHeightValue = height;
    },
    /*下拉刷新的回调 */
    downCallback() {
      this.isScrollTo = false;
      (!this.giftRewardId) && this.getUserInfo(); //获取用户信息
      // 各种初始化
      // if (this.$refs.anNoticeImgShow) this.$refs.anNoticeImgShow.init() // 渲染的初始化
      if (this.$refs.goldenBean) this.$refs.goldenBean.init(); // 牛金豆
      if (this.$refs.notCreditsList) this.$refs.notCreditsList.init(); //  无豆特权模块
      // 下拉刷新，更新数组的内容
      this.tabs = [];
      this._index = 0;
      this.pageNem = 1;
      this.pageNum = 1;
      this.groupId_index = 0;
      this.tabIndex = 0;
      this.mescroll.resetUpScroll();
      this.mescroll.endSuccess();
    },
    async upCallback(page) {
      this._index = this._index || 0;
      if (!this.tabs.length) {
        let res = await couponGroup();
        this.isShowStatus = !Boolean(res.status);
        // this.isFirstHidden = !this.isShowStatus; // 是否根据上拉呈现tab的导航栏
        let _tab = res.data.map((item) => {
          return {
            ...item,
            goods: null,
            num: 1,
            y: 0,
            curPagelen: 0,
            hasNext: true,
          };
        });
        this.tabs = _tab;
        // 进入的tab选项
        if (this.optionsTabIndex && _tab.length >= this.optionsTabIndex) {
          this.tabIndex = this.optionsTabIndex - 1;
          // this.mescroll.scrollTo('#goodListDom');
        }
      }
      if (!this.tabs[this._index]) {
        // 首页tab的数据加载完成 - 加载推广位的使用 / 列表的数据使用
        if (!this.tabIndex) {
          return this.requestRem(page);
        }
        return this.mescroll.endSuccess(0);
      }
      let keyword = this.tabs[this._index].id;
      const params = {
        page: this.pageNem,
        size: 10,
        group_id: keyword
      };
      // 添加列表商品的参数添加
      if(!this._index && (this.pageNem == 1) && this.skuId) {
        params.skuId = this.skuId;
      }
      couponList(params).then((res) => {
          let list = res.data ? res.data.data : [];
          const { current_page, last_page, total } = res.data;
          // 当前tab数据
          let curTab = this.tabs[this.tabIndex];
          // 设置列表数据
          if (!curTab.goods) curTab.goods = [];
          curTab.goods = curTab.goods.concat(list); //追加新数据
          this.tabs[this.tabIndex] = curTab;
          if(!this._index && this.pageNem == 1) overDo();
          this.pageNem += 1;
          //   首项的添加
          if (this.tabIndex == 0) {
            if (this._index < this.tabs.length) {
              this.mescroll.endSuccess(10, true); // 永远可翻页
            } else {
              this.mescroll.endBySize(list.length, total);
            }
            // 最后一项进行下一个tab的切换 _已切换的
            if (current_page >= last_page) {
              this._index += 1;
              this.pageNem = 1;
              this.mescroll.triggerUpScroll();
            }
            // 长度小于6时，自动触发底部的加载
            if (curTab.goods.length < 6) {
              this.mescroll.triggerUpScroll();
            }
          } else {
            this.mescroll.endBySize(list.length, total);
          }
      }).catch(() => this.mescroll.endErr());
    },
    async requestRem(page) {
      if (!this.groupRecommendData || (this.is_lx_type == 2)) {
        const groupParams = { page: 13 };
        // 拼多多商品推荐的列表
        if(this.is_lx_type == 2) {
          groupParams.lx_type = 2;
          this.is_lx_type = 3;
        };
        const recRes = await groupRecommend(groupParams);
        if (recRes.code != 1 || !recRes.data) {
          this.mescroll.endSuccess(0);
          if(this.is_lx_type < 2) {
            this.is_lx_type = 2;
            this.mescroll.triggerUpScroll();
          }
          return;
        }
        this.groupRecommendData = recRes.data;
        this.pageNum = 1;
      }
      const { id, cid, cid2, cid3, eliteId, groupId, type, lx_type, positionId } = this.groupRecommendData;
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
          // 拼多多接口的访问
          if (lx_type == 2) {
            queryApi = goodsRecommend;
            params.positionId = positionId;
          } else {
            queryApi = material;
            params.eliteId = eliteId;
            params.groupId = groupId;
            params.size = 10;
          }
          break;
        case 2:
          if (lx_type == 2) {
            queryApi = goodsSearch;
            params.positionId = positionId;
          } else {
            queryApi = jingfen;
            params.eliteId = eliteId;
            params.groupId = groupId;
            params.size = 20;
          }
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
        // 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
        let isNextPage = pageNum * params.size < total_count;
        if (!isNextPage && type == 4 && (this.groupId_index < groupId.length - 1)) {
          // 无下一页
          this.groupId_index += 1;
          this.mescroll.endSuccess(total_count, true);
          this.pageNum = 0;
        } else {
          this.mescroll.endSuccess(list.length || total_count, isNextPage);
        }
        this.pageNum += 1;
        let curTab = this.tabs[this.tabIndex] || {
          goods: null
        };
        if (!curTab.goods) curTab.goods = [];
        curTab.goods = curTab.goods.concat(list); // 追加新数据
        if(this.tabs.length) {
          this.tabs[this.tabIndex] = curTab;
        } else {
          // tab 的列表数据为空 加载推券的使用
          this.tabs.push(curTab);
          this._index = 99; // 将列表的索引加置无限大
        }
        // this.goods = this.goods.concat(list); // 追加新数据
        // 列表数据长度小于6时，提前自动加载下一页
        if (list.length <= 6 && isNextPage) {
          this.mescroll.triggerUpScroll();
        }
        // 没有下一页的话 执行的事件
        if(!isNextPage && this.is_lx_type < 2) {
          // this.mescroll.endSuccess(10, true);
          this.is_lx_type = 2;
          this.mescroll.triggerUpScroll();
        }
      }).catch(() => this.mescroll.endErr());
    },
    showCowpeaAnim(isUpdate = false) {
      const creditsDom = this.$refs.goldenBean.getCreditsDom();
      if (creditsDom && !this.userInfo.is_vip) {
        const { width, height, left, top } = creditsDom;
        this.$refs.cowpeaAnim.show({
          left: left + width / 2,
          top: top + height / 2,
        });
      } else if(isUpdate) {
        this.getUserInfo();
        // this.delCurrentDiaList("giftReward");
        this.closeGiftRewardHandle();
      }
    },
    // 关闭新人的弹窗
    getHandle() {
      this.showCowpeaAnim();
      this.delCurrentDiaList("giftReward");
    },
    // 新人播放的弹窗
    updateData() {
      this.showDia(); // 混合模式展示弹窗
      this.getUserInfo(); // 获取用户信息
      if(this.giftRewardId) this.closeGiftRewardHandle();
    },
    changeTabIndexHandle(index) {
      this.isScrollTo = true;
    },
    // 页面的滚动事件
    onPageScroll(event) {
      !this.isAlreadyShowLight && this.setShowLightHandle(); // 关闭天天过来时高亮展示的样式
      this.setIconFindHandle(); // 关闭天天过来时高亮展示的样式
      const scrollTopNum = Math.ceil(event.scrollTop);
      this.scroll_top = scrollTopNum;
      this.showTitleBg = (scrollTopNum > 0);
      this.isShowCowpeaNav = (scrollTopNum >= this.stickyTop);
      this.isShowSticky = (scrollTopNum >= this.navTopHeight);
      this.isFirstHidden && (this.isShowStatus = this.isShowSticky);
      let padding_height = this.fixationValue - scrollTopNum;
      this.paddingBottomHeight = (padding_height < 0) ? 0 : padding_height;
      if(this.isShowSticky) {
        this.isAutoLogin && this.$refs.anNoticeImgShow.popupShow();
        return;
      }
      this.$refs.anNoticeImgShow.popupClose();
    },
    refreshGoods(data) {
      if (this.goods.length == 0) return;
      let index = this.goods.findIndex((item) => item.id == data.id);
      if (index > -1) {
        let item = this.goods[index];
        this.goods.splice(index, 1, {
          ...item,
          ...data,
        });
      }
    },
    // 关闭入口的弹窗的弹窗
    closeOptionsHandle(isDelDiaList = true) {
      setDiaType("");
      this.isShowAwardDia = false;
      this.awardId = null;
      this.recommendId = null;
      isDelDiaList && this.updateDiaInitial();
    },
    updateDiaInitial() {
      this.$refs.pointUpgradeDia.upgrade();
      this.configurationInit();
      this.delCurrentDiaList();
    },
    awardHandle() {
      this.isShowAwardDia = false;
    },
    notOpenMiniHandle() {
      this.closeAwardHandle();
    },
    handleOptions({
      type,
      data,
      iosTabIndex,
      AndTabindex,
      awardId,
      recommendId,
      codeErrorId,
      tradeIn,
      losingNew,
      skuId,
      specialUrl,
      psite,
      lsite,
      giftRewardId,
      gameAnimationId
    }) {
      this.awardId = awardId; // 彬纷进入 - 抽奖
      this.recommendId = recommendId; // 彬纷进入 - 半屏推券
      this.codeErrorId = codeErrorId; // 彬纷进入 - 扫码异常
      this.tradeIn = tradeIn; // 彬纷进入 - 换购详情配置图片弹窗
      this.losingNew = losingNew; // 彬纷进入 - 新人扫码未中奖
      this.skuId = skuId;
      this.skuId && this.setAlreadyShowLight(false);
      this.psite = psite; // 全局配置弹窗
      this.lsite = lsite;
      this.giftRewardId = giftRewardId;
      this.gameAnimationId = gameAnimationId; // 旋转木马进入
      if(this.gameAnimationId) {
        this.initDrawPopover();
      }
      if(this.giftRewardId) {
        this.getUserInfo();
        this.initGiftReward();
      }
      if (this.awardId) {
        this.initAward();
        setDiaType("award");
      }
      // 彬纷享礼跳转 --- 存储用户信息
      if (type && type == "bfxl") {
        setStorage("bfxl_userdata", decodeURIComponent(data));
      }
      if (iosTabIndex && this.platform == "ios") {
        this.optionsTabIndex = Number(iosTabIndex);
      }
      if (AndTabindex && this.platform == "android") {
        this.optionsTabIndex = Number(AndTabindex);
      }
      if (this.recommendId) {
        this.$refs.recommendDia.initShow();
        setDiaType("recommendId");
      }
      // 分享进入 - 弹出专题页面的半屏展示列表
      if(specialUrl) {
        const pageUrl = decodeURIComponent(specialUrl);
        this.openSpecialListMiniHandle(pageUrl);
      }
    },
    // 列表广告位 - 跳转至半屏推券
    goodListBannerHandle(item) {
      this.$refs.recommendDia.initGtData({
        ...item,
        interval_time: item.type_sid
      });
    },
    async initGiftReward() {
      const res = await giftCreate();
      if (res.code != 1 || !res.data) {
        this.awardId = null;
        this.configurationInit();
        return this.delCurrentDiaList("giftReward");
      };
      this.taskCompleteData = res.data;
      this.setDiaList("giftReward");
      if (this.diaList.length) return;
      this.showTaskComplete();
    },
     async initDrawPopover() {
      const res = await drawPopover({ id: this.gameAnimationId });
      if (res.code != 1 || !res.data) {
        this.gameAnimationId = null;
        this.configurationInit();
        return this.delCurrentDiaList("drawPopover");
      };
      this.drawPopoverData = res.data;
      this.setDiaList("drawPopover");
      if (this.diaList.length) return;
      // this.showTaskComplete();
      this.isShowDrawPopoverDia = true;

    },
    drawPopoverCloseHandle() {
      this.isShowDrawPopoverDia = false;
      this.delCurrentDiaList("drawPopover");
    },
    getDrawPopoverHandle(config) {
      this.isShowDrawPopoverDia = false;
      // 跳转类型jump_type 0：自己小程序页面；1：半屏小程序；2：webview页面
      const { jump_type, link_url, type_id } = this.drawPopoverData;
      switch(jump_type) {
        case 0:
          this.$go(link_url);
          break;
        case 1:
          this.$openEmbeddedMiniProgram({
            appId: type_id,
            path: link_url
          });
          break;
        case 2:
          this.$go(`/pages/webview/webview?link=${encodeURIComponent(link)}`);
          break;
      }
      setTimeout(() => {
        this.delCurrentDiaList("drawPopover");
      }, 1000);
    },
    showTaskComplete() {
      this.$refs.taskComplete.show({
				reward: this.taskCompleteData,
        isUpdate: true
			});
      this.countDownNum = 5;
      this.giftRewardInter = setInterval(() => {
        this.countDownNum -= 1;
        if(this.countDownNum <= 1) {
          this.$refs.taskComplete.close();
          clearInterval(this.giftRewardInter);
          this.giftRewardInter = null;
        }
      }, 1000);
    },
    closeGiftRewardHandle() {
      this.giftRewardId = null;
      this.delCurrentDiaList("giftReward");
      clearInterval(this.giftRewardInter);
      this.giftRewardInter = null;
    },
    async initAward() {
      const res = await bfxlPopup({ platform: this.platform });
      if (res.code != 1) {
        this.awardId = null;
        this.configurationInit();
        return this.delCurrentDiaList("award");
      };
      const { other } = res.data;
      if (other) {
        this.delCurrentDiaList("award");
        setDiaType("recommendId");
        this.$refs.recommendDia.initShow(res.data);
        return;
      }
      this.awardConfig = res.data;
      // 弹窗的排序
      if (this.diaList.length || this.gift) {
        this.setDiaList("award");
        return;
      }
      this.isShowAwardDia = true;
      this.setDiaList("award");
    },
    closeCashBackDiaHandle() {
      // 关闭当前的弹窗
      this.configurationInit(false);
    },
  },
  onUnload() {
    this._RewardedVideoAd.videoAdDestroy();
  },
};
</script>
<style lang="scss">
page {
  background-color: #f7f7f7;
}
.home{
  position: relative;
  z-index: 0;
  &::before {
    content: '\3000';
    background: url("https://file.y1b.cn/store/1-0/24515/664462046066a.png") 0 0 / cover;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 428rpx;
    z-index: -1;
  }
}
.swiper_search{
  flex: 1;
  &.ani_flex-in {
    flex: 1;
  }
  &.ani_flex-out {
    flex: 0;
  }
}
.goodList_item {
  position: relative;
  z-index: 0;
  &::before {
    content: "\3000";
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 1220rpx;
    background: linear-gradient(180deg, #ffffff 6%, rgba(247, 247, 247, 0) 23%);
  }
  // &.active::before {
  //   border-radius: 40rpx 40rpx 0 0;
  // }
  &.zindex_99 {
    z-index: 10;
    &::before {
      content: '\3000';
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 1;
      background: rgba($color: #000, $alpha: 0.75);
      border-radius: 0;
    }
  }
}
.notion_bar {
  position: sticky;
  z-index: 1;
  margin: 0rpx 16rpx;
  // width: 100%;
  height: 0;
  box-sizing: border-box;
}

.nav_cont_box {
  flex: 1;
  box-sizing: border-box;
  font-size: 0;
}

.my-beans-label {
  margin-left: 4rpx;
  line-height: 1;
}


.sticky-tabs-head {
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  transition: opacity 0.5s;
  z-index: 10;
}

.sticky-navbar-bg-box {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 252rpx;
  box-shadow: 0px 2rpx 6rpx 2rpx rgba(0, 0, 0, 0.05);
  background-color: #ffffff;
}

.sticky-navbar-bg {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    270deg,
    rgba(51, 118, 255, 0.22) 7%,
    rgba(249, 127, 2, 0.08) 33%,
    rgba(255, 211, 213, 0.5) 93%
  );
  filter: blur(40px);
}

.ani_head {
  opacity: 0;
  transition: opacity 0.5s;
// animation: hideAni .5s;
}
.ani_head-in {
  opacity: 1;
}

.ani_head-out {
  opacity: 0;
}

.sticky-tabs-head-in {
  opacity: 1;
}

.sticky-tabs-head-out {
  opacity: 0;
  pointer-events: none;
}

/*
	sticky生效条件：
	1、父元素不能overflow:hidden或者overflow:auto属性。(mescroll-body设置:sticky="true"即可, mescroll-uni本身没有设置overflow)
	2、必须指定top、bottom、left、right4个值之一，否则只会处于相对定位
	3、父元素的高度不能低于sticky元素的高度
	4、sticky元素仅在其父元素内生效,所以父元素必须是 mescroll
	*/
.sticky-tabs {
  z-index: 99;
  position: sticky;
  padding: 0 24rpx;
  // position: relative;
  z-index: 9;
  width: 100%;
  box-sizing: border-box;
  &::before {
    content: "\3000";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 40rpx 40rpx 0 0;
    background-color: #ffffff;
    z-index: -1;
    position: absolute;
  }
  &.tabs_active {
    position: fixed;
  }
}

.test-item {
  height: 100rpx;
}
.notion_Img {
  position: fixed;
  z-index: 1;
  // height: 0;
  width: 100%;
  box-sizing: border-box;
  bottom: calc(var(--padding) + constant(safe-area-inset-bottom));
  bottom: calc(var(--padding) + env(safe-area-inset-bottom));
  bottom: calc(var(--padding) + 26rpx);
}
.login_box {
  position: fixed;
  left: 32rpx;
  right: 32rpx;
  bottom: calc(var(--padding) + constant(safe-area-inset-bottom));
  bottom: calc(var(--padding) + env(safe-area-inset-bottom));
  bottom: calc(var(--padding) + 26rpx);
  height: 88rpx;
  background: rgba(0,0,0,0.75);
  border-radius: 48rpx;
  font-size: 26rpx;
  font-weight: 600;
  color: #fff;
  padding: 14rpx;
  box-sizing: border-box;
  .lg_left::before {
    content: '\3000';
    background: url("https://file.y1b.cn/store/1-0/231018/652f717c4addc.png") 0 0 / cover;
    width: 114rpx;
    height: 114rpx;
    margin-top: -34rpx;
    margin-right: 12rpx;
  }
  .lg_btn {
    width: 152rpx;
    height: 60rpx;
    line-height: 60rpx;
    background: #f84842;
    border-radius: 36rpx;
    font-size: 28rpx;
    text-align: center;
  }
}
.golden_bean-box {
  position: relative;
  margin-top: var(--top);
  background: #fff;
	border-radius: 28rpx 28rpx 0rpx 0;
  &.light_bg {
    z-index: 10;
    &::before {
      content: '\3000';
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 0;
      background: rgba($color: #000, $alpha: 0.75);
      border-radius: 0;
    }
  }
}

.draw_cont{
  position: relative;
  width: 750rpx;
  height: 764rpx;
  z-index: 0;
  padding-top: 208rpx;
  box-sizing: border-box;
  &::before {
      content: '\3000';
      background: url("https://test-file.y1b.cn/store/1-0/24314/65f2abcd99a51.png") 0 0 / 100% 100%;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
  }
  .draw_close {
    width: 48rpx;
    height: 48rpx;
    position: absolute;
    top: -88rpx;
    right: 48rpx;
  }
  .draw_image{
    width: 262rpx;
    height: 304rpx;
    display: block;
    margin: 0 auto;
  }
  .draw_title {
    text-align: center;
    margin: 34rpx auto 0;
    font-size: 32rpx;
    color: #fffbec;
    font-weight: bold;
  }
  .draw_btn{
    width: 382rpx;
    height: 122rpx;
    position: relative;
    z-index: 0;
    margin: 48rpx auto 0;
    &::before {
      content: '\3000';
      background: url("https://test-file.y1b.cn/store/1-0/24314/65f2ae30ca09b.png") 0 0 / 100% 100%;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
  }
}
.video_cont{
  width: 100%;
  height: 500rpx;
  // background: gray;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 99;
  .video_btn{
    position: absolute;
    z-index: 999;
    background: rgba($color: #fff, $alpha: .6);
    line-height: 64rpx;
    left: 30rpx;
    text-align: center;
    padding: 0 20rpx;
    border-radius: 30rpx;
    font-size: 26rpx;
    border: 2rpx solid #fff;
  }
}

.search_box{
  font-size: 26rpx;
  color: #444;
  height: 68rpx;
  background: #ffffff;
  border-radius: 38rpx;
  box-sizing: border-box;
  padding: 0 2rpx 0 32rpx;
  display: flex;
  align-items: center;
  border: 2rpx solid #F84842;
  box-sizing: border-box;
  line-height: 36rpx;
  position: absolute;
  top: 92rpx; // 68 + 24
  // left: 50%;
  // transform: translateX(-50%);
  width: 702rpx;
  .search_icon{
    width: 32rpx;
    height: 32rpx;
  }
  .line {
    width: 2rpx;
    height: 28rpx;
    background: #d1d1d1;
    border-radius: 200rpx;
    margin: 0 20rpx 0 16rpx;
  }
  .swiper_box{
    height: 100%;
    flex: 1;
    line-height: 68rpx;
    width: 0;
    .swiper_item{
      height: 100%;
    }
  }
  .search_btn{
    width: 124rpx;
    line-height: 60rpx;
    background: linear-gradient(172deg,#f6b761 0%, #f84842 46%);
    border-radius: 32rpx;
    font-size: 28rpx;
    text-align: center;
    color: #ffffff;
    margin-right: 2rpx;
  }
}
</style>
