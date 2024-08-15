<template>
<view class="accelerate_box" id="freeAccelerateDom">
<view class="accelerate" >
  <view class="acc_title">
    加速福利专区<text class="acc_title-lab">以下入口下1单顶多单</text>
  </view>
  <view class="acc_list">
    <view class="acc_list-item fl_bet"
      v-for="(item, index) in list" :key="index"
      @click="goToAccelHandle(item.id)"
    >
      <view class="acc_list-left box_fl">
        <van-image
          width="64rpx" height="64rpx"
          use-loading-slot radius="8rpx" class="list_img"
          :src="item.img"
        ><van-loading slot="loading" type="spinner" size="20" vertical />
        </van-image>
        {{ item.title }}
      </view>
      <view  class="acc_list-right">去加速</view>
    </view>
  </view>
</view>
</view>
</template>
<script>
import { warpRectDom } from '@/utils/auth.js';
import { mapGetters } from "vuex";
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: []
    }
  },
  computed: {
    ...mapGetters(['freeEnterArr']),
  },
  data() {
    return {
    };
  },
  mounted() {
    this.$nextTick(()=>{
      setTimeout(() => this.domFun(), 1000);
    });
  },
  methods: {
    warpRectDom,
    goToAccelHandle(id) {
      const { active_id } = this.freeEnterArr;
      this.$go(`/pages/userCash/cash/accelerateList?id=${id}&active_id=${active_id}`);
    },
    domFun(){
      this.warpRectDom('freeAccelerateDom').then(res=> {
        this.$emit('freeAccelerateDomRef', res);
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.accelerate_box{
  overflow: hidden;
}
.accelerate {
  background: rgba(255,255,255,0.65);
  border: 3rpx solid #fff;
  border-radius: 32rpx;
  backdrop-filter: blur(12rpx);
  margin: 0 16rpx 32rpx;
  padding: 0 32rpx;
  box-sizing: border-box;
  color: #333;
  .acc_title {
    font-weight: bold;
    font-size: 32rpx;
    line-height: 44rpx;
    margin-top: 24rpx;
    .acc_title-lab{
      font-size: 26rpx;
      color: #999;
      line-height: 36rpx;
      margin-left: 12rpx;
    }
  }
}
.acc_list-item {
  padding: 24rpx 0;
  border-bottom: 2rpx solid transparent;
  font-size: 28rpx;
  line-height: 40rpx;
  font-weight: bold;
  &:not(:last-child) {
    border-color: #f1f1f1;
  }
  .list_img{
    margin-right: 12rpx;
  }
  .acc_list-right{
    padding: 10rpx 20rpx;
    background: #f84842;
    border-radius: 16rpx;
    font-size: 26rpx;
    color: #ffffff;
  }
}
</style>
