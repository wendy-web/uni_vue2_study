
<template>
<view class="qianZhuPay" ref="qianZhuPayRef">
  <!-- <button class="btn" @click="toQzMini">方式二 跳转千猪支付</button> -->
  <view class="gift_box">
    <image class="dis_gift-icon" src="https://file.y1b.cn/store/1-0/23714/64b0a196d3e63.png" mode="aspectFill"></image>
    <view class="dis_gift_btn" @click="toQzMini">去支付</view>
  </view>
</view>
</template>

<script>
import {
jumpLink,
qianzhuOrder
} from '@/api/modules/discounts.js';
export default {
  components: {},
  data() {
    return {
      source:'',
      orderNo: '',
      orderParam:'',
      orderInfoUrl:'',
      token: '',
      isGoOrderInfoUrl: 0,
      bgColor: '#F84842',
      type: 0,
      isShowGiftBtn: false
    }
  },
  onLoad(options) {
    // 来源, 订单编号,订单类型,订单详情页地址
    if(options) {
      const {source , orderNo ,orderParam ,orderInfoUrl, token } = options;
      this.source = source;
      this.orderNo = orderNo;
      this.orderParam = orderParam;
      this.orderInfoUrl = orderInfoUrl;
      this.token = token;
      // this.toQzMini();
      this.sourceFun();
    }
  },
  onShow() {
    this.getOrder();
    if((this.isGoOrderInfoUrl == 1) && this.orderInfoUrl) {
      this.isGoOrderInfoUrl = 2;
      uni.navigateTo({
        url: `/pages/webview/webview?link=${this.orderInfoUrl}&bgColor=${this.bgColor}`
      });
    } else if(this.isGoOrderInfoUrl == 2) {
      jumpLink({
        type: this.type,
        page: 'list',
        status: 1,
      }).then((res) => {
        this.isGoOrderInfoUrl = 3;
        const link = res.data.url;
        uni.navigateTo({
          url: `/pages/webview/webview?link=${encodeURIComponent(link)}&bgColor=${this.bgColor}`
        });
      });
    } else if(this.isGoOrderInfoUrl == 3) {
      uni.reLaunch({
        url:'/pages/tabBar/discounts/index'
      });
    }
  },
  computed: {},
  methods: {
    getOrder() {
      qianzhuOrder();
    },
    sourceFun() {
      const source = this.source;
      switch(source) {
        case 'CINEMA':
          this.bgColor ='#FCDB28';
          this.type = 1;
          break;
        case 'KFC':
          this.bgColor ='#c3102f';
          this.type = 2;
          break;
        case 'STARBUCKS':
          this.bgColor ='#006442';
          this.type = 3;
          break;
      }
    },
    // 跳转千猪支付
    toQzMini(){
        const that = this;
        let path = "/pages/pay/pay";
        let query = `?pageType=1&token=${this.token}&orderNo=${this.orderNo}&orderType=${this.orderParam}&isTest=false`;
        let openMiniProgram = uni.navigateToMiniProgram;
        if(uni.canIUse('openEmbeddedMiniProgram')) {
          openMiniProgram =  uni.openEmbeddedMiniProgram;
        }
        openMiniProgram({
          appId:"wx8820200042415db1",
          path:`${path}${query}`,
          success(res) {
            that.isGoOrderInfoUrl = 1;
          },
          fail(error) {
          },
          complete(res) {
            if (/cancel/g.test(res.errMsg)) {
              that.isGoOrderInfoUrl = 2;
              uni.navigateTo({
                url: `/pages/webview/webview?link=${that.orderInfoUrl}&bgColor=${that.bgColor}`
              });
            }
          }
        });
    },
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
