<template>
<view class="dia_box">
<van-popup
    :show="isShow"
    custom-style="background-color: transparent;overflow:visible;"
    :z-index="100"
    :catchtouchmove="true"
    :overlay-style="overlayStyle"
>
    <view class="dia_cont ani_active">
        <image :class="config && [[3, 4].includes(config.show_type) ? 'close_icon-top' : 'close_icon-bottom']" mode="scaleToFill"
          src="https://file.y1b.cn/store/1-0/23118/654b29f0188a0.png"
          @click="popupClose"
        ></image>
        <!-- 抽奖福利 -->
        <view v-if="config.show_type == 4" class="order_cont gift_cont" @click="popoverRember">
          <image class="order_gift-bg" src="https://file.y1b.cn/store/1-0/24514/664305e808e33.png" ></image>
          <view class="image_list">
            <image class="image_item"
              v-for="(item, index) in config.headImgArr" :key="index" :src="item"
            ></image>
          </view>
          <view class="succ_num">附近1w+人参与</view>
          <view class="order_rem"><text style="color: #F0433A;">【{{config.region}}】</text>用户专属福利</view>
          <image class="order_gift-icon" src="https://file.y1b.cn/store/1-0/24514/6643043477a15.png" ></image>
          <view class="order_btn">点我抽奖</view>
          <view class="order_time fl_center">距失效
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
              <text class="item">{{ timeData.seconds }}. </text>
              <text class="item item_mil">{{ timeData.milliseconds }}</text>
            </van-count-down>
          </view>
        </view>
        <view v-else-if="config.show_type == 3" class="order_cont">
          <view class="image_list">
            <image class="image_item" v-for="(item, index) in config.headImgArr" :key="index" :src="item"
            ></image>
          </view>
          <view class="succ_num">{{ config.buyNum }}人已下单成功</view>
          <view class="order_rem">该商品可0元下单</view>
          <view class="order_info fl_bet">
            <image class="good-img" mode="aspectFit" :src="config.jdImage"></image>
            <view class="order_info-right">
              <view class="txt_ov_ell1"> {{ config.skuName }} </view>
              <view class="order_lab-box box_fl">
                <view class="com_lab">{{config.discount || 0}}元券</view><view class="use_lab">先用后付</view>
              </view>
            </view>
          </view>
          <view class="order_btn" @click="popoverRember">去0元下单</view>
          <view class="order_time fl_center">距失效
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
              <text class="item">{{ timeData.seconds }}. </text>
              <text class="item item_mil">{{ timeData.milliseconds }}</text>
            </van-count-down>
          </view>
        </view>
        <!-- 京东商品 - 无图片的状态 -->
        <view class="dia_com" v-else-if="config.show_type == 2 || !config.image">
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
            <view class="cont_txt">
              <image class="cont_txt-icon" src="https://test-file.y1b.cn/store/1-0/24321/65fbdda4a2ee6.png"
              mode="heightFix" v-if="config.after_pay"></image>
              <view class="cont_txt-fl txt_ov_ell1">
                {{ config.skuName }}
              </view>
            </view>
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
        <view class="img_box" v-else>
          <van-image width="750rpx" fit="widthFix"
            :src="config.image"
            use-loading-slot
            @click="popoverRember"
          >
            <van-loading slot="loading" type="spinner" size="20" vertical />
          </van-image>
          <view class="bar_box" v-if="config.headImgArr" @click="popoverRember">
            <vastwu-barrage width="750rpx" height="200rpx" ref="vBarrage"></vastwu-barrage>
          </view>
        </view>
        <view class="order_time fl_center" v-if="config.headImgArr && config.show_type == 1"> 距结束
          <van-count-down
            @finish="countFinished"
            :time="remainTime"
            millisecond
            use-slot
            format="mm:ss"
            @change="onChangeHandle"
            class="cd_time-con"
          >
            <text class="item">{{ timeData.minutes || 0 }}:</text>
            <text class="item">{{ timeData.seconds || 0 }}. </text>
            <text class="item item_mil">{{ timeData.milliseconds || 0 }}</text>
          </van-count-down>
        </view>
    </view>
