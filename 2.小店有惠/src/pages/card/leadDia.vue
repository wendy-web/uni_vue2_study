<template>
<van-popup
  :show="isShow"
  round
  custom-style="background: transparent;overflow:visible;"
  :root-portal="true"
  :z-index="100"
  overlay-style="background: rgba(0, 0, 0, 0.9);"
  :catchtouchmove="true"
>
  <view class="cont_lead">
    <view :class="{'cont_title':true, 'active': !currIndex}">团长赚钱只需 3 步</view>
    <view class="cont_step">第  <text style="color: #F04037;padding: 0 20rpx;">{{ currIndex + 1 }}</text>  步</view>
    <swiper
      class="swiper_box"
      @change="swiperChange"
      :autoplay="false"
      :interval="500"
      :duration="duration"
      :current="currIndex"
    >
      <swiper-item class="swiper-item"
        v-for="(item,index) in stepImg" :key="index"
      >
        <van-image
          width="630rpx"
          height="100%"
          :src="item"
          use-loading-slot
        ><van-loading slot="loading" type="spinner" size="20" vertical />
        </van-image>
      </swiper-item>
    </swiper>
    <view class="spot_box fl_center">
      <view :class="['spot_item', currIndex==index? 'active' : '']"
        v-for="(item,index) in stepImg" :key="index"
      ></view>
    </view>
    <view class="spot_box fl_ard">
      <view class="lead_btn btn_left" v-if="currIndex" @click="subHandle">上一步</view>
      <view class="lead_btn btn_right" @click="nextHandle(false)">{{ (currIndex >= stepImg.length - 1 )? '开始赚钱' : '下一步' }}</view>
    </view>
  </view>
  <view class="just_btn" @click="nextHandle(true)">跳过</view>
</van-popup>
</template>

<script>
import { setShowLeadStep } from "@/utils/auth.js";
export default {
  name: "leadDia",
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    currIndex: {
      type: Number,
      default: 0
    }
  },
  watch: {
    isShow(newValue) {
      if(!newValue) return;
      this.duration = 500;
    }
  },
  data() {
    return {
      stepImg: [
        'https://file.y1b.cn/store/1-0/231229/658e84925c274.png',
        'https://file.y1b.cn/store/1-0/231229/658e84ba82d84.png',
        'https://file.y1b.cn/store/1-0/23122/656ada158200d.png'
      ],
      duration: 500
    }
  },
  methods: {
    swiperChange(event){
      this.$emit('setIndex', event.detail.current);
		},
    subHandle() {
      this.$emit('setIndex', this.currIndex - 1);
    },
    nextHandle(isJust = false) {
      if((this.currIndex >= this.stepImg.length - 1) || isJust) {
        setShowLeadStep(true);
        this.$emit('close');
        this.duration = 0;
        return;
      }
      this.$emit('setIndex', this.currIndex + 1);
    }
  }
};
</script>
<style scoped lang="scss">
.cont_lead{
  color: #fff;
  width: 750rpx;
  text-align: center;
  .cont_title{
    font-size: 48rpx;;
    line-height: 66rpx;
    letter-spacing: 0.07rpx;
    margin-bottom: 24rpx;
    opacity: 0;
    &.active{
      opacity: 1;
    }
  }
  .cont_step{
    font-size: 40rpx;
    color: rgba(255,255,255,0.70);
    line-height: 56rpx;
    margin-bottom: 40rpx;
  }
}
.swiper_box{
	width: 100%;
  height: 532rpx;
  .swiper-item{
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
}
.spot_box {
	margin: 64rpx 23rpx 0;
	.spot_item {
		width: 20rpx;
		height: 8rpx;
		background: #9F9FA0;
		border-radius: 12rpx;
		margin: 0 4rpx;
		&.active {
			width: 40rpx;
			background: #F04037;
		}
	}
}
.lead_btn{
  width: 300rpx;
  height: 88rpx;
  background: #f04037;
  border-radius: 132rpx;
  font-size: 32rpx;
  text-align: center;
  color: #fff;
  line-height: 88rpx;
  border: 1rpx solid #f04037;
  box-sizing: border-box;
  &.btn_left{
    background: rgba(255,255,255,0.10);
    border-color: rgba(255,255,255,0.70);
  }
}
.just_btn {
  width: 144rpx;
  line-height: 68rpx;
  background: rgba(255,255,255,0.14);
  border: 1rpx solid rgba(255,255,255,0.60);
  border-radius: 36rpx;
  font-size: 32rpx;
  text-align: center;
  color: #ffffff;
  position: absolute;
  right: 56rpx;
  bottom: -168rpx;
}
</style>
