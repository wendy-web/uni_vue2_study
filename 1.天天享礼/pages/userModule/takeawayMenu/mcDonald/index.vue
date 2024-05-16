<template>
<view class="mcDonald">
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
        <image class="title_img" src="https://file.y1b.cn/store/1-0/23830/64eed630af080.png" mode="heightFix"></image>
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
      size="36px" color="#FFB800" vertical
      class="add_cont-load"
      v-if="isLoading"
    >加载中...</van-loading>
    <!-- <block v-else> -->
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
    <!-- </block> -->
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
  @noTicket="isShowNoTicket = true"
>
</commodityDetails>

<!-- 确认删除购物车记录 -->
<confirmDia
  :isShow="isShowDelCartDia"
  remindText="确定清空购物车？"
  @close="isShowDelCartDia = false"
  @confirm="confirmDelCartHandle"
></confirmDia>

<!-- 订单 -->
<commodityOrder
  ref="commodityOrder"
  :restaurant_name="restaurant_name"
  :restaurant_address="restaurant_address"
  :lng="shop_longitude"
  :lat="shop_latitude"
  @updateOrder="isUpdateOrderCloseDia = true"
  @updateOrderPrice="isUpdateOrderPriceCloseDia = true"
  @toPay="toPayBeforeHandle"
  @changeShop="selectShopHandle"
  @cancelPay="cancelPayHandle"
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
></confirmShopDia>

<confirmDia
  :isShow="isShowShopCloseDia"
  :remindText="shopCloseRemindText"
  confirmText="切换门店"
  cancelText="返回"
  @confirm="goSelectShopHandle"
  @close="topCallBack"
></confirmDia>

<confirmDia
  :isShow="isUpdateOrderCloseDia"
  remindText="商品信息发生变更，请重新确认商品"
  confirmText="我知道了"
  :isInform="true"
  @confirm="updateOrderHandle"
></confirmDia>

<confirmDia
  :isShow="isUpdateOrderPriceCloseDia"
  remindText="商品价格发生变更，请确认订单价格"
  confirmText="我知道了"
  :isInform="true"
  @confirm="updateOrderPriceHandle"
></confirmDia>
<!-- 挽留取消支付的弹窗 -->
<continuePay
  :isShow="isShowContinuePay"
  :config="continuePayConfig"
  @close="closeContinuePayHandle"
  @confirm="continuePayHandle"
></continuePay>

<!-- 囤券的商品的使用 -->
<confirmDia
  :isShow="isShowNoTicket"
  remindText="该餐品不在点餐时段内"
  confirmText="我知道了"
  :isInform="true"
  @confirm="isShowNoTicket = false"
></confirmDia>
<privacyOpen ref="privacyOpen"></privacyOpen>
</view>
</template>

