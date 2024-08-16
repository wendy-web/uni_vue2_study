<template>
<view class="spread_details">
  <view class="icon_box" @click="$leftBack"
    :style="{ height: navBarHeight + 'px', top: topHeight + 'px' }"
  >
    <image class="icon_box-icon" mode="aspectFill"
      src="https://file.y1b.cn/public/img/ttxl/static/images/icon_close.png"
    ></image>
  </view>
  <view class="content_box">
    <view :class="['swiper_box', !banner_image.length ? 'loading_circle1' : '']" :style="{ height: screenWidth + 'px'}">
      <swiper class="good-img"
        :autoplay="false" :interval="2000"
        :duration="500" :circular="true"
        :current="bannerIndex"
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
      <view class="dot_lab" v-if="banner_image.length">{{ bannerIndex + 1 }} / {{ banner_image.length }}</view>
    </view>
    <!-- 商品主要信息 -->
    <view :class="['cont_box', !config ? 'loading_circle3' : '']">
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
    <!-- 底部操作按钮 -->
    <view :class="['bottom-tools-box', !config ? 'loading_circle2' : '']">
      <view class="bottom-tools">
        <view class="collect_box">
          <view class="collection-btn " @click="collectHandle">
            <image class="collection-btn-icon" mode="widthFix"
              :src="isCollect ? 'https://file.y1b.cn/store/1-0/24530/6658511d2715b.png' : 'https://file.y1b.cn/store/1-0/24528/665587c7a3dc1.png'"
              ></image>
            <text>{{ isCollect ? "已收藏" : "收藏" }}</text>
          </view>

          <view class="collection-btn " @click="isShowImg = true">
            <image class="collection-btn-icon" mode="widthFix"
              src="https://file.y1b.cn/store/1-0/2465/6660238537481.png"
              ></image>
            <text>客服</text>
          </view>
        </view>
        <!-- 推广 -->
        <view class="spread_btn" @click="spreadHandle">
          <view class="spread_btn-left">
            <view v-html="formatItemPrice(config && config.rebateMoney, 1)"></view>
          </view>
          <view class="spread_line"></view>
          <view class="spread_btn-right">立即推广</view>
        </view>
      </view>
      <view class="van-submit-bar__safe"></view>
    </view>
  </view>
  <showImg-dia
    :isShow="isShowImg"
    @close="isShowImg = false"
  ></showImg-dia>
  <!-- 生成推广海报 -->
  <painter
    customStyle="width:640px;position:fixed;bottom: -10000px;z-index :-10000"
    @imgOK="onImgOk"
    @imgErr="imgErr"
    :palette="template"
    :dirty="true"
  />
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
import { goodsDetails } from "@/api/modules/card.js";
import { toggleCollect } from '@/api/modules/jsShop.js';
import { toggleCollect as pddToggleCollect } from '@/api/modules/pddShop.js';
import showImgDia from '@/components/showImgDia.vue';
import { getNavbarData } from "@/components/xhNavbar/xhNavbar";
import { mapGetters } from "vuex";
import palette from './palette.js';
import paletteFaceValue from './paletteFaceValue.js';
import paletteShare from './paletteShare.js';
import productCont from "./productCont.vue";

