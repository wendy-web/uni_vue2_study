<template>
<view class="nav" id="nav">
  <view class="nav_cont">
    <view
      v-for="(item, index) in navBarList" :key="item.id"
      :class="['nav_item', (currentIndex === index) && 'active']"
      @click="navbarHandle(item)"
    >
      <!-- 置顶的图标 -->
      <image
          :class="['scroll_icon', isScrollTop ? 'scroll_icon-active' : '']"
          :src="item.scrollIcon" v-if="item.scrollIcon" mode="aspectFill">
        </image>
      <image
        class="nav_icon"
        :src="currentIndex == index ? item.icon_active : item.icon" mode="aspectFill">
      </image>
      <view class="nav_icon-point" v-if="(unRead && index == (navBarList.length - 1))"></view>
      <view class="nav_text">{{item.title}}</view>
    </view>
  </view>
</view>
</template>

<script>
import {  mapGetters } from 'vuex';
import { msgTemplete, powerTemplete } from '@/api/modules/task.js'
export default {
  name: "customTabBar",
  computed: {
    ...mapGetters(['userInfo', 'isAutoLogin'])
  },
  props: {
    currentIndex: {
      type: Number,
      default: 0
    },
    isScrollTop: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    userInfo(newValue) {
      this.unRead = newValue.show_dot > 0;
    }
  },
  data() {
    return {
      unRead: false,
      currentPage: '', // 当前页路径
      navBarList: [
        {
          id: 0,
          pagePath: "/pages/tabBar/shopMall/index",
          scrollIcon: `https://file.y1b.cn/store/1-0/23118/654b29826a6c6.png`,
          icon: `/static/tabsImg/home-icon.png`, // 用于覆盖当前tab的展示图标，用于置顶的呈现
          icon_active: `/static/tabsImg/home-select-icon.png`,
          title: "首页"
        },
        {
          id: 1,
          pagePath: "/pages/tabBar/discounts/index",
          scrollIcon: ``,
          icon: `/static/tabsImg/discounts.png`,
          icon_active: `/static/tabsImg/discounts_select.png`,
          title: "惠吃喝"
        },
        {
          id: 2,
          pagePath: "/pages/tabBar/task/index",
          scrollIcon: ``,
          icon: `/static/tabsImg/scan.png`,
          icon_active: `/static/tabsImg/scan_select.png`,
          title: "福利中心"
        },
        {
          id: 3,
          pagePath: "/pages/tabBar/user/index",
          scrollIcon: ``,
          icon: `/static/tabsImg/personal.png`,
          icon_active: `/static/tabsImg/personal_select.png`,
          title: "我的"
        }
      ]
    }
  },
  methods: {
    async navbarHandle(item){
        const { pagePath, id } = item;
        const isCurrent = pagePath == `/${this.currentPage}`; // 点击的icon是否处于当前页面
        if(this.isScrollTop && isCurrent) {
            this.$emit('currentPage'); // 当前页and是否可滚动的回馈事件触发
            return;
        }
        this.$switchTab(pagePath);
        if(id != 2 || !this.isAutoLogin) return;
        const res = await msgTemplete();
        if(res.code != 1 || !res.data) return;
        const { id: templete_id,  temp_id } = res.data;
        uni.requestSubscribeMessage({
            tmplIds: [temp_id],
            complete: (event) => {
              const resultState = event[temp_id];
              const params = {
                templete_id,
                is_power: 0
              }
              if (resultState == "accept") params.is_power = 1;
              powerTemplete(params).then(res => {
                console.log('res___', res)
              })
            }
        });
    }
  },
  mounted() {
    let query = uni.createSelectorQuery().in(this)
    query.select('#nav').boundingClientRect()
    query.exec((res) => {
      const domObjHeight = res[0].height;
      this.$emit('domObjHeight', domObjHeight);
    });
    if(this.userInfo) {
      this.unRead = this.userInfo.show_dot > 0;
    }
    const pageList = getCurrentPages();
    const currentPageObj = pageList[pageList.length - 1];
    this.currentPage = currentPageObj.route;
  }
}
</script>

<style scoped lang="scss">
.nav_icon-point {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 13rpx;
  height: 13rpx;
  background-color: red;
  border-radius: 50%;
  margin-left: 24rpx;
}
.nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 110rpx;
  line-height: 34rpx;
  font-size: 24rpx;
  background-color: #fff;
  z-index: 9;
  padding-bottom: constant(safe-area-inset-bottom); /* 兼容 IOS<11.2 */
  padding-bottom: env(safe-area-inset-bottom); /* 兼容 IOS>11.2 */
  .nav_cont {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-top: 2rpx solid #e1e1e1;
    .nav_item {
      flex: 1;
      font-weight: 400;
      text-align: center;
      color: #333333;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      .scroll_icon{
        position: absolute;
        width: 78rpx;
        height: 78rpx;
        padding: 3rpx;
        box-sizing: border-box;
        z-index: 1;
        background: #fff;
        opacity: 0;
        transition: all .3s;
        &.scroll_icon-active {
          opacity: 1;
        }
      }
      &.active{
        color: #EF2B20;
      }
      .nav_icon {
        width: 48rpx;
        height: 48rpx;
        display: block;
        margin-bottom: 4rpx;
        position: relative;
        &.unRead_icon::after {
          content: '';
          position: absolute;
          top:0;
          right: 0;
          width: 20rpx;
          height: 20rpx;
          background-color: red;
          border-radius: 50%;
          margin-left: 5rpx;
        }
      }
      .nav_text{
        font-size: 20rpx;
        text-align: center;
        color: #333333;
        line-height: 28rpx;
      }
    }
  }
}
</style>