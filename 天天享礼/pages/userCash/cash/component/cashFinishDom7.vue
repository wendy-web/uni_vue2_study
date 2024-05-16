<template>
<view class="activity" id="cashFinishDom7Ref">
  <image src="https://test-file.y1b.cn/store/1-0/2436/65e7c3dc5f7de.png" mode="scaleToFill" class="act_img"></image>
  <view class="act_box ">
    <image src="https://test-file.y1b.cn/store/1-0/2436/65e7c4a2f147c.png" mode="scaleToFill" class="act_icon"></image>
    <view class="act_text">
      <image src="https://test-file.y1b.cn/store/1-0/2436/65e7ddeb147da.png" mode="scaleToFill" class="act_txt-icon"></image>
    </view>
  </view>
</view>
</template>

<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
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
    margin: 22rpx auto 45rpx;
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
}
</style>
