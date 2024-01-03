
<template>
<view class="pay_box">
  <!-- 当前页面地址：pages/games/wawaH5Pay/index -->
  <view class="gift_box">
    <image class="dis_gift-icon" src="https://file.y1b.cn/store/1-0/23714/64b0a196d3e63.png" mode="aspectFill"></image>
    <view class="dis_gift_btn" @click="toPayHandle">去支付</view>
  </view>
</view>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      linkTo: '',
      linkData: '',
      appId: ''
    }
  },
  onLoad(options) {
    console.log('options :>> ', options);
    // linkTo -- 跳转支付小程序路径
    // linkData -- 跳转支付小程序参数，JSON.stringify后的字符串
    // appId -- 跳转支付小程序appid
    if(options) {
      const { linkTo, linkData, appId } = options;
      this.linkTo = linkTo;
      this.linkData = linkData;
      this.appId = appId;
      this.toPayHandle();
    }
    // const params = this.getLinkParam(options);
    // console.log('params :>> ', params);
  },
  methods: {
    toPayHandle() {
      let query = this.linkData;
      try {
        let obj = JSON.parse(this.linkData);
        query = this.getLinkParam(obj);
      } catch(err) {}
      this.$navigateToMiniProgram({
        appId: this.appId,
        path: `${this.linkTo}?${query}`,
        success(res) {
          console.log('开启半屏 :>> ', );
        }
      });
    },
    getLinkParam(option) {
      let query = "";
      for(let key in option) {
        if(option[key]){
          query += key + "=" + option[key] + "&";
        }
      }
      return query.substring(0, query.length - 1);
      }
    },
};
</script>

<style scoped lang="scss">
.pay_box {
  width: 100vw;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .gift_box {
    .dis_gift-icon {
      width: 210rpx;
      height: 258rpx;
    }
    .dis_gift_btn{
      width: 224rpx;
      line-height: 92rpx;
      background: #fbdd2b;
      border-radius: 16rpx;
      font-size: 32rpx;
      font-weight: 600;
      text-align: center;
      color: #333333;
      margin-top: 88rpx;
    }
  }
}
</style>