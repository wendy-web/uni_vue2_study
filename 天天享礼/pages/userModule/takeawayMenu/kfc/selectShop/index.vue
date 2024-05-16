<template>
<view class="select">
  <xh-navbar
    :leftImage="imgUrl+'/static/images/left_back.png'"
    @leftCallBack="topCallBack"
    navberColor="#fff"
    titleColor="#333"
    title="选择门店"
  >
  </xh-navbar>
  <view class="top_input box_fl" :style="{'--top': fixedTop}">
    <view class="add_txt box_fl" @click="toCityPageHandle">
      <view class="city_name txt_ov_ell1">{{ city_name }}</view>
      <image class="triangle_icon" :src="takeImgUrl + '/triangle_icon.png'" mode="aspectFill"></image>
    </view>
    <view class="search_box box_fl">
        <image class="search_icon" :src="takeImgUrl+'/search_icon.png'" mode="aspectFill"></image>
        <van-field
            :value="inputValue"
            placeholder="请输入地址搜索门店"
            :border="false"
            @confirm="confirmHandle"
            @change="inputValueChange"
            :focus="false"
            custom-style="font-size:30rpx;--field-input-text-color:#333333;background-color: transparent; flex: 1;"
        />
    </view>
  </view>
  <!-- 门店的选择 -->
  <mescroll-uni
    :fixed="false"
    :height="mescrollHeight"
    ref="mescrollRef"
    :up="upOption"
    @init="mescrollInit"
    @down="downCallback"
    @up="upCallback"
  >
    <view class="list_box">
      <view
        v-for="(item, index) in shopList"
        :key="index"
        :class="['list_item', index == selIndex ? 'active' : '']"
        @click="selShopHandle(item, index)"
      >
        <image class="radio_active" :src="takeImgUrl + '/kfc_active.png'" mode="aspectFill"></image>
        <view class="shop_title">{{item.storeName}}</view>
        <view class="time_txt">
          <image class="list_icon" :src="takeImgUrl +'/time_icon.png'" mode="aspectFill"></image>
          {{item.startTime}}-{{item.endTime}}
        </view>
        <view class="add_box fl_bet">
          <view class="add_txt fl">
            <image class="add_icon" :src="takeImgUrl + '/add_ion02.png'" mode="aspectFill"></image>
            <view class="txt_ov_ell2">
              {{ item.address }}
            </view>
          </view>
          <view class="add_distance" v-if="item.distance">{{ formatDistance(item.distance) }}</view>
        </view>
      </view>
    </view>
  </mescroll-uni>
  <confirmDia
    :isShow="isShowShopCloseDia"
    remindText="门店已打烊，选择其他门店看看吧"
    confirmText="我知道了"
    :isInform="true"
    @confirm="isShowShopCloseDia = false"
  >
  </confirmDia>

  <confirmDia
    :isShow="isShowSelDia"
    remindText="服务门店变更，请重新确认商品"
    confirmText="去确定"
    @close="isShowSelDia = false"
    @confirm="goToMenu"
  >
  </confirmDia>
  <privacyOpen ref="privacyOpen"></privacyOpen>
