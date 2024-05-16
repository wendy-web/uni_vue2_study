<template>
<van-popup
  :show="isShow"
  custom-style="overflow:visible;"
  :z-index="100"
  :catchtouchmove="true"
  position="bottom"
  @close="closeHandle"
  :round="true"
>
  <van-area
    title="地区选择"
    :value="areaCode"
    :area-list="areaList"
    @cancel="closeHandle"
    @confirm="confirmHandle"
    @change="changeHandle"
    backgroundColor="transparent"
  />
</van-popup>
</template>
<script>
import areaList from '../static/area.js';
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    areaCode: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      areaList,
    };
  },
  methods: {
    confirmHandle(event) {
      this.$emit('confirm', event.detail.values);
    },
    closeHandle() {
      this.$emit('close');
    },
    changeHandle(event) {
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
  padding: 0 12rpx 28rpx;
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
  background: #fff;
  border-radius: 36rpx;
  overflow: hidden;
  padding-bottom: 40rpx;
}
.list_item {
  width: 100%;
  padding: 0 32rpx;
  box-sizing: border-box;
  margin-top: 20rpx;
  .item_left {
    width: 124rpx;
    border-radius: 12rpx;
    margin-right: 24rpx;
    font-size: 28rpx;
    flex: 0 0 124rpx;
    position: relative;
    overflow: hidden;
  }
  .item_right {
    flex: 1;
    width: 0;
    align-self: stretch;
    position: relative;
    &::before {
      content: '\3000';
      position: absolute;
      width: 100%;
      height: 2rpx;
      background: #E9E9E9;
      left: 0;
      bottom: 0;
      z-index: 1;
    }
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
.order_submit {
  width: 472rpx;
  line-height: 80rpx;
  background: #f84842;
  border-radius: 20rpx;
  font-size: 28rpx;
  text-align: center;
  color: #fff;
  margin: 28rpx auto 0;
}
</style>