export default {
  components: {
    productCont,
    showImgDia
  },
  data() {
    return {
      topHeight: 0,
      navBarHeight: 0,
      screenWidth: 375, // 屏幕宽度
      config: null,
      banner_image: [],
      bannerIndex: 0,
      attsList: [],
      detail_image: [],
      isCollect: 0,
      goods_sign: '',
      skuId: '',
      rebate: '',
      lx_type: '',
      isShowImg: false,
      is_popover: 0,
      optionsParams: {},
      template: null,
      templateShareAppUrl: null,
      shareImgUrl: '',
      showShareImage: '',
      painterHeight: 1080
    };
  },
  watch: {
  },
  computed: {
    ...mapGetters(['vipObject', 'isAutoLogin', 'userInfo']),
  },
  onShareAppMessage() {
    const { queryId, lx_type, positionId, rebate, is_popover } = this.optionsParams;
    let title = `${this.userInfo.nick_name}邀请你卖货，每件赚${this.config.rebateMoney}元`;
    let share = {
      title,
      imageUrl: this.shareImgUrl,
      path: `pages/cardModule/spreadDetail/index?lx_type=${lx_type}&queryId=${queryId}&positionId=${positionId}&rebate=${rebate}&is_popover=${is_popover}`
    }
    return share;
  },
  onLoad(options) {
    if(options.is_popover) this.is_popover = options.is_popover;
    const optionsParams = {
      queryId: options.queryId,
      lx_type: options.lx_type,
      positionId: options.positionId || 0,
      rebate: options.rebate || 0,
      is_popover: options.is_popover || 0
    }
    this.optionsParams = optionsParams;
    this.initGoodsDetails(optionsParams);
    getNavbarData().then((res) => {
      let { navBarHeight, statusBarHeight } = res;
      this.topHeight = statusBarHeight;
      this.navBarHeight = navBarHeight;
    });
    // 获取屏幕宽度
    let system = uni.getSystemInfoSync();
    this.screenWidth = system.screenWidth || 375;
    this.balanceValue = this.vipObject.balance;
  },
  methods: {
    onImgOk (event) {
      const { path, type } = event.mp.detail || event.target;
      if(type == 'shareImg') return this.shareImgUrl = path;
      this.showShareImage = path;
      uni.hideLoading();
      this.showShareImg();
    },
    imgErr(err){
      uni.hideLoading();
    },
    async initGoodsDetails(params) {
      const res = await goodsDetails(params);
      if(res.code != 1 || !res.data) {
        return this.$showModal({
          title: '温馨提示',
          showCancel: false,
          content: res.msg,
          confirm: () => this.$reLaunch(`/pages/card/index`)
        })
      }
      let { detail } = res.data;
      this.config = detail;
      if(this.config){
        const { banner_image, atts, detail_image, is_collect, goods_sign, skuId, rebate } = this.config;
        this.banner_image = banner_image;
        this.attsList = atts;
        this.detail_image = detail_image;
        this.isCollect = is_collect;
        this.goods_sign = goods_sign;
        this.skuId = skuId;
        this.rebate = rebate;
        this.createShareAppUrl();
      }
    },
    createShowShareImg() {
      uni.showLoading({
        title: '正在生成推广图'
      });
      const { banner_image, price, face_value, coupon_start_time, coupon_end_time,
        goods_name, after_pay, sale_price, code_url, sale_num, lx_type
      } = this.config;
      const [ firstImg ] = banner_image;
      // 生成推广海报
      if(face_value) {
        this.painterHeight = 1080;
        this.template = paletteFaceValue({
          productImg: firstImg,
          codeUrl: code_url || '',
          price,
          originalPrice: sale_price,
          face_value,
          coupon_start_time,
          coupon_end_time,
          goods_name,
          after_pay,
          painterHeight: this.painterHeight,
          sale_num,
          lx_type
        });
        return;
      }
      this.painterHeight = 950;
      this.template = palette({
        productImg: firstImg,
        codeUrl: code_url || '',
        price,
        goods_name,
        after_pay,
        painterHeight: this.painterHeight,
        sale_num,
        lx_type
      });
    },
    // 生成分享图
    createShareAppUrl() {
      const { banner_image, rebateMoney, price} = this.config;
      const [ firstImg ] = banner_image;
      this.templateShareAppUrl = paletteShare({
        discountImg: firstImg,
        rebateMoney,
        price
      });
    },
    async collectHandle() {
      if(!this.isAutoLogin) return this.$go('/pages/login/index');
      if(!this.userInfo.is_team) return this.$reLaunch(`/pages/card/index?optionsParams=${JSON.stringify(this.optionsParams)}`);
      const { skuId, goods_sign, goods_id, lx_type } = this.config;
      let params = { skuId, is_rebate: 1 };
			let apiCollect = toggleCollect;
      if(lx_type == 3) {
        params = { goods_sign, goods_id, is_rebate: 1 };
        apiCollect = pddToggleCollect;
      }
      const res = await apiCollect(params);
      this.$toast(res.msg);
      if(res.code ==1) this.isCollect = !this.isCollect;
    },
    spreadHandle() {
      if(!this.isAutoLogin) return this.$go('/pages/login/index');
      if(!this.userInfo.is_team) return this.$reLaunch(`/pages/card/index?optionsParams=${JSON.stringify(this.optionsParams)}`);

      if(!this.showShareImage) return this.createShowShareImg();
      this.showShareImg();
      return;
      this.$go(`/pages/cardModule/spreadDetail/saveType?goods_sign=${this.goods_sign || 0}&skuId=${this.skuId || 0}&rebate=${this.rebate || 0}&is_popover=${this.is_popover}`);
    },
    // 展示推广图
    showShareImg() {
      // 展示推广的海报展示
      wx.showShareImageMenu({
        path: this.showShareImage,
        style: 'v2',
        complete: async (res) => {
          let pattern = /fail auth deny/;
          if (pattern.test(res.errMsg)) {
            const setWritePhotosResult = await this.$setWritePhotosAlbum();
            if(setWritePhotosResult) this.saveImgToPhone(this.showShareImage);
          }
        }
      });
    },
    async saveImgToPhone(filePath, isDown = 0) {
      return new Promise(async (resolve, reject) => {
        let saveRes = {};
        let saveImage = filePath;
        if(isDown > 0) {
          saveRes = await this.$downloadFile(filePath);
          if (saveRes.statusCode !== 200) return resolve(saveRes);
        }
        if(saveRes.tempFilePath) saveImage = saveRes.tempFilePath;
        const res = await this.$saveImageToPhotosAlbum(saveImage);
        resolve(res);
      }).catch((e) => {});
    },
    bannerSwiperChange(event) {
      this.bannerIndex = event.detail.current;
    },
    formatItemPrice(price = 0, type) {
      let dom= '';
      switch(type) {
        case 1:
          dom = `<span style="font-weight:600;font-size: 13px;">¥<span style="font-size: 20px;">${price}</span></span>`;
          break;
        default:
          dom = `<span style="font-weight:600;font-size: 10px;">¥<span style="font-size: 14px;">${price}</span></span>`;
          break;
      }
      return dom;
    }
  },
}
</script>
<style lang="scss" scoped>
page {
  background: #f4f5f9;
}
.spread_details {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  padding-bottom: 166rpx;
}
.content_box {
  height: 100%;
  overflow: scroll;
  background: #f7f7f7;
}

