<template>
<view class="kfc">
<mescroll-body
  :sticky="true"
  ref="mescrollRef"
  @init="mescrollInit"
  @down="downCallback"
  @up="upCallback"
  :up="upOption"
  :down="downOption"
>
  <xh-navbar
    :leftImage="imgUrl+'/static/images/left_back.png'"
    titleAlign="titleRight"
    :fixed="true"
    @leftCallBack="topCallBack"
    :fixedNum="9"
    navberColor="#fff"
  >
    <view class="search_box" slot="title">
      <view class="title_left">
        <image class="title_img" src="https://file.y1b.cn/store/1-0/23830/64eed75732a90.png" mode="heightFix"></image>
      </view>
      <image class="search_icon" :src="takeImgUrl+'/search_icon.png'" mode="aspectFill" @click="toSearchHandle"></image>
    </view>
  </xh-navbar>
  <!-- 定位地址 -->
  <view class="address_box" @click="goSelectShopHandle">
    <view class="add_shop fl_bet">
      <view class="add_shop-left fl_ard">
        {{restaurant_name}}
        <image class="icon_right" :src="takeImgUrl+'/_right.png'" mode="aspectFill"></image>
      </view>
      <view class="add_shop-right fl_ard" v-if="distance">
        <image class="icon_add" :src="takeImgUrl+'/_add.png'" mode="aspectFill"></image>
        距您{{ formatDistance(distance) }}
      </view>
    </view>
    <view class="add_txt txt_ov_ell1">{{restaurant_address}}</view>
  </view>
  <!-- 主要内容的盒子 -->
  <view class="add_cont fl" :style="{ height: mescrollHeight }">
    <van-loading
      size="36px" color="#E40030" vertical
      class="add_cont-load"
      v-if="isLoading"
    >加载中...</van-loading>
    <view class="add_cont-left">
      <me-tabs
        v-model="tabIndex"
        :tabs="tabsList"
        @change="changeTabHandel"
        :isShowComBuy="isShowComBuy"
      ></me-tabs>
    </view>
    <view class="add_cont-right">
      <cont-tabs
        v-model="contIndex"
        :tabs="tabsList"
        @selCom="selComHandle"
        @selAddCom="selAddComHandle"
        @selSubCom="selSubComHandle"
        @scroll="scrollConTabHandle"
        :isShowComBuy="isShowComBuy"
      ></cont-tabs>
    </view>
  </view>
</mescroll-body>
<!-- 购物车的 -->
<commodityCart
  ref="commodityCart"
  @updateAmount="updateAmountHandle"
  @clearCart="clearCartHandle"
  @close="isShowComCart=false"
>
</commodityCart>
<!-- 结算的弹窗 -->
<commodityBuy
  :isShow="isShowComBuy"
  @openCart="openCartHandle"
  @toBuy="toBuyHandle"
>
</commodityBuy>

<!-- 弹窗的内容 -->
<commodityDetails
  ref="commodityDetails"
  @imBuy="imBuyHandle"
  @editCart="editCartHandle"
  @showError="showErrorDetails"
>
</commodityDetails>

<!-- 确认删除购物车记录 -->
<confirmDia
  :isShow="isShowDelCartDia"
  remindText="确定清空购物车？"
  @close="isShowDelCartDia = false"
  @confirm="confirmDelCartHandle"
>
</confirmDia>

<!-- 订单 -->
<commodityOrder
  ref="commodityOrder"
  :restaurant_name="restaurant_name"
  :restaurant_address="restaurant_address"
  :lng="shop_longitude"
  :lat="shop_latitude"
  @toPay="toPayBeforeHandle"
  @changeShop="selectShopHandle"
  @cancelPay="cancelPayHandle"
  @payBack="payBackHandle"
>
</commodityOrder>

<!-- 确认门店 -->
<confirmShopDia
  :restaurantName="restaurant_name"
  :distance="distance"
  :isShow="isShowConfirmShopDia"
  @close="isShowConfirmShopDia = false"
  @displace="displaceHandle"
  @confirm="confirmShopHandle"
>
</confirmShopDia>

<confirmDia
  :isShow="isShowShopCloseDia"
  :remindText="shopCloseRemindText"
  confirmText="切换门店"
  cancelText="返回"
  @confirm="goSelectShopHandle"
  @close="topCallBack"
