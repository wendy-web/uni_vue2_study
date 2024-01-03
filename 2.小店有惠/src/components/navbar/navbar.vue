<template>
  <view class="nav" id="nav">
	<image class="nav_bg" src="/static/images/navbar/navbar_bg01.png" mode="scaleToFill"></image>
    <view class="nav_cont">
      <view
        v-for="(item, index) in navBarList" :key="item.id"
        :class="['nav_item', (currentIndex === index) && 'active']"
        @click="navbarHandle(index, item.url)"
      >
        <block>
          <image class="nav_icon" :src="currentIndex == index ? item.icon_active : item.icon" mode="scaleToFill"></image>
          <text :class="['nav_text']">{{item.title}}</text>
        </block>
        <view class="icon_dot" v-if="index == (navBarList.length - 1) && isShowDot"></view>
		    <!-- <van-icon name="" v-if="showDotIndex == 1" dot class="icon-dot" style="--info-dot-size:12px;" /> -->
      </view>
    </view>
  </view>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "navbar",
  components: {},
  props: {
    currentIndex: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {
      navBarList: [
        {
          id: 0,
          title: '积分商城',
          icon: '/static/images/navbar/icon_home.png',
          icon_active: '/static/images/navbar/icon_home_active.png',
          url: '/pages/home/index'
        },
        {
          id: 1,
          title: '赚钱中心',
          icon: '/static/images/navbar/icon_card.png',
          icon_active: '/static/images/navbar/icon_card_active.png',
          url: '/pages/card/index'
        },
        {
          id: 2,
          title: '我的',
          icon: '/static/images/navbar/icon_mine.png',
          icon_active: '/static/images/navbar/icon_mine_active.png',
          url: '/pages/mine/index'
        }
      ],
    }
  },
  mounted() {
    let query = uni.createSelectorQuery().in(this);
    query.select('#nav').boundingClientRect();
    query.exec((res) => {
      const domObjHeight = res[0].height;
      this.$emit('domObjHeight', domObjHeight)
    });
  },
  computed: {
    ...mapGetters(["userInfo", "isAutoLogin", "vipObject"]),
    isShowDot() {
      let { show_dot } = this.userInfo;
      return show_dot;
    },
  },
  methods: {
    ...mapActions({
      getVipObject: "user/getVipObject",
    }),
    navbarHandle(index, url){
      this.$emit('current');
      (index != 2) && this.getVipObject();
      // 非团长
      if(index == 1 && !this.isAutoLogin){
        return this.$go('/pages/login/index');
      }
      this.$switchTab(url);
    }
  }
}
</script>
<style scoped lang="scss">
.nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 24rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 99;
  .nav_bg {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: -1;
  }
  .nav_cont {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    // padding-top: 16rx;
    .nav_item {
      font-weight: 400;
      text-align: center;
      color: #999;
      flex: 1;
      align-items: center;
      box-sizing: border-box;
      position: relative;
      &.active{
        color: #EF2B20;
      }
      .active_txt{
        color: #fff;
      }
      &:nth-child(2){
        .nav_icon {
          margin: 32rpx auto 6rpx;
          width: 88rpx;
          height: 88rpx;
        }
      }
      .nav_icon {
        width: 52rpx;
        height: 52rpx;
        display: block;
        margin: 60rpx auto 6rpx;
      }
    }
  }
  .icon_dot{
	  width: 15rpx;
	  height: 15rpx;
    border-radius: 50%;
    position: absolute;
    background: #EF2B20;
    top: 65rpx;
    right: 35%;
    transform: translate(-50%, -50%);
  }
}
</style>
