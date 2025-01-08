<template>
<van-popup
  :show="isShow"
  custom-style="overflow: visible;background: #fff;"
  round
  :z-index="100"
  :safe-area-inset-bottom="false"
  @close="closeHandle"
>
	<view class="cont_box">
    <image class="gray_close" :src="imgUrl+'/static/images/gray_close.png'" mode="scaleToFill" @click="closeHandle"></image>
    <view class="code_num fl_center">
      <block v-for="(item, index) in codes" :key="index">
        {{item}}<text v-if="index < codes.length - 1">,</text>
      </block>
    </view>
    <view>取餐码</view>
    <view class="order_code">
      <uQrcode :isShow="code_show" :size="200" ref="uQrcodeRef"></uQrcode>
    </view>
	</view>
</van-popup>
</template>

<script>
import uQrcode from '@/components/uQrcode/index.vue';
import { getImgUrl } from '@/utils/auth.js';
export default {
  name: "codeDia",
  components: {
    uQrcode
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    codes: {
      type: Array,
      default: []
    },
    qr_codes: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
			imgUrl: getImgUrl(),
      code_show: false
    }
  },
  watch: {
    isShow(newValue) {
      if(newValue) {
        const code = this.qr_codes[0];
        this.$nextTick(() => {
          this.$refs.uQrcodeRef && this.$refs.uQrcodeRef.createCode(code);
        });
      }
      setTimeout(() => {
        this.code_show = newValue;
      }, 100);
    }
  },
  computed: {
    qrOptions() {
      const code = this.qr_codes[0];
      return {
        code,// 生成二维码的值
        size: 400, // 400代表生成的二维码的宽高均为400rpx
      }
    }
  },
  methods: {
    closeHandle() {
      this.$emit('close');
    }
  }
}
</script>
<style scoped lang="scss">
.cont_box {
  width: 576rpx;
  background: #ffffff;
  border-radius: 24rpx;
  text-align: center;
  font-size: 28rpx;
  color: #999999;
  line-height: 40rpx;
  position: relative;
  z-index: 0;
  .gray_close {
    position: absolute;
    width: 30rpx;
    height: 32rpx;
    padding: 32rpx;
    top: 0;
    right: 0;
  }
  .code_num{
    font-size: 56rpx;
    color: #333333;
    line-height: 80rpx;
    padding-top: 40rpx;
  }
  .order_code{
    width: 400rpx;
    height: 400rpx;
    margin: 40rpx auto 72rpx;
    position: relative;
    z-index: 0;
    opacity: 1;
    &.active {
      opacity: 0;
    }
  }
}
</style>
