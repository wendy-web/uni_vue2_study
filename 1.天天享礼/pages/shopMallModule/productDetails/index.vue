<template>
<view class="coupon-details">
  <view class="icon_box" @click="$leftBack"
    :style="{ height: navBarHeight + 'px', top: topHeight + 'px' }">
    <image class="icon_box-icon" mode="aspectFill"
      :src="imgUrl + 'static/images/icon_close.png'"></image>
  </view>
  <view class="content_box">
    <view :class="['swiper_box', !banner_image.length ? 'loading_circle1' : '']" :style="{ height: screenWidth + 'px'}">
      <swiper class="good-img"
        :autoplay="false" :interval="2000"
        :duration="500" :circular="true"
        :current="myIndex"
        @change="bannerSwiperChange"
        :style="{ height: screenWidth + 'px'}"
      >
        <swiper-item class="good-img" v-for="(item, idx) in banner_image" :key="idx">
          <van-image
            :width="screenWidth + 'px'"
            :height="screenWidth + 'px'"
            :src="item"
            use-loading-slot
            class="banner_img"
          ><van-loading slot="loading" type="spinner" size="20" vertical />
          </van-image>
        </swiper-item>
      </swiper>
      <view class="dot_lab" v-if="banner_image.length">{{ myIndex + 1 }} / {{ banner_image.length }}</view>
      <view class="notice_box" >
        <anNoticeBarShow
          :list="buy_log"
          :config="config"
          :isSearch="isSearch"
          :isHome="isHome"
          :isShowGetText="isShowGetText"
          :isShow="isShowBuyLog"
          @swiperEnd="isShowBuyLog = false"
        />
      </view>
    </view>
    <!-- 商品主要信息 -->
    <view :class="['cont_box', !config ? 'loading_circle3' : '']" :style="{ '--padding': packet ? '68rpx' : '0rpx' }">
      <productCont
        :config="config"
        :isSearch="isSearch"
        :isHome="isHome"
        :isShowPrice="isShowPrice"
        @confirm="confirmHandle"
        v-if="config"
      ></productCont>
      <view class="pro_detail" v-if="attsList && attsList.length">
        <view class="pro_detail-title">商品详情</view>
        <view class="pro_detail-item" v-for="(item, idx) in attsList" :key="idx">
          <view class="detail_item-lab">{{ item.attName }}</view>
          <view class="detail_item-txt">{{ item.vals }}</view>
        </view>
      </view>
      <view class="detail_img" v-if="detail_image && detail_image.length">
        <van-image width="100%"
          v-for="(item, idx) in detail_image" :key="idx"
          :src="item" use-loading-slot fit="widthFix"
        ><van-loading slot="loading" type="spinner" size="20" vertical />
        </van-image>
      </view>
    </view>

    <!-- 底部操作按钮 -->
    <view :class="['bottom-tools-box', !config ? 'loading_circle2' : '']">
      <view class="remind_box" @click="goMyCouponHandle" v-if="packet">
        <image class="bg_img"  mode="aspectFit"
          :src="subImgUrl + '/remind_box-bg.png'"></image>
        <view class="remind_left">
          <image  class="left_icon" mode="aspectFill"
            src="https://test-file.y1b.cn/store/1-0/24330/66078e0856ee8.png"></image>
            领超级红包，享优惠叠加
        </view>
        <view class="remind_right">查看<van-icon name="arrow" color="#F84842" size="26rpx" /></view>
      </view>
      <view class="bottom-tools">
        <view class="bottom-tools-left">
          <view class="collection-btn">
            <button open-type="share" class="share_btn" :data-item="item"></button>
            <image class="collection-btn-icon" src="https://test-file.y1b.cn/store/1-0/24330/6607db55e7645.png" mode="widthFix"></image>
            <text>分享</text>
          </view>
          <view  class="collection-btn" @click="collectHandle">
            <image class="collection-btn-icon" mode="widthFix"
              :src="config.is_collect ? 'https://test-file.y1b.cn/store/1-0/24330/6607dd8ade593.png' : 'https://test-file.y1b.cn/store/1-0/24330/6607dbacaf75c.png' "
              ></image>
            <text>{{ config.is_collect ? "已收藏" : "收藏" }}</text>
          </view>
        </view>
        <!-- 立即兑换 -->
        <view class="redeem-now" @click="confirmHandle">
          <block v-if="isShowPrice">
            <view class="redeem-now-left">
              <view class="rnl-label" v-if="config.face_value">券后</view>
              <view class="rnl-value">{{ config.price }}</view>
            </view>
            <view class="icon_middle"></view>
            <view class="redeem-now-right"> {{ config.face_value ? "领券购买" : '立即购买' }}</view>
          </block>
          <view class="redeem-now-txt" v-else>
            <text v-if="config.face_value">{{ isShowGetText ? '领' : '兑'}}{{ config.face_value }}元券</text>
            <text v-else>立即购买</text>
          </view>
        </view>
      </view>
      <view class="van-submit-bar__safe"></view>
    </view>
  </view>
