<template>
<!-- <canvas canvas-id="qrcode" :style="{width: size * 2 +'rpx', height: size * 2 + 'rpx'}"></canvas> -->
<view class="qrcode">
  <view v-for="(row, rowI) in modules" :key="rowI" style="display: flex;flex-direction: row;">
    <view v-for="(col, colI) in row" :key="colI">
      <view v-if="col.isBlack" class="black_box" :style="{'--size': codeSize + 'px'}"></view>
      <view class="white_box" v-else :style="{'--size': codeSize + 'px'}">
      </view>
    </view>
  </view>
</view>
</template>

<script>
import UQRCode from "./uqrcode.js";
import { mapGetters } from "vuex";
export default {
  props: {
    size: {
      type: Number,
      default: 200
    },
    isShow: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters(["userInfo", "vipObject"]),
    codeSize() {
      return this.size/37;
    }
  },
  data() {
    return {
      modules: []
    };
  },
  methods: {
    createCode(va) {
      // 获取uQRCode实例
      var qr = new UQRCode();
      // 设置二维码内容
      qr.data = va;
      // 设置二维码大小，必须与canvas设置的宽高一致
      qr.size = this.size;
      // 调用制作二维码方法
      qr.make();
      // 获取canvas上下文
      var canvasContext = uni.createCanvasContext("qrcode", this); // 如果是组件，this必须传入
      // 设置uQRCode实例的canvas上下文
      qr.canvasContext = canvasContext;
      this.modules = qr.modules;
      // 调用绘制方法将二维码图案绘制到canvas上
      qr.drawCanvas();
      this.$emit('drawFinish');
    },
  }
};
</script>

<style lang='scss'>
.qrcode{
  width: 100%;
  height: 100%;
}
.black_box{
  background: #000;
  width: var(--size);
  height: var(--size);
}
.white_box{
  background: #fff;
  width: var(--size);
  height: var(--size);
}
</style>