>
</confirmDia>
<!-- 挽留取消支付的弹窗 -->
<continuePay
  :isShow="isShowContinuePay"
  :config="continuePayConfig"
  @close="closeContinuePayHandle"
  @confirm="continuePayHandle"
>
</continuePay>
<privacyOpen ref="privacyOpen"></privacyOpen>
</view>
</template>

<script>
import { cityStores, kfcMenus } from '@/api/modules/takeawayMenu/kfc.js';
import { location } from '@/api/modules/takeawayMenu/luckin.js';
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { getImgUrl } from '@/utils/auth.js';
import { getUserLocation } from '@/utils/getUserLocation.js';
import getViewPort from '@/utils/getViewPort.js';
import { formatDistance } from '@/utils/index.js';
import shareMixin from '@/utils/mixin/shareMixin.js'; // 混入分享的混合方法
import { mapActions, mapGetters, mapMutations } from 'vuex';
import commodityBuy from './content/commodityBuy.vue';
import commodityDetails from './content/commodityDetails.vue';
import commodityOrder from './content/commodityOrder.vue';
import commodityCart from './content/commoditycart.vue';
import confirmDia from './content/confirmDia.vue';
import confirmShopDia from './content/confirmShopDia.vue';
import contTabs from './content/cont-tabs.vue';
import continuePay from './content/continuePay.vue';
import meTabs from './content/me-tabs.vue';
export default {
  mixins: [MescrollMixin, shareMixin], // 使用mixin
  components: {
    meTabs,
    contTabs,
    commodityDetails,
    commodityBuy,
    commodityCart,
    confirmDia,
    commodityOrder,
    confirmShopDia,
    continuePay
  },
  data() {
    return {
			imgUrl: getImgUrl(),
      takeImgUrl: getImgUrl() + '/static/subPackages/userModule/takeawayMenu',
      brandList : [],
      searchHeight: 0,
      isFirstUpdate: true, // 是否第一次的加载
      upOption: {
        textNoMore: '',
        empty: {
          use: false
        }
      },
      downOption: {
        textNoMore: '',
        empty: {
          use: false
        }
        // auto: false // 不自动加载 (mixin已处理第一个tab触发downCallback)
      },
      tabIndex: 0,
      contIndex: 0,
      tabsList: [],
      isLoading: true,
      menuDetailsDate: {},
      isShowComBuy: false,
      isShowComCart: false,
      isShowDelCartDia: false,
      isShowConfirmShopDia: false,
      isShowShopCloseDia: false,
      isShowContinuePay: false,
      continuePayConfig: null,
      shopCloseRemindText: '门店已打烊，选择其他门店看看吧',
      rote: 0,
      restaurant_address: '',
      restaurant_name: '',
      distance: '',
      searchCartNum: 0, // search页面的购物车数量
      shop_latitude: 0,
      shop_longitude: 0,
      lng: 0,
      lat: 0,
      firstShow: true,
      isContinuePay: false, // 是否继续走支付的流程
      location_city: '',
      location_province: '',
      shop_product_id: 0,
      pathSource: '',
      againInit: false, // 再来一单事件 ---进入
      isPayBack: false, // 是否是其他小程序返回的页面进入
      oid: 0, // 订单的id
      isBack: 0, // 是否反回上一页
    }
  },
  computed: {
    ...mapGetters(['cartComList', 'submitList', 'province_name', 'city_name', 'storeCode', 'brand_id', 'isAutoLogin']),
    mescrollHeight() {
      let viewPort = getViewPort();
      let mescrollHeight =  viewPort.windowHeight - viewPort.navHeight - uni.upx2px(142) - uni.upx2px(24);
      return mescrollHeight + 'px';
    }
  },
  watch: {
    storeCode(newValue, oldValue) {
      // 商店变更
      if(!this.isFirstUpdate) {
        this.mescroll.resetUpScroll();
        this.tabIndex = 0;
        this.contIndex = 0;
      }
    },
    cartComList(newValue, oldValue) {
      if(newValue.length) return;
      this.isShowComBuy = false;
    },
    tabsList(newValue) {
      if(!this.shop_product_id) return;
      newValue.forEach((res, index) => {
        const produceIndex = res.products.findIndex(res => (res.productId == this.shop_product_id) || ((res.productId instanceof Array) && res.productId.includes(this.shop_product_id.toString())));
        if(produceIndex >= 0) {
          const item = newValue[index].products[produceIndex];
          this.$refs.commodityDetails.updateIndex(index, produceIndex); // 设置需要更新
          this.$refs.commodityDetails.popupShow(item);
          this.shop_product_id = 0;
        }
      });
    }
  },
  // 页面周期函数--监听页面加载
  async onLoad(option) {
    if(option.brand_id) {
      this.setBrandId(option.brand_id);
    }
    // 选中门店过来
    if(option.storeCode) {
      this.setStoreCode(option.storeCode);
    }
    if(option.rote){
      this.rote = option.rote;
    }
    // 从惠吃喝过来，带商品的ID
    if(option.product_id){
      this.shop_product_id = Number(option.product_id);
    }
    // search页面筛选的商品购物车
    if(option.searchCartNum) {
      this.searchCartNum = option.searchCartNum;
    }
    if(option.pathSource) {
      this.pathSource = option.pathSource;
    }
    // 是否返回上一页的参数
    if(option.isBack) this.isBack = option.isBack;
    // 再来一单
    if(option.again) {
      this.againInit = Boolean(option.again);
      this.setCityName("");
      this.setProvinceName("");
    }
  },
  async onShow() {
    this.$refs.privacyOpen.LifetimesShow();
    if(!this.lng && !this.lat && !this.firstShow){
      this.mescroll.resetUpScroll();
      return;
    }
    // 支付小程序退回后的监听进入
    if(this.isPayBack && this.oid) {
      this.$go( `/pages/userModule/takeawayMenu/kfc/order/index?oid=${this.oid}`);
      this.isPayBack = false;
    }
    this.firstShow = false;
    setTimeout(() => {
      this.handleTouchInput();
    }, 1000);
  },
  methods: {
    ...mapActions({
      requestCarList: 'cart/requestCarList',
      clearCart: 'cart/clearCart',
    }),
    ...mapMutations({
      setBrandId: 'cart/setBrandId',
      setRestaurantId: 'cart/setRestaurantId',
      setStoreCode: 'cart/setStoreCode',
      setCityName: 'cart/setCityName',
      setProvinceName: 'cart/setProvinceName',
      getCartList: 'cart/getCartList'
    }),
    formatDistance,
    handleTouchInput() {
      if (wx.requirePrivacyAuthorize) {
        wx.requirePrivacyAuthorize({
          success: res => {
            console.log('用户同意了隐私协议 或 无需用户同意隐私协议')
          },
          fail: res => {
            console.log('用户拒绝了隐私协议')
          }
        })
      }
    },
    updateAmountHandle(item) {
      const {
        product_id,
        amount
      } = item;
      this.tabsList.forEach(res => {
        res.products.forEach(resItem => {
          const productId = resItem.productId;
          // 对列表中的品与添加的内容进行匹配添加 - 如可选多个类目时，进行数组的匹配
          if(productId == product_id || ((productId instanceof Array) && productId.includes(product_id.toString()))) {
            resItem.car_num = resItem.car_num + amount;
          }
        });
      });
    },
    async upCallback(page) {
      if(!this.lng && !this.lat) {
        const locRes = await getUserLocation();
        this.lng = locRes.data.longitude;
        this.lat = locRes.data.latitude;
      }
      let lng = this.lng;
      let lat = this.lat;
      if(!this.location_province || !this.location_city) {
        const resInfo = await location({ lng, lat });
        if(resInfo.code != 1) return;
        const { cityInfo } = resInfo.data;
        this.location_city = cityInfo.city;
        this.location_province = cityInfo.province;
      }
      const params = {
        storeCode: this.storeCode,
        lng,
        lat,
        city_name: this.city_name || this.location_city,
        rote: this.rote,
        location_city: this.location_city,
      };
      const res = await cityStores(params);
      if(res.code != 1) {
        this.isLoading = false;
        // 列表无数据 - 展示门店已打烊
        this.isShowShopCloseDia = true;
        this.shopCloseRemindText = '当前门店已打烊';
        this.isFirstUpdate = false;
        this.mescroll.endSuccess(0, false);
        return;
      };
      // 请求门店及地址
      const {
        address,
        storeName,
        distance,
        storeCode
      } = res.data;
      this.restaurant_address = address;
      this.restaurant_name = storeName;
      this.distance = distance;
      this.shop_latitude = res.data.lat;
      this.shop_longitude = res.data.lon;
      // 不存在餐厅id时
      if(!this.storeCode) {
        this.setStoreCode(storeCode); // 门店id
      }
      // 请求列表
      kfcMenus({ storeCode: this.storeCode }).then(res => {
        this.mescroll.endSuccess(0, false);
        if(res.code == 1 && res.data) {
          this.tabsList = res.data.lists;
          if(this.searchCartNum) {
            this.$refs.commodityCart.updateCarList();
            this.isShowComBuy = true;
            this.searchCartNum = 0;
          } else {
            this.initCartList(); // 初始化购物车
          }
          this.isLoading = false;
          return;
        }
        this.isLoading = false;
        // 列表无数据 - 展示门店已打烊
        this.isShowShopCloseDia = true;
        this.shopCloseRemindText = '当前门店已打烊';
      }).catch(() => {
        this.mescroll.endErr();
        this.isLoading = false;
      }).finally(() => {
        this.isFirstUpdate = false;
      });
    },
    showErrorDetails() {
      this.isShowShopCloseDia = true;
      this.shopCloseRemindText = '门店已打烊，选择其他门店看看吧';
    },
    async initCartList() {
      // 初始化购物车， 有则打开buy的弹窗
      const res = await this.requestCarList();
      if(res.data && res.data.length) {
        this.isShowComBuy = true;
        // 再来一单进， 打开购物车
        if(this.againInit) {
          this.$refs.commodityCart.popupShow();
          this.againInit = false;
        }
      }
    },
    // 内容滚动监听
    scrollConTabHandle(value) {
      this.tabIndex = value;
    },
    changeTabHandel(value) {
      this.contIndex = value;
      this.tabIndex = value;
    },
    openCartHandle(){
      this.isShowComCart = !this.isShowComCart;
      if(this.isShowComCart) {
        this.$refs.commodityCart.updateCarList(); // 购物车的初始化接口访问
        return;
      }
      this.$refs.commodityCart.popupClose();
    },
    toBuyHandle(){
        if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
        // 去结算 - 确认订单
        this.$refs.commodityCart.popupClose();
        this.$refs.commodityOrder.popupShow({
            products: this.submitList,
            isAloneProducts: false, // 是否是单个商品
        });
    },
    clearCartHandle() {
      this.isShowDelCartDia = true;
    },
    async confirmDelCartHandle() {
      // 确定清空购物车
      await this.clearCart();
      this.isShowDelCartDia = false;
      this.$refs.commodityCart.popupClose();
      this.updateTabsList();
    },
    confirmShopHandle(){
      this.isShowConfirmShopDia = false;
      if(!this.isContinuePay) return;
      // 继续走支付的流程 - 创建订单
      this.$refs.commodityOrder.orderCreateRequest();
    },
    changeShopHandle() {
      this.isShowConfirmShopDia = true;
      this.isContinuePay = false;
    },
    // 前支付，打开确定门店的弹窗 - 弹窗继续走支付的流程
    toPayBeforeHandle(){
      this.isShowConfirmShopDia = true;
      this.isContinuePay = true;
    },
    // 取消支付
    cancelPayHandle(config) {
      this.continuePayConfig = config;
      this.isShowContinuePay = true;
    },
    // 继续支付
    continuePayHandle() {
      this.isShowContinuePay = false;
      // 继续走支付的流程 - 直接走支付，不需走创建订单的过程
      setTimeout(()=>{
        this.$refs.commodityOrder.toQzMiniPay();
			}, 300);
    },
    // 关闭弹窗 - 进入订单的详情
    closeContinuePayHandle(oid) {
      this.oid = oid;
      this.isShowContinuePay = false;
      this.$refs.commodityOrder.popupClose();
      this.mescroll.resetUpScroll(); // 对页面数据进行刷新
      this.$go( `/pages/userModule/takeawayMenu/kfc/order/index?oid=${oid}`);
    },
    payBackHandle(oid) {
      this.oid = oid;
      this.isPayBack = true;
      // 支付跳转过小程序后的更新 进行页面的更改
      this.$refs.commodityOrder.popupClose();
      this.mescroll.resetUpScroll(); // 对页面数据进行刷新
    },
    warpRectDom(idName) {
        return new Promise(resolve => {
            setTimeout(() => { // 延时确保dom已渲染, 不使用$nextclick
                let query = uni.createSelectorQuery();
                // #ifndef MP-ALIPAY
                query = query.in(this) // 支付宝小程序不支持in(this),而字节跳动小程序必须写in(this), 否则都取不到值
                    // #endif
                query.select('#'+idName).boundingClientRect(data => {
                    resolve(data)
                }).exec();
            }, 20)
        })
    },
    imBuyHandle(products) {
        if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
        this.$refs.commodityOrder.popupShow({
            products,
            isAloneProducts: true, // 是否是单个商品
        });
    },
    editCartHandle({
      tabIndex,
      ItemIndex,
      currenComNum
    }) {
      this.tabsList[tabIndex].products[ItemIndex].car_num = this.tabsList[tabIndex].products[ItemIndex].car_num + currenComNum;
      this.isShowComBuy = true;
    },
    updateTabsList() {
      this.tabsList.forEach(res =>  res.products.forEach(resItem => resItem.car_num = 0));
    },
    // 选中进入详情
    selComHandle(item,tabIndex, index) {
      this.$refs.commodityDetails.popupShow({
        ...item,
      }, tabIndex, index);
    },
    // 列表直接 - 购物车add添加
    selAddComHandle(item,tabIndex, index) {
      const { productId, car_num } = item;
      const currenComNum = car_num + 1;
      const params = {
        product_id: productId,
        amount: currenComNum
      };
      const editCart = {
        tabIndex,
        index,
        currenComNum: 1
      }
      this.$refs.commodityDetails.editOrderCar(params, editCart);
    },
    // 列表直接 - 购物车sub减少
    selSubComHandle(item,tabIndex, index) {
      const { productId, car_num } = item;
      const currenComNum = car_num - 1;
      const params = {
        product_id: productId,
        amount: currenComNum
      };
      const editCart = {
        tabIndex,
        index,
        currenComNum: -1
      }
      this.$refs.commodityDetails.editOrderCar(params, editCart);
    },
    // 去搜索
    toSearchHandle() {
      this.$go( `/pages/userModule/takeawayMenu/kfc/search`);
    },
    // 直接退回首页
    topCallBack() {
        if(this.isBack) return this.$leftBack();
        if(this.pathSource == 'discounts') return this.$reLaunch('/pages/discounts/discounts/index');
        this.$switchTab(`/pages/tabBar/shopMall/index`);
    },
    displaceHandle(){
      // 确定门店
      this.isShowConfirmShopDia = false;
      this.selectShopHandle();
    },
    selectShopHandle() {
      this.$go(`/pages/userModule/takeawayMenu/kfc/selectShop/index?pathSource=${this.pathSource}`);
    },
    goSelectShopHandle() {
      this.isShowShopCloseDia = false;
      this.$go(`/pages/userModule/takeawayMenu/kfc/selectShop/index?pathSource=${this.pathSource}`);
    },
  }
}
</script>