<script>
import {
location,
menuQuery,
restaurantQuery,
} from '@/api/modules/takeawayMenu/luckin.js';
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
    continuePay,
  },
  data() {
    return {
			imgUrl: getImgUrl(),
      takeImgUrl: getImgUrl() + '/static/subPackages/userModule/takeawayMenu',
      brandList : [],
      searchHeight: 0,
      isFirstUpdate: true, // 是否第一次的加载
      upOption: {
        // use: false, // 主体框架只启用下拉刷新
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
      isSourceOrder: false, // 订单页面去切换地址
      isUpdateOrderCloseDia: false, // 商品信息变更
      isUpdateOrderPriceCloseDia: false,
      location_city: '',
      location_province: '',
      shop_product_id: 0,
      pathSource: '',
      againInit: false, // 再来一单事件 ---进入
      isBack: 0, // 是否反回上一页
      ticket_id: 0, // 是囤券订单id进入
      isShowNoTicket: false, // 囤券进入订单的不可使用
    }
  },
  computed: {
    ...mapGetters(['cartComList', 'brand_id', 'submitList', 'restaurant_id', 'province_name', 'city_name', 'isAutoLogin']),
    mescrollHeight() {
      let viewPort = getViewPort();
      // uni.upx2px(142) 头部地址的内容
      let mescrollHeight =  viewPort.windowHeight - viewPort.navHeight - uni.upx2px(142);
      return mescrollHeight + 'px';
    }
  },
  watch: {
    restaurant_id(newValue, oldValue) {
      if(!this.isFirstUpdate) {
        this.mescroll.resetUpScroll();
        this.tabIndex = 0;
        this.contIndex = 0;
      }
      // 确认订单事件 - 更换门店的id更改
      if(this.isSourceOrder) {
        this.$refs.commodityOrder.updateOrder();
        this.isSourceOrder = false;
      }
    },
    cartComList(newValue, oldValue) {
      if(newValue.length) return;
      this.isShowComBuy = false;
    },
    tabsList(newValue) {
      if(!this.shop_product_id) return;
      newValue.forEach((res, index) => {
        const produceIndex = res.detail.findIndex(res => res.product_id == this.shop_product_id);
        if(produceIndex >= 0) {
          this.$refs.commodityDetails.updateIndex(index, produceIndex); // 设置需要更新
          this.shop_product_id = 0;
          this.ticket_id = 0;
        } else if(this.ticket_id) {
          this.isShowNoTicket = true;
          this.ticket_id = 0;
          this.$refs.commodityDetails.updateTicketStatus(); // 去掉兑换券的内容
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
    if(option.restaurant_id) {
      this.setRestaurantId(option.restaurant_id);
    }
    if(option.rote){
      this.rote = option.rote;
    }
    // 从惠吃喝过来，带商品的ID
    if(option.product_id){
      this.shop_product_id = Number(option.product_id);
      this.ticket_id = Number(option.ticket_id);
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
    if(!this.lng && !this.lat && !this.firstShow) {
      this.mescroll.resetUpScroll();
      return;
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
      setCityName: 'cart/setCityName',
      setProvinceName: 'cart/setProvinceName',
      getCartList: 'cart/getCartList'
    }),
    formatDistance,
    handleTouchInput() {
      if (wx.requirePrivacyAuthorize) {
        wx.requirePrivacyAuthorize();
      }
    },
    updateOrderHandle() {
      this.isUpdateOrderCloseDia = false;
      this.$refs.commodityOrder.popupClose();
    },
    updateOrderPriceHandle() {
      this.isUpdateOrderPriceCloseDia = false;
      // 更新订单的展示
      this.$refs.commodityOrder.updateOrderShow();
    },
    updateAmountHandle(item) {
      const {
        product_id,
        amount
      } = item;
      this.tabsList.forEach(res => {
        res.detail.forEach(resItem => {
          if(resItem.product_id == product_id) {
            resItem.car_num = amount;
          }
        });
      });
    },
    async upCallback(page) {
      if(!this.lng && !this.lat) {
        const locRes = await getUserLocation(false, false).catch(error => {
          this.mescroll.resetUpScroll();
          return;
        });
        if(!locRes) return this.mescroll.endSuccess(0, false);
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
        brand_id: this.brand_id,
        restaurant_id: this.restaurant_id,
        lng,
        lat,
        province_name: this.province_name || this.location_province,
        city_name: this.city_name || this.location_city,
        rote: this.rote,
        location_city: this.location_city,
      };
      const res = await restaurantQuery(params);
      if(res.code != 1) {
        this.isLoading = false;
        // 列表无数据 - 展示门店已打烊
        this.isShowShopCloseDia = true;
        this.shopCloseRemindText = '当前门店已打烊';
        this.isFirstUpdate = false;
        this.mescroll.endSuccess(0, false);
        return;
      };
      if(res.data.upgrade) {
        this.isShowShopCloseDia = true;
        this.shopCloseRemindText = '品牌升级中';
        this.isFirstUpdate = false;
        this.mescroll.endSuccess(0, false);
        return;
      }
      // 请求门店及地址
      const {
        restaurant_address,
        restaurant_name,
        distance,
        latitude,
        longitude,
        restaurant_id,
      } = res.data;
      this.restaurant_address = restaurant_address;
      this.restaurant_name = restaurant_name;
      this.distance = distance;
      this.shop_latitude = latitude;
      this.shop_longitude = longitude;
      // 不存在餐厅id时
      if(!this.restaurant_id) {
        this.setRestaurantId(restaurant_id); // 门店id
      }
      // 从惠吃喝过来，带商品的ID - 请求商品的详情
      this.shop_product_id && this.$refs.commodityDetails.popupShow({
        product_id: this.shop_product_id,
        isReturn: true,
        ticket_id: this.ticket_id
      }); // 设置需要更新
      // 请求列表
      menuQuery({
        brand_id: this.brand_id,
        restaurant_id: this.restaurant_id
      }).then(res => {
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
      await this.clearCart()
      this.isShowDelCartDia = false;
      this.$refs.commodityCart.popupClose();
      this.updateTabsList();
    },
    confirmShopHandle(){
      this.isShowConfirmShopDia = false;
      if(!this.isContinuePay) return ;
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
        this.$refs.commodityOrder.createPayment();
			}, 300);
    },
    // 关闭弹窗 - 进入订单的详情
    closeContinuePayHandle(oid) {
      this.isShowContinuePay = false;
      this.$refs.commodityOrder.popupClose();
      this.mescroll.resetUpScroll(); // 对页面数据进行刷新
      this.$go( `/pages/userModule/takeawayMenu/mcDonald/order/index?oid=${oid}`);
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
    imBuyHandle(products, ticket_id = 0) {
        if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
        this.$refs.commodityOrder.popupShow({
            products,
            isAloneProducts: true, // 是否是单个商品
            ticket_id
        });
    },
    editCartHandle({
      tabIndex,
      ItemIndex,
      currenComNum
    }) {
      this.tabsList[tabIndex].detail[ItemIndex].car_num = this.tabsList[tabIndex].detail[ItemIndex].car_num + currenComNum;
      this.isShowComBuy = true;
    },
    updateTabsList() {
      this.tabsList.forEach(res => {
        res.detail.forEach(resItem => {
          resItem.car_num = 0;
        })
      });
    },
    // 选中进入详情
    selComHandle(item,tabIndex, index) {
      this.$refs.commodityDetails.popupShow({
        ...item,
      }, tabIndex, index);
    },
    // 列表直接 - 购物车add添加
    selAddComHandle(item,tabIndex, index) {
      const { product_id, car_num} = item;
      const currenComNum = car_num + 1;
      const params = {
        product_id,
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
      const { product_id, car_num } = item;
      const currenComNum = car_num - 1;
      const params = {
        product_id,
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
      this.$go( `/pages/userModule/takeawayMenu/mcDonald/search`);
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
      this.isSourceOrder = true;
      this.$go(`/pages/userModule/takeawayMenu/mcDonald/selectShop/index?pathSource=${this.pathSource}`);
    },
    goSelectShopHandle() {
      this.isShowShopCloseDia = false;
      this.$go(`/pages/userModule/takeawayMenu/mcDonald/selectShop/index?pathSource=${this.pathSource}`);
    },
  }
}
</script>

<style scoped lang="scss">
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
    border: 1rpx solid #e3e3e3;
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
  .add_cont-load{
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.add_cont-left{
  margin-right: 16rpx;
  width: 148rpx;
  flex: 0 0 148rpx;
}
.add_cont-right {
  position: relative;
}

</style>
