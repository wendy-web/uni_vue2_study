<template>
<view class="coupon_details" :style="{ '--padding': packet ? '68rpx' : '0rpx' }">
  <scroll-view scroll-y="true" class="scroll_y" @scrolltolower="lowerHandle">
    <view class="icon_box" @click="backHandle"
      :style="{ height: navBarHeight + 'px', top: topHeight + 'px' }">
      <image class="icon_box-icon" mode="aspectFill"
        :src="imgUrl + 'static/images/icon_close.png'"></image>
    </view>
    <view class="notice_box">
      <anNoticeBarShow ref="anNoticeBarShow" />
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
      </view>
      <!-- 商品主要信息 -->
      <view :class="['cont_box', !config ? 'loading_circle3' : '']" :style="{ '--padding': packet ? '68rpx' : '0rpx' }">
        <productCont
          :config="config"
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
      <view class="cont_bottom" v-if="goods.length">
        <view class="list_title">相似商品</view>
        <good-list :list="goods" :isShowProfit="true"></good-list>
      </view>
      <view class="cont_load" v-if="isScroll">
        <van-loading size="16px" color="#666" class="cont_load">加载中...</van-loading>
      </view>
      <view class="cont_load" v-if="!isScroll && goods.length" >
        <view>----- 没有更多了 -----</view>
      </view>
    </view>
  </scroll-view>
    <!-- 底部操作按钮 -->
    <view :class="['bottom-tools-box', !config ? 'loading_circle2' : '']">
      <view class="remind_box" @click="goMyCouponHandle" v-if="packet">
        <image class="bg_img"  mode="scaleToFill"
          :src="subImgUrl + '/remind_box-bg.png'"></image>
        <view class="remind_left">
          <image  class="left_icon" mode="aspectFill"
            src="https://test-file.y1b.cn/store/1-0/24330/66078e0856ee8.png"></image>
            先领超级红包，再享优惠叠加
        </view>
        <view class="remind_right">强烈推荐<van-icon name="arrow" color="#F84842" size="26rpx" /></view>
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
        <view :class="['redeem-now', showInitBuy ? '' : 'active']">
          <view class="vip_progress" v-if="config.vip_profit > 0">
            会员再返<text style="color: #F84842;">¥{{config.vip_profit}}</text>
          </view>
          <block v-if="showInitBuy">
            <view class="redeem-now-left" @click="confirmHandle(false)">
              <view class="rnl-value">{{ config.market_price }}</view>
              <view class="rnl-label">原价购买</view>
            </view>
          </block>
          <view class="redeem-now-right" @click="confirmHandle">
            <liu-customize-swiper :swiperList="headImgArr"
              ref="headImgArrRef" class="customize_box"
            ></liu-customize-swiper>
            <view class="fl_col_cen">
              <view class="rnl-value-box fl_center">
                {{ showPriceLab ? '活动价' : '' }}
                <view class="rnl-value">{{ config.price }}</view>
              </view>
              <view class="rnl-label">{{ shoBtnLabText }}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="van-submit-bar__safe"></view>
    </view>
<!-- 生成分享图 -->
<painter
  customStyle="width:904px;height:732px;position:fixed;bottom: -10000px;z-index :-10000"
  @imgOK="onImgOk"
  @imgErr="imgErr"
  :palette="templateShareAppUrl"
  :dirty="true"
/>
</view>
</template>
<script>
import { userPosition } from "@/api/modules/index.js";
import { goodsQuery, toggleCollect } from "@/api/modules/jsShop.js";
import { goodsSearch, toggleCollect as pddToggleCollect } from '@/api/modules/pddShop.js';
import { goodsDetails } from "@/api/modules/shopMall.js";
import goodList from "@/components/goodList.vue";
import { getNavbarData } from "@/components/xhNavbar/xhNavbar.js";
import { getImgUrl, getUrlKey } from "@/utils/auth.js";
import { getViewPort } from "@/utils/index.js";
import shareMixin from '@/utils/mixin/shareMixin.js'; // 混入分享的混合方法
import { mapActions, mapGetters, mapMutations } from "vuex";
import anNoticeBarShow from "./anNoticeBarShow.vue";
import liuCustomizeSwiper from './components/liu-customize-swiper/liu-customize-swiper';
import productCont from "./productCont.vue";
import paletteUrl from './static/paletteUrl.js';

