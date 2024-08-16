<template>
<van-popup
  :show="isShow"
  @close="close"
  custom-style="background-color: transparent;overflow:visible;"
  :close-on-click-overlay="true"
  :z-index="100"
  :catchtouchmove="true"
>
  <!-- 新人专享大礼包 -->
  <view class="dia_con" v-if="diaImage">
    <image class="dia_close" src="https://file.y1b.cn/store/1-0/24131/65ba395cf1ec7.png" mode="aspectFit" @click="close"></image>
    <image class="dia_con-bg" mode="aspectFit"
      :src="diaImage" @click="openLinkHandle"
    ></image>
  </view>
  <view class="type_cont-box" v-else>
    <view class="type_cont" @click="openLinkHandle">
      <view class="type_cont-title ">{{ config.title }}</view>
      <view class="cont_shop">
        <van-image width="360rpx" fit="widthFix"
          :src="config.goods_image" radius="16px"
          use-loading-slot class="cont_shop-img"
        ><van-loading slot="loading" type="spinner" size="20" vertical />
        </van-image>
        <view class="shop_price">
          <image class="shop_price-icon" src="https://file.y1b.cn/store/1-0/24710/668e0403bb19d.png"
          mode="aspectFit"></image>
          <view class="shop_price-num">{{ config.price }}</view>
        </view>
        <image class="pay_away-icon" src="https://file.y1b.cn/store/1-0/24710/668e05087c6f2.png"
        mode="aspectFit" v-if="config.after_pay"
        ></image>
      </view>
      <view class="type_lab txt_ov_ell2">{{ config.goods_name }}</view>
      <image class="type_btn" src="https://file.y1b.cn/store/1-0/24710/668e05ea9df09.png"
        mode="aspectFit"></image>
    </view>
    <image class="dia_close" src="https://file.y1b.cn/store/1-0/24131/65ba395cf1ec7.png"
    mode="aspectFit" @click="close"></image>
  </view>
</van-popup>
</template>

<script>
import goDetailsFun from '@/utils/goDetailsFun';
export default {
  mixins: [goDetailsFun],
  computed: {
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    diaId: {
      type: Number,
      default: 0
    },
    diaImage: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      default: null
    }
	},
  data() {
    return { };
  },
  mounted() {
  },
  methods: {
    close() {
      console.log('close')
      this.$emit("close");
    },
    async openLinkHandle() {
      if(!this.config) return;
      let { appid: appId, lx_type, path } = this.config;
      this.$emit("openLink");
      if(lx_type > 1) return this.$openEmbeddedMiniProgram({ appId, path });
      // 进行心链链接的跳转;
      this.requestGoodXq_mixins(this.diaId, 1);
    }
  },
};
</script>

<style lang="scss">
.dia_con {
  position: relative;
  z-index: 0;
  text-align: center;
  width: 494rpx;
  height: 640rpx;
  .dia_close {
    position: absolute;
    right: -28rpx;
    top: -80rpx;
  }
  .dia_con-bg {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .dia_con-btn {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 6rpx;
    width: 390rpx;
    height: 130rpx;
  }
}
.dia_close {
  width: 56rpx;
  height: 56rpx;
}
/* 文本超出隐藏 */
@mixin text-ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.type_cont-box {
  position: relative;
  width: 526rpx;
  padding-top: 168rpx;
  // overflow: hidden;
  // height: 820rpx;
  z-index: 0;
  .dia_close {
    display: block;
    margin: 82rpx auto 0;
  }
  &::before {
    content: '\3000';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 274rpx;
    background: url("https://file.y1b.cn/store/1-0/24710/668dfcf718bdc.png")  0 0 / 100% 100% no-repeat;
    z-index: -1;
  }
}
.type_cont {
  width: 100%;
  position: relative;
  z-index: 0;
  // margin-top: 168rpx;
  padding-top: 34rpx;
  &::before {
    content: '\3000';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("https://file.y1b.cn/store/1-0/24710/668dfdcc95e8b.png")  0 0 / 100% 100% no-repeat;
    z-index: -1;
  }
  &-title {
    width: 410rpx;
    height: 86rpx;
    border-radius: 54rpx;
    margin: 0 auto;
    font-size: 36rpx;
    text-align: center;
    color: #fff;
    line-height: 86rpx;
    position: relative;
    z-index: 0;
    font-weight: bold;
    @include text-ellipsis;
    &::before {
      content: '\3000';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url("https://file.y1b.cn/store/1-0/24710/668dff0ab7863.png")  0 0 / 100% 100% no-repeat;
      z-index: -1;
    }
  }
  .cont_shop {
    width: 392rpx;
    background: #fbede5;
    border-radius: 36rpx;
    box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(0,0,0,0.12);
    margin: 17rpx auto 0;
    overflow: hidden;
    &-img {
      margin: 16rpx auto 0;
      width: 360rpx;
      display: block;
    }
  }
  .shop_price {
    margin: 10rpx 0;
    display: flex;
    justify-content: center;
    align-items: center;
    &-icon{
      width: 104rpx;
      height: 40rpx;
    }
    &-num {
      font-size: 48rpx;
      font-weight: bold;
      text-align: center;
      color: #e34615;
      line-height: 50rpx;
      &::before {
        content: '￥';
        font-size: 36rpx;
      }
    }
  }
  .pay_away-icon {
    width: 176rpx;
    height: 38rpx;
    display: block;
    margin: 0 auto;
  }
}
.type_lab {
  font-size: 30rpx;
  font-weight: bold;
  text-align: center;
  color: #fff;
  line-height: 42rpx;
  margin: 24rpx 42rpx 0;
}
.type_btn {
  width: 406rpx;
  height: 88rpx;
  display: block;
  margin: 0 auto;
  transform: translateY(24rpx);
}
</style>
