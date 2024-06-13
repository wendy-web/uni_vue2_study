<template>
<view class="discounts cont_bottom">
<mescroll-body
  :sticky="true"
  @init="mescrollInit"
  @down="downCallback"
  :up="upOption"
  @up="upCallback"
  @emptyclick="emptyclickHandle"
>
<xh-navbar
  navbarImageMode="widthFix"
  :leftImage="imgUrl+'/static/images/left_back.png'"
  :navberColor="isShowNavColor ? '#fff' : ''"
  :overFlow="true"
  titleAlign="titleRight"

  @leftCallBack="$leftBack"
  :fixedNum="9"
>
  <view slot="title" class="dis_title">
    <view class="dis_address" @click="goToCityPageHandle">{{city_name}}</view>
  </view>
</xh-navbar>
<view v-if="shopLightKudi" class="light_bg" @click="closeLightHandle"></view>
<view class="dis_top">
  <view class="top_title box_fl_end">
    <view class="top_title-txt">在线点，到店取</view>
    <view class="top_right-icon"></view>
  </view>
  <view class="top_nav fl_bet">
    <view :class="['nav_item', (item.type == 5 && shopLightKudi)? 'active' : '']"
      v-for="(item, index) in navItemList" :key="index"
      @click="navItemHandle(item)"
    >
        <view class="lightShowIcon_box" v-if="item.type == 5 && shopLightKudi">
          <view class="light_box"></view>
					<view class="light_txt light_txt-right">
						<image src="https://file.y1b.cn/store/1-0/24428/662e1309859ab.png"
							class="light_img-left" mode="widthFix"
						></image>
						<image src="https://file.y1b.cn/store/1-0/24428/662e13b0c4e50.png"
							class="light_img-right"  mode="widthFix"
						></image>
						{{ lightConfigObj.content }}
					</view>
				</view>
      <image class="nav_item-img" :src="item.icon" mode="aspectFill"></image>
      <view class="nav_item-txt">{{item.label}}</view>
    </view>
  </view>
</view>
<view class="cont" :class="{'active': nearStoreList.length}">
  <view class="cont_title sticky-tabs fl_bet"
    :style="{top:stickyTop +'px'}"
    :class="{'bg_active': isStickyTop}"
    id="contTitle"
  >
    <view>附近门店</view>
    <image class="cont_title-img" :src="contTitleImg"  mode="aspectFill"></image>
  </view>
  <view v-if="!nearStoreList.length && isLoading">
    <view class="cont_item cont_empty" v-for="(item, index) in 2" :key="index">
		<view class="item_add">
			<view class="add_cont fl_bet">
				<!-- <image class="item_add-icon box_gray"></image> -->
				<view class="item_add-text box_gray"></view>
			</view>
			<view class="add_cont-rem box_gray"></view>
			</view>
			<view class="item_list-box fl_bet">
			<view class="item_list" v-for="(itemDel, idx) in 3" :key="idx" >
				<view class="item_list-img box_gray"></view>
				<view class="item_list-txt box_gray"></view>
				<view class="price_num box_gray"></view>
				<view class="spare_num box_gray"></view>
			</view>
		</view>
	</view>
  </view>
  <block v-else>
    <view class="cont_item"
      v-for="(item, index) in nearStoreList" :key="index"
      @click="nearStoreHandle(item)"
    >
      <view class="item_add">
        <view class="add_cont fl_bet">
          <view class="add_cont-shop txt_ov_ell1">
            <view class="box_fl">
              <!-- <image class="item_add-icon" :src="haiWeiCon(item.brand_id, 'icon')"  mode="aspectFill"></image> -->
              <view class="item_add-text txt_ov_ell1">
                {{ haiWeiCon(item.brand_id, 'title') }} {{item.restaurant_name || item.storeName}}
              </view>
            </view>
          </view>
          <view class="add_cont-dis" v-if="item.distance">{{ formatDistance(item.distance) }}</view>
        </view>
        <view class="add_cont-rem txt_ov_ell1">{{item.restaurant_address || item.address}}</view>
      </view>
      <!-- 门店升级/门店打烊的添加 -->
      <view class="upgrade_box" v-if="item.upgrade">
        <image class="upgrade_icon" :src="upgrade.icon" mode="widthFix"></image>
        <view class="upgrade_txt">{{ upgrade.text }}</view>
      </view>
      <!-- 列表的数组为空 -->
      <view class="upgrade_box" v-else-if="!item.detail.length">
        <image class="upgrade_icon" :src="empty.icon" mode="widthFix"></image>
        <view class="upgrade_txt">{{ empty.text }}</view>
      </view>
      <!-- 门店的商品列表 -->
      <view class="item_list-box" v-else>
        <view class="item_list"
          v-for="(itemDel, idx) in item.detail" :key="idx"
          @click.stop="itemDelHandle(item, itemDel)"
        >
          <view class="item_list-img fl_center">
            <image class="widHei" :src="itemDel.product_img || itemDel.productImageUrl"  mode="heightFix"></image>
          </view>
          <view class="item_list-txt txt_ov_ell1">{{itemDel.product_name || itemDel.productName}}</view>
          <view class="price_num">
            <text style="font-size: 26rpx">¥</text>
            {{itemDel.user_price || itemDel.price}}
            <text class="price_num-old">¥{{itemDel.product_price || itemDel.originalPrice}}</text>
          </view>
          <view class="spare_num">
            已省¥{{ formatProducePrice(item.brand_id, itemDel) }}
          </view>
        </view>
      </view>
    </view>
  </block>