page {
  background-color: #f7f7f7;
  overflow: hidden;
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
  .dot_lab {
    line-height: 50rpx;
    padding: 0 24rpx;
    background: rgba(0,0,0,0.35);
    border-radius: 36rpx;
    font-size: 30rpx;
    color: #fff;
    position: absolute;
    right: 32rpx;
    bottom: 22rpx;
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
  color: #333;
  margin-left: 12rpx;
}
.bottom-tools-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
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
    min-height: 452rpx;
    z-index: 1;
    background: linear-gradient(270deg,#f6f8fb 80%, #d3d3d3);
    animation: backAni 1.5s infinite;
		border-radius: 24rpx;
  }
}
.bottom-tools {
  width: 100%;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  position: relative;
  // border-top: 2rpx solid #e9e9e9;
}
.collect_box {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.collection-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  text-align: center;
  color: #999;
  position: relative;
  .share_btn {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  .collection-btn-icon {
    flex: 0 0 36rpx;
    width: 36rpx;
    height: 36rpx;
    margin-bottom: 6rpx;
  }
}
.spread_btn {
  height: 98rpx;
  background: #ef2b20;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  position: relative;
  color: #fff;
  font-weight: bold;
  text-align: center;
  line-height: 44rpx;
  width: 60%;
  .spread_btn-left {
    display: flex;
    align-items: center;
    &::before {
      content: '每件赚';
      font-size: 32rpx;
      margin-right: 4rpx;
    }
  }
  .spread_line{
    width: 2rpx;
    height: 28rpx;
    background: #fff;
  }
}
.rnl-label {
  font-size: 22rpx;
  font-weight: normal;
}
.rnl-value {
  font-size: 32rpx;
  text-align: left;
  &::before {
    content: '￥';
    font-size: 20rpx;
  }
}

.detail_img {
  width: 100%;
  font-size: 0;
  margin-top: 16rpx;
}
.pro_detail {
  margin-top: 16rpx;
  padding: 32rpx;
  background: #fff;
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
