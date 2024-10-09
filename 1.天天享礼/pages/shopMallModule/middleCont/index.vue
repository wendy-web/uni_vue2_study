<template>
<div class="middle_cont">
  <view class="icon_box" @click="$leftBack"
    :style="{ height: navBarHeight + 'px', top: topHeight + 'px' }">
    <image class="icon_box-icon" src="https://file.y1b.cn/store/1-0/24724/66a0b170682c6.png" mode="aspectFill"></image>
  </view>
  <image class="nav_bg" src="https://file.y1b.cn/store/1-0/24724/66a06bc318b1d.png" mode="aspectFill"></image>
  <image class="cont_title" src="https://file.y1b.cn/store/1-0/24724/66a06be3864e7.png" mode="aspectFill"></image>
  <view class="cont_list fl_bet">
    <van-image width="346rpx" height="388rpx"
      src="https://file.y1b.cn/store/1-0/24724/66a06bf8ce6ca.png" use-loading-slot
      class="cont_list-item" @click="goToUrlHandle(hu_url)"
    ><van-loading slot="loading" type="spinner" size="20" vertical />
    </van-image>
    <van-image width="346rpx" height="388rpx"
      src="https://file.y1b.cn/store/1-0/2485/66b03f576887d.png" use-loading-slot
      class="cont_list-item" @click="goToUrlHandle(yfs_url)"
    ><van-loading slot="loading" type="spinner" size="20" vertical />
    </van-image>
  </view>
  <image class="update_title" src="https://file.y1b.cn/store/1-0/24724/66a0c1fb8e03c.png" mode="aspectFill"></image>
  <van-image width="710rpx" height="244rpx"
    src="https://file.y1b.cn/store/1-0/24724/66a06c37555fa.png" use-loading-slot
    class="update_img" @click="goToUrlHandle(home_url)"
  ><van-loading slot="loading" type="spinner" size="20" vertical />
  </van-image>
</div>
</template>

<script>
import { houseUrl } from '@/api/modules/shopMall.js';
import { getNavbarData } from "@/components/xhNavbar/xhNavbar.js";
export default{
  data() {
    return {
      navBarHeight: 0,
      topHeight: 0,
      yfs_url: '', // 一番赏房间链接
      home_url: '', // 首页链接
      hu_url: '', // 红牛房间链接
    }
  },
  async onLoad() {
    getNavbarData().then((res) => {
      let { navBarHeight, statusBarHeight } = res;
      this.navBarHeight = navBarHeight;
      this.topHeight = statusBarHeight;
    });
    const res = await houseUrl();
    if(!res.code || !res.data) return;
    const { home_url, hu_url, yfs_url} = res.data;
    this.home_url = home_url;
    this.hu_url = hu_url;
    this.yfs_url = yfs_url;
  },
  methods: {
    goToUrlHandle(url) {
      if(!url) return;
      this.$go(`/pages/webview/webview?link=${encodeURIComponent(url)}`);
    }
  }
}
</script>

<style scoped lang="scss">
.middle_cont {
  height: 100vh;
  width: 100vw;
  background: #f8a441;
  position: fixed;
  overflow: hidden;
  overflow-y: scroll;
  z-index: 0;
  &::before {
    content: '\3000';
    position: absolute;
    width: 214rpx;
    height: 32rpx;
    bottom: 78rpx;
    left: 50%;
    transform: translateX(-50%);
    background: url("https://file.y1b.cn/store/1-0/24724/66a06c4a67882.png") 0 0 / 100% 100%;
  }
  &::after {
    content: '\3000';
    position: absolute;
    width: 336rpx;
    height: 126rpx;
    bottom: 0;
    right: 0;
    background: url("https://file.y1b.cn/store/1-0/24724/66a06c5c12639.png") 0 0 / 100% 100%;
  }
  .nav_bg {
    width: 100%;
    height: 590rpx;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
  }
  .cont_title{
    width: 368rpx;
    height: 70rpx;
    display: block;
    margin: 558rpx auto 0;
  }
  .cont_list {
    padding: 0 20rpx;
    margin-top: 18rpx;
    .cont_list-item {
      width: 346rpx;
      height: 388rpx;
    }
  }
  .update_title {
    width: 330rpx;
    height: 70rpx;
    display: block;
    margin: 44rpx auto 0;
  }
  .update_img {
    width: 710rpx;
    height: 244rpx;
    display: block;
    margin: 16rpx 20rpx 32rpx;
  }
}
.icon_box {
  position: fixed;
  left: 25rpx;
  display: flex;
  align-items: center;
  z-index: 9;
  .icon_box-icon {
    width: 56rpx;
    height: 56rpx;
  }
}
</style>