</view>
</template>
<script>
import { toggleCollect } from "@/api/modules/jsShop.js";
import { toggleCollect as pddToggleCollect } from '@/api/modules/pddShop.js';
import { goodsDetails } from "@/api/modules/shopMall.js";
import { getNavbarData } from "@/components/xhNavbar/xhNavbar.js";
import { getImgUrl } from "@/utils/auth.js";
import { getViewPort } from "@/utils/index.js";
import shareMixin from '@/utils/mixin/shareMixin.js'; // 混入分享的混合方法
import { mapActions, mapGetters } from "vuex";
import anNoticeBarShow from "./anNoticeBarShow.vue";
import productCont from "./productCont.vue";
export default {
  components: {
    productCont,
    anNoticeBarShow
  },
  mixins: [shareMixin], // 采用混合的模式添加
  data() {
    return {
      isCollect: false, // 收藏状态
      config: null,
      buy_log: [],
      isSearch: false,
      isHome: false,
      isJdCenter: false,
      isFeed: false,
      packet: null,
      myIndex: 0,
      screenWidth: 375, // 屏幕宽度
      imgUrl: getImgUrl(),
      subImgUrl: `${getImgUrl()}static/subPackages/shopMallModule`,
      stickTop: "",
      navBarHeight: 40,
      topHeight: 0,
      isShowBuyLog: false,
      banner_image: [],
      attsList: [],
      detail_image: [],
      queryId: 0
    };
  },
  computed: {
    ...mapGetters(["userInfo", 'isAutoLogin']),
    isShowGetText() {
      return this.userInfo.is_vip || this.isJdCenter || (this.isFeed && this.config.credits);
    },
    isShowPrice() {
      return this.isSearch || (this.config && !this.config.credits);
    }
  },
  onLoad(options) {
    const params = {
      queryId: options.queryId,
      lx_type: options.lx_type
    }
    this.queryId = options.queryId;
    this.isSearch = JSON.parse(options.isSearch || false);
    this.isHome = JSON.parse(options.isHome || false);
    this.isJdCenter = JSON.parse(options.isJdCenter || false);
    this.isFeed = JSON.parse(options.isFeed || false);
    this.initQuery(params);
    // 获取屏幕宽度
    let system = uni.getSystemInfoSync();
    this.screenWidth = system.screenWidth || 375;
    let viewPort = getViewPort();
    this.stickTop = viewPort.navHeight + 26;
    getNavbarData().then((res) => {
      let { navBarHeight, statusBarHeight } = res;
      this.navBarHeight = navBarHeight;
      this.topHeight = statusBarHeight;
    });
  },
  methods: {
    ...mapActions({
      getUserTotal: "user/getUserTotal",
      updateUserNew: "user/updateUserNew",
    }),
    bannerSwiperChange(event) {
      this.myIndex = event.detail.current;
    },
    // 去使用
    goMyCouponHandle() {
      if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
      const {type_id, type_sid } = this.packet;
      this.$openEmbeddedMiniProgram({
        appId: type_id,
        path: type_sid
      });
    },
    async initQuery(params) {
      const res = await goodsDetails(params);
      if(res.code != 1 || !res.data) return;
      let { detail, buy_log, packet } = res.data;
      this.config = detail;
      if(this.config){
        const { banner_image, atts, detail_image } = this.config;
        this.banner_image = banner_image;
        this.attsList = atts;
        this.detail_image = detail_image;
      }
      this.packet = packet;
      // this.config = {
      //   ...detail,
      //   atts: [{"attName":"是否消字号商品","vals":"非消字号"},{"attName":"保质期","vals":"3年"},{"attName":"总净含量","vals":"200mL"},{"attName":"批准文号/备案编号","vals":"粤G妆网备字2022324124"},{"attName":"产品（注册/备案）名称","vals":"仁和维生素e乳液"},{"attName":"是否特殊化妆品","vals":"非特殊化妆品"}]
      // };
      // buy_log = [
      //   {
      //     nick_name: 'w**y',
      //     avatar_url: 'https://img.pddpic.com/mms-material-img/2022-03-26/f2a26563-f58b-4f90-b9ab-2e2990805db7.png'
      //   },
      //   {
      //     nick_name: 'w**2',
      //     avatar_url: 'https://img.pddpic.com/mms-material-img/2022-03-26/f2a26563-f58b-4f90-b9ab-2e2990805db7.png'
      //   }
      // ];
      if(buy_log.length) setTimeout(() => {
        this.buy_log = buy_log;
        this.isShowBuyLog = true;
        if(buy_log.length == 1) setTimeout(() => this.isShowBuyLog = false, 3000);
      }, 2000);
    },
    async collectHandle() {
      if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
      const { skuId, goods_sign, goods_id, lx_type } = this.config;
      let params = { skuId };
      let toggleApi = toggleCollect;
      if(lx_type == 3) {
        params = { goods_sign, goods_id };
        toggleApi = pddToggleCollect;
      }
      const res = await toggleApi(params);
      if (res.code == 1) this.config.is_collect = !this.config.is_collect;
      this.$toast(res.msg);
    },
    async confirmHandle() {
      if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
      const { appid, path } = this.config;
      this.$openEmbeddedMiniProgram({
        appId: appid,
        // envVersion:'trial',
        path
    });
    },
  },
};
</script>
<style lang="scss">
@import url("@/components/u-parse/u-parse.css");
page {
  background-color: #f7f7f7;
  overflow: hidden;
}
.loading_circle2::before {
  content: '\3000';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: linear-gradient(270deg,#f6f8fb 80%, #d3d3d3);
  animation: backAni 1s infinite;
}
@keyframes backAni {
  0% {
    background: linear-gradient(270deg,#f6f8fb 80%, #d3d3d3);
  }
  50% {
    background: linear-gradient(270deg,#f6f8fb 60%, #d3d3d3);
  }
  100% {
    background: linear-gradient(270deg,#f6f8fb 30%, #d3d3d3);
  }
}
.loading_circle1::before{
  content: '\3000';
  position: absolute;
  top:50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  animation: loading 1s linear infinite;
  overflow: hidden;
  border-radius: 50%;
  background: conic-gradient(#f6f8fb, 30%, #d3d3d3); // 锥形渐变实现一个半圆的效果
  --mask: radial-gradient(closest-side, transparent 75%, black 76%); // 径向渐变实现一个蒙版的效果
  -webkit-mask-image: var(--mask);
  mask-image: var(--mask);
  z-index: 1;
}
@keyframes loading {
    0% { transform: rotate(0); }
    100% { transform: rotate(360deg);}
}
.swiper_box {
  position: relative;
  z-index: 0;
  margin-bottom: 24rpx;
  .dot_lab {
    line-height: 40rpx;
    padding: 0 16rpx 0 24rpx;
    background: rgba(0,0,0,0.35);
    border-radius: 22rpx 0 0 22rpx;
    font-size: 26rpx;
    color: #fff;
    position: absolute;
    right: 0;
    bottom: 23rpx;
  }
  .notice_box {
    position: absolute;
    top: 196rpx;
    left: 24rpx;
  }
}
.coupon-details {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  padding-bottom: 196rpx;
}
.content_box {
  height: 100%;
  overflow: scroll;
  background: #f7f7f7;
}


.icon_box {
  position: fixed;
  left: 25rpx;
  display: flex;
  align-items: center;
  z-index: 9;
  .icon_box-icon {
    width: 56rpx;
    height: 56rpx;
  }
}
.nav-left {
  position: absolute;
  left: 10rpx;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
}
.nav-left-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333333;
  margin-left: 12rpx;
}
.bottom-tools-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  .bottom-tools-left {
    display: flex;
    // flex: 1;
    justify-content: space-around;
    align-items: center;
  }
  .remind_box {
    padding: 0 40rpx;
    height: 68rpx;
    display: flex;
    align-items: center;
    position: relative;
    z-index: 0;
    font-size: 26rpx;
    line-height: 36rpx;
    color: #333;
    .remind_left {
      display: flex;
      align-items: center;
      margin-left: 16rpx;
      font-weight: bold;
      .left_icon {
        width: 30rpx;
        height: 36rpx;
        margin-right: 10rpx;
      }
    }
    .remind_right {
      color: #f84842;
      font-weight: 600;
      margin-left: 16rpx;
    }
  }
}
.cont_box {
  position: relative;
  z-index: 0;
  margin-bottom: calc(
    140rpx + var(--padding) + constant(safe-area-inset-bottom)
  ); /* 兼容 IOS<11.2 */
  margin-bottom: calc(
    140rpx + var(--padding) + env(safe-area-inset-bottom)
  ); /* 兼容 IOS>11.2 */
  &.loading_circle3::before{
    content: '\3000';
    // margin: 0 24rpx;
    position: absolute;
    top: 0;
    left: 24rpx;
    right: 24rpx;
    min-height: 424rpx;
    z-index: 1;
    background: linear-gradient(270deg,#f6f8fb 80%, #d3d3d3);
    animation: backAni 1.5s infinite;
		border-radius: 24rpx;
  }
}
.bottom-tools {
  width: 100%;
  background-color: #ffffff;
  padding: 32rpx 32rpx 0;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  position: relative;
  border-top: 2rpx solid #e9e9e9;
}
.collection-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  text-align: center;
  color: #333;
  line-height: 36rpx;
  position: relative;
  min-width: 80rpx;
  flex: 0 0 80rpx;
  margin-right: 36rpx;
  .share_btn {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  .collection-btn-icon {
    flex: 0 0 40rpx;
    width: 40rpx;
    height: 40rpx;
  }
}
.redeem-now {
  // min-width: 408rpx;
  flex: 1;
  height: 88rpx;
  padding: 0 20rpx;
  box-sizing: border-box;
  background: #f84842;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
  .redeem-now-txt {
    flex: 1;
    text-align: center;
  }
}
.redeem-now-left {
  display: flex;
  align-items: baseline;
  flex: 1;
  justify-content: center;
  white-space: nowrap;
  padding-right: 10rpx;
  white-space: nowrap;
  .rnl-label {
    font-size: 24rpx;
    margin-right: 8rpx;
    font-weight: normal;
  }
  .rnl-value {
    font-size: 40rpx;
    text-align: left;
    &::before {
      content: '￥';
      font-size: 24rpx;
    }
  }
}
.redeem-now-right{
  flex: 1;
  white-space: nowrap;
}
.icon_middle {
  width: 2rpx;
  height: 20rpx;
  background: #ffffff;
  border-radius: 2rpx;
}

.van-submit-bar__safe {
  padding-bottom: 32rpx;
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
  background-color: #ffffff;
  box-sizing: border-box;
}

.share-btn {
  position: fixed;
  right: 20px;
  background-color: unset;
  width: 32px;
  height: 32px;
  padding: 0;
  line-height: unset;
  z-index: 10;
}
.detail_img {
  width: 100%;
  font-size: 0;
  margin-top: 32rpx;
}
.pro_detail {
  margin-top: 32rpx;
  padding: 0 32rpx;
  .pro_detail-title{
    font-size: 30rpx;
    border-bottom: 2rpx solid #E9E9E9;
    color: #333;
    padding-bottom: 20rpx;
    font-weight: bold;
  }
  .pro_detail-item {
    font-size: 28rpx;
    text-align: left;
    line-height: 40rpx;
    display: flex;
    color: #666;
    align-items: center;
    border-bottom: 2rpx solid #E9E9E9;
    .detail_item-lab {
      width: 40%;
      box-sizing: border-box;
      padding: 10rpx 20rpx;
      border-right: 2rpx solid #E9E9E9;
    }
    .detail_item-txt{
      width: 60%;
      box-sizing: border-box;
      padding: 10rpx 20rpx;
    }
  }
}
</style>
