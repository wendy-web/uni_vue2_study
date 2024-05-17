<template>
<view class="nav_bar" id="nav">
  <view
    v-for="(item, index) in navBarList" :key="item.id"
    :class="['nav_item', (currentIndex === index) && 'active']"
    @click="navbarHandle(item)"
  >
      <image class="nav_icon" mode="aspectFill"
        :src="currentIndex == index ? item.icon_active : item.icon"></image>
      <view class="nav_icon-point" v-if="(unRead && index == (navBarList.length - 1))"></view>
      <view class="nav_text">{{item.title}}</view>
  </view>
  <view class="indicator"></view>
</view>
</template>
<script>
import { msgTemplete, powerTemplete } from '@/api/modules/task.js';
import { mapGetters } from 'vuex';
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
          id: 1,
          pagePath: "/pages/tabBar/discounts/index",
          scrollIcon: ``,
          icon: `./static/dia.png`,
          icon_active: `./static/dia_active.png`,
          title: "惠吃喝"
        },
        {
          id: 2,
          pagePath: "/pages/tabBar/user/index",
          scrollIcon: ``,
          icon: `./static/mine.png`,
          icon_active: `./static/mine_active.png`,
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
              powerTemplete(params)
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
.nav_bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  line-height: 34rpx;
  font-size: 20rpx;
  background-color: rgba(#fff, 1);
  z-index: 9;
  padding-bottom: constant(safe-area-inset-bottom); /* 兼容 IOS<11.2 */
  padding-bottom: env(safe-area-inset-bottom); /* 兼容 IOS>11.2 */
  width: 100%;
  display: flex;
  align-items: center;
  .nav_item {
    flex: 1;
    font-weight: 600;
    text-align: center;
    color: #333;
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
      // background: #fff;
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
      margin: 4rpx auto 4rpx;
      display: block;
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
.active {
  // transform: translateY(-10px);
  transition-delay: 0.25s;
}
.active::before {
    opacity: 0.5;
    transition-delay: 0.25s;
}
.indicator {
  position: absolute;
  top: -15px;
  width: 50%;
  height: 180px;
  left: 0;
  background: #fff;
  border-radius: 50%;
  z-index: -1;
  transition: 0.5s;
}
.nav_item:nth-child(1).active ~ .indicator {
  // transform: translateX(calc(50% * 0));
  left: calc(50% * 0);
}
.nav_item:nth-child(2).active ~ .indicator {
  left: calc(50% * 1);
}
.nav_item:nth-child(3).active ~ .indicator {
    transform: translateX(calc(70px * 2));
}
.nav_item:nth-child(4).active ~ .indicator {
    transform: translateX(calc(70px * 3));
}
.nav_item:nth-child(5).active ~ .indicator {
    transform: translateX(calc(70px * 4));
}
</style>
