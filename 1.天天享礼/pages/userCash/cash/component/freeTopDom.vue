<template>
<view class="cash_top-box"  id="freeTopDom">
  <view :class="['cash_top', (!freeEnterArr.is_effective && (freeEnterPageStatus == 3)) ? 'active' : '']">
    <view class="cash_title">
      本页凑{{ freeEnterArr.order_num }}单，<text style="color: #F84842;">必得</text>所示奖品
    </view>
    <van-count-down
      @finish="countFinished"
      :time="remainTime"
      millisecond
      use-slot
      format="mm:ss"
      @change="onChangeHandle"
      style="--count-down-text-color:#333;--count-down-font-size:26rpx;"
      class="cash_time"
    >
      <view class="fl_center">
        <text class="item_lab">距结束</text>
        <text class="item">{{ timeData.days }}</text>天
        <text class="item">{{ timeData.hours }}</text>:
        <text class="item">{{ timeData.minutes }}</text>:
        <text class="item">{{ timeData.seconds }}</text>
      </view>
    </van-count-down>
    <view class="order_cont fl_bet">
      <view class="fl1">
        <view class="progress_title" v-if="notFinishNum">已下{{ freeEnterArr.have_order }}单,
          再凑<text style="color: #F84842;">{{ freeEnterArr.order_num - freeEnterArr.have_order }}</text>单</view>
        <view class="progress_title" v-else-if="freeEnterArr.complete_order < freeEnterArr.order_num">
         已下{{ freeEnterArr.have_order }}单，已确认收货<text style="color: #F84842;">{{ freeEnterArr.complete_order }}</text>单
        </view>
        <view class="progress_title" v-else>
          已确认收货{{ freeEnterArr.complete_order }}单，奖品
          <text v-if="freeEnterArr.logistics_company">已发货</text>
          <text v-else-if="freeEnterArr.delivery_time">待发货</text>
          <text v-else>待领取</text>
        </view>
        <view class="progress_num" :style="{'--width': progressNum + '' }"></view>
      </view>
      <van-image
        width="172rpx" height="172rpx"
        :src="freeEnterArr.gift_img"
        use-loading-slot radius="12rpx"
        class="banner_img"
        @click="showGiftImgHandle"
      ><van-loading slot="loading" type="spinner" size="20" vertical />
      </van-image>
    </view>

    <scroll-view
      class="scroll_list"
      scroll-x="true"
      v-if="!(!freeEnterArr.is_effective && (freeEnterPageStatus == 3))"
      :scroll-left="9999"
    >
      <view class="scroll_list-box">
        <view class="scroll_list-item"
          v-for="(item, index) in freeOrderArr" :key="index"
          @click="showFreeOrderHandle"
        >
          <van-image
            width="124rpx" height="124rpx"
            :src="item.goods_image"
            use-loading-slot radius="12rpx"
            class="banner_img"
          ><van-loading slot="loading" type="spinner" size="20" vertical />
          </van-image>
          <view class="list_item-txt" v-if="item.num > 1">本单顶{{ item.num }}单</view>
        </view>
        <block v-if="notFinishNum">
          <!-- <view class="scroll_list-last" v-if="freeEnterArr.order_money > 0" @click="addOrderHandle">
            实付需<view>满{{ freeEnterArr.order_money }}元</view>
          </view> -->
          <view class="not-order_money" @click="addOrderHandle"></view>
        </block>
      </view>
    </scroll-view>
    <!-- 直接进入到活动记录 -->
    <view class="is_get-btn" v-if="freeEnterArr.logistics_company" @click="goToActHandle">
      奖品已发货
    </view>
    <view class="is_get-btn time" v-else-if="freeEnterArr.delivery_time" @click="goToActHandle">
      奖品将在{{ freeEnterArr.delivery_time }}后发货
    </view>
    <view :class="['is_get-btn', !freeEnterArr.residue_day ? 'active' : '']" v-else-if="btnStatus" @click="getAwardHandle">
      立即领取奖品
      <view class="get_btn-day" v-if="freeEnterArr.residue_day_show">距领奖结束还剩{{ freeEnterArr.residue_day }}天</view>
    </view>
  </view>