<style scoped lang="scss">
.kfc {
  background: #F5F5F5;
}
.title_left {
  width: 350rpx;
  height: 44rpx;
  position: relative;
  margin: 8rpx 15rpx 0;
  .title_img{
    width: 100%;
    height: 100%;
  }
}
.search_box{
  display: flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  flex: 1;
  justify-content: space-between;
  .search_icon{
    flex: 0 0 64rpx;
    width: 64rpx;
    height: 64rpx;
    background: #f7f7f7;
    border: 2rpx solid #e3e3e3;
    border-radius: 34rpx;
    padding: 18rpx;
    box-sizing: border-box;
  }
}
.address_box {
  padding: 24rpx;
  color: #333;
  background: #fff;
  .add_shop-left{
    font-size: 28rpx;
    font-weight: 500;
    line-height: 40rpx;
    .icon_right{
      width: 24rpx;
      height: 24rpx;
    }
  }
  .add_shop-right {
    font-size: 26rpx;
    line-height: 36rpx;
    .icon_add {
      width: 20rpx;
      height: 24rpx;
      margin-right: 8rpx;
    }
  }
  .add_txt{
    font-size: 28rpx;
    color: #999;
    line-height: 40rpx;
    margin-top: 14rpx;
  }
}
.address_box{
  >view {
    height: 100%;
  }
}
.add_cont{
  box-sizing: border-box;
  position: relative;
  margin-top: 24rpx;
  .add_cont-load {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.add_cont-left{
  margin-right: 24rpx;
  width: 132rpx;
  flex: 0 0 132rpx;
}
.add_cont-right {
  position: relative;
}

</style>
