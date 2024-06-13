<template>
<view class="activity" id="cashFinishDom7Ref">
  <image src="https://test-file.y1b.cn/store/1-0/2436/65e7c3dc5f7de.png" mode="scaleToFill" class="act_img"></image>
  <view class="act_box">
    <image src="https://test-file.y1b.cn/store/1-0/2436/65e7c4a2f147c.png" mode="scaleToFill" class="act_icon"></image>
    <view class="act_text">
      <image src="https://test-file.y1b.cn/store/1-0/2436/65e7ddeb147da.png" mode="scaleToFill" class="act_txt-icon"></image>
    </view>
    <view class="scan_btn" v-if="isShowScan" @click="scanHandle">立即扫码</view>
  </view>
</view>
</template>

<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    isShowScan: {
      type: [Number, Boolean],
      default: 0
    }
  },
  data() {
    return {
    };
  },
  mounted() {
    this.$nextTick(()=> setTimeout(() => this.domFun(), 1000));
  },
  methods: {
    scanHandle() {
      var regex = /HTTP:\/\/4XV\.CN/;
      wx.scanCode({
        success: (res) => {
          console.log('res', res)
          const { result } = res;
          if (regex.test(result)) {
            console.log("字符串匹配成功");
            this.$emit('scanResult')
            return;
          }
          setTimeout(() => this.$toast('请扫中国红牛拉环码'), 500);
          console.log("字符串匹配失败");
        },
        fail: (error) => {
          setTimeout(() => this.$toast('请扫中国红牛拉环码'), 500);
          console.log('error', error);
        }
      });
    },
    domFun(){
      this.initWarpRect('cashFinishDom7Ref').then(res=> {
        this.$emit('cashFinishDom7Ref', res);
      });
    },
    initWarpRect(id) {
      return new Promise(resolve => {
        setTimeout(() => { // 延时确保dom已渲染, 不使用$nextclick
          let query = uni.createSelectorQuery();
          // #ifndef MP-ALIPAY
          query = query.in(this) // 支付宝小程序不支持in(this),而字节跳动小程序必须写in(this), 否则都取不到值
          // #endif
          query.select('#' + (id || this.viewId)).boundingClientRect(data => {
            resolve(data)
          }).exec();
        }, 20)
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.activity {
  overflow: hidden;
  padding: 0 20rpx;
  .act_img {
    width: 244rpx;
    height: 36rpx;
    display: block;
    margin: 40rpx auto 0;
  }
}
.act_box {
  position: relative;
  margin: 40rpx auto;
  z-index: 0;
  overflow: hidden;
  text-align: center;
  &::before {
    content: '\3000';
    background: url("https://test-file.y1b.cn/store/1-0/2436/65e7c56c9a2b1.png") 0 0 / 100% 100%;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  .act_icon {
    width: 144rpx;
    height: 134rpx;
    display: block;
    margin: 12rpx auto 0;
  }
  .act_txt-icon {
    width: 544rpx;
    height: 44rpx;
  }
  .act_text{
    display: inline-block;
    margin: 22rpx auto 50rpx;
    position: relative;
    &::before {
      content: '\3000';
      background: url("https://test-file.y1b.cn/store/1-0/2436/65e7c6a6e52e1.png") 0 0 / cover;
      position: absolute;
      bottom: -10rpx;
      right: 176rpx;
      width: 148rpx;
      height: 26rpx;
    }
  }
  .scan_btn {
    width: 550rpx;
    height: 80rpx;
    line-height: 80rpx;
    background: url("https://file.y1b.cn/store/1-0/24612/666917d208690.png") 0 0 / cover;
    // background: #f84842;
    border-radius: 10rpx;
    font-size: 28rpx;
    text-align: center;
    color: #fff;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 30rpx;
    &::before {
      content: '\3000';
      background: url("https://file.y1b.cn/store/1-0/24612/66691821a86af.png") 0 0 / cover;
      width: 28rpx;
      height: 28rpx;
      display: inline-block;
      margin-right: 6rpx;
    }
  }
}
</style>