</view>
</mescroll-body>
<!-- 导航栏 -->
<!-- <custom-tab-bar currentIndex="1"/> -->
<!-- 配置的弹窗管理 -->
<configurationDia
  ref="configurationDia"
  :isShow="isShowConfig"
  @close="closeShowConfig"
  :config="config"
  @popoverRember="requestPopoverRember"
  :remainTime="remainTime"
></configurationDia>
<privacyOpen ref="privacyOpen"></privacyOpen>
<!-- 优惠推荐商品的弹窗 -->
<recommendDia ref="recommendDia"></recommendDia>
<!-- 商品专题的半屏组件 -->
<specialLisMiniPage
  ref="specialLisMiniPage"
  @notEnoughCredits="notEnoughCreditsHandle"
  @specialLisShare="specialLisShareHandle"
  @isBannerClick="goodListBannerHandle"
></specialLisMiniPage>
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
</view>
</template>
<script>
import {
hwHome,
jumpLink,
lightConfig,
location,
nearStore
} from '@/api/modules/discounts.js';
import configurationFun from '@/components/configurationDia/configurationFun.js';
import configurationDia from '@/components/configurationDia/index.vue';
import customTabBar from '@/components/customTabBar/index.vue';
import exchangeFailed from "@/components/serviceCredits/exchangeFailed.vue";
import serviceCredits from "@/components/serviceCredits/index.vue";
import serviceCreditsFun from "@/components/serviceCredits/serviceCreditsFun.js";
import specialLisMiniPage from "@/components/specialLisMiniPage.vue";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { getImgUrl } from '@/utils/auth.js';
import { getUserLocation } from '@/utils/getUserLocation.js';
import getViewPort from '@/utils/getViewPort.js';
import { formatDistance } from '@/utils/index.js';
import shareMixin from '@/utils/mixin/shareMixin.js'; // 混入分享的混合方法
import { mapGetters, mapMutations } from 'vuex';
import { haiWeiObj, navItemList } from './static/config'; // 混入分享的混合方法

