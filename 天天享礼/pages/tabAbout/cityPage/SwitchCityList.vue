<template>
  <view class="switch_box">
    <!-- 当前城市 -->
    <view class="city_address" id="cityAddress" @click="reGetLocationHandle">
      <view class="city_txt">
        <image class="add_icon" :src="imgUrl+'/static/discounts/add_icon.png'" mode="widthFix"></image>
        {{cityName}}
      </view>
      <view class="city_up">
        <image class="add_icon" :src="imgUrl+'/static/discounts/upAdd_icon.png'" mode="widthFix"></image>
        重新定位
      </view>
    </view>

    <view class="container-inner">
      <view class="searchLetter touchClass">
        <view
          v-for="(item, idx) in searchLetter"
          :key="idx"
          style="color:#666;font-size:20rpx;"
          :data-letter="item.name"
          @click="clickLetterHandle"
          :class="{'active1': item.name == scrollTopId}"
        >
          {{ item.name }}
        </view>
      </view>
      <view class="container">
        <!-- 展示字母的形式 -->
        <block v-if="isShowLetter">
          <view class="showSlectedLetter">
            {{ toastShowLetter }}
          </view>
        </block>

        <scroll-view
          scroll-y="true"
          :scroll-into-view="scrollTopId"
          :style="{height: winHeight + 'px'}"
        >
          <!-- 城市列表 -->
          <view class="selection" v-for="(item, idx) in cityAllList" :key="idx">
            <view class="item_letter"
              :id="item.city_head_mark"
            >
              {{ item.city_head_mark }}
            </view>
            <view
              class="item_city"
              v-for="(cityItem, index) in item.cities"
              :key="index"
              @click="bindCity(cityItem)"
            >
              {{cityItem.city_name}}
              <van-icon name="success" v-if="cityItem.city_name == currentCityName" color="#3376ff" style="margin-left: 10rpx"/>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>
<script>
import {getImgUrl} from '@/utils/auth.js';
export default {
  props: {
    cityName: {
      type: String,
      default: ''
    },
    provinceName: {
      type: String,
      default: ''
    },
    navbarBoxHeight:{
      type: Number,
			default: 0
    },
    cityAllList: {
      type: Array,
      default: []
    },
    currentCityName: {
      type: String,
      default: ''
    }
  },
  computed: {
    // 城市匹配字母列表
    searchLetter() {
      const city_head_List = this.cityAllList.map(res => res.city_head_mark);
      const searchLetter = city_head_List;
      const sysInfo = wx.getSystemInfoSync();
      const winHeight = sysInfo.windowHeight;
      this.winHeight = winHeight - this.navbarBoxHeight - uni.upx2px(112); // 城市列表的高度
      const itemH = winHeight / searchLetter.length;
      let tempArr = [];
      searchLetter.map(
        (item, index) => {
          let temp = {};
          temp.name = item;
          temp.tHeight = index * itemH;
          temp.bHeight = (index + 1) * itemH;
          tempArr.push(temp);
        }
      );
      return tempArr;
    }
  },
  data() {
    return {
		imgUrl: getImgUrl(),
        lat: 0,
        lng:0,
        showLetter: '',
        winHeight: 0,
        isShowLetter: false,
        scrollTopId: 'A', // 置顶id
        toastShowLetter: ''
    };
  },
  created() {
  },
  mounted() {
  },
  methods: {
    // 点击字母定位
    clickLetterHandle(event) {
      const showLetter = event.currentTarget.dataset.letter;
      this.toastShowLetter = showLetter;
      this.isShowLetter = true;
      this.scrollTopId = showLetter;
      const self = this;
      setTimeout(() => {
        self.isShowLetter = false;
      }, 500);
    },
    // 重新获取定位
    reGetLocationHandle() {
      this.$emit('updateLocation')
    },
    // 选择城市
    bindCity(item) {
      const { city_name, province_name, lat, lon } = item
      this.$emit('bindCity', {
        city: city_name,
        province: province_name,
        lat,
        lon
      });
    },
  }
};
</script>

<style lang="scss">
.switch_box {
  display: flex;
  flex-direction: column;
}
.container-inner {
  flex: 1;
  display: flex;
  flex-direction: row-reverse;
}

.container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

input {
  text-align: center;
  font-size: 32rpx;
  padding: 5px;
}

.searchLetter {
  flex-shrink: 0;
  width: 80rpx;
  text-align: center;
  display: flex;
  flex-direction: column;
  color: #666;
  >view {
    margin-top: 20rpx;
  }
  .active {
    background: #3376ff;
  }
}
.touchClass {
  background-color: #fff;
  color: #fff;
  padding-top: 44rpx;
  padding-bottom: 16rpx;
}

.showSlectedLetter {
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 50%;
  left: 50%;
  margin: -100rpx;
  width: 200rpx;
  height: 200rpx;
  border-radius: 20rpx;
  font-size: 52rpx;
  z-index: 1;
}

.selection {
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: 10rpx;
}

.selectCity {
  padding: 16rpx;
  margin-bottom: -10rpx;
  .hotCity_title{
    padding-bottom: 0;
    margin: 8rpx 0;
    margin-left: 16rpx;
    font-size: 30rpx;
    font-weight: 500;
    text-align: left;
    color: #333333;
    line-height: 42rpx;
  }
}

.item_letter {
  display: flex;
  padding-left: 34rpx;
  align-items: center;
  font-size: 30rpx;
  font-weight: 600;
  text-align: left;
  color: #333333;
  line-height: 42rpx;
}

.item_city {
  display: flex;
  height: 100rpx;
  padding-left: 34rpx;
  align-items: center;
  font-weight: 400;
  color: #333333;
  line-height: 36rpx;
}
.hotcity {
  padding-right: 50rpx;
  margin: auto;
}

.thishotText {
  color: #666;
  font-size: 20rpx;
  margin: 0 !important;
}

.hotCity_box {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  border: none;
  .hotCity_box__label {
    text-align: center;
    color: #666;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 23%;
    box-sizing: border-box;
    border: 1rpx solid #e1e1e1;
    border-radius: 4rpx;
    margin: 8rpx 0;
    line-height: 60rpx;
    font-size: 26rpx;
  }
}



.ul {
  display: block;
  color: grey;
  margin-left: 20rpx;
}

.li {
  display: block;
  font-weight: 100;
  font-size: 28rpx;
  padding: 16rpx 0;
}

input {
  background-color: #eee;
}

.input {
  padding: 16rpx;
}
.city_address {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 26rpx 24rpx;
  border-top: 16rpx solid #F7F7F7;
  border-bottom: 16rpx solid #F7F7F7;
  >view{
    display: flex;
    align-items: center;
  }
  .add_icon{
    width: 24rpx;
    height: 24rpx;
    margin-right: 8rpx;
  }
  .city_txt{
    font-size: 28rpx;
    color: #333333;
    line-height: 40rpx;
  }
  .city_up {
    font-size: 26rpx;
    color: #3376ff;
    line-height: 36rpx;
  }
}
</style>
