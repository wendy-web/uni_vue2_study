<template>
<van-popup
  :show="isShow"
  round
  custom-style="background: transparent;overflow:visible;"
  :root-portal="true"
  z-index="100"
  :lock-scroll="true"
  :catchtouchmove="true"
  @close="closeHandle"
>
  <view class="dia_box ani_active">
    <image class="dia_close" src="https://file.y1b.cn/store/1-0/24131/65ba395cf1ec7.png" mode="aspectFit" @click="closeHandle"></image>
    <swiper class="good-img"
      :autoplay="false" :interval="2000"
      :duration="300" :circular="true"
      :current="bannerIndex"
      @change="bannerSwiperChange"
      :style="{ height: 560 + 'px', width: screenWidth + 'px'}"
      @click="closeHandle"
    >
      <swiper-item class="item_box" v-for="(item, idx) in showImgList" :key="idx">
        <van-image
          :src="item.url"
          use-loading-slot
          width="100%" height="100%"
          :show-menu-by-longpress="true"
					fit="widthFix"
          custom-class="van_img"
          image-class="show_img"
          radius='12px'
        ><van-loading slot="loading" type="spinner" size="20" vertical />
        </van-image>
      </swiper-item>
    </swiper>
    <view class="img_guide fl_bet" @click="closeHandle">
      <view>{{ bannerIndex + 1 }} / {{ showImgList.length }}</view>
      <view class="save_btn" @click.stop="saveHandle">保存到相册</view>
    </view>
  </view>
</van-popup>
</template>
<script>
export default {
  props:{
    isShow: {
			type: Boolean,
			default: false
		},
    showImgList: {
      type: Array,
      default: []
    },
    selCurrentIndex: {
      type: Number,
      default: 0
    }
  },
  data(){
    return {
      screenWidth: 375, // 屏幕宽度
      screenHeight: 375,
      bannerIndex: 0
    }
  },
  watch: {
    isShow(newVal, oldVal) {
      if(!newVal) return;
      this.bannerIndex = this.selCurrentIndex;
    }
  },
  mounted() {
    // 获取屏幕宽度
    let system = uni.getSystemInfoSync();
    this.screenWidth = system.screenWidth || 375;
    this.screenHeight = this.screenWidth - uni.upx2px(108)
  },
  methods: {
    closeHandle() {
      this.$emit("close");
    },
    bannerSwiperChange(event) {
      this.bannerIndex = event.detail.current;
    },
    saveHandle() {
      const showUrl = this.showImgList[this.bannerIndex].url;
      if(!this.bannerIndex) {
        this.$saveImageToPhotosAlbum(showUrl);
        return;
      }
      uni.downloadFile({
        url: showUrl,
        complete: (res) => {
          console.log('res', res)
          if (res.statusCode !== 200) return;
          this.$saveImageToPhotosAlbum(res.tempFilePath);
        }
      });
    }
  },
}
</script>

<style lang="scss">
.dia_box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  position: relative;
  .dia_close{
    width: 56rpx;
    height: 56rpx;
    // margin: 0 auto;
    position: absolute;
    top: -80rpx;
    right: 54rpx;
  }
}
.ani_active {
  transform: scale(0);
  animation: openAni .3s linear 0s forwards;
}
.item_box {
  padding: 0 54rpx;
  box-sizing: border-box;
}
.img_guide {
  padding: 0 54rpx;
  font-size: 40rpx;
  color: #fff;
  line-height: 56rpx;
  margin-top: 32rpx;
  .save_btn{
    line-height: 74rpx;
    background: rgba(255,255,255,0.12);
    border: 2rpx solid #fff;
    border-radius: 50rpx;
    padding: 0 32rpx;
  }
}
.van_img {
  display: flex;
  .show_img {
    margin: auto !important;
    border-radius: 24rpx;
  }
}
</style>
