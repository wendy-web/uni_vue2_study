<template>
<van-popup
  :show="isShow"
  custom-style="background-color: transparent;overflow:visible;"
  :z-index="100"
  :catchtouchmove="true"
  @close="closeHandle"
>
  <view class="dia_cont">
    <image  class="finish_close" mode="aspectFit"
      src="https://file.y1b.cn/store/1-0/24124/65b0717ce9dcb.png"
      @click="closeHandle"></image>
    <view class="order_title">
      已下<text style="color: #F84842;">{{ freeEnterArr.have_order }}</text>单，确认收货 {{ freeEnterArr.complete_order }} 单
    </view>
    <scroll-view :scroll-y="true"
      class="order_list"
      @scrolltolower="scrollToLowerHandle"
    >
      <view class="list_item fl_center"
        v-for="(item, index) in freeOrderArr" :key="index"
        @click="couponDetailHandle(item)"
      >
        <view class="item_left box_fl">
          <van-image
            width="124rpx" height="124rpx"
            :src="item.goods_image"
            use-loading-slot radius="8rpx"
            class="item_left-img"
          ><van-loading slot="loading" type="spinner" size="20" vertical />
          </van-image>
          <view class="list_item-txt">顶{{ item.num }}单</view>
        </view>
        <view class="item_right fl_col_sp_bt">
          <view class="item_title txt_ov_ell1">{{ item.goods_name }}</view>
          <view class="fl_bet">
            <view class="item_price">{{ item.pay_amount }}</view>
            <view :class="['item_status', item.status == 4 ? 'active' : '']">{{ item.status_desc }}</view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</van-popup>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['freeEnterArr', 'freeOrderArr']),
  },
  data() {
    return {
    };
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    closeHandle() {
      this.$emit('close');
    },
    couponDetailHandle(item) {
    },
    scrollToLowerHandle() {
      this.$emit('scroll');
    }
  },
};
</script>

<style lang="scss" scoped>
@import '../static/animation.scss';
.dia_cont {
  position: relative;
  z-index: 0;
  width: 646rpx;
  background: #f1f2f4;
  border-radius: 40rpx;
  color: #333;
  padding: 0 12rpx 12rpx;
  box-sizing: border-box;
}
.finish_close{
  width: 72rpx;
  height: 72rpx;
  position: absolute;
  right: -20rpx;
  top: -102rpx;
  z-index: 1;
}
.order_title {
  font-size: 36rpx;
  text-align: center;
  line-height: 100rpx;
  font-weight: bold;
}
.award_img-box {
  width: 600rpx;
  height: 600rpx;
  margin: 0 auto;
}
.order_list {
  // margin: 0 12rpx 12rpx;
  background: #fff;
  border-radius: 36rpx;
  max-height: 642rpx;
}
.list_item {
  width: 100%;
  padding: 32rpx;
  box-sizing: border-box;
  &:not(:last-child) {
    // background: gray;
    .item_right::before {
      content: '\3000';
      position: absolute;
      width: 100%;
      height: 2rpx;
      background: #E9E9E9;
      left: 0;
      bottom: -32rpx;
    }
  }
  .item_left {
    width: 124rpx;
    height: 124rpx;
    border-radius: 12rpx;
    margin-right: 24rpx;
    flex: 0 0 124rpx;
    position: relative;
    overflow: hidden;
    .item_left-img{
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
  .item_right {
    flex: 1;
    width: 0;
    align-self: stretch;
    position: relative;
    .item_title{
      flex: 1;
      font-size: 28rpx;
      font-weight: 600;
      line-height: 40rpx;
    }
    .item_price{
      font-size: 32rpx;
      color: #e7331b;
      line-height: 34rpx;
      font-weight: bold;
      &::before {
        content: '￥';
        font-size: 24rpx;
      }
    }
    .item_status {
      font-size: 26rpx;
      color: #444;
      line-height: 36rpx;
      &.active {
        color: #aaa;
      }
    }
  }
}
</style>