export default {
  mixins: [MescrollMixin, configurationFun, shareMixin, serviceCreditsFun], // 使用mixin
  components: {
    customTabBar,
    configurationDia,
    specialLisMiniPage,
    exchangeFailed,
    serviceCredits
  },
  data() {
    return {
      mescroll: null,
      upOption: {
        empty: {
          tip: '暂无门店，敬请期待',
          icon: 'https://file.y1b.cn/store/1-0/2389/64d352c3c15a1.png',
          class: 'update_btn'
        },
        noMoreSize: 3,
        page: {
          size : 3
        },
      },
      empty:{
        text: '门店已打烊',
        icon: 'https://file.y1b.cn/store/1-0/2389/64d352c3c15a1.png'
      },
      upgrade: {
        text: '品牌升级中',
        icon: 'https://file.y1b.cn/store/1-0/23828/64ec1a5c7f258.png'
      },
			imgUrl: getImgUrl(),
      location_city: '',
      navItemList,
      haiWeiObj,
      isShowNavColor: false,
      jumpObject: {},
      lng: 0,
      lat: 0,
      nearStoreList: [],
      isStickyTop: false,
      topValue: 0,
      contTitleImg: '',
      isLoading: true,
      isFirstUpdate: true, // 是否第一次的加载
      firstShow: true,
      show_kudi: 0,
      lightConfigObj: {}
    }
  },
  watch: {
    city_name(newValue, oldValue){
      if(newValue == oldValue  || !newValue || !oldValue) return;
      this.nearStoreList = [];
      this.mescroll.resetUpScroll();
      setTimeout(() => {
        this.mescroll.scrollTo(0); // 执行回到顶部
      }, 300)
    },
  },
  computed: {
    ...mapGetters(['userInfo', 'city_name', 'province_name', 'city_lon', 'city_lat', 'isAutoLogin']),
    // 吸顶的的top值
    stickyTop() {
      let viewPort = getViewPort();
      this.initWarpRect('contTitle').then(res =>  this.topValue = (res.top - viewPort.navHeight));
      return viewPort.navHeight;
    },
    shopLightKudi() {
      return this.lightConfigObj && this.lightConfigObj.contents;
    }
  },
  async onLoad(options) {
    let kudiLight = this.$storageRead('kudiLight');
    if(options.show_kudi || !kudiLight) {
      this.show_kudi = options.show_kudi;
      const res = await lightConfig();
      if(!res.code) return;
      this.lightConfigObj = res.data;
    }
  },
  async onShow() {
    this.$refs.privacyOpen.LifetimesShow();
    // 监听返回授权后的定位使用
    if(!this.lng && !this.lat && !this.firstShow){
      this.mescroll.resetUpScroll();
      return;
    }
    this.firstShow = false;
    setTimeout(() => {
      this.handleTouchInput();
    }, 1000);
  },
  methods: {
    ...mapMutations({
      setCityName: 'cart/setCityName',
      setProvinceName: 'cart/setProvinceName',
    }),
    formatDistance,
    closeLightHandle() {
      this.lightConfigObj = null;
      this.show_kudi = 0;
      this.$storageSave('kudiLight', 1)
    },
    haiWeiCon(brand_id, name) {
      return this.haiWeiObj[brand_id][name];
    },
    // 列表广告位 - 跳转至半屏推券
    goodListBannerHandle(item) {
      this.$refs.recommendDia.initGtData({
        ...item,
        interval_time: item.type_sid
      });
    },
    // 分享的文案获取
    specialLisShareHandle({ share_word, share_img }) {
      this.currentSharePageObj.btnShareObj = {
        share_title: share_word,
        share_img
      }
    },
    // 牛金豆不足，打开弹窗
    notEnoughCreditsHandle() {
      this.exchangeFailedShow = true;
    },
    handleTouchInput() {
      if (wx.requirePrivacyAuthorize) {
        wx.requirePrivacyAuthorize();
      }
    },
    formatProducePrice(brand_id, item) {
      const {
        product_price,
        user_price,
        originalPrice,
        price
      } = item;
      // 肯德基
      if([97, 99].includes(brand_id)) {
        return (originalPrice - price).toFixed(2);
      }
      return (product_price - user_price).toFixed(2);
    },
    nearStoreHandle(item) {
        if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
        const { brand_id, restaurant_id, storeCode, upgrade, detail, code } = item;
        if(upgrade || !detail.length) return; // 门店升级及打烊
        const path = this.haiWeiObj[brand_id].path;
        this.$go(`${path}&restaurant_id=${restaurant_id || 0}&storeCode=${storeCode || code || 0}`);
    },
    itemDelHandle(item, itemDel) {
        if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
        const { brand_id, restaurant_id, storeCode, upgrade, code } = item;
        if(upgrade) return; // 门店升级
        const { product_id, productId } = itemDel;
        const path = this.haiWeiObj[brand_id].path;
        this.$go(`${path}&restaurant_id=${restaurant_id || 0}&storeCode=${storeCode || code || 0}&product_id=${product_id || productId}`);
    },
    onPageScroll(event){
      if(this.shopLightKudi) this.closeLightHandle();
      const scrollTop = Math.ceil(event.scrollTop)
      if(scrollTop > 0) {
        this.isShowNavColor = true;
      } else {
        this.isShowNavColor = false;
      }
      if(scrollTop > this.topValue) {
        this.isStickyTop = true;
      } else {
        this.isStickyTop = false;
      }
    },
    navItemHandle(item) {
      if(this.shopLightKudi) this.closeLightHandle();
      if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
      const { type } = item;
      switch(type) {
        case 1:
          const luckinPath = this.haiWeiObj[13].path;
          this.$go(luckinPath);
          break;
        case 2:
          const mcDonaldPath = this.haiWeiObj[5].path;
          this.$go(mcDonaldPath);
          break;
        case 3:
          // KFC
          const kfcPath = this.haiWeiObj[97].path;
          this.$go(kfcPath);
          // this.jumpLinkHandle({type: 2});
          break;
        case 4:
          // STARBUCKS
          const starbucksPath = this.haiWeiObj[99].path;
          this.$go(starbucksPath);
          //   this.jumpLinkHandle({type: 3});
          break;
        case 5:
          // 电影
          // this.jumpLinkHandle({type: 1});
          // 库迪咖啡
          this.$go(`plugin://jtkDc/kudiindex?pub_id=27729&sid=ttxl&channel=${this.userInfo.id}`);
          break;
        default:
          this.hwHomeRequest(item);
          break;
      }
    },
    async hwHomeRequest(item){
      const { brand_id, bgColor } = item;
      const res = await hwHome({brand_id});
      if(res.code != 1) return this.$toast(res.msg);
      const link = encodeURIComponent(res.data);
      this.$go(`/pages/webview/webview?link=${link}&bgColor=${bgColor || ''}`);
    },
    goToCityPageHandle() {
        if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
        this.$go(`/pages/tabAbout/cityPage/index?currentBrand_id=99`);
    },
    jumpLinkHandle(jumpObject) {
      this.jumpObject = jumpObject;
      this.jumpLinkRequest();
    },
    jumpLinkRequest() {
      const {type, page, id, status} = this.jumpObject;
      // 1-电影票 2-肯德基 3-星巴克
      const params = {
        type,
        page: page || 'home',
        status: status || 1,
        lng: this.lng,
        lat: this.lat
      }
      let bgColor ='#F84842';
      switch(type) {
        case 1:
          params.movieId = id;
          bgColor ='#FCDB28';
          break;
        case 2:
          bgColor ='#c3102f';
          break;
        case 3:
          bgColor ='#006442';
          break;
      }
      jumpLink(params).then(res => {
        const link = res.data.url;
        uni.navigateTo({
          url: `/pages/webview/webview?link=${encodeURIComponent(link)}&bgColor=${bgColor}`
        });
      });
    },
    initWarpRect(id) {
			return new Promise(resolve => {
				setTimeout(() => { // 延时确保dom已渲染, 不使用$nextclick
					let query = uni.createSelectorQuery();
					// #ifndef MP-ALIPAY
					query = query.in(this) // 支付宝小程序不支持in(this),而字节跳动小程序必须写in(this), 否则都取不到值
					// #endif
					query.select('#' + (id || this.viewId)).boundingClientRect(data => {
						resolve(data)
					}).exec();
				}, 20)
			})
		},
    async downCallback() {
      this.mescroll.resetUpScroll();
    },
    async updateCity() {
      if(!this.province_name || !this.location_city){
        const resInfo = await location({ lng: this.lng, lat: this.lat });
        if(resInfo.code != 1) return;
        const { cityInfo} = resInfo.data;
        this.location_city = cityInfo.city;
        if(!this.province_name || !this.city_name) {
          this.setCityName(this.location_city);
          this.setProvinceName(cityInfo.province);
        }
      }
    },
    emptyclickHandle() {
      // 内容为空时的加载 - 重新加载
      this.mescroll.resetUpScroll();
    },
    async upCallback(page) {
      this.isLoading = true;
      if((!this.lng && !this.lat) || page.num == 1) {
        let locRes = await getUserLocation(false, false).catch(error => {
          this.isLoading = false;
          this.mescroll.optUp.empty.tip = "网络开小差，请稍后重试";
          this.mescroll.optUp.empty.btnText = "刷新";
          return;
        });
        if(!locRes) return this.mescroll.endSuccess(0, false);
        this.lng = locRes.data.longitude;
        this.lat = locRes.data.latitude;
      }
      await this.updateCity();
      const params = {
        province_name: this.province_name,
        city_name: this.city_name,
        lng: this.city_lon || this.lng,
        lat: this.city_lat || this.lat,
        location_city: this.location_city,
        page: page.num,
        size: page.size,
        kfc: 1,
        starbucks: 1
      };
      this.requestNearStore(page, params);
    },
    // 拒绝隐私授权
    rejectPrivacyHandle() {
      this.$switchTab('/pages/tabBar/shopMall/index');
    },
    async agreePrivacyHandle() {
      let locRes = await getUserLocation(false, false).catch(error => {
        // this.mescroll.resetUpScroll();
        this.isLoading = false;
        this.mescroll.optUp.empty.tip = "网络开小差，请稍后重试";
        this.mescroll.optUp.empty.btnText = "刷新";
        return this.mescroll.endSuccess(0, false);
      });
      if(!locRes) return this.mescroll.endSuccess(0, false);
      this.lng = locRes.data.longitude;
      this.lat = locRes.data.latitude;
      this.mescroll.resetUpScroll();
    },
    requestNearStore(page, params) {
      nearStore(params).then(res => {
        if(page.num == 1) {
          this.nearStoreList = [];
          this.mescroll.scrollTo(0); // 执行回到顶部
        };
        if(res.code == 1) {
          const { list, total_count, result } = res.data;
          this.nearStoreList = this.nearStoreList.concat(list);
          if(!this.contTitleImg && result) {
            this.contTitleImg = result.image;
          }
          this.mescroll.endByPage(list.length, total_count);
          return;
        }
        this.mescroll.endSuccess(this.nearStoreList.length);
      }).catch(() => {
        this.mescroll.endErr();
      }).finally(() => {
        this.isLoading = false;
      });
    }
  }
}
</script>
<style scoped lang="scss">
.cont_bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  /* 兼容 IOS<11.2 */
  padding-bottom: env(safe-area-inset-bottom);
  /* 兼容 IOS>11.2 */
}
.light_bg::before {
  content: '\3000';
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba($color: #000, $alpha: 0.75);
  border-radius: 0;
  z-index: 10;
}
.discounts {
  position: relative;
  z-index: 0;
  background: #F7F7F7;
  overflow: hidden;
  &::before {
    content: '\3000';
    background: url("https://file.y1b.cn/store/1-0/23810/64d4799614f51.png") 0 0 / cover;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 532rpx;
    z-index: 0;
  }
}
.nav_bg {
  width: 100%;
  height: 532rpx;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
}
.dis_title {
  // position: absolute;
  // left: 24rpx;
  // top: 50%;
  // transform: translateY(-50%);
  display: flex;
  align-items: center;
  flex: 1;
  padding-left: 10px;
  &::before {
    content: "\3000";
    background: url("https://file.y1b.cn/store/1-0/2368/64818bb99173b.png") 0 0 / 100% 100% no-repeat;
    width: 120rpx;
    height: 48rpx;
    display: inline-block;
  }
}
.dis_logo {
  width: 120rpx;
  height: 48rpx;
}
.dis_address {
  font-size: 28rpx;
  font-weight: 500;
  text-align: left;
  color: #666666;
  line-height: 40rpx;
  margin-left: 32rpx;
  align-self: flex-end;
  position: relative;
  &::after{
    content: '\3000';
    position: absolute;
    top: 50%;
    right: -26rpx;
    transform: translateY(-50%);
    margin-top: 5rpx;
    width: 0;
    height: 0;
    /*其它3边设置相同颜色，*/
    border-top: 10rpx solid;
    border-bottom: 10rpx solid transparent;
    border-left: 10rpx solid transparent;
    border-right: 10rpx solid transparent;
    border-radius: 5rpx;
  }
}
.dis_top {
  width: 100%;
  margin-top: 32rpx;
  position: relative;

  // &::before {
  //   content: "\3000";
  //   background: url("https://file.y1b.cn/store/1-0/231019/65309b586edb6.png") 0 0 / 100% 100% no-repeat;
  //   position: absolute;
  //   top: -54rpx;
  //   right: 0;
  //   width: 232rpx;
  //   height: 200rpx;
  //   z-index: 1;
  // }
  .top_title{
    width: 70vw;
    font-size: 0;
    color: #666666;
    background: #fff3eb;
    border-radius: 32rpx 64rpx 0 0;
    padding: 31rpx 24rpx 71rpx 30rpx;
    position: relative;
    z-index: 0;
    .top_right-icon{
      background: url("https://file.y1b.cn/store/1-0/231019/65309b586edb6.png") 0 0 / 100% 100% no-repeat;
      position: absolute;
      top: -54rpx;
      right: -23vw;
      width: 232rpx;
      height: 200rpx;
      z-index: 1;
    }
    &::after {
      content: '\3000';
      position: absolute;
      left: 24rpx;
      width: 6rpx;
      height: 32rpx;
      background: #f84842;
    }
    &::before {
      content: "\3000";
      background: url("https://file.y1b.cn/store/1-0/231019/65309b88db783.png") 0 0 / 100% 100% no-repeat;
      width: 212rpx;
      height: 34rpx;
      margin: 0 14rpx;
      display: inline-block;
    }
    .top_title-img{
      width: 212rpx;
      height: 34rpx;
      margin: 0 14rpx;
    }
    .top_title-txt{
      font-size: 26rpx;
      font-weight: 600;
      line-height: 1;
    }
  }
  .top_nav{
    width: 100%;
    background: #fff9f4;
    padding: 8rpx 4rpx 72rpx;
    box-sizing: border-box;
    position: relative;
    // z-index: 1;
    flex-wrap: wrap;
    margin-top: -40rpx;
    .nav_item {
      width: 20%;
      flex-shrink: 20%;
      position: relative;
      &.active {
        z-index: 99;
      }
      .nav_item-img{
        width: 108rpx;
        height: 108rpx;
        display: block;
        margin: 26rpx auto 10rpx;
      }
      .nav_item-txt{
        font-size: 26rpx;
        text-align: center;
        color: #333333;
        line-height: 36rpx;
      }
    }
  }
  .dis_top-img {
    width: 700rpx;
    height: 264rpx;
  }
  .dis_top-btn {
    width: 240rpx;
    line-height: 60rpx;
    background: #efefef;
    border-radius: 20rpx;
    text-align: center;
    position: absolute;
    color: #fff;
    left: 50%;
    transform: translateX(-50%);
    bottom: 35rpx;
    opacity: 1;
  }
}
.loading_box{
  width: 100vw;
  height: 100vh;
  position: fixed;
  background:transparent;
  z-index: 9;
  .add_cont-load{
    background: #333;
    padding: 50rpx 70rpx;
    color: #fff;
    border-radius: 20rpx;

  }
}
.cont {
  position: relative;
  margin-top: -40rpx;
  z-index: 1;
  &::before {
    content: '\3000';
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 10vh;
    background: linear-gradient(180deg,#ffffff, rgba(255,255,255,0.30) 87%);
    border-radius: 40rpx 40rpx 0 0;
  }
  &.active::before {
    height: 70vh;
    background: linear-gradient(180deg,#ffffff, rgba(255,255,255,0.30) 17%);
  }

  .cont_title{
    padding: 0 34rpx 0 24rpx;
    font-size: 32rpx;
    font-weight: 600;
    text-align: left;
    color: #333333;
    &.bg_active{
      background: #fff;
    }
  }
  .cont_title-img {
    width: 152rpx;
    height: 90rpx;
  }
}
.sticky-tabs{
  position: sticky;
}
.cont_item{
  margin: 0 24rpx 24rpx;
  background: #ffffff;
  border-radius: 24rpx;
  padding: 24rpx;
  .item_add {
    .add_cont-shop{
      font-size: 30rpx;
      font-weight: 500;
      color: #333333;
      line-height: 42rpx;
    }
    .add_cont-dis {
      font-size: 26rpx;
      color: #333333;
      line-height: 36rpx;
      margin-left: 10rpx;
    }
    .add_cont-rem {
      height: 36rpx;
      font-size: 26rpx;
      color: #999;
      line-height: 36rpx;
    }
  }
  .item_add-icon {
    width: 36rpx;
    height: 36rpx;
    margin-right: 8rpx;
    flex-shrink: 0;
  }
  .item_add-text {
    font-size: 30rpx;
    font-weight: 500;
    color: #333333;
    line-height: 42rpx;
  }
  .item_list-box {
    margin-top: 32rpx;
    display: flex;
    .item_list{
      width: 202rpx;
      &:not(:last-child) {
        margin-right: 24rpx;
      }
      .item_list-txt{
        width: 100%;
        margin-top: 16rpx;
        font-size: 28rpx;
        color: #333333;
        line-height: 40rpx;
      }
    }
  }
  .item_list-img{
    width: 202rpx;
    height: 152rpx;
    border: 2rpx solid #e9e9e9;
    border-radius: 16rpx;
    overflow: hidden;
  }
  .price_num{
    font-size: 32rpx;
    font-weight: 600;
    line-height: 34rpx;
    height: 34rpx;
    margin-top: 4rpx;
    color: #F84842;
    .price_num-old{
      text-decoration:line-through;
      font-size: 26rpx;
      font-weight: 400;
      text-align: left;
      color: #aaaaaa;
      line-height: 36rpx;
      margin-left: 16rpx;
    }
  }
  .spare_num {
    width: 112rpx;
    text-align: center;
    line-height: 32rpx;
    white-space: nowrap;
    width: 128rpx;
    height: 32rpx;
    border: 2rpx solid #F84842;
    border-radius: 8rpx;
    font-size: 22rpx;
    color: #F84842;
    margin-top: 8rpx;
  }
}
.cont_item-box {
  display: inline-flex;
  margin-top: 24rpx;
}


.cont_module {
  padding: 32rpx 26rpx 0;
  margin-bottom: 32rpx;
  .module_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .module_title-left {
      font-size: 36rpx;
      font-weight: 500;
      color: #333333;
      line-height: 50rpx;
      display: flex;
      align-items: center;
    }
    .module_right {
      height: 36rpx;
      font-size: 26rpx;
      font-weight: 400;
      color: #666666;
      line-height: 36rpx;
      .van_icon {
        margin-left: 6rpx;
      }
    }
  }
  .hot_img-icon {
    width: 36rpx;
    height: 36rpx;
    margin-right: 10rpx;
  }
  .kfc_img-icon {
    width: 280rpx;
    height: 48rpx;
  }
  .starbucks_img-icon {
    width: 346rpx;
    height: 48rpx;
  }
  .item_hot {
    width: 200rpx;
    &:not(:last-child) {
      margin-right: 20rpx;
    }
    .item_top {
      width: 200rpx;
      height: 281rpx;
      background: #ffffff;
      border-radius: 18rpx;
      position: relative;
      z-index: 0;
      // overflow: hidden;
      .item_img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        background: #999;
        border-radius: 18rpx;
      }
      .item_star {
        width: 74rpx;
        height: 32rpx;
        background: rgba(255,255,255,0.18);
        border-radius: 6rpx;
        backdrop-filter: blur(4rpx);
        font-size: 24rpx;
        font-weight: 600;
        color: #f2cb51;
        line-height: 34rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 12rpx;
        left: 10rpx;
        .icon_star {
          width: 20rpx;
          height: 20rpx;
          margin-right: 6rpx;
        }
      }
      .item_text-bg{
        width: 100%;
        height: 76rpx;
        position: absolute;
        bottom: 0;
        background: linear-gradient(180deg,rgba(0,0,0,0.00), rgba(0,0,0,0.60));
        // background:#ccc;
        border-radius: 0rpx 0rpx 18rpx 18rpx;
      }
      .item_top-text {
        width: 100%;
        position: absolute;
        bottom: 12rpx;
        padding: 0 12rpx;
        left: 0;
        font-size: 24rpx;
        font-weight: 400;
        text-align: left;
        color: #ffffff;
        line-height: 34rpx;
        box-sizing: border-box;
      }
      .box_shadow {
        width: 228rpx;
        height: 76rpx;
        position: absolute;
        bottom: 0;
        left: 50%;
        z-index: -1;
        transform: translate(-50%, 50%);
      }
    }
    .title_txt {
      width: 100%;
      font-size: 28rpx;
      font-weight: 500;
      text-align: center;
      color: #333333;
      line-height: 40rpx;
      margin-top: 20rpx;
    }
    .item_btn{
      width: 188rpx;
      height: 106rpx;
      position: relative;
      z-index: 0;
      margin-top: -20rpx;
      .item_btn-txt {
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 12rpx;
        font-size: 26rpx;
        font-weight: 500;
        text-align: center;
        color: #ffffff;
        line-height: 52rpx;
      }
    }
  }
}
.scrollHeight {
  width: 694rpx;
  height: 462rpx;
}
.cont_scroll {
  margin-top: 66rpx;
  padding: 0 22rpx;
  display: inline-flex;
}
.cont_kfc {
  background: #C3102F;
  border: 4rpx solid #C3102F;
  padding: 4rpx;
  .cont_top {
    color: rgba(255,255,255,0.60);
    .active {
      color: #c9813d;
      .light_txt {
        color:#F84842;
      }
    }
  }
  .buy_btn{
    background: #c3102f;
  }
}
.cont_star {
  background: #006442;
  border: 4rpx solid #006442;
  padding: 4rpx;
  .cont_top {
    color: #FFFFFF;
    .active {
      color: #333333;
      .small_icon {
        opacity: 1;
      }
      .light_txt {
        color:#F84842;
      }
    }
  }
  .buy_btn{
    background: #006442;
  }
}
.cont_box {
  width: 100%;
  height: 562rpx;
  border-radius: 32rpx;
  position: relative;
  z-index: 0;
  box-sizing: border-box;
  margin-top: 24rpx;
  .cont_box_bg {
    padding: 4rpx;
    border-radius: 32rpx;
    overflow: hidden;
    box-sizing: border-box;
  }
  .cont_top {
    justify-content: space-around;
    font-weight: 600;
    text-align: left;
    line-height: 50rpx;
    font-size: 30rpx;
    margin-top: 16rpx;
    >view {
      opacity: .75;
      &.active {
        opacity: 1;
      }
    }
    .small_icon {
      width: 46rpx;
      height: 42rpx;
      margin-right: 6rpx;
    }
  }
  .box_item {
    width: 226rpx;
    position: relative;
    z-index: 0;
    box-sizing: border-box;
    &:not(:last-child){
      margin-right: 18rpx;
    }
    .bg_img {
      height: 346rpx;
      top: auto;
      bottom: 0;
    }
    &.kfc_item {
      .shop_src::before {
        background: #E9E1E1;
      }
    }
    .shop_src {
      width: 144rpx;
      height: 144rpx;
      margin: auto;
      display: block;
      position: relative;
      z-index: 0;
      .shop_src-img {
        width: 100%;
        height: 100%;
        background: #d8d8d8;
        box-shadow: 4rpx 4rpx 4rpx 0rpx rgba(0,0,0,0.06);
        border-radius: 16rpx;
      }
      &::before {
        content: '\3000';
        width: 148rpx;
        height: 148rpx;
        background: #E7EEEC;
        border-radius: 8rpx;
        position: absolute;
        top: -11rpx;
        right: -17rpx;
        z-index: -1;
        transform: rotate(10deg);
        border-radius: 16rpx;
        opacity: .7;
      }
    }
    .shop_name {
      height: 72rpx;
      font-size: 26rpx;
      font-weight: 400;
      text-align: center;
      color: #333333;
      line-height: 36rpx;
      padding: 0 22rpx;
      margin: 28rpx auto 32rpx;
    }
    .shop_price {
      height: 32rpx;
      font-size: 22rpx;
      font-weight: 500;
      text-align: center;
      color: #666666;
      line-height: 32rpx;
      .price_txt {
        text-decoration: line-through;
        margin-left: 6rpx;
      }
    }
    .buy_btn {
      height: 56rpx;
      border-radius: 30rpx;
      margin: 14rpx 16rpx 17rpx;
      text-align: center;
      color: #fff;
      font-size: 26rpx;
      font-weight: 500;
      text-align: left;
      color: #ffffff;
      line-height: 36rpx;
      white-space: nowrap;
      >view {
        margin-right: 6rpx;
      }
    }
  }
}
.upgrade_box{
  .upgrade_icon {
    width: 322rpx;
    height: 230rpx;
    margin: 55rpx auto 32rpx;
    display: block;
  }
  .upgrade_txt{
    font-size: 26rpx;
    text-align: center;
    color: #aaaaaa;
    line-height: 36rpx;
  }
}
.lightShowIcon_box {
  position: absolute;
  z-index: -1;
  // top: 50%;
  // left: 50%;
  right: 0rpx;
  bottom: -6rpx;
  // transform: translateX(-50%);
  width: 150rpx;
  height: 150rpx;
  background: #F7F7F7;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.2) inset;
  &::before {
    content: "\3000";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: 50%;
    animation: rippleAnimation 2s ease infinite;
    box-shadow: 0 0 8px rgba(255, 255, 255, 1) inset;
  }
  .light_box {
    width: 2rpx;
    height: 102rpx;
    background: #fff;
    margin: 146rpx auto 0;
    position: relative;
    &::after{
      content: '\3000';
      position: absolute;
      width: 10rpx;
      height: 10rpx;
      background: #fff;
      border-radius: 50%;
      top: -5rpx;
      left: 50%;
      transform: translateX(-50%);
      // z-index: -1;
      border: 4rpx solid #F84842;
    }
  }
  .light_txt {
    position: absolute;
    height: 78rpx;
    line-height: 78rpx;
    font-size: 28rpx;
    text-align: center;
    min-width: 128rpx;
    text-align: center;
    color: rgba(255,255,255,0.90);
    padding: 0 32rpx 0 40rpx;
    border-radius: 39rpx;
    white-space: nowrap;
    z-index: 0;
    border-radius: 36rpx;
    border: 2rpx solid #888;
    &.light_txt-left{
      left: 28rpx;
      &::before {
        transform: scaleX(-1);
      }
    }
    &.light_txt-right {
      right: 26rpx;
    }
    .light_img-left {
      width: 36rpx;
      height: 60rpx;
      position: absolute;
      left: -10rpx;
      bottom: 0;
    }
    .light_img-right{
      width: 40rpx;
      height: 40rpx;
      position: absolute;
      right: -12rpx;
      top: -12rpx;
    }
  }
}
@keyframes rippleAnimation {
	0% {
		transform: scale(1);
		opacity: 1;
	}
	50% {
		transform: scale(1.1);
		opacity: 0.7;
	}
	100% {
		transform: scale(1.2);
		opacity: 0;
	}
}
.cont_item{
  margin: 0 24rpx 24rpx;
  background: #ffffff;
  border-radius: 24rpx;
  padding: 24rpx;
  .item_add {
    .add_cont-shop{
      font-size: 30rpx;
      font-weight: 500;
      color: #333333;
      line-height: 42rpx;
    }
    .add_cont-dis {
      font-size: 26rpx;
      color: #333333;
      line-height: 36rpx;
      margin-left: 10rpx;
    }
    .add_cont-rem{
      height: 36rpx;
      font-size: 26rpx;
      color: #999;
      line-height: 36rpx;
    }
  }
  .item_add-icon{
    width: 36rpx;
    height: 36rpx;
    margin-right: 8rpx;
    flex-shrink: 0;
  }
  .item_add-text{
    font-size: 30rpx;
    font-weight: 500;
    color: #333333;
    line-height: 42rpx;
  }
  .item_list-box{
    margin-top: 32rpx;
    .item_list{
      width: 202rpx;
      .item_list-txt{
        width: 100%;
        margin-top: 16rpx;
        font-size: 28rpx;
        color: #333333;
        line-height: 40rpx;
      }
    }
  }
  .item_list-img{
    width: 202rpx;
    height: 152rpx;
    border: 2rpx solid #e9e9e9;
    border-radius: 16rpx;
    overflow: hidden;
  }
  .price_num{
    font-size: 32rpx;
    font-weight: 600;
    line-height: 34rpx;
    height: 34rpx;
    margin-top: 4rpx;
    color: #F84842;
    .price_num-old{
      text-decoration:line-through;
      font-size: 26rpx;
      font-weight: 400;
      text-align: left;
      color: #aaaaaa;
      line-height: 36rpx;
      margin-left: 16rpx;
    }
  }
  .spare_num {
    width: 112rpx;
    text-align: center;
    line-height: 32rpx;
    white-space: nowrap;
    width: 128rpx;
    height: 32rpx;
    border: 2rpx solid #F84842;
    border-radius: 8rpx;
    font-size: 22rpx;
    color: #F84842;
    margin-top: 8rpx;
  }
}
// 空加载的
.cont_empty{
  .item_add-text{
    flex: 1;
    height: 36rpx;
    margin-bottom: 6rpx;
  }
  .box_gray {
    border-radius: 16rpx;
    border: none;
    background: linear-gradient(270deg,#f6f8fb 80%, #eaeef6);
    animation: backAni 1.5s infinite;
  }
  .item_add-icon{
    border-radius: 4rpx;
  }
}
@keyframes backAni {
  0% {
    background: linear-gradient(270deg,#f6f8fb 80%, #eaeef6);
  }
  50% {
    background: linear-gradient(270deg,#f6f8fb 60%, #eaeef6);
  }
  100% {
    background: linear-gradient(270deg,#f6f8fb 30%, #eaeef6);
  }
}
</style>
