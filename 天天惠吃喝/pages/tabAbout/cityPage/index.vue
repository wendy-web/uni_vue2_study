<template>
<view class="cityPage">
  <!-- 热门城市的选择 -->
  <view class="city_cont">
    <!-- <scroll-view
      v-show="inputValue"
      scroll-y="true"
      class="search_list"
    >
    <block v-if="searchList.length">
      <view
        class="item_city"
        v-for="(item, idx) in searchList"
        :key="idx"
        @click="bindCityHandle({city:item.name, code: item.id})"
      >
        <view class="city_txt">
          <image class="add_icon" src="/static/discounts/add_icon.png" mode="widthFix"></image>
          {{item.name}}--
        </view>
        <van-icon name="arrow" color="#666" size="14" />
      </view>
    </block>
    </scroll-view> -->
    <SwitchCityList
      :cityName="cityName"
      :provinceName="provinceName"
      :currentCityName="city_name"
      @updateLocation="updateLocationHandle"
      :cityAllList="cityAllList"
      @bindCity="bindCityHandle"
    />
  </view>
<privacyOpen ref="privacyOpen"></privacyOpen>
</view>
</template>
<script>
import { cities, cityQuery } from '@/api/modules/takeawayMenu/index.js';
import { location } from '@/api/modules/takeawayMenu/luckin.js';
import { getUserLocation } from '@/utils/getUserLocation.js';
import { mapGetters, mapMutations } from 'vuex';
import SwitchCityList from './SwitchCityList.vue';
  export default {
    components: {
      SwitchCityList
    },
    data() {
      return {
        cityName: '定位中',
        currentCityName:'',
        provinceName: '',
        lng: 0,
        lat: 0,
        inputValue: '',
        cityAllList: [],
      }
    },
    computed: {
      ...mapGetters(['brand_id', 'city_name']),
    },
    async onLoad(option) {
      // 城市列表
      let currentBrand_id = 0;
      if(option.currentBrand_id){
        currentBrand_id = option.currentBrand_id;
      }
      this.InitCityList(Number(currentBrand_id));
      this.initialLocations();
    },
    async onShow() {
      this.$refs.privacyOpen.LifetimesShow();
      setTimeout(() => {
        this.handleTouchInput();
      }, 1000);
    },
    methods: {
      ...mapMutations({
        setRestaurantId: 'cart/setRestaurantId',
        setCityName: 'cart/setCityName',
        setProvinceName: 'cart/setProvinceName',
        setCityLat: 'cart/setCityLat',
        setCityLon: 'cart/setCityLon',
      }),
      handleTouchInput() {
        if (wx.requirePrivacyAuthorize) {
          wx.requirePrivacyAuthorize()
        }
      },
      // 更新定位
      updateLocationHandle() {
        // this.initialLocations();
        this.setCityName(this.cityName);
        this.setProvinceName(this.provinceName);
        this.setCityLat(this.lat);
        this.setCityLon(this.lng);
        this.$back();
      },
      async initialLocations() {
        const res = await getUserLocation();
        const { latitude, longitude } = res.data;
        this.lng = longitude;
        this.lat = latitude;
        const locRes = await location({
            lng: longitude,
            lat: latitude
        });
        if(locRes.code != 1) return;
        const { cityInfo } = locRes.data;
        // 获取到当前地址下的省市
        this.cityName = cityInfo.city;
        this.provinceName = cityInfo.province;
      },
      async InitCityList(currentBrand_id) {
        let brand_id = currentBrand_id || this.brand_id;
        brand_id = (brand_id == 97) ? 5 : brand_id
        let res = null
        if(brand_id == 99) {
            res = await cities();
        } else {
            res = await cityQuery({ brand_id });
        }
        if(res.code != 1) return;
        this.cityAllList = res.data;
      },
      bindCityHandle(event) {
        let { city, province, lat, lon } = event;
        this.setCityName(city);
        this.setProvinceName(province);
        if(lat && lon) {
            // 等于当前城市时，更新当前定位下的经纬度
            lat = (city == this.cityName) ? this.lat : lat;
            lon = (city == this.cityName) ? this.lng : lon;
            this.setCityLat(lat);
            this.setCityLon(lon);
        }
        this.cityName = city;
        this.$back();
      },
    }
  }
</script>
<style scoped lang="scss">
  .cityPage {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }
  .top_cont {
    color: #333;
    flex: 1;
    display: flex;
    align-items: center;
    .left_back{
      width: 36rpx;
      height: 36rpx;
    }
    .input_box {
      flex: 1;
      height: 64rpx;
      line-height: 64rpx;
      background: #f7f8fa;
      border-radius: 32rpx;
      position: relative;
      padding-left: 24rpx;
      display: flex;
      align-items: center;
      .input_icon {
        width: 24rpx;
        height: 24rpx;
        position: absolute;
      }
      .input_value {
        flex: 1;
        font-size: 28rpx;
        font-weight: 400;
      }
    }
  }
  .city_cont{
    position: relative;
  }
  .search_list{
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
    background: #fff;
    padding-left: 34rpx;
    border-top: 16rpx solid #F7F7F7;
    box-sizing: border-box;
    .item_city {
      display: flex;
      height: 100rpx;
      color: #333333;
      line-height: 36rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2rpx solid #F7F7F7;
      padding-right: 34rpx;
      .city_txt{
        display: flex;
        align-items: center;
      }
    }
    .empty_txt {
      color: #666;
      line-height: 36rpx;
      margin-top: 20rpx;
    }
  }
  .add_icon{
    width: 24rpx;
    height: 24rpx;
    margin-right: 8rpx;
  }
</style>