export default {
  components: {
    productCont,
    anNoticeBarShow,
    liuCustomizeSwiper,
    goodList
  },
  mixins: [shareMixin], // 采用混合的模式添加
  data() {
    return {
      isCollect: false, // 收藏状态
      config: null,
      packet: null,
      myIndex: 0,
      screenWidth: 375, // 屏幕宽度
      imgUrl: getImgUrl(),
      subImgUrl: `${getImgUrl()}static/subPackages/shopMallModule`,
      stickTop: "",
      navBarHeight: 40,
      topHeight: 0,
      banner_image: [],
      attsList: [],
      detail_image: [],
      currentIndex: 0,
      headImgArr: [],
      queryId: '',
      lx_type: '',
      template: null,
      showShareImage: '',
      templateShareAppUrl: null,
      initParams: null,
      requestApi: '', // 京东-拼多多的请求api
      listParams: null,
      goods: [],
      isRequestNum: 0,
      isScroll: false,
      isLoading: false
    };
  },
  computed: {
    ...mapGetters(["userInfo", 'isAutoLogin']),
    showInitBuy() {
      return this.config && this.config.face_value && this.config.pathXq;
    },
    shoBtnLabText() {
      if(!this.config) return;
      let { lx_type, face_value, sale_num } = this.config;
      // 拼多多
      if(lx_type == 3) {
        let showTxt = '';
        if(face_value && sale_num) {
          showTxt = `${sale_num}人用券下单`;
        } else if(!face_value && sale_num) {
          showTxt = `${sale_num}人购买`;
        } else if(!face_value && !sale_num) {
          showTxt = `立即购买`;
        }
        return showTxt;
      }
      return face_value ? '券后价购买' : '立即购买';
    },
    showPriceLab() {
      if(!this.config) return;
      let { lx_type, face_value, sale_num } = this.config;
      return (lx_type ==3 && face_value)
    }
  },
  onLoad(options) {
    let queryId, lx_type, positionId, active_id, tag, mlocid, plocid= 0;
    if(options.q ) {
      const codeUrl = decodeURIComponent(options.q);
      console.log('codeUrl', codeUrl);
      queryId = getUrlKey(codeUrl, 'queryId');
      lx_type = getUrlKey(codeUrl, 'lx_type');
      active_id = getUrlKey(codeUrl, 'active_id');
      tag = getUrlKey(codeUrl, 'tag');
      mlocid = getUrlKey(codeUrl, 'mlocid');
      plocid = getUrlKey(codeUrl, 'plocid');
      if(mlocid || plocid) userPosition({ mlocid, plocid});
    } else {
      queryId = options.queryId;
      lx_type = options.lx_type;
      positionId = options.positionId;
      active_id = options.active_id;
      tag = options.tag;
    }
    this.queryId = queryId;
    this.lx_type = lx_type;
    const params = {
      queryId,
      lx_type,
      positionId,
      active_id,
      tag
    }
    this.initParams = params;
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
		...mapMutations({
      setMiniProgram: "user/setMiniProgram",
    }),
    ...mapActions({
      getUserTotal: "user/getUserTotal",
      updateUserNew: "user/updateUserNew",
    }),
    backHandle() {
      const pageList = getCurrentPages();
      const currentPageObj = pageList[pageList.length - 1];
      const firstRouter = pageList[0].route;
      const currentPage = currentPageObj.route;
      const pageFindIndex = pageList.findIndex((item) => item.route == currentPage);
      let leftBackDelta = pageList.length - pageFindIndex;
      (firstRouter != currentPage) && (leftBackDelta -= 1);
      this.$leftBack(leftBackDelta);
    },
    onImgOk (event) {
      const { path } = event.mp.detail || event.target;
      this.showShareImage = path;
    },
    imgErr(err){
      console.log('图片合成失败', err);
    },
    bannerSwiperChange(event) {
      this.myIndex = event.detail.current;
    },
    lowerHandle() {
      console.log('lowerHandle', );
      if(!this.isScroll) return;
      this.requestListFun();
    },
    async requestListFun() {
      this.isLoading = true;
      const res = await this.requestApi(this.listParams).catch(() => {
        this.isLoading = false;
        this.isScroll = false;
      });
      if (!res.code || !res.data) {
        this.isScroll = false;
        this.isLoading = false;
        return
      }
      let { list, total_count } = res.data;
      // total_count = 30;
      this.goods = this.goods.concat(list);
      this.listParams.page += 1;
      let isNextPage = (this.listParams.page * this.listParams.size) < total_count;
      // this.mescroll.endSuccess(list.length || total_count, isNextPage);
      setTimeout(() => {
        this.isLoading = false;
        this.isScroll = isNextPage;
      }, 10);

      if (list.length <= 0 && isNextPage && this.isRequestNum < 2) {
        this.isRequestNum += 1;
        // this.mescroll.triggerUpScroll();
        this.requestListFun();
        return;
      }
      this.isRequestNum = 0;
    },
    // 去使用
    goMyCouponHandle() {
      if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
      const {type_id, type_sid } = this.packet;
      console.log('this.config.lx_type', this.config.lx_type)
      this.setMiniProgram(this.config.lx_type);
      this.$openEmbeddedMiniProgram({
        appId: type_id,
        path: type_sid
      });
    },
    async initQuery(params) {
      const res = await goodsDetails(params);
      if(res.code != 1 || !res.data) {
        this.$showModal({
          title: '温馨提示',
          content: res.msg,
          showCancel: false,
          confirm: () => {
            this.$leftBack();
          }
        });
        return;
      };
      let { detail, buy_log, packet } = res.data;
      this.config = detail;
      const { cid3, positionId, lx_type, cat_id } = this.config;
      this.goodsList = [];
      this.listParams = {
        positionId,
        size: 10,
        page: 1
      }
      this.isScroll = true;
      // 京东
      if(lx_type == 2) {
        this.listParams.cid3 = cid3;
        this.requestApi = goodsQuery;
      } else {
        // 拼多多
        this.listParams.cat_id = cat_id;
        this.requestApi = goodsSearch;
      }

      if(this.config){
        const { banner_image, atts, detail_image, face_value, price } = this.config;
        this.banner_image = banner_image || [];
        const [ firstImg ] = banner_image;
        this.templateShareAppUrl = paletteUrl({
          firstImg,
          face_value,
          price
        });
        this.attsList = atts;
        this.detail_image = detail_image || [];
        // 无商品详情图时 - 主动触发底部的列表加载
        if(!this.detail_image.length) this.requestListFun();
      }
      this.headImgArr = this.config.headImgArr;
      if(this.headImgArr && this.headImgArr.length) this.$refs.headImgArrRef.init(this.headImgArr);
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
      if(!buy_log.length) return;
      this.$refs.anNoticeBarShow.init(buy_log);
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
    async confirmHandle(isGet = true) {
      // 调整推广位的访问 -
      if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
      const { appid, path, pathXq, lx_type } = this.config;
      this.setMiniProgram(lx_type);
      console.log('lx_type', lx_type)
      this.$openEmbeddedMiniProgram({
        appId: appid,
        // envVersion:'trial',
        path: isGet ? path : pathXq
      });
    },
  },
  onUnload() {
    this.$refs.headImgArrRef && this.$refs.headImgArrRef.clearIntervalTimer();
  }
};
</script>
<style lang="scss">
@import url("@/components/u-parse/u-parse.css");
page {
  background-color: #f7f7f7;
  overflow: hidden;
}
.coupon_details {
  position: relative;
  padding-bottom: 140rpx;
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  overflow: hidden;
  // overflow-y: scroll;
  box-sizing: border-box;
  padding-bottom: calc(140rpx + var(--padding) +  constant(safe-area-inset-bottom));
  /* 兼容 IOS<11.2 */
  padding-bottom: calc(140rpx + var(--padding) + env(safe-area-inset-bottom));
  /* 兼容 IOS>11.2 */
}
.scroll_y {
  height: 100%;
}
.notice_box {
  position: fixed;
  top: 196rpx;
  left: 24rpx;
  z-index: 2;
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
}

.content_box {
  // height: 100%;
  // overflow: scroll;
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
  width: 100vw;
  z-index: 9;
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
  box-sizing: border-box;
  border-radius: 48rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
  // overflow: hidden;
  background: linear-gradient(173deg,#f84842 41%, #fe8f72 100%);
  .vip_progress {
    position: absolute;
    right: 10rpx;
    top: -30rpx;
    padding: 0 28rpx 0 16rpx;
    height: 48rpx;
    background: url('https://file.y1b.cn/store/1-0/2472/668396e22d2a7.png') 0 0 / 100% 100%;
    font-size: 24rpx;
    font-weight: bold;
    color: #b75a30;
    line-height: 34rpx;
    text-align: center;

  }
  &.active {
    .customize_box {
      margin-right: 30rpx;
    }
    .redeem-now-right {
      border-radius: 48rpx;
    }
  }
  .redeem-now-txt {
    flex: 1;
    text-align: center;
  }
  .customize_box {
    margin-left: -40rpx;
  }
}
.redeem-now-left {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  white-space: nowrap;
  padding-right: 10rpx;
  white-space: nowrap;
  align-self: stretch;
  // background: linear-gradient(167deg,#f48f28 0%, #ffc654 100%);
  background: linear-gradient(167deg,#f48f28 0%, #ffc654 100%);
  padding: 0 38rpx 0 38rpx;
  position: relative;
  color: #A86E2E;
  border-radius: 48rpx 0 0 48rpx;
  &::after {
    content: '\3000';
    position: absolute;
    height: 100%;
    width: 40rpx;
    background: url("https://file.y1b.cn/store/1-0/24426/662b10834d629.png") 0 0 / 100% 100%;
    right: -20rpx;
  }
}
.rnl-label {
  font-size: 22rpx;
  font-weight: normal;
}
.rnl-value-box{
  font-size: 26rpx;
}
.rnl-value {
  font-size: 32rpx;
  text-align: left;
  &::before {
    content: '￥';
    font-size: 20rpx;
  }
}

.redeem-now-right {
  align-self: stretch;
  background: linear-gradient(173deg,#f84842 41%, #fe8f72 100%);
  flex: 1;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 48rpx 48rpx 0;
  // margin-left: -28rpx;
}

// .icon_middle {
//   height: 100%;
//   width: 34rpx;
//   background: url("https://file.y1b.cn/store/1-0/24426/662b0a54f2953.png") 0 0 / 100% 100%;
// }
// .icon_middle {
//   width: 30rpx;
//   height: 120%;
//   background: linear-gradient(167deg,#f48f28 0%, #ffc654 100%);
//   background: linear-gradient(167deg,#f48f28 0%, #ffc654 100%);
//   // position: absolute;
//   transform: rotate(-15deg);
//   position: relative;
//   // margin-left: -5rpx;
//   left: -10rpx;
//   &::before {
//     content: '\3000';
//     width: 15rpx;
//     height: 100%;
//     position: absolute;
//     background: linear-gradient(173deg,#f84842 41%, #fe8f72 100%);
//     // margin-left: -5rpx;
//   }
// }

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
.cont_bottom {
  .list_title {
    font-size: 32rpx;
    color: #333;
    line-height: 44rpx;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 48rpx auto 16rpx;
    &::before,
    &::after {
      content: '\3000';
      display: block;
      background: url("https://file.y1b.cn/store/1-0/24727/66a46da915032.png") 0 0 / cover;
      width: 28rpx;
      height: 28rpx;
      margin: 0 10rpx;
    }
    &::before {
      transform: scaleX(-1);
    }

  }
}
.cont_load {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10rpx auto;
  font-size: 26rpx;
  color: #aaa;
}
</style>
