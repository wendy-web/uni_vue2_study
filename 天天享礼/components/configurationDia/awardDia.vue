<template>
  <view class="dia_box">
    <van-popup
      :show="isShow"
      @close="popupClose"
      custom-style="background-color: transparent;overflow:visible;"
      :z-index="100"
      :catchtouchmove="true"
    >
      <view class="dia_cont fl_al_start ani_active">
        <image class="bg_img" :src="imgUrl + 'static/component/bg.png'"  mode="scaleToFill"></image>
		    <image class="close_icon" :src="imgUrl +'static/component/close_icon_1.png'" mode="scaleToFill"
        @click="popupClose"
        ></image>
        <view class="cont_box fl_col_cen" @click="awardHandle">
          <image class="shop_img" :src="config.image || config.jdImage" mode="scaleToFill"></image>
          <view class="cont_txt txt_ov_ell1">{{ config.skuName || config.title }} </view>
          <view class="face_value">
            <image class="bg_img" :src="imgUrl +'static/component/price_bg.png'" mode="scaleToFill"></image>
            <image class="face_icon-left" :src="imgUrl +'static/component/face_icon-left.png'" mode="scaleToFill"></image>
            <image class="face_icon-right" :src="imgUrl +'static/component/face_icon-right.png'" mode="scaleToFill"></image>
            <view>
              <text style="font-size: 48rpx">{{ discounts_num }}</text>元
            </view>
            <view> 专属优惠券 </view>
          </view>
          <view class="cont_btn">
            <view class="btn_txt" >
              <image class="bg_img" :src="imgUrl +'static/component/award_btn.png'" mode="scaleToFill"></image>
              {{config.btn_name || '去领券' }}
            </view>
          </view>
        </view>
      </view>
    </van-popup>
  </view>
</template>

<script>
import { getImgUrl } from '@/utils/auth.js';
import goDetailsFun from '@/utils/goDetailsFun';
import { mapGetters, mapMutations } from "vuex";
export default {
  mixins: [goDetailsFun],
  computed: {
    ...mapGetters(["gift", "userInfo"]),
    discounts_num() {
      if(this.config) {
        const num = this.config.discount || this.config.face_value;
        return Math.floor(num);
      }
      return 0;
    }
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    config: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
        imgUrl: getImgUrl(),
        timeData: {},
        isFinShed: true
    };
  },
  mounted() {
  },
  methods: {
    ...mapMutations({
      delCurrentDiaList: "user/delCurrentDiaList",
    }),
    popupClose() {
      this.$emit('close');
    },
    awardHandle() {
      // is_popover 不扣取牛金豆
      this.detailsFun_mixins({
        ...this.config,
        is_popover: 1
      }, {});
      this.delCurrentDiaList("award");
      this.$emit('award');
    }
  },
};
</script>

<style lang="scss">
.dia_box {
  position: relative;
  .dia_cont {
    position: relative;
    text-align: center;
    z-index: 0;
    width: 750rpx;
    height: 1048rpx;
  }
  .close_icon {
    position: absolute;
    width: 64rpx;
    height: 64rpx;
    bottom: 0;
    z-index: 1;
  }
}
.cont_box {
  width: 582rpx;
  height: 716rpx;
  position: relative;
  box-sizing: border-box;
  background: rgba(255,255,255,0.60);
  border-image: linear-gradient(161deg, rgba(255,255,255,0.80) 19%, rgba(255,255,255,0.00) 78%) 0.8 0.8;
  border-radius: 32rpx;
  z-index: 0;
  margin-top: 174rpx;
  padding: 18rpx;
  box-sizing: border-box;
  &::before {
    content: '\3000';
    position: absolute;
    z-index: -1;
    top: 18rpx;
    right: 18rpx;
    bottom: 18rpx;
    left: 18rpx;
    background: #fff;
    border-radius: 32rpx;
  }
  .shop_img {
    width: 240rpx;
    height: 240rpx;
    border-radius: 16rpx;
    background: #d8d8d8;
    margin-top: 50rpx;
  }
  .cont_txt {
    width: 100%;
    padding: 0 36rpx;
    height: 42rpx;
    font-size: 30rpx;
    font-weight: 600;
    text-align: center;
    color: #333333;
    line-height: 42rpx;
    margin-top: 32rpx;
    box-sizing: border-box;
  }
  .face_value {
    width: 510rpx;
    margin: auto;
    margin-top: 40rpx;
    height: 148rpx;
    position: relative;
    z-index: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 28rpx;
    font-weight: 900;
    color: #fff;
    line-height: 66rpx;
    .face_icon-left{
      width: 82rpx;
      height: 80rpx;
      position: absolute;
      bottom: -2px;
      left: -20rpx;
    }
    .face_icon-right{
      width: 158rpx;
      height: 100rpx;
      position: absolute;
      bottom: -2px;
      right: -47rpx;
    }
  }
  .cont_btn {
    height: 152rpx;
    background: #fff;
    border-radius: 0 0 28rpx 28rpx;
    position: absolute;
    bottom: 18rpx;
    left: 18rpx;
    right: 18rpx;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    .btn_txt{
      width: 362rpx;
      height: 88rpx;
      font-size: 38rpx;
      font-weight: 900;
      text-align: center;
      color: #ffeee1;
      line-height: 88rpx;
      position: relative;
      z-index: 0;
    }
  }
}
</style>
