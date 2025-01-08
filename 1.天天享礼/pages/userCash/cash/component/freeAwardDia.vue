<template>
<van-popup
  :show="isShow"
  custom-style="background-color: transparent;overflow:visible;"
  :z-index="100"
  :catchtouchmove="true"
  @close="closeHandle"
>
  <view class="dia_cont ani_active">
    <view class="cont_title">真厉害，成功凑了{{ freeEnterArr.have_order}}单</view>
    <view class="get_cash-num">
      <van-image
        width="296rpx"
        height="296rpx"
        :src="freeAwardObj.goods_image"
        use-loading-slot
        class="banner_img"
        radius="44rpx"
      ><van-loading slot="loading" type="spinner" size="20" vertical />
      </van-image>
      <view class="cash_price">{{ freeAwardObj.pay_amount }}</view>
    </view>
    <view class="cash_lab">近期购买：{{ freeAwardObj.goods_name }}</view>
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
    },
    freeAwardObj: {
      type: Object,
      default: {}
    }
  },
  computed: {
    ...mapGetters(['freeEnterArr']),
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
    }
  },
};
</script>

<style lang="scss" scoped>
@import '../static/animation.scss';
.dia_cont {
  width: 750rpx;
  position: relative;
  z-index: 0;
}
.award_img-box {
  width: 600rpx;
  height: 600rpx;
  margin: 0 auto;
}
.get_cash-num{
  width: 304rpx;
  height: 304rpx;
  background: linear-gradient(275deg,#ee473e 54%, #f77709 86%);
  border-radius: 44rpx;
  position: relative;
  margin: 0 auto;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  &::before {
    content: '\3000';
    width: 750rpx;
    height: 764rpx;
    background: url("https://file.y1b.cn/store/1-0/24124/65b0684d00ceb.png") 0 0 / 100% 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
  }
  .cash_price {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    line-height: 56rpx;
    font-size: 32rpx;
    text-align: center;
    color: #fff8e1;
    z-index: 0;
    font-weight: bold;
    &::before {
      content: '￥';
      font-size: 24rpx;
    }
    &::after {
      content: '\3000';
      width: 100%;
      height: 100%;
      background: url("https://test-file.y1b.cn/store/1-0/24226/65dbed9b8b9b8.png") 0 0 / 100% 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: -1;
    }
  }
  .banner_img {
    width: 296rpx;
    height: 296rpx;
  }
}
.cash_lab {
  font-size: 32rpx;
  text-align: center;
  color: #fff8e1;
  line-height: 44rpx;
  width: 568rpx;
  margin: 28rpx auto 0;
}
.cont_title{
  font-size: 40rpx;
  text-align: center;
  color: #fff8e1;
  line-height: 56rpx;
  text-shadow: 2rpx 2rpx 8rpx #fff;
  text-align: center;
  font-weight: 600;
  width: 750rpx;
  box-sizing: border-box;
  position: absolute;
  left: 50%;
  top: -98rpx;
  transform: translateX(-50%);
  padding: 0 72rpx;
}
.ani_active {
  opacity: 0;
  animation: cashFinishAni .5s linear .2s forwards;
}
</style>
