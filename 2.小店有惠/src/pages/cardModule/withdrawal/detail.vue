<template>
<view>
  <xhNavbar
    navbarColor="#fff"
    titleColor="#333"
    leftImage="/static/images/back_02.png"
    @leftCallBack="$back(2)"
    titleAlign="titleLeft"
  ></xhNavbar>
  <view class="cont_box">
    <view class="cont_top fl_center">
      <image class="cont_top-icon" src="/static/images/mine/icon_confirm.png" mode="aspectFit"></image>
      提现申请提交成功
    </view>
    <view class="cont_top-lab">约1到3个工作日到账</view>
    <view class="bottom_box">
      <view class="bottom_lab">关注公众号，第一时间接收到账信息</view>
      <view class="code_box">
        <van-image
          width="100%"
          height="100%"
          src="https://file.y1b.cn/store/1-0/231120/655b25138bf58.jpg"
          use-loading-slot
          radius="14px"
          :show-menu-by-longpress="true"
        >
          <van-loading slot="loading" type="spinner" size="20" vertical />
        </van-image>
      </view>
    </view>
  </view>
</view>
</template>
<script>
  export default {
    data() {
      return {
      };
    },
    methods: {
      changeHandle({ detail }) {
        this.price_num = detail;
      },
      goPage(url){
        this.$go(url);
      },
      confirmHandle() {
        this.goPage('/pages/cardModule/withdrawal/detail')
      }
    },
    onLoad(option) {
    }
  }
</script>
<style lang="scss">
.cont_box{
  padding: 0 50rpx;
  .cont_top{
    font-size: 40rpx;
    color: #333;
    line-height: 56rpx;
    margin-top: 300rpx;
    .cont_top-icon {
      width: 40rpx;
      height: 40rpx;
      margin-right: 16rpx;
    }
  }
  .cont_top-lab{
    font-size: 28rpx;
    text-align: center;
    color: #999;
    line-height: 40rpx;
    margin: 32rpx auto 0;
  }
}
.bottom_box {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 20%;
}
.bottom_lab{
  font-size: 28rpx;
  text-align: center;
  color: #aaa;
  line-height: 40rpx;
  margin: 0 auto;
}
.code_box{
  width: 200rpx;
  height: 200rpx;
  background: #fafafa;
  border: 1rpx solid #e1e1e1;
  border-radius: 28rpx;
  margin: 24rpx auto 0;
  padding: 16rpx;
  box-sizing: border-box;
  .code_img{
    width: 100%;
    height: 100%;
  }
}
</style>
