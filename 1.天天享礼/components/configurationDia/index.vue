<template>
<view class="dia_box">
<van-popup
    :show="isShow"
    custom-style="background-color: transparent;overflow:visible;"
    :z-index="100"
    :catchtouchmove="true"
>
    <view class="dia_cont ani_active">
        <image class="close_icon" mode="scaleToFill"
            src="https://file.y1b.cn/store/1-0/23118/654b29f0188a0.png"
            @click="popupClose"
        ></image>
        <van-image
            width="750rpx"
            :src="config.image"
            fit="widthFix"
            use-loading-slot
            @click="popoverRember"
            v-if="config.image"
        >
            <van-loading slot="loading" type="spinner" size="20" vertical />
        </van-image>
        <!-- 京东商品 - 无图片的状态 -->
        <view class="dia_com" v-else>
            <view class="cont_title">
              {{ config.jd_word || '天降神券' }}
            </view>
            <view class="cont_timer">
            距失效
            <van-count-down
                @finish="countFinished"
                :time="remainTime"
                millisecond
                use-slot
                format="mm:ss"
                @change="onChangeHandle"
                class="cd_time-con"
            >
                <text class="item">{{ timeData.minutes }}:</text>
                <text class="item">{{ timeData.seconds }}</text>
                <text class="item item_mil">{{ timeData.milliseconds }}</text>
            </van-count-down>
            </view>
            <view class="cont_box" @click="popoverRember">
            <image class="bg_img" src="https://file.y1b.cn/store/1-0/23714/64b0a3e8d8ec8.png" mode="scaleToFill"></image>
            <image class="shop_img" :src="config.jdImage" mode="scaleToFill"></image>
            <view class="cont_txt txt_ov_ell1">{{ config.skuName }}</view>
            <view class="face_value">
                <image class="bg_img" src="https://file.y1b.cn/store/1-0/23714/64b0a4064af05.png" mode="scaleToFill"></image>
                <view>
                <text style="font-size: 48rpx">{{ config.discount }}</text>元
                </view>
                <view> 专属优惠券 </view>
            </view>
            <view class="cont_btn">
                <image class="btn_txt" :src="imgUrl+'static/component/btn_txt.png'" mode="scaleToFill"></image>
            </view>
            </view>
        </view>
    </view>
</van-popup>
</view>
</template>
<script>
import { getImgUrl } from '@/utils/auth.js';
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["gift", "userInfo"]),
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    showList: {
      type: Array,
      default: []
    },
    config: {
      type: Object,
      default: {}
    },
    remainTime: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
		  imgUrl: getImgUrl(),
      timeData: {},
      isFinShed: false
    };
  },
  methods: {
    ...mapActions({
      getUserInfo: 'user/getUserInfo',
    }),
    resetTime() {
      // 时间重置
      const countDown = this.selectComponent('.cd_time-con');
      countDown && countDown.reset();
      this.isFinShed = true;
    },
    onChangeHandle(event) {
      let {
        hours,
        minutes,
        seconds,
        milliseconds,
        days
      } = event.detail;
      hours = hours < 10 ? '0' + hours : hours
      minutes = minutes < 10 ? '0' + minutes : minutes
      seconds = seconds < 10 ? '0' + seconds : seconds
      milliseconds = Math.floor(milliseconds/100);
      // milliseconds = milliseconds < 10 ? '0' + milliseconds : milliseconds;
      this.timeData = {
        hours,
        minutes,
        seconds,
        milliseconds,
        days
      }
    },
    countFinished() {
      if(!this.config.image && (this.config.type == 6 || this.config.type == 12) && this.isFinShed){
        this.$emit('close', this.config.id);
      }
    },
    popupClose() {
      this.$emit('close', this.config.id, true, true);
    },
    popoverRember() {
      this.$emit('popoverRember', this.config);
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
    .dia_com{
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
  .dia_img {
    width: 750rpx;
  }
  .close_icon {
    position: absolute;
    width: 60rpx;
    height: 60rpx;
    left: 50%;
    transform: translateX(-50%);
    bottom: -90rpx;
    z-index: 1;
  }
  .cont_title{
    width: 714rpx;
    height: 220rpx;
    position: relative;
    z-index: 0;
    font-size: 68rpx;
    font-weight: 900;
    text-align: center;
    color: #fff8df;
    line-height: 220rpx;
    text-shadow: 2rpx 2rpx 0rpx 0rpx #be9500;
    &::before {
      content: '\3000';
      background: url("https://file.y1b.cn/store/1-0/23714/64b0a3bca02c5.png") 0 0 / 100% 100%;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
  }
  .cont_timer {
    font-size: 32rpx;
    font-weight: 600;
    text-align: center;
    color: #ffffff;
    line-height: 44rpx;
    display: flex;
    justify-content: center;
    margin-top: -22rpx;
    .cd_time-con{
      text-align: left;
      margin-left: 5rpx;
			min-width: 130rpx;
      // background: gray;
    }
    .item {
      font-size: 32rpx;
      color: #ffffff;
      line-height: 48rpx;
    }
    .item_mil{
      font-size: 24rpx;
      margin-left: 5rpx;
    }
  }
  .bg_img{
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
.cont_box {
  width: 622rpx;
  height: 622rpx;
  position: relative;
  z-index: 0;
  margin-top: 114rpx;
  padding: 0 56rpx;
  box-sizing: border-box;
  .shop_img {
    width: 240rpx;
    height: 240rpx;
    background: #d8d8d8;
    border-radius: 16rpx;
    margin-top: -74rpx;
  }
  .cont_txt {
    height: 42rpx;
    font-size: 30rpx;
    font-weight: 600;
    text-align: center;
    color: #333333;
    line-height: 42rpx;
    margin-top: 24rpx;
  }
  .face_value {
    width: 510rpx;
    margin: auto;
    margin-top: 42rpx;
    height: 138rpx;
    position: relative;
    z-index: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 28rpx;
    font-weight: 600;
    color: #ef2b20;
    line-height: 66rpx;
  }
  .cont_btn {
    width: 510rpx;
    height: 88rpx;
    background: linear-gradient(135deg,#f2554d, #f04037);
    border-radius: 8rpx;
    position: relative;
    z-index: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 74rpx;
    .btn_txt{
      width: 142rpx;
      height: 34rpx;
    }
  }
}
</style>
