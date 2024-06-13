<template>
  <view :class="['nav', !isShowCenter ? 'active' : '' ]" id="nav">
	<image class="nav_bg" v-if="isShowCenter" src="https://file.y1b.cn/store/1-0/24131/65ba360dabdac.png" mode="scaleToFill"></image>
    <view class="nav_cont">
      <view
        v-for="(item, index) in showNavBarList" :key="item.id"
        :class="['nav_item', (currentID === item.id) && 'active', (item.id == 1) && 'midden_active']"
        @click="navbarHandle(index, item.url)"
      >
        <block>
          <image class="nav_icon" :src="currentID == item.id ? item.icon_active : item.icon" mode="scaleToFill"></image>
          <text :class="['nav_text']">{{item.title}}</text>
        </block>
        <view class="icon_dot" v-if="item.id == 2 && isShowDot"></view>
		    <!-- <van-icon name="" v-if="showDotIndex == 1" dot class="icon-dot" style="--info-dot-size:12px;" /> -->
      </view>
    </view>
  </view>
</template>
<script>
import { singleton } from "@/api/modules/home.js";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "navbar",
  components: {},
  props: {
    currentID: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {
      isShowCenter: true,
      navBarCenterList: [
        {
          id: 0,
          title: '积分商城',
          icon: 'https://file.y1b.cn/store/1-0/24131/65ba3de2571f0.png',
          icon_active: 'https://file.y1b.cn/store/1-0/24131/65ba3dca8dc2c.png',
          url: '/pages/home/index'
        },
        {
          id: 1,
          title: '赚钱中心',
          icon: 'https://file.y1b.cn/store/1-0/24530/665844beaadfa.png',
          icon_active: 'https://file.y1b.cn/store/1-0/24530/665842fcec4c4.png',
          url: '/pages/card/index'
        },
        {
          id: 2,
          title: '我的',
          icon: 'https://file.y1b.cn/store/1-0/24131/65ba3db35c07e.png',
          icon_active: 'https://file.y1b.cn/store/1-0/24131/65ba3d93da3a5.png',
          url: '/pages/mine/index'
        }
      ],
      navBarList: [
        {
          id: 0,
          title: '积分商城',
          icon: 'https://file.y1b.cn/store/1-0/24131/65ba3de2571f0.png',
          icon_active: 'https://file.y1b.cn/store/1-0/24131/65ba3dca8dc2c.png',
          url: '/pages/home/index'
        },
        {
          id: 2,
          title: '我的',
          icon: 'https://file.y1b.cn/store/1-0/24131/65ba3db35c07e.png',
          icon_active: 'https://file.y1b.cn/store/1-0/24131/65ba3d93da3a5.png',
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
    this.initCenterRequest();
  },
  computed: {
    ...mapGetters(["userInfo", "isAutoLogin", "vipObject"]),
    showNavBarList() {
      return this.isShowCenter ? this.navBarCenterList : this.navBarList;
    },
    isShowDot() {
      let { show_dot } = this.userInfo;
      return show_dot;
    },
  },
  methods: {
    ...mapActions({
      getVipObject: "user/getVipObject",
    }),
    async initCenterRequest() {
      const res = await singleton();
      if(!res.code || !res.data) return;
      this.isShowCenter = res.data.show;
    },
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
  &.active {
    background: #fff;
    // box-shadow: 0rpx 0rpx 18rpx 0rpx rgba(255,255,255,0.99) inset;
    .nav_icon {
      margin: 32rpx auto 6rpx;
    }
  }
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
      &.midden_active {
        .nav_icon {
          margin: 32rpx auto 6rpx;
          width: 88rpx;
          height: 88rpx;
        }
      }
      .active_txt{
        color: #fff;
      }
    }
  }
  .nav_icon {
    width: 52rpx;
    height: 52rpx;
    display: block;
    margin: 60rpx auto 6rpx;
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