</van-popup>
</view>
</template>
<script>
import { getImgUrl } from '@/utils/auth.js';
import { mapActions, mapGetters } from "vuex";
import vastwuBarrage from './vastwu-barrage/vastwu-barrage.vue';
export default {
  components:{vastwuBarrage},
  computed: {
    ...mapGetters(["gift", "userInfo"]),
    overlayStyle() {
      if(!this.config) return;
      let opacity = this.config.opacity;
      if(!opacity && opacity != 0) return;
      opacity = (opacity/100).toFixed(2);
      return `background-color: rgba(0,0,0, ${opacity});`
    }
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
  watch: {
    isShow(newValue) {
      if(!this.$refs.vBarrage) return;
      if((!newValue || !this.config.headImgArr)) return this.$refs.vBarrage.clearTimer();
      setTimeout(() => this.config.headImgArr && this.$refs.vBarrage.init(this.config.headImgArr), 1500);
    }
  },
  data() {
    return {
		  imgUrl: getImgUrl(),
      timeData: {},
      isFinShed: false,
    };
  },
  onLoad(options) {
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
      // return
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
      if(!this.isFinShed || !this.config) return;
      if([2, 3].includes(this.config.show_type) || this.config.headImgArr) {
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
  .close_icon-bottom {
    position: absolute;
    width: 60rpx;
    height: 60rpx;
    left: 50%;
    transform: translateX(-50%);
    bottom: -90rpx;
    z-index: 1;
    &.active {
      left: none;
      right: -30rpx;
      transform: initial;
      top: -120rpx;
      bottom: none;
    }
  }
  .close_icon-top {
    position: absolute;
    width: 60rpx;
    height: 60rpx;
    z-index: 1;
    right: -30rpx;
    top: -120rpx;
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
    color: #333;
    line-height: 42rpx;
    margin-top: 24rpx;
    display: flex;
    align-items: center;
    .cont_txt-icon {
      width: 120rpx;
      height: 30rpx;
      margin-right: 10rpx;
    }
    .cont_txt-fl{
      flex: 1;
    }
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
.order_cont{
  width: 622rpx;
  background: #fff;
  border-radius: 40rpx;
  box-sizing: border-box;
  position: relative;
  padding: 46rpx 32rpx 32rpx;
  &.gift_cont {
    z-index: 0;
    .order_gift-bg {
      width: 704rpx;
      height: 282rpx;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
    .order_btn {
      margin-top: 22rpx;
    }
  }

  .image_list {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 32rpx;
    position: relative;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    .image_item {
      width: 80rpx;
      height: 80rpx;
      background: #d8d8d8;
      border: 2rpx solid #fff;
      border-radius: 50%;
      margin-right: -30rpx;
    }
  }
  .succ_num {
    font-size: 26rpx;
    text-align: center;
    color: #666;
    line-height: 36rpx;
  }
  .order_rem {
    font-size: 36rpx;
    font-weight: bold;
    text-align: center;
    color: #333;
    line-height: 50rpx;
    margin-top: 32rpx;
  }
}
.order_gift-icon {
  width: 224rpx;
  height: 178rpx;
  margin-left: -80rpx;
  margin-top: 30rpx;
}
.order_info {
  margin-top: 32rpx;
  background: #f4f6f9;
  border-radius: 16rpx;
  padding: 8rpx;
  .good-img {
    width: 136rpx;
    height: 136rpx;
    flex: 0 0 136rpx;
    border-radius: 16rpx;
    margin-right: 20rpx;
    background: #888;
  }
  .order_info-right {
    flex: 1;
    width: 0;
    .order_lab-box{
      margin-top: 22rpx;
      .com_lab{
        font-size: 26rpx;
        font-weight: bold;
        color: #f04037;
        line-height: 36rpx;
        padding: 0 10rpx;
        position: relative;
        z-index: 0;
        margin-right: 14rpx;
        &::before {
          content: '\3000';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url("https://file.y1b.cn/store/1-0/24424/662878f0b3b0e.png") 0 0 / 100% 100% no-repeat;
        }

      }
      .use_lab{
        font-size: 26rpx;
        font-weight: bold;
        text-align: center;
        color: #2faa5e;
        line-height: 36rpx;
        padding: 0 6rpx;
        width: 148rpx;
        height: 32rpx;
        border: 2rpx solid #07c160;
        border-radius: 4rpx;
        display: flex;
        align-items: center;
        &::before {
          content: '\3000';
          display: block;
          width: 28rpx;
          height: 28rpx;
          background: url("https://file.y1b.cn/store/1-0/24424/662879b6af152.png") 0 0 / 100% 100% no-repeat;
          margin-right: 6rpx;
        }
      }
    }
  }
}
.order_btn {
  line-height: 88rpx;
  background: linear-gradient(135deg,#f2554d, #f04037);
  border-radius: 16rpx;
  margin-top: 48rpx;
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
}
.order_time {
  font-size: 26rpx;
  color: #999;
  line-height: 36rpx;
  margin-top: 32rpx;
  position: relative;
  z-index: 1;
  .cd_time-con {
    margin-left: 10rpx;
    .item {
      display: inline-block;
      color: #999;
      min-width: 30rpx;
    }
  }
}
.img_box{
  position: relative;
  font-size: 0;
  .bar_box{
    position: absolute;
    width: 750rpx;
    bottom: 0;
    left: 0;
    height: 200rpx;
    z-index: 1;
    // background: gray;
  }
}
</style>
