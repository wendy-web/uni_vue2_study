
<template>
<view class="qianZhuPay">
  <!-- <view class="gift_box">
    <image class="dis_gift-icon" src="https://file.y1b.cn/store/1-0/23714/64b0a196d3e63.png" mode="aspectFill"></image>
    <view class="dis_gift_btn" @click="wxPayRequest">去支付</view>
  </view> -->
</view>
</template>

<script>
import { aes_decrypt } from '@/utils/aes/util.js';
export default {
  components: {},
  data() {
    return {
      wxPayParams: null
    }
  },
  onLoad(options) {
    // 示例 下面的str为实例，生产环境通过请求获得
    // let str = 'f85e7df92c45b2272437374769d693f21503eb3fadf3c0b320b610d171bfa81a26f295601008028ff739f9c2317e6138c1b1b98ee2b36e3a3bebced76f13dfbe6762f29263a64ae9d0ee74bb3d20220f2bc8e23d46b10c8ba1eb0a78c909600a1ba8eb46eb3680845128add766791706f6efc1c5b6d11a474160e7817245c3e3e8ee9b29a7d1ac1da20ad3504107b9e8b11fbc123b6b9b6d74fdab08d9b67dc974b7ffe1602d7d9f7dc076bb3b721150807774fb80ccd639f8f92cc97626d3f3ec1bcc0b18601154a4951e604b0deed99041f8b09ebcbcada3d3d60a28377b50e0f6ae3cd7909610330c18aa6b2c4581388ec4c20271d0c2916c749dda8e1e60d19a7089caf0f7c3095df269146c3d60ec6f22a973330b178eb331ad066c1e2628ca728799f42b3e2bfb5e6b8e2ee1b744216ac870adc1cf71c5f1d9492cd37e2fee87a4fe076a792129551169aec731'
    // 解密
    if(options.key) {
      const wxPayParams = JSON.parse(aes_decrypt(options.key))
      this.wxPayParams = wxPayParams;
      // 微信支付
      this.wxPayRequest();
    }
  },
  onShow() {
  },
  methods: {
    wxPayRequest() {
      const params = this.wxPayParams;
      uni.requestPayment({
        'timeStamp': params.timeStamp,
        'nonceStr': params.nonceStr,
        'package': params.package,
        'signType': params.signType,//'MD5',
        'paySign': params.paySign,
        success: (res) =>{
          // 成功替换跳转到h5结果页面
          const link = encodeURIComponent(params.redirectUrl);
          this.$redirectTo(`/pages/webview/webview?link=${link}`);
        },
        fail: (err) => this.$back(),
        complete: (res) => {
          if(res.errMsg=='requestPayment:fail cancel') {
              // 用户取消返回上一页
              this.$back();
          }
        }
      })
    }
  },
};
</script>

<style scoped lang="scss">
.qianZhuPay {
  width: 100vw;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
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
