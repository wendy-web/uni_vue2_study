<template>
<view @touchmove.stop>
  <van-popup
    :show="isShow"
    round
    custom-style="background: transparent;overflow:visible;"
    @close="close"
    :root-portal="true"
    z-index="100"
    :lock-scroll="true"
    @touchmove.native.stop.prevent
  >
    <image class="dia_close" src="https://file.y1b.cn/store/1-0/24131/65ba395cf1ec7.png" mode="aspectFit" @click="close"></image>
    <van-image
      width="628rpx"
      height="1180rpx"
      :src="showImage"
      fit="contain"
      use-loading-slot
      use-error-slot
      :show-menu-by-longpress="true"
    >
      <van-loading slot="loading" type="spinner" size="20" vertical />
      <van-icon slot="error" color="#edeef1" size="120" name="photo-fail" />
    </van-image>
    <view class="cont_lab">长按图片，转发好友</view>
    <painter
      customStyle="width:612px;height:1184px;position:fixed;bottom:-10000px;z-index:-10000;"
      @imgOK="onImgOk"
      @imgErr="imgErr"
      :palette="template"
      :dirty="true"
    />
  </van-popup>
</view>
</template>
<script>
import palette from './palette.js';
export default {
  props:{
    isShow: {
			type: Boolean,
			default: false
		},
    codeUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      template: null,
      showImage: ''
    };
  },
  watch: {
    codeUrl(newValue) {
      if(newValue) {
        this.template = palette({
          codeUrl: this.codeUrl
        })
      }
    }
  },
  methods: {
    saveHandle () {
      wx.saveImageToPhotosAlbum({filePath:this.showImage,success() {
        uni.showToast({
          icon:'none',
          title:'图片保存成功，可前往本地查看'
        })
      }})
    },
    onImgOk (event) {
      this.showImage = event.mp.detail.path || event.target.path;
    },
    imgErr(err){
      console.log(err)
    },
    close() {
      this.$emit("close");
    },
    confirm() {
      this.$emit("confirm");
    }
  },
};
</script>
<style lang="scss">
.dia_close {
  width: 44rpx;
  height: 44rpx;
  display: block;
  margin: 80rpx 0 22rpx auto;
}
.cont_lab{
  font-size: 32rpx;
  text-align: center;
  color: #ffffff;
  line-height: 44rpx;
  margin-top: 27rpx;
}
</style>