</view>
</template>
<script>
import {
cityStores,
storesCk
} from '@/api/modules/takeawayMenu/kfc.js';
import { location } from '@/api/modules/takeawayMenu/luckin.js';
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { getImgUrl } from '@/utils/auth.js';
import { getUserLocation } from '@/utils/getUserLocation.js';
import getViewPort from '@/utils/getViewPort.js';
import { formatDistance } from '@/utils/index.js';
import { mapGetters, mapMutations } from 'vuex';
import confirmDia from '../content/confirmDia.vue';
export default {
    mixins: [MescrollMixin], // 使用mixin
    components: {
      confirmDia
    },
    computed: {
      ...mapGetters(['brand_id', 'city_name', 'province_name', 'cartComList', 'storeCode']),
      fixedTop() {
				let viewPort = getViewPort();
        return viewPort.navHeight;
      },
      mescrollHeight() {
        let viewPort = getViewPort();
        // uni.upx2px(84) 搜索固定的内容
        let mescrollHeight =  viewPort.windowHeight - viewPort.navHeight - uni.upx2px(84);
        return mescrollHeight + 'px';
      },
    },
    watch: {
      city_name(newValue, oldValue){
        if(oldValue) {
          this.mescroll.resetUpScroll();
        }
      }
    },
    data() {
        return {
				  imgUrl: getImgUrl(),
          takeImgUrl: getImgUrl() + 'static/subPackages/userModule/takeawayMenu',
          upOption: {
            page: {
              size : 9
            },
            empty: {
              tip: '暂无门店，敬请期待',
              icon: 'https://file.y1b.cn/store/1-0/2389/64d352c3c15a1.png'
            }
          },
          selIndex: -1,
          location_city: '',
          shopList: [],
          inputValue: '',
          latitude: 0,
          longitude: 0,
          isShowShopCloseDia: false,
          isShowSelDia: false,
          sel_storeCode: 0,
          isShowLoading: false
        };
    },
    async onLoad(option) {
      if(option.pathSource) {
        this.pathSource = option.pathSource;
      }
    },
    onShow() {
      this.$refs.privacyOpen.LifetimesShow();
      setTimeout(() => {
        this.handleTouchInput();
      }, 1000);
    },
    methods: {
      formatDistance,
      ...mapMutations({
        setStoreCode: 'cart/setStoreCode',
        setCityName: 'cart/setCityName',
        setProvinceName: 'cart/setProvinceName',
      }),
      handleTouchInput() {
        if (wx.requirePrivacyAuthorize) {
          wx.requirePrivacyAuthorize();
        }
      },
      inputValueChange({ detail }) {
        this.inputValue = detail;
      },
      confirmHandle({detail}) {
        this.inputValue = detail.trim();
        this.mescroll.resetUpScroll();
      },
      async upCallback(page) {
        // 不存在经纬度时
        if(!this.latitude || !this.latitude) {
          const res = await getUserLocation();
          const { latitude, longitude } = res.data;
          this.latitude = latitude;
          this.longitude = longitude;
        }
        // 没传入城市列表时
        const res = await location({ lng: this.longitude, lat: this.latitude });
        if(res.code == 1) {
          const { cityInfo } = res.data;
          // 获取到当前地址下的省市
          this.location_city = cityInfo.city;
          if(!this.province_name || !this.city_name) {
            this.setCityName(this.location_city);
            this.setProvinceName(cityInfo.province);
          }
        }
        const params = {
          city_name: this.city_name,
          lng: this.longitude,
          lat: this.latitude,
          page: page.num,
          size: page.size,
          keyword: this.inputValue,
          location_city: this.location_city,
          storeCode: this.storeCode
        };
        cityStores(params).then(res => {
          if(page.num == 1) this.shopList = [];
          if(res.code == 1) {
            const { restaurants, total_count } = res.data;
            this.shopList = this.shopList.concat(restaurants);
            this.mescroll.endBySize(restaurants.length, total_count);
            this.selIndex = this.shopList.findIndex(res => res.storeCode == this.storeCode);
            return;
          }
          this.mescroll.endSuccess(this.shopList.length);
        }).catch(() => {
          this.mescroll.endErr();
        });
      },
      // 选定门店
      async selShopHandle(item, index) {
        if(this.isShowLoading) return;
        const { storeCode } = item;
        this.sel_storeCode = storeCode;
        this.selIndex = index;
        this.$showLoading('加载中');
        this.isShowLoading = true;
        // 相同的店铺 - 后退
        if(this.storeCode == storeCode) {
          this.$hideLoading();
          this.isShowLoading = false;
          this.$back();
          return;
        }
        const res = await storesCk({ storeCode });
        this.isShowLoading = false;
        this.$hideLoading();
        if(res.code != 1 || !res.data) return this.$toast(res.msg);
        const { menu } = res.data;
        if(!menu) {
          // 没有菜单产品 - 门店打烊
          this.isShowShopCloseDia = true;
          return;
        }
        this.goToMenu();
      },
      goToMenu() {
        const sel_storeCode = this.sel_storeCode;
        this.setStoreCode(sel_storeCode);
        this.$hideLoading();
        this.$back();
      },
      // 选择城市
      toCityPageHandle(){
        this.$go(`/pages/tabAbout/cityPage/index?currentCityName=${this.city_name}`)
      },
      topCallBack() {
        // 列表没有数据 - 返回到
        if(!this.shopList.length) {
          if(this.pathSource == 'discounts') return this.$reLaunch('/pages/discounts/discounts/index');
          this.$switchTab(`/pages/tabBar/shopMall/index`);
          return;
        };
        uni.navigateBack({
          fail: () => {
            this.$reLaunch('/pages/userModule/takeawayMenu/kfc/index');
          }
        });
      }
    },
};
</script>
<style lang="scss">
@import '@/static/css/mixin.scss';
page {
    background: #F5F5F5;
}
.select {
  padding-bottom:constant(safe-area-inset-bottom);
  /* 兼容 IOS<11.2 */
  padding-bottom: env(safe-area-inset-bottom);
  /* 兼容 IOS>11.2 */
}
.top_input {
  font-size: 30rpx;
  font-weight: 600;
  color: #333333;
  line-height: 42rpx;
  padding: 0 24rpx;
  background: #fff;
  position: fixed;
  top: var(--top);
  left: 0;
  width: 100%;
  z-index: 1;
  .add_txt{
    border-right: 2rpx solid #cccccc;
    .city_name {
      max-width: 7em;
    }
  }
  .triangle_icon{
    width: 20rpx;
    height: 14rpx;
    border-radius: 2rpx;
    margin: 0 18rpx;
  }
  .search_box{
    margin-left: 25rpx;
    flex: 1;
    .search_icon{
      width: 28rpx;
      height: 28rpx;
      flex: 0 0 28rpx;
    }
  }
}
.list_box {
  padding: 84rpx 24rpx 0;
  .list_item {
    background: #ffffff;
    border-radius: 8rpx;
    padding: 24rpx;
    margin-top: 24rpx;
    border: 2rpx solid #fff;
    position: relative;
    .radio_active{
      width: 36rpx;
      height: 36rpx;
      position: absolute;
      top: -9rpx;
      right: -9rpx;
      opacity: 0;
    }
    &.active {
      border-color: $kfcColor;
      .radio_active{
        opacity: 1;
      }
      .shop_title::after {
        content: '当前选择';
        padding: 0 10rpx;
        height: 38rpx;
        background: $kfcColor;
        border-radius: 38rpx 38rpx 38rpx 20rpx;
        font-size: 24rpx;
        text-align: center;
        line-height: 38rpx;
        margin-left: 16rpx;
        font-size: 24rpx;
        color: #ffffff;
      }
    }
    .list_icon{
      width: 22rpx;
      height: 22rpx;
      margin-right: 12rpx;
    }
    .shop_title {
      font-size: 30rpx;
      font-weight: 600;
      text-align: left;
      color: #333333;
      line-height: 42rpx;
      position: relative;
    }
    .time_txt {
      font-size: 26rpx;
      font-weight: 400;
      text-align: left;
      color: #888888;
      line-height: 36rpx;
      margin-top: 16rpx;
    }
    .add_box {
      font-size: 26rpx;
      color: #999999;
      line-height: 36rpx;
      margin-top: 16rpx;
      .add_txt {
        padding-right: 32rpx;
      }
      .add_icon{
        width: 26rpx;
        height: 30rpx;
        margin-right: 10rpx;
        flex: 0 0 26rpx;
      }
    }
    .add_distance{
      font-size: 28rpx;
      text-align: center;
      color: #999999;
      line-height: 40rpx;
      padding: 0 10rpx 0 32rpx;
      position: relative;
      &::before {
        content: '\3000';
        width: 2rpx;
        height: 60rpx;
        background: #d5d5d5;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
      }
    }
  }
}
</style>