</view>
</template>
<script>
import { warpRectDom } from '@/utils/auth.js';
import { mapActions, mapGetters } from "vuex";
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['freeEnterArr', 'freeOrderArr', 'freeEnterPageStatus']),
    progressNum() {
      const { order_num, have_order, complete_order } = this.freeEnterArr;
      let finishNum = (have_order >= order_num) ? complete_order : have_order;
      const lastOrder = order_num - finishNum;
      return ((lastOrder/order_num) * 100).toFixed(2) + '%';
    },
    notFinishNum() {
      return this.freeEnterArr.have_order < this.freeEnterArr.order_num;
    },
    btnStatus() {
      return (this.freeEnterArr.complete_order >= this.freeEnterArr.order_num);
    }
  },
  data() {
    return {
      remainTime: 0,
      timeData: {}
    };
  },
  watch: {
    'freeEnterArr.over_time': {
      handler: async function(newValue) {
        if (!newValue) return;
        const cur_date = new Date().getTime();
        const over_time = new Date(newValue.replace(new RegExp(/-/gm), '/')).getTime(); // 开始时间戳
        this.remainTime = over_time - cur_date;
      },
      deep: true,
      immediate: true
    },
  },
  mounted() {
    warpRectDom,
    this.$nextTick(()=>{
      setTimeout(() => this.domFun(), 1000);
    });
  },
  methods: {
    ...mapActions({
			initFreeEnterPage: 'cash/initFreeEnterPage',
    }),
    goToActHandle() {
      this.$emit('goToAct');
    },
    getAwardHandle() {
      this.$emit('getAward');
    },
    showFreeOrderHandle() {
      this.$emit('showFreeOrder');
    },
    countFinished() {
      if(this.remainTime > 0) this.initFreeEnterPage();
    },
    addOrderHandle() {
      this.$emit('addOrder');
    },
    onChangeHandle(event) {
      let {
        hours,
        minutes,
        seconds,
        milliseconds,
        days
      } = event.detail;
      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      days = days < 10 ? '0' + days : days;
      milliseconds = Math.floor(milliseconds / 10);
      this.timeData = {
        hours,
        minutes,
        seconds,
        milliseconds,
        days
      }
    },
    showGiftImgHandle() {
      this.$emit('showGiftImg');
    },
    domFun(){
      this.warpRectDom('freeTopDom').then(res=> {
        this.$emit('freeTopDomRef', res);
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.cash_top-box {
  overflow: hidden;
}
.cash_top {
  background: rgba(255,255,255,0.65);
  border: 3rpx solid #ffffff;
  border-radius: 32rpx;
  backdrop-filter: blur(12rpx);
  margin: 0 16rpx 32rpx;
  padding: 32rpx;
  box-sizing: border-box;
  position: relative;
  &.active {
    &::before {
      content: '\3000';
      position: absolute;
      top: 0;
      right: 0;
      width: 270rpx;
      height: 236rpx;
      background: url('https://test-file.y1b.cn/store/1-0/2432/65e2c2e5f0a6b.png') 0 0 / cover;
      z-index: -1;
      opacity: .5;
    }
    .cash_title::after {
      content: '(未达标)';
      font-size: 28rpx;
      color: #333;
    }
  }
  .cash_title {
    font-size: 40rpx;
    color: #9d4218;
    line-height: 72rpx;
    text-align: center;
    font-weight: bold;
  }
}
.cash_time {
  display: block;
  margin: 14rpx auto 0;
  .van-count-down{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .item {
    width: 40rpx;
    height: 40rpx;
    background: #333;
    border-radius: 8rpx;
    text-align: center;
    line-height: 40rpx;
    color: #fff;
    margin: 0 8rpx;
    display: inline-block;
    font-size: 24rpx;
  }
  .item_lab {
    margin-right: 14rpx;
    color: #333;
    font-size: 26rpx;
  }
}
.order_cont {
  margin-top: 24rpx;
  .progress_title {
    padding: 4rpx 20rpx 12rpx;
    font-size: 26rpx;
    color: #9c4219;
    line-height: 36rpx;
    font-weight: bold;
    display: inline-block;
    position: relative;
    z-index: 0;
    &::before {
      content: '\3000';
      background: url("https://test-file.y1b.cn/store/1-0/24223/65d800ef76545.png") 0 0 / 100% 100%;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
  }
  .progress_num {
    margin-right: 24rpx;
    height: 24rpx;
    margin-top: 12rpx;
    background: url("https://test-file.y1b.cn/store/1-0/24223/65d801bc7dd37.png")  0 0 / 100% 100%;
    border-radius: 10rpx;
    overflow: hidden;
    position: relative;
    z-index: 0;
    &::before {
      content: '\3000';
      width: var(--width) ;
      height: 100%;
      position: absolute;
      right: 0;
      background: rgba(255,255,255,0.60);
    }
  }
}
.scroll_list{
  white-space: nowrap;
	width: 100%;
  height: 124rpx;
  font-size: 28rpx;
  margin-top: 26rpx;
  .scroll_list-box {
    display: flex;
    flex-wrap: nowrap;
    height: 100%;
  }
  .scroll_list-item {
		width: 124rpx;
    height: 124rpx;
    flex: 0 0 124rpx;
		text-align: center;
    margin-right: 12rpx;
    border-radius: 12rpx;
    position: relative;
    overflow: hidden;
    .banner_img {
      width: 100%;
      height: 100%;
    }
    .list_item-txt{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      font-size: 22rpx;
      text-align: center;
      color: #ffffff;
      line-height: 36rpx;
      background: rgba(0,0,0,0.75);
    }
	}
  .scroll_list-last {
    width: 246rpx;
    flex: 0 0 246rpx;
    height: 100%;
    position: relative;
    font-size: 28rpx;
    z-index: 0;
    padding: 12rpx 0 12rpx 20rpx;
    font-weight: bold;
    color: #fff;
    line-height: 50rpx;
    white-space: normal;
    box-sizing: border-box;
    &::before {
      content: '\3000';
      background: url("https://test-file.y1b.cn/store/1-0/24223/65d80716aad70.png") 0 0 / 100% 100%;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
  }
  .not-order_money {
    width: 124rpx;
    height: 124rpx;
    position: relative;
    &::before {
      content: '\3000';
      background: url("https://test-file.y1b.cn/store/1-0/24312/65f01817f0cdf.png") 0 0 / 100% 100%;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
  }
}
.is_get-btn {
  width: 442rpx;
  height: 112rpx;
  display: block;
  margin: 40rpx auto 0;
  background: url('https://test-file.y1b.cn/store/1-0/2434/65e56d5d82381.png') 0 0 / cover;
  text-align: center;
  color: #fff;
  position: relative;
  line-height: 100rpx;
  font-size: 44rpx;
  font-weight: bold;
  &.time {
    font-size: 30rpx;
  }
  &.active {
    background: url('https://test-file.y1b.cn/store/1-0/2434/65e571b189f5b.png') 0 0 / cover;
    color: rgba($color: #fff, $alpha: .5);
  }
  .get_btn-day {
    position: absolute;
    line-height: 46rpx;
    right: 0;
    top: -23rpx;
    color: #9C4219;
    font-size: 24rpx;
    background: rgba($color: #FCE6C4, $alpha: 1);
    padding: 0 20rpx;
    border-radius: 20rpx;
  }
}
</style>
